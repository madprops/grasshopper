App.setup_keyboard = function () {
  App.ev(document, "keydown", function (e) {
    if (App.window_open || NeedContext.open) {
      return
    }

    App.focus_filter()

    if (e.key === "Enter") {
      if (App.selected_valid()) {
        App.open_tab(App.selected_item)
      }
      
      e.preventDefault()
    } else if (e.key === "ArrowUp") {
      App.select_item_above()
      e.preventDefault()
    } else if (e.key === "ArrowDown") {
      App.select_item_below()
      e.preventDefault()
    }
  })
}