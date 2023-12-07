App.favorites_bar_active = () => {
  let favmode = App.get_setting(`favorites_mode`)

  if ((favmode === `none`) || (favmode === `button`)) {
    return false
  }

  return true
}

App.favorites_bar_side = () => {
  let favmode = App.get_setting(`favorites_mode`)

  if ((favmode === `left`) || (favmode === `right`)) {
    return true
  }

  return false
}

App.create_favorites_bar = (mode) => {
  if (!App.favorites_bar_active()) {
    return
  }

  let favmode = App.get_setting(`favorites_mode`)
  let container = DOM.create(`div`, `favorites_bar_container`, `favorites_bar_container_${mode}`)
  let el = DOM.create(`div`, `favorites_bar`, `favorites_bar_${mode}`)
  el.title = App.favorites_title

  if (favmode === `top`) {
    el.classList.add(`fav_top`)
  }
  else if (favmode === `left`) {
    el.classList.add(`fav_left`)
  }
  else if (favmode === `right`) {
    el.classList.add(`fav_right`)
  }
  else if (favmode === `bottom`) {
    el.classList.add(`fav_bottom`)
  }

  DOM.ev(el, `contextmenu`, (e) => {
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

  container.append(el)
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
  if (!App.favorites_bar_active()) {
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