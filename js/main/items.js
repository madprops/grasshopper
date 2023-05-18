// Setup items
App.setup_items = () => {
  App.get_item_order()
  App.start_item_observers()
}

// Select an item
App.select_item = async (item, scroll = `nearest`) => {
  if (!item.created) {
    App.create_item_element(item)
  }

  App.set_selected(item.mode, item)

  for (let el of DOM.els(`.${item.mode}_item`)) {
    el.classList.remove(`selected`)
  }

  App.get_selected(item.mode).element.classList.add(`selected`)

  if (scroll !== `none`) {
    App.get_selected(item.mode).element.scrollIntoView({block: scroll})
  }

  App.update_footer_info(item)

  if (item.mode === `tabs`) {
    try {
      await browser.tabs.warmup(item.id)
    }
    catch (err) {
      App.log(err, `error`)
    }
  }

  App.dehighlight(item.mode)
}

// Check highlight
App.check_highlight = (item) => {
  let highlighted = item.highlighted
  App.toggle_highlight(item, !highlighted)
}

// Select item above
App.select_item_above = (mode) => {
  let item = App.get_prev_visible_item(mode)

  if (item) {
    App.select_item(item)
  }
}

// Select item below
App.select_item_below = (mode) => {
  let item = App.get_next_visible_item(mode)

  if (item) {
    App.select_item(item)
  }
}

// Highlight next item above or below
App.highlight_next = (mode, dir) => {
  let waypoint = false
  let items = App.get_items(mode).slice(0)
  let current = App.last_highlight || App.get_selected(mode)

  if (dir === `above`) {
    items.reverse()
  }

  for (let item of items) {
    if (!item.visible) {
      continue
    }

    if (waypoint) {
      App.highlight_range(item)
      break
    }
    else {
      if (item === current) {
        waypoint = true
      }
    }
  }
}

// Highlight towards top or bottom
App.highlight_to_edge = (mode, dir) => {
  let items = App.get_items(mode).slice(0)

  if (dir === `below`) {
    items.reverse()
  }

  App.highlight_range(items[0])
}

// Get next item that is visible
App.get_next_visible_item = (mode, wrap = true) => {
  let waypoint = false

  if (!App.get_selected(mode)) {
    waypoint = true
  }

  let items = App.get_items(mode)
  let o_item = App.get_selected(mode)

  for (let i=0; i<items.length; i++) {
    let item = items[i]

    if (waypoint) {
      if (item.visible) {
        return item
      }
    }

    if (item === o_item) {
      waypoint = true
    }
  }

  if (wrap) {
    for (let i=0; i<items.length; i++) {
      let item = items[i]

      if (item.visible) {
        return item
      }
    }
  }
}

// Get prev item that is visible
App.get_prev_visible_item = (mode, wrap = true) => {
  let waypoint = false

  if (!App.get_selected(mode)) {
    waypoint = true
  }

  let items = App.get_items(mode)
  let o_item = App.get_selected(mode)

  for (let i=items.length-1; i>=0; i--) {
    let item = items[i]

    if (waypoint) {
      if (item.visible) {
        return item
      }
    }

    if (item === o_item) {
      waypoint = true
    }
  }

  if (wrap) {
    for (let i=items.length-1; i>=0; i--) {
      let item = items[i]

      if (item.visible) {
        return item
      }
    }
  }
}

// Updates a footer
App.update_footer_info = (item) => {
  if (item) {
    App.set_footer_info(item.mode, item.footer)
  }
  else {
    App.empty_footer_info()
  }
}

// Empty the footer
App.empty_footer_info = () => {
  App.set_footer_info(App.window_mode, `No Results`)
}

// Set footer info
App.set_footer_info = (mode, text) => {
  let footer = DOM.el(`#${mode}_footer`)

  if (footer) {
    let info = DOM.el(`.footer_info`, footer)
    info.textContent = text
  }
}

// Get selected item by mode
App.get_selected = (mode) => {
  return App[`selected_${mode}_item`]
}

// Set selected item by mode
App.set_selected = (mode, what) => {
  App[`selected_${mode}_item`] = what
}

// Get items
App.get_items = (mode) => {
  let item_string = `${mode}_items`

  if (App[item_string]) {
    App[item_string] = App[item_string].filter(x => x !== undefined)
  }

  return App[item_string] || []
}

// Select first item
App.select_first_item = (mode, by_active = false) => {
  if (mode === `tabs` && by_active) {
    for (let item of App.get_items(mode)) {
      if (item.visible && item.active) {
        App.select_item(item, `center`)
        return
      }
    }
  }

  for (let item of App.get_items(mode)) {
    if (item.visible) {
      App.select_item(item)
      return
    }
  }
}

// Filter items by id
App.filter_item_by_id = (mode, id) => {
  id = id.toString()
  let item_string = `${mode}_items`
  App[item_string] = App[item_string].filter(x => x.id.toString() !== id)
}

// Remove an item from the list
App.remove_item = (item) => {
  let mode = item.mode

  if (mode !== `tabs`) {
    if (App.get_selected(mode) === item) {
      let next_item = App.get_next_visible_item(mode, false) || App.get_prev_visible_item(mode, false)

      if (next_item) {
        App.select_item(next_item)
      }
      else {
        App.select_first_item(mode)
      }
    }
  }

  item.element.remove()
  App.filter_item_by_id(mode, item.id)
  App.update_footer_count(mode)

  if (App.get_filter(mode)) {
    if (App.get_visible(mode).length === 0) {
      App.clear_filter(mode)
    }
  }
}

App.focus_filter = (mode) => {
  DOM.el(`#${mode}_filter`).focus()
}

// Filter items
App.do_item_filter = async (mode) => {
  App.log(`Filter: ${mode}`)
  let value = App.get_filter(mode)

  if (mode === `history`) {
    await App.search_history()

    if (App.window_mode !== `history`) {
      return
    }
  }

  let items = App.get_items(mode)

  if (!items) {
    return
  }

  let filter_mode = App[`${mode}_filter_mode`]
  let skip = !value && filter_mode === `all`
  let words, filter_words

  if (!skip) {
    words = value.split(` `).filter(x => x !== ``)
    filter_words = words.map(x => x.toLowerCase())
  }

  let duplicates

  if (filter_mode === `duplicates`) {
    duplicates = App.find_duplicates(items, `url`)
  }

  function check (title, path) {
    return filter_words.every(x => title.includes(x) || path.includes(x))
  }

  function matched (item) {
    let match = false
    let title = item.title_lower
    let path = item.path_lower

    if (check(title, path)) {
      if (filter_mode === `all`) {
        match = true
      }
      else if (filter_mode === `normal`) {
        match = App.tab_is_normal(item)
      }
      else if (filter_mode === `playing`) {
        match = item.audible
      }
      else if (filter_mode === `pins`) {
        match = item.pinned
      }
      else if (filter_mode === `muted`) {
        match = item.muted
      }
      else if (filter_mode === `suspended`) {
        match = item.discarded
      }
      else if (filter_mode === `active`) {
        match = item.active
      }
      else if (filter_mode === `images`) {
        match = item.image
      }
      else if (filter_mode === `videos`) {
        match = item.video
      }
      else if (filter_mode === `http`) {
        match = item.protocol === `http:`
      }
      else if (filter_mode === `https`) {
        match = item.protocol === `https:`
      }
      else if (filter_mode === `duplicates`) {
        match = duplicates.includes(item)
      }
    }

    return match
  }

  let selected

  for (let it of items) {
    if (!it.element) {
      continue
    }

    if (skip || matched(it)) {
      App.show_item(it)

      if (it.active) {
        selected = it
      }
    }
    else {
      App.hide_item(it)
    }
  }

  App.set_selected(mode, undefined)

  if (selected) {
    App.select_item(selected)
  }
  else {
    App.select_first_item(mode)
  }

  App.update_footer_info(App.get_selected(mode))
  App.update_footer_count(mode)
}

// Show item
App.show_item = (it) => {
  it.element.classList.remove(`hidden`)
  it.visible = true
}

// Hide item
App.hide_item = (it) => {
  it.element.classList.add(`hidden`)
  it.visible = false
}

// Show item menu
App.show_item_menu = (item, x, y) => {
  let highlights = App.get_highlights(item.mode)
  let multiple = highlights.length > 0
  let items = []

  if (item.mode === `tabs`) {
    if (item.pinned) {
      items.push({
        text: `Unpin`,
        action: () => {
          App.unpin_tabs(item)
        }
      })
    }
    else {
      items.push({
        text: `Pin`,
        action: () => {
          App.pin_tabs(item)
        }
      })
    }

    if (item.muted) {
      items.push({
        text: `Unmute`,
        action: () => {
          App.unmute_tabs(item)
        }
      })
    }
    else {
      items.push({
        text: `Mute`,
        action: () => {
          App.mute_tabs(item)
        }
      })
    }

    items.push({
      text: `Title`,
      action: () => {
        App.show_title_editor(item)
      }
    })

    items.push({
      separator: true
    })
  }

  items.push({
    text: `Star`,
    action: () => {
      App.star_items(item)
    }
  })

  if (item.mode === `stars`) {
    items.push({
      text: `Remove`,
      action: () => {
        App.remove_stars(item)
      }
    })
  }

  if (!multiple) {
    items.push({
      text: `Filter`,
      action: () => {
        App.filter_domain(item)
      }
    })

    items.push({
      text: `Copy`,
      items: [
      {
        text: `Copy URL`,
        action: () => {
          App.copy_to_clipboard(item.url)
        }
      },
      {
        text: `Copy Title`,
        action: () => {
          App.copy_to_clipboard(item.title)
        }
      }]
    })
  }

  if (item.mode === `tabs`) {
    items.push({
      text: `More`,
      get_items: () => {
        return App.get_more_menu_items(item, multiple)
       }
    })

    items.push({
      separator: true
    })

    items.push({
      text: `Close`,
      action: () => {
        App.close_tabs(item)
      }
    })
  }
  else {
    items.push({
      text: `Launch`,
      action: () => {
        App.launch_items(item)
      }
    })
  }

  NeedContext.show(x, y, items)
}

// Show tab move menu
App.get_move_menu_items = async (item, multiple) => {
  let items = []
  let wins = await browser.windows.getAll({populate: false})

  if (!multiple) {
    items.push({
      text: `Detach`,
      action: () => {
        App.detach_tab(item)
      }
    })
  }

  for (let win of wins) {
    if (item.window_id === win.id) {
      continue
    }

    let s = `${win.title.substring(0, 25).trim()} (ID: ${win.id})`
    let text = `Move to: ${s}`

    items.push({
      text: text,
      action: () => {
        App.move_tabs(item, win.id)
      }
    })
  }

  return items
}

// Show tab more menu
App.get_more_menu_items = (item, multiple) => {
  let items = []

  if (!multiple) {
    items.push({
      text: `Duplicate`,
      action: () => {
        App.duplicate_tab(item)
      }
    })
  }

  if (!item.discarded) {
    items.push({
      text: `Suspend`,
      action: () => {
        App.suspend_tabs(item)
      }
    })
  }

  items.push({
    text: `Move`,
    get_items: async () => {
      return await App.get_move_menu_items(item, multiple)
    }
  })

  return items
}

// Process items
App.process_items = (mode, items) => {
  let container = DOM.el(`#${mode}_container`)
  container.innerHTML = ``
  App[`${mode}_items`] = []
  App[`${mode}_idx`] = 0
  App[`${mode}_items_original`] = items
  let exclude = []

  for (let item of items) {
    let obj = App.process_item(mode, item, exclude)

    if (!obj) {
      continue
    }

    if (mode === `closed` || mode === `history`) {
      exclude.push(obj.url)
    }

    App.get_items(mode).push(obj)
    container.append(obj.element)
  }

  App.update_footer_count(mode)

  if (mode === `tabs`) {
    App.check_playing()
  }
}

// Process an item
App.process_item = (mode, item, exclude = [], o_item) => {
  if (!item || !item.url) {
    return false
  }

  try {
    url_obj = new URL(item.url)
    decodeURI(item.url)
  }
  catch (err) {
    return false
  }

  let url = App.format_url(item.url)

  if (exclude.includes(url)) {
    return false
  }

  let path = App.remove_protocol(url)
  let title = item.title || path
  let image = App.is_image(url)
  let video = App.is_video(url)

  if (mode === `tabs`) {
    let t = App.get_title(url)

    if (t) {
      title = t
    }
  }

  let obj = {
    title: title,
    title_lower: title.toLowerCase(),
    url: url,
    path: path,
    path_lower: path.toLowerCase(),
    favicon: item.favIconUrl,
    mode: mode,
    protocol: url_obj.protocol,
    window_id: item.windowId,
    session_id: item.sessionId,
    image: image,
    video: video,
    created: false,
  }

  if (mode === `tabs`) {
    obj.active = item.active
    obj.pinned = item.pinned
    obj.audible = item.audible
    obj.muted = item.mutedInfo.muted
    obj.discarded = item.discarded
  }

  if (o_item) {
    o_item = Object.assign(o_item, obj)
    App.create_item_element(o_item)

    if (App.get_selected(mode) === o_item) {
      App.update_footer_info(o_item)
    }
  }
  else {
    obj.id = item.id || App[`${mode}_idx`]
    obj.visible = true
    obj.highlighted = false
    App.create_empty_item_element(obj)
    App[`${mode}_idx`] += 1

    if (mode === `tabs`) {
      if (!App.tabs_created[obj.id]) {
        App.tabs_created[obj.id] = Date.now()
      }
    }

    return obj
  }
}

// Create empty item
App.create_empty_item_element = (item) => {
  item.element = DOM.create(`div`, `grasshopper_item item ${item.mode}_item`)
  item.element.dataset.id = item.id
  App[`${item.mode}_item_observer`].observe(item.element)
}

// Create an item element
App.create_item_element = (item) => {
  item.element.innerHTML = ``

  if (item.mode === `tabs`) {
    item.element.draggable = true

    if (item.pinned) {
      item.element.classList.add(`pin_item`)
      item.element.classList.remove(`normal_item`)
    }
    else {
      item.element.classList.add(`normal_item`)
      item.element.classList.remove(`pin_item`)
    }
  }

  let icon = App.get_img_icon(item.favicon, item.url, item.pinned)
  item.element.append(icon)

  let status = DOM.create(`div`, `item_status hidden`)
  item.element.append(status)

  let text = DOM.create(`div`, `item_text`)
  item.element.append(text)
  App.set_item_text(item)

  if (item.mode === `tabs`) {
    if (item.pinned) {
      if (App.settings.pin_icon) {
        let pin_icon = DOM.create(`div`, `item_info item_info_pin`)
        pin_icon.textContent = App.settings.pin_icon
        pin_icon.title = `This tab is pinned`
        item.element.append(pin_icon)
      }
    }
    else {
      if (App.settings.normal_icon) {
        let normal_icon = DOM.create(`div`, `item_info item_info_normal`)
        normal_icon.textContent = App.settings.normal_icon
        normal_icon.title = `This tab is normal`
        item.element.append(normal_icon)
      }
    }
  }
  else {
    let launched = DOM.create(`div`, `item_info item_info_launched`)
    item.element.append(launched)
  }

  if (item.highlighted) {
    item.element.classList.add(`highlighted`)
  }
  else {
    item.element.classList.remove(`highlighted`)
  }

  item.created = true
  App.log(`Item created in ${item.mode}`)
}

// Get image favicon
App.get_img_icon = (favicon, url) => {
  let icon = DOM.create(`img`, `item_icon`)
  icon.loading = `lazy`
  icon.width = App.icon_size
  icon.height = App.icon_size

  DOM.ev(icon, `error`, () => {
    let icon_2 = App.get_jdenticon(url)
    icon.replaceWith(icon_2)
  })

  icon.src = favicon
  return icon
}

// Get jdenticon icon
App.get_jdenticon = (url) => {
  let hostname = App.get_hostname(url) || `hostname`
  let icon = DOM.create(`canvas`, `item_icon`)
  icon.width = App.icon_size
  icon.height = App.icon_size
  jdenticon.update(icon, hostname)
  return icon
}

// Set item text content
App.set_item_text = (item) => {
  if (item.mode === `tabs`) {
    let icons = []

    if (item.discarded) {
      icons.push(App.settings.suspended_icon)
    }

    if (item.audible) {
      icons.push(App.settings.playing_icon)
    }

    if (item.muted) {
      icons.push(App.settings.muted_icon)
    }

    if (icons.length > 0) {
      let status = DOM.el(`.item_status`, item.element)

      for (let icon of icons) {
        let el = DOM.create(`div`)
        el.textContent = icon
        status.append(el)
      }

      status.classList.remove(`hidden`)
    }
  }

  let content
  let path = decodeURI(item.path)

  if (App.settings.text_mode === `title`) {
    content = item.title || path
    item.footer = path || item.title
  }
  else if (App.settings.text_mode === `url`) {
    content = path || item.title
    item.footer = item.title || path
  }

  if (App.settings.hover_tooltips) {
    item.element.title = `${content}\n${item.footer}`
  }

  content = content.substring(0, App.max_text_length).trim()
  let text = DOM.el(`.item_text`, item.element)
  text.textContent = content
}

// Get an item by id
App.get_item_by_id = (mode, id) => {
  id = id.toString()

  for (let item of App.get_items(mode)) {
    if (item.id.toString() === id) {
      return item
    }
  }
}

// Get an item by url
App.get_item_by_url = (mode, url) => {
  for (let item of App.get_items(mode)) {
    if (item.url) {
      if (App.urls_equal(item.url, url)) {
        return item
      }
    }
  }
}

// Used for lazy-loading components
App.start_item_observers = () => {
  for (let mode of App.item_order) {
    let options = {
      root: DOM.el(`#${mode}_container`),
      rootMargin: `0px`,
      threshold: 0.1,
    }

    App.intersection_observer(mode, options)
  }
}

// Start intersection observer
App.intersection_observer = (mode, options) => {
  App[`${mode}_item_observer`] = new IntersectionObserver((entries) => {
    for (let entry of entries) {
      if (!entry.isIntersecting) {
        continue
      }

      if (!entry.target.classList.contains(`item`)) {
        return
      }

      let item = App.get_item_by_id(mode, entry.target.dataset.id)

      if (!item) {
        continue
      }

      if (!item.created && item.visible) {
        App.create_item_element(item)
      }
    }
  }, options)
}

// Get last window value
App.get_last_window_value = (cycle) => {
  let last_mode = App.window_mode

  if (!App.on_item_window(last_mode)) {
    last_mode = `tabs`
  }

  let value = ``

  if (cycle) {
    value = App.get_filter(last_mode, false)
  }

  return value
}

// Show a window by mode
App.show_item_window = async (mode, cycle = false) => {
  let value = App.get_last_window_value(cycle)
  App.windows[mode].show()
  App.empty_footer_info()
  App[`${mode}_item_filter`].cancel()
  DOM.el(`#${mode}_container`).innerHTML = ``
  App.set_filter(mode, value, false)

  let m = App[`${mode}_filter_modes`][0]
  App.set_filter_mode(mode, m)
  App[`${mode}_filter_mode`] = m[0]

  let items = await App[`get_${mode}`]()

  if (mode !== App.window_mode) {
    return
  }

  if (mode === `history` && value) {
    // Filter will search
  }
  else {
    App.process_items(mode, items)
  }

  if (value) {
    App.do_item_filter(mode)
  }
  else {
    App.select_first_item(mode, true)
  }

  App.focus_filter(mode)
}

// Setup an item window
App.setup_item_window = (mode) => {
  let args = {}
  args.id = mode
  args.close_button = false
  args.align_top = `left`

  let mode_name = App.get_mode_name(mode)
  args.setup = () => {
    App[`${mode}_item_filter`] = App.create_debouncer(() => {
      App.do_item_filter(mode)
    }, App.filter_delay)

    let win = DOM.el(`#window_content_${mode}`)
    let edge = DOM.create(`div`, `edge`, `${mode}_edge`)
    let container = DOM.create(`div`, `container`, `${mode}_container`)
    let footer = DOM.create(`div`, `footer unselectable`, `${mode}_footer`)
    let top = DOM.create(`div`, `item_top_container`, `${mode}_top_container`)

    DOM.el(`#window_top_${mode}`).append(top)

    win.append(edge)
    win.append(container)
    win.append(footer)

    let footer_count = DOM.create(`div`, `footer_count action`)
    footer_count.textContent = `(--)`

    DOM.ev(footer_count, `click`, () => {
      App.highlight_items(mode)
    })

    footer.append(footer_count)

    let footer_info = DOM.create(`div`, `footer_info`)
    footer.append(footer_info)

    App.setup_window_mouse(mode)

    //
    let main_menu = DOM.create(`div`, `button icon_button`, `${mode}_main_menu`)
    main_menu.textContent = mode_name
    main_menu.title = `Main Menu (Ctrl + Left)`

    DOM.ev(main_menu, `click`, () => {
      App.show_main_menu(mode)
    })

    DOM.ev(main_menu, `wheel`, (e) => {
      if (e.deltaY < 0) {
        App.cycle_item_windows(true)
      }
      else {
        App.cycle_item_windows(false)
      }
    })

    //
    let filter = DOM.create(`input`, `text filter`, `${mode}_filter`)
    filter.type = `text`
    filter.autocomplete = `off`
    filter.spellcheck = false
    filter.placeholder = `Type to filter`

    DOM.ev(filter, `input`, () => {
      App[`${mode}_item_filter`].call()
    })

    //
    let filter_modes = DOM.create(`div`, `button icon_button`, `${mode}_filter_modes`)
    filter_modes.title = `Filter Modes (Ctrl + Down)`
    let filter_modes_text = DOM.create(`div`, ``, `${mode}_filter_modes_text`)
    filter_modes.append(filter_modes_text)

    App[`${mode}_filter_modes`] = App[`${mode}_filter_modes`] || []
    App[`${mode}_filter_modes`].unshift([`videos`, `Videos`])
    App[`${mode}_filter_modes`].unshift([`images`, `Images`])
    App[`${mode}_filter_modes`].unshift([`all`, `All`])

    DOM.ev(filter_modes, `click`, () => {
      App.show_filter_modes(mode)
    })

    DOM.ev(filter_modes, `wheel`, (e) => {
      if (e.deltaY < 0) {
        App.cycle_filter_modes(mode, true)
      }
      else {
        App.cycle_filter_modes(mode, false)
      }
    })

    //
    let playing

    if (mode === `tabs`) {
      playing = DOM.create(`div`, `button icon_button hidden`, `${mode}_playing`)
      playing.title = `Go To Playing Tab (Ctrl + Up)`
      let playing_icon = App.create_icon(`speaker`)

      DOM.ev(playing, `click`, () => {
        App.go_to_playing()
      })

      playing.append(playing_icon)
    }

    //
    if (!App[`${mode}_actions`]) {
      App[`${mode}_actions`] = []
    }

    App[`${mode}_actions`].unshift({text: `Select All`, action: () => {
      App.highlight_items(mode)
    }})

    App[`${mode}_actions`].unshift({text: `Goto Bottom`, action: () => {
      App.goto_bottom(mode)
    }})

    App[`${mode}_actions`].unshift({text: `Goto Top`, action: () => {
      App.goto_top(mode)
    }})

    App[`${mode}_actions`].unshift({text: `Clear Filter`, action: () => {
      App.clear_filter(mode)
    }})

    let actions_menu = DOM.create(`div`, `button icon_button`, `${mode}_actions`)
    let actions_icon = App.create_icon(`sun`)
    actions_menu.append(actions_icon)
    actions_menu.title = `Actions (Ctrl + Right)`

    App[`show_${mode}_actions`] = (e) => {
      let items = []

      for (let item of App[`${mode}_actions`]) {
        if (item.text === `--separator--`) {
          items.push({separator: true})
          continue
        }

        if (item.conditional) {
          items.push(item.conditional())
        }
        else if (item.action) {
          items.push({text: item.text, action: () => {
            item.action()
          }})
        }
        else if (item.items) {
          items.push({text: item.text, items: item.items})
        }
        else if (item.get_items) {
          items.push({text: item.text, get_items: item.get_items})
        }
      }

      if (e) {
        NeedContext.show(e.clientX, e.clientY, items)
      }
      else {
        NeedContext.show_on_element(actions_menu, items, true, actions_menu.clientHeight)
      }
    }

    DOM.ev(actions_menu, `click`, (e) => {
      App.show_actions(mode, e)
    })

    //
    if (mode === `tabs`) {
      App.setup_drag(mode, container)
    }

    // Append the top components
    let left_top = DOM.create(`div`, `item_top_left`)
    let right_top = DOM.create(`div`, `item_top_right`)

    left_top.append(main_menu)
    left_top.append(filter_modes)
    left_top.append(filter)

    if (playing) {
      right_top.append(playing)
    }

    right_top.append(actions_menu)

    top.append(left_top)
    top.append(right_top)
  }

  App.create_window(args)
}

// Cycle between item windows
App.cycle_item_windows = (reverse = false, cycle = false) => {
  let modes = App.item_order
  let index = modes.indexOf(App.window_mode)
  let new_mode

  if (index === -1) {
    return
  }

  if (reverse) {
    if (index === 0) {
      new_mode = modes.slice(-1)[0]
    }
    else {
      new_mode = modes[index - 1]
    }
  }
  else {
    if (index === modes.length - 1) {
      new_mode = modes[0]
    }
    else {
      new_mode = modes[index + 1]
    }
  }

  App.show_item_window(new_mode, cycle)
}

// Update window order
App.update_item_order = () => {
  let boxes = DOM.els(`.item_order_row`, DOM.el(`#settings_item_order`))
  let modes = boxes.map(x => x.dataset.mode)

  for (let [i, mode] of modes.entries()) {
    App.settings[`${mode}_index`] = i
  }

  App.stor_save_settings()
  App.get_item_order()
}

// Window order up
App.item_order_up = (el) => {
  let prev = el.previousElementSibling

  if (prev) {
    el.parentNode.insertBefore(el, prev)
    App.update_item_order()
  }
}

// Window order down
App.item_order_down = (el) => {
  let next = el.nextElementSibling

  if (next) {
    el.parentNode.insertBefore(next, el)
    App.update_item_order()
  }
}

// Show first item window
App.show_first_window = () => {
  App.show_item_window(App.item_order[0])
}

// Focus an open tab or launch a new one
App.focus_or_open_item = async (item, close = true) => {
  if (!close) {
    App.launch_item(item, close)
    return
  }

  let tabs = await App.get_tabs()

  for (let tab of tabs) {
    if (App.urls_equal(tab.url, item.url)) {
      let o = {
        id: tab.id,
        window_id: tab.windowId
      }

      App.focus_tab(o)
      return
    }
  }

  App.launch_item(item, close)
}

// Get window order
App.get_item_order = () => {
  let items = []

  for (let mode of App.item_modes) {
    items.push({mode: mode, index: App.settings[`${mode}_index`]})
  }

  items.sort((a, b) => (a.index > b.index) ? 1 : -1)
  App.item_order = items.map(x => x.mode)
}

// Update footer count
App.update_footer_count = (mode) => {
  let n1 = App.get_highlights(mode).length
  let n2 = App.get_visible(mode).length
  let s1 = n1.toLocaleString()
  let s2 = n2.toLocaleString()
  let footer = DOM.el(`#${mode}_footer`)
  let count = DOM.el(`.footer_count`, footer)

  if (n1 > 0) {
    count.textContent = `(${s1}/${s2})`
  }
  else {
    count.textContent = `(${s2})`
  }
}

// Set item filter
App.set_filter = (mode, text, action = true) => {
  DOM.el(`#${mode}_filter`).value = text

  if (action) {
    App.do_item_filter(mode)
  }
}

// Get filter value
App.get_filter = (mode, trim = true) => {
  let value = DOM.el(`#${mode}_filter`).value

  if (trim) {
    value = value.trim()
  }

  return value
}

// Any item visible
App.any_item_visible = (mode) => {
  for (let item of App.get_items(mode)) {
    if (item.visible) {
      return true
    }
  }

  return false
}

// Get number of visible items
App.get_visible = (mode) => {
  let items = []

  for (let item of App.get_items(mode)) {
    if (item.visible) {
      items.push(item)
    }
  }

  return items
}

// Clear the filter
App.clear_filter = (mode) => {
  App.set_filter(mode, ``, false)
  App.do_item_filter(mode)
  App.focus_filter(mode)
}

// Show launched indicator
App.show_launched = (item) => {
  let launched = DOM.el(`.item_info_launched`, item.element)
  launched.textContent = `(Launched)`
}

// Update item
App.update_item = (mode, id, info) => {
  for (let item of App.get_items(mode)) {
    if (item.id === id) {
      App.process_item(mode, info, [], item)
      break
    }
  }
}

// Show similar tabs
App.filter_domain = (item) => {
  let hostname = App.get_hostname(item.url)

  if (!hostname && item.url.includes(`:`)) {
    hostname = item.url.split(`:`)[0] + `:`
  }

  if (!hostname) {
    return
  }

  App.set_filter(item.mode, hostname)
}

// Show the actions menu
App.show_actions = (mode, e) => {
  App[`show_${mode}_actions`](e)
}

// Show filter modes
App.show_filter_modes = (mode) => {
  let items = []

  for (let filter_mode of App[`${mode}_filter_modes`]) {
    let selected = App[`${mode}_filter_mode`] === filter_mode[0]

    items.push({
      text: filter_mode[1],
      action: () => {
        App.set_filter_mode(mode, filter_mode)
      },
      selected: selected
    })
  }

  let btn = DOM.el(`#${mode}_filter_modes`)
  NeedContext.show_on_element(btn, items, false, btn.clientHeight)
}

// Cycle filter modes
App.cycle_filter_modes = (mode, reverse = true) => {
  let modes = App[`${mode}_filter_modes`]
  let waypoint = false

  if (reverse) {
    for (let filter_mode of modes.slice(0).reverse()) {
      if (waypoint) {
        App.set_filter_mode(mode, filter_mode)
        return
      }

      if (filter_mode[0] === App[`${mode}_filter_mode`]) {
        waypoint = true
      }
    }
  }
  else {
    for (let filter_mode of modes) {
      if (waypoint) {
        App.set_filter_mode(mode, filter_mode)
        return
      }

      if (filter_mode[0] === App[`${mode}_filter_mode`]) {
        waypoint = true
      }
    }
  }

  // If no result
  if (reverse) {
    App.set_filter_mode(mode, modes[modes.length - 1])
  }
  else {
    App.set_filter_mode(mode, modes[0])
  }
}

// Set filter mode
App.set_filter_mode = (mode, filter_mode) => {
  App[`${mode}_filter_mode`] = filter_mode[0]
  DOM.el(`#${mode}_filter_modes_text`).textContent = filter_mode[1]
  App.do_item_filter(mode)
}

// Get mode index
App.get_mode_index = (mode) => {
  for (let [i, it] of App.item_order.entries()) {
    if (it === mode) {
      return i
    }
  }
}

// Get item's element index
App.get_item_element_index = (mode, el) => {
  let nodes = Array.prototype.slice.call(DOM.els(`.${mode}_item`))
  return nodes.indexOf(el)
}

// Move an item to another place in an item list
App.move_item = (mode, from_index, to_index) => {
  let it = App.get_items(mode).splice(from_index, 1)[0]
  App.get_items(mode).splice(to_index, 0, it)
  App.move_item_element(mode, it.element, to_index)
}

// Move item element
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

// Highlight a range of items
App.highlight_range = (item) => {
  if (App.last_highlight === item) {
    App.dehighlight(item.mode)
    return
  }

  if (!App.last_highlight || !App.last_highlight.highlighted) {
    App.last_highlight = App.get_selected(item.mode)
    App.toggle_highlight(App.last_highlight, true)
  }

  if (item === App.last_highlight) {
    return
  }

  let items = App[`${item.mode}_items`]
  let index_1 = items.indexOf(item)
  let index_2 = items.indexOf(App.last_highlight)

  if (item.highlighted) {
    for (let [i, it] of items.entries()) {
      if (!it.visible) {
        continue
      }

      let unhighlight = false

      if (index_1 < index_2) {
        if (i > index_1) {
          unhighlight = true
        }
      }
      else {
        if (i < index_1) {
          unhighlight = true
        }
      }

      if (unhighlight) {
        App.toggle_highlight(it, false)
      }
    }
  }
  else {
    let slice

    if (index_1 < index_2) {
      slice = items.slice(index_1, index_2 + 1)
    }
    else {
      slice = items.slice(index_2 + 1, index_1 + 1)
    }

    for (let it of slice) {
      if (!it.visible) {
        continue
      }

      App.toggle_highlight(it, true)
    }
  }

  // Make sure the item is the last highlight
  App.toggle_highlight(item, true)

  let highlights = App.get_highlights(item.mode)

  if (highlights.length <= 1) {
    App.dehighlight(item.mode)
    return
  }
}

// Dehighlight items
App.dehighlight = (mode) => {
  let some = false

  for (let item of App.get_items(mode)) {
    if (item.highlighted) {
      App.toggle_highlight(item)
      some = true
    }
  }

  return some
}

// Highlight or dehighlight an item
App.toggle_highlight = (item, what) => {
  let highlight

  if (what !== undefined) {
    highlight = what
  }
  else {
    highlight = !item.highlighted
  }

  if (!item.visible) {
    highlight = false
  }

  if (highlight) {
    item.element.classList.add(`highlighted`)
    App.last_highlight = item
  }
  else {
    item.element.classList.remove(`highlighted`)

    if (App.last_highlight === item) {
      App.last_highlight = undefined
    }
  }

  item.highlighted = highlight
  App.update_footer_count(item.mode)
}

// Get highlighted items
App.get_highlights = (mode) => {
  let ans = []

  for (let item of App.get_items(mode)) {
    if (item.highlighted) {
      ans.push(item)
    }
  }

  return ans
}

// Launch an item
App.launch_item = (item, close = true) => {
  App.open_tab(item.url, close)

  if (close) {
    App.close_window()
  }
  else {
    App.show_launched(item)
  }
}

// Launch items
App.launch_items = (item) => {
  let mode = item.mode
  let items = App.get_active_items(mode, item)

  if (items.length === 1) {
    App.open_tab(items[0].url, false)
    App.show_launched(items[0])
    return
  }

  let s = App.plural(items.length, `item`, `items`)

  App.show_confirm(`Launch ${s}?`, () => {
    for (let item of items) {
      App.launch_item(item, false)
    }

    App.dehighlight(mode)
  }, () => {
    App.dehighlight(mode)
  })
}

// Scroll container to top
App.goto_top = (mode) => {
  DOM.el(`#${mode}_container`).scrollTop = 0
}

// Scroll container to bottom
App.goto_bottom = (mode) => {
  DOM.el(`#${mode}_container`).scrollTop = DOM.el(`#${mode}_container`).scrollHeight
}

// Scroll up or down
App.scroll = (mode, direction, percent) => {
  let el = DOM.el(`#${mode}_container`)
  let amount = 50

  if (percent) {
    amount = Math.floor(el.scrollHeight * (percent / 100))
  }

  if (direction === `up`) {
    el.scrollTop -= amount
  }
  else if (direction === `down`) {
    el.scrollTop += amount
  }
}

// Highlight visible items
App.highlight_items = (mode) => {
  let what
  let highlights = App.get_highlights(mode)

  if (highlights.length > 0) {
    what = false
  }

  for (let item of App.get_items(mode)) {
    if (item.visible) {
      if (what === undefined) {
        what = !item.highlighted
      }

      App.toggle_highlight(item, what)
    }
    else {
      App.toggle_highlight(item, false)
    }
  }
}

// Get visible media
App.get_visible_media = (mode, what) => {
  let items = []

  for (let item of App.get_items(mode)) {
    if (item[what]) {
      items.push(item)
    }
  }

  return items
}

// Create an svg icon
App.create_icon = (name, type = 1) => {
  let icon = document.createElementNS(`http://www.w3.org/2000/svg`, `svg`)
  icon.classList.add(`icon_${type}`)
  let icon_use = document.createElementNS(`http://www.w3.org/2000/svg`, `use`)
  icon_use.href.baseVal = `#${name}_icon`
  icon.append(icon_use)
  return icon
}

// Show main menu
App.show_main_menu = (mode) => {
  let el = DOM.el(`#${mode}_main_menu`)
  let items = []

  for (let m of App.item_order) {
    items.push({
      text: App.get_mode_name(m),
      action: () => {
        App.show_item_window(m)
      },
      selected: m === mode
    })
  }

  items.push({
    separator: true
  })

  items.push({
    text: `Settings`,
    action: () => {
      App.show_window(`settings_basic`)
    }
  })

  items.push({
    text: `About`,
    action: () => {
      App.show_window(`about`)
    }
  })

  NeedContext.show_on_element(el, items, true, el.clientHeight)
}

// Get active items
App.get_active_items = (mode, item) => {
  let highlights = App.get_highlights(mode)

  if (highlights.length === 0) {
    if (item) {
      return [item]
    }
    else {
      return [App.get_selected(mode)]
    }
  }
  else {
    return highlights
  }
}

// Insert new item
App.insert_item = (mode, info) => {
  let item = App.process_item(mode, info)

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
    App.check_filter(mode)
  }

  App.update_footer_count(mode)
  return item
}

// Get mode name
App.get_mode_name = (mode) => {
  if (mode === `bookmarks`) {
    return `BMarks`
  }
  else {
    return App.capitalize(mode)
  }
}

// Item action
App.item_action = (item, close = true) => {
  let highlighted = App.get_highlights(item.mode)

  if (highlighted.length > 0) {
    App.launch_items(item)
  }
  else {
    if (close && App.check_media(item)) {
      return
    }

    if (item.mode === `stars`) {
      App.open_star(item, close)
    }
    else {
      App.focus_or_open_item(item, close)
    }
  }
}

// Check if on item window
App.on_item_window = (mode = App.window_mode) => {
  return App.item_order.includes(mode)
}

// Filter if filter has value
App.check_filter = (mode) => {
  if (App.get_filter(mode)) {
    App.do_item_filter(mode)
  }
}