App.get_actions = (mode) => {
  let menu = App.get_setting(`${mode}_menu`)
  return menu.map(item => item.cmd) || []
}

App.create_actions_menu = (mode) => {
  App[`${mode}_actions`] = App.get_actions(mode)
  let btn = DOM.create(`div`, `button icon_button`, `${mode}_actions`)
  btn.append(App.get_svg_icon(`sun`))
  btn.title = `Actions (Ctrl + Right)\nRight Click: Show the Browser Menu`
  let dcmd = App.get_setting(`middle_click_actions_menu`)

  if (dcmd) {
    let cmd = App.get_command(dcmd)

    if (cmd) {
      btn.title += `\nMiddle Click: ${cmd.name}`
    }
  }

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
      App.run_command({cmd: cmd, from: `actions_menu`, e: e})
    }
  })

  return btn
}

App.show_actions_menu = (mode) => {
  let items = App.cmd_list(App[`${mode}_actions`])
  let btn = DOM.el(`#${mode}_actions`)

  App.show_context({
    element: btn,
    items: items,
    expand: true,
    margin: btn.clientHeight,
  })
}