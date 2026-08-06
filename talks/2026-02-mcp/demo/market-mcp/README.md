# market-mcp

An MCP server (**stdio**) that wraps a real Vietnamese financial-market API —
demo for the talk
[MCP — Plug Your Agent Into Everything](https://kha.do/talks/2026-02-mcp/) (FIT-HCMUS).

**The hook:** an LLM cannot know today's gold price or USD rate (knowledge
cutoff, session 1). Ask Claude *"giá vàng SJC hôm nay?"* without this server —
it can't answer. Plug it in — one thin adapter over an existing REST API —
and it can. **MCP = reach.**

Upstream: `https://api-cf.kha.do/public` (OKX USDT · VCB/TCB/VPBank forex ·
SJC/ring/DOJI gold · Visa/MasterCard rates), cached 60 s.

| Tool | What it returns |
| --- | --- |
| `get_gold_price` | SJC / ring / DOJI, VND per tael |
| `get_fx_rate { currency }` | buy/sell across VCB · TCB · VPBank; USD also gets open market, USDT (OKX), Visa/MasterCard |
| `list_currencies` | which codes each bank quotes |

## Run

```bash
npm install
npm run inspect        # test in the MCP Inspector first

claude mcp add market -- node /absolute/path/to/server.js
claude
```

## Asks to try

- *Giá vàng SJC hôm nay bao nhiêu?*
- *1,000 USD đổi được bao nhiêu VND ở VCB? So với chợ đen chênh bao nhiêu?*
- *Mình cần mua 500 EUR, ngân hàng nào đang bán rẻ nhất?*
- *Quẹt thẻ Visa 100 USD thì mất bao nhiêu VND, so với đổi ở TCB?*

The last two are the money demos: the model calls the tool, then **does the
comparison math and reasoning itself** — API gives data, model gives analysis.

## Teaching notes

- The whole server is one `fetch` + three formatters — a *thin adapter*.
  Wrapping an API you already use is the most common real-world MCP server.
- Error path: unknown currency returns `isError` with a hint pointing at
  `list_currencies` — the model reads it and recovers on its own.
- Rates/prices come from a demo aggregation service — don't trade on them.
