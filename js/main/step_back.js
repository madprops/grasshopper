App.create_step_back_button = (mode) => {
  let btn = DOM.create(`div`, `step_back_button button icon_button`, `${mode}_back`)
  let rclick = App.get_cmd_name(`show_recent_tabs`)

  if (App.tooltips()) {
    App.trigger_title(btn, `click_step_back_button`)
    btn.title += `\nRight Click: ${rclick}`
    App.trigger_title(btn, `middle_click_step_back_button`)
    App.trigger_title(btn, `click_press_step_back_button`)
    App.trigger_title(btn, `middle_click_press_step_back_button`)
    App.trigger_title(btn, `wheel_up_step_back_button`)
    App.trigger_title(btn, `wheel_down_step_back_button`)
  }

  App.check_show_button(`step_back`, btn)
  btn.append(App.get_svg_icon(`back`))
  return btn
}

App.step_back = (mode = App.active_mode, e = undefined) => {
  let active
  let tabs = mode === `tabs`

  if (tabs) {
    active = App.get_active_tab_item()
  }

  let item = App.get_selected(mode)
  let scroll = `center_smooth`
  let bookmarks = mode === `bookmarks`

  if (App.multiple_selected(mode)) {
    App.deselect({mode, select: `selected`, scroll})
  }
  else if (tabs && active && active.visible && !active.selected) {
    App.select_item({item: active, scroll})
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
  else if (App.filter_is_focused(mode)) {
    App.unfocus_filter(mode)
  }
  else if (tabs) {
    if (App.get_setting(`step_back_recent`) && e && (e.key !== `Escape`)) {
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
    App.unfocus_filter(mode)
  }
}

App.step_back_click = (e) => {
  let cmd = App.get_setting(`click_step_back_button`)
  App.run_command({cmd, from: `step_back`, e})
}

App.step_back_middle_click = (e) => {
  let cmd = App.get_setting(`middle_click_step_back_button`)
  App.run_command({cmd, from: `step_back`, e})
}