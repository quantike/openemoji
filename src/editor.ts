import type { EditBufferRenderable } from "@opentui/core"
import { expansionAt } from "./expand"

/**
 * Replaces a completed shortcode before the cursor with its emoji. The
 * replacement uses range edits so the cursor and any attached text parts stay
 * anchored to the surrounding text.
 *
 * The edit buffer counts offsets in display columns, which differ from string
 * indices for emoji, wide characters, and combining marks, so the text before
 * the cursor is read back from the buffer instead of sliced out of `plainText`.
 * A shortcode name is ASCII, one column per character, so the shortcode starts
 * at the cursor backed up by its length.
 */
export function expandShortcode(editor: EditBufferRenderable): boolean {
  const cursor = editor.cursorOffset
  const found = expansionAt(editor.editBuffer.getTextRange(0, cursor))
  if (!found) return false
  const start = cursor - found.shortcode.length
  const from = editor.editBuffer.offsetToPosition(start)
  const to = editor.editBuffer.offsetToPosition(cursor)
  if (!from || !to) return false
  editor.deleteRange(from.row, from.col, to.row, to.col)
  editor.cursorOffset = start
  editor.insertText(found.emoji)
  return true
}

/** Types a colon and expands a shortcode when the colon completes one. */
export function typeColon(editor: EditBufferRenderable): void {
  editor.insertChar(":")
  expandShortcode(editor)
}
