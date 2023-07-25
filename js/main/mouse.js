App.mousedown_action = (mode, e) => {
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

App.mouseup_action = (e) => {
  if (e.button !== 0) {
    return
  }

  App.item_range_on = false
}

App.mouseclick_action = (mode, e) => {
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
    if (App.get_media_type(item)) {
      App.select(item)
      App.view_media(item)
      return
    }
  }

  App[`${item.mode}_action`](item)
}

App.mousecontext_action = (mode, e) => {
  let item = App.get_cursor_item(mode, e)
  App.select(item, false)

  if (!item.highlighted && App.highlights(item.mode)) {
    App.dehighlight(item.mode)
  }

  App.show_item_menu(item, e.clientX, e.clientY)
  e.preventDefault()
}

App.mousewheel_action = (mode, e) => {
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

App.mouseover_action = (mode, e) => {
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

App.mouseout_action = (mode, e) => {
  let item = App.get_selected(mode)

  if (item) {
    App.update_footer_info(item)
  }
}

App.setup_window_mouse = (mode) => {
  let container = DOM.el(`#${mode}_container`)

  DOM.ev(container, `mousedown`, (e) => {
    if (e.button !== 0) {
      return
    }

    if (!App.cursor_on_item(e, mode)) {
      return
    }

    App.mousedown_action(mode, e)
  })

  DOM.ev(window, `mouseup`, (e) => {
    App.mouseup_action(e)
  })

  DOM.ev(container, `click`, (e) => {
    if (!App.cursor_on_item(e, mode)) {
      return
    }

    App.mouseclick_action(mode, e)
  })

  DOM.ev(container, `contextmenu`, (e) => {
    if (!App.cursor_on_item(e, mode)) {
      return
    }

    App.mousecontext_action(mode, e)
  })

  DOM.ev(container, `wheel`, (e) => {
    App.mousewheel_action(mode, e)
  })

  DOM.ev(container, `mouseover`, (e) => {
    if (!App.cursor_on_item(e, mode)) {
      return
    }

    App.mouseover_action(mode, e)
  })

  DOM.ev(container, `mouseout`, (e) => {
    App.mouseout_action(mode, e)
  })
}

App.dragstart_action = (mode, e) => {
  if (e.shiftKey || e.ctrlKey) {
    e.preventDefault()
    return false
  }

  if (mode !== `tabs`) {
    e.preventDefault()
    return false
  }

  if (App.get_setting(`lock_drag`) && !e.ctrlKey) {
    e.preventDefault()
    return false
  }

  if (e.target.closest(`.item_button`)) {
    e.preventDefault()
    return false
  }

  App.drag_element = e.target.closest(`.grasshopper_item`)

  if (!App.drag_element) {
    e.preventDefault()
    return false
  }

  App.dragging = true
  App.hide_scroller(mode)
  App.drag_y = e.clientY
  let id = App.drag_element.dataset.id
  App.drag_item = App.get_item_by_id(mode, id)
  App.drag_start_index = App.get_item_element_index(mode, App.drag_element)
  e.dataTransfer.setDragImage(new Image(), 0, 0)
  e.dataTransfer.setData(`text/plain`, App.drag_item.url)
  App.drag_items = []

  if (App.drag_item.highlighted) {
    for (let item of App.get_items(mode)) {
      if (item.highlighted) {
        App.drag_items.push(item)
      }
    }
  }
  else {
    App.drag_items.push(App.drag_item)
  }

  App.drag_els = []

  for (let item of App.drag_items) {
    App.drag_els.push(item.element)
  }

  let leader_top_id = App.drag_els[0].dataset.id
  let leader_bottom_id = App.drag_els.at(-1).dataset.id
  App.drag_leader_top = App.get_item_by_id(mode, leader_top_id)
  App.drag_leader_bottom = App.get_item_by_id(mode, leader_bottom_id)
  App.drag_moved = false
}

App.dragenter_action = (mode, e) => {
  if (!App.drag_element) {
    e.preventDefault()
    return false
  }

  let el = e.target.closest(`.grasshopper_item`)

  if (el === App.drag_element) {
    e.preventDefault()
    return false
  }

  let direction = e.clientY > App.drag_y ? `down` : `up`
  App.drag_y = e.clientY

  if (App.cursor_on_item(e, mode)) {
    if (App.drag_els.includes(el)) {
      e.preventDefault()
      return false
    }

    let target = App.get_item_by_id(mode, el.dataset.id)

    for (let item of App.drag_items) {
      if ((target.pinned && !item.pinned) || (!target.pinned && item.pinned)) {
        e.preventDefault()
        return false
      }
    }

    let leader

    if (direction === `down`) {
      leader = `bottom`
      el.after(...App.drag_els)
    }
    else {
      leader = `top`
      el.before(...App.drag_els)
    }

    App.scroll_to_item(App[`drag_leader_${leader}`], `nearest`)
    App.drag_moved = true
  }

  e.preventDefault()
  return false
}

App.dragend_action = (mode, e) => {
  App.dragging = false
  App.do_check_scroller(mode)

  if (!App.drag_element) {
    App.drag_element = undefined
    e.preventDefault()
    return false
  }

  App.drag_element = undefined

  if (!App.drag_moved) {
    e.preventDefault()
    return false
  }

  App.update_tabs_index(App.drag_items)
}

App.setup_drag = (mode) => {
  let container = DOM.el(`#${mode}_container`)

  DOM.ev(container, `dragstart`, (e) => {
    App.dragstart_action(mode, e)
  })

  DOM.ev(container, `dragenter`, (e) => {
    App.dragenter_action(mode, e)
  })

  DOM.ev(container, `dragend`, (e) => {
    App.dragend_action(mode, e)
  })
}

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

App.right_button_action = (item) => {
  App.dehighlight(item.mode)

  if (item.mode === `tabs`) {
    App.close_tabs(item)
  }
  else {
    App.open_items(item, true)
  }
}

App.on_middle_click = (e) => {
  let mode = App.window_mode

  if (App.on_items()) {
    if (App.cursor_on_item(e, mode)) {
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
  }
}