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

  DOM.ev(container, `dragover`, (e) => {
    e.preventDefault()
    App.handle_drag_scroll(container, e.clientY)
  })

  DOM.ev(container, `dragenter`, (e) => {
    if (App.edge_scrolling) {
      return
    }

    if (App.drag_mode === `pinline`) {
      App.dragenter_pinline(mode, e)
      return
    }

    App.dragenter_action(mode, e)
  })

  DOM.ev(container, `dragend`, (e) => {
    App.stop_drag_scroll()

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

App.handle_drag_scroll = (container, client_y) => {
  let rect = container.getBoundingClientRect()
  let at_top = client_y - rect.top < App.edge_scroll_threshold
  let at_bottom = rect.bottom - client_y < App.edge_scroll_threshold
  let can_scroll_up = container.scrollTop > 0
  let can_scroll_down = container.scrollTop + container.clientHeight < container.scrollHeight - 1

  if (at_top && can_scroll_up) {
    App.init_scroll_timer(container, -App.edge_scroll_speed, App.edge_scroll_delay)
  }
  else if (at_bottom && can_scroll_down) {
    App.init_scroll_timer(container, App.edge_scroll_speed, App.edge_scroll_delay)
  }
  else {
    App.stop_drag_scroll()
  }
}

App.init_scroll_timer = (container, amount, delay) => {
  if (!App.get_setting(`edge_scroll`)) {
    return
  }

  if (App.scroll_active_direction === amount) {
    return
  }

  App.stop_drag_scroll()
  App.scroll_active_direction = amount

  App.scroll_timeout = setTimeout(() => {
    App.edge_scrolling = true

    App.scroll_interval = setInterval(() => {
      let can_scroll_up = container.scrollTop > 0
      let can_scroll_down = container.scrollTop + container.clientHeight < container.scrollHeight - 1

      if ((amount < 0) && !can_scroll_up) {
        App.stop_drag_scroll()
        return
      }

      if ((amount > 0) && !can_scroll_down) {
        App.stop_drag_scroll()
        return
      }

      container.scrollTop += amount
    }, App.edge_scroll_amount)
  }, delay)
}

App.stop_drag_scroll = () => {
  clearTimeout(App.scroll_timeout)
  clearInterval(App.scroll_interval)
  App.scroll_active_direction = null
  App.edge_scrolling = false
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

  if ((mode === `tabs`) && App.get_setting(`tree_order`)) {
    let with_nodes = []

    for (let item of App.drag_items) {
      with_nodes.push(item)

      if (item.group && (item.group !== -1)) {
        continue
      }

      let nodes = App.get_tab_nodes(item)

      for (let node of nodes) {
        if (node.group && (node.group !== -1)) {
          continue
        }

        if (!with_nodes.includes(node) && !App.drag_items.includes(node)) {
          with_nodes.push(node)
        }
      }
    }

    App.drag_items = with_nodes
  }

  App.drag_start_index = App.get_item_element_index({
    mode,
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

  if (App.drag_els.includes(el)) {
    e.preventDefault()
    return false
  }

  if (e.clientY === App.drag_y) {
    e.preventDefault()
    return false
  }

  let direction = e.clientY > App.drag_y ? `down` : `up`
  App.drag_y = e.clientY

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