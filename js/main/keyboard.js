App.check_window_keyboard = (e) => {
  let mode = App.window_mode

  if (e.key === `Tab` && !e.ctrlKey) {
    App.cycle_item_windows(e.shiftKey, true)
    e.preventDefault()
    return
  }

  if (e.ctrlKey) {
    if (e.key === `ArrowLeft`) {
      App.show_main_menu(mode)
      e.preventDefault()
      return
    }
    else if (e.key === `ArrowDown`) {
      App.show_filter_modes(mode)
      e.preventDefault()
      return
    }
    else if (e.key === `ArrowRight`) {
      App.show_actions(mode)
      e.preventDefault()
      return
    }
    else if (e.key === `ArrowUp`) {
      App.go_to_playing()
      e.preventDefault()
      return
    }
    else if (e.key === `Backspace`) {
      App.tabs_back_action()
      e.preventDefault()
      return
    }
    else if (e.key === `Home`) {
      App.goto_top(mode)
      e.preventDefault()
      return
    }
    else if (e.key === `End`) {
      App.goto_bottom(mode)
      e.preventDefault()
      return
    }
    else if (e.key === `a`) {
      App.highlight_items(mode)
      e.preventDefault()
      return
    }
  }

  if (e.key === `Escape`) {
    App.clear_filter(mode)
  }
  else if (e.key === `Enter`) {
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
  else if (e.key === `Home`) {
    if (e.shiftKey) {
      App.highlight_to_edge(mode, `above`)
      e.preventDefault()
      return
    }
    else {
      App.goto_top(mode)
      e.preventDefault()
      return
    }
  }
  else if (e.key === `End`) {
    if (e.shiftKey) {
      App.highlight_to_edge(mode, `below`)
      e.preventDefault()
      return
    }
    else {
      App.goto_bottom(mode)
      e.preventDefault()
      return
    }
  }
  else if (e.key === `PageUp`) {
    App.scroll(mode, `up`, e.shiftKey)
    e.preventDefault()
    return
  }
  else if (e.key === `PageDown`) {
    App.scroll(mode, `down`, e.shiftKey)
    e.preventDefault()
    return
  }
  else if (e.key === `ArrowUp`) {
    if (e.shiftKey) {
      App.highlight_next(mode, `above`)
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
  else if (e.key === `ArrowDown`) {
    if (e.shiftKey) {
      App.highlight_next(mode, `below`)
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
  else if (e.key === `Delete`) {
    if (mode === `tabs`) {
      App.close_tabs()
    }
    else if (mode === `stars`) {
      let item = App.get_selected(mode)
      App.remove_stars(item)
    }

    e.preventDefault()
    return
  }

  App.focus_filter(mode)
}

App.setup_keyboard = () => {
  DOM.ev(document, `keydown`, (e) => {
    let mode = App.window_mode
    let pmode = App.popup_mode

    if (NeedContext.open) {
      if (e.shiftKey && e.key === `Enter`) {
        NeedContext.hide()
      }
      else if (e.ctrlKey && e.key === `ArrowLeft`) {
        NeedContext.hide()
      }
      else if (e.ctrlKey && e.key === `ArrowDown`) {
        NeedContext.hide()
      }
      else if (e.ctrlKey && e.key === `ArrowRight`) {
        NeedContext.hide()
      }

      e.preventDefault()
      return
    }

    if (App.popup_open) {
      if (e.key === `Escape`) {
        App.hide_all_popups()
        e.preventDefault()
        return
      }

      if (pmode === `textarea` || pmode === `input`) {
        return
      }

      if (pmode === `confirm`) {
        if (e.key === `ArrowLeft`) {
          App.focus_confirm_no()
        }
        else if (e.key === `ArrowRight`) {
          App.focus_confirm_yes()
        }
        else if (e.key === `Enter`) {
          App.confirm_enter()
        }
      }

      if (pmode === `dialog`) {
        if (e.key === `Enter`) {
          App.dialog_enter()
        }
        else if (e.key === `ArrowLeft`) {
          App.dialog_left()
        }
        else if (e.key === `ArrowRight`) {
          App.dialog_right()
        }
      }

      e.preventDefault()
      return
    }

    if (!App.on_item_window()) {
      if (e.key === `Escape`) {
        App.show_last_window()
        e.preventDefault()
        return
      }
    }

    if (mode === `star_editor`) {
      if (e.key === `Enter`) {
        App.star_editor_save()
        e.preventDefault()
      }

      return
    }
    else if (mode === `title_editor`) {
      if (e.key === `Enter`) {
        App.title_editor_save()
        e.preventDefault()
      }

      return
    }
    else if (mode === `image` || mode === `video`) {
      if (e.key === `ArrowLeft`) {
        App.media_prev(mode)
        e.preventDefault()
        return
      }
      else if (e.key === `ArrowRight`) {
        App.media_next(mode)
        e.preventDefault()
        return
      }
      else if (e.key === `ArrowUp`) {
        App.media_copy(mode, true)
        e.preventDefault()
        return
      }
      else if (e.key === `Enter`) {
        App.open_media(mode)
        e.preventDefault()
        return
      }
      else if (e.key === ` `) {
        App.star_media(mode)
        e.preventDefault()
        return
      }
    }

    if (App.on_item_window()) {
      App.check_window_keyboard(e)
    }
  })
}