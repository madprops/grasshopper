App.create_hover_button = () => {
  let btn = DOM.create(`div`, `hover_button`)
  btn.textContent = App.get_setting(`hover_icon`) || App.command_icon
  return btn
}

App.show_hover_menu = (e, item) => {
  let items = App.custom_menu_items({
    name: `hover_menu`,
    item: item,
  })

  App.show_context({items: items, e: e})
}