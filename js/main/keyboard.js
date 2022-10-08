App.setup_keyboard = function () {
  App.ev(document, "keydown", function (e) {
    if (App.window_mode === "closed_tabs") {
      App.focus_closed_tabs_filter()

      if (e.key === "Enter") {
        App.closed_tab_action()
        e.preventDefault()
      } else if (e.key === "ArrowUp") {
        App.closed_tab_above()
        e.preventDefault()
      } else if (e.key === "ArrowDown") {
        App.closed_tab_below()
        e.preventDefault()
      } 

      return
    }

    if (App.window_mode !== "none" || NeedContext.open) {
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