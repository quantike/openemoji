import { nameToEmoji } from "gemoji"

export interface Expansion {
  /** Shortcode including both colons. */
  readonly shortcode: string
  readonly emoji: string
}

const SHORTCODE = /:([a-z0-9_+\-]+):$/
const NAME_CHAR = /[A-Za-z0-9_:+\-]/

/**
 * Finds a completed `:shortcode:` at the end of `before`, the text up to the
 * cursor, the way a composer triggers expansion when the closing colon is
 * typed. Shortcodes adjacent to word characters or another colon are not
 * matched, so times like `12:30:`, URLs like `http://host:8080:`, and
 * skin-tone chains like `::skin-tone-2:` stay literal.
 */
export function expansionAt(before: string): Expansion | undefined {
  const match = SHORTCODE.exec(before)
  if (!match) return undefined
  const boundary = before[match.index - 1]
  if (boundary !== undefined && NAME_CHAR.test(boundary)) return undefined
  const name = match[1] ?? ""
  const emoji = nameToEmoji[name]
  if (emoji === undefined) return undefined
  return { shortcode: match[0], emoji }
}
