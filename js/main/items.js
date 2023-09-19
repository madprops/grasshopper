App.remove_selected_class = (mode) => {
  for (let el of DOM.els(`.selected`, DOM.el(`#${mode}_container`))) {
    el.classList.remove(`selected`)
  }
}

App.select_item = (args) => {
  let def_args = {
    deselect: true,
  }

  args = Object.assign(def_args, args)

  if (!args.item) {
    return
  }

  let prev = App.get_selected(args.item.mode)

  if (args.deselect) {
    App.deselect(args.item.mode)
  }

  App.toggle_selected(args.item, true)

  if (prev) {
    App.scroll_to_item(args.item, args.scroll)
  }
  else {
    // Elements just got created
    // Give them time to render
    requestAnimationFrame(() => {
      App.scroll_to_item(args.item, args.scroll)
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

App.get_other_item = (args, reverse = false) => {
  let def_args = {
    only_visible: true,
    no_selected: false,
    no_discarded: false,
    wrap: true,
  }

  args = Object.assign(def_args, args)
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
      App.select_item({item: next_item})
    }
  }

  item.element.remove()
  App.filter_item_by_id(mode, item.id)
  App.update_footer_count(mode)
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

App.process_info_list = (mode, info_list) => {
  let container = DOM.el(`#${mode}_container`)
  App[`${mode}_idx`] = 0

  if (!App.persistent_modes.includes(mode)) {
    App.clear_items(mode)
  }

  let items = App.get_items(mode)
  let exclude = []

  for (let info of info_list) {
    let item = App.process_info({mode: mode, info: info, exclude: exclude})

    if (!item) {
      continue
    }

    if (mode !== `tabs`) {
      exclude.push(item.url)
    }

    items.push(item)
    container.append(item.element)
  }

  App.check_playing(mode)
  App.update_footer_count(mode)
  App.do_check_pinline()
  App.check_new_tabs()
}

App.process_info = (args) => {
  let def_args = {
    exclude: [],
  }

  args = Object.assign(def_args, args)

  if (!args.info) {
    return false
  }

  if (args.o_item) {
    args.info = Object.assign({}, args.o_item.original_data, args.info)
    args.o_item.original_data = args.info
  }

  if (args.info.url) {
    try {
      // Check if valid URL
      decodeURI(args.info.url)
    }
    catch (err) {
      return false
    }
  }

  let url = App.format_url(args.info.url || ``)

  if (args.exclude.includes(url)) {
    return false
  }

  let path = App.remove_protocol(url)
  let protocol = App.get_protocol(url)
  let hostname = App.get_hostname(url)
  let title = args.info.title || ``
  let image = App.is_image(url)
  let video = App.is_video(url)
  let audio = App.is_audio(url)
  let profile = App.get_profile(url)
  let has_profile = false
  let custom_title = ``
  let color = ``
  let tags = []
  let icon = ``

  if (profile) {
    has_profile = true

    if (profile.title.value) {
      custom_title = profile.title.value
    }

    if (profile.color.value !== `none`) {
      color = profile.color.value
    }

    if (profile.tags.value.length) {
      tags = profile.tags.value.map(x => x.value)
    }

    if (profile.icon.value) {
      icon = profile.icon.value
    }
  }

  let item = {
    title: title,
    custom_title: custom_title,
    url: url,
    path: path,
    protocol: protocol,
    hostname: hostname,
    favicon: args.info.favIconUrl,
    icon: icon,
    mode: args.mode,
    window_id: args.info.windowId,
    session_id: args.info.sessionId,
    image: image,
    video: video,
    audio: audio,
    has_profile: has_profile,
    tags: tags,
    color: color,
    is_item: true,
  }

  if (args.mode === `tabs`) {
    item.active = args.info.active
    item.pinned = args.info.pinned
    item.audible = args.info.audible
    item.muted = args.info.mutedInfo.muted
    item.discarded = args.info.discarded
    item.last_accessed = args.info.lastAccessed
  }
  else if (args.mode === `history`) {
    item.last_visit = args.info.lastVisitTime
  }
  else if (args.mode === `bookmarks`) {
    item.parent_id = args.info.parentId
    item.date_added = args.info.dateAdded
  }

  if (args.o_item) {
    args.o_item = Object.assign(args.o_item, item)
    App.refresh_item_element(args.o_item)

    if (App.get_selected(args.mode) === args.o_item) {
      App.update_footer_info(args.o_item)
    }
  }
  else {
    item.original_data = args.info
    item.id = args.info.id || App[`${args.mode}_idx`]
    item.visible = true
    item.selected = false
    App.create_item_element(item)
    App[`${args.mode}_idx`] += 1
    return item
  }
}

App.check_item_icon = (item) => {
  if (App.get_setting(`show_icons`)) {
    let container = DOM.el(`.item_icon_container`, item.element)
    container.innerHTML = ``
    let icon

    if (item.icon) {
      icon = App.get_text_icon(item.icon)
    }
    else if (item.favicon) {
      icon = App.get_favicon(item)
    }
    else {
      icon = App.get_jdenticon(item.hostname)
    }

    container.append(icon)
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
  let color = item.color

  if (color_mode.includes(`icon`)) {
    let el = DOM.el(`.item_info_color`, item.element)

    if (color) {
      el.innerHTML = App.color_icon(color)
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
}

App.refresh_item_element = (item) => {
  App.check_tab_item(item)
  App.check_item_icon(item)
  App.check_view_media(item)
  App.set_item_text(item)
  App.apply_color_mode(item)
}

App.create_item_element = (item) => {
  item.element = DOM.create(`div`, `grasshopper_item item ${item.mode}_item`)
  item.element.dataset.id = item.id

  if (App.get_setting(`show_icons`)) {
    let icon_container = DOM.create(`div`, `item_icon_container`)
    item.element.append(icon_container)
    App.check_item_icon(item)
  }

  let color_icon = DOM.create(`div`, `item_info_color hidden`)
  item.element.append(color_icon)
  App.apply_color_mode(item)
  let view_media = DOM.create(`div`, `view_media_button hidden`)
  item.element.append(view_media)
  App.check_view_media(item)
  let status = DOM.create(`div`, `item_status hidden`)
  item.element.append(status)
  let text = DOM.create(`div`, `item_text`)
  let text_1 = DOM.create(`div`, `item_text_1`)
  let text_2 = DOM.create(`div`, `item_text_2 hidden`)
  text.append(text_1)
  text.append(text_2)
  item.element.append(text)
  App.set_item_text(item)

  if (item.mode === `tabs`) {
    item.element.draggable = true

    if (App.get_setting(`pin_icon`)) {
      let pin_icon = DOM.create(`div`, `item_info item_info_pin`)
      pin_icon.textContent = App.get_setting(`pin_icon`)
      item.element.append(pin_icon)
    }

    if (App.get_setting(`normal_icon`)) {
      let normal_icon = DOM.create(`div`, `item_info item_info_normal`)
      normal_icon.textContent = App.get_setting(`normal_icon`)
      item.element.append(normal_icon)
    }

    App.check_tab_item(item)
  }

  if (item.selected) {
    item.element.classList.add(`selected`)
  }
  else {
    item.element.classList.remove(`selected`)
  }

  if (item.mode === `tabs`) {
    if (App.get_setting(`close_icon`)) {
      let btn = DOM.create(`div`, `item_button item_button_right item_button_close`)
      btn.textContent = App.get_setting(`close_icon`)
      btn.title = `Close`
      btn.draggable = true
      item.element.append(btn)
    }
  }
  else {
    if (App.get_setting(`open_icon`)) {
      let btn = DOM.create(`div`, `item_button item_button_right item_button_open`)
      btn.textContent = App.get_setting(`open_icon`)
      btn.title = `Open`
      btn.draggable = true
      item.element.append(btn)
    }
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
  icon.width = App.icon_size
  icon.height = App.icon_size

  DOM.ev(icon, `error`, () => {
    let icon_2 = App.get_jdenticon(item.hostname)
    icon.replaceWith(icon_2)
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
  if (item.mode === `tabs`) {
    let icons = []

    if (item.discarded && App.get_setting(`unloaded_icon`)) {
      icons.push(`unloaded`)
    }

    if (!item.muted && item.audible && App.get_setting(`playing_icon`)) {
      icons.push(`playing`)
    }

    if (item.muted && App.get_setting(`muted_icon`)) {
      icons.push(`muted`)
    }

    let status = DOM.el(`.item_status`, item.element)
    status.innerHTML = ``

    if (icons.length) {
      for (let icon of icons) {
        let cls = ``

        if (icon === `playing` || icon === `muted`) {
          if (App.get_setting(`mute_click`)) {
            cls = ` action`
          }
        }

        let el = DOM.create(`div`, `item_status_icon item_status_${icon}${cls}`)
        el.textContent = App.get_setting(`${icon}_icon`)
        status.append(el)
      }

      status.classList.remove(`hidden`)
    }
    else {
      status.classList.add(`hidden`)
    }
  }

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
  let args = {}
  args.id = mode
  args.close_button = false
  args.align_top = `left`

  args.setup = () => {
    let win = DOM.el(`#window_content_${mode}`)
    let footer = App.create_footer(mode)
    DOM.el(`#window_${mode}`).append(footer)
    let top = DOM.create(`div`, `item_top_container`, `${mode}_top_container`)
    DOM.el(`#window_top_${mode}`).append(top)
    let container = DOM.create(`div`, `container`, `${mode}_container`)
    let scroller = App.create_scroller(mode)

    DOM.ev(container, `scroll`, () => {
      App.check_scroller(mode)
    })

    win.append(scroller)
    win.append(container)
    App.setup_window_mouse(mode)
    let main_menu = App.create_main_menu(mode)
    let filter = App.create_filter(mode)
    let filter_modes = App.create_filter_menu(mode)
    let playing = App.create_playing_icon(mode)
    let back = App.create_step_back_button(mode)
    let actions_menu = App.create_actions_menu(mode)
    App.setup_drag(mode, container)
    let left_top = DOM.create(`div`, `item_top_left`)
    let right_top = DOM.create(`div`, `item_top_right`)
    left_top.append(main_menu)
    left_top.append(filter_modes)
    left_top.append(filter)
    right_top.append(playing)
    right_top.append(back)

    if (actions_menu) {
      right_top.append(actions_menu)
    }

    top.append(left_top)
    top.append(right_top)
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
    App.scroll_to_item(App.get_selected(mode), `center`)
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

  App.scroll_to_item(item, `nearest`)
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

App.after_focus = (method = `normal`) => {
  if (method === `load`) {
    return
  }

  if (method === `normal`) {
    if (App.get_setting(`close_on_focus`)) {
      App.close_window()
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
    items = App.get_active_items(mode, item)
  }
  else {
    items = [item]
  }

  if (items.length === 1) {
    App.open_tab(items[0])
    App.after_open(shift)
  }
  else {
    let force = App.check_force(`warn_on_open`, items.length)

    App.show_confirm(`Open these items ${items.length}?`, () => {
      for (let item of items) {
        App.open_tab(item)
      }

      App.deselect(mode)
      App.after_open(shift)
    }, () => {
      App.deselect(mode)
    }, force)
  }
}

App.goto_top = (mode = App.window_mode, select = false) => {
  if (select) {
    App.select_item({item: App.get_items(mode).at(0), scroll: `nearest`})
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
    App.select_item({item: App.get_items(mode).at(-1), scroll: `nearest`})
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

App.scroll = (mode, direction) => {
  let el = DOM.el(`#${mode}_container`)

  if (direction === `up`) {
    el.scrollTop -= App.scroll_amount
  }
  else if (direction === `down`) {
    el.scrollTop += App.scroll_amount
  }
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

App.get_active_items = (mode, item, multiple = true) => {
  if (!multiple) {
    return [item]
  }

  let selected = App.selected_items(mode)

  if (selected.length === 1) {
    if (item) {
      return [item]
    }
    else {
      return [App.get_selected(mode)]
    }
  }
  else {
    if (!selected.includes(item)) {
      selected.push(item)
    }

    return selected
  }
}

App.insert_item = (mode, info) => {
  let item = App.process_info({mode: mode, info: info})

  if (mode === `tabs`) {
    App.get_items(mode).splice(info.index, 0, item)
    DOM.el(`#${mode}_container`).append(item.element)
    App.move_item_element(`tabs`, item.element, info.index)
  }
  else {
    let old = App.get_item_by_url(mode, item.url)

    if (old) {
      App.remove_item(old)
    }

    App.get_items(mode).unshift(item)
    DOM.el(`#${mode}_container`).prepend(item.element)
  }

  App.update_footer_count(mode)
  return item
}

App.container_is_scrolled = (mode) => {
  let container = DOM.el(`#${mode}_container`)
  return container.scrollHeight > container.clientHeight
}

App.scroll_to_item = (item, scroll = `nearest`) => {
  item.element.scrollIntoView({
    block: scroll,
    behavior: `instant`,
  })

  App.do_check_scroller(item.mode)
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

  args = Object.assign(def_args, args)
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
  return item.custom_title || item.title
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

App.get_index_diff = (item_1, item_2) => {
  let i = App.get_item_element_index(item_1.mode, item_1.element)
  let ii = App.get_item_element_index(item_2.mode, item_2.element)
  return Math.abs(i - ii)
}

App.get_persistent_items = () => {
  let items = []

  for (let mode of App.persistent_modes) {
    items.push(...App.get_items(mode))
  }

  return items
}

// Clear but always have tabs available
App.clear_show = async () => {
  App.clear_all_items()
  await App.do_show_mode({mode: `tabs`})
  App.show_primary_mode(false)
}

App.select_item_by_id = (mode, id) => {
  let item = App.get_item_by_id(mode, id)

  if (item) {
    App.select_item({item: item, scroll: `center`})
  }
}