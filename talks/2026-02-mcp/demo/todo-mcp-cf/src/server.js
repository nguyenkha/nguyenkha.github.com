// todo-mcp-cf — the todo MCP server on Cloudflare Workers, state in KV.
// Chapter 3 of the state lesson: the Worker instance is ephemeral, so
// in-memory state cannot be trusted — every tool call reads/writes KV.
// Talk: https://kha.do/talks/2026-02-mcp/

import { McpServer } from "@modelcontextprotocol/server";
import { createMcpHandler } from "agents/mcp/server";
import { z } from "zod";

const KEY = "tasks";

async function loadTasks(env) {
  return JSON.parse((await env.TODO_KV.get(KEY)) ?? "[]");
}

async function saveTasks(env, tasks) {
  await env.TODO_KV.put(KEY, JSON.stringify(tasks));
}

// Core operations — used by BOTH the MCP tools and the REST API below.
async function addTask(env, text) {
  const tasks = await loadTasks(env);
  const task = { id: (tasks.at(-1)?.id ?? 0) + 1, text, done: false };
  tasks.push(task);
  await saveTasks(env, tasks);
  return task;
}

async function completeTask(env, id) {
  const tasks = await loadTasks(env);
  const t = tasks.find((t) => t.id === id);
  if (!t) return null;
  t.done = true;
  await saveTasks(env, tasks);
  return t;
}

function createServer(env) {
  const server = new McpServer({ name: "todo-cf", version: "1.0.0" });

  server.registerTool(
    "add_task",
    {
      description: "Add a task to the todo list",
      inputSchema: { text: z.string().describe("The task to add") },
    },
    async ({ text }) => {
      const task = await addTask(env, text);
      return {
        content: [{ type: "text", text: `Added #${task.id}: ${text}` }],
      };
    }
  );

  server.registerTool(
    "list_tasks",
    {
      description: "List all tasks with their status",
      inputSchema: {},
    },
    async () => {
      const tasks = await loadTasks(env);
      return {
        content: [
          {
            type: "text",
            text: tasks.length
              ? tasks
                  .map((t) => `${t.id} ${t.done ? "✅" : "⬜"} ${t.text}`)
                  .join("\n")
              : "No tasks yet.",
          },
        ],
      };
    }
  );

  server.registerTool(
    "complete_task",
    {
      description: "Mark a task as done",
      inputSchema: { id: z.number().describe("The task id to complete") },
    },
    async ({ id }) => {
      const t = await completeTask(env, id);
      if (!t) {
        return {
          content: [{ type: "text", text: `No task #${id}` }],
          isError: true,
        };
      }
      return {
        content: [{ type: "text", text: `Completed #${id}: ${t.text}` }],
      };
    }
  );

  return server;
}

// ---- Auth — the "level 1" bearer-key guard from the talk ------------------
// Enforced ONLY when the MCP_KEY secret exists (wrangler secret put MCP_KEY).
// Delete the secret to reopen the server for open class demos.

async function authorized(request, env) {
  if (!env.MCP_KEY) return true; // no key configured → open (demo mode)
  const token = (request.headers.get("authorization") ?? "").replace(
    /^Bearer\s+/i,
    ""
  );
  if (!token) return false;
  // Compare SHA-256 digests (equal length) with a timing-safe comparison.
  const enc = new TextEncoder();
  const [a, b] = await Promise.all([
    crypto.subtle.digest("SHA-256", enc.encode(token)),
    crypto.subtle.digest("SHA-256", enc.encode(env.MCP_KEY)),
  ]);
  return crypto.subtle.timingSafeEqual(a, b);
}

function unauthorized() {
  return Response.json(
    { error: "unauthorized" },
    { status: 401, headers: { "WWW-Authenticate": "Bearer" } }
  );
}

// ---- REST API — the same KV state through a second, human-friendly door ---
// (3 endpoints mirroring the 3 MCP tools; returns null if no route matches)

async function handleRest(request, env) {
  const { pathname } = new URL(request.url);

  if (request.method === "GET" && pathname === "/api/tasks") {
    return Response.json(await loadTasks(env));
  }

  if (request.method === "POST" && pathname === "/api/tasks") {
    let text;
    try {
      ({ text } = await request.json());
    } catch {}
    if (typeof text !== "string" || !text.trim()) {
      return Response.json(
        { error: "body must be { text: string }" },
        { status: 400 }
      );
    }
    return Response.json(await addTask(env, text.trim()), { status: 201 });
  }

  const m = pathname.match(/^\/api\/tasks\/(\d+)\/complete$/);
  if (request.method === "POST" && m) {
    const t = await completeTask(env, Number(m[1]));
    if (!t) {
      return Response.json({ error: `No task #${m[1]}` }, { status: 404 });
    }
    return Response.json(t);
  }

  return null;
}

export default {
  async fetch(request, env, ctx) {
    const { pathname } = new URL(request.url);
    if (pathname === "/" || pathname === "") {
      return new Response(
        "todo-mcp-cf — MCP endpoint at /mcp · REST at /api/tasks\n" +
          (env.MCP_KEY ? "Auth: Bearer key required.\n" : "") +
          "Demo for https://kha.do/talks/2026-02-mcp/\n",
        { headers: { "content-type": "text/plain" } }
      );
    }
    if (!(await authorized(request, env))) return unauthorized();
    if (pathname.startsWith("/api/")) {
      const res = await handleRest(request, env);
      if (res) return res;
      return Response.json({ error: "not found" }, { status: 404 });
    }
    return createMcpHandler(() => createServer(env))(request, env, ctx);
  },
};
