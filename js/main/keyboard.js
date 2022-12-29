// Setup bindings for window
App.check_window_keyboard = function (e) {
  let mode = App.window_mode

  if (e.key === "Tab" && !e.ctrlKey) {
    App.cycle_item_windows(e.shiftKey, true)
    e.preventDefault()
    return
  }

  if (e.ctrlKey) {
    if (e.key === "a") {
      App.highlight_items(mode)
      e.preventDefault()
      return
    }

    if (e.key === "ArrowLeft") {
      App.show_main_menu(mode)
      e.preventDefault()
      return
    }

    if (e.key === "ArrowDown") {
      App.show_filter_modes(mode)
      e.preventDefault()
      return
    }

    if (e.key === "ArrowRight") {
      App.show_actions(mode)
      e.preventDefault()
      return
    }

    if (e.key === "ArrowUp") {
      App.go_to_playing()
      e.preventDefault()
      return
    }

    if (e.key === "Backspace") {
      App.go_to_previous_tab()
      e.preventDefault()
      return
    }
  }

  if (e.key === "Enter") {
    let item = App.get_selected(mode)

    if (e.shiftKey) {
      let rect = item.element.getBoundingClientRect()
      App.show_item_menu(item, rect.left, rect.top)
    }
    else {
      App[`${mode}_action`](item)
    }

    e.preventDefault()
    return
  }

  if (e.key === "ArrowUp") {
    if (e.shiftKey) {
      App.highlight_next(mode, "above")
    } 
    else {
      if (App.dehighlight(mode)) {
        return
      }

      App.select_item_above(mode)
    }

    e.preventDefault()
    return
  }

  if (e.key === "ArrowDown") {
    if (e.shiftKey) {
      App.highlight_next(mode, "below")
    } 
    else {
      if (App.dehighlight(mode)) {
        return
      }

      App.select_item_below(mode)
    }

    e.preventDefault()
    return
  }

  if (e.key === "Delete") {
    if (mode === "tabs") {
      App.close_tabs()
    }

    e.preventDefault()
    return
  }

  App.focus_filter(mode)
}

// Setup keybindings
App.setup_keyboard = function () {
  App.ev(document, "keydown", function (e) {
    if (NeedContext.open) {
      if (e.shiftKey && e.key === "Enter") {
        NeedContext.hide()
      }
      else if (e.ctrlKey && e.key === "ArrowLeft") {
        NeedContext.hide()
      }
      else if (e.ctrlKey && e.key === "ArrowDown") {
        NeedContext.hide()
      }
      else if (e.ctrlKey && e.key === "ArrowRight") {
        NeedContext.hide()
      }

      e.preventDefault()
      return
    }

    if (App.popup_open) {
      if (App.popup_mode === "textarea" || App.popup_mode === "input") {
        return
      }

      if (App.popup_mode === "confirm") {
        if (e.key === "ArrowLeft") {
          App.focus_confirm_no()
        }
        else if (e.key === "ArrowRight") {
          App.focus_confirm_yes()
        }
        else if (e.key === "Enter") {
          App.confirm_enter()
        }
      }
      else if (App.popup_mode === "dialog") {
        if (e.key === "Enter") {
          App.dialog_enter()
        }
        else if (e.key === "ArrowLeft") {
          App.dialog_left()
        }
        else if (e.key === "ArrowRight") {
          App.dialog_right()
        }
      }

      e.preventDefault()
      return
    }

    if (App.window_mode === "image" || App.window_mode === "video") {
      if (e.key === "ArrowLeft") {
        App.media_prev(App.window_mode)
        e.preventDefault()
        return
      }
      else if (e.key === "ArrowRight") {
        App.media_next(App.window_mode)
        e.preventDefault()
        return
      }

      App.hide_media(App.window_mode)
      e.preventDefault()
      return
    }

    if (App.item_order.includes(App.window_mode)) {
      App.check_window_keyboard(e)
    }
  })
}