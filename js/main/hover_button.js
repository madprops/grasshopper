App.create_hover_button = () => {
  let btn = DOM.create(`div`, `hover_button`)
  btn.textContent = App.command_icon
  btn.title = `Hover Button`
  return btn
}

App.show_hover_menu = (e, item) => {
  let items = App.custom_menu_items({
    name: `hover_menu`,
    item: item,
    check: false,
  })

  App.command_item = item
  App.show_context({items: items, e: e})
}