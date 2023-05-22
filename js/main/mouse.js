App.setup_mouse = () => {
  App.reset_gestures()

  DOM.ev(document, `mousedown`, (e) => {
    App.reset_gestures()

    // Right click
    if (e.button === 2) {
      App.right_click_down = true
      App.right_click_y = e.clientY
      App.right_click_x = e.clientX
    }

    if (App.on_item_window()) {
      if (!e.target.closest(`.${App.window_mode}_item`)) {
        return
      }

      let item = App.get_cursor_item(App.window_mode, e)

      // Main click
      if (e.button === 0) {
        if (e.shiftKey) {
          App.highlight_range(item)
        }
      }
    }
  })

  DOM.ev(document, `mouseup`, (e) => {
    if (App.on_item_window()) {
      if (!e.target.closest(`.${App.window_mode}_item`)) {
        App.dehighlight(App.window_mode)
        return
      }

      let item = App.get_cursor_item(App.window_mode, e)

      // Main click
      if (e.button === 0) {
        if (e.shiftKey) {
          return
        }

        if (e.ctrlKey) {
          App.toggle_highlight(item)
          return
        }

        App.select_item(item)
        App[`${App.window_mode}_action`](item)
      }
      // Middle click
      else if (e.button === 1) {
        if (e.ctrlKey) {
          return
        }

        App[`${App.window_mode}_action_alt`](item, e.shiftKey)
      }
    }
  })

  DOM.ev(document, `contextmenu`, (e) => {
    if (App.settings.mouse_gestures && App.right_click_down) {
      let diff_y = Math.abs(e.clientY - App.right_click_y)
      let diff_x = Math.abs(e.clientX - App.right_click_x)

      if (diff_y > App.gesture_threshold || diff_x > App.gesture_threshold) {
        if (diff_y >= diff_x) {
          App.gesture_action(App.window_mode, e, `vertical`)
        }
        else {
          App.gesture_action(App.window_mode, e, `horizontal`)
        }

        e.preventDefault()
        return
      }
    }

    if (App.on_item_window()) {
      if (e.target.closest(`.${App.window_mode}_item`)) {
        App.show_item_menu(App.get_cursor_item(App.window_mode, e), e.clientX, e.clientY)
        e.preventDefault()
      }
    }
  })

  DOM.ev(document, `mouseover`, (e) => {
    if (App.on_item_window()) {
      if (e.target.closest(`.${App.window_mode}_item`)) {
        let item = App.get_cursor_item(App.window_mode, e)
        App.update_footer_info(item)
      }
    }
  })

  DOM.ev(document, `mouseout`, (e) => {
    if (App.on_item_window()) {
      let item = App.get_selected(App.window_mode)
      App.update_footer_info(item)
    }
  })

  DOM.ev(document, `wheel`, (e) => {
    if (App.on_item_window()) {
      if (e.shiftKey) {
        let direction = e.deltaY > 0 ? `down` : `up`

        if (direction === `up`) {
          App.scroll(App.window_mode, `up`, true)
        }
        else if (direction === `down`) {
          App.scroll(App.window_mode, `down`, true)
        }

        e.preventDefault()
      }
    }
  })

  // Drag

  DOM.ev(document, `dragstart`, (e) => {
    if (App.window_mode !== `tabs`) {
      return
    }

    if (App.settings.lock_drag && !e.ctrlKey) {
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
    App.drag_item = App.get_item_by_id(App.window_mode, id)
    App.drag_start_index = App.get_item_element_index(App.window_mode, App.drag_element)
    e.dataTransfer.setDragImage(new Image(), 0, 0)
    e.dataTransfer.setData(`text/plain`, App.drag_item.url)

    App.drag_items = []

    if (App.drag_item.highlighted) {
      for (let tab of App.get_items(App.window_mode)) {
        if (tab.highlighted) {
          App.drag_items.push(tab)
        }
      }
    }
    else {
      App.drag_items.push(App.drag_item)
    }

    App.drag_els = []

    for (let tab of App.drag_items) {
      App.drag_els.push(tab.element)
    }

    App.drag_moved = false
  })

  DOM.ev(document, `dragend`, (e) => {
    if (App.window_mode !== `tabs`) {
      return
    }

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

    App.dehighlight(App.window_mode)
    App.update_tab_index()
  })

  DOM.ev(document, `dragenter`, (e) => {
    if (App.window_mode !== `tabs`) {
      return
    }

    if (!App.drag_element) {
      e.preventDefault()
      return false
    }

    let direction = e.clientY > App.drag_y ? `down` : `up`
    App.drag_y = e.clientY

    if (e.target.closest(`.item`)) {
      let el = e.target.closest(`.item`)

      if (App.drag_els.includes(el)) {
        e.preventDefault()
        return false
      }

      let target = App.get_item_by_id(App.window_mode, el.dataset.id)

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

App.reset_gestures = () => {
  App.right_click_down = false
  App.right_click_y = 0
  App.right_click_x = 0
}

App.gesture_action = (mode, e, direction) => {
  if (direction === `vertical`) {
    if (e.clientY < App.right_click_y) {
      App.goto_top(mode)
    }
    else {
      App.goto_bottom(mode)
    }
  }
  else if (direction === `horizontal`) {
    if (e.clientX < App.right_click_x) {
      App.cycle_item_windows(true)
    }
    else {
      App.cycle_item_windows()
    }
  }
}