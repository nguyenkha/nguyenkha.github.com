# skills demo — daily-standup

The skill from Part 4 of the talk
[MCP — Plug Your Agent Into Everything](https://kha.do/talks/2026-02-mcp/) (FIT-HCMUS):
a folder with one `SKILL.md`. It **composes** with the todo MCP server —
the skill supplies the process, MCP supplies the reach.

## Install

Copy the folder into a project (or your user scope):

```bash
# project scope — shared with the team via git
mkdir -p .claude/skills
cp -r daily-standup .claude/skills/

# or personal scope — all your projects
cp -r daily-standup ~/.claude/skills/
```

Have the todo server connected (any variant works):

```bash
claude mcp add --transport http todo-cf https://todo.kha.do/mcp
```

Then start a **new** session: `claude`.

## Trigger it — two ways

1. **Naturally** — say `standup time` or `what's on today?`
   The request matches the skill's `description`, so Claude loads
   `SKILL.md` automatically and follows its steps.
2. **Explicitly** — type `/daily-standup`.

Either way, watch it call `todo · list_tasks` (reach from MCP) and answer in
exactly three sections, under 10 lines (process from the skill) — content the
user never asked for out loud.

## If it doesn't auto-trigger

- Skills are picked up when a session **starts** — create the file first,
  then run `claude`.
- The `description` must say **when** to use the skill ("Use when I ask for
  a standup…"), not just what it is ("a standup skill"). Sharpen it and
  restart.

## Beyond Claude Code

The same folder works in claude.ai / Claude Desktop (Settings → Features →
upload as **zip**; needs code execution enabled) and via the Skills API /
Agent SDK. Zip it with:

```bash
zip -r daily-standup.zip daily-standup
```
