import type { EditBufferRenderable } from "@opentui/core"
import { expansionAt } from "./expand"

/**
 * Replaces a completed shortcode before the cursor with its emoji. The
 * replacement uses range edits so the cursor and any attached text parts stay
 * anchored to the surrounding text.
 */
export function expandShortcode(editor: EditBufferRenderable): boolean {
  const found = expansionAt(editor.plainText, editor.cursorOffset)
  if (!found) return false
  const from = editor.editBuffer.offsetToPosition(found.start)
  const to = editor.editBuffer.offsetToPosition(found.start + found.shortcode.length)
  if (!from || !to) return false
  editor.deleteRange(from.row, from.col, to.row, to.col)
  editor.cursorOffset = found.start
  editor.insertText(found.emoji)
  return true
}

/** Types a colon and expands a shortcode when the colon completes one. */
export function typeColon(editor: EditBufferRenderable): void {
  editor.insertChar(":")
  expandShortcode(editor)
}
