App.get_actions = (mode) => {
  let menu = App.get_setting(`actions_menu_${mode}`)
  return menu.map(item => item.cmd) || []
}

App.create_actions_menu = (mode) => {
  App[`${mode}_actions`] = App.get_actions(mode)
  let btn = DOM.create(`div`, `actions_button button icon_button`, `${mode}_actions`)
  btn.append(App.get_svg_icon(`sun`))
  let click = App.get_cmd_name(`show_actions_menu`)
  let rclick = App.get_cmd_name(`show_browser_menu`)

  if (App.tooltips()) {
    btn.title = `Click: ${click}\nRight Click: ${rclick}`
    App.trigger_title(btn, `middle_click_actions_button`)
    App.trigger_title(btn, `click_press_actions_button`)
    App.trigger_title(btn, `middle_click_press_actions_button`)
    App.trigger_title(btn, `wheel_up_actions_button`)
    App.trigger_title(btn, `wheel_down_actions_button`)
  }

  App.check_show_button(`actions`, btn)
  return btn
}

App.show_actions_menu = (mode, item, e) => {
  let mode_menu = App.get_setting(`actions_menu_${mode}`)

  if (mode_menu.length) {
    App.show_mode_menu(mode, item, e)
    return
  }

  let global = App.get_setting(`actions_menu`)

  if (global.length) {
    App.show_global_actions_menu(e)
  }
}

App.show_global_actions_menu = (e) => {
  let items = App.custom_menu_items({
    name: `actions_menu`,
  })

  let mode = App.active_mode
  let element = DOM.el(`#${mode}_actions`)
  let compact = App.get_setting(`compact_actions_menu`)
  App.show_context({items, e, element, compact})
}

App.show_mode_menu = (mode, item, e) => {
  let items = App.custom_menu_items({
    name: `actions_menu_${mode}`,
    item,
  })

  let element = DOM.el(`#${mode}_actions`)
  let compact = App.get_setting(`compact_actions_menu`)
  App.show_context({items, e, element, compact})
}

App.actions_middle_click = (e) => {
  let cmd = App.get_setting(`middle_click_actions_button`)
  App.run_command({cmd, from: `actions_menu`, e})
}