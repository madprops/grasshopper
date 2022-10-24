App.setup_keyboard = function () {
  App.ev(document, "keydown", function (e) {
    if (e.key === "Tab") {
      if (!e.ctrlKey && !e.shiftKey) {
        App.cycle_windows()
      }
    }

    if (App.window_mode === "closed_tabs") {
      App.focus_closed_tabs_filter()

      if (e.key === "Enter") {
        if (e.ctrlKey) {
          App.restore_tab(App.selected_closed_tab, false)
          App.remove_closed_tab(App.selected_closed_tab)          
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

    if (App.window_mode === "history") {
      App.focus_history_filter()

      if (e.key === "Enter") {
        if (e.ctrlKey) {
          App.open_history_item(App.selected_history_item, false)
          App.remove_history_item(App.selected_history_item)          
          e.preventDefault()
        } else {
          App.history_item_action()
          e.preventDefault()
        }
      } else if (e.key === "ArrowUp") {
        App.history_item_above()
        e.preventDefault()
      } else if (e.key === "ArrowDown") {
        App.history_item_below()
        e.preventDefault()
      }

      return
    }    

    if (App.window_mode !== "none" || NeedContext.open) {
      return
    }

    App.focus_tabs_filter()

    if (e.key === "Enter") {
      if (App.selected_valid()) {
        App.open_tab(App.selected_tab)
        e.preventDefault()
      }
    } else if (e.key === "ArrowUp") {
      if (e.ctrlKey) {
        if (App.selected_valid()) {
          App.move_tab_up(App.selected_tab)
          e.preventDefault()
        }
      } else {
        App.select_tab_above()
        e.preventDefault()
      }
    } else if (e.key === "ArrowDown") {
      if (e.ctrlKey) {
        if (App.selected_valid()) {
          App.move_tab_down(App.selected_tab)
          e.preventDefault()
        }
      } else {
        App.select_tab_below()
        e.preventDefault()
      }
    } else if (e.key === "Delete") {
      if (e.ctrlKey) {
        if (App.selected_valid()) {
          App.close_tab(App.selected_tab)
          e.preventDefault()
        }
      }
    }
  })
}