App.create_hover_button = () => {
  let btn = DOM.create(`div`, `hover_button`)
  btn.textContent = App.get_setting(`hover_icon`) || App.command_icon
  return btn
}

App.show_hover_menu = (item, e) => {
  let items = App.custom_menu_items({
    name: `hover_menu`,
    item,
  })

  let element = item?.element
  App.show_context({items, e, element})
}

App.show_hover_menu_2 = (item, e) => {
  let menu = App.get_setting(`hover_menu_2`)

  if (!menu.length) {
    return false
  }

  let items = App.custom_menu_items({
    name: `hover_menu_2`,
    item,
  })

  let element = item?.element
  App.show_context({items, e, element})
  return true
}

App.hover_button_middle_click = (item, e) => {
  let cmd = App.get_setting(`middle_click_hover_button`)
  App.run_command({cmd, item, from: `hover_button`, e})
}