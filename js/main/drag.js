App.setup_drag = (mode) => {
  let container = DOM.el(`#${mode}_container`)

  DOM.ev(container, `dragstart`, (e) => {
    if (App.icon_pick_down) {
      e.preventDefault()
      return false
    }

    App.dragstart_action(mode, e)
  })

  DOM.ev(container, `dragenter`, (e) => {
    App.dragenter_action(mode, e)
  })

  DOM.ev(container, `dragend`, (e) => {
    if (App.icon_pick_down) {
      App.icon_pick_down = false
      return
    }

    App.dragend_action(mode, e)
  })
}

App.drag_active = (mode, e) => {
  if (App.get_setting(`lock_drag`) && !e.ctrlKey) {
    return false
  }

  if (mode !== `tabs` || !App.tabs_normal()) {
    return false
  }

  return true
}

App.dragstart_action = (mode, e) => {
  App.reset_triggers()

  if (e.shiftKey) {
    e.preventDefault()
    return false
  }

  App.drag_element = e.target.closest(`.grasshopper_item`)

  if (!App.drag_element) {
    e.preventDefault()
    return false
  }

  App.dragging = true
  App.drag_y = e.clientY
  let id = App.drag_element.dataset.id
  App.drag_item = App.get_item_by_id(mode, id)

  App.drag_start_index = App.get_item_element_index({
    mode: mode,
    element: App.drag_element,
    include_all: true,
  })

  if (!App.drag_active(mode, e)) {
    return
  }

  App.drag_items = []
  let urls = []
  let moz_urls = []

  if (App.drag_item.selected) {
    for (let item of App.get_items(mode)) {
      if (item.selected) {
        App.drag_items.push(item)
        urls.push(item.url)

        moz_urls.push(`${item.url}\n${item.title}`)
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

  let uri_list = urls.join(`\r\n`)
  e.dataTransfer.setDragImage(new Image(), 0, 0)
  e.dataTransfer.setData(`text/x-moz-url`, moz_urls.join(`\r\n`))
  e.dataTransfer.setData(`text/uri-list`, uri_list)
  e.dataTransfer.setData(`text/plain`, uri_list)

  let leader_top_id = App.drag_els[0].dataset.id
  let leader_bottom_id = App.drag_els.at(-1).dataset.id
  App.drag_leader_top = App.get_item_by_id(mode, leader_top_id)
  App.drag_leader_bottom = App.get_item_by_id(mode, leader_bottom_id)
  App.drag_moved = false
}

App.dragenter_action = (mode, e) => {
  if (!App.drag_active(mode, e)) {
    return
  }

  if (!App.drag_element) {
    e.preventDefault()
    return false
  }

  let el = e.target.closest(`.element`)

  if (!el) {
    e.preventDefault()
    return false
  }

  if (el === App.drag_element) {
    e.preventDefault()
    return false
  }

  let direction = e.clientY > App.drag_y ? `down` : `up`
  App.drag_y = e.clientY

  if (App.drag_els.includes(el)) {
    e.preventDefault()
    return false
  }

  if (direction === `down`) {
    el.after(...App.drag_els)
  }
  else {
    el.before(...App.drag_els)
  }

  App.drag_moved = true
  e.preventDefault()
  return false
}

App.dragend_action = (mode, e) => {
  App.dragging = false

  if (!App.drag_active(mode, e)) {
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

  App.update_tabs_index(App.drag_items, App.drag_start_index)
}