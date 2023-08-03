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

App.dragstart_action = (mode, e) => {
  if (e.shiftKey) {
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

  if (App.drag_item.selected) {
    for (let item of App.get_items(mode)) {
      if (item.selected) {
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