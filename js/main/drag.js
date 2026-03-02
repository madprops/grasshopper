App.setup_drag = () => {
  let main = App.main()

  main.ondragover = (e) => {
    e.preventDefault()
  }

  main.ondrop = (e) => {
    e.preventDefault()
    let id_1 = e.dataTransfer.getData(`text/plain`)
    let menubutton = DOM.parent(e.target, [`.menubutton`])

    if (menubutton) {
      App.on_menubutton_drag(id_1, menubutton.id)
      return
    }

    let addlist = DOM.parent(e.target, [`.addlist_control`])

    if (addlist) {
      App.on_addlist_drag(id_1, addlist.id)
      return
    }
  }
}

App.setup_item_drag = (mode) => {
  let container = DOM.el(`#${mode}_container`)

  DOM.ev(container, `dragstart`, (e) => {
    if (App.icon_pick_down) {
      e.preventDefault()
      return false
    }

    if (DOM.parent(e.target, [`#pinline`])) {
      App.dragstart_pinline(mode, e)
      return
    }

    App.dragstart_action(mode, e)
  })

  DOM.ev(container, `dragenter`, (e) => {
    if (App.drag_mode === `pinline`) {
      App.dragenter_pinline(mode, e)
      return
    }

    App.dragenter_action(mode, e)
  })

  DOM.ev(container, `dragend`, (e) => {
    if (App.icon_pick_down) {
      App.icon_pick_down = false
      return
    }

    if (App.drag_mode === `pinline`) {
      App.dragend_pinline(mode, e)
      return
    }

    App.dragend_action(mode, e)
  })
}

App.drag_active = (mode, e) => {
  if (App.get_setting(`lock_drag`) && !e.ctrlKey) {
    return false
  }

  if ((mode !== `tabs`) || !App.tabs_normal()) {
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

  App.drag_element = DOM.parent(e.target, [`.grasshopper_item`])

  if (!App.drag_element) {
    e.preventDefault()
    return false
  }

  App.dragging = true
  App.drag_mode = `item`
  App.drag_y = e.clientY
  let id = App.drag_element.dataset.id
  App.drag_item = App.get_item_by_id(mode, id)

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

        if (item.url) {
          urls.push(item.url)

          if (item.title) {
            moz_urls.push(`${item.url}\n${item.title}`)
          }
        }
      }
    }
  }
  else {
    App.drag_items.push(App.drag_item)
  }

  App.drag_start_index = App.get_item_element_index({
    mode: mode,
    element: App.drag_items[0].element,
    include_all: true,
  })

  App.drag_els = []

  for (let item of App.drag_items) {
    App.drag_els.push(item.element)
  }

  e.dataTransfer.setDragImage(new Image(), 0, 0)

  if (moz_urls.length) {
    e.dataTransfer.setData(`text/x-moz-url`, moz_urls.join(`\r\n`))
  }

  if (urls.length) {
    let uri_list = urls.join(`\r\n`)
    e.dataTransfer.setData(`text/uri-list`, uri_list)
    e.dataTransfer.setData(`text/plain`, uri_list)
  }

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

  let el = DOM.parent(e.target, [`.element`])

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

  if (direction === `up`) {
    el.before(...App.drag_els)
  }
  else if (direction === `down`) {
    el.after(...App.drag_els)
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

  let drag_end_index = App.get_item_element_index({
    mode,
    element: App.drag_items[0].element,
    include_all: true,
  })

  if (App.drag_start_index === drag_end_index) {
    e.preventDefault()
    return false
  }

  let direction = drag_end_index < App.drag_start_index ? `up` : `down`
  App.update_tabs_index(App.drag_items, direction)
}

App.on_menubutton_drag = (id_1, id_2) => {
  if (id_1.startsWith(`settings_`) && id_2.startsWith(`settings_`)) {
    let pre = `settings_`
    let sett_1 = id_1.replace(pre, ``)
    let sett_2 = id_2.replace(pre, ``)
    App.swap_settings(sett_1, sett_2)
  }
  else if (id_1.startsWith(`addlist_`) && id_2.startsWith(`addlist_`)) {
    let pre = `addlist_widget_settings_`
    let sett_1 = id_1.replace(pre, ``)
    let sett_2 = id_2.replace(pre, ``)
    Addlist.swap_menus(sett_1, sett_2)
  }
}

App.on_addlist_drag = (id_1, id_2) => {
  if (!id_1.startsWith(`settings_`) || !id_2.startsWith(`settings_`)) {
    return
  }

  let pre = `settings_`
  let sett_1 = id_1.replace(pre, ``)
  let sett_2 = id_2.replace(pre, ``)

  let props_1 = App.setting_props[sett_1]
  let props_2 = App.setting_props[sett_2]

  if (!props_1.data_group || !props_2.data_group) {
    return
  }

  if (props_1.data_group !== props_2.data_group) {
    return
  }

  App.show_confirm({
    message: `Copy data?`,
    confirm_action: () => {
      App.copy_settings_data(sett_1, sett_2)
    },
  })
}

App.dragstart_pinline = (mode, e) => {
  App.reset_triggers()

  if (e.shiftKey) {
    e.preventDefault()
    return false
  }

  App.dragging = true
  App.drag_mode = `pinline`
  App.drag_y = e.clientY
}

App.dragenter_pinline = (mode, e) => {
  if (!App.drag_active(mode, e)) {
    return
  }

  let item = DOM.parent(e.target, [`.tabs_item`])

  if (!item) {
    return
  }

  let direction = e.clientY > App.drag_y ? `down` : `up`

  if (direction === `up`) {
    item.before(DOM.el(`#pinline`))
  }
  else if (direction === `down`) {
    item.after(DOM.el(`#pinline`))
  }
}

App.dragend_pinline = (mode, e) => {
  App.dragging = false

  if (!App.drag_active(mode, e)) {
    return
  }

  App.check_pinline_change()
}