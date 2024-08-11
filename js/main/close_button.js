App.add_close_button = (item, side) => {
  let cb_setting = App.get_setting(`close_button`)

  if (cb_setting === `none`) {
    return
  }

  if (item.mode === `tabs`) {
    if (side !== cb_setting) {
      return
    }

    let hover_side = App.get_setting(`hover_button`)

    if (side === hover_side) {
      return
    }

    let btn = DOM.create(`div`, `close_button ${cb_setting} item_node`)

    if (App.get_setting(`show_tooltips`)) {
      btn.title = `Click: Close Tab`
    }

    App.trigger_title(btn, `middle_click_close_button`)
    btn.textContent = App.get_setting(`close_icon`) || App.close_tab_icon
    item.element.append(btn)
  }
}