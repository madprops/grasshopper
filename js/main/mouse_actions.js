App.mouse_click_action = (e) => {
  let target = e.target

  if (App.click_press_triggered) {
    App.reset_triggers()
    return
  }

  if (!App.mouse_valid_type(target)) {
    return
  }

  let mode = App.active_mode
  App.reset_triggers()

  if (App.check_double_click(`mouse`, e)) {
    App.mouse_double_click_action(e)
    return
  }

  let [item, item_alt] = App.get_mouse_item(mode, target)

  if (!item) {
    if (DOM.parent(target, [`.main_button`])) {
      App.show_main_menu(mode)
      return
    }

    if (DOM.parent(target, [`.step_back_button`])) {
      App.step_back_click(e)
      return
    }

    if (DOM.parent(target, [`.playing_button`])) {
      App.playing_click(e)
      return
    }

    if (DOM.parent(target, [`.actions_button`])) {
      App.show_actions_menu(mode, undefined, e)
      return
    }

    if (DOM.parent(target, [`.favorites_empty_top`])) {
      App.fav_empty_top_click(e)
      return
    }

    if (DOM.parent(target, [`.favorites_empty_bottom`])) {
      App.fav_empty_bottom_click(e)
      return
    }

    if (DOM.parent(target, [`#tab_box_title`])) {
      if (e.shiftKey || e.ctrlKey) {
        App.select_tab_box_tabs()
      }
      else {
        App.show_tab_box_menu(e)
      }

      return
    }

    if (DOM.parent(target, [`.filter_button`])) {
      if (App.get_setting(`favorite_filters_click`)) {
        App.show_favorite_filters(mode, e)
      }
      else {
        App.show_filter_menu(mode)
      }

      return
    }

    if (DOM.parent(target, [`#pinline`])) {
      App.pinline_click(e)
      return
    }

    if (DOM.parent(target, [`.favorites_button`])) {
      App.show_favorites_menu(e)
      return
    }

    if (DOM.parent(target, [`#main_title_left_button`])) {
      App.main_title_click_left_button(e)
      return
    }

    if (DOM.parent(target, [`#main_title_right_button`])) {
      App.main_title_click_right_button(e)
      return
    }

    if (DOM.parent(target, [`#main_title`])) {
      App.main_title_click(e)
      return
    }

    if (DOM.parent(target, [`#footer_tab_box`])) {
      App.toggle_tab_box()
      return
    }

    if (DOM.parent(target, [`#footer_count`])) {
      App.select_all(App.active_mode, true)
      return
    }

    if (DOM.parent(target, [`#footer_info`])) {
      App.footer_click(e)
      return
    }

    if (DOM.parent(target, [`.scroller`])) {
      App.scroller_click(mode, e)
      return
    }

    return
  }

  mode = item.mode

  if (item_alt) {
    if (App.get_setting(`tab_box_reveal`)) {
      if (!App.tab_box_auto_scrollable()) {
        item_alt.scrollIntoView({block: `nearest`})
      }
    }
  }

  if (e.shiftKey) {
    App.select_range(item)
    return
  }

  if (e.ctrlKey) {
    App.pick(item)
    return
  }

  let media_type = App.get_media_type(item)

  if (media_type) {
    let media_setting = App.get_setting(`view_${media_type}_${mode}`)

    if (media_setting === `icon`) {
      if (DOM.parent(target, [`.${media_type}_icon`])) {
        App.select_item({item, scroll: `nearest`})
        App.view_media(item)
        return
      }
    }
    else if (media_setting === `item`) {
      App.select_item({item, scroll: `nearest`})
      App.view_media(item)
      return
    }
  }

  let item_container = DOM.parent(target, [`.item_container`])

  if (item_container) {
    if (DOM.parent(target, [`.item_icon_container`])) {
      if (item.header && App.get_setting(`header_icon_pick`)) {
        App.select_header_group(item)
        return
      }
      else if (App.get_setting(`icon_pick`)) {
        return
      }
    }
  }

  if (DOM.parent(target, [`.hover_button`])) {
    App.show_hover_button_menu(item, e)
    return
  }

  if (mode === `tabs`) {
    if (DOM.parent(target, [`.close_button`])) {
      App.close_button_click(item, e)
      return
    }

    if (DOM.parent(target, [`.taglist`])) {
      if (DOM.parent(target, [`.taglist_item`])) {
        if (App.get_setting(`taglist_mode`) !== `none`) {
          App.taglist_action(item, e)
          return
        }
      }

      if (DOM.parent(target, [`.taglist_left_scroll`])) {
        let taglist = DOM.el(`.taglist`, item.element)
        App.taglist_scroll(taglist, `left`)
        return
      }

      if (DOM.parent(target, [`.taglist_right_scroll`])) {
        let taglist = DOM.el(`.taglist`, item.element)
        App.taglist_scroll(taglist, `right`)
        return
      }

      if (DOM.parent(target, [`.taglist_add`])) {
        App.add_tags(item)
        return
      }

      if (DOM.parent(target, [`.taglist_container`])) {
        return
      }
    }

    if (DOM.parent(target, [`.item_icon_unit`])) {
      if (App.item_icon_click(item, target, e)) {
        return
      }
    }
  }

  if (e.altKey) {
    App.select_item({item, scroll: `nearest_smooth`})
    return
  }

  let cmd = App.get_unloaded_mouse_command(item, `click`)

  if (!cmd) {
    cmd = App.get_setting(`click_item_${mode}`)
  }

  App.run_command({cmd, item, from: `click`, e})
}

App.mouse_double_click_action = (e) => {
  let target = e.target
  let mode = App.active_mode

  if (!App.mouse_valid_type(target)) {
    return
  }

  let [item, item_alt] = App.get_mouse_item(mode, target)

  if (!item) {
    if (DOM.class(target, [`item_container`])) {
      App.empty_double_click(mode, e)
      return
    }

    if (DOM.parent(target, [`.favorites_empty_top`])) {
      App.favorites_double_click(e, `top`)
      return
    }

    if (DOM.parent(target, [`.favorites_empty_bottom`])) {
      App.favorites_double_click(e, `bottom`)
      return
    }

    if (DOM.parent(target, [`#main_title_left_button`])) {
      App.main_title_double_click_left_button(e)
      return
    }

    if (DOM.parent(target, [`#main_title_right_button`])) {
      App.main_title_double_click_right_button(e)
      return
    }

    if (DOM.parent(target, [`#main_title`])) {
      App.main_title_double_click(e)
      return
    }

    if (DOM.parent(target, [`#footer`])) {
      App.footer_double_click(e)
      return
    }

    if (DOM.parent(target, [`.mode_filter`])) {
      App.filter_double_click(mode, e)
      return
    }

    if (DOM.parent(target, [`#pinline`])) {
      App.pinline_double_click(e)
      return
    }

    return
  }

  mode = item.mode

  if (item.header) {
    if (!item.unloaded) {
      if (App.do_header_action(item, `double_click_header`)) {
        return
      }
    }
  }

  if (DOM.parent(target, [`.close_button`])) {
    App.close_button_double_click(item, e)
    return
  }

  if (DOM.parent(target, [`.taglist_container`])) {
    return
  }

  if (DOM.parent(target, [`.item_icon_container`])) {
    return
  }

  if (DOM.parent(target, [`.item_icon_unit`])) {
    return
  }

  let cmd = App.get_unloaded_mouse_command(item, `double_click`)

  if (!cmd) {
    cmd = App.get_setting(`double_click_item_${mode}`)
  }

  App.run_command({cmd, item, from: `double_click`, e})
}

App.mouse_context_action = (e) => {
  let target = e.target
  let mode = App.active_mode
  e.preventDefault()

  if (!App.mouse_valid_type(target)) {
    return
  }

  let [item, item_alt] = App.get_mouse_item(mode, target)

  if (!item) {
    if (DOM.parent(target, [`.main_button`])) {
      App.show_palette()
      return
    }

    if (DOM.parent(target, [`.step_back_button`])) {
      App.show_tab_list(`recent`, e)
      return
    }

    if (DOM.parent(target, [`.playing_button`])) {
      App.show_tab_list(`playing`, e)
      return
    }

    if (DOM.parent(target, [`.filter_button`])) {
      App.filter_button_context(mode, e)
      return
    }

    if (DOM.parent(target, [`.actions_button`])) {
      App.show_browser_menu(e)
      return
    }

    if (DOM.parent(target, [`#pinline`])) {
      App.show_pinline_menu(e)
      return
    }

    if (DOM.parent(target, [`.favorites_bar_container`, `.favorites_button`])) {
      App.show_favorites_menu(e)
      return
    }

    if (DOM.parent(target, [`#main_title_left_button`])) {
      App.show_main_title_left_button_menu(e)
      return
    }

    if (DOM.parent(target, [`#main_title_right_button`])) {
      App.show_main_title_right_button_menu(e)
      return
    }

    if (DOM.parent(target, [`#main_title`])) {
      App.show_main_title_menu(e)
      return
    }

    if (DOM.parent(target, [`.mode_filter`])) {
      App.show_filter_context_menu(mode, e)
      return
    }

    if (DOM.parent(target, [`#tab_box_title`])) {
      App.show_tab_box_menu(e)
      return
    }

    if (DOM.parent(target, [`#footer`])) {
      App.show_footer_menu(e)
      return
    }

    if (DOM.parent(target, [`.item_container`])) {
      App.show_empty_menu(undefined, e)
      return
    }

    return
  }

  mode = item.mode

  if (DOM.parent(target, [`.hover_button`])) {
    App.check_pick_button(`hover`, item, e)
    return
  }

  if (DOM.parent(target, [`.close_button`])) {
    App.check_pick_button(`close`, item, e)
    return
  }

  if (App.get_setting(`icon_pick`)) {
    if (DOM.parent(target, [`.item_icon_container`])) {
      App.select_item({item, scroll: `nearest`, deselect: true})
      return
    }
  }

  if (DOM.parent(target, [`.taglist`])) {
    if (DOM.parent(target, [`.taglist_item`])) {
      App.show_taglist_menu(e, item)
      return
    }

    if (DOM.parent(target, [`.taglist_container`])) {
      return
    }
  }

  if (DOM.parent(target, [`.color_icon`])) {
    App.show_color_menu(item, e, false)
    return
  }

  if (DOM.parent(target, [`.custom_icon`])) {
    App.custom_icon_menu(item, e)
    return
  }

  if (DOM.parent(target, [`.container_icon`])) {
    App.tab_container_menu(item, e)
    return
  }

  if (App.get_setting(`item_menu_select`)) {
    App.select_item({item, scroll: `nearest`, deselect: !item.selected})
  }

  App.show_item_menu({item, e})
}

App.mouse_middle_action = (e, target_el) => {
  let target = e.target || target_el
  let mode = App.active_mode

  if (App.click_press_triggered) {
    App.reset_triggers()
    return
  }

  App.reset_triggers()

  if (!App.mouse_valid_type(target)) {
    return
  }

  let [item, item_alt] = App.get_mouse_item(mode, target)

  if (!item) {
    if (DOM.parent(target, [`.main_button`])) {
      App.main_button_middle_click(e)
      return
    }

    if (DOM.parent(target, [`.step_back_button`])) {
      App.step_back_middle_click(e)
      return
    }

    if (DOM.parent(target, [`.playing_button`])) {
      App.playing_middle_click(e)
      return
    }

    if (DOM.parent(target, [`.actions_button`])) {
      App.actions_middle_click(e)
      return
    }

    if (DOM.parent(target, [`#tab_box_title`])) {
      App.tab_box_title_middle_click(e)
      return
    }

    if (DOM.parent(target, [`.filter_button`])) {
      App.filter_button_middle_click(e)
      return
    }

    if (DOM.parent(target, [`.favorites_empty_top`])) {
      App.favorites_empty_top_middle_click(e)
      return
    }

    if (DOM.parent(target, [`.favorites_empty_bottom`])) {
      App.favorites_empty_bottom_middle_click(e)
      return
    }

    if (DOM.parent(target, [`.favorites_button`])) {
      App.favorites_button_middle_click(e)
      return
    }

    if (DOM.parent(target, [`#pinline`])) {
      App.pinline_middle_click(e)
      return
    }

    if (DOM.parent(target, [`#main_title_left_button`])) {
      App.main_title_middle_click_left_button(e)
      return
    }

    if (DOM.parent(target, [`#main_title_right_button`])) {
      App.main_title_middle_click_left_button(e)
      return
    }

    if (DOM.parent(target, [`#main_title`])) {
      App.main_title_middle_click(e)
      return
    }

    if (DOM.parent(target, [`.mode_filter`])) {
      App.filter_middle_click(e)
      return
    }

    if (DOM.parent(target, [`#footer`])) {
      App.footer_middle_click(e)
      return
    }

    if (DOM.parent(target, [`.scroller`])) {
      App.scroll_page(mode, `up`)
      return
    }

    return
  }

  mode = item.mode

  if (DOM.parent(target, [`.hover_button`])) {
    App.hover_button_middle_click(item, e)
    return
  }

  if (mode === `tabs`) {
    if (DOM.parent(target, [`.close_button`])) {
      App.close_button_middle_click(item, e)
      return
    }

    if (item.header) {
      if (App.do_header_action(item, `middle_click_header`)) {
        return
      }
    }

    if (DOM.parent(target, [`.item_icon_unit`])) {
      if (App.get_setting(`icons_middle_click`)) {
        if (DOM.parent(target, [`.color_icon_container`])) {
          App.edit_tab_color({item})
          return
        }

        if (DOM.parent(target, [`.title_icon`])) {
          App.edit_tab_title({item})
          return
        }

        if (DOM.parent(target, [`.root_icon`])) {
          App.remove_root_url(item)
          return
        }

        if (DOM.parent(target, [`.tags_icon`])) {
          App.remove_tags(item)
          return
        }

        if (DOM.parent(target, [`.node_icon`])) {
          App.filter_node_tab_siblings(item)
          return
        }

        if (DOM.parent(target, [`.parent_icon`])) {
          App.close_node_tabs(item)
          return
        }

        if (DOM.parent(target, [`.edited_icon`])) {
          App.remove_item_edits(item)
          return
        }

        if (DOM.parent(target, [`.notes_icon`])) {
          App.remove_notes(item)
          return
        }

        if (DOM.parent(target, [`.custom_icon`])) {
          App.remove_item_icon(item)
          return
        }
      }
    }

    if (DOM.parent(target, [`.taglist_item`])) {
      App.taglist_remove(e, item)
      return
    }

    if (DOM.parent(target, [`.taglist_container`])) {
      return
    }
  }

  if (e.altKey) {
    App.select_item({item, scroll: `nearest_smooth`})
    return
  }

  let cmd = App.get_unloaded_mouse_command(item, `middle_click`)

  if (!cmd) {
    cmd = App.get_setting(`middle_click_item_${mode}`)
  }

  App.run_command({cmd, item, from: `middle_click`, e})
}

App.click_press_action = (e) => {
  let target = e.target
  let mode = App.active_mode

  if (!App.mouse_valid_type(target)) {
    return
  }

  let [item, item_alt] = App.get_mouse_item(mode, target)
  let obj = {item, target, e}

  if (!item) {
    if (App.mouse_press_action(`.main_button`, `main_button`, obj)) {
      return
    }

    if (App.mouse_press_action(`.step_back_button`, `step_back_button`, obj)) {
      return
    }

    if (App.mouse_press_action(`.playing_button`, `playing_button`, obj)) {
      return
    }

    if (App.mouse_press_action(`#pinline`, `pinline`, obj)) {
      return
    }

    if (App.mouse_press_action(`.filter_button`, `filter_button`, obj)) {
      return
    }

    if (App.mouse_press_action(`.actions_button`, `actions_button`, obj)) {
      return
    }

    if (App.mouse_press_action(`#footer`, `footer`, obj)) {
      return
    }

    if (App.mouse_press_action(`.favorites_empty_top`, `favorites_top`, obj)) {
      return
    }

    if (App.mouse_press_action(`.favorites_empty_bottom`, `favorites_bottom`, obj)) {
      return
    }

    if (App.mouse_press_action(`.favorites_button`, `favorites_button`, obj)) {
      return
    }

    if (App.mouse_press_action(`#tab_box_title`, `tab_box_title`, obj)) {
      return
    }

    if (App.mouse_press_action(`#main_title_left_button`, `main_title_left_button`, obj)) {
      return
    }

    if (App.mouse_press_action(`#main_title_right_button`, `main_title_right_button`, obj)) {
      return
    }

    if (App.mouse_press_action(`#main_title`, `main_title`, obj)) {
      return
    }

    if (!App.filter_has_value(mode)) {
      if (App.mouse_press_action(`.mode_filter`, `filter`, obj)) {
        return
      }
    }

    return
  }

  mode = item.mode

  if (App.mouse_press_action(`.close_button`, `close_button`, obj)) {
    return
  }

  if (App.mouse_press_action(`.hover_button`, `hover_button`, obj)) {
    return
  }

  if (item.header) {
    let sett

    if (App.click_press_button === 0) {
      sett = `click_press_header`
    }
    else if (App.click_press_button === 1) {
      sett = `middle_click_press_header`
    }

    if (App.do_header_action(item, sett)) {
      App.click_press_triggered = true
      return
    }
  }

  if (DOM.parent(target, [`.taglist_container`])) {
    return
  }

  let what

  if (App.click_press_button === 0) {
    what = `click_press`
  }
  else if (App.click_press_button === 1) {
    what = `middle_click_press`
  }

  let cmd = App.get_unloaded_mouse_command(item, what)

  if (!cmd) {
    cmd = App.get_setting(`${what}_item_${mode}`)
  }

  if (cmd) {
    if (App.run_command({cmd, from: `click_press`, item, e})) {
      App.click_press_triggered = true
    }
  }
}

App.do_mouse_over_action = (e) => {
  App.mouse_over_debouncer.cancel()
  let target = e.target

  if (!App.mouse_valid_type(target)) {
    return
  }

  let mode = App.active_mode
  let [item, item_alt] = App.get_mouse_item(mode, target)

  if (!item) {
    return
  }

  mode = item.mode
  App.set_item_tooltips(item)

  if (DOM.parent(target, [`.item_icon_unit`])) {
    App.update_icon_tooltips(item, target)
  }

  if (App.icon_pick_down) {
    App.toggle_selected({item, what: true})
    return
  }

  App.update_footer_info(item)
}

App.do_mouse_out_action = (e) => {
  let mode = App.active_mode
  let selected = App.get_selected(mode)

  if (selected) {
    App.update_footer_info(selected)
  }
}

App.mouse_move_action = (e) => {
  App.mouse_x = e.clientX
  App.mouse_y = e.clientY
}

App.mouse_wheel_action = (e) => {
  let target = e.target
  let mode = App.window_mode

  if (!App.mouse_valid_type(target)) {
    return
  }

  let direction = App.wheel_direction(e)

  if (DOM.parent(target, [`.scroller`])) {
    if (direction === `up`) {
      if (e.shiftKey) {
        App.scroll_page(mode, `up`)
      }
      else {
        App.scroll(mode, `up`)
      }
    }
    else if (direction === `down`) {
      if (e.shiftKey) {
        App.scroll_page(mode, `down`)
      }
      else {
        App.scroll(mode, `down`)
      }
    }
  }
  else if (target.closest(`.favorites_empty_top`)) {
    App.wheel_action(direction, `favorites_top`, e)
  }
  else if (target.closest(`.favorites_bar`)) {
    App.wheel_action(direction, `favorites_center`, e)
  }
  else if (target.closest(`.favorites_empty_bottom`)) {
    App.wheel_action(direction, `favorites_bottom`, e)
  }
  else if (target.closest(`.favorites_button`)) {
    App.wheel_action(direction, `favorites_button`, e)
  }
  else if (target.closest(`#footer`)) {
    App.wheel_action(direction, `footer`, e)
  }
  else if (target.closest(`#main_title`)) {
    App.wheel_action(direction, `main_title`, e)
  }
  else if (DOM.parent(target, [`#pinline`])) {
    App.wheel_action(direction, `pinline`, e)
  }
  else if (DOM.parent(target, [`.playing_button`])) {
    App.wheel_action(direction, `playing_button`, e)
  }
  else if (DOM.parent(target, [`.step_back_button`])) {
    App.wheel_action(direction, `step_back_button`, e)
  }
  else if (DOM.parent(target, [`.main_button`])) {
    App.wheel_action(direction, `main_button`, e)
  }
  else if (DOM.parent(target, [`.filter_button`])) {
    App.wheel_action(direction, `filter_button`, e)
  }
  else if (DOM.parent(target, [`.actions_button`])) {
    App.wheel_action(direction, `actions_button`, e)
  }
  else if (DOM.parent(target, [`#tab_box_title`])) {
    App.wheel_action(direction, `tab_box_title`, e)
  }
  else if (DOM.parent(target, [`#tab_box_container`])) {
    App.wheel_action(direction, `tab_box`, e)
  }
  else if (DOM.parent(target, [`.item_container`])) {
    App.wheel_action(direction, `items`, e)
  }
}

App.wheel_action = (direction, name, e) => {
  let target = e.target
  let mode = App.window_mode

  if (e.shiftKey) {
    name = `shift_${name}`
  }

  if (direction === `up`) {
    name = `wheel_up_${name}`
  }
  else if (direction === `down`) {
    name = `wheel_down_${name}`
  }

  if (!App.settings[name]) {
    return
  }

  let item, item_alt

  if (App.get_setting(`wheel_hover_item`)) {
    [item, item_alt] = App.get_mouse_item(mode, target)
  }

  let cmd = App.get_setting(name)
  App.run_command({cmd, item, from: `mouse`, e})
}

App.autoclick_action = (e) => {
  clearInterval(App.autoclick_timeout)
  let el = e.target
  let mode = App.active_mode
  let [item, item_alt] = App.get_mouse_item(mode, el)
  let element

  function action() {
    App.click_element(element, e)
  }

  function check(what, cls) {
    element = DOM.parent(el, [cls])
    return App.get_setting(`${what}_autoclick`) && Boolean(element)
  }

  let delay

  if (item) {
    if (item.unloaded) {
      if (App.get_setting(`unloaded_tab_autoclick`)) {
        delay = App.get_setting(`unloaded_tab_autoclick_delay`)
      }
    }
    else if (App.get_setting(`item_autoclick`)) {
      delay = App.get_setting(`item_autoclick_delay`)
    }
  }
  else if (item_alt) {
    if (App.get_setting(`unloaded_tab_autoclick`)) {
      delay = App.get_setting(`unloaded_tab_autoclick_delay`)
    }
  }
  else if (check(`hover_button`, `.hover_button`)) {
    delay = App.get_setting(`hover_button_autoclick_delay`)
  }
  else if (check(`main_button`, `.main_button`)) {
    delay = App.get_setting(`main_button_autoclick_delay`)
  }
  else if (check(`filter_button`, `.filter_button`)) {
    delay = App.get_setting(`filter_button_autoclick_delay`)
  }
  else if (check(`actions_button`, `.actions_button`)) {
    delay = App.get_setting(`actions_button_autoclick_delay`)
  }
  else if (check(`main_title_left_button`, `#main_title_left_button`)) {
    delay = App.get_setting(`main_title_left_button_autoclick_delay`)
  }
  else if (check(`main_title_right_button`, `#main_title_right_button`)) {
    delay = App.get_setting(`main_title_right_button_autoclick_delay`)
  }

  if (delay) {
    App.autoclick_timeout = setTimeout(() => {
      action()
    }, delay)
  }
}