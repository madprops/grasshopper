App.setup_keyboard = function () {
  App.ev(document, "keydown", function (e) {
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
      } else if (e.key === "6") {
        if (e.ctrlKey) {
          App.windows["closed_tabs"].hide()
          e.preventDefault()
        }
      }

      return
    }

    if (App.window_mode !== "none" || NeedContext.open) {
      return
    }

    App.focus_filter()

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
    } else if (e.key === "1") {
      if (e.ctrlKey) {
        App.el("#filter_mode").focus()
        e.preventDefault()
      }
    } else if (e.key === "2") {
      if (e.ctrlKey) {
        App.el("#text_mode").focus()
        e.preventDefault()
      }
    } else if (e.key === "3") {
      if (e.ctrlKey) {
        App.el("#case_sensitive").checked = !App.el("#case_sensitive").checked
        e.preventDefault()
      }
    } else if (e.key === "4") {
      if (e.ctrlKey) {
        App.sort_tabs()
        e.preventDefault()
      }
    } else if (e.key === "5") {
      if (e.ctrlKey) {
        App.clean_tabs()
        e.preventDefault()
      }
    } else if (e.key === "6") {
      if (e.ctrlKey) {
        App.show_closed_tabs()
        e.preventDefault()
      }
    } else if (e.key === "7") {
      if (e.ctrlKey) {
        App.go_to_playing_tab()
        e.preventDefault()
      }
    }
  })
}