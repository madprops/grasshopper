App.create_favorites = (mode) => {
  return DOM.create(`div`, `favorites hidden`, `favorites_${mode}`)
}

App.fill_favorites = (mode) => {
  let favorites = App.get_setting(`favorites`)
  let c = DOM.el(`#favorites_${mode}`)
  c.innerHTML = ``
  let added = false

  for (let fav of favorites) {
    let cmd = App.get_command(fav.cmd)

    if (cmd) {
      let btn = DOM.create(`div`, `favorites_item button`)
      let icon = DOM.create(`div`, `favorites_icon`)
      icon.append(cmd.icon)
      btn.append(icon)
      btn.title = cmd.name

      DOM.ev(btn, `click`, () => {
        App.run_command(cmd)
      })

      DOM.ev(btn, `contextmenu`, (e) => {
        e.preventDefault()
        App.show_settings_category(`favorites`)
      })

      c.append(btn)
      added = true
    }
  }

  if (added) {
    c.classList.remove(`hidden`)
  }
  else {
    c.classList.add(`hidden`)
  }
}