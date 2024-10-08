App.setup_favorites = () => {
  App.favorites_bar_show_debouncer = App.create_debouncer(() => {
    App.do_favorites_bar_show()
  }, App.favorites_bar_show_delay)

  App.favorites_bar_hide_debouncer = App.create_debouncer(() => {
    App.do_favorites_bar_hide()
  }, App.favorites_bar_hide_delay)
}

App.favorites_bar_enabled = () => {
  let fav_pos = App.get_setting(`favorites_position`)

  if (fav_pos === `button`) {
    return false
  }

  return true
}

App.favorites_bar_side = () => {
  let fav_pos = App.get_setting(`favorites_position`)

  if ((fav_pos === `left`) || (fav_pos === `right`)) {
    return true
  }

  return false
}

App.create_favorites_bar = () => {
  if (!App.favorites_bar_enabled()) {
    return
  }

  let fav_pos = App.get_setting(`favorites_position`)
  let autohide = App.get_setting(`favorites_autohide`)
  let container = DOM.create(`div`, ``, `favorites_bar_container`)
  let cls = ``

  if (autohide) {
    cls += ` hidden`
  }

  let tips = App.get_setting(`show_tooltips`)
  let bar = DOM.create(`div`, cls, `favorites_bar`)
  let empty_top = DOM.create(`div`, `favorites_empty`, `favorites_empty_top`)

  if (tips) {
    App.trigger_title(empty_top, `double_click_favorites_top`)
    App.trigger_title(empty_top, `middle_click_favorites_top`)
    App.trigger_title(empty_top, `wheel_up_favorites_top`)
    App.trigger_title(empty_top, `wheel_down_favorites_top`)
  }

  let empty_bottom = DOM.create(`div`, `favorites_empty`, `favorites_empty_bottom`)

  if (tips) {
    App.trigger_title(empty_bottom, `double_click_favorites_bottom`)
    App.trigger_title(empty_bottom, `middle_click_favorites_bottom`)
    App.trigger_title(empty_bottom, `wheel_up_favorites_bottom`)
    App.trigger_title(empty_bottom, `wheel_down_favorites_bottom`)
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

  DOM.ev(bar, `contextmenu`, (e) => {
    e.preventDefault()
    App.show_favorites_menu(e)
  })

  DOM.ev(empty_top, `click`, (e) => {
    App.check_double_click(`fav_top`, e, () => {
      App.favorites_double_click(e, `top`)
    })
  })

  DOM.ev(empty_top, `contextmenu`, (e) => {
    e.preventDefault()
    App.show_favorites_menu(e)
  })

  DOM.ev(empty_bottom, `click`, (e) => {
    App.check_double_click(`fav_bottom`, e, () => {
      App.favorites_double_click(e, `bottom`)
    })
  })

  DOM.ev(empty_bottom, `contextmenu`, (e) => {
    e.preventDefault()
    App.show_favorites_menu(e)
  })

  DOM.ev(container, `mouseenter`, () => {
    if (App.get_setting(`favorites_autohide`)) {
      App.on_favorites_enter()
    }
  })

  DOM.ev(container, `mouseleave`, () => {
    if (App.get_setting(`favorites_autohide`)) {
      App.on_favorites_leave()
    }
  })

  container.append(empty_top)
  container.append(bar)
  container.append(empty_bottom)
  return container
}

App.on_favorites_enter = () => {
  App.clear_favorite_bar_autohide()
  App.favorites_bar_show_debouncer.call()
}

App.on_favorites_leave = () => {
  App.clear_favorite_bar_autohide()
  App.favorites_bar_hide_debouncer.call()
}

App.fill_favorites_bar = () => {
  if (!App.favorites_bar_enabled()) {
    return
  }

  let favs = App.get_favorites()
  let c = DOM.el(`#favorites_bar`)
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

    c.append(btn)
  }
}

App.show_favorites_menu = (e) => {
  let items = App.custom_menu_items({
    name: `favorites_menu`,
  })

  App.sep(items)

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

App.get_favorites = () => {
  let favorites = App.get_setting(`favorites_menu`)
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

App.do_favorites_bar_show = () => {
  let bar = DOM.el(`#favorites_bar`)
  DOM.show(bar)
}

App.do_favorites_bar_hide = () => {
  let bar = DOM.el(`#favorites_bar`)
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

App.init_favorites = () => {
  if (App.get_setting(`show_favorites`)) {
    App.show_favorites()
  }
  else {
    App.hide_favorites()
  }
}

App.show_favorites = (set = false) => {
  App.main_add(`show_favorites`)
  App.fill_favorites_bar()

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

App.toggle_favorites = () => {
  if (App.get_setting(`show_favorites`)) {
    App.hide_favorites(true)
  }
  else {
    App.show_favorites(true)
  }
}

App.toggle_favorites_autohide = () => {
  let autohide = !App.get_setting(`favorites_autohide`)
  App.set_setting({setting: `favorites_autohide`, value: autohide})
  App.check_refresh_settings()

  if (autohide) {
    App.alert_autohide(`Favorites Autohide Enabled`)
    App.on_favorites_leave()
  }
  else {
    App.alert_autohide(`Favorites Autohide Disabled`)
    App.on_favorites_enter()
  }
}