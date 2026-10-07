# openemoji

An OpenCode CLI plugin that expands emoji shortcodes while you type, the way
Slack does. Typing `:thumbsup:` in the prompt turns it into `👍` when you type
the closing colon.

## Behavior

- The expansion triggers when you type the closing `:` of a shortcode.
- Names come from the GitHub gemoji set, including aliases, so `:thumbsup:` and
  `:+1:` both become `👍`.
- Names are lowercase, like Slack. `:Thumbsup:` stays literal.
- Unknown names stay literal.
- A shortcode next to a word character or another colon stays literal, so
  `12:30:`, `http://host:8080:`, and `::skin-tone-2:` are not changed.
- Shortcodes typed in shell mode (prompt starting with `!`) stay literal.
- Pasted shortcodes are not expanded.

## Install

Install the dependencies in the checkout. The plugin loads `gemoji` at runtime,
so it does not load without `node_modules`:

```bash
git clone https://github.com/quantike/openemoji
cd openemoji
bun install
```

The plugin loads from the OpenCode plugin directories. For use in every
project, link the checkout into the global plugin directory:

```bash
ln -s /path/to/openemoji ~/.config/opencode/plugins/openemoji
```

For one project only, link it into the project instead:

```bash
ln -s /path/to/openemoji .opencode/plugins/openemoji
```

A local plugin directory must expose its entries as top-level files: `tui.ts`
for the CLI plugin and `index.ts` for the server plugin. The `exports` map in
`package.json` covers package-style loading.

## Layout

- `tui.ts` registers a keymap binding for `:` and expands a shortcode after the
  colon is typed.
- `index.ts` is an empty server plugin.
- `src/expand.ts` finds the shortcode before the cursor.
- `src/editor.ts` rewrites the prompt buffer.

## Development

```bash
bun test
bun run typecheck
```
