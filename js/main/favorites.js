App.create_favorites_bar = (mode) => {
  let el = DOM.create(`div`, `favorites_bar`, `favorites_bar_${mode}`)
  el.title = App.favorites_title

  DOM.ev(el, `contextmenu`, (e) => {
    e.preventDefault()
    App.show_favorites_menu(e)
  })

  return el
}

App.create_favorites_button = (mode) => {
  let btn = DOM.create(`div`, `favorites_button button`, `favorites_button_${mode}`)
  btn.textContent = App.heart_icon
  btn.title = App.favorites_title

  DOM.ev(btn, `click`, (e) => {
    App.show_favorites_menu(e)
  })

  return btn
}

App.fill_favorites_bar = (mode) => {
  let bar = DOM.el(`#item_top_bar_${mode}`)

  if (!bar) {
    return
  }

  if (App.get_setting(`favorites_mode`) !== `bar`) {
    bar.classList.add(`hidden`)
    return
  }

  let favs = App.get_favorites()

  if (!favs.length) {
    bar.classList.add(`hidden`)
    return
  }

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

  bar.classList.remove(`hidden`)
}

App.show_favorites_menu = (e) => {
  let items = App.custom_menu_items({
    name: `favorites_menu`,
    check: false,
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