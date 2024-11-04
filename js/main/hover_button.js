App.create_hover_button = (item, side) => {
  if (side !== App.get_setting(`hover_button_side`)) {
    return
  }

  let btn = DOM.create(`div`, `hover_button`)
  btn.textContent = App.get_setting(`hover_button_icon`) || App.command_icon
  item.element.append(btn)
}

App.show_hover_button_menu = (item, e) => {
  let name
  let mode = item?.mode || App.active_mode
  let mode_menu = App.get_setting(`hover_button_menu_${mode}`)

  if (mode_menu.length) {
    name = `hover_button_menu_${mode}`
  }
  else {
    let global = App.get_setting(`hover_button_menu`)

    if (global.length) {
      name = `hover_button_menu`
    }
  }

  if (!name) {
    return
  }

  let items = App.custom_menu_items({name, item})
  let compact = App.get_setting(`compact_hover_button_menu`)
  App.show_context({items, e, compact})
}

App.hover_button_middle_click = (item, e) => {
  let cmd = App.get_setting(`middle_click_hover_button`)
  App.run_command({cmd, item, from: `hover_button`, e})
}

App.toggle_hover_button = (item, e) => {
  let sett = App.get_setting(`show_hover_button`)
  App.set_setting({setting: `show_hover_button`, value: !sett})
  App.toggle_message(`Hover Btn`, `show_hover_button`)
  App.set_hover_button_vars()
}