App.insert_header = async (args = {}) => {
  let def_args = {
    full: true,
    title: ``,
    random_title: false,
    position: `normal`,
  }

  App.def_args(def_args, args)

  if (App.zones_locked(args.item.mode)) {
    return
  }

  let active = App.get_active_items({mode: args.item.mode, item: args.item})
  let edges = App.get_item_edges(args.item.mode)
  let index, pinned

  if (args.position === `normal`) {
    let first = active.at(0)
    index = App.get_item_element_index({mode: first.mode, element: first.element})
    pinned = args.item.pinned
  }
  else if (args.position === `top`) {
    index = 0
    pinned = edges.first.pinned
  }
  else if (args.position === `bottom`) {
    index = App.get_last_element_index(args.item.mode)
    pinned = edges.last.pinned
  }

  let tab = await App.open_new_tab({url: App.header_url, index, pinned, active: false})
  await App.wait_for_tab_load(tab.id)
  let header = App.get_item_by_id(args.item.mode, tab.id)

  if (active.length > 1) {
    for (let it of active.slice(1, -1)) {
      App.apply_edit({what: `split_top`, item: it, value: false, on_change: (value) => {
        App.custom_save(it.id, `split_top`, value)
      }})

      App.apply_edit({what: `split_bottom`, item: it, value: false, on_change: (value) => {
        App.custom_save(it.id, `split_bottom`, value)
      }})
    }

    let bottom = active.at(-1)

    App.apply_edit({what: `split_bottom`, item: bottom, value: true, on_change: (value) => {
      App.custom_save(bottom.id, `split_bottom`, value)
    }})
  }

  if (header) {
    if (args.full) {
      App.edit_tab_split({item: header, which: `top`})
    }

    if (!args.title && (App.get_setting(`random_zone_titles`) || args.random_title)) {
      args.title = App.random_word()
    }

    if (args.title) {
      App.edit_title_directly(header, args.title)
    }
    else {
      App.edit_title(header, false)
    }

    App.update_tab_box()
  }
}

App.header_group = (item) => {
  let waypoint = false
  let select = false
  let selected = []
  let items = App.get_items(item.mode)

  for (let [i, it] of items.entries()) {
    if (waypoint) {
      if (it.header) {
        select = true
        break
      }
      else if (item.pinned && !it.pinned) {
        select = true
        break
      }
      else if (App.get_split_top(it)) {
        select = true
        break
      }
      else if (App.get_split_bottom(it)) {
        selected.push(it)
        select = true
        break
      }
      else {
        selected.push(it)
      }

      if (i === (items.length - 1)) {
        select = true
      }
    }

    if (it === item) {
      selected.push(it)
      waypoint = true
      continue
    }
  }

  if (select) {
    return selected
  }

  return []
}

App.select_header_group = (item) => {
  let group = App.header_group(item)

  if (group.length) {
    if (group.at(0).selected && group.at(-1).selected) {
      App.deselect({mode: item.mode, select: `selected`})
    }
    else {
      App.deselect({mode: item.mode, select: `none`})
      let first

      for (let item of group) {
        if (!first) {
          if (!item.header) {
            first = item
            continue
          }
        }

        App.toggle_selected({item, what: true})
      }

      if (first) {
        App.toggle_selected({item: first, what: true})
      }
    }
  }
}

App.get_header_tabs = () => {
  let headers = App.get_items(`tabs`).filter(x => x.header)
  return headers.filter(x => App.is_header(x))
}

App.get_subheader_tabs = () => {
  let headers = App.get_items(`tabs`).filter(x => x.header)
  return headers.filter(x => !App.is_header(x))
}

App.get_zones = () => {
  return App.get_items(`tabs`).filter(x => App.is_zone(x))
}

App.close_headers = (force = false) => {
  let items = App.get_header_tabs()

  if (!items.length) {
    return
  }

  App.close_tabs_method(items, force)
}

App.close_subheaders = (force = false) => {
  let items = App.get_subheader_tabs()

  if (!items.length) {
    return
  }

  App.close_tabs_method(items, force)
}

App.is_header_url = (url) => {
  if (!url.startsWith(App.browser_protocol)) {
    return false
  }

  if (!url.includes(App.header_file)) {
    return false
  }

  return true
}

App.check_header = (item) => {
  if (item.mode !== `tabs`) {
    return
  }

  function no_header() {
    item.header = false
    item.element.classList.remove(`header_item`)
  }

  if (App.is_header_url(item.url)) {
    // The header url is now obsolete, so update it
    if (!item.url.includes(App.header_url)) {
      no_header()

      if (item.header_refresh) {
        return
      }

      item.header_refresh = true
      App.update_tab(item.id, {url: App.header_url})
      return
    }

    item.header = true
    item.unread = false
    item.element.classList.add(`header_item`)
  }
  else {
    no_header()
  }
}

App.check_header_first = (item) => {
  if (!item) {
    return false
  }

  if (item.header) {
    return false
  }

  if (App.get_split_top(item)) {
    return false
  }

  return true
}

App.focus_header_first = (item, from, scroll = `nearest_smooth`) => {
  let next = App.get_other_item({mode: item.mode, item, wrap: false})

  if (next.active) {
    return
  }

  if (App.check_header_first(next)) {
    App.tabs_action({item: next, from, scroll})
  }
}

App.is_header = (item) => {
  return item.header && App.get_split_top(item)
}

App.is_subheader = (item) => {
  return item.header && !App.get_split_top(item)
}

App.is_zone = (item) => {
  return App.is_header(item) || App.is_subheader(item) || App.is_header_url(item.url)
}

App.is_split = (item) => {
  return App.get_split_top(item) || App.get_split_bottom(item)
}

App.edit_tab_split = (args = {}) => {
  let def_args = {
    which: `top`,
    prompt_title: true,
  }

  App.def_args(def_args, args)
  let active = App.get_active_items({mode: args.item.mode, item: args.item})

  if (!active.length) {
    return
  }

  let force = App.check_warn(`warn_on_edit_tabs`, active)

  if ((args.which === `top`) || (args.which === `bottom`)) {
    let other = args.which === `top` ? `bottom` : `top`

    App.show_confirm({
      message: `Add splits (${active.length})`,
      confirm_action: () => {
        for (let it of active) {
          App.apply_edit({what: `split_${args.which}`, item: it, value: true, on_change: (value) => {
            App.custom_save(it.id, `split_${args.which}`, value)
          }})

          App.apply_edit({what: `split_${other}`, item: it, value: false, on_change: (value) => {
            App.custom_save(it.id, `split_${other}`, value)
          }})
        }
      },
      force,
    })
  }
  else if (args.which === `both`) {
    if (active.length < 2) {
      App.alert(`Multiple tabs are required to do this`)
      return
    }

    for (let it of active.slice(1, -1)) {
      App.apply_edit({what: `split_top`, item: it, value: false, on_change: (value) => {
        App.custom_save(it.id, `split_top`, value)
      }})

      App.apply_edit({what: `split_bottom`, item: it, value: false, on_change: (value) => {
        App.custom_save(it.id, `split_bottom`, value)
      }})
    }

    let top = active.at(0)
    let bottom = active.at(-1)

    App.apply_edit({what: `split_top`, item: top, value: true, on_change: (value) => {
      App.custom_save(top.id, `split_top`, value)
    }})

    App.apply_edit({what: `split_bottom`, item: bottom, value: true, on_change: (value) => {
      App.custom_save(bottom.id, `split_bottom`, value)
    }})
  }
}

App.remove_item_split = (item) => {
  let active = App.get_active_items({mode: item.mode, item})

  if (active.length === 1) {
    if (item.rule_split_top || item.rule_split_bottom) {
      App.domain_rule_message()
    }
  }

  App.remove_edits({what: [`split_top`, `split_bottom`], items: active, text: `splits`})
}

App.remove_top_splits = (force = false) => {
  App.remove_edits({what: [`split_top`], force, text: `splits`})
}

App.remove_bottom_splits = (force = false) => {
  App.remove_edits({what: [`split_bottom`], force, text: `splits`})
}

App.remove_all_splits = (force = false) => {
  App.remove_edits({what: [`split_top`, `split_bottom`], force, text: `splits`})
}

App.apply_splits = (item) => {
  if (item.mode !== `tabs`) {
    return
  }

  let has_split = false

  for (let what of [`top`, `bottom`]) {
    if (App.get_split(item, what)) {
      item.element.classList.add(`split_${what}`)
      has_split = true
    }
    else {
      item.element.classList.remove(`split_${what}`)
    }
  }

  if (has_split) {
    item.element.classList.add(`split`)
  }
  else {
    item.element.classList.remove(`split`)
  }
}

App.remove_all_zones = () => {
  App.show_confirm({
    message: `Remove all zones?`,
    confirm_action: () => {
      App.close_headers(true)
      App.close_subheaders(true)
      App.remove_all_splits(true)
    },
  })
}

App.close_header_group = (item, header = true) => {
  App.select_header_group(item)

  if (!header) {
    App.toggle_selected({item, what: false})
  }

  App.close_tabs({
    cancel_action: () => {
      App.deselect({mode: `tabs`})
    },
  })
}

App.do_header_action = (item, action) => {
  let setting = App.get_setting(action)

  if (setting === `select_group`) {
    App.select_header_group(item)
    return true
  }
  else if (setting === `close_group`) {
    App.close_header_group(item)
    return true
  }

  return false
}

App.add_split_action = (item, which) => {
  if (App.zones_locked(item.mode)) {
    return
  }

  App.edit_tab_split({item, which})
}

App.add_split_top = (item) => {
  App.add_split_action(item, `top`)
}

App.add_split_bottom = (item) => {
  App.add_split_action(item, `bottom`)
}

App.zones_locked = (mode) => {
  let hide = App.get_setting(`hide_zones_on_recent`)
  return (mode === `tabs`) && hide && App.tabs_recent()
}

App.zones_unlocked = (mode) => {
  return !App.zones_locked(mode)
}

App.move_zone_prepare = (item) => {
  let items = App.get_active_items({item})
  let first_index = App.get_item_element_index({element: items[0].element})
  let tabs = App.get_items(`tabs`)
  return [items, tabs, first_index]
}

App.move_zone_check = (item, first_index, direction) => {
  let is_header = App.is_zone(item)

  if (!is_header) {
    return false
  }

  let header_index = App.get_item_element_index({element: item.element})

  if (direction === `up`) {
    if ((header_index + 1) >= first_index) {
      return false
    }
  }
  else if (direction === `down`) {
    if ((header_index + 1) <= first_index) {
      return false
    }
  }

  return true
}

App.move_zone_move = (items, target, direction, mode = `after`) => {
  let els = items.map(x => x.element)

  if (mode === `after`) {
    target.element.after(...els)
  }
  else if (mode === `before`) {
    target.element.before(...els)
  }

  App.update_tabs_index(items, direction)
}

App.move_to_zone_up = (item) => {
  let [items, tabs, first_index] = App.move_zone_prepare(item)
  let tabs_reversed = tabs.slice().reverse()

  if (!items.length) {
    return
  }

  if (first_index === 0) {
    return
  }

  let direction = `up`

  for (let it of tabs_reversed) {
    if (!App.move_zone_check(it, first_index, direction)) {
      continue
    }

    App.move_zone_move(items, it, direction)
    return
  }

  App.move_tabs_vertically(direction, items[0])
}

App.move_to_zone_down = (item) => {
  let [items, tabs, first_index] = App.move_zone_prepare(item)

  if (!items.length) {
    return
  }

  let direction = `down`

  for (let it of tabs) {
    if (!App.move_zone_check(it, first_index, direction)) {
      continue
    }

    App.move_zone_move(items, it, direction)
    return
  }

  App.move_tabs_vertically(direction, items[0])
}

App.fill_headers = (e) => {
  let items = []

  for (let n = 2; n <= 10; n++) {
    items.push({
      text: `${n} Headers`,
      action: () => {
        App.do_fill_headers(n)
      },
    })
  }

  App.show_context({
    title: `${App.zone_icon} Headers`,
    items,
    e,
  })
}

App.fill_subheaders = (e) => {
  let items = []

  for (let n = 2; n <= 10; n++) {
    items.push({
      text: `${n} Subheaders`,
      action: () => {
        App.do_fill_headers(n, false)
      },
    })
  }

  App.show_context({
    title: `${App.zone_icon} Subheaders`,
    items,
    e,
  })
}

App.do_fill_headers = (num, full = true) => {
  App.close_headers(true)
  App.close_subheaders(true)

  let tabs = App.get_normal_tabs()
  let step = parseInt(tabs.length / (num + 1))
  let items = tabs.filter((_, i) => ((i % step) === 0) && (i > 0)).slice(0, num)

  for (let item of items) {
    App.insert_header({item, full, random_title: true})
  }
}

App.get_zones_and_icon = (what) => {
  let zones, icon

  if (what === `header`) {
    zones = App.get_header_tabs()
    icon = App.get_setting_icon(`header`) || App.zone_icon
  }
  else if (what === `subheader`) {
    zones = App.get_subheader_tabs()
    icon = App.get_setting_icon(`subheader`) || App.zone_icon
  }
  else {
    zones = App.get_zones()
    icon = App.zone_icon
  }

  return [zones, icon]
}

App.tabs_to_zone = (args = {}) => {
  let def_args = {
    position: `top`,
  }

  App.def_args(def_args, args)
  let [zones, icon] = App.get_zones_and_icon(args.what)

  let items = []

  for (let zone of zones) {
    items.push({
      icon,
      text: App.title(zone, false),
      action: () => {
        App.move_to_zone(zone, args.item, args.position)
      },
    })
  }

  App.show_context({
    title: `${App.zone_icon} To Zone`,
    items,
    e: args.e,
  })
}

App.move_to_zone = (zone, item, position = `top`) => {
  let tabs = App.get_active_items({mode: `tabs`, item})
  let zone_index = App.get_item_element_index({element: zone.element})
  let last_item = App.get_last_zone_item(zone)
  let first_index = App.get_item_element_index({element: tabs[0].element})

  if (position === `top`) {
    let direction = zone_index < first_index ? `up` : `down`
    App.move_zone_move(tabs, zone, direction)
  }
  else if (position === `bottom`) {
    let direction = last_item < first_index ? `up` : `down`
    App.move_zone_move(tabs, last_item, direction)
  }
}

App.pick_zone = (e, what, position = `top`) => {
  let [zones, icon] = App.get_zones_and_icon(what)
  let items = []

  for (let [i, zone] of zones.entries()) {
    items.push({
      icon,
      text: App.title(zone, false),
      action: () => {
        App.go_to_zone(zone, position)
      },
    })
  }

  App.show_context({
    title: `${App.zone_icon} Pick Zone`,
    items,
    e,
  })
}

App.go_to_zone = (zone, position = `top`) => {
  let item

  if (position === `top`) {
    item = zone
  }
  else if (position === `bottom`) {
    item = App.get_last_zone_item(zone)
  }

  App.tabs_action({
    item,
    scroll: `center_smooth`,
    from: `jump`,
    on_action: false,
  })
}

App.get_zone_of_tab = (item) => {
  if (item.header) {
    return
  }

  let tabs = App.get_items(`tabs`)
  let reversed = tabs.slice().reverse()
  let met = false

  for (let tab of reversed) {
    if (tab === item) {
      met = true
      continue
    }

    if (met && tab.header) {
      return tab
    }
  }
}

App.get_zone_by_title = (title) => {
  let items = App.get_items(`tabs`)

  for (let item of items) {
    if (item.header && (App.title(item, false) === title)) {
      return item
    }
  }
}

App.upgrade_zone = (item) => {
  App.edit_tab_split({item, which: `top`})
}

App.downgrade_zone = (item) => {
  App.remove_edits({what: [`split_top`], items: [item], text: `splits`})
}

App.remove_headers = (items) => {
  return items.filter(x => !x.header)
}

App.get_last_zone_item = (item) => {
  let tabs = App.get_items(`tabs`)
  let index = App.get_item_element_index({element: item.element})

  for (let i = index + 1; i < tabs.length; i++) {
    if (tabs[i].header) {
      return tabs[i - 1]
    }
  }

  return tabs.at(-1)
}

App.get_zone_tabs = (zone) => {
  if (!zone || !App.is_zone(zone)) {
    return []
  }

  let tabs = App.get_items(`tabs`)
  let index = App.get_item_element_index({element: zone.element})

  if (index < 0) {
    return []
  }

  let result = []

  for (let i = index + 1; i < tabs.length; i++) {
    let tab = tabs[i]

    if (App.is_zone(tab)) {
      break
    }

    result.push(tab)
  }

  return result
}

App.toggle_zones = () => {
  let ze = App.get_setting(`zones_enabled`)

  App.set_setting({
    setting: `zones_enabled`,
    value: !ze,
    action: true,
  })

  App.toggle_message(`Zones`, `zones_enabled`)
  App.do_filter()
}