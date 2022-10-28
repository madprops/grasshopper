App.setup_keyboard = function () {
  App.ev(document, "keydown", function (e) {
    if (NeedContext.open) {
      return
    }
    
    if (e.key === "Tab") {
      if (!e.ctrlKey && !e.shiftKey) {
        App.cycle_windows()
        e.preventDefault()
        return
      }
    }

    if (App.window_mode === "tabs") {
      App.focus_filter("tabs")
  
      if (e.key === "Enter") {
        App.tabs_action()
        e.preventDefault()
      } else if (e.key === "ArrowUp") {
        App.select_item_above("tabs")
        e.preventDefault()
      } else if (e.key === "ArrowDown") {
        App.select_item_below("tabs")
        e.preventDefault()
      } else if (e.key === "Delete") {
        if (e.ctrlKey) {
          App.confirm_close_tab(App.selected_tabs_item)
          e.preventDefault()
        }
      }
    } else if (App.window_mode === "closed_tabs") {
      App.focus_filter("closed_tabs")

      if (e.key === "Enter") {
        if (e.ctrlKey) {
          App.closes_tabs_action_alt()       
          e.preventDefault()
        } else {
          App.closed_tabs_action()
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
    } else if (App.window_mode === "history") {
      App.focus_filter("history")

      if (e.key === "Enter") {
        if (e.ctrlKey) {
          App.history_action_alt()        
          e.preventDefault()
        } else {
          App.history_action()
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
  })
}