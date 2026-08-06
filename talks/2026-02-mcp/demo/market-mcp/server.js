// market-mcp — an MCP server (stdio) wrapping a real finance API.
// The point: an LLM cannot know today's gold price or USD rate —
// one thin MCP adapter over an existing REST API gives it that reach.
// Talk: https://kha.do/talks/2026-02-mcp/

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const API = "https://api-cf.kha.do/public";
const BANKS = ["vcb", "tcb", "vpbank"];

// One upstream call feeds every tool; cache 60 s to be polite.
let cache = { at: 0, data: null };
async function market() {
  if (Date.now() - cache.at > 60_000) {
    const res = await fetch(API);
    if (!res.ok) throw new Error(`upstream returned ${res.status}`);
    cache = { at: Date.now(), data: await res.json() };
  }
  return cache.data;
}

const vnd = (n) => Number(n).toLocaleString("en-US");
const ok = (text) => ({ content: [{ type: "text", text }] });
const err = (text) => ({ content: [{ type: "text", text }], isError: true });

const server = new McpServer({ name: "market", version: "1.0.0" });

server.registerTool(
  "get_gold_price",
  {
    description:
      "Get today's gold prices in Vietnam (VND per tael): SJC bar, plain ring, DOJI",
    inputSchema: {},
  },
  async () => {
    const { gold, cachedAt } = await market();
    const lines = Object.entries(gold).map(
      ([name, p]) =>
        `${name.toUpperCase().padEnd(5)} buy ${vnd(p.buy)} · sell ${vnd(p.sell)}`
    );
    return ok(`Gold (VND/tael, as of ${cachedAt}):\n${lines.join("\n")}`);
  }
);

server.registerTool(
  "get_fx_rate",
  {
    description:
      "Get a currency's buy/sell rate in VND across Vietnamese banks " +
      "(VCB, TCB, VPBank). For USD also includes the open market, " +
      "USDT (OKX) and Visa/MasterCard rates.",
    inputSchema: {
      currency: z
        .string()
        .describe("ISO currency code, e.g. USD, EUR, JPY, SGD"),
    },
  },
  async ({ currency }) => {
    const code = currency.trim().toUpperCase();
    const data = await market();
    const lines = [];
    for (const bank of BANKS) {
      const r = data[bank]?.[code];
      if (r) {
        lines.push(
          `${bank.toUpperCase().padEnd(7)} buy ${vnd(r.buy)} · sell ${vnd(r.sell)}`
        );
      }
    }
    if (code === "USD") {
      const m = data.marketUSD;
      lines.push(`MARKET  buy ${vnd(m.buy)} · sell ${vnd(m.sell)}`);
      lines.push(`OKX     USDT→VND ${vnd(data.okx.USDTVND)}`);
      lines.push(`VISA    ${vnd(Math.round(data.visa.USDVND))} · MASTERCARD ${vnd(Math.round(data.masterCard.USDVND))}`);
    }
    if (!lines.length) {
      return err(
        `No rate for "${code}". Try list_currencies to see what's available.`
      );
    }
    return ok(`${code} → VND (as of ${data.cachedAt}):\n${lines.join("\n")}`);
  }
);

server.registerTool(
  "list_currencies",
  {
    description: "List which currencies each bank quotes",
    inputSchema: {},
  },
  async () => {
    const data = await market();
    const lines = BANKS.map(
      (b) => `${b.toUpperCase().padEnd(7)} ${Object.keys(data[b]).join(" ")}`
    );
    return ok(lines.join("\n"));
  }
);

await server.connect(new StdioServerTransport());
console.error("market server ready"); // stderr, NOT stdout!
