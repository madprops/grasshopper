App.remove_selected_class = (mode) => {
  for (let el of DOM.els(`.selected`, DOM.el(`#${mode}_container`))) {
    el.classList.remove(`selected`)
  }
}

App.select_item = (args = {}) => {
  let def_args = {
    deselect: true,
    scroll: `center`,
  }

  App.def_args(def_args, args)

  if (!args.item) {
    return
  }

  let prev = App.get_selected(args.item.mode)

  if (args.deselect) {
    App.deselect(args.item.mode)
  }

  App.toggle_selected(args.item, true)

  if (prev) {
    App.scroll_to_item({item: args.item, scroll: args.scroll})
  }
  else {
    // Elements just got created
    // Give them time to render
    requestAnimationFrame(() => {
      App.scroll_to_item({item: args.item, scroll: args.scroll})
    })
  }
}

App.select_above = (mode) => {
  let item = App.get_other_item({mode: mode}, true)

  if (item) {
    App.select_item({item: item, scroll: `nearest`})
  }
}

App.select_below = (mode) => {
  let item = App.get_other_item({mode: mode})

  if (item) {
    App.select_item({item: item, scroll: `nearest`})
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
    else {
      if (item === current) {
        waypoint = true
      }
    }
  }
}

App.select_to_edge = (mode, dir) => {
  let items = App.get_items(mode).slice(0)

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
    no_discarded: false,
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

      if (args.no_discarded) {
        if (item.discarded) {
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

App.get_selected = (mode = App.window_mode) => {
  return App[`last_selected_${mode}`]
}

App.set_selected = (item) => {
  if (!item) {
    App.remove_selected_class(mode)
    return
  }

  App[`last_selected_${item.mode}`] = item
  App.update_footer_info(item)
}

App.clear_selected = (mode) => {
  App[`last_selected_${mode}`] = undefined

  for (let item of App.get_items(mode)) {
    if (item.selected) {
      App.toggle_selected(item, false, false)
    }
  }
}

App.get_items = (mode) => {
  let item_string = `${mode}_items`

  if (App[item_string]) {
    App[item_string] = App[item_string].filter(x => x !== undefined)
  }

  return App[item_string] || []
}

App.select_first_item = (mode, by_active = false, scroll = `nearest`) => {
  if (mode === `tabs` && by_active) {
    for (let item of App.get_items(mode)) {
      if (item.visible && item.active) {
        App.select_item({item: item, scroll: scroll})
        return
      }
    }
  }

  for (let item of App.get_items(mode)) {
    if (item.visible) {
      App.select_item({item: item})
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

  item.element.remove()
  item.removed = true
  App.filter_item_by_id(mode, item.id)
  App.update_footer_count(mode)

  if (mode === `tabs`) {
    App.refresh_active_history(true)
  }
}

App.show_item = (it) => {
  it.element.classList.remove(`hidden`)
  it.visible = true
}

App.hide_item = (it) => {
  it.element.classList.add(`hidden`)
  it.visible = false
}

App.clear_items = (mode) => {
  App[`${mode}_items`] = []
  let c = DOM.el(`#${mode}_container`)

  if (c) {
    DOM.el(`#${mode}_container`).innerHTML = ``
  }
}

App.clear_all_items = () => {
  for (let mode of App.modes) {
    App.clear_items(mode)
  }
}

App.check_item_icon = (item) => {
  if (App.get_setting(`item_icon`) !== `none`) {
    let container = DOM.el(`.item_icon_container`, item.element)
    container.innerHTML = ``
    let icon

    if (item.favicon) {
      icon = App.get_favicon(item)
    }
    else if (App.get_setting(`generate_icons`)) {
      icon = App.get_jdenticon(item.hostname)
    }

    if (icon) {
      container.append(icon)
      container.classList.remove(`hidden`)
    }
    else {
      container.classList.add(`hidden`)
    }
  }
}

App.check_item_status = (item) => {
  if (item.mode !== `tabs`) {
    return
  }

  if (App.get_setting(`pin_icon`)) {
    let icon = DOM.el(`.pin_icon`, item.element)

    if (item.pinned) {
      icon.classList.remove(`hidden`)
    }
    else {
      icon.classList.add(`hidden`)
    }
  }

  if (App.get_setting(`normal_icon`)) {
    let icon = DOM.el(`.normal_icon`, item.element)

    if (!item.pinned) {
      icon.classList.remove(`hidden`)
    }
    else {
      icon.classList.add(`hidden`)
    }
  }

  if (App.get_setting(`loaded_icon`)) {
    let icon = DOM.el(`.loaded_icon`, item.element)

    if (!item.discarded) {
      icon.classList.remove(`hidden`)
    }
    else {
      icon.classList.add(`hidden`)
    }
  }

  if (App.get_setting(`unloaded_icon`)) {
    let icon = DOM.el(`.unloaded_icon`, item.element)

    if (item.discarded) {
      icon.classList.remove(`hidden`)
    }
    else {
      icon.classList.add(`hidden`)
    }
  }

  if (App.get_setting(`playing_icon`)) {
    let icon = DOM.el(`.playing_icon`, item.element)

    if (item.audible && !item.muted) {
      icon.classList.remove(`hidden`)
    }
    else {
      icon.classList.add(`hidden`)
    }
  }

  if (App.get_setting(`muted_icon`)) {
    let icon = DOM.el(`.muted_icon`, item.element)

    if (item.muted) {
      icon.classList.remove(`hidden`)
    }
    else {
      icon.classList.add(`hidden`)
    }
  }

  if (App.get_setting(`unread_icon`)) {
    let icon = DOM.el(`.unread_icon`, item.element)

    if (item.unread) {
      icon.classList.remove(`hidden`)
    }
    else {
      icon.classList.add(`hidden`)
    }
  }

  if (App.get_setting(`titled_icon`)) {
    let icon = DOM.el(`.titled_icon`, item.element)

    if (item.custom_title || item.rule_title) {
      icon.classList.remove(`hidden`)
    }
    else {
      icon.classList.add(`hidden`)
    }
  }

  if (App.get_setting(`tagged_icon`)) {
    let icon = DOM.el(`.tagged_icon`, item.element)

    if (App.tab_has_tags(item)) {
      icon.classList.remove(`hidden`)
    }
    else {
      icon.classList.add(`hidden`)
    }
  }

  if (App.get_setting(`edited_icon`)) {
    let icon = DOM.el(`.edited_icon`, item.element)

    if (App.tab_is_edited(item)) {
      icon.classList.remove(`hidden`)
    }
    else {
      icon.classList.add(`hidden`)
    }
  }

  App.check_text_color(item)
}

App.check_text_color = (item) => {
  function enabled (type) {
    return App.get_setting(`color_${type}_enabled`)
  }

  item.element.classList.remove(`pinned_tab`)
  item.element.classList.remove(`normal_tab`)
  item.element.classList.remove(`loaded_tab`)
  item.element.classList.remove(`unloaded_tab`)
  item.element.classList.remove(`playing_tab`)
  item.element.classList.remove(`unread_tab`)

  if (false) {
    // Easy ordering
  }
  else if (enabled(`playing`) && item.audible) {
    item.element.classList.add(`playing_tab`)
  }
  else if (enabled(`unloaded`) && item.discarded) {
    item.element.classList.add(`unloaded_tab`)
  }
  else if (enabled(`unread`) && item.unread) {
    item.element.classList.add(`unread_tab`)
  }
  else if (enabled(`pins`) && item.pinned) {
    item.element.classList.add(`pinned_tab`)
  }
  else if (enabled(`normal`) && !item.pinned) {
    item.element.classList.add(`normal_tab`)
  }
}

App.check_view_media = (item) => {
  let type = App.get_media_type(item)
  let view_media = DOM.el(`.view_media_button`, item.element)
  let icon

  if (type) {
    icon = App.get_setting(`${type}_icon`)
  }

  if (icon) {
    view_media.textContent = icon
    view_media.title = App.capitalize(type)
    view_media.classList.remove(`hidden`)

    if (App.get_setting(`view_${type}_${item.mode}`) !== `never`) {
      view_media.classList.add(`action`)
    }
    else {
      view_media.classList.remove(`action`)
    }
  }
  else {
    view_media.classList.add(`hidden`)
  }
}

App.apply_color_mode = (item) => {
  let color_mode = App.get_setting(`color_mode`)
  let color = item.custom_color || item.rule_color

  if (color_mode.includes(`icon`)) {
    let el = DOM.el(`.item_info_color`, item.element)

    if (color) {
      el.innerHTML = ``
      el.append(App.color_icon(color))
      el.classList.remove(`hidden`)

      if (color_mode.includes(`icon_2`)) {
        item.element.classList.add(`color_only_icon`)
      }
      else {
        item.element.classList.remove(`color_only_icon`)
      }
    }
    else {
      el.textContent = ``
      el.classList.add(`hidden`)
    }
  }

  if (color_mode.includes(`border`)) {
    for (let color of App.colors) {
      item.element.classList.remove(`colored`)
      item.element.classList.remove(`border_${color}`)
    }

    if (color) {
      item.element.classList.add(`colored`)
      item.element.classList.add(`border_${color}`)
    }
  }

  if (color_mode === `background`) {
    for (let color of App.colors) {
      item.element.classList.remove(`colored`)
      item.element.classList.remove(`colored_background`)
      item.element.classList.remove(`background_${color}`)
    }

    if (color) {
      item.element.classList.add(`colored`)
      item.element.classList.add(`colored_background`)
      item.element.classList.add(`background_${color}`)
    }
  }
}

App.add_close_button = (item, side) => {
  let close_button = App.get_setting(`close_button`)

  if (close_button === `none`) {
    return
  }

  if (item.mode === `tabs`) {
    if (side !== close_button) {
      return
    }

    let hover_side = App.get_setting(`hover_button`)

    if (side === hover_side) {
      return
    }

    let close = DOM.create(`div`, `close_icon item_node action`)
    close.textContent = App.close_tab_icon
    item.element.append(close)
  }
}

App.refresh_item_element = (item) => {
  App.check_item_icon(item)
  App.check_item_status(item)
  App.check_view_media(item)
  App.set_item_text(item)
  App.apply_color_mode(item)
  App.check_taglist(item)
}

App.create_item_element = (item) => {
  item.element = DOM.create(`div`, `grasshopper_item item ${item.mode}_item`)
  item.element.dataset.id = item.id
  App.add_close_button(item, `left`)
  let trace = DOM.create(`div`, `item_trace item_node`)
  item.element.append(trace)

  if (App.get_setting(`item_icon`) !== `none`) {
    let icon_container = DOM.create(`div`, `item_icon_container item_node`)
    item.element.append(icon_container)
    App.check_item_icon(item)
  }

  let color_icon = DOM.create(`div`, `item_info_color item_node hidden`)
  item.element.append(color_icon)
  App.apply_color_mode(item)

  if (item.mode === `tabs`) {
    if (App.get_setting(`pin_icon`)) {
      let icon = DOM.create(`div`, `pin_icon item_node hidden`)
      icon.textContent = App.get_setting(`pin_icon`)
      item.element.append(icon)
    }

    if (App.get_setting(`normal_icon`)) {
      let icon = DOM.create(`div`, `normal_icon item_node hidden`)
      icon.textContent = App.get_setting(`normal_icon`)
      item.element.append(icon)
    }

    if (App.get_setting(`loaded_icon`)) {
      let icon = DOM.create(`div`, `loaded_icon item_node hidden`)
      icon.textContent = App.get_setting(`loaded_icon`)
      item.element.append(icon)
    }

    if (App.get_setting(`unloaded_icon`)) {
      let icon = DOM.create(`div`, `unloaded_icon item_node hidden`)
      icon.textContent = App.get_setting(`unloaded_icon`)
      item.element.append(icon)
    }

    let cls = ``

    if (App.get_setting(`mute_click`)) {
      cls += ` action`
    }

    if (App.get_setting(`playing_icon`)) {
      let icon = DOM.create(`div`, `playing_icon item_node hidden${cls}`)
      icon.textContent = App.get_setting(`playing_icon`)
      item.element.append(icon)
    }

    if (App.get_setting(`muted_icon`)) {
      let icon = DOM.create(`div`, `muted_icon item_node hidden${cls}`)
      icon.textContent = App.get_setting(`muted_icon`)
      item.element.append(icon)
    }

    if (App.get_setting(`unread_icon`)) {
      let icon = DOM.create(`div`, `unread_icon item_node hidden`)
      icon.textContent = App.get_setting(`unread_icon`)
      item.element.append(icon)
    }

    if (App.get_setting(`titled_icon`)) {
      let icon = DOM.create(`div`, `titled_icon item_node hidden`)
      icon.textContent = App.get_setting(`titled_icon`)
      item.element.append(icon)
    }

    if (App.get_setting(`tagged_icon`)) {
      let icon = DOM.create(`div`, `tagged_icon item_node hidden`)
      icon.textContent = App.get_setting(`tagged_icon`)
      item.element.append(icon)
    }

    if (App.get_setting(`edited_icon`)) {
      let icon = DOM.create(`div`, `edited_icon item_node hidden`)
      icon.textContent = App.get_setting(`edited_icon`)
      item.element.append(icon)
    }

    if (App.get_setting(`hover_button`) !== `none`) {
      let btn = DOM.create(`div`, `hover_button`)
      btn.textContent = App.command_icon
      btn.title = `Hover Button`
      item.element.append(btn)
    }

    let view_media = DOM.create(`div`, `view_media_button hidden`)
    item.element.append(view_media)
    item.element.draggable = true
    App.check_item_status(item)
    App.check_view_media(item)
  }

  let content = DOM.create(`div`, `item_content`)
  let text = DOM.create(`div`, `item_text`)
  let text_1 = DOM.create(`div`, `item_text_1`)
  let text_2 = DOM.create(`div`, `item_text_2 hidden`)
  let taglist

  if (App.get_setting(`taglist`) !== `none`) {
    taglist = App.create_taglist()
  }

  text.append(text_1)
  text.append(text_2)
  content.append(text)

  if (taglist) {
    content.append(taglist)
  }

  item.element.append(content)
  App.set_item_text(item)
  App.check_taglist(item)

  if (item.mode === `tabs`) {
    App.add_close_button(item, `right`)
  }

  if (item.selected) {
    item.element.classList.add(`selected`)
  }
  else {
    item.element.classList.remove(`selected`)
  }
}

App.get_text_icon = (icon_text) => {
  let icon = DOM.create(`div`, `item_icon`)
  icon.textContent = icon_text
  return icon
}

App.get_favicon = (item) => {
  let icon = DOM.create(`img`, `item_icon`)
  icon.loading = `lazy`

  DOM.ev(icon, `error`, () => {
    if (App.get_setting(`generate_icons`)) {
      let icon_2 = App.get_jdenticon(item.hostname)
      icon.replaceWith(icon_2)
    }
  })

  icon.src = item.favicon
  return icon
}

App.get_jdenticon = (hostname) => {
  let icon = DOM.create(`canvas`, `item_icon`)
  icon.width = App.icon_size
  icon.height = App.icon_size
  jdenticon.update(icon, hostname || `hostname`)
  return icon
}

App.set_item_text = (item) => {
  let content
  let path = decodeURI(item.path)
  let text_mode = App.get_setting(`text_mode`)
  let title = App.get_title(item)

  if (text_mode === `title`) {
    content = title || path
    item.footer = path || title
  }
  else if (text_mode === `url`) {
    content = path || title
    item.footer = title || path
  }
  else if (text_mode === `title_url`) {
    content = title

    if (content) {
      content += `\n`
    }

    content += path
    item.footer = path || title
  }
  else if (text_mode === `url_title`) {
    content = path

    if (content) {
      content += `\n`
    }

    content += title
    item.footer = title || path
  }

  if (App.get_setting(`show_tooltips`)) {
    if (content === item.footer || text_mode.includes(`_`)) {
      item.element.title = content
    }
    else {
      item.element.title = `${content}\n${item.footer}`
    }

    if (item.last_visit) {
      item.element.title += `\nLast Visit: ${App.nice_date(item.last_visit)}`
    }

    if (item.date_added) {
      item.element.title += `\nDate Added: ${App.nice_date(item.date_added)}`
    }

    if (App.tab_has_tags(item)) {
      let tags = App.get_tags(item)
      item.element.title += `\nTags: ${tags.join(`, `)}`
    }
  }

  content = content || `Empty`
  let lines = content.split(`\n`)

  for (let [i, line] of lines.entries()) {
    let text = line.substring(0, App.max_text_length).trim()
    let text_el = DOM.el(`.item_text_${i + 1}`, item.element)
    text_el.classList.remove(`hidden`)
    text_el.textContent = text
  }
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

  args.setup = () => {
    App.build_item_window(mode)
  }
  args.after_show = () => {
    App.fill_favorites_bar(mode)
  }

  App.create_window(args)
}

App.focus_or_open_item = async (item) => {
  for (let tab of App.get_items(`tabs`)) {
    if (App.urls_equal(tab.url, item.url)) {
      await App.focus_tab({item: tab})
      return `focused`
    }
  }

  App.open_tab(item)
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

App.update_item = (mode, id, info) => {
  for (let item of App.get_items(mode)) {
    if (item.id === id) {
      App.process_info({mode: mode, info: info, o_item: item})
      App.check_filter(mode)
      App.refresh_active_history(true)
      break
    }
  }
}

App.get_item_element_index = (mode, el) => {
  return DOM.els(`.${mode}_item`).indexOf(el)
}

App.move_item = (mode, from_index, to_index) => {
  let item = App.get_items(mode).splice(from_index, 1)[0]
  App.get_items(mode).splice(to_index, 0, item)
  App.move_item_element(mode, item.element, to_index)

  if (App.get_selected(mode) === item) {
    App.scroll_to_item({item: App.get_selected(mode), scroll: `center`})
  }
}

App.move_item_element = (mode, el, to_index) => {
  let container = DOM.el(`#${mode}_container`)
  let items = DOM.els(`.${mode}_item`)
  let from_index = items.indexOf(el)

  if (from_index === to_index) {
    return
  }

  if (to_index === 0) {
    container.prepend(el)
  }
  else {
    if (from_index < to_index) {
      container.insertBefore(el, items[to_index + 1])
    }
    else {
      container.insertBefore(el, items[to_index])
    }
  }
}

App.select_range = (item) => {
  let selected = App.get_selected(item.mode)

  if (item === selected) {
    App.select_item({item: item, scroll: `nearest`})
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
      else {
        if (i < index_1) {
          unselect = true
        }
      }

      if (unselect) {
        App.toggle_selected(it, false)
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

      App.toggle_selected(it, true)
    }
  }

  App.scroll_to_item({item: item, scroll: `nearest`})
}

App.deselect = (mode = App.window_mode, select = `none`) => {
  let num = 0
  let first, last

  for (let item of App.selected_items(mode)) {
    App.toggle_selected(item, false, false)

    if (!first) {
      first = item
    }

    last = item
    num += 1
  }

  let next_item

  if (select === `up`) {
    if (first) {
      next_item = first
    }
  }
  else if (select === `down`) {
    if (last) {
      next_item = last
    }
  }
  else if (select === `selected`) {
    let selected = App.get_selected(mode)

    if (selected) {
      next_item = selected
    }
  }

  if (next_item) {
    App.select_item({item: next_item, scroll: `nearest`, deselect: false})
  }

  return num
}

App.toggle_selected = (item, what, select = true) => {
  let items = App.selected_items(item.mode)
  let selected

  if (what !== undefined) {
    selected = what
  }
  else {
    selected = !item.selected
  }

  if (!item.visible) {
    selected = false
  }

  if (selected) {
    item.element.classList.add(`selected`)
    App.set_selected(item)
  }
  else {
    if (items.length === 1 && select) {
      return
    }

    item.element.classList.remove(`selected`)
  }

  item.selected = selected

  if (select && !selected) {
    if (items.length && App.get_selected(item.mode) === item) {
      for (let it of items) {
        if (it === item) {
          continue
        }

        App.set_selected(it)
        break
      }
    }
  }

  App.update_footer_count(item.mode)
}

App.selected_items = (mode = App.window_mode) => {
  return App.get_items(mode).filter(x => x.selected)
}

App.after_focus = (args = {}) => {
  let def_args = {
    method: `normal`,
  }

  App.def_args(def_args, args)

  if (args.method === `load`) {
    return
  }

  if (args.method === `normal`) {
    if (App.get_setting(`close_on_focus`)) {
      App.close_window()
    }
  }

  if (args.show_tabs) {
    if (App.active_mode !== `tabs`) {
      App.do_show_mode({mode: `tabs`})
    }
  }

  App.check_restore()
}

App.after_open = (shift = false) => {
  if (shift) {
    return
  }

  if (App.get_setting(`close_on_open`)) {
    App.close_window()
  }

  App.check_restore()
}

App.open_items = (item, shift, multiple = true) => {
  let mode = item.mode
  let items

  if (multiple) {
    items = App.get_active_items({mode: mode, item: item})
  }
  else {
    items = [item]
  }

  if (items.length === 1) {
    App.open_tab(items[0])
    App.after_open(shift)
  }
  else {
    let force = App.check_force(`warn_on_open`, items)

    App.show_confirm({
      message: `Open these items ${items.length}?`,
      confirm_action: () => {
        for (let item of items) {
          App.open_tab(item)
        }

        App.deselect(mode, `selected`)
        App.after_open(shift)
      },
      cancel_action: () => {
        App.deselect(mode, `selected`)
      },
      force: force,
    })
  }
}

App.goto_top = (mode = App.window_mode, select = false) => {
  if (select) {
    App.select_item({item: App.get_visible(mode).at(0), scroll: `nearest`})
  }
  else {
    let el = DOM.el(`#${mode}_container`)

    el.scrollTo({
      top: 0,
      behavior: `instant`,
    })
  }

  App.do_check_scroller(mode)
}

App.goto_bottom = (mode = App.window_mode, select = false) => {
  if (select) {
    App.select_item({item: App.get_visible(mode).at(-1), scroll: `nearest`})
  }
  else {
    let el = DOM.el(`#${mode}_container`)

    el.scrollTo({
      top: el.scrollHeight,
      behavior: `instant`,
    })
  }

  App.do_check_scroller(mode)
}

App.select_all = (mode = App.window_mode, toggle = false) => {
  let items = App.get_items(mode)

  if (toggle) {
    let all_selected = true

    for (let item of items) {
      if (!item.selected) {
        all_selected = false
        break
      }
    }

    if (all_selected) {
      App.deselect(mode, `selected`)
      return
    }
  }

  let first

  for (let item of items) {
    if (!first) {
      first = item
    }

    App.toggle_selected(item, true, false)
  }

  if (first) {
    App.set_selected(first)
  }
}

App.create_icon = (name, type = 1) => {
  let icon = document.createElementNS(`http://www.w3.org/2000/svg`, `svg`)
  icon.classList.add(`icon_${type}`)
  let icon_use = document.createElementNS(`http://www.w3.org/2000/svg`, `use`)
  icon_use.href.baseVal = `#${name}_icon`
  icon.append(icon_use)
  return icon
}

App.get_active_items = (args = {}) => {
  let def_args = {
    multiple: true,
  }

  App.def_args(def_args, args)

  if (!args.multiple) {
    if (args.item) {
      return [args.item]
    }
    else {
      return []
    }
  }

  let selected = App.selected_items(args.mode)

  if (selected.length === 0) {
    if (args.item) {
      return [args.item]
    }
    else {
      return []
    }
  }
  else if (selected.length === 1) {
    if (args.item) {
      return [args.item]
    }
    else {
      return [App.get_selected(args.mode)]
    }
  }
  else {
    if (args.item && !selected.includes(args.item)) {
      selected.push(args.item)
    }

    return selected
  }
}

App.insert_item = (mode, info) => {
  let item = App.process_info({mode: mode, info: info})
  let container = DOM.el(`#${mode}_container`)

  if (mode === `tabs`) {
    App.get_items(mode).splice(info.index, 0, item)
    container.append(item.element)
    App.move_item_element(`tabs`, item.element, info.index)
  }
  else {
    let old = App.get_item_by_url(mode, item.url)

    if (old) {
      App.remove_item(old)
    }

    App.get_items(mode).unshift(item)
    container.prepend(item.element)
  }

  App.update_footer_count(mode)
  App.check_filter(mode)
  return item
}

App.copy_url = (item) => {
  App.copy_to_clipboard(item.url, `URL`)
}

App.copy_title = (item) => {
  let title = App.get_title(item)
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
    mode: mode,
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

App.get_title = (item) => {
  let title = item.custom_title || item.rule_title || item.title

  if (App.get_setting(`all_caps`)) {
    title = title.toUpperCase()
  }

  return title
}

App.get_tags = (item) => {
  return item.custom_tags || item.rule_tags
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

App.pick = (item) => {
  if (item.selected) {
    App.toggle_selected(item, false)
  }
  else {
    App.select_item({item: item, scroll: `nearest`, deselect: false})
  }
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
  App.clear_active_history()
  App.show_primary_mode()
}

App.select_item_by_id = (mode, id) => {
  let item = App.get_item_by_id(mode, id)

  if (item) {
    App.select_item({item: item, scroll: `center`})
  }
}

App.item_is_visible = (item) => {
  let container_rect = item.element.parentElement.getBoundingClientRect()
  let rect = item.element.getBoundingClientRect()
  let scroller = DOM.el(`#${item.mode}_scroller`)
  let top = container_rect.top

  if (!scroller.classList.contains(`hidden`)) {
    top += scroller.clientHeight
  }

  let extra = 2
  let top_visible = rect.top >= (top - extra)
  let bottom_visible = rect.bottom <= (container_rect.bottom + extra)
  return top_visible && bottom_visible
}

App.build_item_window = (mode) => {
  let top = DOM.el(`#window_top_${mode}`)
  let maintop = DOM.create(`div`, `item_main_top`)
  top.append(maintop)
  let content = DOM.el(`#window_content_${mode}`)
  let container = DOM.create(`div`, `item_container`, `${mode}_container`)
  content.append(container)
  let tab_box_pos = App.get_setting(`tab_box_position`)
  let tab_box

  if (mode === `tabs`) {
    if (App.get_setting(`tab_box`) !== `none`) {
      tab_box = App.create_tab_box()
    }
  }

  let btns = DOM.create(`div`, `item_top_buttons`)
  let bar = DOM.create(`div`, `item_top_bar hidden`, `item_top_bar_${mode}`)
  maintop.append(btns)
  maintop.append(bar)

  if (tab_box && tab_box_pos === `top`) {
    maintop.append(tab_box)
  }

  let favmode = App.get_setting(`favorites_mode`)

  if (favmode === `bar`) {
    let favorites = App.create_favorites_bar(mode)
    bar.append(favorites)
  }

  let scroller, footer

  if (App.get_setting(`show_scroller`)) {
    scroller = App.create_scroller(mode)
  }

  if (App.get_setting(`show_footer`)) {
    footer = App.create_footer(mode)
  }

  if (scroller) {
    content.append(scroller)
  }

  content.append(container)

  if (tab_box && tab_box_pos === `bottom`) {
    content.append(tab_box)
  }

  if (footer) {
    content.append(footer)
  }

  App.setup_window_mouse(mode)
  let main_menu = App.create_main_menu(mode)
  let filter = App.create_filter(mode)
  let filter_menu = App.create_filter_menu(mode)
  let playing = App.create_playing_icon(mode)
  let back = App.create_step_back_button(mode)
  let actions_menu = App.create_actions_menu(mode)
  App.setup_drag(mode, container)
  let left_btns = DOM.create(`div`, `item_top_left`)
  let right_btns = DOM.create(`div`, `item_top_right`)
  left_btns.append(main_menu)
  left_btns.append(filter_menu)
  left_btns.append(filter)
  right_btns.append(playing)
  right_btns.append(back)

  if (actions_menu) {
    right_btns.append(actions_menu)
  }

  if (favmode === `button`) {
    let fav_button = App.create_favorites_button(mode)
    right_btns.append(fav_button)
  }

  btns.append(left_btns)
  btns.append(right_btns)

  DOM.ev(container, `scroll`, () => {
    App.check_scroller(mode)
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