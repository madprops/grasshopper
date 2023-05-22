App.setup_mouse = () => {
  App.reset_gestures()
}

App.setup_window_mouse = (mode) => {
  let container = DOM.el(`#${mode}_container`)

  DOM.ev(container, `mousedown`, (e) => {
    App.reset_gestures()

    if (!e.target.closest(`.${mode}_item`)) {
      return
    }

    let item = App.get_cursor_item(mode, e)

    // Main click
    if (e.button === 0) {
      if (e.shiftKey) {
        App.highlight_range(item)
      }
    }
    // Right click
    else if (e.button === 2) {
      App.right_click_down = true
      App.right_click_pos = e.clientY
    }
  })

  DOM.ev(container, `mouseup`, (e) => {
    if (!e.target.closest(`.${mode}_item`)) {
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
        App.toggle_highlight(item)
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
    if (App.right_click_down) {
      let diff = Math.abs(e.clientY - App.right_click_pos)

      if (diff > App.gesture_threshold) {
        if (e.clientY < App.right_click_pos) {
          App.goto_top(mode)
        }
        else {
          App.goto_bottom(mode)
        }

        e.preventDefault()
        return
      }
    }

    if (e.target.closest(`.${mode}_item`)) {
      App.show_item_menu(App.get_cursor_item(mode, e), e.clientX, e.clientY)
      e.preventDefault()
    }
  })

  DOM.ev(container, `mouseover`, (e) => {
    if (e.target.closest(`.${mode}_item`)) {
      let item = App.get_cursor_item(mode, e)
      App.update_footer_info(item)
    }
  })

  DOM.ev(container, `mouseout`, (e) => {
    let item = App.get_selected(mode)
    App.update_footer_info(item)
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

App.get_cursor_item = (mode, e) => {
  let el = e.target.closest(`.${mode}_item`)
  let item = App.get_item_by_id(mode, el.dataset.id)

  if (!item) {
    el.remove()
    return
  }

  return item
}

App.setup_drag = (mode, container) => {
  container.addEventListener(`dragstart`, (e) => {
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
    App.drag_item = App.get_item_by_id(mode, id)
    App.drag_start_index = App.get_item_element_index(mode, App.drag_element)
    e.dataTransfer.setDragImage(new Image(), 0, 0)
    e.dataTransfer.setData(`text/plain`, App.drag_item.url)

    App.drag_items = []

    if (App.drag_item.highlighted) {
      for (let tab of App.get_items(mode)) {
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

  container.addEventListener(`dragend`, (e) => {
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

    App.dehighlight(mode)
    App.update_tab_index()
  })

  container.addEventListener(`dragenter`, (e) => {
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

App.reset_gestures = () => {
  App.right_click_down = false
  App.right_click_pos = 0
}