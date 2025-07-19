App.setup_items = () => {
  App.check_selected_debouncer = App.create_debouncer((mode) => {
    App.do_check_selected(mode)
  }, App.check_selected_delay)

  App.start_item_observer()
}

App.remove_selected_class = (mode) => {
  for (let el of DOM.els(`.selected`, DOM.el(`#${mode}_container`))) {
    el.classList.remove(`selected`)
  }
}

App.select_item = (args = {}) => {
  let def_args = {
    deselect: true,
    scroll: `center`,
    from: `normal`,
    check_auto_scroll: false,
  }

  App.def_args(def_args, args)

  if (!args.item) {
    return
  }

  if (args.item.mode !== App.active_mode) {
    return
  }

  if (args.deselect) {
    App.deselect({mode: args.item.mode})
  }

  if (args.from === `tab_box`) {
    if (!App.get_setting(`tab_box_focus`)) {
      args.scroll = `none`
    }
  }
  else if (args.check_auto_scroll) {
    if (!App.get_setting(`auto_scroll`)) {
      args.scroll = `none`
    }
  }

  App.toggle_selected({item: args.item, what: true})

  // To avoid scrolling when closing multiple tabs with the mouse
  // only scroll the item when the mouse goes out of the window
  // else it interrupts the closing process from the user
  App.scroll_on_mouse_out = () => {
    App.scroll_to_item({item: args.item, scroll: args.scroll})
  }

  // If the cursor is already outside or
  // if a tab hasn't been closed recently
  // then run the function immidiately
  let d = App.now() - App.close_tabs_date

  if (!App.mouse_inside || (d > App.close_tabs_min)) {
    App.do_scroll_on_mouse_out()
  }

  App.last_selected_date[args.item.mode] = App.now()
  let tb_mode = App.get_tab_box_mode()

  if ([`nodez`].includes(tb_mode)) {
    App.update_tab_box()
  }
}

App.select_up_down = (mode, direction = `down`, alt = false) => {
  let up = direction === `up`
  let no_header = App.is_filtered(mode) ? false : true
  let wrap = App.get_setting(`wrap_items`)

  let item = App.get_other_item({
    mode,
    no_header,
    no_unloaded: alt,
    wrap,
  }, up)

  if (item) {
    App.select_item({item, scroll: `nearest`})
  }
}

App.select_next = (mode, dir) => {
  let waypoint = false
  let items = App.get_items(mode).slice(0)

  if (!items.length) {
    return
  }

  let current = App.get_selected(mode)

  if (dir === `above`) {
    items.reverse()
  }

  for (let item of items) {
    if (!item.visible) {
      continue
    }

    if (waypoint) {
      App.select_range(item)
      break
    }
    else if (item === current) {
      waypoint = true
    }
  }
}

App.select_to_edge = (mode, dir) => {
  let item = App.get_selected(mode)
  let items = App.get_items(mode).slice(0)

  if (App.tabs_normal()) {
    if (mode === `tabs`) {
      if (item.pinned) {
        if (dir === `down`) {
          if (item !== App.get_last_pinned_tab()) {
            items = items.filter(x => x.pinned)
          }
        }
      }
      else if (dir === `up`) {
        if (item !== App.get_first_normal_tab()) {
          items = items.filter(x => !x.pinned)
        }
      }
    }
  }

  if (!items.length) {
    return
  }

  if (dir === `down`) {
    items.reverse()
  }

  App.select_range(items[0])
}

App.get_other_item = (args = {}, reverse = false) => {
  let def_args = {
    only_visible: true,
    no_selected: false,
    no_unloaded: false,
    no_header: true,
    wrap: true,
  }

  App.def_args(def_args, args)
  let waypoint = false

  if (!App.get_selected(args.mode)) {
    waypoint = true
  }

  if (!args.item) {
    args.item = App.get_selected(args.mode)
  }

  let items = App.get_items(args.mode).slice(0)

  if (reverse) {
    items.reverse()
  }

  for (let item of items) {
    if (waypoint) {
      if (args.no_header) {
        if (item.header) {
          continue
        }
      }

      if (args.only_visible) {
        if (!item.visible) {
          continue
        }
      }

      if (args.no_selected) {
        if (item.selected) {
          continue
        }
      }

      if (args.no_unloaded) {
        if (item.unloaded) {
          continue
        }
      }

      return item
    }

    if (item === args.item) {
      waypoint = true
    }
  }

  if (args.wrap) {
    for (let item of items) {
      if (item.visible) {
        return item
      }
    }
  }
}

App.get_selected = (mode = App.active_mode) => {
  return App[`last_selected_${mode}`]
}

App.set_selected = (item) => {
  if (!item) {
    App.remove_selected_class(item.mode)
    return
  }

  let prev = App[`last_selected_${item.mode}`]

  if (prev && prev.blink_interval) {
    App.clear_blink_item(prev)
  }

  App[`last_selected_${item.mode}`] = item

  if (App.get_setting(`sticky_filter`) !== `none`) {
    let f_mode = App.filter_mode(item.mode)
    App.set_filter_item(item.mode, f_mode, item)
  }

  App.update_footer_info(item)
}

App.clear_selected = (mode) => {
  App[`last_selected_${mode}`] = undefined

  for (let item of App.get_items(mode)) {
    if (item.selected) {
      App.toggle_selected({item, what: false, select: false})
    }
  }
}

App.get_items = (mode = App.active_mode) => {
  let items = App[`${mode}_items`] || []
  App.remove_undefined(items)
  return items
}

App.get_item_count = (mode = App.active_mode) => {
  return App.get_items(mode).length
}

App.select_first_item = (mode, by_active = false, scroll = `center`) => {
  if ((mode === `tabs`) && by_active) {
    for (let item of App.get_items(mode)) {
      if (item.visible && item.active) {
        App.select_item({item, scroll})
        return
      }
    }
  }

  for (let item of App.get_items(mode)) {
    if (item.visible) {
      App.select_item({item})
      return
    }
  }
}

App.filter_item_by_id = (mode, id) => {
  id = id.toString()
  let item_string = `${mode}_items`
  App[item_string] = App[item_string].filter(x => x.id.toString() !== id)
}

App.remove_item = (item) => {
  let mode = item.mode

  if (App.get_selected(mode) === item) {
    let next_item = App.get_next_item(mode)

    if (next_item) {
      App.select_item({item: next_item, scroll: `nearest`})
    }
  }

  if (item.mode === `tabs`) {
    App.remove_tree_item(item)
  }

  item.element.remove()
  item.removed = true
  App.filter_item_by_id(mode, item.id)
  App.update_footer_count()
  App.check_filter_special(mode)

  if (mode === `tabs`) {
    App.update_tab_box()
    App.update_tab_count()
  }
}

App.show_item = (it) => {
  DOM.show(it.element)
  it.visible = true
}

App.hide_item = (it) => {
  DOM.hide(it.element)
  it.visible = false
}

App.clear_items = (mode) => {
  App[`${mode}_items`] = []
  let c = DOM.el(`#${mode}_container`)

  if (c) {
    DOM.el(`#${mode}_container`).innerHTML = ``
  }

  if (mode === `tabs`) {
    App.tab_tree = {}
  }
}

App.clear_all_items = () => {
  for (let mode of App.modes) {
    App.clear_items(mode)
  }
}

App.refresh_item_element = (item) => {
  if (!item.element_ready) {
    return
  }

  App.check_header(item)
  App.check_tab_loading(item)
  App.check_item_icon(item)
  App.check_icons(item)
  App.check_tab_colors(item)
  App.check_tab_active(item)
  App.set_item_text(item)
  App.apply_color_mode(item)
  App.check_taglist(item)
  App.check_unloaded(item)
  App.check_hide_tabs(item)
  App.check_obfuscated(item)

  if (App.zones_unlocked(item.mode)) {
    App.apply_splits(item)
  }
}

App.create_empty_item_element = (item) => {
  item.element = DOM.create(`div`, `grasshopper_item item ${item.mode}_item element ${item.mode}_element empty_element`)
  item.element.dataset.id = item.id
  item.element_ready = false
  App.item_observer.observe(item.element)
}

App.create_item_element = (item) => {
  if (item.element_ready) {
    return
  }

  App.item_observer.unobserve(item.element)
  item.element.classList.remove(`empty_element`)
  App.check_header(item)
  App.create_hover_button(item, `left`)
  App.add_close_button(item, `left`)
  let trace = App.create_active_trace()
  item.element.append(trace)
  let count = App.create_tab_count()
  item.element.append(count)

  if (App.get_setting(`item_icon`) !== `none`) {
    let icon_container = DOM.create(`div`, `item_icon_container item_node`)
    item.element.append(icon_container)
    App.check_item_icon(item)
  }

  App.add_icons(item, `left`)
  item.element.draggable = true

  if (App.zones_unlocked(item.mode)) {
    App.apply_splits(item)
  }

  let content = DOM.create(`div`, `item_content`)
  let text = DOM.create(`div`, `item_text`)
  let text_1 = DOM.create(`div`, `item_text_line item_text_1`)
  let text_2 = DOM.create(`div`, `item_text_line item_text_2 hidden`)
  let taglist_pos = App.get_setting(`taglist_position`)
  let taglist = App.create_taglist()

  if (taglist_pos === `above`) {
    content.append(taglist)
  }

  text.append(text_1)
  text.append(text_2)
  content.append(text)

  if ((taglist_pos !== `none`) && (taglist_pos !== `above`)) {
    content.append(taglist)
  }

  item.element.append(content)

  App.add_icons(item, `right`)
  App.check_icons(item)
  App.set_item_text(item)
  App.check_taglist(item)
  App.apply_color_mode(item)

  if (item.mode === `tabs`) {
    App.create_hover_button(item, `right`)
    App.add_close_button(item, `right`)
    App.check_tab_loading(item)
    App.check_tab_colors(item)
    App.check_tab_active(item)
    App.check_unloaded(item)
    App.check_hide_tabs(item)
    App.check_obfuscated(item)
  }

  if (item.selected) {
    item.element.classList.add(`selected`)
  }
  else {
    item.element.classList.remove(`selected`)
  }

  item.element_ready = true
}

App.set_item_text = (item) => {
  if (item.header) {
    App.set_header_text(item)
    return
  }

  let lines = []
  let url

  if (App.get_setting(`show_protocol`)) {
    url = item.decoded_url
  }
  else {
    url = item.path
  }

  let text_mode = App.get_setting(`text_mode`)
  let title = App.title(item)

  if (text_mode === `title`) {
    lines.push(title || url)
    item.footer = url || title
  }
  else if (text_mode === `url`) {
    lines.push(url || title)
    item.footer = title || url
  }
  else if (text_mode === `title_url`) {
    lines.push(title)
    lines.push(url)
    item.footer = url || title
  }
  else if (text_mode === `url_title`) {
    lines.push(url)
    lines.push(title)
    item.footer = title || url
  }

  for (let [i, line] of lines.entries()) {
    if (!line) {
      line = `Empty`
    }

    let text = line.substring(0, App.max_text_length).trim()

    if (App.get_obfuscated(item)) {
      text = App.obfuscate_text(text)
    }

    let text_el = DOM.el(`.item_text_${i + 1}`, item.element)
    DOM.show(text_el)
    text_el.textContent = text
  }

  item.tooltips_title = title
  item.tooltips_url = url
  item.has_tooltips = false
}

App.change_item_text = (item, text) => {
  let lines = DOM.els(`.item_text_line`, item.element)

  for (let line of lines) {
    line.textContent = ``
  }

  lines[0].textContent = text
}

App.get_item_by_id = (mode, id) => {
  id = id.toString()

  for (let item of App.get_items(mode)) {
    if (item.id.toString() === id) {
      return item
    }
  }
}

App.get_item_by_url = (mode, url) => {
  for (let item of App.get_items(mode)) {
    if (item.url) {
      if (App.urls_equal(item.url, url)) {
        return item
      }
    }
  }
}

App.setup_item_window = (mode) => {
  if (App.check_ready(mode)) {
    return
  }

  let args = {}
  args.id = mode
  args.close_button = false
  args.align_top = `left`
  args.cls = `mode`
  args.main_top = true
  args.main_bottom = true

  args.setup = () => {
    if (App.optional_modes.includes(mode)) {
      App[`setup_${mode}`]()
    }

    App.build_item_window(mode)
  }

  App.create_window(args)
}

App.focus_or_open_item = async (item, soft = false) => {
  for (let tab of App.get_items(`tabs`)) {
    if (App.urls_equal(tab.url, item.url)) {
      if (tab.unloaded && soft) {
        await App.check_on_tabs()
        App.select_item({item: tab, scroll: `nearest_smooth`})
      }
      else {
        await App.focus_tab({item: tab})
      }

      return `focused`
    }
  }

  if (App.get_setting(`open_in_new_tab`)) {
    App.open_tab(item)
  }
  else {
    App.change_tab(item)
  }

  App.after_open()
  return `opened`
}

App.any_item_visible = (mode) => {
  for (let item of App.get_items(mode)) {
    if (item.visible) {
      return true
    }
  }

  return false
}

App.get_visible = (mode) => {
  return App.get_items(mode).filter(x => x.visible)
}

App.update_item = (args = {}) => {
  let def_args = {}
  App.def_args(def_args, args)

  for (let item of App.get_items(args.mode)) {
    if (item.id === args.id) {
      App.process_info({mode: args.mode, info: args.info, o_item: item, url: args.url})
      App.check_filter(args.mode)

      if (args.mode === `tabs`) {
        App.update_active_trace()
        App.update_tab_count()
      }

      break
    }
  }
}

App.get_item_index = (mode, item) => {
  return App.get_items(mode).indexOf(item)
}

App.get_item_element_index = (args = {}) => {
  let def_args = {
    mode: App.active_mode,
    include_all: false,
  }

  App.def_args(def_args, args)

  if (args.include_all) {
    return DOM.els(`.${args.mode}_element`).indexOf(args.element)
  }

  return DOM.els(`.${args.mode}_item`).indexOf(args.element)
}

App.move_item = (mode, from_index, to_index) => {
  let item = App.get_items(mode).splice(from_index, 1)[0]
  App.get_items(mode).splice(to_index, 0, item)
  App.move_item_element(mode, item.element, to_index)
  App.update_tab_box()
}

App.move_item_element = (mode, el, to_index) => {
  let container = DOM.el(`#${mode}_container`)
  let items = DOM.els(`.${mode}_item`)
  let from_index = items.indexOf(el)
  let target = items[to_index]

  if (from_index === to_index) {
    return
  }

  if (to_index === 0) {
    container.prepend(el)
  }
  else if (from_index < to_index) {
    if (target) {
      target.insertAdjacentElement(`afterend`, el)
    }
  }
  else if (target) {
    container.insertBefore(el, target)
  }
}

App.select_range = (item) => {
  let selected = App.get_selected(item.mode)

  if (item === selected) {
    App.select_item({item, scroll: `nearest`})
    return
  }

  let items = App.get_items(item.mode).slice(0)
  let index_1 = items.indexOf(item)
  let index_2 = items.indexOf(selected)

  if (item.selected) {
    let reverse = index_1 < index_2

    for (let [i, it] of items.entries()) {
      if (!it.visible || !it.selected) {
        continue
      }

      let unselect = false

      if (index_1 < index_2) {
        if (i > index_1) {
          unselect = true
        }
      }
      else if (i < index_1) {
        unselect = true
      }

      if (unselect) {
        App.toggle_selected({item: it, what: false})
      }
    }

    let selected = App.selected_items(item.mode)
    let next_item

    if (reverse) {
      next_item = selected.at(-1)
    }
    else {
      next_item = selected.at(0)
    }

    App.set_selected(next_item)
  }
  else {
    let slice

    if (index_1 < index_2) {
      slice = items.slice(index_1, index_2 + 1)
    }
    else {
      slice = items.slice(index_2 + 1, index_1 + 1)
    }

    if (index_1 < index_2) {
      slice.reverse()
    }

    for (let it of slice) {
      if (!it.visible || it.selected) {
        continue
      }

      App.toggle_selected({item: it, select: true})
    }
  }

  App.scroll_to_item({item, scroll: `nearest`})
}

App.deselect = (args = {}) => {
  let def_args = {
    mode: App.window_mode,
    select: `none`,
    scroll: `nearest`,
  }

  App.def_args(def_args, args)
  let num = 0
  let first, last

  for (let item of App.selected_items(args.mode)) {
    App.toggle_selected({item, what: false, select: false})

    if (!first) {
      first = item
    }

    last = item
    num += 1
  }

  let next_item

  if (args.select === `up`) {
    if (first) {
      next_item = first
    }
  }
  else if (args.select === `down`) {
    if (last) {
      next_item = last
    }
  }
  else if (args.select === `selected`) {
    let selected = App.get_selected(args.mode)

    if (selected) {
      next_item = selected
    }
  }
  else if (args.select === `active`) {
    let active = App.get_active_tab_item()

    if (active && active.visible) {
      next_item = active
    }
    else {
      let selected = App.get_selected(args.mode)

      if (selected) {
        next_item = selected
      }
    }
  }

  if (next_item) {
    App.select_item({item: next_item, scroll: args.scroll, deselect: false})
  }

  return num
}

App.toggle_selected = (args = {}) => {
  let def_args = {
    select: true,
  }

  App.def_args(def_args, args)
  let items = App.selected_items(args.item.mode)
  let selected

  if (args.what !== undefined) {
    selected = args.what
  }
  else {
    selected = !args.item.selected
  }

  if (!args.item.visible) {
    selected = false
  }

  if (selected) {
    args.item.element.classList.add(`selected`)
    App.set_selected(args.item)
  }
  else {
    if ((items.length === 1) && args.select) {
      return
    }

    args.item.element.classList.remove(`selected`)
  }

  args.item.selected = selected

  if (args.select && !selected) {
    if (items.length && (App.get_selected(args.item.mode) === args.item)) {
      for (let it of items) {
        if (it === args.item) {
          continue
        }

        App.set_selected(it)
        break
      }
    }
  }

  App.update_footer_count()
  App.check_selected(args.item.mode)
}

App.check_selected = (mode) => {
  App.check_selected_debouncer.call(mode)
}

App.do_check_selected = (mode) => {
  App.check_selected_debouncer.cancel()
  let num = App.selected_items(mode).length
  let c = DOM.el(`#${mode}_container`)

  if (num > 1) {
    c.classList.remove(`single_selected`)
    c.classList.add(`multiple_selected`)
  }
  else {
    c.classList.add(`single_selected`)
    c.classList.remove(`multiple_selected`)
  }
}

App.selected_items = (mode = App.active_mode) => {
  return App.get_items(mode).filter(x => x.selected)
}

App.after_focus = (args = {}) => {
  let def_args = {
    method: `normal`,
    show_tabs: false,
  }

  App.def_args(def_args, args)

  if (args.method === `load`) {
    return
  }

  if (args.method === `normal`) {
    if (App.is_popup()) {
      if (App.get_setting(`close_on_focus`)) {
        App.close_window()
      }
    }
  }

  if (args.show_tabs) {
    if (App.active_mode !== `tabs`) {
      App.do_show_mode({mode: `tabs`})
    }
  }
}

App.after_open = (shift = false) => {
  if (shift) {
    return
  }

  if (App.is_popup()) {
    if (App.get_setting(`close_on_open`)) {
      App.close_window()
    }
  }
}

App.open_items = (item, shift, multiple = true) => {
  let mode = item.mode
  let items

  if (multiple) {
    items = App.get_active_items({mode, item})
  }
  else {
    items = [item]
  }

  if (items.length === 1) {
    if (items[0].type === `folder`) {
      App.travel_to_bookmarks_folder(items[0])
      return
    }

    App.open_tab(items[0])
    App.after_open(shift)
  }
  else {
    items = items.filter(x => !x.special)
    let force = App.check_warn(`warn_on_open`, items)

    App.show_confirm({
      message: `Open items ${items.length}?`,
      confirm_action: () => {
        for (let item of items) {
          App.open_tab(item)
        }

        App.deselect({mode, select: `selected`})
        App.after_open(shift)
      },
      cancel_action: () => {
        App.deselect({mode, select: `selected`})
      },
      force,
    })
  }
}

App.select_all = (mode = App.active_mode, toggle = false) => {
  let items = App.get_items(mode)

  if (toggle) {
    let all_selected = true

    for (let item of items) {
      if (item.visible && !item.selected) {
        all_selected = false
        break
      }
    }

    if (all_selected) {
      App.deselect_all(mode)
      return
    }
  }

  let first

  for (let item of items) {
    if (!item.visible) {
      continue
    }

    if (!first) {
      first = item
    }

    App.toggle_selected({item, what: true, select: false})
  }

  if (first) {
    App.set_selected(first)
  }
}

App.deselect_all = (mode) => {
  let filtered = App.is_filtered(mode)
  let select = `selected`

  if ((mode === `tabs`) && !filtered) {
    select = `active`
  }

  App.deselect({mode, select})
}

App.get_active_items = (args = {}) => {
  let def_args = {
    multiple: true,
    mode: args.active_mode,
  }

  App.def_args(def_args, args)

  if (!args.multiple) {
    if (args.item) {
      return [args.item]
    }

    return []
  }

  let selected = App.selected_items(args.mode)

  if (selected.length === 0) {
    if (args.item) {
      return [args.item]
    }

    return []
  }
  else if (selected.length === 1) {
    if (args.item) {
      return [args.item]
    }

    return [App.get_selected(args.mode)]
  }

  if (args.item && !selected.includes(args.item)) {
    selected.push(args.item)
  }

  return selected
}

App.insert_item = (mode, info) => {
  let item = App.process_info({mode, info})
  let container = DOM.el(`#${mode}_container`)

  if (mode === `tabs`) {
    App.get_items(mode).splice(info.index, 0, item)
    container.append(item.element)
    App.move_item_element(`tabs`, item.element, info.index)
    App.update_active_trace()
    App.update_tab_box()
  }
  else {
    let old = App.get_item_by_url(mode, item.url)

    if (old) {
      App.remove_item(old)
    }

    App.get_items(mode).unshift(item)
    container.prepend(item.element)
  }

  App.update_footer_count()
  App.check_filter(mode)
  return item
}

App.copy_url = (item) => {
  App.copy_to_clipboard(item.url, `URL`)
}

App.copy_title = (item) => {
  let title = App.title(item)
  App.copy_to_clipboard(title, `Title`)
}

App.on_items = (mode = App.window_mode, check_popups = false) => {
  let on_items = App.modes.includes(mode)

  if (on_items && check_popups) {
    on_items = !App.popup_open()
  }

  return on_items
}

App.get_next_item = (mode, args = {}) => {
  let def_args = {
    mode,
    wrap: false,
  }

  App.def_args(def_args, args)
  return App.get_other_item(args) || App.get_other_item(args, true)
}

App.multiple_selected = (mode) => {
  let n = 0

  for (let item of App.get_items(mode)) {
    if (item.selected) {
      n += 1

      if (n >= 2) {
        return true
      }
    }
  }

  return false
}

App.soft_copy_item = (o_item) => {
  let item = {}

  for (let key in o_item) {
    if (key === `element`) {
      continue
    }

    item[key] = o_item[key]
  }

  return item
}

App.remove_duplicates = (items) => {
  let objs = []
  let urls = []

  for (let item of items) {
    if (!urls.includes(item.url)) {
      objs.push(item)
      urls.push(item.url)
    }
  }

  return objs
}

App.pick = (item, check_auto_scroll = false) => {
  let was_selected = item.selected

  if (item.selected) {
    App.toggle_selected({item, what: false})
  }
  else {
    App.select_item({
      item,
      scroll: `nearest`,
      deselect: false,
      check_auto_scroll,
    })
  }

  return item.selected !== was_selected
}

App.get_persistent_items = () => {
  let items = []

  for (let mode of App.persistent_modes) {
    items.push(...App.get_items(mode))
  }

  return items
}

App.clear_show = async () => {
  App.clear_all_items()
  App.rebuild_items()
  App.show_main_mode()
  App.start_progressive_fill()
}

App.select_item_by_id = (mode, id) => {
  let item = App.get_item_by_id(mode, id)

  if (item) {
    App.select_item({item, scroll: `center`})
  }
}

App.item_is_visible = (item) => {
  let parent = item.element.parentElement

  if (!parent) {
    return false
  }

  let container_rect = parent.getBoundingClientRect()
  let rect = item.element.getBoundingClientRect()
  let top = container_rect.top

  if (App.get_setting(`show_scroller`)) {
    let scroller = DOM.el(`#${item.mode}_scroller`)

    if (!DOM.class(scroller, [`hidden`])) {
      top += scroller.clientHeight
    }
  }

  let extra = 2
  let top_visible = rect.top >= (top - extra)
  let bottom_visible = rect.bottom <= (container_rect.bottom + extra)
  return top_visible && bottom_visible
}

App.build_item_window = (mode) => {
  let top = DOM.el(`#window_top_${mode}`)
  top.innerHTML = ``
  let middle = DOM.el(`#window_middle_${mode}`)
  middle.innerHTML = ``
  let content = DOM.el(`#window_content_${mode}`)
  content.innerHTML = ``
  let main_top = DOM.create(`div`, `item_main_top`)
  top.append(main_top)
  let container_main = DOM.create(`div`, `item_container_main`)
  let container = DOM.create(`div`, `item_container`, `${mode}_container`)
  let fav_pos = App.get_setting(`favorites_position`)
  let favorites_bar, scroller

  if (App.favorites_bar_enabled()) {
    favorites_bar = App.create_favorites_bar(mode)
  }

  if (App.get_setting(`show_scroller`)) {
    scroller = App.create_scroller(mode)
  }

  container.tabIndex = 1
  let container_col = DOM.create(`div`, `item_container_col`)

  if (scroller) {
    container_col.append(scroller)
  }

  container_col.append(container)

  if (fav_pos === `left`) {
    container_main.append(favorites_bar)
  }

  container_main.append(container_col)

  if (fav_pos === `right`) {
    container_main.append(favorites_bar)
  }

  content.append(container_main)

  if (fav_pos === `bottom`) {
    content.append(favorites_bar)
  }

  let btns = DOM.create(`div`, `item_top_buttons`)
  let bar = DOM.create(`div`, `item_top_bar`, `item_top_bar_${mode}`)

  main_top.append(btns)
  main_top.append(bar)

  if (fav_pos === `top`) {
    middle.append(favorites_bar)
  }

  let main_button = App.create_main_button(mode)
  let filter = App.create_filter(mode)
  let filter_button = App.create_filter_button(mode)
  let playing = App.create_playing_button(mode)
  let back = App.create_step_back_button(mode)
  let actions_menu = App.create_actions_menu(mode)
  App.setup_item_drag(mode, container)
  let left_btns = DOM.create(`div`, `item_top_left`)
  let right_btns = DOM.create(`div`, `item_top_right`)
  left_btns.append(main_button)
  left_btns.append(filter_button)
  left_btns.append(filter)
  right_btns.append(playing)
  right_btns.append(back)
  App.check_main_title()
  App.check_main_title_date()

  if (actions_menu) {
    right_btns.append(actions_menu)
  }

  if (fav_pos === `button`) {
    let fav_button = App.create_favorites_button(mode)
    right_btns.append(fav_button)
  }

  btns.append(left_btns)
  btns.append(right_btns)
  App.check_clock(true)

  DOM.ev(container, `scroll`, () => {
    clearInterval(App.autoclick_timeout)
    App.check_scroller(mode)
  })

  DOM.ev(container, `wheel`, (e) => {
    e.preventDefault()
  })
}

App.rebuild_items = () => {
  for (let mode of App.modes) {
    if (App[`${mode}_ready`]) {
      App.windows[mode].clear()
      App.build_item_window(mode)
    }
  }
}

App.focus_items = (mode) => {
  DOM.el(`#${mode}_container`).focus()
}

App.make_item_first = (item) => {
  let c = DOM.el(`#${item.mode}_container`)
  let first = DOM.el(`.item`, c)

  if (item.element === first) {
    return
  }

  c.insertBefore(item.element, first)
  let items = App.get_items(item.mode)
  let index = items.indexOf(item)

  if (index > 0) {
    items.splice(index, 1)
    items.unshift(item)
  }
}

App.auto_blur = () => {
  if (App.get_setting(`auto_blur`)) {
    App.main_add(`auto_blur`)
  }
}

App.remove_auto_blur = () => {
  if (App.get_setting(`auto_blur`)) {
    App.main_remove(`auto_blur`)
  }
}

App.selected_visible = (mode = App.active_mode) => {
  let selected = App.get_selected(mode)

  if (selected) {
    if (App.item_is_visible(selected)) {
      return true
    }
  }

  return false
}

App.clear_blink_item = (item) => {
  clearInterval(item.blink_interval)
  item.blink_interval = undefined
  item.element.style.opacity = 1
}

// It's better to do this manually than dealing with CSS classes
App.blink_item = (item) => {
  for (let it of App.get_items(item.mode)) {
    if (it.blink_interval) {
      App.clear_blink_item(it)
    }
  }

  let opacity = 1
  let rounds = 0
  let max_rounds = 2
  let down = true
  let top = 1
  let bottom = 0.3
  let step = 0.05
  let delay = 22

  if (!delay || (delay < 1)) {
    App.error(`Blink delay is invalid`)
    return
  }

  let interval = setInterval(() => {
    item.element.style.opacity = opacity

    if (opacity >= top) {
      down = true

      if (rounds >= max_rounds) {
        item.blink_interval = undefined
        clearInterval(interval)
      }
    }
    else if (opacity <= bottom) {
      down = false
      rounds += 1
    }

    if (down) {
      opacity -= step
    }
    else {
      opacity += step
    }
  }, delay)

  item.blink_interval = interval
}

App.tooltip_modes = {
  full: (args) => {
    let tips = []
    tips.push(`Title: ${args.title}`)
    tips.push(`URL: ${args.url}`)

    if (args.item.last_visit) {
      tips.push(`Last Visit: ${App.nice_date(args.item.last_visit)}`)
    }

    if (args.item.date_added) {
      tips.push(`Date Added: ${App.nice_date(args.item.date_added)}`)
    }

    if (App.tagged(args.item)) {
      let tags = App.tags(args.item)
      tips.push(`Tags: ${tags.join(`, `)}`)
    }

    tips.push(App.mode_vars[args.item.mode].item_info)
    args.item.element.title = tips.join(`\n`)
  },
  simple: (args) => {
    let tips = []
    tips.push(`Title: ${args.title}`)
    tips.push(`URL: ${args.url}`)
    args.item.element.title = tips.join(`\n`)
  },
  minimal: (args) => {
    let tips = []
    tips.push(args.title)
    tips.push(args.url)
    args.item.element.title = tips.join(`\n`)
  },
  space: (args) => {
    let tips = []
    tips.push(args.title)
    tips.push(args.url)
    args.item.element.title = tips.join(`\n\n`)
  },
  angle: (args) => {
    let tips = []
    tips.push(args.title)
    tips.push(`<${args.url}>`)
    args.item.element.title = tips.join(`\n`)
  },
  brackets: (args) => {
    let tips = []
    tips.push(args.title)
    tips.push(`[${args.url}]`)
    args.item.element.title = tips.join(`\n`)
  },
  arrows: (args) => {
    let tips = []
    tips.push(args.title)
    tips.push(`>>${args.url}`)
    args.item.element.title = tips.join(`\n`)
  },
}

App.set_item_tooltips = (item) => {
  if (!App.tooltips()) {
    return
  }

  if (item.has_tooltips) {
    return
  }

  let title = item.tooltips_title || `No Title`
  let url = item.tooltips_url || `No URL`
  let t_mode = App.get_setting(`tooltips_mode`)
  App.tooltip_modes[t_mode]({item, title, url})

  if (App.get_setting(`icon_pick`)) {
    let icon_container = DOM.el(`.item_icon_container`, item.element)
    icon_container.title = `Click: Select Item\nRight Click: Single Select Item`
  }

  let close_btn = DOM.el(`.close_button`, item.element)

  if (close_btn) {
    close_btn.title = App.mode_vars[item.mode].close_button_info
  }

  let hover_btn = DOM.el(`.hover_button`, item.element)

  if (hover_btn) {
    hover_btn.title = App.mode_vars[item.mode].hover_button_info
  }

  item.has_tooltips = true
}

App.toggle_wrap_text = () => {
  let wrap = App.get_setting(`wrap_text`)
  App.set_setting({setting: `wrap_text`, value: !wrap})
  App.toggle_message(`Wrap Text`, `wrap_text`)
  App.set_item_vars()
}

App.hide_item_2 = (item) => {
  DOM.hide(item.element, 2)
  item.visible = false
}

App.show_item_2 = (item) => {
  DOM.show(item.element, 2)
  item.visible = true
}

App.toggle_auto_scroll = () => {
  let sett = App.get_setting(`auto_scroll`)
  App.set_setting({setting: `auto_scroll`, value: !sett})
  App.toggle_message(`Auto Scroll`, `auto_scroll`)
}

App.start_item_observer = (item) => {
  App.item_observer = new IntersectionObserver((entries) => {
    for (let entry of entries) {
      if (entry.isIntersecting) {
        let id = entry.target.dataset.id
        let item = App.get_item_by_id(App.active_mode, id)

        if (item) {
          App.create_item_element(item)
        }
      }
    }
  })
}

App.do_scroll_on_mouse_out = () => {
  if (App.scroll_on_mouse_out) {
    App.scroll_on_mouse_out()
    App.scroll_on_mouse_out = undefined
  }
}

App.start_progressive_fill = () => {
  clearTimeout(App.progressive_fill_timeout)
  let fill = App.get_setting(`fill_elements`)

  if (fill === `progressive`) {
    App.progressive_fill_timeout = setTimeout(() => {
      App.do_progressive_fill()
    }, App.progressive_fill_delay)
  }
}

App.do_progressive_fill = async () => {
  for (let item of App.get_items(`tabs`)) {
    if (item.element && !item.element_ready) {
      App.create_item_element(item)
      await App.sleep(App.progressive_fill_throttle)
    }
  }
}