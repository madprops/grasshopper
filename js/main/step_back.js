App.create_step_back_button = (mode) => {
  let btn = DOM.create(`div`, `button icon_button`, `${mode}_back`)
  let click = App.get_cmd_name(`step_back`)
  let rclick = App.get_cmd_name(`show_recent_tabs`)

  if (App.get_setting(`show_tooltips`)) {
    btn.title = `Click: ${click} (Esc)\nRight Click: ${rclick}`
    App.trigger_title(btn, `middle_click_step_back`)
  }

  btn.append(App.get_svg_icon(`back`))

  DOM.ev(btn, `click`, (e) => {
    App.step_back(mode, e)
  })

  DOM.ev(btn, `auxclick`, (e) => {
    if (e.button === 1) {
      let cmd = App.get_setting(`middle_click_step_back`)
      App.run_command({cmd: cmd, from: `step_back_aux`, e: e})
    }
  })

  DOM.ev(btn, `contextmenu`, (e) => {
    e.preventDefault()
    App.show_tab_list(`recent`, e)
  })

  return btn
}

App.step_back = (mode = App.active_mode, e) => {
  let item = App.get_selected(mode)
  let scroll = `center_smooth`
  let tabs = mode === `tabs`

  if (App.multiple_selected(mode)) {
    App.deselect({mode: mode, select: `selected`, scroll: scroll})
  }
  else if (App.filter_has_value(mode)) {
    App.clear_filter(mode)
  }
  else if (App[`${mode}_filter_mode`] !== `all`) {
    App.filter_all(mode, `step_back`)
  }
  else if (item && !App.item_is_visible(item)) {
    App.select_item({item: item, scroll: scroll})
  }
  else if (tabs && item && !item.active) {
    App.focus_current_tab(scroll)
  }
  else if (tabs && (e && e.key !== `Escape`)) {
    if (App.get_setting(`step_back_recent`)) {
      App.show_tab_list(`recent`, e)
    }
    else {
      App.go_to_previous_tab()
    }
  }
  else if (mode !== App.main_mode()) {
    App.show_main_mode()
  }
  else {
    App.blur_filter(mode)
    App.focus_items(mode)
  }
}