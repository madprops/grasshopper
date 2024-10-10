App.show_empty_menu = (e) => {
  let name
  let mode = App.active_mode
  let mode_menu = App.get_setting(`${mode}_empty_menu`)

  if (mode_menu.length) {
    name = `${mode}_empty_menu`
  }
  else {
    let global = App.get_setting(`global_empty_menu`)

    if (global.length) {
      name = `global_empty_menu`
    }
  }

  if (!name) {
    return
  }

  let items = App.custom_menu_items({name})
  App.show_context({items, e})
}