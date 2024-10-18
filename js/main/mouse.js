App.get_mouse_item = (mode, target) => {
  if (!App.mouse_valid_type(target)) {
    return
  }

  let tb_item = DOM.parent(target, [`.tab_box_tabs_item`])

  if (tb_item) {
    let id = tb_item.dataset.id
    return [App.get_item_by_id(`tabs`, id), tb_item]
  }

  let el = DOM.parent(target, [`.${mode}_item`])

  if (!el) {
    return [undefined, undefined]
  }

  let item = App.get_item_by_id(mode, el.dataset.id)

  if (!item) {
    el.remove()
    return [undefined, undefined]
  }

  return [item, undefined]
}

App.setup_mouse = () => {
  DOM.ev(window, `mousedown`, (e) => {
    if (e.button === 1) {
      e.preventDefault()
    }
  })

  DOM.ev(window, `mouseup`, (e) => {
    if (e.button === 0) {
      App.icon_pick_down = false
    }
  })

  DOM.ev(window, `wheel`, (e) => {
    App.on_mouse_wheel(e)
  })

  let container = DOM.el(`#main`)

  DOM.ev(container, `mousedown`, (e) => {
    App.on_mouse_down(e)
  })

  DOM.ev(container, `click`, (e) => {
    App.mouse_click_action(e)
  })

  DOM.ev(container, `contextmenu`, (e) => {
    App.mouse_context_action(e)
  })

  DOM.ev(container, `mouseover`, (e) => {
    App.mouse_over_action(e)
  })

  DOM.ev(container, `mouseout`, (e) => {
    App.mouse_out_action(e)
  })

  DOM.ev(container, `mousemove`, (e) => {
    App.mouse_move_action(e)
  })

  App.mouse_over_debouncer = App.create_debouncer((e) => {
    App.do_mouse_over_action(e)
  }, App.mouse_over_delay)

  App.mouse_out_debouncer = App.create_debouncer((e) => {
    App.do_mouse_out_action(e)
  }, App.mouse_out_delay)
}

// Using this on mousedown instead causes some problems
// For instance can't move a tab without selecting it
// And in a popup it would close the popup on selection
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
  let from = `click`

  App.check_double_click(`mouse`, e, () => {
    App.mouse_double_click_action(e)
  })

  App.reset_triggers()

  if (DOM.parent(target, [`.main_menu_button`])) {
    App.show_main_menu(mode)
    return
  }

  if (DOM.parent(target, [`.step_back_button`])) {
    App.step_back(mode, e)
    return
  }

  if (DOM.parent(target, [`.playing_button`])) {
    App.jump_tabs_playing()
    return
  }

  if (DOM.parent(target, [`.actions_button`])) {
    App.show_actions_menu(mode, undefined, e)
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

  if (DOM.parent(target, [`#footer_info`])) {
    App.footer_click(e)
    return
  }

  if (DOM.parent(target, [`.scroller`])) {
    App.scroller_click(mode, e)
    return
  }

  let [item, item_alt] = App.get_mouse_item(mode, target)

  if (!item) {
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
      if (DOM.class(target, [`view_media_button`])) {
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

  if (App.get_setting(`hover_button`) !== `none`) {
    if (DOM.parent(target, [`.hover_button`])) {
      App.show_hover_menu(item, e)
      return
    }
  }

  if (mode === `tabs`) {
    if (App.get_setting(`close_button`) !== `none`) {
      if (DOM.class(target, [`close_button`])) {
        App.close_tabs({item})
        return
      }
    }

    if (App.get_setting(`mute_click`)) {
      if (DOM.class(target, [`playing_icon`, `muted_icon`])) {
        App.toggle_mute_tabs(item)
        return
      }
    }

    if (App.taglist_enabled()) {
      if (DOM.parent(target, [`.taglist`])) {
        if (DOM.class(target, [`taglist_item`])) {
          App.taglist_action(item, e)
          return
        }

        if (DOM.class(target, [`taglist_left_scroll`])) {
          let taglist = DOM.el(`.taglist`, item.element)
          App.taglist_scroll(taglist, `left`)
          return
        }

        if (DOM.class(target, [`taglist_right_scroll`])) {
          let taglist = DOM.el(`.taglist`, item.element)
          App.taglist_scroll(taglist, `right`)
          return
        }
      }
    }

    if (App.taglist_add_enabled()) {
      if (DOM.class(target, [`taglist_add`])) {
        App.add_tags(item)
        return
      }
    }

    if (App.get_setting(`pin_icon_click`)) {
      if (DOM.class(target, [`pin_icon`])) {
        App.unpin_tab(item.id)
        return
      }
    }

    if (App.get_setting(`normal_icon_click`)) {
      if (DOM.class(target, [`normal_icon`])) {
        App.pin_tab(item.id)
        return
      }
    }

    if (App.get_setting(`loaded_icon_click`)) {
      if (DOM.class(target, [`loaded_icon`])) {
        App.unload_tabs(item, false)
        return
      }
    }

    if (App.get_setting(`unloaded_icon_click`)) {
      if (DOM.class(target, [`unloaded_icon`])) {
        App.load_tabs(item, false)
        return
      }
    }

    if (App.get_setting(`title_icon_click`)) {
      if (DOM.class(target, [`title_icon`])) {
        App.edit_title(item)
        return
      }
    }

    if (App.get_setting(`tags_icon_click`)) {
      if (DOM.class(target, [`tags_icon`])) {
        App.edit_tags(item)
        return
      }
    }

    if (App.get_setting(`root_icon_click`)) {
      if (DOM.class(target, [`root_icon`])) {
        App.go_to_root_url(item, true)
        return
      }
    }

    if (App.get_setting(`node_icon_click`)) {
      if (DOM.class(target, [`node_icon`])) {
        App.go_to_parent(item)
        return
      }
    }

    if (App.get_setting(`parent_icon_click`)) {
      if (DOM.class(target, [`parent_icon`])) {
        App.filter_nodes(item)
        return
      }
    }
  }

  if (App.get_setting(`color_icon_click`)) {
    if (DOM.parent(target, [`.color_icon_container`])) {
      App.show_color_menu(item, e, false)
      return
    }
  }

  if (App.get_setting(`notes_icon_click`)) {
    if (DOM.class(target, [`notes_icon`])) {
      App.edit_notes(item)
      return
    }
  }

  if (App.get_setting(`custom_icon_click`)) {
    if (DOM.class(target, [`custom_icon`])) {
      App.custom_icon_menu(item, e)
      return
    }
  }

  if (e.altKey || App.get_setting(`click_select`)) {
    App.select_item({item, scroll: `nearest_smooth`})
    return
  }

  if (App.get_setting(`load_lock`)) {
    if (item.unloaded) {
      App.select_item({item, scroll: `nearest_smooth`})
      return
    }
  }

  App[`${mode}_action`]({item, from})
}

App.mouse_double_click_action = (e) => {
  let target = e.target
  let mode = App.active_mode

  if (!App.mouse_valid_type(target)) {
    return
  }

  if (DOM.class(target, [`item_container`])) {
    let cmd = App.get_setting(`double_click_empty_${mode}`)
    App.run_command({cmd, from: `mouse`, e})
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

  let [item, item_alt] = App.get_mouse_item(mode, target)

  if (!item) {
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

  if (App.taglist_enabled()) {
    if (DOM.parent(target, [`.taglist_container`])) {
      return
    }
  }

  if (DOM.parent(target, [`.item_icon_container`])) {
    return
  }

  if (App.get_setting(`load_lock`)) {
    if (item.unloaded) {
      App[`${mode}_action`]({item, from: `click`})
      return
    }
  }

  let cmd = App.get_setting(`double_click_item`)

  if (cmd === `item_action`) {
    if (!App.get_setting(`click_select`)) {
      return
    }
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

  if (DOM.parent(target, [`#tab_box_title`])) {
    App.show_tab_box_menu_2(e)
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

  if (DOM.parent(target, [`#footer`])) {
    App.show_footer_menu(e)
    return
  }

  let [item, item_alt] = App.get_mouse_item(mode, target)

  if (!item) {
    if (DOM.parent(target, [`.item_container`])) {
      App.show_empty_menu(undefined, e)
    }

    return
  }

  mode = item.mode

  if (App.get_setting(`hover_button`) !== `none`) {
    if (DOM.parent(target, [`.hover_button`])) {
      if (App.get_setting(`hover_button_pick`)) {
        if (App.pick(item)) {
          return
        }
      }
      else if (App.show_hover_menu_2(item, e)) {
        return
      }
    }
  }

  let item_container = DOM.parent(target, [`.item_container`])

  if (item_container) {
    if (App.get_setting(`icon_pick`)) {
      if (DOM.parent(target, [`.item_icon_container`])) {
        App.select_item({item, scroll: `nearest`, deselect: true})
        return
      }
    }

    if (DOM.parent(target, [`.close_button`])) {
      if (App.show_close_button_menu(item, e)) {
        return
      }
    }
  }

  if (App.taglist_enabled()) {
    if (DOM.parent(target, [`.taglist`])) {
      if (DOM.class(target, [`taglist_item`])) {
        App.show_taglist_menu(e, item)
        return
      }
    }
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

  if (DOM.parent(target, [`.main_menu_button`])) {
    let cmd = App.get_setting(`middle_click_main_menu`)
    App.run_command({cmd, from: `main_menu`, e})
    return
  }

  if (DOM.parent(target, [`.step_back_button`])) {
    let cmd = App.get_setting(`middle_click_step_back`)
    App.run_command({cmd, from: `step_back_aux`, e})
    return
  }

  if (DOM.parent(target, [`.playing_button`])) {
    let cmd = App.get_setting(`middle_click_playing`)
    App.run_command({cmd, from: `playing_aux`, e})
    return
  }

  if (DOM.parent(target, [`.actions_button`])) {
    let cmd = App.get_setting(`middle_click_actions_menu`)
    App.run_command({cmd, from: `actions_menu`, e})
    return
  }

  if (DOM.parent(target, [`#tab_box_title`])) {
    let cmd = App.get_setting(`middle_click_tab_box`)
    App.run_command({cmd, from: `tab_box`, e})
    return
  }

  if (DOM.parent(target, [`.filter_menu_button`])) {
    let cmd = App.get_setting(`middle_click_filter_menu`)
    App.run_command({cmd, from: `filter_menu`, e})
    return
  }

  if (target.id === `favorites_empty_top`) {
    let cmd = App.get_setting(`middle_click_favorites_top`)
    App.run_command({cmd, from: `favorites_empty`, e})
    return
  }

  if (target.id === `favorites_empty_bottom`) {
    let cmd = App.get_setting(`middle_click_favorites_bottom`)
    App.run_command({cmd, from: `favorites_empty`, e})
    return
  }

  if (DOM.class(target, [`favorites_button`])) {
    let cmd = App.get_setting(`middle_click_favorites_button`)
    App.run_command({cmd, from: `favorites_button`, e})
    return
  }

  if (DOM.parent(target, [`#pinline`])) {
    let cmd = App.get_setting(`middle_click_pinline`)
    App.run_command({cmd, from: `pinline`, e})
    return
  }

  if (DOM.parent(target, [`#main_title`])) {
    App.main_title_middle_click(e)
    return
  }

  if (DOM.parent(target, [`.mode_filter`])) {
    App.show_refine_filters(e)
    return
  }

  if (DOM.parent(target, [`#footer`])) {
    let cmd = App.get_setting(`middle_click_footer`)
    App.run_command({cmd, from: `footer`, e})
    return
  }

  if (DOM.parent(target, [`.scroller`])) {
    App.scroll_page(mode, `up`)
    return
  }

  let [item, item_alt] = App.get_mouse_item(mode, target)

  if (!item) {
    return
  }

  mode = item.mode

  if (DOM.class(target, [`hover_button`])) {
    let cmd = App.get_setting(`middle_click_hover_button`)
    App.run_command({cmd, item, from: `hover_button`, e})
    return
  }

  if (mode === `tabs`) {
    if (DOM.class(target, [`close_button`])) {
      let cmd = App.get_setting(`middle_click_close_button`)
      App.run_command({cmd, item, from: `close_button`, e})
      return
    }

    if (item.header) {
      if (App.do_header_action(item, `middle_click_header`)) {
        return
      }
    }

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
        App.edit_tab_root({item})
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

    if (App.taglist_enabled()) {
      if (DOM.class(target, [`taglist_item`])) {
        App.taglist_remove(e, item)
        return
      }

      if (DOM.parent(target, [`.taglist_container`])) {
        return
      }
    }

    if (App.get_setting(`parent_icon_click`)) {
      if (DOM.parent(target, [`.parent_icon`])) {
        App.close_node_tabs(item)
        return
      }
    }

    if (DOM.class(target, [`custom_icon`])) {
      App.remove_item_icon(item)
      return
    }
  }

  let cmd = App.get_setting(`middle_click_${item.mode}`)
  App.run_command({cmd, item, from: `middle_click`, e})
}

App.mouse_over_action = (e) => {
  App.mouse_over_debouncer.call(e)
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

App.mouse_out_action = (e) => {
  App.mouse_out_debouncer.call(e)
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

App.reset_mouse = () => {
  clearTimeout(App.click_press_timeout)
  App.click_press_button = undefined
  App.click_press_triggered = false
}

App.start_click_press_timeout = (e) => {
  clearTimeout(App.click_press_timeout)

  App.click_press_timeout = setTimeout(() => {
    App.click_press_action(e)
  }, App.get_setting(`click_press_delay`))
}

App.click_press_action = (e) => {
  let target = e.target
  let mode = App.active_mode

  if (!App.mouse_valid_type(target)) {
    return
  }

  function action(s1, s2) {
    if (DOM.parent(target, [s1])) {
      if (App.click_press_button === 0) {
        let cmd = App.get_setting(`click_press_${s2}`)
        App.run_command({cmd, from: `click_press`, e})
      }
      else if (App.click_press_button === 1) {
        let cmd = App.get_setting(`middle_click_press_${s2}`)
        App.run_command({cmd, from: `click_press`, e})
      }

      App.click_press_triggered = true
      return true
    }

    return false
  }

  if (action(`.main_menu_button`, `main_menu`)) {
    return
  }

  if (action(`.step_back_button`, `step_back`)) {
    return
  }

  if (action(`.playing_button`, `playing`)) {
    return
  }

  if (action(`#pinline`, `pinline`)) {
    return
  }

  if (action(`.filter_menu_button`, `filter_menu`)) {
    return
  }

  if (action(`.actions_button`, `actions_menu`)) {
    return
  }

  if (action(`#footer`, `footer`)) {
    return
  }

  if (action(`.favorites_empty_top`, `favorites_top`)) {
    return
  }

  if (action(`.favorites_empty_bottom`, `favorites_bottom`)) {
    return
  }

  if (action(`.favorites_button`, `favorites_button`)) {
    return
  }

  if (action(`#tab_box_title`, `tab_box`)) {
    return
  }

  if (action(`#main_title`, `main_title`)) {
    return
  }

  let [item, item_alt] = App.get_mouse_item(mode, target)

  if (!item) {
    return
  }

  mode = item.mode

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

  if (App.get_setting(`hover_button`) !== `none`) {
    if (DOM.parent(target, [`.hover_button`])) {
      if (App.show_hover_menu_2(item, e)) {
        App.click_press_triggered = true
      }
      else {
        App.click_press_triggered = false
      }

      return
    }
  }

  if (App.get_setting(`close_button`) !== `none`) {
    if (DOM.parent(target, [`.close_button`])) {
      if (App.show_close_button_menu_2(item, e)) {
        App.click_press_triggered = true
      }
      else {
        App.click_press_triggered = false
      }

      return
    }
  }

  let cmd

  if (App.click_press_button === 0) {
    cmd = App.get_setting(`click_press_item`)
  }
  else if (App.click_press_button === 1) {
    cmd = App.get_setting(`middle_click_press_item`)
  }

  if (cmd) {
    if (App.run_command({cmd, from: `click_press`, item, e})) {
      App.click_press_triggered = true
    }
  }
}

App.on_mouse_wheel = (e) => {
  let target = e.target
  let mode = App.window_mode

  if (!App.mouse_valid_type(target)) {
    return
  }

  let direction = App.wheel_direction(e)

  if (DOM.parent(target, [`.main_menu_button`])) {
    if (direction === `up`) {
      App.cycle_modes(true)
    }
    else if (direction === `down`) {
      App.cycle_modes(false)
    }

    return
  }

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
  else if (DOM.parent(target, [`.filter_menu_button`])) {
    let direction = App.wheel_direction(e)

    if (direction === `up`) {
      App.cycle_filter_modes(mode, true, e)
    }
    else if (direction === `down`) {
      App.cycle_filter_modes(mode, false, e)
    }
  }
  else if (DOM.parent(target, [`#tab_box_title`])) {
    if (!App.get_setting(`tab_box_wheel`)) {
      return
    }

    let dir = App.wheel_direction(e)

    if (dir === `up`) {
      App.cycle_tab_box_mode(`prev`)
    }
    else if (dir === `down`) {
      App.cycle_tab_box_mode(`next`)
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
    App.wheel_action(direction, `playing`, e)
  }
  else if (DOM.parent(target, [`.step_back_button`])) {
    App.wheel_action(direction, `step_back`, e)
  }
  else if (DOM.parent(target, [`.actions_button`])) {
    App.wheel_action(direction, `actions_menu`, e)
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

// Custom double click function which has some advantages
// First it checks if it was initiated and triggered by the same element
// This avoids false double clicks when clicking on different elements
// It also allows the user to define the double click delay
App.check_double_click = (what, e, action) => {
  let click_date = App[`click_date_${what}`]
  let click_target = App[`click_target_${what}`]
  let target = e.target

  if (click_date === undefined) {
    App[`click_date_${what}`] = 0
  }

  let double_delay = App.get_setting(`double_click_delay`)
  let date_now = App.now()
  let double = false

  if ((date_now - click_date) < double_delay) {
    if (click_target === target) {
      double = true
    }
  }

  App[`click_target_${what}`] = target

  if (double) {
    App[`click_date_${what}`] = 0
    action()
  }
  else {
    App[`click_date_${what}`] = date_now
  }
}

App.on_mouse_down = (e) => {
  let target = e.target
  let mode = App.active_mode
  App.reset_triggers()

  if (App.get_setting(`icon_pick`)) {
    if (e.button === 0) {
      if (DOM.parent(target, [`.item_icon_container`])) {
        let [item, item_alt] = App.get_mouse_item(mode, target)

        if (item) {
          App.pick(item)

          if (item.selected) {
            App.icon_pick_down = true
          }

          return
        }
      }
    }
  }

  if (e.button === 0 || e.button === 1) {
    App.click_press_button = e.button
    App.click_press_triggered = false
    App.start_click_press_timeout(e)
  }
}

App.mouse_valid_type = (target) => {
  if (!target) {
    return false
  }

  if (target.nodeType !== 1) {
    return false
  }

  return true
}

App.mouse_event = (what, type = `normal`) => {
  let target = document.elementFromPoint(App.mouse_x, App.mouse_y)

  if (!target) {
    return
  }

  let button

  if (type === `middle`) {
    button = 1
  }

  let ev = new MouseEvent(what, {
    view: window,
    bubbles: true,
    cancelable: true,
    clientX: App.mouse_x,
    clientY: App.mouse_y,
    button,
  })

  if (type === `middle`) {
    App.mouse_middle_action(ev, target)
  }
  else {
    target.dispatchEvent(ev)
  }
}

App.trigger_left_click = () => {
  App.mouse_event(`click`)
}

App.trigger_right_click = () => {
  App.mouse_event(`contextmenu`)
}

App.trigger_middle_click = () => {
  App.mouse_event(`auxclick`, `middle`)
}