# todo-mcp-cf

The todo MCP server deployed to **Cloudflare Workers**, state in **KV** —
chapter 3 of the state lesson from the talk
[MCP — Plug Your Agent Into Everything](https://kha.do/talks/2026-02-mcp/) (FIT-HCMUS).

Live at: **`https://todo.kha.do/mcp`** (Streamable HTTP)
· REST API at **`https://todo.kha.do/api/tasks`**

Tools: `add_task` · `list_tasks` · `complete_task`.

## The state lesson, complete

| | stdio (`todo-mcp`) | HTTP local (`todo-mcp-http`) | Workers + KV (this) |
| --- | --- | --- | --- |
| Process | one per host | one, you manage it | serverless — instances come & go |
| In-memory state | per host session | shared until you stop it | **cannot be trusted at all** |
| Where state lives | RAM | RAM | **KV** (external storage) |
| Survives restart | no | no | **yes** |

On Workers the runtime may spin instances up/down per request, so every tool
call does read-KV → mutate → write-KV. That's why this variant is built with
`createMcpHandler()` in **stateless** mode (no `Mcp-Session-Id` — each request
stands alone; the tasks live in KV, not in the session).

## Stack

- [`agents`](https://www.npmjs.com/package/agents) SDK → `createMcpHandler` from `agents/mcp/server`
  (the current recommended approach — `McpAgent` is deprecated)
- `@modelcontextprotocol/server` v2 + zod v4
- Wrangler with a KV binding (`TODO_KV`) and a custom domain route

## Develop locally

```bash
npm install
npm start          # wrangler dev → http://localhost:8787/mcp (local simulated KV)
```

## Deploy

```bash
npx wrangler login                          # once
npx wrangler kv namespace create TODO_KV    # once — put the id in wrangler.jsonc
npm run deploy
```

The `routes` entry in `wrangler.jsonc` binds the custom domain
(`todo.kha.do`) — the zone must be on your Cloudflare account. Delete the
`routes` block to deploy on the default `*.workers.dev` URL instead.

## Connect

```bash
# Claude Code
claude mcp add --transport http todo-cf https://todo.kha.do/mcp

# MCP Inspector: choose "Streamable HTTP", URL https://todo.kha.do/mcp
```

**claude.ai web** (the payoff): Settings → Connectors → *Add custom
connector* → `https://todo.kha.do/mcp`. A public URL is exactly what web
Claude requires — this closes the stdio-vs-remote loop from the talk.

## REST API — the same KV state, a second door

Three endpoints mirroring the three MCP tools:

```bash
curl https://todo.kha.do/api/tasks                            # list
curl -X POST https://todo.kha.do/api/tasks \
  -H 'Content-Type: application/json' -d '{"text":"hello"}'   # add → 201
curl -X POST https://todo.kha.do/api/tasks/1/complete         # complete
```

Add via REST, then ask Claude (connected over MCP) to list — same list.
Both doors call the same `addTask` / `completeTask` helpers over KV.

## Caveats (by design, for teaching)

- **No auth**: anyone with the URL can read/write the list. Real remote
  servers add OAuth (`workers-oauth-provider`) — left as an exercise.
- **Races**: read-modify-write on one KV key; two simultaneous writes can
  drop one. Durable Objects or D1 fix this.
- **KV is eventually consistent** across edge locations — fine for a demo,
  wrong for a bank.
- Zone security (bot protection) may 403 unusual HTTP clients; real MCP
  hosts and curl pass fine.

Reset the list:

```bash
npx wrangler kv key delete tasks --binding TODO_KV --remote
```
