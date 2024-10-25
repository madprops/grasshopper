App.get_mouse_item = (mode, target) => {
  if (!App.mouse_valid_type(target)) {
    return
  }

  let tb_item = DOM.parent(target, [`.tab_box_tabs_item`])

  if (tb_item) {
    let id = tb_item.dataset.id
    return [App.get_item_by_id(`tabs`, id), tb_item]
  }

  let el = DOM.parent(target, [`.${mode}_item`])

  if (!el) {
    return [undefined, undefined]
  }

  let item = App.get_item_by_id(mode, el.dataset.id)

  if (!item) {
    el.remove()
    return [undefined, undefined]
  }

  return [item, undefined]
}

App.setup_mouse = () => {
  DOM.ev(window, `mousedown`, (e) => {
    if (e.button === 1) {
      e.preventDefault()
    }
  })

  DOM.ev(window, `mouseup`, (e) => {
    if (e.button === 0) {
      App.icon_pick_down = false
    }
  })

  DOM.ev(window, `wheel`, (e) => {
    App.on_mouse_wheel(e)
  })

  let container = DOM.el(`#main`)

  DOM.ev(container, `mousedown`, (e) => {
    App.on_mouse_down(e)
  })

  DOM.ev(container, `click`, (e) => {
    // Using this on mousedown instead causes some problems
    // For instance can't move a tab without selecting it
    // And in a popup it would close the popup on selection
    App.mouse_click_action(e)
  })

  DOM.ev(container, `contextmenu`, (e) => {
    App.mouse_context_action(e)
  })

  DOM.ev(container, `mouseover`, (e) => {
    App.mouse_over_action(e)
  })

  DOM.ev(container, `mouseout`, (e) => {
    App.mouse_out_action(e)
  })

  DOM.ev(container, `mousemove`, (e) => {
    App.mouse_move_action(e)
  })

  App.mouse_over_debouncer = App.create_debouncer((e) => {
    App.do_mouse_over_action(e)
  }, App.mouse_over_delay)

  App.mouse_out_debouncer = App.create_debouncer((e) => {
    App.do_mouse_out_action(e)
  }, App.mouse_out_delay)

  App.refresh_mouse()
}

App.refresh_mouse = () => {
  App.add_mouse_inside_debouncer = App.create_debouncer((e) => {
    App.do_add_mouse_inside()
  }, App.get_setting(`mouse_inside_delay`))

  App.remove_mouse_inside_debouncer = App.create_debouncer((e) => {
    App.do_remove_mouse_inside()
  }, App.get_setting(`mouse_outside_delay`))
}

App.reset_mouse = () => {
  clearTimeout(App.click_press_timeout)
  App.click_press_button = undefined
  App.click_press_triggered = false
}

App.start_click_press_timeout = (e) => {
  clearTimeout(App.click_press_timeout)

  App.click_press_timeout = setTimeout(() => {
    App.click_press_action(e)
  }, App.get_setting(`click_press_delay`))
}

App.on_mouse_wheel = (e) => {
  let target = e.target
  let mode = App.window_mode

  if (!App.mouse_valid_type(target)) {
    return
  }

  let direction = App.wheel_direction(e)

  if (DOM.parent(target, [`.main_menu_button`])) {
    if (direction === `up`) {
      App.cycle_modes(true)
    }
    else if (direction === `down`) {
      App.cycle_modes(false)
    }

    return
  }

  if (DOM.parent(target, [`.scroller`])) {
    if (direction === `up`) {
      if (e.shiftKey) {
        App.scroll_page(mode, `up`)
      }
      else {
        App.scroll(mode, `up`)
      }
    }
    else if (direction === `down`) {
      if (e.shiftKey) {
        App.scroll_page(mode, `down`)
      }
      else {
        App.scroll(mode, `down`)
      }
    }
  }
  else if (DOM.parent(target, [`.filter_menu_button`])) {
    let direction = App.wheel_direction(e)

    if (direction === `up`) {
      App.cycle_filter_modes(mode, true, e)
    }
    else if (direction === `down`) {
      App.cycle_filter_modes(mode, false, e)
    }
  }
  else if (target.closest(`.favorites_empty_top`)) {
    App.wheel_action(direction, `favorites_top`, e)
  }
  else if (target.closest(`.favorites_bar`)) {
    App.wheel_action(direction, `favorites_center`, e)
  }
  else if (target.closest(`.favorites_empty_bottom`)) {
    App.wheel_action(direction, `favorites_bottom`, e)
  }
  else if (target.closest(`.favorites_button`)) {
    App.wheel_action(direction, `favorites_button`, e)
  }
  else if (target.closest(`#footer`)) {
    App.wheel_action(direction, `footer`, e)
  }
  else if (target.closest(`#main_title`)) {
    App.wheel_action(direction, `main_title`, e)
  }
  else if (DOM.parent(target, [`#pinline`])) {
    App.wheel_action(direction, `pinline`, e)
  }
  else if (DOM.parent(target, [`.playing_button`])) {
    App.wheel_action(direction, `playing`, e)
  }
  else if (DOM.parent(target, [`.step_back_button`])) {
    App.wheel_action(direction, `step_back`, e)
  }
  else if (DOM.parent(target, [`.actions_button`])) {
    App.wheel_action(direction, `actions_menu`, e)
  }
  else if (DOM.parent(target, [`#tab_box_title`])) {
    App.wheel_action(direction, `tab_box_title`, e)
  }
  else if (DOM.parent(target, [`#tab_box_container`])) {
    App.wheel_action(direction, `tab_box`, e)
  }
  else if (DOM.parent(target, [`.item_container`])) {
    App.wheel_action(direction, `items`, e)
  }
}

App.wheel_action = (direction, name, e) => {
  let target = e.target
  let mode = App.window_mode

  if (e.shiftKey) {
    name = `shift_${name}`
  }

  if (direction === `up`) {
    name = `wheel_up_${name}`
  }
  else if (direction === `down`) {
    name = `wheel_down_${name}`
  }

  if (!App.settings[name]) {
    return
  }

  let item, item_alt

  if (App.get_setting(`wheel_hover_item`)) {
    [item, item_alt] = App.get_mouse_item(mode, target)
  }

  let cmd = App.get_setting(name)
  App.run_command({cmd, item, from: `mouse`, e})
}

App.check_double_click = (what, e) => {
  let click_date = App[`click_date_${what}`]
  let click_target = App[`click_target_${what}`]
  let target = e.target

  if (click_date === undefined) {
    App[`click_date_${what}`] = 0
  }

  let double_delay = App.get_setting(`double_click_delay`)
  let date_now = App.now()
  let double = false

  if ((date_now - click_date) < double_delay) {
    if (click_target === target) {
      double = true
    }
  }

  App[`click_target_${what}`] = target

  if (double) {
    App[`click_date_${what}`] = 0
    return true
  }

  App[`click_date_${what}`] = date_now
  return false
}

App.on_mouse_down = (e) => {
  let target = e.target
  let mode = App.active_mode
  App.reset_triggers()

  if (App.get_setting(`icon_pick`)) {
    if (e.button === 0) {
      if (DOM.parent(target, [`.item_icon_container`])) {
        let [item, item_alt] = App.get_mouse_item(mode, target)

        if (item) {
          App.pick(item)

          if (item.selected) {
            App.icon_pick_down = true
          }

          return
        }
      }
    }
  }

  if (e.button === 0 || e.button === 1) {
    App.click_press_button = e.button
    App.click_press_triggered = false
    App.start_click_press_timeout(e)
  }
}

App.mouse_valid_type = (target) => {
  if (!target) {
    return false
  }

  if (target.nodeType !== 1) {
    return false
  }

  return true
}

App.mouse_event = (what, type = `normal`) => {
  let target = document.elementFromPoint(App.mouse_x, App.mouse_y)

  if (!target) {
    return
  }

  let button

  if (type === `middle`) {
    button = 1
  }

  let ev = new MouseEvent(what, {
    view: window,
    bubbles: true,
    cancelable: true,
    clientX: App.mouse_x,
    clientY: App.mouse_y,
    button,
  })

  if (type === `middle`) {
    App.mouse_middle_action(ev, target)
  }
  else {
    target.dispatchEvent(ev)
  }
}

App.trigger_left_click = () => {
  App.mouse_event(`click`)
}

App.trigger_right_click = () => {
  App.mouse_event(`contextmenu`)
}

App.trigger_middle_click = () => {
  App.mouse_event(`auxclick`, `middle`)
}

App.empty_double_click = (mode, e) => {
  let cmd = App.get_setting(`double_click_empty_${mode}`)
  App.run_command({cmd, from: `empty`, e})
}

App.mouse_inside_check = () => {
  App.add_mouse_inside_debouncer.cancel()
  App.remove_mouse_inside_debouncer.cancel()

  if (App.mouse_inside) {
    App.add_mouse_inside()
  }
  else {
    App.remove_mouse_inside()
  }
}

App.add_mouse_inside = () => {
  App.add_mouse_inside_debouncer.call()
}

App.remove_mouse_inside = () => {
  App.remove_mouse_inside_debouncer.call()
}

App.do_add_mouse_inside = () => {
  DOM.el(`#main`).classList.add(`mouse_inside`)
}

App.do_remove_mouse_inside = () => {
  DOM.el(`#main`).classList.remove(`mouse_inside`)
}

App.check_pick_button = (what, item, e) => {
  function show_menu() {
    App[`show_${what}_button_menu`](item, e)
  }

  if (App.get_setting(`${what}_button_pick`)) {
    let selected = App.selected_items(item.mode)
    let pick = true

    if (selected.length <= 1) {
      if (selected[0] === item) {
        show_menu()
        pick = false
      }
    }

    if (pick) {
      App.pick(item)
    }
  }
  else {
    show_menu()
  }

  return
}

App.mouse_press_action = (s1, s2, obj) => {
  if (DOM.parent(obj.target, [s1])) {
    if (App.click_press_button === 0) {
      let cmd = App.get_setting(`click_press_${s2}`)
      App.run_command({cmd, from: `click_press`, e: obj.e, item: obj.item})
    }
    else if (App.click_press_button === 1) {
      let cmd = App.get_setting(`middle_click_press_${s2}`)
      App.run_command({cmd, from: `click_press`, e: obj.e, item: obj.item})
    }

    App.click_press_triggered = true
    return true
  }

  return false
}

App.mouse_over_action = (e) => {
  App.mouse_over_debouncer.call(e)
}

App.mouse_out_action = (e) => {
  App.mouse_out_debouncer.call(e)
}

App.get_unloaded_mouse_command = (item, what) => {
  if (item.unloaded) {
    let ucmd = App.get_setting(`${what}_unloaded_tab`)

    if (ucmd && (ucmd !== `none`)) {
      return ucmd
    }
  }
}