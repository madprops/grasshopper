App.check_items_keyboard = (e) => {
  let mode = App.window_mode

  if (e.ctrlKey && !e.shiftKey) {
    if (e.key === `ArrowUp`) {
      App.move_tabs_vertically(`top`)
      e.preventDefault()
      return
    }
    else if (e.key === `ArrowDown`) {
      App.move_tabs_vertically(`bottom`)
      e.preventDefault()
      return
    }
    else if (e.key === `ArrowLeft`) {
      App.show_main_menu(mode)
      e.preventDefault()
      return
    }
    else if (e.key === `ArrowRight`) {
      App.show_actions(mode)
      e.preventDefault()
      return
    }
    else if (e.key === `a`) {
      if (!App.get_filter(mode, false)) {
        App.highlight_items()
        e.preventDefault()
      }

      return
    }
    else if (e.key === `f`) {
      App.show_filter_menu(mode)
      e.preventDefault()
      return
    }
    else if (e.key === `.`) {
      App.go_to_playing_tab()
      e.preventDefault()
      return
    }
    else if (e.key === `Backspace`) {
      App.back_action(mode)
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
    else if (e.key === `Delete`) {
      let item = App.get_selected(mode)

      if (mode === `tabs`) {
        if (item) {
          App.close_tabs(item)
        }
      }
      else if (mode === `stars`) {
        if (item) {
          App.remove_stars(item)
        }
      }

      e.preventDefault()
      return
    }
  }

  if (e.shiftKey && !e.ctrlKey) {
    if (e.key === `Enter`) {
      let item = App.get_selected(mode)

      if (item) {
        let rect = item.element.getBoundingClientRect()
        App.show_item_menu(item, rect.left, rect.top)
      }

      e.preventDefault()
      return
    }
    else if (e.key === `Home`) {
      App.highlight_to_edge(mode, `up`)
      e.preventDefault()
      return
    }
    else if (e.key === `End`) {
      App.highlight_to_edge(mode, `down`)
      e.preventDefault()
      return
    }
    else if (e.key === `ArrowUp`) {
      App.highlight_next(mode, `above`)
      e.preventDefault()
      return
    }
    else if (e.key === `ArrowDown`) {
      App.highlight_next(mode, `below`)
      e.preventDefault()
      return
    }
    else if (e.key === `PageUp`) {
      App.scroll(mode, `up`, true)
      e.preventDefault()
      return
    }
    else if (e.key === `PageDown`) {
      App.scroll(mode, `down`, true)
      e.preventDefault()
      return
    }
    else if (e.key === `Tab`) {
      App.cycle_item_windows(true, true)
      e.preventDefault()
      return
    }
  }

  if (!e.ctrlKey && !e.shiftKey) {
    if (e.key === `Escape`) {
      App.back_action(mode)
    }
    else if (e.key === `Enter`) {
      let item = App.get_selected(mode)

      if (item) {
        App[`${mode}_action`](item)
      }

      e.preventDefault()
      return
    }
    else if (e.key === `PageUp`) {
      App.scroll(mode, `up`, false)
      e.preventDefault()
      return
    }
    else if (e.key === `PageDown`) {
      App.scroll(mode, `down`, false)
      e.preventDefault()
      return
    }
    else if (e.key === `ArrowUp`) {
      if (App.dehighlight(mode, `up`)) {
        e.preventDefault()
        return
      }

      App.select_item_above(mode)
      e.preventDefault()
      return
    }
    else if (e.key === `ArrowDown`) {
      if (App.dehighlight(mode, `down`)) {
        e.preventDefault()
        return
      }

      App.select_item_below(mode)
      e.preventDefault()
      return
    }
    else if (e.key === `ArrowLeft`) {
      if (!App.get_filter(mode)) {
        App.cycle_item_windows(true, true)
        e.preventDefault()
      }

      return
    }
    else if (e.key === `ArrowRight`) {
      if (!App.get_filter(mode)) {
        App.cycle_item_windows(false, true)
        e.preventDefault()
      }

      return
    }
    else if (e.key === `Tab`) {
      App.cycle_item_windows(false, true)
      e.preventDefault()
      return
    }
  }

  App.focus_filter(mode)
}

App.setup_keyboard = () => {
  DOM.ev(document, `keydown`, (e) => {
    let mode = App.window_mode
    let pmode = App.popup_mode

    if (e.key === `Control`) {
      if (Date.now() - App.double_tap_date < App.double_tap_delay) {
        App.show_palette()
        e.preventDefault()
        return
      }

      App.double_tap_date = Date.now()
    }

    if (NeedContext.open) {
      if (e.shiftKey && e.key === `Enter`) {
        NeedContext.hide()
        e.preventDefault()
      }
      else if (e.ctrlKey && e.key === `ArrowLeft`) {
        NeedContext.hide()
        e.preventDefault()
      }
      else if (e.ctrlKey && e.key === `ArrowDown`) {
        NeedContext.hide()
        e.preventDefault()
      }
      else if (e.ctrlKey && e.key === `ArrowRight`) {
        NeedContext.hide()
        e.preventDefault()
      }

      return
    }

    if (App.popup_open()) {
      if (e.key === `Escape`) {
        App.hide_all_popups()
        e.preventDefault()
        return
      }

      if (pmode === `textarea` || pmode === `input`) {
        return
      }
      else if (pmode === `confirm`) {
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
      else if (pmode === `dialog`) {
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
      else if (pmode === `palette`) {
        if (e.key === `Enter`) {
          App.palette_enter()
          e.preventDefault()
        }
        else if (e.key === `ArrowUp`) {
          App.palette_next(true)
          e.preventDefault()
        }
        else if (e.key === `ArrowDown`) {
          App.palette_next()
          e.preventDefault()
        }
      }

      return
    }

    if (App.on_settings()) {
      if (App.settings_filter_focused()) {
        if (e.key === `Escape`) {
          App.clear_settings_filter()
          e.preventDefault()
          return
        }
        else {
          App.filter_settings()
        }
      }

      if (e.key === `ArrowLeft`) {
        if (!App.text_with_value_focused()) {
          App.show_prev_settings()
          e.preventDefault()
          return
        }
      }
      else if (e.key === `ArrowRight`) {
        if (!App.text_with_value_focused()) {
          App.show_next_settings()
          e.preventDefault()
          return
        }
      }
      else if (e.key === `Escape`) {
        App.hide_current_window()
        e.preventDefault()
        return
      }
    }
    else if (mode === `star_editor`) {
      if (e.key === `Enter`) {
        App.star_editor_save()
        e.preventDefault()
        return
      }
    }
    else if (mode === `title_editor`) {
      if (e.key === `Enter`) {
        App.title_editor_save()
        e.preventDefault()
        return
      }
    }
    else if (App.on_media()) {
      if (e.key === `ArrowLeft`) {
        App.media_prev()
        e.preventDefault()
        return
      }
      else if (e.key === `ArrowRight`) {
        App.media_next()
        e.preventDefault()
        return
      }
      else if (e.key === `Enter`) {
        App.open_media()
        e.preventDefault()
        return
      }
      else if (e.key === ` `) {
        App.show_media_menu(mode)
        e.preventDefault()
        return
      }
    }

    if (!App.on_item_window()) {
      if (e.key === `Escape`) {
        App.show_last_window()
        e.preventDefault()
        return
      }
    }

    if (App.on_item_window()) {
      App.check_items_keyboard(e)
    }
  })
}