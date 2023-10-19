App.create_favorites = (mode) => {
  return DOM.create(`div`, `favorites`, `favorites_${mode}`)
}

App.fill_favorites = (mode) => {
  let c = DOM.el(`#favorites_${mode}`)
  let bar = DOM.el(`#item_top_bar_${mode}`)
  let show = App.get_setting(`show_favorites`)

  if (show) {
    bar.classList.remove(`hidden`)
  }
  else {
    bar.classList.add(`hidden`)
    return
  }

  let favorites = App.get_setting(`favorites`)

  if (!favorites.length) {
    return
  }

  c.innerHTML = ``

  for (let fav of favorites) {
    let cmd = App.get_command(fav.cmd)

    if (cmd) {
      let btn = DOM.create(`div`, `favorites_item button`)
      let icon = DOM.create(`div`, `favorites_icon`)
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

  App.show_center_context(items, e)
}