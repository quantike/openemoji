import { expect, test } from "bun:test"
import { expansionAt } from "../src/expand"

test("finds a shortcode closed at the end of the text", () => {
  expect(expansionAt("nice :thumbsup:")).toEqual({
    shortcode: ":thumbsup:",
    emoji: "👍",
  })
})

test("resolves shortcode aliases", () => {
  expect(expansionAt("ship it :+1:")).toEqual({
    shortcode: ":+1:",
    emoji: "👍",
  })
})

test("ignores unknown shortcodes", () => {
  expect(expansionAt(":not_an_emoji:")).toBeUndefined()
})

test("ignores shortcodes with uppercase names", () => {
  expect(expansionAt(":Thumbsup:")).toBeUndefined()
})

test("ignores a shortcode that is not closed at the end", () => {
  expect(expansionAt(":thumbsup: extra")).toBeUndefined()
})

test("ignores text that merely ends in colons", () => {
  expect(expansionAt("http://host:8080:")).toBeUndefined()
  expect(expansionAt("12:30:")).toBeUndefined()
  expect(expansionAt("version:v1:")).toBeUndefined()
})

test("ignores skin-tone style colon chains", () => {
  expect(expansionAt(":thumbsup::skin-tone-2:")).toBeUndefined()
})

test("matches after whitespace and punctuation", () => {
  expect(expansionAt("(:cat:")).toEqual({
    shortcode: ":cat:",
    emoji: "🐱",
  })
  expect(expansionAt("line one\n:cat:")).toEqual({
    shortcode: ":cat:",
    emoji: "🐱",
  })
})

test("matches after an emoji", () => {
  expect(expansionAt("👍:cat:")).toEqual({
    shortcode: ":cat:",
    emoji: "🐱",
  })
  expect(expansionAt("👁️ :heart:")).toEqual({
    shortcode: ":heart:",
    emoji: "❤️",
  })
})

test("matches at the start of the text", () => {
  expect(expansionAt(":cat:")).toEqual({
    shortcode: ":cat:",
    emoji: "🐱",
  })
})
