App.setup_tab_box = () => {
  App.update_tab_box_debouncer = App.create_debouncer((what) => {
    App.do_update_tab_box(what)
  }, App.update_tab_box_delay)

  App.check_tab_box_playing_debouncer = App.create_debouncer(() => {
    App.do_check_tab_box_playing()
  }, App.check_tab_box_playing_delay)

  App.tab_box_grow_debouncer = App.create_debouncer(() => {
    App.do_tab_box_grow()
  }, App.tab_box_grow_delay)

  App.tab_box_shrink_debouncer = App.create_debouncer(() => {
    App.do_tab_box_shrink()
  }, App.tab_box_shrink_delay)
}

App.create_tab_box = () => {
  let tab_box = DOM.create(`div`, `box hidden`, `tab_box`)
  let title = DOM.create(`div`, `box_title glowbox`, `tab_box_title`)
  title.title = `This is the Tab Box`

  DOM.evs(title, [`click`, `contextmenu`], (e) => {
    e.preventDefault()
    e.stopPropagation()
    App.tab_box_menu(e)
  })

  DOM.ev(title, `wheel`, (e) => {
    let dir = App.wheel_direction(e)

    if (dir === `up`) {
      App.cycle_tab_box_mode(`prev`)
    }
    else if (dir === `down`) {
      App.cycle_tab_box_mode(`next`)
    }
  })

  let pos = App.get_setting(`tab_box_position`)

  if (pos === `top`) {
    tab_box.classList.add(`box_top`)
  }

  tab_box.append(title)
  let container = DOM.create(`div`, `box_container`, `tab_box_container`)
  tab_box.append(container)

  DOM.ev(container, `mouseenter`, () => {
    App.tab_box_clear_grow()
    App.tab_box_grow()
  })

  DOM.ev(tab_box, `mouseleave`, () => {
    App.tab_box_clear_grow()
    App.tab_box_shrink()
  })

  App.setup_container_mouse(`tabs`, tab_box)
  App.tab_box_ready = false
  return tab_box
}

App.check_tab_box = () => {
  if (!App.tab_box_ready) {
    App.set_tab_box_items()
    App.tab_box_ready = true
  }
}

App.update_tab_box = (what) => {
  App.update_tab_box_debouncer.call(what)
}

App.do_update_tab_box = (what) => {
  App.update_tab_box_debouncer.cancel()

  if (!App.tab_box_enabled()) {
    return
  }

  App.check_tab_box()
  App[`update_tab_box_${what}`]()
}

App.update_tab_box_recent = () => {
  if (!App.tab_box_mode(`recent`)) {
    return
  }

  let o_items = App.get_recent_tabs({max: App.tab_box_max})
  let items = App.get_tab_box_items(o_items, `recent`)
  App.fill_tab_box(items)
}

App.update_tab_box_headers = () => {
  if (!App.tab_box_mode(`headers`)) {
    return
  }

  let o_items = App.get_headers()
  let items = App.get_tab_box_items(o_items, `headers`)
  App.fill_tab_box(items, false)
}

App.update_tab_box_pins = () => {
  if (!App.tab_box_mode(`pins`)) {
    return
  }

  let o_items = App.get_pinned_tabs()
  let items = App.get_tab_box_items(o_items, `pins`)
  App.fill_tab_box(items, false)
}

App.update_tab_box_colors = () => {
  if (!App.tab_box_mode(`colors`)) {
    return
  }

  let o_items = App.get_colored_items(`tabs`)
  let items = App.get_tab_box_items(o_items, `colors`)
  App.fill_tab_box(items, false)
}

App.update_tab_box_playing = () => {
  if (!App.tab_box_mode(`playing`)) {
    return
  }

  let o_items = App.get_playing_tabs()
  let items = App.get_tab_box_items(o_items, `playing`)
  App.fill_tab_box(items, false)
}

App.get_tab_box_items = (o_items, mode) => {
  let items = []

  for (let o_item of o_items.slice(0, App.tab_box_max)) {
    if (!o_item || !o_item.element) {
      continue
    }

    if (mode !== `headers`) {
      if (o_item.header) {
        continue
      }
    }

    let {element, ...item} = o_item
    item.tab_box = true
    App.create_item_element(item)
    items.push(item)
  }

  return items
}

App.set_tab_box_items = () => {
  let mode = App.get_setting(`tab_box_mode`)
  let title = DOM.el(`#tab_box_title`)
  title.innerHTML = ``
  let icon = App.tab_box_icon(mode)
  let text = App.capitalize(mode)
  title.append(App.button_text(icon, text, true))
  let c = DOM.el(`#tab_box_container`)
  App.scroll_to_top(c)
}

App.tab_box_icon = (mode) => {
  if (mode === `recent`) {
    return App.mode_icons.tabs
  }
  else if (mode === `pins`) {
    return App.get_setting(`pin_icon`) || App.pin_icon
  }
  else if (mode === `colors`) {
    return App.settings_icons.theme
  }
  else if (mode === `playing`) {
    return App.get_setting(`playing_icon`) || App.audio_icon
  }
  else if (mode === `headers`) {
    return App.zone_icon
  }
  else {
    return App.mode_icons.tabs
  }
}

App.fill_tab_box = (items, scroll = true) => {
  let c = DOM.el(`#tab_box_container`)
  c.innerHTML = ``

  for (let item of items) {
    c.append(item.element)
  }

  if (scroll) {
    App.scroll_to_top(c)
  }
}

App.change_tab_box_mode = (what) => {
  App.set_tab_box_mode(what)
  App.set_tab_box_items()
  App.update_tab_box(what)
}

App.tab_box_menu = (e) => {
  let items = []
  let mode = App.get_setting(`tab_box_mode`)

  if (mode !== `recent`) {
    items.push({
      text: `Recent`,
      icon: App.tab_box_icon(`recent`),
      action: () => {
        App.change_tab_box_mode(`recent`)
      }
    })
  }

  if (mode !== `pins`) {
    items.push({
      text: `Pins`,
      icon: App.tab_box_icon(`pins`),
      action: () => {
        App.change_tab_box_mode(`pins`)
      }
    })
  }

  if (mode !== `colors`) {
    items.push({
      text: `Colors`,
      icon: App.tab_box_icon(`colors`),
      action: () => {
        App.change_tab_box_mode(`colors`)
      }
    })
  }

  if (mode !== `playing`) {
    items.push({
      text: `Playing`,
      icon: App.tab_box_icon(`playing`),
      action: () => {
        App.change_tab_box_mode(`playing`)
      }
    })
  }

  if (mode !== `headers`) {
    items.push({
      text: `Headers`,
      icon: App.tab_box_icon(`headers`),
      action: () => {
        App.change_tab_box_mode(`headers`)
      }
    })
  }

  App.sep(items)
  let sizes = []

  for (let [i, size] of App.sizes.entries()) {
    if (App.get_setting(`tab_box_size`) === size.value) {
      continue
    }

    sizes.push({
      text: size.text,
      action: (e) => {
        App.set_tab_box_size(size.value)
      },
    })
  }

  items.push({
    text: `Size`,
    items: sizes,
  })

  let positions = []
  let position = App.get_setting(`tab_box_position`)

  if (position !== `top`) {
    positions.push({
      text: `Top`,
      action: (e) => {
        App.set_tab_box_position(`top`)
        App.clear_show()
      },
    })
  }

  if (position !== `bottom`) {
    positions.push({
      text: `Bottom`,
      action: (e) => {
        App.set_tab_box_position(`bottom`)
        App.clear_show()
      },
    })
  }

  items.push({
    text: `Position`,
    items: positions,
  })

  App.sep(items)

  items.push({
    text: `Hide`,
    action: (e) => {
      App.hide_tab_box()
    },
  })

  App.show_context({items: items, e: e})
}

App.refresh_tab_box = () => {
  App.update_tab_box(App.get_setting(`tab_box_mode`))
}

App.check_tab_box_item = (item, what) => {
  if (item.mode !== `tabs`) {
    return
  }

  if (App.tab_box_mode(what)) {
    App.update_tab_box(what)
  }
}

App.tab_box_mode = (what) => {
  if (App.get_setting(`show_tab_box`)) {
    if (App.get_setting(`tab_box_mode`) === what) {
      return true
    }
  }

  return false
}

App.tab_box_enabled = () => {
  return App.get_setting(`show_tab_box`)
}

App.cycle_tab_box_mode = (dir) => {
  let waypoint = false
  let current = App.get_setting(`tab_box_mode`)
  let modes = App.tab_box_modes.slice(0)

  if (dir === `prev`) {
    modes.reverse()
  }

  for (let mode of modes) {
    if (waypoint) {
      App.change_tab_box_mode(mode)
      return
    }

    if (mode === current) {
      waypoint = true
      continue
    }
  }

  App.change_tab_box_mode(modes[0])
}

App.check_tab_box_playing = () => {
  App.check_tab_box_playing_debouncer.call()
}

App.do_check_tab_box_playing = () => {
  App.check_tab_box_playing_debouncer.cancel()

  if (!App.get_setting(`tab_box_auto_playing`)) {
    return
  }

  let playing = App.get_playing_tabs()

  if (playing.length > 0) {
    if (!App.get_setting(`show_tab_box`)) {
      App.show_tab_box(false)
    }

    if (App.get_setting(`tab_box_mode`) !== `playing`) {
      App.change_tab_box_mode(`playing`)
    }

    App.update_tab_box(`playing`)
  }
}

App.show_tab_box = (refresh = true) => {
  DOM.el(`#tab_box`).classList.remove(`hidden`)
  App.set_show_tab_box(true)

  if (refresh) {
    App.refresh_tab_box()
  }
}

App.hide_tab_box = () => {
  DOM.el(`#tab_box`).classList.add(`hidden`)
  App.set_show_tab_box(false)
}

App.toggle_tab_box = () => {
  if (App.get_setting(`show_tab_box`)) {
    App.hide_tab_box()
  }
  else {
    let visible = App.selected_visible(`tabs`)
    App.show_tab_box()

    if (visible) {
      App.scroll_to_selected(`tabs`)
    }
  }
}

App.check_tab_box_grow = () => {
  let auto = App.get_setting(`tab_box_auto_grow`)

  if (auto === `none`) {
    return false
  }

  let current = App.get_setting(`tab_box_size`)
  let index_1 = App.sizes.findIndex(x => x.value === auto)
  let index_2 = App.sizes.findIndex(x => x.value === current)

  if (index_1 <= index_2) {
    return false
  }

  return true
}

App.tab_box_grow = () => {
  App.tab_box_grow_debouncer.call()
}

App.do_tab_box_grow = () => {
  App.tab_box_grow_debouncer.cancel()

  if (!App.check_tab_box_grow()) {
    return
  }

  App.tab_box_size = App.get_setting(`tab_box_auto_grow`)
  App.tab_box_check_size()
}

App.tab_box_shrink = () => {
  App.tab_box_shrink_debouncer.call()
}

App.do_tab_box_shrink = () => {
  App.tab_box_shrink_debouncer.cancel()

  if (App.tab_box_size) {
    App.tab_box_size = undefined
    App.tab_box_check_size()
  }
}

App.tab_box_clear_grow = () => {
  App.tab_box_grow_debouncer.cancel()
  App.tab_box_shrink_debouncer.cancel()
}

App.check_tab_box_footer = () => {
  if (!App.get_setting(`show_footer`)) {
    return
  }

  let btn = DOM.el(`#footer_tab_box`)

  if (!btn) {
    return
  }

  btn.innerHTML = ``
  let icon

  if (App.get_setting(`show_tab_box`)) {
    icon = `arrow_up`
  }
  else {
    icon = `arrow_up_empty`
  }

  btn.append(App.get_svg_icon(icon))
}

App.set_show_tab_box = (what) => {
  App.set_setting(`show_tab_box`, what)
  App.check_tab_box_footer()
}

App.set_tab_box_size = (what) => {
  App.set_setting(`tab_box_size`, what)
  App.tab_box_check_size()
}

App.set_tab_box_mode = (what) => {
  App.set_setting(`tab_box_mode`, what)
}

App.set_tab_box_position = (what) => {
  App.set_setting(`tab_box_position`, what)
}

App.tab_box_check_size = () => {
  let tab_box = DOM.el(`#tab_box`)

  for (let size of App.sizes) {
    tab_box.classList.remove(`size_${size.value}`)
  }

  let size = App.tab_box_size || App.get_setting(`tab_box_size`)
  tab_box.classList.add(`size_${size}`)
}

App.init_tab_box = () => {
  App.tab_box_check_size()
  App.check_tab_box_footer()

  if (App.get_setting(`show_tab_box`)) {
    App.show_tab_box()
  }
}