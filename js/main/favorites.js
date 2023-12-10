App.setup_favorites = () => {
  App.favorites_bar_show_debouncer = App.create_debouncer((mode) => {
    App.do_favorites_bar_show(mode)
  }, App.favorites_bar_show_delay)

  App.favorites_bar_hide_debouncer = App.create_debouncer((mode) => {
    App.do_favorites_bar_hide(mode)
  }, App.favorites_bar_hide_delay)
}

App.favorites_bar_active = () => {
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

App.create_favorites_bar = (mode) => {
  if (!App.favorites_bar_active()) {
    return
  }

  let fav_pos = App.get_setting(`favorites_position`)
  let autohide = App.get_setting(`favorites_autohide`)
  let container = DOM.create(`div`, `favorites_bar_container`, `favorites_bar_container_${mode}`)
  let cls = `favorites_bar`

  if (autohide) {
    cls += ` hidden`
  }

  let bar = DOM.create(`div`, cls, `favorites_bar_${mode}`)
  bar.title = App.favorites_title

  if (fav_pos === `top`) {
    bar.classList.add(`fav_top`)
  }
  else if (fav_pos === `left`) {
    bar.classList.add(`fav_left`)
  }
  else if (fav_pos === `right`) {
    bar.classList.add(`fav_right`)
  }
  else if (fav_pos === `bottom`) {
    bar.classList.add(`fav_bottom`)
  }

  DOM.ev(bar, `contextmenu`, (e) => {
    e.preventDefault()
    App.show_favorites_menu(e)
  })

  DOM.ev(container, `dblclick`, (e) => {
    App.favorites_double_click(e)
  })

  DOM.ev(container, `auxclick`, (e) => {
    if (e.button === 1) {
      App.favorites_middle_click(e)
    }
  })

  if (autohide) {
    DOM.ev(container, `mouseenter`, () => {
      App.clear_favorite_bar_autohide()
      App.favorites_bar_show_debouncer.call(mode)
    })

    DOM.ev(container, `mouseleave`, () => {
      App.clear_favorite_bar_autohide()
      App.favorites_bar_hide_debouncer.call(mode)
    })
  }

  container.append(bar)
  return container
}

App.create_favorites_button = (mode) => {
  let btn = DOM.create(`div`, `favorites_button button`, `favorites_button_${mode}`)
  btn.textContent = App.heart_icon
  btn.title = App.favorites_title

  DOM.ev(btn, `click`, (e) => {
    App.show_favorites_menu(e)
  })

  DOM.ev(btn, `dblclick`, (e) => {
    App.favorites_double_click(e)
  })

  DOM.ev(btn, `auxclick`, (e) => {
    if (e.button === 1) {
      App.favorites_middle_click(e)
    }
  })

  return btn
}

App.fill_favorites_bar = (mode) => {
  if (!App.favorites_bar_side()) {
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
    btn.title = `Click: ${fav.cmd.name}`

    DOM.ev(btn, `click`, (e) => {
      let args = {
        cmd: fav.cmd.cmd,
        e: e,
      }

      App.run_command(args)
    })

    let alt = App.get_command(fav.fav.alt)

    if (alt) {
      btn.title += `\nMiddle Click: ${alt.name}`

      DOM.ev(btn, `auxclick`, (e) => {
        if (e.button === 1) {
          let args = {
            cmd: alt.cmd,
            e: e,
          }

          App.run_command(args)
        }
      })
    }

    some_cmds = true
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
    icon: App.heart_icon,
    text: `Position`,
    items: positions,
  })

  items.push({
    icon: App.heart_icon,
    text: `Settings`,
    action: () => {
      App.show_settings_category(`favorites`)
    },
  })

  App.show_context({items: items, e: e})
}

App.get_favorites = () => {
  let favorites = App.get_setting(`favorites_menu`)
  let favs = []

  for (let fav of favorites) {
    let c = App.get_command(fav.cmd)

    if (c) {
      favs.push({
        cmd: c,
        fav: fav,
      })
    }
  }

  return favs
}

App.favorites_double_click = (e) => {
  if (e.target.closest(`.favorites_bar_item`)) {
    return
  }

  let cmd = App.get_setting(`favorites_bar_double_click`)
  let command = App.get_command(cmd)

  if (command) {
    let args = {
      cmd: command.cmd,
      e: e,
    }

    App.run_command(args)
  }
}

App.favorites_middle_click = (e) => {
  if (e.target.closest(`.favorites_bar_item`)) {
    return
  }

  let cmd = App.get_setting(`favorites_middle_click`)
  let command = App.get_command(cmd)

  if (command) {
    let args = {
      cmd: command.cmd,
      e: e,
    }

    App.run_command(args)
  }
}

App.do_favorites_bar_show = (mode) => {
  let bar = DOM.el(`#favorites_bar_${mode}`)
  bar.classList.remove(`hidden`)
}

App.do_favorites_bar_hide = (mode) => {
  let bar = DOM.el(`#favorites_bar_${mode}`)
  bar.classList.add(`hidden`)
}

App.clear_favorite_bar_autohide = () => {
  App.favorites_bar_show_debouncer.cancel()
  App.favorites_bar_hide_debouncer.cancel()
}

App.set_show_favorites = (what) => {
  App.set_setting(`show_favorites`, what)
}

App.set_favorites_position = (pos) => {
  App.set_setting(`favorites_position`, pos)
}

App.init_favorites = () => {
  if (App.get_setting(`show_favorites`)) {
    App.show_favorites()
  }
}

App.show_favorites = () => {
	let main = DOM.el(`#main`)
	main.classList.add(`show_favorites`)
  App.set_show_favorites(true)
}

App.hide_favorites = () => {
	let main = DOM.el(`#main`)
	main.classList.remove(`show_favorites`)
  App.set_show_favorites(false)
}

App.toggle_favorites = () => {
  if (App.get_setting(`show_favorites`)) {
    App.hide_favorites()
  }
  else {
    App.show_favorites()
  }
}