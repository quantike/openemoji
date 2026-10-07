import { expect, test } from "bun:test"
import { expansionAt } from "../src/expand"

test("finds a shortcode typed at the end of the text", () => {
  const text = "nice :thumbsup:"
  expect(expansionAt(text, text.length)).toEqual({
    start: 5,
    shortcode: ":thumbsup:",
    emoji: "👍",
  })
})

test("resolves shortcode aliases", () => {
  const text = "ship it :+1:"
  expect(expansionAt(text, text.length)).toEqual({
    start: 8,
    shortcode: ":+1:",
    emoji: "👍",
  })
})

test("finds a shortcode before the cursor with text after it", () => {
  const text = ":tada: now"
  expect(expansionAt(text, 6)).toEqual({
    start: 0,
    shortcode: ":tada:",
    emoji: "🎉",
  })
})

test("ignores unknown shortcodes", () => {
  const text = ":not_an_emoji:"
  expect(expansionAt(text, text.length)).toBeUndefined()
})

test("ignores shortcodes with uppercase names", () => {
  const text = ":Thumbsup:"
  expect(expansionAt(text, text.length)).toBeUndefined()
})

test("ignores a shortcode that is not closed at the cursor", () => {
  const text = ":thumbsup: extra"
  expect(expansionAt(text, text.length)).toBeUndefined()
})

test("ignores text that merely ends in colons", () => {
  expect(expansionAt("http://host:8080:", 17)).toBeUndefined()
  expect(expansionAt("12:30:", 6)).toBeUndefined()
  expect(expansionAt("version:v1:", 11)).toBeUndefined()
})

test("ignores skin-tone style colon chains", () => {
  const text = ":thumbsup::skin-tone-2:"
  expect(expansionAt(text, text.length)).toBeUndefined()
})

test("matches after whitespace and punctuation", () => {
  expect(expansionAt("(:cat:", 6)).toEqual({
    start: 1,
    shortcode: ":cat:",
    emoji: "🐱",
  })
  expect(expansionAt("line one\n:cat:", 14)).toEqual({
    start: 9,
    shortcode: ":cat:",
    emoji: "🐱",
  })
})

test("matches at the start of the text", () => {
  expect(expansionAt(":cat:", 5)).toEqual({
    start: 0,
    shortcode: ":cat:",
    emoji: "🐱",
  })
})
