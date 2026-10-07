import { Plugin } from "@opencode/plugin/tui"
import { typeColon } from "./src/editor"

export default Plugin.define({
  id: "emoji.shortcodes",
  setup(context) {
    let promptMode: "normal" | "shell" = "normal"

    const footer = context.ui.slot({
      append: "prompt.footer",
      render: (input) => {
        promptMode = input.mode
        return null
      },
    })

    const insertColon = () => {
      const editor = context.renderer.currentFocusedEditor
      if (!editor) return false
      if (promptMode === "shell") {
        editor.insertChar(":")
        return
      }
      typeColon(editor)
    }

    context.keymap.layer(() => ({
      target: () => context.renderer.currentFocusedEditor,
      commands: [
        {
          id: "emoji.shortcode.expand",
          title: "Expand emoji shortcode",
          bind: ":",
          run: insertColon,
        },
        {
          id: "emoji.shortcode.expand_shift",
          title: "Expand emoji shortcode",
          bind: "shift+:",
          run: insertColon,
        },
      ],
    }))

    return footer
  },
})
