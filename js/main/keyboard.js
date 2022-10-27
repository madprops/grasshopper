App.setup_keyboard = function () {
  App.ev(document, "keydown", function (e) {
    if (e.key === "Tab") {
      if (!e.ctrlKey && !e.shiftKey) {
        App.cycle_windows()
        e.preventDefault()
        return
      }
    }

    if (App.window_mode === "closed_tabs") {
      App.focus_filter("closed_tabs")

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
        App.select_item_above("closed_tabs")
        e.preventDefault()
      } else if (e.key === "ArrowDown") {
        App.select_item_below("closed_tabs")
        e.preventDefault()
      }

      return
    }

    if (App.window_mode === "history") {
      App.focus_filter("history")

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
        App.select_item_above("history")
        e.preventDefault()
      } else if (e.key === "ArrowDown") {
        App.select_item_below("history")
        e.preventDefault()
      }

      return
    }    

    if (App.window_mode !== "none" || NeedContext.open) {
      return
    }

    App.focus_filter("tabs")

    if (e.key === "Enter") {
      if (App.selected_valid("tabs")) {
        App.open_tab(App.selected_tabs_item)
        e.preventDefault()
      }
    } else if (e.key === "ArrowUp") {
      App.select_item_above("tabs")
      e.preventDefault()
    } else if (e.key === "ArrowDown") {
      App.select_item_below("tabs")
      e.preventDefault()
    } else if (e.key === "Delete") {
      if (e.ctrlKey) {
        if (App.selected_valid("tabs")) {
          App.confirm_close_tab(App.selected_tabs_item)
          e.preventDefault()
        }
      }
    }
  })
}