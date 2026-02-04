App.create_main_button = (mode) => {
  let btn = DOM.create(`div`, `button main_button icon_button`, `${mode}_main_menu`)
  let click = App.get_cmd_name(`show_main_menu`)
  let rclick = App.get_cmd_name(`show_palette`)

  if (App.tooltips()) {
    btn.title = `Click: ${click}\nRight Click: ${rclick}`
    App.trigger_title(btn, `middle_click_main_button`)
    App.trigger_title(btn, `click_press_main_button`)
    App.trigger_title(btn, `middle_click_press_main_button`)
    App.trigger_title(btn, `wheel_up_main_button`)
    App.trigger_title(btn, `wheel_down_main_button`)
  }

  App.check_show_button(`main`, btn)
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
  items.push(App.cmd_item({cmd: `show_settings`, middle: `show_last_settings`, short: true}))
  App.sep(items)
  items.push(App.cmd_item({cmd: `show_signals`, short: true}))
  items.push(App.cmd_item({cmd: `edit_global_notes`, short: true}))
  items.push(App.cmd_item({cmd: `browse_datastore`, short: true}))
  items.push(App.cmd_item({cmd: `show_stuff_menu`, short: true}))
  items.push(App.cmd_item({cmd: `show_toggles_menu`, short: true}))
  items.push(App.cmd_item({cmd: `show_about`, short: true}))
  App.sep(items)
  items.push(App.cmd_item({cmd: `lock_screen`, short: true}))
  items.push(App.cmd_item({cmd: `show_palette`, short: true}))
  App.sep(items)

  items.push({text: `💉 Booster`, direct_action: () => {
    App.booster_shot()
  }, info: `Enable scripts to improve the experience`})

  App.sep(items)
  items.push(App.cmd_item({cmd: `focus_window_menu`, short: true}))

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

App.main_button_middle_click = (e) => {
  let cmd = App.get_setting(`middle_click_main_button`)
  App.run_command({cmd, from: `main_menu`, e})
}