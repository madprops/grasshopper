App.get_actions = (mode) => {
  let menu = App.get_setting(`${mode}_actions_menu`)
  return menu.map(item => item.cmd) || []
}

App.create_actions_menu = (mode) => {
  App[`${mode}_actions`] = App.get_actions(mode)
  let btn = DOM.create(`div`, `actions_button button icon_button`, `${mode}_actions`)
  btn.append(App.get_svg_icon(`sun`))
  let click = App.get_cmd_name(`show_actions_menu`)
  let rclick = App.get_cmd_name(`show_browser_menu`)

  if (App.get_setting(`show_tooltips`)) {
    btn.title = `Click: ${click} (Ctrl + Right)\nRight Click: ${rclick}`
    App.trigger_title(btn, `middle_click_actions_menu`)
    App.trigger_title(btn, `wheel_up_actions_menu`)
    App.trigger_title(btn, `wheel_down_actions_menu`)
    App.trigger_title(btn, `click_press_actions_menu`)
    App.trigger_title(btn, `middle_click_press_actions_menu`)
  }

  return btn
}

App.show_actions_menu = (mode, item, e) => {
  let mode_menu = App.get_setting(`${mode}_actions_menu`)

  if (mode_menu.length) {
    App.show_mode_menu(mode, item, e)
    return
  }

  let global = App.get_setting(`global_actions_menu`)

  if (global.length) {
    App.show_global_menu(e)
  }
}

App.show_global_menu = (e) => {
  let items = App.custom_menu_items({
    name: `global_actions_menu`,
  })

  let mode = App.active_mode
  let element = DOM.el(`#${mode}_actions`)
  App.show_context({items, e, element})
}

App.show_mode_menu = (mode, item, e) => {
  let items = App.custom_menu_items({
    name: `${mode}_actions_menu`,
    item,
  })

  let element = DOM.el(`#${mode}_actions`)
  App.show_context({items, e, element})
}