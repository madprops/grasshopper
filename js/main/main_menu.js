App.create_main_menu = (mode) => {
  let btn = DOM.create(`div`, `button main_menu_button icon_button`, `${mode}_main_menu`)
  let click = App.get_cmd_name(`show_main_menu`)
  let rclick = App.get_cmd_name(`show_palette`)

  if (App.get_setting(`show_tooltips`)) {
    btn.title = `Click: ${click} (Ctrl + Left)\nRight Click: ${rclick}`
    App.trigger_title(btn, `middle_click_main_menu`)
    App.trigger_title(btn, `click_press_main_menu`)
    App.trigger_title(btn, `middle_click_press_main_menu`)
  }

  App.set_main_menu_text(btn, mode)
  return btn
}

App.show_main_menu = (mode) => {
  let items = []

  for (let m of App.modes) {
    let icon = App.mode_icon(m)
    let name = App.get_mode_name(m, true)

    // This could be done with cmds but the mouse action
    // and direct call to do show mode allows the permission prompts
    // to appear to access History and Bookmarks modes
    // It also allows more nuanced opts like 'selected'

    items.push({
      icon,
      text: name,
      action: () => {
        if (m === `bookmarks`) {
          App.reset_bookmarks()
        }

        App.do_show_mode({mode: m, reuse_filter: false, force: true})
      },
      selected: m === mode,
    })
  }

  App.sep(items)
  items.push(App.cmd_item({cmd: `show_settings`, short: true}))
  items.push(App.cmd_item({cmd: `show_about`, short: true}))
  App.sep(items)

  items.push(App.cmd_item({cmd: `show_palette`, short: true}))
  let btn = DOM.el(`#${mode}_main_menu`)

  App.show_context({
    element: btn,
    items,
    expand: true,
    margin: btn.clientHeight,
  })
}

App.set_main_menu_text = (btn, mode, name = ``) => {
  let icon = App.mode_icon(mode)

  if (name) {
    name = name.substring(0, 12).trim()
  }
  else {
    name = App.get_mode_name(mode, true)
  }

  let value = App.button_text(icon, name)
  btn.innerHTML = ``
  btn.append(value)
}