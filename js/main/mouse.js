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

  DOM.ev(container, `mousedown`, (e) => {
    if (e.button !== 0) {
      return
    }

    App.mouse_down_action(mode, e)
  })

  DOM.ev(window, `mouseup`, (e) => {
    App.mouse_up_action(e)
  })

  DOM.ev(container, `click`, (e) => {
    App.mouse_click_action(mode, e)
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

App.mouse_down_action = (mode, e) => {
  if (!App.cursor_on_item(e, mode)) {
    return
  }

  let item = App.get_cursor_item(mode, e)

  if (e.target.classList.contains(`item_pick`)) {
    App.item_range_on = true

    if (item.highlighted) {
      App.item_range_highlight = false
    }
    else {
      App.select_item(item, `none`, false)
      App.item_range_highlight = true
    }

    if (e.shiftKey) {
      App.highlight_range(item)
    }
    else {
      App.toggle_highlight(item)
    }
  }
}

App.mouse_up_action = (e) => {
  if (e.button !== 0) {
    return
  }

  App.item_range_on = false
}

App.mouse_click_action = (mode, e) => {
  if (!App.cursor_on_item(e, mode)) {
    return
  }

  let item = App.get_cursor_item(mode, e)

  if (e.target.classList.contains(`item_pick`)) {
    return
  }

  if (e.target.classList.contains(`view_media_button`)) {
    if (!e.shiftKey && !e.ctrlKey) {
      App.select(item)
      App.view_media(item)
      return
    }
  }

  if (e.shiftKey) {
    App.highlight_range(item)
    App.select(item, false)
    return
  }

  if (e.ctrlKey) {
    App.select(item, false)
    App.toggle_highlight(item)
    return
  }

  if (e.target.classList.contains(`item_button_right`)) {
    App.right_button_action(item)
    return
  }

  App.select(item)

  if (item.mode === `tabs`) {
    if (App.get_setting(`mute_click`)) {
      if (e.target.classList.contains(`item_status_playing`) ||
        e.target.classList.contains(`item_status_muted`)) {
        App.toggle_mute_tabs(item)
        return
      }
    }
  }

  if (App.get_setting(`view_media`)) {
    if (App.get_view_media_type(item)) {
      App.select(item)
      App.view_media(item)
      return
    }
  }

  App[`${item.mode}_action`](item)
}

App.mouse_context_action = (mode, e) => {
  if (!App.cursor_on_item(e, mode)) {
    return
  }

  let item = App.get_cursor_item(mode, e)

  App.select(item, false)

  if (!item.highlighted && App.highlights(item.mode)) {
    App.dehighlight(item.mode)
  }

  App.show_item_menu(item, e.clientX, e.clientY)
  e.preventDefault()
}

App.mouse_middle_action = (mode, e) => {
  if (!App.cursor_on_item(e, mode)) {
    return
  }

  let item = App.get_cursor_item(mode, e)

  if (e.target.classList.contains(`item_pick`)) {
    let cmd = App.get_setting(`middle_click_pick_button`)

    if (cmd !== `none`) {
      App.run_command({cmd: cmd, item: item, from: `pick_button`})
    }

    return
  }

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

  App.dehighlight(mode)
  App[`${mode}_action_alt`](item, e.shiftKey)
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

  if (App.item_range_on) {
    if (item.highlighted !== App.item_range_highlight) {
      if (App.item_range_highlight) {
        App.select_item(item, `none`, false)
      }

      App.toggle_highlight(item, App.item_range_highlight)
    }
  }
}

App.mouse_out_action = (mode, e) => {
  let item = App.get_selected(mode)

  if (item) {
    App.update_footer_info(item)
  }

}

App.right_button_action = (item) => {
  App.dehighlight(item.mode)

  if (item.mode === `tabs`) {
    App.close_tabs(item)
  }
  else {
    App.open_items(item, true)
  }
}