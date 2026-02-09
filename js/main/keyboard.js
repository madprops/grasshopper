App.check_items_keyboard = (e) => {
  let mode = App.window_mode
  let item = App.get_selected(mode)
  let filter_focus = App.filter_is_focused(mode)
  let filter_filled = App.filter_has_value(mode)
  let filter_end = App.filter_at_end(mode)

  function arrow(direction, e) {
    if (!item) {
      e.preventDefault()
      return
    }

    if (!App.item_is_visible(item)) {
      App.select_item({item, scroll: `nearest`})
    }
    else {
      if (App.deselect({mode, select: direction}) > 1) {
        e.preventDefault()
        return
      }

      App.select_up_down(mode, direction, e.altKey)
    }

    e.preventDefault()
  }

  let ran_shortcut = false

  for (let sc of App.get_setting(`keyboard_shortcuts`)) {
    if (sc.key !== e.code) {
      continue
    }

    if (sc.ctrl && !e.ctrlKey) {
      continue
    }

    if (!sc.ctrl && e.ctrlKey) {
      continue
    }

    if (sc.shift && !e.shiftKey) {
      continue
    }

    if (!sc.shift && e.shiftKey) {
      continue
    }

    if (sc.alt && !e.altKey) {
      continue
    }

    if (!sc.alt && e.altKey) {
      continue
    }

    if (!sc.ctrl && !sc.alt) {
      if (filter_focus) {
        continue
      }
    }

    App.run_command({cmd: sc.cmd, from: `keyboard_shortcut`})
    e.preventDefault()
    e.stopPropagation()
    ran_shortcut = true
  }

  if (ran_shortcut) {
    return
  }

  if (e.ctrlKey && !e.shiftKey) {
    if (!isNaN(e.key)) {
      App.on_number_key(e.key)
      e.preventDefault()
      return
    }
  }

  if (e.shiftKey && !e.ctrlKey) {
    if (e.key === `Home`) {
      if (!filter_focus || !filter_filled) {
        App.select_to_edge(mode, `up`)
        e.preventDefault()
        return
      }
    }
    else if (e.key === `End`) {
      if (!filter_focus || !filter_filled) {
        App.select_to_edge(mode, `down`)
        e.preventDefault()
        return
      }
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
  }

  if (!e.ctrlKey && !e.shiftKey) {
    if (e.key === `Escape`) {
      App.step_back(mode, e)
      e.preventDefault()
      return
    }
    else if (e.key === `Enter`) {
      App.update_filter_history()

      if (filter_focus) {
        let current = App.get_filter(mode)

        if (App.is_cmd_filter(current)) {
          App.check_filter_enter()
          return
        }

        if (App.filter_enter_active(mode)) {
          let last = App[`last_${mode}_filter`]

          if (current !== last) {
            App.do_filter({mode})
            return
          }
        }
      }

      if (!item) {
        e.preventDefault()
        return
      }

      App[`${mode}_action`]({item, from: `enter`})
      e.preventDefault()
      return
    }
    else if (e.key === `PageUp`) {
      if (App.get_setting(`page_scrolls`)) {
        App.scroll_page(mode, `up`)
      }
      else {
        App.scroll(mode, `up`)
      }

      e.preventDefault()
      return
    }
    else if (e.key === `PageDown`) {
      if (App.get_setting(`page_scrolls`)) {
        App.scroll_page(mode, `down`)
      }
      else {
        App.scroll(mode, `down`)
      }

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
      if (!filter_focus || !filter_filled) {
        App.cycle_modes(true)
        e.preventDefault()
        return
      }
    }
    else if (e.key === `ArrowRight`) {
      if (!filter_focus || !filter_filled) {
        App.cycle_modes(false)
        e.preventDefault()
        return
      }
    }
    else if (e.key === `Delete`) {
      if (mode === `tabs`) {
        if (!filter_focus || !filter_filled || filter_end) {
          if (!item) {
            e.preventDefault()
            return
          }

          App.close_tabs({item})
          App.focus_filter(mode)
          e.preventDefault()
        }
      }

      return
    }
    else if (e.key === `Home`) {
      if (!filter_focus || !filter_filled) {
        App.go_to_top_or_bottom({what: `top`, mode, select: true})
        e.preventDefault()
        return
      }
    }
    else if (e.key === `End`) {
      if (!filter_focus || !filter_filled) {
        App.go_to_top_or_bottom({what: `bottom`, mode, select: true})
        e.preventDefault()
        return
      }
    }
  }

  if (!filter_focus) {
    let allowed = [`Backspace`]

    if ((e.key.length === 1) || allowed.includes(e.key)) {
      App.focus_filter(mode)
    }
  }

  App.clear_restore()
}

App.setup_keyboard = () => {
  DOM.ev(document, `keydown`, (e) => {
    if (App.locust_swarm_on) {
      return
    }

    if (App.screen_locked) {
      return
    }

    if (App.flashlight_on) {
      return
    }

    if (NeedContext.open) {
      return
    }

    if (e.repeat) {
      let repeats = [`ArrowUp`, `ArrowDown`, `PageUp`, `PageDown`]

      if (!repeats.includes(e.key)) {
        return
      }
    }

    let mode = App.window_mode

    if ((e.key === `Control`) || (e.key === `Shift`)) {
      App.start_press_timeout()

      if (App.pressed_key === e.key) {
        if (App.now() - App.double_key_date < App.get_setting(`double_key_delay`)) {
          App.double_key_action(e.key)
          return
        }
      }

      App.pressed_key = e.key
      App.double_key_date = App.now()
      e.preventDefault()
    }
    else {
      App.reset_triggers()
    }

    if (App.context_open()) {
      if (e.shiftKey && (e.key === `Enter`)) {
        App.hide_context()
        e.preventDefault()
      }
      else if (e.ctrlKey && (e.key === `ArrowLeft`)) {
        App.hide_context()
        e.preventDefault()
      }
      else if (e.ctrlKey && (e.key === `ArrowDown`)) {
        App.hide_context()
        e.preventDefault()
      }
      else if (e.ctrlKey && (e.key === `ArrowRight`)) {
        App.hide_context()
        e.preventDefault()
      }
    }
    else if (App.popup_open()) {
      let pmode = App.popup_mode()

      if (pmode === `dialog`) {
        if (e.key === `Escape`) {
          App.dismiss_popup(`dialog`)
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
      else if (pmode === `textarea`) {
        if (e.key === `Escape`) {
          App.dismiss_popup(`textarea`)
          e.preventDefault()
          return
        }
        else if (e.key === `Enter`) {
          if (App.textarea_enter(e, false)) {
            e.preventDefault()
          }
        }
      }
      else if (pmode === `alert`) {
        if (e.key === `Enter`) {
          App.hide_alert()
          App.check_textarea_focus()
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
            App.hide_all_popups()
            e.preventDefault()
          }

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
      }
      else if (pmode === `close_tabs`) {
        if (e.key === `ArrowLeft`) {
          App.close_tabs_next(true)
          e.preventDefault()
          return
        }
        else if (e.key === `ArrowRight`) {
          App.close_tabs_next()
          e.preventDefault()
          return
        }
      }
      else if (Addlist.on_addlist()) {
        if (e.key === `Enter`) {
          Addlist.enter()
          e.preventDefault()
          return
        }
        else if (e.key === `Escape`) {
          Addlist.hide(`escape`)
          e.preventDefault()
          return
        }
        else if (e.key === `ArrowLeft`) {
          if (!App.text_with_value_focused()) {
            Addlist.left()
            e.preventDefault()
            return
          }
        }
        else if (e.key === `ArrowRight`) {
          if (!App.text_with_value_focused()) {
            Addlist.right()
            e.preventDefault()
            return
          }
        }
      }

      if (e.key === `Escape`) {
        App.hide_all_popups()
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
      else if (e.key === `ArrowUp`) {
        App.scroll_settings_up_down(`up`)
        e.preventDefault()
        return
      }
      else if (e.key === `ArrowDown`) {
        App.scroll_settings_up_down(`down`)
        e.preventDefault()
        return
      }
      else if (e.key === `PageUp`) {
        App.scroll_settings_up_down(`up`)
        e.preventDefault()
        return
      }
      else if (e.key === `PageDown`) {
        App.scroll_settings_up_down(`down`)
        e.preventDefault()
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
        App.hide_window()
        e.preventDefault()
        return
      }
    }
    else if (mode === `about_info`) {
      if (e.key === `Escape`) {
        if (App.about_filter_focused() && App.filter_has_value(`about_info`)) {
          App.clear_about_filter()
        }
        else {
          App.hide_window()
          App.show_about()
        }

        e.preventDefault()
        return
      }
    }
    else if (mode === `about_lore`) {
      if (e.key === `Escape`) {
        App.hide_window()
        App.show_about()
        e.preventDefault()
        return
      }
    }
    else if (mode === `about_credits`) {
      if (e.key === `Escape`) {
        App.hide_window()
        App.show_about()
        e.preventDefault()
        return
      }
    }
    else if (mode === `color_picker`) {
      if (e.key === `Escape`) {
        App.hide_window()
        e.preventDefault()
        return
      }
      else if (e.key === `Enter`) {
        App.color_picker_enter()
      }
    }
    else if (mode === `signals`) {
      if (e.key === `Escape`) {
        if (App.signals_filter_focused()) {
          App.clear_signals_filter()
        }
        else {
          App.hide_window()
        }

        e.preventDefault()
        return
      }
      else if (e.key === `ArrowUp`) {
        App.on_signals_arrow(true)
        e.preventDefault()
        return
      }
      else if (e.key === `ArrowDown`) {
        App.on_signals_arrow()
        e.preventDefault()
        return
      }
    }
  })

  DOM.ev(document, `keyup`, (e) => {
    if (App.locust_swarm_on) {
      App.stop_locust_swarm()
      return
    }

    if (App.flashlight_on) {
      return
    }

    if (NeedContext.open) {
      return
    }

    if (App.screen_locked) {
      if (App.popup_mode() === `prompt`) {
        if (e.key === `Enter`) {
          App.prompt_submit()
          e.preventDefault()
        }
      }

      return
    }

    App.stop_press_timeout()
    let mode = App.window_mode

    if (App.popup_open()) {
      let pmode = App.popup_mode()

      if (pmode === `dialog`) {
        if (e.key === `Enter`) {
          App.dialog_enter()
          e.preventDefault()
          return
        }
      }
      else if (pmode === `textarea`) {
        if (e.key === `Enter`) {
          if (e.ctrlKey) {
            if (App.textarea_enter(e, true)) {
              e.preventDefault()
            }
          }

          return
        }
      }
      else if (pmode === `palette`) {
        if (e.key === `Enter`) {
          App.palette_enter()
          e.preventDefault()
          return
        }
      }
      else if (pmode === `prompt`) {
        if (e.key === `Enter`) {
          App.prompt_submit()
          e.preventDefault()
          return
        }
      }
      else if (pmode === `close_tabs`) {
        if (e.key === `Enter`) {
          App.close_tabs_action()
          e.preventDefault()
          return
        }
      }
      else if (pmode === `sort_tabs`) {
        if (e.key === `Enter`) {
          App.sort_tabs_action()
          e.preventDefault()
          return
        }
      }
    }
    else if (mode === `signals`) {
      if (e.key === `Enter`) {
        App.on_signals_enter()
        e.preventDefault()
        return
      }
    }
    else if (App.on_settings()) {
      if (e.key === `Enter`) {
        if (App.settings_on_enter()) {
          e.preventDefault()
        }

        return
      }
    }
    else if (App.filter_is_focused()) {
      if (e.key === `Enter`) {
        App.check_filter_enter()
      }
    }
  })
}

App.reset_keyboard = () => {
  App.stop_press_timeout()
  App.pressed_key = undefined
  App.double_key_date = 0
}

App.start_press_timeout = () => {
  App.stop_press_timeout()

  App.press_timeout = setTimeout(() => {
    App.press_action()
  }, App.get_setting(`key_press_delay`))
}

App.stop_press_timeout = () => {
  clearTimeout(App.press_timeout)
}

App.press_action = () => {
  if (App.pressed_key === `Control`) {
    let cmd = App.get_setting(`ctrl_press_command`)
    App.run_command({cmd, from: `ctrl_press`})
  }
  else if (App.pressed_key === `Shift`) {
    let cmd = App.get_setting(`shift_press_command`)
    App.run_command({cmd, from: `shift_press`})
  }

  App.reset_triggers()
}

App.double_key_action = (key) => {
  if (key === `Control`) {
    let cmd = App.get_setting(`double_ctrl_command`)
    App.run_command({cmd, from: `double_ctrl`})
  }
  else if (key === `Shift`) {
    let cmd = App.get_setting(`double_shift_command`)
    App.run_command({cmd, from: `double_shift`})
  }

  App.reset_triggers()
}

App.keyboard_event = (what) => {
  let keydown = new KeyboardEvent(`keydown`, {
    key: what,
    code: what,
    bubbles: true,
    cancelable: true,
  })

  let keyup = new KeyboardEvent(`keyup`, {
    key: what,
    code: what,
    bubbles: true,
    cancelable: true,
  })

  document.dispatchEvent(keydown)
  document.dispatchEvent(keyup)
}

App.trigger_esc_key = () => {
  App.keyboard_event(`Escape`)
}

App.trigger_enter_key = () => {
  App.keyboard_event(`Enter`)
}

App.trigger_backspace_key = () => {
  App.keyboard_event(`Backspace`)
}

App.trigger_up_key = () => {
  App.keyboard_event(`ArrowUp`)
}

App.trigger_down_key = () => {
  App.keyboard_event(`ArrowDown`)
}

App.trigger_left_key = () => {
  App.keyboard_event(`ArrowLeft`)
}

App.trigger_right_key = () => {
  App.keyboard_event(`ArrowRight`)
}

App.on_number_key = (key) => {
  let num = parseInt(key)

  if (num === 0) {
    num = 10
  }

  let active = App.get_setting(`active_trace`)

  if (active) {
    App.pick_active_trace(num)
  }
  else {
    App.focus_tab_number(num)
  }
}

App.keyboard_shortcuts_value = () => {
  return [
    {
      cmd: `show_next_mode`,
      key: `Tab`, ctrl: false, shift: false, alt: false,
      _id_: `kb_next_mode`,
    },
    {
      cmd: `show_previous_mode`,
      key: `Tab`, ctrl: false, shift: true, alt: false,
      _id_: `kb_prev_mode`,
    },
    {
      cmd: `go_to_top`,
      key: `Home`, ctrl: true, shift: false, alt: false,
      _id_: `kb_go_to_top`,
    },
    {
      cmd: `go_to_bottom`,
      key: `End`, ctrl: true, shift: false, alt: false,
      _id_: `kb_go_to_bottom`,
    },
    {
      cmd: `move_tabs_to_top`,
      key: `ArrowUp`, ctrl: true, shift: false, alt: false,
      _id_: `kb_move_top`,
    },
    {
      cmd: `move_tabs_to_bottom`,
      key: `ArrowDown`, ctrl: true, shift: false, alt: false,
      _id_: `kb_move_bottom`,
    },
    {
      cmd: `select_next_item_up`,
      key: `ArrowUp`, ctrl: false, shift: true, alt: false,
      _id_: `kb_next_up`,
    },
    {
      cmd: `select_next_item_down`,
      key: `ArrowDown`, ctrl: false, shift: true, alt: false,
      _id_: `kb_next_down`,
    },
    {
      cmd: `select_items_above`,
      key: `ArrowUp`, ctrl: true, shift: true, alt: false,
      _id_: `kb_select_above`,
    },
    {
      cmd: `select_items_below`,
      key: `ArrowDown`, ctrl: true, shift: true, alt: false,
      _id_: `kb_select_below`,
    },
    {
      cmd: `jump_tabs_playing_down`,
      key: `Period`, ctrl: true, shift: false, alt: false,
      _id_: `kb_playing_down`,
    },
    {
      cmd: `recent_tabs_backwards`,
      key: `Comma`, ctrl: true, shift: false, alt: false,
      _id_: `kb_prev_tab`,
    },
    {
      cmd: `show_filter_menu`,
      key: `KeyF`, ctrl: true, shift: false, alt: false,
      _id_: `kb_filter_menu`,
    },
    {
      cmd: `select_all_items`,
      key: `KeyA`, ctrl: true, shift: false, alt: false,
      _id_: `kb_select_all`,
    },
    {
      cmd: `show_item_menu`,
      key: `Enter`, ctrl: false, shift: true, alt: false,
      _id_: `kb_item_menu`,
    },
    {
      cmd: `focus_parent_tab`,
      key: `ArrowLeft`, ctrl: true, shift: false, alt: false,
      _id_: `kb_focus_parent`,
    },
    {
      cmd: `filter_node_tabs`,
      key: `ArrowRight`, ctrl: true, shift: false, alt: false,
      _id_: `kb_filter_nodes`,
    },
    {
      cmd: `jump_tabs_zone_up`,
      key: `ArrowUp`, ctrl: false, shift: false, alt: true,
      _id_: `kb_zone_up`,
    },
    {
      cmd: `jump_tabs_zone_down`,
      key: `ArrowDown`, ctrl: false, shift: false, alt: true,
      _id_: `kb_zone_down`,
    },
  ]
}

App.start_keyboard_addlist = () => {
  if (App.keyboard_addlist_ready) {
    return
  }

  let {popobj, regobj} = App.get_setting_addlist_objects()
  let id = `settings_keyboard_shortcuts`
  let props = App.setting_props.keyboard_shortcuts

  App.create_popup({...popobj, id: `addlist_${id}`,
    element: Addlist.register({...regobj, id,
      keys: [`key`, `cmd`, `ctrl`, `shift`, `alt`],
      widgets: {
        key: `key`,
        cmd: `menu`,
        ctrl: `checkbox`,
        shift: `checkbox`,
        alt: `checkbox`,
      },
      labels: {
        key: `Key`,
        cmd: `Command`,
        ctrl: `Require Ctrl`,
        shift: `Require Shift`,
        alt: `Require Alt`,
      },
      sources: {
        cmd: () => {
          return App.cmdlist_single.slice(0)
        },
        ctrl: () => {
          return true
        },
        shift: () => {
          return false
        },
        alt: () => {
          return false
        },
      },
      list_icon: (item) => {
        return App.settings_cmd_icon(item.cmd)
      },
      list_text: (item) => {
        let cmd = App.settings_cmd_name(item.cmd)
        let mods = []

        if (item.ctrl) {
          mods.push(`C`)
        }

        if (item.shift) {
          mods.push(`S`)
        }

        if (item.alt) {
          mods.push(`A`)
        }

        let pre = ``

        if (mods.length) {
          pre = `(${mods.join(``)})`
        }

        let text = `${pre} ${item.key}`.trim()
        return `${text} = ${cmd}`
      },
      required: {
        cmd: true,
      },
      tooltips: {
        key: `When this key is pressed`,
        cmd: `Run this command`,
        ctrl: `If Ctrl is pressed`,
        shift: `If Shift is pressed`,
        alt: `If Alt is pressed`,
      },
      title: props.name,
    })})

  App.keyboard_addlist_ready = true
}