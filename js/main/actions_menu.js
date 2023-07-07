App.create_actions_menu = (mode) => {
  App[`${mode}_actions`] = App[`${mode}_actions`] || []
  let actions_menu = DOM.create(`div`, `button icon_button`, `${mode}_actions`)
  actions_menu.append(App.create_icon(`sun`))
  actions_menu.title = `Actions (Ctrl + Right)`

  DOM.ev(actions_menu, `click`, () => {
    App.show_actions(mode)
  })

  DOM.ev(actions_menu, `auxclick`, (e) => {
    if (e.button === 1) {
      let cmd = App.get_setting(`on_middle_click_actions_menu`)

      if (cmd !== `none`) {
        App.run_command({cmd: cmd, from: `actions_menu`})
      }
    }
  })

  return actions_menu
}