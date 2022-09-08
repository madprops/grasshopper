App.setup_keyboard = function () {
  App.ev(document, "keydown", function (e) {
    if (App.modal_open || NeedContext.open) {
      return
    }

    App.focus_filter()

    if (e.key === "Enter") {
      App.open_tab(App.selected_item, !e.shiftKey)
      e.preventDefault()
    } else if (e.key === "ArrowUp") {
      let item = App.get_prev_visible_item(App.selected_item)

      if (item) {
        App.select_item(item)
      }

      e.preventDefault()
    } else if (e.key === "ArrowDown") {
      let item = App.get_next_visible_item(App.selected_item)

      if (item) {
        App.select_item(item)
      }

      e.preventDefault()
    }
  })
}