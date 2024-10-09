App.get_mouse_item = (mode, e) => {
  if (!App.mouse_valid_type(e)) {
    return
  }

  let el = DOM.parent(e.target, [`.${mode}_item`])

  if (!el) {
    return
  }

  let item = App.get_item_by_id(mode, el.dataset.id)

  if (!item) {
    el.remove()
    return
  }

  return item
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
}

// Using this on mousedown instead causes some problems
// For instance can't move a tab without selecting it
// And in a popup it would close the popup on selection
App.mouse_click_action = (e) => {
  let mode = App.active_mode

  if (App.click_press_triggered) {
    App.reset_triggers()
    return
  }

  if (!App.mouse_valid_type(e)) {
    return
  }

  App.check_double_click(`mouse`, e, () => {
    App.mouse_double_click_action(mode, e)
  })

  App.reset_triggers()

  if (DOM.parent(e.target, [`.main_menu_button`])) {
    App.show_main_menu(mode)
    return
  }

  if (DOM.parent(e.target, [`#pinline`])) {
    App.show_pinline_menu(e)
    return
  }

  if (DOM.parent(e.target, [`.favorites_button`])) {
    App.show_favorites_menu(e)
    return
  }

  let item = App.get_mouse_item(mode, e)

  if (!item) {
    return
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
      if (DOM.class(e.target, [`view_media_button`])) {
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

  let item_container = DOM.parent(e.target, [`.item_container`])

  if (item_container) {
    if (DOM.parent(e.target, [`.item_icon_container`])) {
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
    if (DOM.parent(e.target, [`.hover_button`])) {
      App.show_hover_menu(item, e)
      return
    }
  }

  if (mode === `tabs`) {
    if (App.get_setting(`close_button`) !== `none`) {
      if (DOM.class(e.target, [`close_button`])) {
        App.close_tabs({item})
        return
      }
    }

    if (App.get_setting(`mute_click`)) {
      if (DOM.class(e.target, [`playing_icon`, `muted_icon`])) {
        App.toggle_mute_tabs(item)
        return
      }
    }

    if (App.taglist_enabled()) {
      if (DOM.parent(e.target, [`.taglist`])) {
        if (DOM.class(e.target, [`taglist_item`])) {
          App.taglist_action(item, e)
          return
        }

        if (DOM.class(e.target, [`taglist_left_scroll`])) {
          let taglist = DOM.el(`.taglist`, item.element)
          App.taglist_scroll(taglist, `left`)
          return
        }

        if (DOM.class(e.target, [`taglist_right_scroll`])) {
          let taglist = DOM.el(`.taglist`, item.element)
          App.taglist_scroll(taglist, `right`)
          return
        }
      }
    }

    if (App.taglist_add_enabled()) {
      if (DOM.class(e.target, [`taglist_add`])) {
        App.add_tags(item)
        return
      }
    }

    if (App.get_setting(`pin_icon_click`)) {
      if (DOM.class(e.target, [`pin_icon`])) {
        App.unpin_tab(item.id)
        return
      }
    }

    if (App.get_setting(`normal_icon_click`)) {
      if (DOM.class(e.target, [`normal_icon`])) {
        App.pin_tab(item.id)
        return
      }
    }

    if (App.get_setting(`loaded_icon_click`)) {
      if (DOM.class(e.target, [`loaded_icon`])) {
        App.unload_tabs(item, false)
        return
      }
    }

    if (App.get_setting(`unloaded_icon_click`)) {
      if (DOM.class(e.target, [`unloaded_icon`])) {
        App.load_tabs(item, false)
        return
      }
    }

    if (App.get_setting(`titled_icon_click`)) {
      if (DOM.class(e.target, [`titled_icon`])) {
        App.edit_title(item)
        return
      }
    }

    if (App.get_setting(`root_icon_click`)) {
      if (DOM.class(e.target, [`root_icon`])) {
        App.go_to_root_url(item, true)
        return
      }
    }

    if (App.get_setting(`node_icon_click`)) {
      if (DOM.class(e.target, [`node_icon`])) {
        App.go_to_parent(item)
        return
      }
    }

    if (App.get_setting(`parent_icon_click`)) {
      if (DOM.class(e.target, [`parent_icon`])) {
        App.filter_nodes(item)
        return
      }
    }
  }

  if (App.get_setting(`color_icon_click`)) {
    if (DOM.parent(e.target, [`.color_icon_container`])) {
      App.show_color_menu(item, e, false)
      return
    }
  }

  if (App.get_setting(`notes_icon_click`)) {
    if (DOM.class(e.target, [`notes_icon`])) {
      App.edit_notes(item)
      return
    }
  }

  if (App.get_setting(`custom_icon_click`)) {
    if (DOM.class(e.target, [`custom_icon`])) {
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

  let from = `click`

  if (mode === `tabs`) {
    if (DOM.parent(e.target, [`#tab_box`])) {
      from = `tab_box`
    }
  }

  App[`${mode}_action`]({item, from})
}

App.mouse_double_click_action = (mode, e) => {
  if (!App.mouse_valid_type(e)) {
    return
  }

  if (DOM.class(e.target, [`item_container`])) {
    let cmd = App.get_setting(`double_click_empty`)
    App.run_command({cmd, from: `mouse`, e})
    return
  }

  if (DOM.parent(e.target, [`.favorites_empty_top`])) {
    App.favorites_double_click(e, `top`)
    return
  }

  if (DOM.parent(e.target, [`.favorites_empty_bottom`])) {
    App.favorites_double_click(e, `bottom`)
    return
  }

  let item = App.get_mouse_item(mode, e)

  if (!item) {
    return
  }

  if (item.header) {
    if (App.do_header_action(item, `double_click_header`)) {
      return
    }
  }

  if (App.taglist_enabled()) {
    if (DOM.parent(e.target, [`.taglist_container`])) {
      return
    }
  }

  if (DOM.parent(e.target, [`.item_icon_container`])) {
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
  let mode = App.active_mode
  e.preventDefault()

  if (!App.mouse_valid_type(e)) {
    return
  }

  if (DOM.parent(e.target, [`.main_menu_button`])) {
    App.show_palette()
    return
  }

  if (DOM.parent(e.target, [`.favorites_bar_container`, `.favorites_button`])) {
    App.show_favorites_menu(e)
    return
  }

  let item = App.get_mouse_item(mode, e)

  if (!item) {
    if (DOM.parent(e.target, [`.item_container`])) {
      App.show_empty_menu(e)
    }

    return
  }

  if (App.get_setting(`hover_button`) !== `none`) {
    if (DOM.parent(e.target, [`.hover_button`])) {
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

  let item_container = DOM.parent(e.target, [`.item_container`])

  if (item_container) {
    if (App.get_setting(`icon_pick`)) {
      if (DOM.parent(e.target, [`.item_icon_container`])) {
        App.select_item({item, scroll: `nearest`, deselect: true})
        return
      }
    }

    if (DOM.parent(e.target, [`.close_button`])) {
      if (App.show_close_button_menu(item, e)) {
        return
      }
    }
  }

  if (App.taglist_enabled()) {
    if (DOM.parent(e.target, [`.taglist`])) {
      if (DOM.class(e.target, [`taglist_item`])) {
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

App.mouse_middle_action = (mode, e) => {
  if (App.click_press_triggered) {
    App.reset_triggers()
    return
  }

  App.reset_triggers()

  if (!App.mouse_valid_type(e)) {
    return
  }

  if (DOM.parent(e.target, [`.main_menu_button`])) {
    let cmd = App.get_setting(`middle_click_main_menu`)
    App.run_command({cmd, from: `main_menu`, e})
    return
  }

  if (e.target.id === `favorites_empty_top`) {
    let cmd = App.get_setting(`middle_click_favorites_top`)
    App.run_command({cmd, from: `favorites_empty`, e})
    return
  }

  if (e.target.id === `favorites_empty_bottom`) {
    let cmd = App.get_setting(`middle_click_favorites_bottom`)
    App.run_command({cmd, from: `favorites_empty`, e})
    return
  }

  if (DOM.class(e.target, [`favorites_button`])) {
    let cmd = App.get_setting(`middle_click_favorites_button`)
    App.run_command({cmd, from: `favorites_button`, e})
    return
  }

  if (DOM.parent(e.target, [`#pinline`])) {
    let cmd = App.get_setting(`middle_click_pinline`)
    App.run_command({cmd, from: `pinline`, e})
    return
  }

  let item = App.get_mouse_item(mode, e)

  if (!item) {
    return
  }

  if (DOM.class(e.target, [`hover_button`])) {
    let cmd = App.get_setting(`middle_click_hover_button`)
    App.run_command({cmd, item, from: `hover_button`, e})
    return
  }

  if (mode === `tabs`) {
    if (DOM.class(e.target, [`close_button`])) {
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
      if (DOM.parent(e.target, [`.color_icon_container`])) {
        App.edit_tab_color({item})
        return
      }
    }

    if (App.get_setting(`notes_icon_click`)) {
      if (DOM.parent(e.target, [`.notes_icon`])) {
        App.remove_notes(item)
        return
      }
    }

    if (App.taglist_enabled()) {
      if (DOM.class(e.target, [`taglist_item`])) {
        App.taglist_remove(e, item)
        return
      }

      if (DOM.parent(e.target, [`.taglist_container`])) {
        return
      }
    }

    if (App.get_setting(`parent_icon_click`)) {
      if (DOM.parent(e.target, [`.parent_icon`])) {
        App.close_node_tabs(item)
        return
      }
    }

    if (DOM.class(e.target, [`custom_icon`])) {
      App.remove_item_icon(item)
      return
    }
  }

  let cmd = App.get_setting(`middle_click_${item.mode}`)
  App.run_command({cmd, item, from: `middle_click`, e})
}

App.mouse_over_action = (e) => {
  let mode = App.active_mode
  let item = App.get_mouse_item(mode, e)

  if (!item) {
    return
  }

  App.set_item_tooltips(item)

  if (App.icon_pick_down) {
    App.toggle_selected({item, what: true})
    return
  }

  App.update_footer_info(item)
}

App.mouse_out_action = (e) => {
  let mode = App.active_mode
  let selected = App.get_selected(mode)

  if (selected) {
    App.update_footer_info(selected)
  }
}

App.reset_mouse = () => {
  clearTimeout(App.click_press_timeout)
  App.click_press_button = undefined
  App.click_press_triggered = false
}

App.start_click_press_timeout = (mode, e) => {
  clearTimeout(App.click_press_timeout)

  App.click_press_timeout = setTimeout(() => {
    App.click_press_action(mode, e)
  }, App.get_setting(`click_press_delay`))
}

App.click_press_action = (mode, e) => {
  if (!App.mouse_valid_type(e)) {
    return
  }

  if (DOM.parent(e.target, [`.main_menu_button`])) {
    if (App.click_press_button === 0) {
      let cmd = App.get_setting(`left_click_press_main_menu`)
      App.run_command({cmd, from: `click_press`, e})
    }
    else if (App.click_press_button === 1) {
      let cmd = App.get_setting(`middle_click_press_main_menu`)
      App.run_command({cmd, from: `click_press`, e})
    }

    App.click_press_triggered = true
    return
  }

  if (DOM.parent(e.target, [`#footer`])) {
    if (App.click_press_button === 0) {
      let cmd = App.get_setting(`left_click_press_footer`)
      App.run_command({cmd, from: `click_press`, e})
    }
    else if (App.click_press_button === 1) {
      let cmd = App.get_setting(`middle_click_press_footer`)
      App.run_command({cmd, from: `click_press`, e})
    }

    App.click_press_triggered = true
    return
  }

  if (DOM.parent(e.target, [`.favorites_empty_top`])) {
    if (App.click_press_button === 0) {
      let cmd = App.get_setting(`left_click_press_favorites_top`)
      App.run_command({cmd, from: `click_press`, e})
    }
    else if (App.click_press_button === 1) {
      let cmd = App.get_setting(`middle_click_press_favorites_top`)
      App.run_command({cmd, from: `click_press`, e})
    }

    App.click_press_triggered = true
    return
  }

  if (DOM.parent(e.target, [`.favorites_empty_bottom`])) {
    if (App.click_press_button === 0) {
      let cmd = App.get_setting(`left_click_press_favorites_bottom`)
      App.run_command({cmd, from: `click_press`, e})
    }
    else if (App.click_press_button === 1) {
      let cmd = App.get_setting(`middle_click_press_favorites_bottom`)
      App.run_command({cmd, from: `click_press`, e})
    }

    App.click_press_triggered = true
    return
  }

  if (DOM.parent(e.target, [`.favorites_button`])) {
    if (App.click_press_button === 0) {
      let cmd = App.get_setting(`left_click_press_favorites_button`)
      App.run_command({cmd, from: `click_press`, e})
    }
    else if (App.click_press_button === 1) {
      let cmd = App.get_setting(`middle_click_press_favorites_button`)
      App.run_command({cmd, from: `click_press`, e})
    }

    App.click_press_triggered = true
    return
  }

  let item = App.get_mouse_item(mode, e)

  if (!item) {
    return
  }

  if (item.header) {
    let sett

    if (App.click_press_button === 0) {
      sett = `left_click_press_header`
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
    if (DOM.parent(e.target, [`.hover_button`])) {
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
    if (DOM.parent(e.target, [`.close_button`])) {
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
    cmd = App.get_setting(`left_click_press_item`)
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
  if (!App.mouse_valid_type(e)) {
    return
  }

  let direction = App.wheel_direction(e)
  let mode = App.window_mode
  e.preventDefault()

  if (DOM.parent(e.target, [`.main_menu_button`])) {
    if (direction === `up`) {
      App.cycle_modes(true)
    }
    else if (direction === `down`) {
      App.cycle_modes(false)
    }

    return
  }

  if (DOM.parent(e.target, [`.scroller`])) {
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
  else if (e.target.closest(`.favorites_empty_top`)) {
    App.wheel_action(direction, `favorites_top`, e)
  }
  else if (e.target.closest(`.favorites_bar`)) {
    App.wheel_action(direction, `favorites_center`, e)
  }
  else if (e.target.closest(`.favorites_empty_bottom`)) {
    App.wheel_action(direction, `favorites_bottom`, e)
  }
  else if (e.target.closest(`#footer`)) {
    App.wheel_action(direction, `footer`, e)
  }
  else if (e.target.closest(`#main_title`)) {
    App.wheel_action(direction, `main_title`, e)
  }
  else if (DOM.parent(e.target, [`.item_container`])) {
    App.wheel_action(direction, `items`, e)
  }
  else if (DOM.parent(e.target, [`.playing_icon`])) {
    App.wheel_action(direction, `playing`, e)
  }
  else if (DOM.parent(e.target, [`.step_back_button`])) {
    App.wheel_action(direction, `step_back`, e)
  }
  else if (DOM.parent(e.target, [`.actions_button`])) {
    App.wheel_action(direction, `actions`, e)
  }
}

App.wheel_action = (direction, name, e) => {
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

  let item

  if (App.get_setting(`wheel_hover_item`)) {
    item = App.get_mouse_item(mode, e)
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

  if (click_date === undefined) {
    App[`click_date_${what}`] = 0
  }

  let double_delay = App.get_setting(`double_click_delay`)
  let date_now = App.now()
  let double = false

  if ((date_now - click_date) < double_delay) {
    if (click_target === e.target) {
      double = true
    }
  }

  App[`click_target_${what}`] = e.target

  if (double) {
    App[`click_date_${what}`] = 0
    action()
  }
  else {
    App[`click_date_${what}`] = date_now
  }
}

App.on_mouse_down = (e) => {
  let mode = App.active_mode
  App.reset_triggers()

  if (App.get_setting(`icon_pick`)) {
    if (e.button === 0) {
      if (DOM.parent(e.target, [`.item_icon_container`])) {
        let item = App.get_mouse_item(mode, e)

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
    App.start_click_press_timeout(mode, e)
  }
}

App.mouse_valid_type = (e) => {
  if (!e || !e.target) {
    return false
  }

  if (e.target.nodeType !== 1) {
    return false
  }

  return true
}