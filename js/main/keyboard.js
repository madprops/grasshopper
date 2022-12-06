// Setup bindings for window
App.check_window_keyboard = function (e) {
  let mode = App.window_mode

  if (e.key === "Tab" && !e.ctrlKey) {
    App.cycle_item_windows(e.shiftKey, true)
    e.preventDefault()
    return
  }

  if (e.key === " " && e.shiftKey ) {        
    App.show_menu()
    e.preventDefault()
    return
  }

  if (e.key === "Enter") {
    let item = App[`selected_${mode}_item`]

    if (e.shiftKey) {
      let rect = item.element.getBoundingClientRect()
      App.show_item_menu(item, rect.left, rect.top)
    } else {
      App[`${mode}_action`](item)
    }

    e.preventDefault()
    return
  } 
  
  if (e.key === "ArrowUp") {
    App.select_item_above(mode)
    e.preventDefault()
    return
  } 
  
  if (e.key === "ArrowDown") {
    if (e.shiftKey) {
      App.show_filter_mode(mode)
    } else {
      App.select_item_below(mode)
    }

    e.preventDefault()
    return
  }

  if (e.key === "Delete") {
    if (mode === "tabs") {
      App.close_tabs()
    } else if (mode === "stars") {
      App.remove_stars()
    }

    e.preventDefault()
    return
  }

  if (e.ctrlKey && e.key === "a") {
    App.highlight_items(mode)
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
      } else if (e.shiftKey && e.key === " ") {
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
        } else if (e.key === "ArrowRight") {
          App.focus_confirm_yes()
        } else if (e.key === "Enter") {
          App.confirm_enter()
        }
      } else if (App.popup_mode === "dialog") {
        if (e.key === "Enter") {
          App.dialog_enter()
        } else if (e.key === "ArrowLeft") {
          App.dialog_left()
        } else if (e.key === "ArrowRight") {
          App.dialog_right()
        }
      }

      e.preventDefault()
      return
    }

    if (App.window_mode === "star_editor") {
      if (e.key === "Enter") {
        App.star_editor_save()
        e.preventDefault()
      }

      return
    }

    if (App.window_mode === "image") {
      App.hide_media("image")
      e.preventDefault()
      return
    }

    if (App.window_mode === "video") {
      App.hide_media("video")
      e.preventDefault()
      return
    }

    if (App.item_order.includes(App.window_mode)) {
      App.check_window_keyboard(e)
    }
  })
}