App.setup_mouse = () => {
  if (!App.cmds.includes(App.get_setting(`double_click_tab_action`))) {
    App.set_setting(`double_click_tab_action`, `none`)
  }
}

App.setup_window_mouse = (mode) => {
  let container = DOM.el(`#${mode}_container`)

  DOM.ev(container, `mousedown`, (e) => {
    let item = App.get_cursor_item(mode, e)

    if (item) {
      if (e.target.classList.contains(`item_pick`)) {
        if (item.highlighted) {
          App.item_range_highlight = false
        }
        else {
          App.select_item(item, `nearest`, false)
          App.item_range_highlight = true
        }

        App.toggle_highlight(item)
        App.item_range_on = true
      }
    }
  })

  DOM.ev(container, `mouseup`, (e) => {
    App.item_range_on = false
  })

  DOM.ev(container, `click`, (e) => {
    if (!App.cursor_on_item(e, mode)) {
      return
    }

    if (e.target.classList.contains(`item_pick`)) {
      return
    }

    let item = App.get_cursor_item(mode, e)

    if (e.target.classList.contains(`view_media_button`)) {
      App.view_media(item)
      return
    }

    if (e.shiftKey) {
      App.highlight_range(item)
      return
    }

    if (e.target.classList.contains(`item_alt`)) {
      App.alt_button_action(item, e.shiftKey)
      return
    }

    if (e.ctrlKey) {
      App.pick_item(item)
      return
    }

    if (App.get_highlights(mode).length > 0) {
      App.dehighlight(mode)
    }

    App[`${mode}_action`](item)
  })

  DOM.ev(container, `dblclick`, (e) => {
    if (!App.cursor_on_item(e, mode)) {
      return
    }

    if (e.target.classList.contains(`item_button`)) {
      return
    }

    if (mode === `tabs`) {
      let item = App.get_cursor_item(mode, e)

      setTimeout(() => {
        App.double_click_tab(item)
      }, 80)
    }
  })

  DOM.ev(container, `contextmenu`, (e) => {
    if (App.cursor_on_item(e, mode)) {
      let item = App.get_cursor_item(mode, e)

      if (item) {
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

  DOM.ev(container, `wheel`, (e) => {
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
  })

  DOM.ev(container, `mouseover`, (e) => {
    if (App.cursor_on_item(e, mode)) {
      let item = App.get_cursor_item(mode, e)
      App.update_footer_info(item)

      if (App.item_range_on) {
        App.toggle_highlight(item, App.item_range_highlight)
      }
    }
  })

  DOM.ev(container, `mouseout`, (e) => {
    let item = App.get_selected(mode)

    if (item) {
      App.update_footer_info(item)
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
  })

  DOM.ev(container, `dragenter`, (e) => {
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
  })

  DOM.ev(container, `dragend`, (e) => {
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

App.alt_button_action = (item, shift) => {
  if (item.mode === `tabs`) {
    App.close_tabs(item)
  }
  else {
    App.open_items(item, true)
  }
}