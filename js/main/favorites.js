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

  if (App.fav_autohide_enabled()) {
    cls += ` hidden`
  }

  let tips = App.get_setting(`show_tooltips`)
  let bar = DOM.create(`div`, cls, `favorites_bar_${mode}`)
  let empty_top = DOM.create(`div`, `favorites_empty favorites_empty_top`, `favorites_empty_top_${mode}`)

  if (tips) {
    App.trigger_title(empty_top, `double_click_favorites_top`)
    App.trigger_title(empty_top, `middle_click_favorites_top`)
    App.trigger_title(empty_top, `wheel_up_favorites_top`)
    App.trigger_title(empty_top, `wheel_down_favorites_top`)
    App.trigger_title(empty_top, `wheel_up_shift_favorites_top`)
    App.trigger_title(empty_top, `wheel_down_shift_favorites_top`)
  }

  let empty_bottom = DOM.create(`div`, `favorites_empty favorites_empty_bottom`, `favorites_empty_bottom_${mode}`)

  if (tips) {
    App.trigger_title(empty_bottom, `double_click_favorites_bottom`)
    App.trigger_title(empty_bottom, `middle_click_favorites_bottom`)
    App.trigger_title(empty_bottom, `wheel_up_favorites_bottom`)
    App.trigger_title(empty_bottom, `wheel_down_favorites_bottom`)
    App.trigger_title(empty_bottom, `wheel_up_shift_favorites_bottom`)
    App.trigger_title(empty_bottom, `wheel_down_shift_favorites_bottom`)
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
    if (App.fav_autohide_enabled()) {
      App.on_favorites_enter(mode)
    }
  })

  DOM.ev(container, `mouseleave`, () => {
    if (App.fav_autohide_enabled()) {
      App.on_favorites_leave(mode)
    }
  })

  container.append(empty_top)
  container.append(bar)
  container.append(empty_bottom)
  return container
}

App.on_favorites_enter = (mode) => {
  App.clear_favorite_bar_autohide()
  App.favorites_bar_show_debouncer.call(mode)
}

App.on_favorites_leave = (mode) => {
  App.clear_favorite_bar_autohide()
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
  c.innerHTML = ``

  for (let fav of favs) {
    let btn = DOM.create(`div`, `favorites_bar_item button button_3`)
    let icon = DOM.create(`div`, `favorites_bar_icon`)
    let icon_s = fav.cmd.icon

    if (icon_s instanceof Node) {
      icon_s = icon_s.cloneNode(true)
    }

    icon.append(icon_s)
    btn.append(icon)
    btn.title = fav.cmd.name

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
      btn.title += `\nMiddle: ${middle.name}`

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

    c.append(btn)
  }
}

App.show_favorites_menu = (e) => {
  let items = App.custom_menu_items({
    name: App.get_mode_favorites(),
  })

  App.sep(items)

  items.push({
    text: `Toggle`,
    icon: App.settings_icons.favorites,
    action: () => {
      App.toggle_favorites()
    },
  })

  if (App.favorites_bar_side()) {
    items.push({
      text: `Autohide`,
      icon: App.settings_icons.favorites,
      action: () => {
        App.toggle_favorites_autohide()
      },
    })
  }

  let positions = []
  let c_pos = App.get_setting(`favorites_position`)
  let pos_opts = [`top`, `left`, `right`, `bottom`, `button`].filter(x => x !== c_pos)

  for (let mode of pos_opts) {
    positions.push({
      text: App.capitalize(mode),
      action: () => {
        App.set_favorites_position(mode)
        App.do_apply_theme()
        App.clear_show()
      },
    })
  }

  items.push({
    icon: App.settings_icons.favorites,
    text: `Position`,
    items: positions,
  })

  items.push({
    icon: App.settings_icons.favorites,
    text: `Settings`,
    action: () => {
      App.show_settings_category(`favorites`)
    },
  })

  App.show_context({items, e})
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

App.clear_favorite_bar_autohide = () => {
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
}

App.favorites_bar_side = () => {
  let pos = App.get_setting(`favorites_position`)
  return [`left`, `right`].includes(pos)
}

App.fav_autohide_enabled = () => {
  return App.get_setting(`favorites_autohide`) && App.favorites_bar_side()
}

App.toggle_favorites_autohide = () => {
  let autohide = !App.get_setting(`favorites_autohide`)
  App.set_setting({setting: `favorites_autohide`, value: autohide})
  App.check_refresh_settings()

  if (App.fav_autohide_enabled()) {
    App.alert_autohide(`Favorites Autohide Enabled`)
    App.on_favorites_leave(App.active_mode)
  }
  else {
    App.alert_autohide(`Favorites Autohide Disabled`)
    App.on_favorites_enter(App.active_mode)
  }
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