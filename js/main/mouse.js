App.setup_window_mouse = (mode) => {
  let container = DOM.el(`#${mode}_container`)

  DOM.ev(container, `mousedown`, (e) => {
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

  DOM.ev(container, `contextmenu`, (e) => {
    if (App.cursor_on_item(e, mode)) {
      let item = App.get_cursor_item(mode, e)

      if (item) {
        App.select_item(item)

        if (!item.highlighted) {
          if (App.get_highlights(mode).length > 0) {
            App.pick_item(item)
          }
        }

        App.show_item_menu(item, e.clientX, e.clientY)
        e.preventDefault()
      }
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
    App.select_item(App.drag_item, `none`, false)
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