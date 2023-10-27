App.create_favorites_bar = (mode) => {
  return DOM.create(`div`, `favorites_bar`, `favorites_bar_${mode}`)
}

App.create_favorites_button = (mode) => {
  let btn = DOM.create(`div`, `favorites_button button`, `favorites_button_${mode}`)
  btn.textContent = App.heart_icon
  btn.title = `Favorites`

  DOM.ev(btn, `click`, (e) => {
    App.show_favorites_menu(e)
  })

  return btn
}

App.fill_favorites_bar = (mode) => {
  let bar = DOM.el(`#item_top_bar_${mode}`)

  if (App.get_setting(`favorites_mode`) !== `bar`) {
    bar.classList.add(`hidden`)
    return
  }

  bar.classList.remove(`hidden`)
  let c = DOM.el(`#favorites_bar_${mode}`)
  let favorites = App.get_setting(`favorites`)

  if (!favorites.length) {
    return
  }

  c.innerHTML = ``

  for (let fav of favorites) {
    let cmd = App.get_command(fav.cmd)

    if (cmd) {
      let btn = DOM.create(`div`, `favorites_bar_item button button_3`)
      let icon = DOM.create(`div`, `favorites_bar_icon`)
      let icon_s = cmd.icon

      if (icon_s instanceof Node) {
        icon_s = icon_s.cloneNode(true)
      }

      icon.append(icon_s)
      btn.append(icon)
      btn.title = cmd.name

      DOM.ev(btn, `click`, () => {
        let args = {
          cmd: cmd.cmd,
        }

        App.run_command(args)
      })

      c.append(btn)
    }
  }

  DOM.ev(c, `contextmenu`, (e) => {
    e.preventDefault()
    App.show_favorites_menu(e)
  })
}

App.show_favorites_menu = (e) => {
  let items = []

  for (let fav of App.get_setting(`favorites`)) {
    let cmd = App.get_command(fav.cmd)

    if (cmd) {
      items.push({
        text: cmd.name,
        action: (e) => {
          let args = {
            cmd: cmd.cmd,
          }

          App.run_command(args)
        },
        icon: cmd.icon,
      })
    }
  }

  App.show_context({items: items, e: e})
}