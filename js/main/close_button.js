App.add_close_button = (item, side) => {
  let cb_setting = App.get_setting(`show_close_button`)

  if (cb_setting === `never`) {
    return
  }

  let c_side = App.get_setting(`close_button_side`)
  let show = App.get_setting(`show_close_button`)

  if (item.mode === `tabs`) {
    if (side !== c_side) {
      return
    }

    let btn = DOM.create(`div`, `close_button ${c_side} item_node`)
    btn.textContent = App.get_setting(`close_icon`)
    btn.classList.add(show)
    item.element.append(btn)
  }
}

App.show_close_button_menu = (item, e) => {
  let menu = App.get_setting(`close_button_menu`)

  if (!menu.length) {
    return false
  }

  let items = App.custom_menu_items({
    name: `close_button_menu`,
    item,
  })

  let element = item?.element
  App.show_context({items, e, element})
  return true
}

App.close_button_middle_click = (item, e) => {
  let cmd = App.get_setting(`middle_click_close_button`)
  App.run_command({cmd, item, from: `close_button`, e})
}