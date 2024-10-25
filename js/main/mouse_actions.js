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
    if (DOM.parent(target, [`.main_menu_button`])) {
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

    if (DOM.parent(target, [`.filter_menu_button`])) {
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
        App.taglist_action(item, e)
        return
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
    }

    if (DOM.parent(target, [`.item_icon_unit`])) {
      if (App.get_setting(`mute_click`)) {
        if (DOM.parent(target, [`.playing_icon`, `.muted_icon`])) {
          App.toggle_mute_tabs(item)
          return
        }
      }

      if (App.get_setting(`pin_icon_click`)) {
        if (DOM.parent(target, [`.pin_icon`])) {
          App.unpin_tab(item.id)
          return
        }
      }

      if (App.get_setting(`normal_icon_click`)) {
        if (DOM.parent(target, [`.normal_icon`])) {
          App.pin_tab(item.id)
          return
        }
      }

      if (App.get_setting(`loaded_icon_click`)) {
        if (DOM.parent(target, [`.loaded_icon`])) {
          App.unload_tabs(item, false)
          return
        }
      }

      if (App.get_setting(`unloaded_icon_click`)) {
        if (DOM.parent(target, [`.unloaded_icon`])) {
          App.load_tabs(item, false)
          return
        }
      }

      if (App.get_setting(`title_icon_click`)) {
        if (DOM.parent(target, [`.title_icon`])) {
          App.edit_title(item)
          return
        }
      }

      if (App.get_setting(`tags_icon_click`)) {
        if (DOM.parent(target, [`.tags_icon`])) {
          App.edit_tags(item)
          return
        }
      }

      if (App.get_setting(`root_icon_click`)) {
        if (DOM.parent(target, [`.root_icon`])) {
          App.go_to_root_url(item, true)
          return
        }
      }

      if (App.get_setting(`node_icon_click`)) {
        if (DOM.parent(target, [`.node_icon`])) {
          App.go_to_parent(item)
          return
        }
      }

      if (App.get_setting(`parent_icon_click`)) {
        if (DOM.parent(target, [`.parent_icon`])) {
          App.filter_nodes(item)
          return
        }
      }
    }
  }

  if (DOM.parent(target, [`.item_icon_unit`])) {
    if (App.get_setting(`color_icon_click`)) {
      if (DOM.parent(target, [`.color_icon_container`])) {
        App.color_icon_click(item, e)
        return
      }
    }

    if (App.get_setting(`notes_icon_click`)) {
      if (DOM.parent(target, [`.notes_icon`])) {
        App.edit_notes(item)
        return
      }
    }

    if (App.get_setting(`custom_icon_click`)) {
      if (DOM.parent(target, [`.custom_icon`])) {
        App.custom_icon_click(item, e)
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
    if (DOM.parent(target, [`.main_menu_button`])) {
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

    if (DOM.parent(target, [`.filter_menu_button`])) {
      App.filter_menu_context(mode, e)
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
  }

  if (DOM.parent(target, [`.color_icon`])) {
    App.show_color_menu(item, e, false)
    return
  }

  if (DOM.parent(target, [`.custom_icon`])) {
    App.custom_icon_menu(item, e)
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
    if (DOM.parent(target, [`.main_menu_button`])) {
      App.main_menu_middle_click(e)
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

    if (DOM.parent(target, [`.filter_menu_button`])) {
      App.filter_menu_middle_click(e)
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
      if (App.get_setting(`color_icon_click`)) {
        if (DOM.parent(target, [`.color_icon_container`])) {
          App.edit_tab_color({item})
          return
        }
      }

      if (App.get_setting(`title_icon_click`)) {
        if (DOM.parent(target, [`.title_icon`])) {
          App.edit_tab_title({item})
          return
        }
      }

      if (App.get_setting(`root_icon_click`)) {
        if (DOM.parent(target, [`.root_icon`])) {
          App.remove_root_url(item)
          return
        }
      }

      if (App.get_setting(`tags_icon_click`)) {
        if (DOM.parent(target, [`.tags_icon`])) {
          App.edit_tab_tags({item})
          return
        }
      }

      if (App.get_setting(`node_icon_click`)) {
        if (DOM.parent(target, [`.node_icon`])) {
          App.filter_node_tab_siblings(item)
          return
        }
      }

      if (App.get_setting(`parent_icon_click`)) {
        if (DOM.parent(target, [`.parent_icon`])) {
          App.close_node_tabs(item)
          return
        }
      }

      if (App.get_setting(`notes_icon_click`)) {
        if (DOM.parent(target, [`.notes_icon`])) {
          App.remove_notes(item)
          return
        }
      }

      if (DOM.parent(target, [`.custom_icon`])) {
        App.remove_item_icon(item)
        return
      }

      if (App.get_setting(`parent_icon_click`)) {
        if (DOM.parent(target, [`.parent_icon`])) {
          App.close_node_tabs(item)
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
    if (App.mouse_press_action(`.main_menu_button`, `main_menu`, obj)) {
      return
    }

    if (App.mouse_press_action(`.step_back_button`, `step_back`, obj)) {
      return
    }

    if (App.mouse_press_action(`.playing_button`, `playing`, obj)) {
      return
    }

    if (App.mouse_press_action(`#pinline`, `pinline`, obj)) {
      return
    }

    if (App.mouse_press_action(`.filter_menu_button`, `filter_menu`, obj)) {
      return
    }

    if (App.mouse_press_action(`.actions_button`, `actions_menu`, obj)) {
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