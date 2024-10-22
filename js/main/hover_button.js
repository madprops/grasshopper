App.create_hover_button = () => {
  let btn = DOM.create(`div`, `hover_button`)
  btn.textContent = App.get_setting(`hover_button_icon`) || App.command_icon
  return btn
}

App.show_hover_button_menu = (item, e) => {
  let items = App.custom_menu_items({
    name: `hover_button_menu`,
    item,
  })

  let element = item?.element
  let compact = App.get_setting(`compact_hover_button_menu`)
  App.show_context({items, e, element, compact})
}

App.hover_button_middle_click = (item, e) => {
  let cmd = App.get_setting(`middle_click_hover_button`)
  App.run_command({cmd, item, from: `hover_button`, e})
}