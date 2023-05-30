App.setup_mouse = () => {
  App.reset_gestures()
}

App.setup_window_mouse = (mode) => {
  let container = DOM.el(`#${mode}_container`)

  DOM.ev(container, `mousedown`, (e) => {
    App.reset_gestures()

    // Right click
    if (e.button === 2) {
      App.mouse_gestore_active = true
      App.mouse_gesture_y = e.clientY
      App.mouse_gesture_x = e.clientX
    }

    if (!App.cursor_on_item(e, mode)) {
      return
    }

    let item = App.get_cursor_item(mode, e)

    // Main click
    if (e.button === 0) {
      if (e.shiftKey) {
        App.highlight_range(item)
      }
    }
  })

  DOM.ev(container, `mouseup`, (e) => {
    if (!App.cursor_on_item(e, mode)) {
      App.dehighlight(mode)
      return
    }

    let item = App.get_cursor_item(mode, e)

    // Main click
    if (e.button === 0) {
      if (e.shiftKey) {
        return
      }

      if (e.ctrlKey) {
        App.pick_item(item)
        return
      }

      App.select_item(item)
      App[`${mode}_action`](item)
    }
    // Middle click
    else if (e.button === 1) {
      if (e.ctrlKey) {
        return
      }

      App[`${mode}_action_alt`](item, e.shiftKey)
    }
  })

  DOM.ev(container, `contextmenu`, (e) => {
    if (App.get_setting(`mouse_gestures`) && App.mouse_gestore_active) {
      let diff_y = Math.abs(e.clientY - App.mouse_gesture_y)
      let diff_x = Math.abs(e.clientX - App.mouse_gesture_x)

      if (diff_y > App.mouse_gesture_threshold || diff_x > App.mouse_gesture_threshold) {
        App.mouse_gesture_last_y = e.clientY
        App.mouse_gesture_last_x = e.clientX

        if (diff_y >= diff_x) {
          App.mouse_gesture_action(e, `vertical`)
        }
        else {
          App.mouse_gesture_action(e, `horizontal`)
        }

        e.preventDefault()
        return
      }
    }

    if (App.cursor_on_item(e, mode)) {
      let item = App.get_cursor_item(mode, e)

      if (!item.highlighted) {
        if (App.get_highlights(mode).length > 0) {
          App.pick_item(item)
        }
      }

      App.reset_gestures()
      App.show_item_menu(item, e.clientX, e.clientY)
      e.preventDefault()
    }
  })

  DOM.ev(container, `mouseover`, (e) => {
    if (App.cursor_on_item(e, mode)) {
      let item = App.get_cursor_item(mode, e)
      App.update_footer_info(item)
    }
  })

  DOM.ev(container, `mouseout`, (e) => {
    let item = App.get_selected(mode)

    if (item) {
      App.update_footer_info(item)
    }
  })

  DOM.ev(container, `mousemove`, (e) => {
    let coord = {
      x: e.clientX,
      y: e.clientY,
    }

    App.mouse_gesture_coords.push(coord)
  })

  DOM.ev(container, `wheel`, (e) => {
    if (e.shiftKey) {
      let direction = e.deltaY > 0 ? `down` : `up`

      if (direction === `up`) {
        App.scroll(mode, `up`, true)
      }
      else if (direction === `down`) {
        App.scroll(mode, `down`, true)
      }

      e.preventDefault()
    }
  })
}

App.setup_drag = (mode) => {
  let container = DOM.el(`#${mode}_container`)

  DOM.ev(container, `dragstart`, (e) => {
    if (App.get_setting(`lock_drag`) && !e.ctrlKey) {
      e.preventDefault()
      return false
    }

    App.drag_element = e.target.closest(`.grasshopper_item`)

    if (!App.drag_element) {
      e.preventDefault()
      return false
    }

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

    App.drag_moved = false
  })

  DOM.ev(container, `dragend`, (e) => {
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

    App.update_tab_index()
  })

  DOM.ev(container, `dragenter`, (e) => {
    if (!App.drag_element) {
      e.preventDefault()
      return false
    }

    let direction = e.clientY > App.drag_y ? `down` : `up`
    App.drag_y = e.clientY

    if (App.cursor_on_item(e, mode)) {
      let el = e.target.closest(`.item`)

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

      if (direction === `down`) {
        el.after(...App.drag_els)
      }
      else {
        el.before(...App.drag_els)
      }

      App.drag_moved = true
    }

    e.preventDefault()
    return false
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

App.reset_gestures = () => {
  App.mouse_gestore_active = false
  App.mouse_gesture_y = 0
  App.mouse_gesture_x = 0
  App.mouse_gesture_coords = []
  App.mouse_gesture_last_y = 0
  App.mouse_gesture_last_x = 0
}

App.mouse_gesture_action = (e, direction) => {
  let ys = App.mouse_gesture_coords.map(c => c.y)
  let max_y = Math.max(...ys)
  let min_y = Math.min(...ys)

  let xs = App.mouse_gesture_coords.map(c => c.x)
  let max_x = Math.max(...xs)
  let min_x = Math.min(...xs)

  let gt = App.mouse_gesture_threshold
  let path_y, path_x

  if (min_y < App.mouse_gesture_y - gt) {
    path_y = `up`
  }
  else if (max_y > App.mouse_gesture_y + gt) {
    path_y = `down`
  }

  if (path_y === `up`) {
    if (App.mouse_gesture_last_y > min_y) {
      if (Math.abs(App.mouse_gesture_last_y - min_y) > gt) {
        path_y = `up_and_down_1`
      }
    }
  }

  if (path_y === `down`) {
    if (App.mouse_gesture_last_y < max_y) {
      if (Math.abs(App.mouse_gesture_last_y - max_y) > gt) {
        path_y = `up_and_down_2`
      }
    }
  }

  if (max_x > App.mouse_gesture_x + gt) {
    path_x = `right`
  }
  else if (min_x < App.mouse_gesture_x - gt) {
    path_x = `left`
  }

  if (path_x === `left`) {
    if (App.mouse_gesture_last_x > min_x) {
      if (Math.abs(App.mouse_gesture_last_x - min_x) > gt) {
        path_x = `left_and_right_1`
      }
    }
  }

  if (path_x === `right`) {
    if (App.mouse_gesture_last_x < max_x) {
      if (Math.abs(App.mouse_gesture_last_x - max_x) > gt) {
        path_x = `left_and_right_2`
      }
    }
  }

  let path

  if (max_y - min_y > max_x - min_x) {
    path = path_y
  }
  else {
    path = path_x
  }

  let mode = App.window_mode

  if (path === `up`) {
    App.goto_top(mode)
  }
  else if (path === `down`) {
    App.goto_bottom(mode)
  }
  else if (path === `up_and_down_1` || path === `up_and_down_2`) {
    App.show_all(mode)
  }
  else if (path === `left`) {
    App.cycle_item_windows(true)
  }
  else if (path === `right`) {
    App.cycle_item_windows()
  }

  App.reset_gestures()
}