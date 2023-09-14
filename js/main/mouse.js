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
          App.select_item(item, `nearest_smooth`)
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

  if (e.target.classList.contains(`item_button_right`)) {
    App.right_button_action(item)
    return
  }

  App.select_item(item, `nearest_smooth`)

  if (mode === `tabs`) {
    if (App.get_setting(`mute_click`)) {
      if (e.target.classList.contains(`item_status_playing`) ||
        e.target.classList.contains(`item_status_muted`)) {
        App.toggle_mute_tabs(item)
        return
      }
    }
  }

  if (media_type) {
    if (App.get_setting(`view_${media_type}_${mode}`) === `item`) {
      App.select_item(item, `nearest_smooth`)
      App.view_media(item)
      return
    }
  }

  if (App.get_setting(`double_click_command`) === `action`) {
    return
  }

  if (e.altKey) {
    return
  }

  App[`${mode}_action`](item)
}

App.mouse_double_click_action = (mode, e) => {
  if (App.get_setting(`double_click_new`)) {
    if (e.target.classList.contains(`container`)) {
      App.new_tab()
      return
    }
  }

  if (!App.cursor_on_item(e, mode)) {
    return
  }

  let item = App.get_cursor_item(mode, e)
  let cmd = App.get_setting(`double_click_command`)

  if (cmd !== `none`) {
    App.run_command({cmd: cmd, item: item, from: `double_click`})
  }
}

App.mouse_context_action = (mode, e) => {
  e.preventDefault()

  if (!App.cursor_on_item(e, mode)) {
    App.show_custom_menu(e, `empty`)
    return
  }

  let item = App.get_cursor_item(mode, e)
  App.select_item(item, `nearest_smooth`, !item.selected)
  App.show_item_menu(item, e.clientX, e.clientY)
}

App.mouse_middle_action = (mode, e) => {
  if (!App.cursor_on_item(e, mode)) {
    return
  }

  let item = App.get_cursor_item(mode, e)

  if (e.target.classList.contains(`item_button_close`)) {
    let cmd = App.get_setting(`middle_click_close_button`)

    if (cmd !== `none`) {
      App.run_command({cmd: cmd, item: item, from: `close_button`})
    }

    return
  }

  if (e.target.classList.contains(`item_button_open`)) {
    let cmd = App.get_setting(`middle_click_open_button`)

    if (cmd !== `none`) {
      App.run_command({cmd: cmd, item: item, from: `open_button`})
    }

    return
  }

  App.middle_click(item)
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

App.middle_click = (item) => {
  let cmd = App.get_setting(`middle_click_${item.mode}`)

  if (cmd !== `none`) {
    App.run_command({cmd: cmd, item: item, from: `middle_click`})
  }
}