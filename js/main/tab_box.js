App.setup_tab_box = () => {
  App.update_tab_box_debouncer = App.create_debouncer(() => {
    App.do_update_tab_box()
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

  App.tab_box_scroll_info_debouncer = App.create_debouncer((mode) => {
    App.do_check_tab_box_scroll_info(mode)
  }, App.scroller_delay)
}

App.make_tab_box_modes = () => {
  App.tab_box_modes = {
    recent: {info: `Recently visited tabs`, icon: App.mode_icon(`tabs`)},
    pins: {info: `Pinned tabs`, icon: App.get_setting(`pin_icon`)},
    playing: {info: `Tabs emitting sound`, icon: App.get_setting(`playing_icon`)},
    colors: {info: `Tabs with colors`, icon: App.settings_icons.colors},
    tags: {info: `Tabs with tags`, icon: App.get_setting(`tags_icon`)},
    icons: {info: `Tabs with icons`, icon: App.bot_icon},
    titles: {info: `Tabs with titles`, icon: App.get_setting(`title_icon`)},
    notes: {info: `Tabs with notes`, icon: App.get_setting(`notes_icon`)},
    roots: {info: `Tabs with a root`, icon: App.get_setting(`root_icon`)},
    parents: {info: `Tabs that are parents to other tabs`, icon: App.get_setting(`parent_icon`)},
    nodes: {info: `Tabs that were opened by another tab`, icon: App.get_setting(`node_icon`)},
    nodez: {info: `The tabs opened by the selected tab`, icon: App.get_setting(`node_icon`)},
    headers: {info: `Headers and subheaders`, icon: App.get_setting(`header_icon`) || App.zone_icon},
    history: {info: `Pick a query to search history`, icon: App.mode_icon(`history`)},
    folders: {info: `Pick a bookmarks folder`, icon: App.mode_icon(`bookmarks`)},
  }
}

App.reset_tab_box = () => {
  App.tab_box_items = []
  App.tab_box_o_items = []
  App.current_tab_box_mode = undefined
  App.tab_box_mouse_inside = false
  App.tab_box_size_on_mouse_leave = undefined
  App.tab_box_size = undefined
  App.tab_box_check_size()
  App.make_tab_box_modes()
}

App.create_tab_box = () => {
  let tab_box = DOM.create(`div`, `box`, `tab_box`)
  let title = DOM.create(`div`, `box_title glowbox`, `tab_box_title`)

  if (App.get_setting(`show_tooltips`)) {
    let parts = [
      `This is the Tab Box`,
      `Click to select a mode`,
      `Shift Click to select tabs`,
      `Middle Click to close tabs`,
    ]

    title.title = parts.join(`\n`)
  }

  let title_main = DOM.create(`div`, `box_title_main`, `tab_box_title_main`)
  title.append(title_main)
  let title_count = DOM.create(`div`, `box_title_count`, `tab_box_title_count`)
  title.append(title_count)
  let title_scroll = DOM.create(`div`, `box_title_scroll`, `tab_box_title_scroll`)
  title.append(title_scroll)
  tab_box.append(title)
  let container = DOM.create(`div`, `box_container`, `tab_box_container`)
  tab_box.append(container)

  DOM.ev(tab_box, `mouseenter`, () => {
    App.tab_box_mouse_inside = true
    App.tab_box_clear_grow()
    App.tab_box_grow()
  })

  DOM.ev(tab_box, `mouseleave`, () => {
    App.tab_box_mouse_inside = false
    App.tab_box_clear_grow()
    let s_size = App.tab_box_size_on_mouse_leave

    if (s_size) {
      App.tab_box_size = s_size
      App.tab_box_check_size()
      App.tab_box_size_on_mouse_leave = undefined
      return
    }

    App.tab_box_ungrow()
  })

  container.ondragover = (e) => {
    e.preventDefault()
  }

  container.ondrop = (e) => {
    e.preventDefault()
    let value = e.dataTransfer.getData(`text/plain`)
    let mode = App.get_tab_box_mode()
    let target = DOM.parent(e.target, [`.tab_box_item`])

    if (!target) {
      return
    }

    if (mode === `history`) {
      App.move_history_pick(value, target.dataset.value)
    }
    else if (mode === `folders`) {
      App.move_folders_pick(value, target.dataset.id)
    }
  }

  DOM.ev(container, `scroll`, () => {
    App.check_tab_box_scroll_info()
  })

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

App.update_tab_box = () => {
  App.update_tab_box_debouncer.call()
}

App.do_update_tab_box = () => {
  App.update_tab_box_debouncer.cancel()

  if (!App.tab_box_enabled()) {
    return
  }

  let what = App.get_tab_box_mode()
  App.check_tab_box()

  if (!App[`update_tab_box_${what}`]()) {
    return
  }

  App.tab_box_focused = undefined
  App.set_tab_box_title(what)
  App.tab_box_scroll()
  App.tab_box_shrink()
  App.do_check_tab_box_scroll_info()
}

App.change_tab_box_mode = (what, set = true) => {
  App.current_tab_box_mode = what

  if (set) {
    App.set_tab_box_mode(what)
  }
}

App.tab_box_show = (mode, o_items) => {
  if (!App.tab_box_mode(mode)) {
    return false
  }

  let different = true

  if (mode === App.get_tab_box_mode()) {
    if (!App.tab_box_special()) {
      if (o_items.length && (o_items.length === App.tab_box_o_items.length)) {
        different = !o_items.every(item =>
          App.tab_box_o_items.some(item_2 => item.id === item_2.id),
        )
      }
    }
  }

  if (!different) {
    return false
  }

  let items

  if (mode === `folders`) {
    items = App.fill_tab_box_folders()
  }
  else if (mode === `history`) {
    items = App.fill_tab_box_history()
  }
  else {
    items = App.get_tab_box_items(o_items, mode)
    App.fill_tab_box(items)
  }

  App.update_tab_box_count(items.length)
  App.tab_box_items = items
  App.tab_box_o_items = o_items
  return true
}

//

App.update_tab_box_recent = () => {
  let o_items = App.get_recent_tabs({
    max: App.get_setting(`tab_box_max`),
    headers: App.get_setting(`tab_box_headers`),
  })

  return App.tab_box_show(`recent`, o_items)
}

App.update_tab_box_pins = () => {
  let o_items = App.get_pinned_tabs()
  return App.tab_box_show(`pins`, o_items)
}

App.update_tab_box_playing = () => {
  let o_items = App.get_playing_tabs()
  return App.tab_box_show(`playing`, o_items)
}

App.update_tab_box_colors = () => {
  let o_items = App.get_colored_items(`tabs`)
  return App.tab_box_show(`colors`, o_items)
}

App.update_tab_box_tags = () => {
  let o_items = App.get_tagged_items(`tabs`)
  return App.tab_box_show(`tags`, o_items)
}

App.update_tab_box_icons = () => {
  let o_items = App.get_iconed_items(`tabs`)
  return App.tab_box_show(`icons`, o_items)
}

App.update_tab_box_roots = () => {
  let o_items = App.get_root_items(`tabs`)
  return App.tab_box_show(`roots`, o_items)
}

App.update_tab_box_headers = () => {
  let o_items = App.get_headers()
  return App.tab_box_show(`headers`, o_items)
}

App.update_tab_box_parents = () => {
  let o_items = App.get_parent_tabs()
  return App.tab_box_show(`parents`, o_items)
}

App.update_tab_box_nodes = () => {
  let o_items = App.get_node_tabs()
  return App.tab_box_show(`nodes`, o_items)
}

App.update_tab_box_nodez = () => {
  let o_items = App.get_current_tab_nodes()
  return App.tab_box_show(`nodez`, o_items)
}

App.update_tab_box_notes = () => {
  let o_items = App.get_noted_items()
  return App.tab_box_show(`notes`, o_items)
}

App.update_tab_box_titles = () => {
  let o_items = App.get_titled_items()
  return App.tab_box_show(`titles`, o_items)
}

App.update_tab_box_folders = () => {
  return App.tab_box_show(`folders`, [])
}

App.update_tab_box_history = () => {
  return App.tab_box_show(`history`, [])
}

//

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
    App.create_item_element(item)
    item.element.classList.add(`tab_box_item`)
    item.element.classList.add(`tab_box_tabs_item`)
    items.push(item)
  }

  if (App.get_setting(`tab_box_reverse`)) {
    items = items.reverse()
  }

  return items
}

App.set_tab_box_title = (mode) => {
  if (!mode) {
    mode = App.get_setting(`tab_box_mode`)
  }

  if (Object.keys(App.tab_box_modes).indexOf(mode) === -1) {
    mode = `recent`
    App.set_setting({setting: `tab_box_mode`, value: mode})
  }

  let title_main = DOM.el(`#tab_box_title_main`)
  title_main.innerHTML = ``
  let icon = App.tab_box_modes[mode].icon
  let text = App.capitalize(mode)
  title_main.append(App.button_text(icon, text, true))
}

App.scroll_tab_box_top = () => {
  let c = DOM.el(`#tab_box_container`)
  App.scroll_to_top(c)
}

App.scroll_tab_box_bottom = () => {
  let c = DOM.el(`#tab_box_container`)
  App.scroll_to_bottom(c)
}

App.fill_tab_box = (items) => {
  let text_mode = App.get_setting(`text_mode`)
  let c = DOM.el(`#tab_box_container`)
  c.innerHTML = ``

  for (let item of items) {
    if (text_mode === `url`) {
      item.element.title = item.tooltips_title
    }
    else {
      item.element.title = item.tooltips_url
    }

    c.append(item.element)
  }
}

App.show_tab_box_menu = (e) => {
  let items = []
  let c_mode = App.get_tab_box_mode()

  for (let tbmode in App.tab_box_modes) {
    if (c_mode === tbmode) {
      continue
    }

    items.push({
      text: App.capitalize(tbmode),
      icon: App.tab_box_modes[tbmode].icon,
      info: App.tab_box_modes[tbmode].info,
      action: () => {
        App.change_tab_box_mode(tbmode)
        App.update_tab_box()
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

  if (App.tab_box_items.length) {
    items.push({
      icon: App.mode_icon(`tabs`),
      text: `Select`,
      action: () => {
        App.select_tab_box_tabs()
      },
    })

    items.push({
      icon: App.close_icon,
      text: `Close`,
      action: () => {
        App.close_tab_box_tabs()
      },
    })

    App.sep(items)
  }

  items.push({
    icon: App.settings_icons.tab_box,
    text: `Size`,
    items: sizes,
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

App.show_tab_box_menu_2 = (e) => {
  let items = App.custom_menu_items({
    name: `tab_box_menu`,
  })

  App.show_context({items, e})
}

App.get_tab_box_mode = () => {
  return App.current_tab_box_mode || App.get_setting(`tab_box_mode`)
}

App.tab_box_mode = (what) => {
  if (App.get_setting(`show_tab_box`)) {
    if (App.get_tab_box_mode() === what) {
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
  let current = App.get_tab_box_mode()
  let modes = Object.keys(App.tab_box_modes).slice(0)

  if (dir === `prev`) {
    modes.reverse()
  }

  for (let mode of modes) {
    if (waypoint) {
      App.change_tab_box_mode(mode)
      App.do_update_tab_box()
      return
    }

    if (mode === current) {
      waypoint = true
      continue
    }
  }

  App.change_tab_box_mode(modes[0])
  App.do_update_tab_box()
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

    if (App.get_tab_box_mode() !== `playing`) {
      App.change_tab_box_mode(`playing`, false)
      App.update_tab_box()
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

  if (!App.tab_box_items.length) {
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
  let auto = App.get_setting(`tab_box_auto_grow`)

  if (auto === `none`) {
    return
  }

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
  App.tab_box_size = undefined
  App.set_setting({setting: `tab_box_size`, value: what})
  App.check_refresh_settings()
  App.tab_box_check_size()
}

App.set_tab_box_mode = (what) => {
  App.set_setting({setting: `tab_box_mode`, value: what})
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
  let limited = App.tab_box_limited()

  if (!limited && App.get_setting(`show_tab_box`)) {
    App.show_tab_box()
  }
  else {
    App.hide_tab_box()
  }
}

App.show_tab_box = (refresh = true, set = false) => {
  App.main_add(`show_tab_box`)

  if (refresh) {
    App.update_tab_box()
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
    App.check_tab_box_auto()
    App.show_tab_box(true, true)
  }
}

App.check_tab_box_scroll = () => {
  if (!App.tab_box_enabled()) {
    return
  }

  if (App.tab_box_auto_scrollable()) {
    App.tab_box_scroll()
  }
}

App.tab_box_scroll = () => {
  if (App.tab_box_focused) {
    if (App.get_setting(`tab_box_reveal`)) {
      App.tab_box_focused.scrollIntoView({block: `nearest`})
      return
    }
  }

  let scroll = App.get_setting(`tab_box_scroll`)

  if (scroll === `top`) {
    App.scroll_tab_box_top()
  }
  else if (scroll === `bottom`) {
    App.scroll_tab_box_bottom()
  }
}

App.update_tab_box_count = (count) => {
  if (App.get_setting(`tab_box_count`)) {
    let el = DOM.el(`#tab_box_title_count`)
    el.textContent = `(${count})`
  }
}

App.tab_box_shrink = () => {
  App.tab_box_shrink_debouncer.call()
}

App.do_tab_box_shrink = () => {
  App.tab_box_shrink_debouncer.cancel()
  let auto = App.get_setting(`tab_box_auto_shrink`)
  let new_size

  if (auto === `none`) {
    return
  }

  if (App.tab_box_items.length) {
    new_size = App.get_setting(`tab_box_size`)
  }
  else {
    let size = App.get_setting(`tab_box_auto_shrink`)

    if (size === `none`) {
      return
    }

    new_size = App.get_setting(`tab_box_auto_shrink`)
  }

  if (App.tab_box_mouse_inside) {
    App.tab_box_size_on_mouse_leave = new_size
  }
  else {
    App.tab_box_size = new_size
    App.tab_box_check_size()
  }
}

App.tab_box_special = () => {
  return [`history`, `folders`].includes(App.get_tab_box_mode())
}

App.close_tab_box_tabs = () => {
  if (App.tab_box_special()) {
    return
  }

  if (App.tab_box_items.length) {
    App.close_tabs({selection: App.tab_box_items})
  }
}

App.select_tab_box_tabs = () => {
  for (let item of App.tab_box_o_items) {
    App.toggle_selected({item, what: true})
  }
}

App.refresh_tab_box_element = (o_item) => {
  if (!App.tab_box_enabled()) {
    return
  }

  for (let item of App.tab_box_items) {
    if (item.id === o_item.id) {
      for (let key in o_item) {
        if (key === `element`) {
          continue
        }

        item[key] = o_item[key]
      }

      App.refresh_item_element(item)
      App.tab_box_update_active()
      break
    }
  }
}

App.tab_box_update_active = () => {
  for (let item of App.tab_box_items) {
    if (item.active) {
      item.element.classList.add(`active_tab`)

      if (App.get_setting(`tab_box_follow`)) {
        item.element.scrollIntoView({block: `nearest`})
      }
    }
    else {
      item.element.classList.remove(`active_tab`)
    }
  }
}

App.tab_box_make_item_first = (item) => {
  if (!App.tab_box_enabled()) {
    return
  }

  if (App.get_tab_box_mode() !== `recent`) {
    return
  }

  for (let it of App.tab_box_items) {
    if (it.id === item.id) {
      let c = DOM.el(`#tab_box_container`)
      c.prepend(it.element)
      break
    }
  }
}

App.tab_box_limited = () => {
  let limited = false
  let win_height = window.innerHeight
  let tb_min_height = App.get_setting(`tab_box_min_height`)

  if (tb_min_height > 0) {
    limited = win_height < tb_min_height
  }

  return limited
}

App.fill_tab_box_folders = () => {
  let picks = App.bookmark_folder_picks
  let c = DOM.el(`#tab_box_container`)
  c.innerHTML = ``

  for (let pick of picks) {
    let el = DOM.create(`div`, `tab_box_item tab_box_special_item`)
    let icon = DOM.create(`div`, `tab_box_special_item_icon`)
    let text = DOM.create(`div`, `item_text`)
    el.draggable = true
    el.dataset.id = pick.id
    icon.textContent = App.mode_icon(`bookmarks`)
    text.textContent = pick.title

    if (App.bookmarks_folder && (App.bookmarks_folder.id === pick.id)) {
      el.classList.add(`active_tab`)
      App.tab_box_focused = el
    }

    el.append(icon)
    el.append(text)

    DOM.ev(el, `click`, (e) => {
      let folder = App.get_bookmarks_folder_by_id(pick.id)
      App.open_bookmarks_folder(folder)
    })

    DOM.ev(el, `auxclick`, (e) => {
      if (e.button === 1) {
        App.forget_bookmarks_folder_pick(pick.id)
      }
    })

    el.ondragstart = (e) => {
      e.dataTransfer.setData(`text/plain`, pick.id)
    }

    c.append(el)
  }

  return picks
}

App.fill_tab_box_history = () => {
  let picks = App.history_picks
  let c = DOM.el(`#tab_box_container`)
  c.innerHTML = ``
  let current = App.get_filter().trim()

  for (let pick of picks) {
    let el = DOM.create(`div`, `tab_box_item tab_box_special_item`)
    let icon = DOM.create(`div`, `tab_box_special_item_icon`)
    let text = DOM.create(`div`, `item_text`)
    el.draggable = true
    el.dataset.value = pick
    icon.textContent = App.mode_icon(`history`)
    text.textContent = pick

    if (current === pick) {
      el.classList.add(`active_tab`)
      App.tab_box_focused = el
    }

    el.append(icon)
    el.append(text)

    DOM.ev(el, `click`, (e) => {
      App.do_show_mode({mode: `history`, filter: pick})
    })

    DOM.ev(el, `auxclick`, (e) => {
      if (e.button === 1) {
        App.forget_history_pick(pick)
      }
    })

    el.ondragstart = (e) => {
      e.dataTransfer.setData(`text/plain`, pick)
    }

    c.append(el)
  }

  return picks
}

App.tab_box_auto_mode = (mode) => {
  if (!App.tab_box_enabled()) {
    return
  }

  let autos = []

  if (App.get_setting(`tab_box_auto_history`)) {
    autos.push(`history`)
  }

  if (App.get_setting(`tab_box_auto_folders`)) {
    autos.push(`folders`)
  }

  if (mode === `history`) {
    if (autos.includes(`history`)) {
      App.change_tab_box_mode(`history`, false)
      App.update_tab_box()
    }
  }
  else if (mode === `bookmarks`) {
    if (autos.includes(`folders`)) {
      App.change_tab_box_mode(`folders`, false)
      App.update_tab_box()
    }
  }
  else {
    let current = App.get_tab_box_mode()

    if (autos.includes(current)) {
      let m = App.get_setting(`tab_box_mode`)
      App.change_tab_box_mode(m, false)
      App.update_tab_box()
    }
  }
}

App.check_tab_box_auto = (mode = App.active_mode) => {
  if (mode === `history`) {
    if (App.get_setting(`tab_box_auto_history`)) {
      App.change_tab_box_mode(`folders`, false)
    }
  }
  else if (mode === `bookmarks`) {
    if (App.get_setting(`tab_box_auto_folders`)) {
      App.change_tab_box_mode(`folders`, false)
    }
  }
}

App.refresh_tab_box_special = (mode) => {
  if (!App.tab_box_enabled()) {
    return
  }

  let tb_mode = App.get_tab_box_mode()

  if (mode === `history`) {
    if (tb_mode === `history`) {
      App.update_tab_box()
    }
  }
  else if (mode === `bookmarks`) {
    if (tb_mode === `folders`) {
      App.update_tab_box()
    }
  }
}

App.tab_box_auto_scrollable = () => {
  return [`recent`].includes(App.get_tab_box_mode())
}

App.check_tab_box_scroll_info = () => {
  App.tab_box_scroll_info_debouncer.call()
}

App.do_check_tab_box_scroll_info = () => {
  App.tab_box_scroll_info_debouncer.cancel()

  if (!App.get_setting(`tab_box_scroll_info`)) {
    return
  }

  let container = DOM.el(`#tab_box_container`)
  let percentage = 100 - ((container.scrollTop /
    (container.scrollHeight - container.clientHeight)) * 100)

  if (isNaN(percentage)) {
    percentage = 100
  }

  let per = parseInt(percentage)
  DOM.el(`#tab_box_title_scroll`).textContent = `(${per}%)`
}