App.create_actions_menu = (mode) => {
  App[`${mode}_actions`] = App[`${mode}_actions`] || []
  let actions_menu = DOM.create(`div`, `button icon_button`, `${mode}_actions`)
  actions_menu.append(App.create_icon(`sun`))
  actions_menu.title = `Actions (Ctrl + Right)`

  DOM.evs(actions_menu, [`click`, `contextmenu`], (e) => {
    App.show_actions_menu(mode)
    e.preventDefault()
  })

  DOM.ev(actions_menu, `auxclick`, (e) => {
    if (e.button === 1) {
      let cmd = App.get_setting(`middle_click_actions_menu`)

      if (cmd !== `none`) {
        App.run_command({cmd: cmd, from: `actions_menu`})
      }
    }
  })

  return actions_menu
}

App.show_actions_menu = (mode) => {
  if (!App[`${mode}_actions`].length) {
    return
  }

  let items = []

  for (let item of App[`${mode}_actions`]) {
    let c = App.get_command(item)

    if (c) {
      items.push({
        text: c.name,
        action: () => {
          App.run_command({cmd: c.cmd, from: `actions`})
        }
      })
    }
  }

  let btn = DOM.el(`#${mode}_actions`)
  NeedContext.show_on_element(btn, items, true, btn.clientHeight)
}