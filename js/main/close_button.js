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

    let hover_side = App.get_setting(`hover_button`)

    if (side === hover_side) {
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