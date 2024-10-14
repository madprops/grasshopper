App.create_step_back_button = (mode) => {
  let btn = DOM.create(`div`, `step_back_button button icon_button`, `${mode}_back`)
  let click = App.get_cmd_name(`step_back`)
  let rclick = App.get_cmd_name(`show_recent_tabs`)

  if (App.get_setting(`show_tooltips`)) {
    btn.title = `Click: ${click} (Esc)\nRight Click: ${rclick}`
    App.trigger_title(btn, `middle_click_step_back`)
    App.trigger_title(btn, `wheel_up_step_back`)
    App.trigger_title(btn, `wheel_down_step_back`)
    App.trigger_title(btn, `left_click_press_step_back`)
    App.trigger_title(btn, `middle_click_press_step_back`)
  }

  btn.append(App.get_svg_icon(`back`))
  return btn
}

App.step_back = (mode = App.active_mode, e = undefined) => {
  let item = App.get_selected(mode)
  let scroll = `center_smooth`
  let tabs = mode === `tabs`
  let bookmarks = mode === `bookmarks`

  if (App.multiple_selected(mode)) {
    App.deselect({mode, select: `selected`, scroll})
  }
  else if (App.filter_has_value(mode)) {
    App.clear_filter(mode)
  }
  else if (App[`${mode}_filter_mode`] !== `all`) {
    App.filter_all(mode, `step_back`)
  }
  else if (item && item.element && !App.item_is_visible(item)) {
    App.select_item({item, scroll})
  }
  else if (bookmarks && App.bookmarks_folder) {
    App.go_to_bookmarks_parent_folder()
  }
  else if (tabs && item && !item.active) {
    App.focus_current_tab(scroll)
  }
  else if (tabs) {
    if (App.get_setting(`step_back_recent`) && e && e.key !== `Escape`) {
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