// todo-mcp-http — the same todo server, served over Streamable HTTP.
// ONE process, MANY clients: unlike stdio (one process per host),
// every connected client shares the same in-memory todo list.
// Talk: https://kha.do/talks/2026-02-mcp/

import express from "express";
import { randomUUID } from "node:crypto";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

const PORT = process.env.PORT || 3001;

// Shared state — module-level, so ALL sessions see the same list.
const tasks = [];

// Core operations — used by BOTH the MCP tools and the REST API below.
function addTask(text) {
  const task = { id: (tasks.at(-1)?.id ?? 0) + 1, text, done: false };
  tasks.push(task);
  return task;
}

function completeTask(id) {
  const t = tasks.find((t) => t.id === id);
  if (t) t.done = true;
  return t;
}

// Each session gets its own McpServer instance, but they all close over `tasks`.
function buildServer() {
  const server = new McpServer({ name: "todo-http", version: "1.0.0" });

  server.registerTool(
    "add_task",
    {
      description: "Add a task to the todo list",
      inputSchema: { text: z.string().describe("The task to add") },
    },
    async ({ text }) => {
      const task = addTask(text);
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
    async () => ({
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
    })
  );

  server.registerTool(
    "complete_task",
    {
      description: "Mark a task as done",
      inputSchema: { id: z.number().describe("The task id to complete") },
    },
    async ({ id }) => {
      const t = completeTask(id);
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

  server.registerResource(
    "todo-list",
    "todo://list",
    {
      description: "The current todo list",
      mimeType: "text/plain",
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          text: tasks
            .map((t) => `[${t.done ? "x" : " "}] ${t.text}`)
            .join("\n"),
        },
      ],
    })
  );

  server.registerPrompt(
    "plan_my_day",
    {
      description: "Plan the day from open tasks",
      argsSchema: {},
    },
    () => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: "Read my todo list and propose a realistic plan for today.",
          },
        },
      ],
    })
  );

  return server;
}

// ---- HTTP plumbing --------------------------------------------------------

const app = express();
app.use(express.json());

// ---- REST API — the same state through a second, human-friendly door ------
// (3 endpoints mirroring the 3 MCP tools)

app.get("/api/tasks", (req, res) => res.json(tasks));

app.post("/api/tasks", (req, res) => {
  const text = req.body?.text;
  if (typeof text !== "string" || !text.trim()) {
    return res.status(400).json({ error: "body must be { text: string }" });
  }
  res.status(201).json(addTask(text.trim()));
});

app.post("/api/tasks/:id/complete", (req, res) => {
  const t = completeTask(Number(req.params.id));
  if (!t) return res.status(404).json({ error: `No task #${req.params.id}` });
  res.json(t);
});

// One transport per session, keyed by the Mcp-Session-Id header.
const transports = {};

app.post("/mcp", async (req, res) => {
  const sessionId = req.headers["mcp-session-id"];
  let transport = sessionId && transports[sessionId];

  if (!transport) {
    if (sessionId || !isInitializeRequest(req.body)) {
      res.status(400).json({
        jsonrpc: "2.0",
        error: { code: -32000, message: "Bad Request: no valid session" },
        id: null,
      });
      return;
    }
    // New client: create a session + its own server instance.
    transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
      onsessioninitialized: (sid) => {
        transports[sid] = transport;
        console.log(`session started: ${sid}`);
      },
    });
    transport.onclose = () => {
      if (transport.sessionId) delete transports[transport.sessionId];
    };
    await buildServer().connect(transport);
  }

  await transport.handleRequest(req, res, req.body);
});

// GET = server→client notification stream · DELETE = end the session
const handleSessionRequest = async (req, res) => {
  const transport = transports[req.headers["mcp-session-id"]];
  if (!transport) {
    res.status(400).send("Invalid or missing session ID");
    return;
  }
  await transport.handleRequest(req, res);
};
app.get("/mcp", handleSessionRequest);
app.delete("/mcp", handleSessionRequest);

app.listen(PORT, () => {
  console.log(`todo-http MCP server → http://localhost:${PORT}/mcp`);
});
