App.create_favorites = (mode) => {
  return DOM.create(`div`, `favorites hidden`, `favorites_${mode}`)
}

App.fill_favorites = (mode) => {
  let c = DOM.el(`#favorites_${mode}`)
  let show = App.get_setting(`show_favorites`)

  if (show) {
    c.classList.remove(`hidden`)
  }
  else {
    c.classList.add(`hidden`)
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
        let args = {}
        args.cmd = cmd.cmd
        App.run_command(cmd)
      })

      DOM.ev(btn, `contextmenu`, (e) => {
        e.preventDefault()
        App.show_settings_category(`favorites`)
      })

      c.append(btn)
    }
  }
}