App.create_actions_menu = (mode) => {
  App[`${mode}_actions`] = App[`${mode}_actions`] || []
  let btn = DOM.create(`div`, `button icon_button`, `${mode}_actions`)
  btn.append(App.create_icon(`sun`))
  btn.title = `Actions (Ctrl + Right)`

  DOM.ev(btn, `click`, () => {
    App.show_actions_menu(mode)
  })

  DOM.ev(btn, `contextmenu`, (e) => {
    e.preventDefault()
    App.show_browser_commands(e)
  })

  DOM.ev(btn, `auxclick`, (e) => {
    if (e.button === 1) {
      let cmd = App.get_setting(`middle_click_actions_menu`)
      App.run_command({cmd: cmd, from: `actions_menu`})
    }
  })

  return btn
}

App.show_actions_menu = (mode) => {
  let items = App.custom_menu_items(`${mode}_actions`)
  let btn = DOM.el(`#${mode}_actions`)
  NeedContext.show_on_element(btn, items, true, btn.clientHeight)
}

App.show_browser_commands = (e) => {
  let cmds = [
    {cmd: `browser_back`},
    {cmd: `browser_forward`},
    {cmd: `browser_reload`},
  ]

  let items = App.show_cmds_menu(cmds, `browser_commands`)
  App.show_center_context(items, e)
}