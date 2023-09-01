App.check_items_keyboard = (e) => {
  let mode = App.window_mode
  let item = App.get_selected(mode)
  let filtered = App.filter_has_value(mode)

  function arrow (direction, e) {
    if (!item) {
      e.preventDefault()
      return
    }

    if (!App.element_is_visible(item.element)) {
      App.select_item(item, `nearest_smooth`)
    }
    else {
      if (App.deselect(mode, direction) > 1) {
        e.preventDefault()
        return
      }

      if (direction === `up`) {
        App.select_above(mode)
      }
      else if (direction === `down`) {
        App.select_below(mode)
      }
    }

    e.preventDefault()
  }

  let shortcuts = App.get_setting(`keyboard_shortcuts`)

  for (let line of shortcuts) {
    if (!e.shiftKey || e.ctrlKey) {
      continue
    }

    let items = App.addlist_items(line)
    let key = items[0].toLowerCase()

    if (key !== e.key.toLowerCase()) {
      continue
    }

    let cmd = items[1]
    App.run_command({cmd: cmd, from: `keyboard_shortcut`})
    e.preventDefault()
    return
  }

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
      App.show_actions_menu(mode)
      e.preventDefault()
      return
    }
    else if (e.key === `a`) {
      if (!filtered) {
        App.select_all()
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
      App.step_back(mode, e)
      e.preventDefault()
      return
    }
    else if (e.key === `Home`) {
      App.goto_top(mode, true)
      e.preventDefault()
      return
    }
    else if (e.key === `End`) {
      App.goto_bottom(mode, true)
      e.preventDefault()
      return
    }
    else if (e.key === `Delete`) {
      if (mode === `tabs`) {
        App.close_tabs(item)
      }

      e.preventDefault()
      return
    }
  }

  if (e.shiftKey && !e.ctrlKey) {
    if (e.key === `Enter`) {
      let rect = item.element.getBoundingClientRect()
      App.show_item_menu(item, rect.left, rect.top)
      e.preventDefault()
      return
    }
    else if (e.key === `Home`) {
      App.select_to_edge(mode, `up`)
      e.preventDefault()
      return
    }
    else if (e.key === `End`) {
      App.select_to_edge(mode, `down`)
      e.preventDefault()
      return
    }
    else if (e.key === `ArrowUp`) {
      App.select_next(mode, `above`)
      e.preventDefault()
      return
    }
    else if (e.key === `ArrowDown`) {
      App.select_next(mode, `below`)
      e.preventDefault()
      return
    }
    else if (e.key === `PageUp`) {
      App.scroll(mode, `up`)
      e.preventDefault()
      return
    }
    else if (e.key === `PageDown`) {
      App.scroll(mode, `down`)
      e.preventDefault()
      return
    }
    else if (e.key === `Tab`) {
      App.cycle_modes(true, true)
      e.preventDefault()
      return
    }
  }

  if (!e.ctrlKey && !e.shiftKey) {
    if (e.key === `Escape`) {
      App.step_back(mode, e)
      e.preventDefault()
      return
    }
    else if (e.key === `Enter`) {
      App[`${mode}_action`](item)
      e.preventDefault()
      return
    }
    else if (e.key === `PageUp`) {
      App.scroll(mode, `up`)
      e.preventDefault()
      return
    }
    else if (e.key === `PageDown`) {
      App.scroll(mode, `down`)
      e.preventDefault()
      return
    }
    else if (e.key === `ArrowUp`) {
      arrow(`up`, e)
      e.preventDefault()
      return
    }
    else if (e.key === `ArrowDown`) {
      arrow(`down`, e)
      e.preventDefault()
      return
    }
    else if (e.key === `ArrowLeft`) {
      if (!filtered) {
        App.cycle_modes(true, true)
        e.preventDefault()
      }

      return
    }
    else if (e.key === `ArrowRight`) {
      if (!filtered) {
        App.cycle_modes(false, true)
        e.preventDefault()
      }

      return
    }
    else if (e.key === `Tab`) {
      App.cycle_modes(false, true)
      e.preventDefault()
      return
    }
    else if (e.key === `Delete`) {
      if (!item) {
        return
      }

      let d = Date.now() - App.last_filter_input
      let ok = (d > App.recent_filter_input) && App.filter_empty(mode)

      if (ok || App.multiple_selected(mode)) {
        if (mode === `tabs`) {
          App.close_tabs(item)
        }

        e.preventDefault()
      }

      return
    }
    else if (e.key === `Home`) {
      if (!filtered) {
        App.goto_top(mode, true)
        e.preventDefault()
      }

      return
    }
    else if (e.key === `End`) {
      if (!filtered) {
        App.goto_bottom(mode, true)
        e.preventDefault()
      }

      return
    }
  }

  App.trigger_filter(mode)
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
    }
    else if (App.popup_open()) {
      if (pmode === `dialog`) {
        if (e.key === `Enter`) {
          App.dialog_enter()
          e.preventDefault()
          return
        }
        else if (e.key === `ArrowLeft`) {
          App.dialog_left()
          e.preventDefault()
          return
        }
        else if (e.key === `ArrowRight`) {
          App.dialog_right()
          e.preventDefault()
          return
        }
      }
      else if (pmode === `palette`) {
        if (e.key === `Escape`) {
          if (App.palette_filter_focused()) {
            App.clear_palette_filter()
            e.preventDefault()
          }
          else {
            App.hide_popup()
            e.preventDefault()
          }

          return
        }
        else if (e.key === `Enter`) {
          App.palette_enter()
          e.preventDefault()
          return
        }
        else if (e.key === `ArrowUp`) {
          App.palette_next(true)
          e.preventDefault()
          return
        }
        else if (e.key === `ArrowDown`) {
          App.palette_next()
          e.preventDefault()
          return
        }
        else if (App.palette_filter_focused()) {
          App.filter_palette()
          return
        }
      }
      else if (pmode.startsWith(`addlist_`)) {
        if (e.key === `Enter`) {
          App.addlist_enter()
          e.preventDefault()
          return
        }
        else if (e.key === `ArrowLeft`) {
          if (!App.text_with_value_focused()) {
            App.addlist_left()
            e.preventDefault()
            return
          }
        }
        else if (e.key === `ArrowRight`) {
          if (!App.text_with_value_focused()) {
            App.addlist_right()
            e.preventDefault()
            return
          }
        }
      }

      if (e.key === `Escape`) {
        App.hide_popup()
        e.preventDefault()
        return
      }
    }
    else if (App.on_items()) {
      App.check_items_keyboard(e)
    }
    else if (App.on_settings()) {
      if (e.key === `Escape`) {
        if (App.settings_filter_focused()) {
          App.clear_settings_filter()
          e.preventDefault()
        }
        else {
          App.hide_window()
          e.preventDefault()
        }

        return
      }
      else if (e.key === `ArrowLeft`) {
        if (!App.text_with_value_focused()) {
          App.settings_wheel.call(undefined, `up`)
          e.preventDefault()
          return
        }
      }
      else if (e.key === `ArrowRight`) {
        if (!App.text_with_value_focused()) {
          App.settings_wheel.call(undefined, `down`)
          e.preventDefault()
          return
        }
      }
      else if (App.settings_filter_focused()) {
        App.filter_settings()
        return
      }
    }
    else if (App.on_media()) {
      if (e.key === `Escape`) {
        App.hide_window()
        e.preventDefault()
        return
      }
      else if (e.key === `ArrowLeft`) {
        App.media_prev()
        e.preventDefault()
        return
      }
      else if (e.key === `ArrowRight`) {
        App.media_next()
        e.preventDefault()
        return
      }
      else if (e.key === `ArrowUp`) {
        App.scroll_media_up()
        e.preventDefault()
        return
      }
      else if (e.key === `ArrowDown`) {
        App.scroll_media_down()
        e.preventDefault()
        return
      }
      else if (e.key === `Enter`) {
        if (e.shiftKey) {
          App.show_media_menu(mode)
        }
        else {
          App.open_media()
        }

        e.preventDefault()
        return
      }
    }
    else if (mode === `about`) {
      if (e.key === `Escape`) {
        if (App.about_filter_focused()) {
          App.clear_about_filter()
          e.preventDefault()
        }
        else {
          App.hide_window()
          e.preventDefault()
        }

        return
      }
      else if (App.about_filter_focused()) {
        App.filter_about()
        return
      }
    }
    else if (mode === `profile_editor`) {
      if (e.key === `Escape`) {
        App.hide_window()
        e.preventDefault()
        return
      }
      else if (e.key === `Enter`) {
        if (App.text_with_value_focused()) {
          if (App.text_with_empty_lines()) {
            App.profile_editor_save()
            e.preventDefault()
            return
          }
        }
        else {
          App.profile_editor_save()
          e.preventDefault()
          return
        }
      }
      else if (e.key === `ArrowLeft`) {
        if (!App.text_with_value_focused()) {
          App.profile_editor_left()
          e.preventDefault()
          return
        }
      }
      else if (e.key === `ArrowRight`) {
        if (!App.text_with_value_focused()) {
          App.profile_editor_right()
          e.preventDefault()
          return
        }
      }
    }
  })
}