App.create_main_menu = (mode) => {
  let btn = DOM.create(`div`, `button icon_button`, `${mode}_main_menu`)
  let icon = App.mode_icons[mode]
  let text = App.get_mode_name(mode)
  btn.append(App.button_text(icon, text))
  let click = App.get_cmd_name(`show_main_menu`)
  let rclick = App.get_cmd_name(`show_palette`)
  btn.title = `Click: ${click} (Ctrl + Left)\nRight Click: ${rclick}`
  App.trigger_title(btn, `middle_click_main_menu`)

  DOM.ev(btn, `click`, () => {
    App.show_main_menu(mode)
  })

  DOM.ev(btn, `contextmenu`, (e) => {
    e.preventDefault()
    App.show_palette()
  })

  DOM.ev(btn, `auxclick`, (e) => {
    if (e.button === 1) {
      let cmd = App.get_setting(`middle_click_main_menu`)
      App.run_command({cmd: cmd, from: `main_menu`, e: e})
    }
  })

  DOM.ev(btn, `wheel`, (e) => {
    let direction = App.wheel_direction(e)

    if (direction === `up`) {
      App.cycle_modes(true)
    }
    else if (direction === `down`) {
      App.cycle_modes(false)
    }
  })

  return btn
}

App.show_main_menu = (mode) => {
  let items = []

  for (let m of App.modes) {
    items.push(App.cmd_item({cmd: `show_mode_${m}`, short: true}))
  }

  App.sep(items)
  items.push(App.cmd_item({cmd: `show_settings`, short: true}))
  items.push(App.cmd_item({cmd: `show_about`, short: true}))
  App.sep(items)

  items.push(App.cmd_item({cmd: `show_palette`, short: true}))
  let btn = DOM.el(`#${mode}_main_menu`)

  App.show_context({
    element: btn,
    items: items,
    expand: true,
    margin: btn.clientHeight,
  })
}