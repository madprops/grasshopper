App.get_cursor_item = (mode, e) => {
  let el = e.target.closest(`.${mode}_item`)
  let item = App.get_item_by_id(mode, el.dataset.id)

  if (!item) {
    el.remove()
    return
  }

  return item
}

App.cursor_on_item = (e, mode) => {
  return e.target.closest(`.${mode}_item`)
}

App.setup_window_mouse = (mode) => {
  let container = DOM.el(`#${mode}_container`)

  DOM.ev(window, `mouseup`, (e) => {
    App.mouse_up_action(e)
  })

  DOM.ev(window, `mousedown`, (e) => {
    if (e.button === 1) {
      e.preventDefault()
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

  DOM.ev(container, `wheel`, (e) => {
    App.mouse_wheel_action(mode, e)
  })

  DOM.ev(container, `mouseover`, (e) => {
    App.mouse_over_action(mode, e)
  })

  DOM.ev(container, `mouseout`, (e) => {
    App.mouse_out_action(mode, e)
  })
}

App.mouse_up_action = (e) => {
  if (e.button !== 0) {
    return
  }
}

// Using this on mousedown instead causes some problems
// For instance can't move a tab without selecting it
// And in a popup it would close the popup on selection
App.mouse_click_action = (mode, e) => {
  if (!App.cursor_on_item(e, mode)) {
    return
  }

  let item = App.get_cursor_item(mode, e)
  let media_type = App.get_media_type(item)

  if (e.target.classList.contains(`view_media_button`)) {
    if (!e.shiftKey && !e.ctrlKey) {
      if (media_type) {
        if (App.get_setting(`view_${media_type}_${mode}`) === `icon`) {
          App.select_item({item: item, scroll: `nearest`})
          App.view_media(item)
          return
        }
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

  if (App.get_setting(`icon_pick`)) {
    if (e.target.closest(`.item_icon_container`)) {
      App.pick(item)
      return
    }
  }

  if (App.get_setting(`hover_button`)) {
    if (e.target.closest(`.hover_button`)) {
      App.show_hover_menu(e, item)
      return
    }
  }

  if (mode === `tabs`) {
    if (App.get_setting(`close_button`) !== `none`) {
      if (e.target.classList.contains(`close_icon`)) {
        App.close_tabs(item, false, false)
        return
      }
    }

    if (App.get_setting(`mute_click`)) {
      if (App.get_setting(`muted_icon`) || App.get_setting(`playing_icon`)) {
        if (e.target.classList.contains(`playing_icon`) ||
          e.target.classList.contains(`muted_icon`)) {
          App.toggle_mute_tabs(item)
          return
        }
      }
    }

    if (App.get_setting(`notes_click`)) {
      if (App.get_setting(`notes_icon`)) {
        if (e.target.classList.contains(`notes_icon`)) {
          App.edit_notes(item)
          return
        }
      }
    }

    if (App.get_setting(`color_icon_click`)) {
      if (e.target.closest(`.item_info_color`)) {
        App.show_color_menu(item, e)
        return
      }
    }

    if (App.taglist_active()) {
      if (e.target.classList.contains(`taglist_item`)) {
        App.taglist_action(e, item)
        return
      }

      if (e.target.classList.contains(`taglist_add`)) {
        App.add_tags(item)
        return
      }
    }
  }

  if (media_type) {
    if (App.get_setting(`view_${media_type}_${mode}`) === `item`) {
      App.select_item({item: item, scroll: `nearest`})
      App.view_media(item)
      return
    }
  }

  if (App.get_setting(`double_click_command`) === `action`) {
    return
  }

  if (e.altKey || App.get_setting(`click_select`)) {
    return
  }

  if (mode === `tabs`) {
    App.check_tab_first(item)
  }

  App.select_item({item: item, scroll: `nearest_smooth`})
  App[`${mode}_action`](item)
}

App.mouse_double_click_action = (mode, e) => {
  if (App.get_setting(`double_click_new`)) {
    if (e.target.classList.contains(`item_container`)) {
      App.new_tab()
      return
    }
  }

  if (!App.cursor_on_item(e, mode)) {
    return
  }

  let item = App.get_cursor_item(mode, e)
  let cmd = App.get_setting(`double_click_command`)

  if (cmd === `item_action`) {
    if (!App.get_setting(`click_select`)) {
      return
    }
  }

  App.run_command({cmd: cmd, item: item, from: `double_click`, e: e})
}

App.mouse_context_action = (mode, e) => {
  if (!App.cursor_on_item(e, mode)) {
    App.show_custom_menu(e, `empty`)
    return
  }

  let item = App.get_cursor_item(mode, e)
  e.preventDefault()

  if (App.get_setting(`hover_button`)) {
    if (App.get_setting(`hover_button_pick`)) {
      if (e.target.closest(`.hover_button`)) {
        App.pick(item)
        return
      }
    }
  }

  if (App.taglist_active()) {
    if (e.target.classList.contains(`taglist_item`)) {
      App.show_taglist_menu(e, item)
      return
    }
  }

  if (App.get_setting(`item_menu_select`)) {
    App.select_item({item: item, scroll: `nearest`, deselect: !item.selected})
  }

  App.show_item_menu({item: item, e: e})
}

App.mouse_middle_action = (mode, e) => {
  if (!App.cursor_on_item(e, mode)) {
    return
  }

  let item = App.get_cursor_item(mode, e)
  e.preventDefault()

  if (e.target.classList.contains(`close_icon`)) {
    let cmd = App.get_setting(`middle_click_close_icon`)
    App.run_command({cmd: cmd, item: item, from: `close_button`, e: e})
    return
  }

  if (e.target.classList.contains(`hover_button`)) {
    let cmd = App.get_setting(`middle_click_hover_button`)
    App.run_command({cmd: cmd, item: item, from: `hover_button`, e: e})
    return
  }

  if (App.taglist_active()) {
    if (e.target.classList.contains(`taglist_item`)) {
      App.taglist_remove(e, item)
      return
    }
  }

  let cmd = App.get_setting(`middle_click_${item.mode}`)
  App.run_command({cmd: cmd, item: item, from: `middle_click`, e: e})
}

App.mouse_wheel_action = (mode, e) => {
  if (e.shiftKey) {
    let direction = App.wheel_direction(e)

    if (direction === `up`) {
      App.scroll(mode, `up`, true)
    }
    else if (direction === `down`) {
      App.scroll(mode, `down`, true)
    }

    e.preventDefault()
  }
}

App.mouse_over_action = (mode, e) => {
  if (!App.cursor_on_item(e, mode)) {
    return
  }

  let item = App.get_cursor_item(mode, e)
  App.update_footer_info(item)
}

App.mouse_out_action = (mode, e) => {
  let selected = App.get_selected(mode)

  if (selected) {
    App.update_footer_info(selected)
  }
}

App.right_button_action = (item) => {
  if (item.mode === `tabs`) {
    App.close_tabs(item, false, false)
  }
  else {
    App.open_items(item, true, false)
  }
}