App.create_actions_menu = (mode) => {
  App[`${mode}_actions`] = App[`${mode}_actions`] || []
  let btn = DOM.create(`div`, `button icon_button`, `${mode}_actions`)
  btn.append(App.create_icon(`sun`))
  btn.title = `Actions (Ctrl + Right) - Right Click to show the Browser Menu`

  DOM.ev(btn, `click`, () => {
    App.show_actions_menu(mode)
  })

  DOM.ev(btn, `contextmenu`, (e) => {
    e.preventDefault()
    App.show_browser_menu(e)
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
  NeedContext.show({element: btn, items: items, expand: true, margin: btn.clientHeight})
}