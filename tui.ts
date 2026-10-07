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

    // The host resolves the keymap context at the call site, so the layer is
    // created from a mounted slot render. The layer carries no target because a
    // target is bound to the renderable focused at registration time and is
    // never re-resolved; run() looks up the editor per keystroke instead.
    const layer = context.ui.slot({
      append: "app",
      render: () => {
        context.keymap.layer(() => ({
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
        return null
      },
    })

    return () => {
      footer()
      layer()
    }
  },
})
