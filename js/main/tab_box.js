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

  App.tab_box_ungrow_debouncer = App.create_debouncer(() => {
    App.do_tab_box_ungrow()
  }, App.tab_box_ungrow_delay)

  App.tab_box_shrink_debouncer = App.create_debouncer(() => {
    App.do_tab_box_shrink()
  }, App.tab_box_shrink_delay)
}

App.create_tab_box = () => {
  let tab_box = DOM.create(`div`, `box`, `tab_box`)
  let title = DOM.create(`div`, `box_title glowbox`, `tab_box_title`)

  if (App.get_setting(`show_tooltips`)) {
    title.title = `This is the Tab Box`
  }

  let title_main = DOM.create(`div`, `box_title_main`, `tab_box_title_main`)
  title.append(title_main)
  let title_count = DOM.create(`div`, `box_title_count`, `tab_box_title_count`)
  title.append(title_count)

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
    App.tab_box_ungrow()
  })

  App.setup_container_mouse(`tabs`, tab_box)
  App.tab_box_ready = false
  App.tab_box_size = undefined
  return tab_box
}

App.check_tab_box = () => {
  if (!App.tab_box_ready) {
    App.set_tab_box_title()
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
  App.tab_box_shrink_debouncer.call()
}

App.tab_box_show = (mode, o_items) => {
  if (!App.tab_box_mode(mode)) {
    return
  }

  let items = App.get_tab_box_items(o_items, mode)
  App.fill_tab_box(items)
  App.update_tab_box_count(items.length)
}

App.update_tab_box_recent = () => {
  let o_items = App.get_recent_tabs({
    max: App.get_setting(`tab_box_max`),
    headers: App.get_setting(`tab_box_headers`),
  })

  App.tab_box_show(`recent`, o_items)
}

App.update_tab_box_pins = () => {
  let o_items = App.get_pinned_tabs()
  App.tab_box_show(`pins`, o_items)
}

App.update_tab_box_playing = () => {
  let o_items = App.get_playing_tabs()
  App.tab_box_show(`playing`, o_items)
}

App.update_tab_box_colors = () => {
  let o_items = App.get_colored_items(`tabs`)
  App.tab_box_show(`colors`, o_items)
}

App.update_tab_box_tags = () => {
  let o_items = App.get_tagged_items(`tabs`)
  App.tab_box_show(`tags`, o_items)
}

App.update_tab_box_icons = () => {
  let o_items = App.get_iconed_items(`tabs`)
  App.tab_box_show(`icons`, o_items)
}

App.update_tab_box_headers = () => {
  let o_items = App.get_headers()
  App.tab_box_show(`headers`, o_items)
}

App.update_tab_box_nodes = () => {
  let o_items = App.get_current_tab_nodes()
  App.tab_box_show(`nodes`, o_items)
}

App.get_tab_box_items = (o_items, mode) => {
  let items = []

  for (let o_item of o_items.slice(0, App.get_setting(`tab_box_max`))) {
    if (!o_item || !o_item.element) {
      continue
    }

    if (o_item.header) {
      if (mode !== `headers`) {
        if (!App.get_setting(`tab_box_headers`)) {
          continue
        }
      }
    }

    let {element, ...item} = o_item
    item.tab_box = true
    item.test = 123
    App.create_item_element(item)
    items.push(item)
  }

  return items
}

App.set_tab_box_title = () => {
  let mode = App.get_setting(`tab_box_mode`)
  let title_main = DOM.el(`#tab_box_title_main`)
  title_main.innerHTML = ``
  let icon = App.tab_box_icon(mode)
  let text = App.capitalize(mode)
  title_main.append(App.button_text(icon, text, true))
}

App.scroll_tab_box_top = () => {
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
  else if (mode === `playing`) {
    return App.get_setting(`playing_icon`) || App.audio_icon
  }
  else if (mode === `colors`) {
    return App.settings_icons.theme
  }
  else if (mode === `tags`) {
    return App.tag_icon
  }
  else if (mode === `icons`) {
    return App.bot_icon
  }
  else if (mode === `headers`) {
    return App.get_setting(`header_icon`) || App.zone_icon
  }
  else if (mode === `nodes`) {
    return App.get_setting(`nodes_icon`) || App.nodes_icon
  }

  return App.mode_icons.tabs
}

App.fill_tab_box = (items) => {
  let c = DOM.el(`#tab_box_container`)
  c.innerHTML = ``

  for (let item of items) {
    c.append(item.element)
  }

  App.tab_box_items = items
}

App.change_tab_box_mode = (what) => {
  App.set_tab_box_mode(what)
  App.set_tab_box_title()
  App.update_tab_box(what)
  App.scroll_tab_box_top()
}

App.tab_box_menu = (e) => {
  let items = []
  let c_mode = App.get_setting(`tab_box_mode`)

  for (let tbmode of App.tab_box_modes) {
    if (c_mode === tbmode) {
      continue
    }

    items.push({
      text: App.capitalize(tbmode),
      icon: App.tab_box_icon(tbmode),
      action: () => {
        App.change_tab_box_mode(tbmode)
      },
    })
  }

  App.sep(items)
  let sizes = []
  let c_size = App.get_setting(`tab_box_size`)

  for (let size of App.sizes_2) {
    if (size.value === `none`) {
      continue
    }

    if (c_size === size.value) {
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
    icon: App.settings_icons.tab_box,
    text: `Size`,
    items: sizes,
  })

  let positions = []
  let c_position = App.get_setting(`tab_box_position`)

  if (c_position !== `top`) {
    positions.push({
      text: `Top`,
      action: (e) => {
        App.set_tab_box_position(`top`)
        App.clear_show()
      },
    })
  }

  if (c_position !== `bottom`) {
    positions.push({
      text: `Bottom`,
      action: (e) => {
        App.set_tab_box_position(`bottom`)
        App.clear_show()
      },
    })
  }

  items.push({
    icon: App.settings_icons.tab_box,
    text: `Position`,
    items: positions,
  })

  items.push({
    icon: App.settings_icons.tab_box,
    text: `Settings`,
    action: () => {
      App.show_settings_category(`tab_box`)
    },
  })

  App.show_context({items, e})
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
  }
}

App.tab_box_grow = () => {
  App.tab_box_grow_debouncer.call()
}

App.do_tab_box_grow = () => {
  App.tab_box_grow_debouncer.cancel()
  let auto = App.get_setting(`tab_box_auto_grow`)

  if (auto === `none`) {
    return
  }

  App.tab_box_size = auto
  App.tab_box_check_size()
}

App.tab_box_ungrow = () => {
  App.tab_box_ungrow_debouncer.call()
}

App.do_tab_box_ungrow = () => {
  App.tab_box_ungrow_debouncer.cancel()

  if (App.get_setting(`tab_box_auto_shrink`) !== `none`) {
    App.do_tab_box_shrink()
  }
  else if (App.tab_box_size) {
    App.tab_box_size = undefined
    App.tab_box_check_size()
  }
}

App.tab_box_clear_grow = () => {
  App.tab_box_grow_debouncer.cancel()
  App.tab_box_ungrow_debouncer.cancel()
}

App.check_tab_box_footer = () => {
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
  App.set_setting({setting: `show_tab_box`, value: what})
  App.check_refresh_settings()
  App.check_tab_box_footer()
}

App.set_tab_box_size = (what) => {
  App.set_setting({setting: `tab_box_size`, value: what})
  App.check_refresh_settings()
  App.tab_box_check_size()
}

App.set_tab_box_mode = (what) => {
  App.set_setting({setting: `tab_box_mode`, value: what})
  App.check_refresh_settings()
}

App.set_tab_box_position = (what) => {
  App.set_setting({setting: `tab_box_position`, value: what})
  App.check_refresh_settings()
}

App.tab_box_check_size = () => {
  let tab_box = DOM.el(`#tab_box`)

  for (let size of App.sizes_2) {
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
  else {
    App.hide_tab_box()
  }
}

App.show_tab_box = (refresh = true, set = false) => {
  App.main_add(`show_tab_box`)

  if (refresh) {
    App.refresh_tab_box()
  }

  if (set) {
    App.set_show_tab_box(true)
  }
}

App.hide_tab_box = (set = false) => {
  App.main_remove(`show_tab_box`)

  if (set) {
    App.set_show_tab_box(false)
  }
}

App.toggle_tab_box = () => {
  if (App.get_setting(`show_tab_box`)) {
    App.hide_tab_box(true)
  }
  else {
    let visible = App.selected_visible(`tabs`)
    App.show_tab_box(true, true)

    if (visible) {
      App.scroll_to_selected(`tabs`)
    }
  }
}

App.check_tab_box_scroll = () => {
  if (!App.tab_box_enabled()) {
    return
  }

  if (!App.get_setting(`tab_box_scroll`)) {
    return
  }

  let mode = App.get_setting(`tab_box_mode`)

  if (mode === `recent`) {
    App.scroll_tab_box_top()
  }
}

App.update_tab_box_count = (count) => {
  if (App.get_setting(`tab_box_count`)) {
    let el = DOM.el(`#tab_box_title_count`)
    el.textContent = `(${count})`
  }
}

App.do_tab_box_shrink = () => {
  App.tab_box_shrink_debouncer.cancel()
  let auto = App.get_setting(`tab_box_auto_shrink`)

  if (auto === `none`) {
    return
  }

  if (App.tab_box_items.length) {
    App.tab_box_size = App.get_setting(`tab_box_size`)
  }
  else {
    App.tab_box_size = App.get_setting(`tab_box_auto_shrink`)
  }

  App.tab_box_check_size()
}