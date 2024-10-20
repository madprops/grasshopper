App.add_close_button = (item, side) => {
  let cb_setting = App.get_setting(`close_button`)

  if (cb_setting === `none`) {
    return
  }

  let split = cb_setting.split(`_`)
  let c_side = split[0]
  let hover = split.at(-1) === `hover`

  if (item.mode === `tabs`) {
    if (side !== c_side) {
      return
    }

    let btn = DOM.create(`div`, `close_button ${c_side} item_node`)

    if (hover) {
      btn.classList.add(`hover`)
    }

    btn.textContent = App.get_setting(`close_icon`) || App.close_tab_icon
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