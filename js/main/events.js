App.setup_events = function () {
  App.ev(document, "keydown", function (e) {
    if (App.layout !== "main") {
      return
    }

    App.focus_filter()

    if (e.key === "Enter") {
      if (e.shiftKey) {
        App.toggle_favorite(App.selected_item)
      } else {
        if (App.selected_item) {
          App.open_tab(App.selected_item.url)
        }
      }

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
    } else if (e.key === "Tab") {
      App.change_mode()
      e.preventDefault()
    }
  })
}