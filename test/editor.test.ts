import { afterEach, expect, test } from "bun:test"
import { TextareaRenderable } from "@opentui/core"
import { createTestRenderer, type TestRendererSetup } from "@opentui/core/testing"
import { expandShortcode, typeColon } from "../src/editor"

const created: TestRendererSetup[] = []

async function setupEditor(initial: string, cursor?: number) {
  const setup = await createTestRenderer({ width: 40, height: 10 })
  created.push(setup)
  const editor = new TextareaRenderable(setup.renderer, { width: 40, height: 6 })
  setup.renderer.root.add(editor)
  editor.focus()
  if (initial) editor.insertText(initial)
  if (cursor !== undefined) editor.cursorOffset = cursor
  return editor
}

afterEach(() => {
  while (created.length > 0) created.pop()!.renderer.destroy()
})

test("typing a closing colon replaces a completed shortcode with its emoji", async () => {
  const editor = await setupEditor("nice :thumbsup")
  typeColon(editor)
  expect(editor.plainText).toBe("nice 👍")
  expect(editor.plainText.slice(0, editor.cursorOffset)).toBe("nice 👍")
})

test("typing a closing colon keeps unknown shortcodes literal", async () => {
  const editor = await setupEditor("nice :not_an_emoji")
  typeColon(editor)
  expect(editor.plainText).toBe("nice :not_an_emoji:")
})

test("typing a colon keeps times and host ports literal", async () => {
  const editor = await setupEditor("meet at 12:30")
  typeColon(editor)
  expect(editor.plainText).toBe("meet at 12:30:")
})

test("expansion rewrites text before the cursor and keeps text after it", async () => {
  const editor = await setupEditor(":tada: now", 6)
  expect(expandShortcode(editor)).toBe(true)
  expect(editor.plainText).toBe("🎉 now")
  expect(editor.plainText.slice(0, editor.cursorOffset)).toBe("🎉")
})

test("expansion keeps non-ascii text before the shortcode", async () => {
  const editor = await setupEditor("ok 👍 :cat:")
  expect(expandShortcode(editor)).toBe(true)
  expect(editor.plainText).toBe("ok 👍 🐱")
  expect(editor.plainText.slice(0, editor.cursorOffset)).toBe("ok 👍 🐱")
})

test("typing after an expanded emoji still expands a new shortcode", async () => {
  const editor = await setupEditor("")
  editor.insertText(":cat")
  typeColon(editor)
  editor.insertText(" and :tada")
  typeColon(editor)
  expect(editor.plainText).toBe("🐱 and 🎉")
})

test("expansion is a no-op without a shortcode at the cursor", async () => {
  const editor = await setupEditor("plain text")
  expect(expandShortcode(editor)).toBe(false)
  expect(editor.plainText).toBe("plain text")
})
