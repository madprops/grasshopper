App.get_mouse_item = (mode, e) => {
  let el = DOM.parent(e.target, [`.${mode}_item`])
  let item = App.get_item_by_id(mode, el.dataset.id)

  if (!item) {
    el.remove()
    return
  }

  return item
}

App.cursor_on_item = (mode, e) => {
  return DOM.parent(e.target, [`.${mode}_item`])
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
}

App.setup_mode_mouse = (mode) => {
  let container = DOM.el(`#${mode}_container`)
  App.setup_container_mouse(mode, container)
}

App.setup_container_mouse = (mode, container) => {
  DOM.ev(container, `mousedown`, (e) => {
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
      if (App.cursor_on_item(mode, e)) {
        App.click_press_button = e.button
        App.click_press_triggered = false
        App.start_click_press_timeout(mode, e)
      }
    }
  })

  DOM.ev(container, `click`, (e) => {
    App.mouse_click_action(mode, e)
  })

  DOM.ev(container, `dblclick`, (e) => {
    App.mouse_double_click_action(mode, e)
  })

  DOM.ev(container, `contextmenu`, (e) => {
    App.mouse_context_action(mode, e)
  })

  DOM.ev(container, `mouseover`, (e) => {
    App.mouse_over_action(mode, e)
  })

  DOM.ev(container, `mouseout`, (e) => {
    App.mouse_out_action(mode, e)
  })
}

// Using this on mousedown instead causes some problems
// For instance can't move a tab without selecting it
// And in a popup it would close the popup on selection
App.mouse_click_action = (mode, e) => {
  if (App.click_press_triggered) {
    App.reset_triggers()
    return
  }

  App.reset_triggers()

  if (!App.cursor_on_item(mode, e)) {
    if (DOM.parent(e.target, [`#pinline`])) {
      let items = App.custom_menu_items({
        name: `pinline_menu`,
      })

      App.show_context({items: items, e: e})
    }

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
        App.select_item({item: item, scroll: `nearest`})
        App.view_media(item)
        return
      }
    }
    else if (media_setting === `item`) {
      App.select_item({item: item, scroll: `nearest`})
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

  if (App.get_setting(`hover_button`)) {
    if (DOM.parent(e.target, [`.hover_button`])) {
      App.show_hover_menu(e, item)
      return
    }
  }

  if (mode === `tabs`) {
    if (App.get_setting(`close_button`) !== `none`) {
      if (DOM.class(e.target, [`close_button`])) {
        App.close_tabs(item)
        return
      }
    }

    if (App.get_setting(`mute_click`)) {
      if (App.get_setting(`muted_icon`) || App.get_setting(`playing_icon`)) {
        if (DOM.class(e.target, [`playing_icon`, `muted_icon`])) {
          App.toggle_mute_tabs(item)
          return
        }
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
  }

  if (App.get_setting(`color_icon_click`)) {
    if (DOM.parent(e.target, [`.color_icon_container`])) {
      App.show_color_menu(item, e, false)
      return
    }
  }

  if (App.get_setting(`notes_icon_click`)) {
    if (App.get_setting(`notes_icon`)) {
      if (DOM.class(e.target, [`notes_icon`])) {
        App.edit_notes(item)
        return
      }
    }
  }

  if (App.get_setting(`custom_icon_click`)) {
    if (DOM.class(e.target, [`custom_icon`])) {
      App.custom_icon_menu(item, e)
      return
    }
  }

  if (e.altKey || App.get_setting(`click_select`)) {
    App.select_item({item: item, scroll: `nearest_smooth`})
    return
  }

  if (App.get_setting(`load_lock`)) {
    if (item.unloaded) {
      App.select_item({item: item, scroll: `nearest_smooth`})
      return
    }
  }

  let from
  let tab_box = DOM.parent(e.target, [`#tab_box`])

  if (tab_box) {
    from = `tab_box`
  }
  else {
    from = `click`
  }

  App[`${mode}_action`](item, from)
}

App.mouse_double_click_action = (mode, e) => {
  if (DOM.class(e.target, [`item_container`])) {
    let cmd = App.get_setting(`double_click_empty`)
    App.run_command({cmd: cmd, from: `mouse`, e: e})
  }

  if (!App.cursor_on_item(mode, e)) {
    return
  }

  let item = App.get_mouse_item(mode, e)

  if (!item) {
    return
  }

  if (App.taglist_enabled()) {
    if (DOM.parent(e.target, [`.taglist`])) {
      return
    }
  }

  if (DOM.parent(e.target, [`.item_icon_container`])) {
    return
  }

  if (App.get_setting(`double_click_header`)) {
    if (DOM.parent(e.target, [`.item_text`])) {
      if (item.header) {
        App.select_header_group(item)
        return
      }
    }
  }

  if (App.get_setting(`load_lock`)) {
    if (item.unloaded) {
      App[`${mode}_action`](item, `click`)
      return
    }
  }

  let cmd = App.get_setting(`double_click_item`)

  if (cmd === `item_action`) {
    if (!App.get_setting(`click_select`)) {
      return
    }
  }

  App.run_command({cmd: cmd, item: item, from: `double_click`, e: e})
}

App.mouse_context_action = (mode, e) => {
  e.preventDefault()

  if (!App.cursor_on_item(mode, e)) {
    App.show_empty_menu(e)
    return
  }

  let item = App.get_mouse_item(mode, e)

  if (!item) {
    return
  }

  if (App.get_setting(`hover_button`)) {
    if (App.get_setting(`hover_button_pick`)) {
      if (DOM.parent(e.target, [`.hover_button`])) {
        App.pick(item)
        return
      }
    }
  }

  let item_container = DOM.parent(e.target, [`.item_container`])

  if (item_container)  {
    if (App.get_setting(`icon_pick`)) {
      if (DOM.parent(e.target, [`.item_icon_container`])) {
        App.select_item({item: item, scroll: `nearest`, deselect: true})
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
    App.select_item({item: item, scroll: `nearest`, deselect: !item.selected})
  }

  App.show_item_menu({item: item, e: e})
}

App.mouse_middle_action = (mode, e) => {
  if (App.click_press_triggered) {
    App.reset_triggers()
    return
  }

  App.reset_triggers()

  if (DOM.class(e.target, [`favorites_empty_top`])) {
    let cmd = App.get_setting(`middle_click_favorites_top`)
    App.run_command({cmd: cmd, from: `favorites_button`, e: e})
    return
  }

  if (DOM.class(e.target, [`favorites_empty_bottom`])) {
    let cmd = App.get_setting(`middle_click_favorites_bottom`)
    App.run_command({cmd: cmd, from: `favorites_button`, e: e})
    return
  }

  if (DOM.class(e.target, [`favorites_button`])) {
    let cmd = App.get_setting(`middle_click_favorites_button`)
    App.run_command({cmd: cmd, from: `favorites_button`, e: e})
    return
  }

  if (!App.cursor_on_item(mode, e)) {
    if (DOM.parent(e.target, [`#pinline`])) {
      let cmd = App.get_setting(`middle_click_pinline`)
      App.run_command({cmd: cmd, from: `pinline`, e: e})
    }

    return
  }

  let item = App.get_mouse_item(mode, e)

  if (!item) {
    return
  }

  if (DOM.class(e.target, [`close_button`])) {
    let cmd = App.get_setting(`middle_click_close_button`)
    App.run_command({cmd: cmd, item: item, from: `close_button`, e: e})
    return
  }

  if (DOM.class(e.target, [`hover_button`])) {
    let cmd = App.get_setting(`middle_click_hover_button`)
    App.run_command({cmd: cmd, item: item, from: `hover_button`, e: e})
    return
  }

  if (mode === `tabs`) {
    if (App.get_setting(`color_icon_click`)) {
      if (DOM.parent(e.target, [`.color_icon_container`])) {
        App.edit_tab_color({item: item})
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
      if (DOM.parent(e.target, [`.taglist`])) {
        if (DOM.class(e.target, [`taglist_item`])) {
          App.taglist_remove(e, item)
          return
        }
      }
    }

    if (DOM.class(e.target, [`custom_icon`])) {
      App.remove_item_icon(item)
      return
    }
  }

  let cmd = App.get_setting(`middle_click_${item.mode}`)
  App.run_command({cmd: cmd, item: item, from: `middle_click`, e: e})
}

App.mouse_over_action = (mode, e) => {
  if (!App.cursor_on_item(mode, e)) {
    return
  }

  let item = App.get_mouse_item(mode, e)

  if (!item) {
    return
  }

  if (App.icon_pick_down) {
    App.toggle_selected({item: item, what: true})
    return
  }

  App.update_footer_info(item)
}

App.mouse_out_action = (mode, e) => {
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
  if (!App.cursor_on_item(mode, e)) {
    return
  }

  let item = App.get_mouse_item(mode, e)

  if (!item) {
    return
  }

  let cmd

  if (App.click_press_button === 0) {
    cmd = App.get_setting(`left_click_press_item`)
  }
  else if (App.click_press_button === 1) {
    cmd = App.get_setting(`middle_click_press_item`)
  }

  if (cmd) {
    if (App.run_command({cmd: cmd, from: `click_press`, item: item, e: e})) {
      App.click_press_triggered = true
    }
  }
}

App.on_mouse_wheel = (e) => {
  let direction = App.wheel_direction(e)
  let mode = App.window_mode

  if (DOM.parent(e.target, [`.scroller`, `.footer`])) {
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

    e.preventDefault()
  }
  else if (e.target.closest(`.favorites_empty_top`)) {
    if (direction === `up`) {
      let cmd = App.get_setting(`wheel_up_favorites_top`)
      App.run_command({cmd: cmd, from: `mouse`, e: e})
    }
    else if (direction === `down`) {
      let cmd = App.get_setting(`wheel_down_favorites_top`)
      App.run_command({cmd: cmd, from: `mouse`, e: e})
    }

    e.preventDefault()
  }
  else if (e.target.closest(`.favorites_bar`)) {
    if (direction === `up`) {
      let cmd = App.get_setting(`wheel_up_favorites_center`)
      App.run_command({cmd: cmd, from: `mouse`, e: e})
    }
    else if (direction === `down`) {
      let cmd = App.get_setting(`wheel_down_favorites_center`)
      App.run_command({cmd: cmd, from: `mouse`, e: e})
    }

    e.preventDefault()
  }
  else if (e.target.closest(`.favorites_empty_bottom`)) {
    if (direction === `up`) {
      let cmd = App.get_setting(`wheel_up_favorites_bottom`)
      App.run_command({cmd: cmd, from: `mouse`, e: e})
    }
    else if (direction === `down`) {
      let cmd = App.get_setting(`wheel_down_favorites_bottom`)
      App.run_command({cmd: cmd, from: `mouse`, e: e})
    }

    e.preventDefault()
  }
  else if (DOM.parent(e.target, [`.item_container`])) {
    if (e.shiftKey) {
      if (direction === `up`) {
        App.scroll_page(mode, `up`)
      }
      else if (direction === `down`) {
        App.scroll_page(mode, `down`)
      }

      e.preventDefault()
    }
  }
}