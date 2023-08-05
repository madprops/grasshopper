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

App.mouse_up_action = (e) => {
  if (e.button !== 0) {
    return
  }

  App.item_range_on = false
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
        if (App.get_setting(`view_${media_type}`) === `icon`) {
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
    App.toggle_selected(item)
    return
  }

  App.select_item(item, `nearest_smooth`)

  if (item.mode === `tabs`) {
    if (App.get_setting(`mute_click`)) {
      if (e.target.classList.contains(`item_status_playing`) ||
        e.target.classList.contains(`item_status_muted`)) {
        App.toggle_mute_tabs(item)
        return
      }
    }
  }

  if (media_type) {
    if (App.get_setting(`view_${media_type}`) === `item`) {
      App.select_item(item, `nearest_smooth`)
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
  App.select_item(item, `nearest_smooth`, !item.selected)
  App.show_item_menu(item, e.clientX, e.clientY)
  e.preventDefault()
}

App.mouse_middle_action = (mode, e) => {
  if (!App.cursor_on_item(e, mode)) {
    return
  }

  let item = App.get_cursor_item(mode, e)
  App[`${mode}_action_alt`](item, e.shiftKey)
}

App.mouse_over_action = (mode, e) => {
  if (!App.cursor_on_item(e, mode)) {
    return
  }

  let item = App.get_cursor_item(mode, e)
  item.element.classList.add(`item_hover`)
  App.update_footer_info(item)
}

App.mouse_out_action = (mode, e) => {
  if (App.cursor_on_item(e, mode)) {
    let item = App.get_cursor_item(mode, e)
    item.element.classList.remove(`item_hover`)
  }

  let selected = App.get_selected(mode)

  if (selected) {
    App.update_footer_info(selected)
  }
}