App.setup_favorites = () => {
  App.favorites_bar_show_debouncer = App.create_debouncer((mode) => {
    App.do_favorites_bar_show(mode)
  }, App.favorites_bar_show_delay)

  App.favorites_bar_hide_debouncer = App.create_debouncer((mode) => {
    App.do_favorites_bar_hide(mode)
  }, App.favorites_bar_hide_delay)
}

App.favorites_bar_enabled = () => {
  let fav_pos = App.get_setting(`favorites_position`)

  if (fav_pos === `button`) {
    return false
  }

  return true
}

App.create_favorites_bar = (mode) => {
  if (!App.favorites_bar_enabled()) {
    return
  }

  let fav_pos = App.get_setting(`favorites_position`)
  let container = DOM.create(`div`, `favorites_bar_container`, `favorites_bar_container_${mode}`)
  let cls = `favorites_bar`

  if (App.fav_auto_hide_enabled()) {
    cls += ` hidden`
  }

  let tips = App.tooltips()
  let bar = DOM.create(`div`, cls, `favorites_bar_${mode}`)
  let empty_top = DOM.create(`div`, `favorites_empty favorites_empty_top`, `favorites_empty_top_${mode}`)

  if (tips) {
    App.fav_tips_empty(empty_top, `top`)
  }

  let empty_bottom = DOM.create(`div`, `favorites_empty favorites_empty_bottom`, `favorites_empty_bottom_${mode}`)

  if (tips) {
    App.fav_tips_empty(empty_bottom, `bottom`)
  }

  if (fav_pos === `top`) {
    container.classList.add(`fav_top`)
  }
  else if (fav_pos === `left`) {
    container.classList.add(`fav_left`)
  }
  else if (fav_pos === `right`) {
    container.classList.add(`fav_right`)
  }
  else if (fav_pos === `bottom`) {
    container.classList.add(`fav_bottom`)
  }

  DOM.ev(container, `mouseenter`, () => {
    if (App.fav_auto_hide_enabled()) {
      App.on_favorites_enter(mode)
    }
  })

  DOM.ev(container, `mouseleave`, () => {
    if (App.fav_auto_hide_enabled() && !App.fav_hover()) {
      App.on_favorites_leave(mode)
    }
  })

  let all = `#all`

  DOM.ev(all, `mouseenter`, () => {
    if (App.fav_auto_hide_enabled() && App.fav_hover()) {
      App.on_favorites_enter(mode)
    }
  })

  DOM.ev(all, `mouseleave`, () => {
    if (App.fav_auto_hide_enabled() && App.fav_hover()) {
      App.on_favorites_leave(mode)
    }
  })

  container.append(empty_top)
  container.append(bar)
  container.append(empty_bottom)
  return container
}

App.on_favorites_enter = (mode) => {
  App.clear_favorite_bar_auto_hide()
  App.favorites_bar_show_debouncer.call(mode)
}

App.on_favorites_leave = (mode) => {
  App.clear_favorite_bar_auto_hide()
  App.favorites_bar_hide_debouncer.call(mode)
}

App.create_favorites_button = (mode) => {
  let btn = DOM.create(`div`, `favorites_button button`, `favorites_button_${mode}`)
  btn.textContent = App.settings_icons.favorites
  btn.title = `Favorites`
  App.trigger_title(btn, `middle_click_favorites_button`)
  return btn
}

App.fill_favorites_bar = (mode = App.active_mode) => {
  if (!App.favorites_bar_enabled()) {
    return
  }

  let favs = App.get_favorites()
  let c = DOM.el(`#favorites_bar_${mode}`)
  let tips = App.tooltips()
  c.innerHTML = ``

  for (let fav of favs) {
    let btn = DOM.create(`div`, `favorites_bar_item button button_3`)
    let icon = DOM.create(`div`, `favorites_bar_icon`)
    let icon_s = App.clone_if_node(fav.cmd.icon)
    icon.append(icon_s)
    btn.append(icon)

    if (tips) {
      btn.title = fav.cmd.name
    }

    DOM.ev(btn, `click`, (e) => {
      let cmd

      if (e.shiftKey) {
        cmd = fav.fav.shift
      }
      else if (e.ctrlKey) {
        cmd = fav.fav.ctrl
      }
      else if (e.altKey) {
        cmd = fav.fav.alt
      }
      else {
        cmd = fav.cmd.cmd
      }

      let args = {
        cmd,
        e,
      }

      App.run_command(args)
    })

    let middle = App.get_command(fav.fav.middle)

    if (middle) {
      if (tips) {
        btn.title += `\nMiddle: ${middle.name}`
      }

      DOM.ev(btn, `auxclick`, (e) => {
        if (e.button === 1) {
          let args = {
            cmd: middle.cmd,
            e,
          }

          App.run_command(args)
        }
      })
    }

    let shift = App.get_command(fav.fav.shift)

    if (tips) {
      if (shift) {
        btn.title += `\nShift: ${shift.name}`
      }

      let ctrl = App.get_command(fav.fav.ctrl)

      if (ctrl) {
        btn.title += `\nCtrl: ${ctrl.name}`
      }

      let alt = App.get_command(fav.fav.alt)

      if (alt) {
        btn.title += `\nAlt: ${alt.name}`
      }

      App.trigger_title(btn, `wheel_up_favorites_center`)
      App.trigger_title(btn, `wheel_down_favorites_center`)
      App.trigger_title(btn, `wheel_up_shift_favorites_center`)
      App.trigger_title(btn, `wheel_down_shift_favorites_center`)
    }

    c.append(btn)
  }
}

App.show_favorites_menu = (e) => {
  let items = App.custom_menu_items({
    name: App.get_mode_favorites(),
  })

  App.sep(items)
  let more = []

  more.push({
    text: `Toggle`,
    icon: App.settings_icons.favorites,
    action: () => {
      App.toggle_favorites()
    },
  })

  if (App.favorites_bar_side()) {
    more.push({
      text: `Auto Hide`,
      icon: App.settings_icons.favorites,
      action: () => {
        App.toggle_favorites_auto_hide()
      },
    })
  }

  let positions = []

  let pos_opts = [
    `top`,
    `left`,
    `right`,
    `bottom`,
    `sep`,
    `button`,
  ]

  for (let mode of pos_opts) {
    if (mode === `sep`) {
      App.sep(positions)
      continue
    }

    positions.push({
      text: App.capitalize(mode),
      action: () => {
        App.set_favorites_position(mode)
        App.do_apply_theme()
        App.clear_show()
      },
    })
  }

  more.push({
    icon: App.settings_icons.favorites,
    text: `Position`,
    items: positions,
  })

  more.push({
    icon: App.settings_icons.favorites,
    text: `Settings`,
    action: () => {
      App.show_settings_category(`favorites`)
    },
  })

  items.push({
    text: `More`,
    icon: App.settings_icons.favorites,
    items: more,
  })

  let compact = App.get_setting(`compact_favorites_menu`)

  App.show_context({
    e,
    items,
    compact,
    title: `Favorites`,
    title_icon: App.settings_icons.favorites,
    title_number: true,
  })
}

App.get_mode_favorites = () => {
  let sett = `favorites_menu_${App.active_mode}`
  let mode_menu = App.get_setting(sett)

  if (mode_menu.length) {
    return sett
  }

  return `favorites_menu`
}

App.get_favorites = () => {
  let sett = App.get_mode_favorites()
  let favorites = App.get_setting(sett)
  let favs = []

  for (let fav of favorites) {
    let c = App.get_command(fav.cmd)

    if (c) {
      favs.push({
        cmd: c,
        fav,
      })
    }
  }

  return favs
}

App.favorites_double_click = (e, where) => {
  let cmd = App.get_setting(`double_click_favorites_${where}`)
  let command = App.get_command(cmd)

  if (command) {
    let args = {
      cmd: command.cmd,
      e,
    }

    App.run_command(args)
  }
}

App.favorites_middle_click = (e) => {
  if (DOM.parent(e.target, [`.favorites_bar_item`])) {
    return
  }

  if (DOM.class(e.target, [`favorites_button`])) {
    return
  }

  let cmd = App.get_setting(`middle_click_favorites`)
  let command = App.get_command(cmd)

  if (command) {
    let args = {
      cmd: command.cmd,
      e,
    }

    App.run_command(args)
  }
}

App.do_favorites_bar_show = (mode) => {
  let bar = DOM.el(`#favorites_bar_${mode}`)
  DOM.show(bar)
}

App.do_favorites_bar_hide = (mode) => {
  let bar = DOM.el(`#favorites_bar_${mode}`)
  DOM.hide(bar)
}

App.clear_favorite_bar_auto_hide = () => {
  App.favorites_bar_show_debouncer.cancel()
  App.favorites_bar_hide_debouncer.cancel()
}

App.set_show_favorites = (what) => {
  App.set_setting({setting: `show_favorites`, value: what})
  App.check_refresh_settings()
}

App.set_favorites_position = (pos) => {
  App.set_setting({setting: `favorites_position`, value: pos})
  App.check_refresh_settings()
}

App.init_favorites = (mode) => {
  if (App.get_setting(`show_favorites`)) {
    App.show_favorites(mode)
  }
  else {
    App.hide_favorites()
  }
}

App.show_favorites = (mode, set = false) => {
  App.main_add(`show_favorites`)
  App.fill_favorites_bar(mode)

  if (set) {
    App.set_show_favorites(true)
  }
}

App.hide_favorites = (set = false) => {
  App.main_remove(`show_favorites`)

  if (set) {
    App.set_show_favorites(false)
  }
}

App.toggle_favorites = (mode = App.active_mode) => {
  if (App.get_setting(`show_favorites`)) {
    App.hide_favorites(true)
  }
  else {
    App.show_favorites(mode, true)
  }

  App.toggle_message(`Favorites`, `show_favorites`)
}

App.favorites_bar_side = () => {
  let pos = App.get_setting(`favorites_position`)
  return [`left`, `right`].includes(pos)
}

App.fav_auto_hide_enabled = () => {
  return App.get_setting(`favorites_auto_hide`) && App.favorites_bar_side()
}

App.toggle_favorites_auto_hide = () => {
  let auto_hide = !App.get_setting(`favorites_auto_hide`)
  App.set_setting({setting: `favorites_auto_hide`, value: auto_hide})
  App.check_refresh_settings()

  if (App.fav_auto_hide_enabled()) {
    App.on_favorites_leave(App.active_mode)
  }
  else {
    App.on_favorites_enter(App.active_mode)
  }

  App.toggle_message(`Fav Auto Hide`, `favorites_auto_hide`)
}

App.fav_empty_top_click = (e) => {
  let cmd = App.get_setting(`click_favorites_top`)
  App.run_command({cmd, from: `favorites_empty`, e})
}

App.fav_empty_bottom_click = (e) => {
  let cmd = App.get_setting(`click_favorites_bottom`)
  App.run_command({cmd, from: `favorites_empty`, e})
}

App.favorites_button_middle_click = (e) => {
  let cmd = App.get_setting(`middle_click_favorites_button`)
  App.run_command({cmd, from: `favorites_button`, e})
}

App.favorites_empty_top_middle_click = (e) => {
  let cmd = App.get_setting(`middle_click_favorites_top`)
  App.run_command({cmd, from: `favorites_empty`, e})
}

App.favorites_empty_bottom_middle_click = (e) => {
  let cmd = App.get_setting(`middle_click_favorites_bottom`)
  App.run_command({cmd, from: `favorites_empty`, e})
}

App.fav_tips_empty = (el, where) => {
  App.trigger_title(el, `click_favorites_${where}`)
  App.trigger_title(el, `double_click_favorites_${where}`)
  App.trigger_title(el, `middle_click_favorites_${where}`)
  App.trigger_title(el, `click_press_favorites_${where}`)
  App.trigger_title(el, `middle_click_press_favorites_${where}`)
  App.trigger_title(el, `wheel_up_favorites_${where}`)
  App.trigger_title(el, `wheel_down_favorites_${where}`)
  App.trigger_title(el, `wheel_up_shift_favorites_${where}`)
  App.trigger_title(el, `wheel_down_shift_favorites_${where}`)
}

App.favorites_scrollable = () => {
  return App.get_setting(`favorites_scroll`)
}

App.favorites_overflowed = () => {
  let c = DOM.el(`#favorites_bar_container_tabs`)
  return c.scrollHeight > c.clientHeight
}

App.favorites_wheel = (e) => {
  return e.shiftKey || !App.favorites_scrollable() || !App.favorites_overflowed()
}

App.fav_hover = () => {
  return App.get_setting(`favorites_hover`)
}