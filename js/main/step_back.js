App.create_step_back_button = (mode) => {
  let btn = DOM.create(`div`, `button icon_button`, `${mode}_back`)
  btn.title = `Step Back (Esc) | Right Click for Prev Tabs`
  btn.append(App.create_icon(`back`))

  DOM.ev(btn, `click`, (e) => {
    App.step_back(mode, e)
  })

  DOM.ev(btn, `auxclick`, (e) => {
    if (e.button === 1) {
      let cmd = App.get_setting(`middle_click_back_button`)

      if (cmd !== `none`) {
        App.run_command({cmd: cmd, from: `back_button`})
      }
    }
  })

  DOM.ev(btn, `contextmenu`, (e) => {
    e.preventDefault()
    App.prev_tabs_menu(e)
  })

  return btn
}

App.step_back = (mode = App.window_mode, e) => {
  let item = App.get_selected(mode)

  if (App.multiple_selected(mode)) {
    App.deselect(mode, `selected`)
  }
  else if (App.filter_has_value(mode)) {
    App.clear_filter(mode)
  }
  else if (App[`${mode}_filter_mode`] !== `all`) {
    App.show_all()
  }
  else if (item && !App.item_is_visible(item)) {
    App.select_item({item: item, scroll: `center`})
  }
  else if (mode === `tabs` && !item.active) {
    App.focus_current_tab()
  }
  else if (mode === `tabs` && (e && e.key !== `Escape`)) {
    App.go_to_previous_tab()
  }
  else if (mode !== App.primary_mode()) {
    App.show_primary_mode()
  }
}