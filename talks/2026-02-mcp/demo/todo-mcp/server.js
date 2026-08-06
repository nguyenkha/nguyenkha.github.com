// todo-mcp — a minimal MCP server over stdio.
// 3 tools + 1 resource + 1 prompt, in-memory state.
// Talk: https://kha.do/talks/2026-02-mcp/

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({ name: "todo", version: "1.0.0" });
const tasks = [];

// ---- Tools ----------------------------------------------------------------

server.registerTool(
  "add_task",
  {
    description: "Add a task to the todo list",
    inputSchema: { text: z.string().describe("The task to add") },
  },
  async ({ text }) => {
    tasks.push({ id: tasks.length + 1, text, done: false });
    return {
      content: [{ type: "text", text: `Added #${tasks.length}: ${text}` }],
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
    const t = tasks.find((t) => t.id === id);
    if (!t) {
      return {
        content: [{ type: "text", text: `No task #${id}` }],
        isError: true,
      };
    }
    t.done = true;
    return { content: [{ type: "text", text: `Completed #${id}: ${t.text}` }] };
  }
);

// ---- Resource -------------------------------------------------------------

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
        text: tasks.map((t) => `[${t.done ? "x" : " "}] ${t.text}`).join("\n"),
      },
    ],
  })
);

// ---- Prompt ---------------------------------------------------------------

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

// ---- Start (stdio) --------------------------------------------------------

await server.connect(new StdioServerTransport());
console.error("todo server ready"); // stderr, NOT stdout!
