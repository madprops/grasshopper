App.create_main_menu = (mode) => {
  let btn = DOM.create(`div`, `button main_menu_button icon_button`, `${mode}_main_menu`)
  let click = App.get_cmd_name(`show_main_menu`)
  let rclick = App.get_cmd_name(`show_palette`)

  if (App.get_setting(`show_tooltips`)) {
    btn.title = `Click: ${click}\nRight Click: ${rclick}`
    App.trigger_title(btn, `middle_click_main_menu`)
    App.trigger_title(btn, `click_press_main_menu`)
    App.trigger_title(btn, `middle_click_press_main_menu`)
  }

  App.check_show_button(`main_menu`, btn)
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

  let stuff = []
  stuff.push(App.cmd_item({cmd: `show_flashlight`}))
  stuff.push(App.cmd_item({cmd: `generate_password`}))
  stuff.push(App.cmd_item({cmd: `breathe_effect`}))
  stuff.push(App.cmd_item({cmd: `locust_swarm`}))
  App.sep(stuff)
  stuff.push(App.cmd_item({cmd: `toggle_main_title`}))
  stuff.push(App.cmd_item({cmd: `toggle_favorites`}))
  stuff.push(App.cmd_item({cmd: `toggle_tab_box`}))
  stuff.push(App.cmd_item({cmd: `toggle_footer`}))
  App.sep(stuff)
  stuff.push(App.cmd_item({cmd: `toggle_show_pins`}))
  stuff.push(App.cmd_item({cmd: `toggle_show_unloaded`}))
  stuff.push(App.cmd_item({cmd: `toggle_tab_sort`}))
  App.sep(stuff)
  stuff.push(App.cmd_item({cmd: `toggle_wrap_text`}))
  stuff.push(App.cmd_item({cmd: `toggle_auto_blur`}))

  App.sep(items)
  items.push(App.cmd_item({cmd: `show_settings`, short: true}))
  App.sep(items)
  items.push(App.cmd_item({cmd: `show_signals`, short: true}))

  items.push({
    icon: `🍄`,
    text: `Stuff`,
    items: stuff,
  })

  items.push(App.cmd_item({cmd: `show_about`, short: true}))
  App.sep(items)
  items.push(App.cmd_item({cmd: `lock_screen`, short: true}))
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

App.main_menu_middle_click = (e) => {
  let cmd = App.get_setting(`middle_click_main_menu`)
  App.run_command({cmd, from: `main_menu`, e})
}