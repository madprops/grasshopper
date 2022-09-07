App.setup_keyboard = function () {
  App.ev(document, "keydown", function (e) {
    if (NeedContext.open) {
      return
    }

    App.focus_filter()

    if (e.key === "Enter") {
      App.open_tab(App.selected_item)
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
      App.switch_list()
    } else if (e.key === " ") {
      if (e.shiftKey) {
        App.show_item_menu(App.selected_item)
        e.preventDefault()
      }
    }
  })
}