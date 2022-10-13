App.setup_keyboard = function () {
  App.ev(document, "keydown", function (e) {
    if (App.window_mode === "closed_tabs") {
      App.focus_closed_tabs_filter()

      if (e.key === "Enter") {
        if (e.shiftKey) {
          App.windows["closed_tabs"].hide()
          e.preventDefault()
        } else {
          App.closed_tab_action()
          e.preventDefault()
        }
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
      if (e.shiftKey) {
        App.show_closed_tabs()
        e.preventDefault()
      } else {
        if (App.selected_valid()) {
          App.open_tab(App.selected_item)
          e.preventDefault()
        }
      }
    } else if (e.key === "ArrowUp") {
      if (e.shiftKey) {
        if (App.selected_valid()) {
          App.move_tab_up(App.selected_item)
          e.preventDefault()
        }
      } else {
        App.select_item_above()
        e.preventDefault()
      }
    } else if (e.key === "ArrowDown") {
      if (e.shiftKey) {
        if (App.selected_valid()) {
          App.move_tab_down(App.selected_item)
          e.preventDefault()
        }
      } else {
        App.select_item_below()
        e.preventDefault()
      }
    } else if (e.key === "Delete") {
      if (e.shiftKey) {
        if (App.selected_valid()) {
          App.close_tab(App.selected_item)
          e.preventDefault()
        }
      }
    }
  })
}