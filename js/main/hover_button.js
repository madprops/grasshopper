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

  let element

  if (item) {
    element = item.element
  }

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

  let element

  if (item) {
    element = item.element
  }

  App.show_context({items, e, element})
  return true
}