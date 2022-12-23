// Setup items
App.setup_items = function () {
  App.get_item_order()
  App.start_item_observers()

  App.update_footer_count = App.create_debouncer(function (mode) {
    App.do_update_footer_count(mode)
  }, App.update_footer_delay)
}

// Select an item
App.select_item = function (item, scroll = "nearest") {
  if (App.get_selected(item.mode) === item) {
    return
  }

  if (!item.created) {
    App.create_item_element(item)
  }

  App.set_selected(item.mode, item)

  for (let el of App.els(`.${item.mode}_item`)) {
    el.classList.remove("selected")
  }

  App.get_selected(item.mode).element.classList.add("selected")

  if (scroll !== "none") {
    App.get_selected(item.mode).element.scrollIntoView({block: scroll})
  }

  App.update_footer_info(item)

  if (item.mode === "tabs") {
    browser.tabs.warmup(item.id)
  }

  App.dehighlight(item.mode)
}

// Check highlight
App.check_highlight = function (mode, item) {
  let highlighted = item.highlighted
  App.toggle_highlight(App.get_selected(mode), !highlighted)
  App.toggle_highlight(item, !highlighted)
}

// Select item above
App.select_item_above = function (mode, highlight = false) {
  let item = App.get_prev_visible_item(mode)

  if (item) {
    if (highlight) {
      App.check_highlight(mode, item)
    }
    else {
      if (App.dehighlight(mode)) {
        return
      }
    }

    App.select_item(item)
  }
}

// Select item below
App.select_item_below = function (mode, highlight = false) {
  let item = App.get_next_visible_item(mode)

  if (item) {
    if (highlight) {
      App.check_highlight(mode, item)
    }
    else {
      if (App.dehighlight(mode)) {
        return
      }
    }

    App.select_item(item)
  }
}

// Get next item that is visible
App.get_next_visible_item = function (mode, wrap = true) {
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
App.get_prev_visible_item = function (mode, wrap = true) {
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
App.update_footer_info = function (item) {
  if (item) {
    App.set_footer_info(item.mode, item.footer)
  }
  else {
    App.empty_footer_info()
  }
}

// Empty the footer
App.empty_footer_info = function () {
  App.set_footer_info(App.window_mode, "No Results")
}

// Set footer info
App.set_footer_info = function (mode, text) {
  let footer = App.el(`#${mode}_footer`)
  let info = App.el(".footer_info", footer)
  info.textContent = text
}

// Get selected item by mode
App.get_selected = function (mode) {
  return App[`selected_${mode}_item`]
}

// Set selected item by mode
App.set_selected = function (mode, what) {
  App[`selected_${mode}_item`] = what
}

// Get items
App.get_items = function (mode) {
  return App[`${mode}_items`]
}

// Select first item
App.select_first_item = function (mode, by_active = false) {
  if (mode === "tabs" && by_active) {
    for (let item of App.get_items(mode)) {
      if (item.visible && item.active) {
        App.select_item(item, "center")
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

// Remove an item from the list
App.remove_item = function (item) {
  let mode = item.mode
  let items = App.get_items(mode)
  item.element.remove()
  let id = item.id.toString()

  for (let [i, it] of items.entries()) {
    if (it.id.toString() === id) {
      items.splice(i, 1)
      break
    }
  }

  App.update_footer_count.call(mode)

  if (App.get_filter(mode)) {
    if (App.get_visible(mode).length === 0) {
      App.clear_filter(mode)
    }
  }
}

App.focus_filter = function (mode) {
  App.el(`#${mode}_filter`).focus()
}

// Filter items
App.do_item_filter = async function (mode) {
  console.info(`Filter: ${mode}`)
  let value = App.get_filter(mode)

  if (mode === "history") {
    await App.search_history()

    if (App.window_mode !== "history") {
      return
    }
  }

  let items = App.get_items(mode)

  if (!items) {
    return
  }

  App.dehighlight(mode)

  let filter_mode = App[`${mode}_filter_mode`]
  let skip = !value && filter_mode === "all"
  let words, filter_words

  if (!skip) {
    words = value.split(" ").filter(x => x !== "")
    filter_words = words.map(x => x.toLowerCase())
  }

  function check (title, path) {
    return filter_words.every(x => title.includes(x) || path.includes(x))
  }

  function matched (item) {
    let match = false
    let title = item.title_lower
    let path = item.path_lower

    if (check(title, path)) {
      if (filter_mode === "all") {
        match = true
      }
      else if (filter_mode === "normal") {
        match = App.tab_is_normal(item)
      }
      else if (filter_mode === "playing") {
        match = item.audible
      }
      else if (filter_mode === "pins") {
        match = item.pinned
      }
      else if (filter_mode === "muted") {
        match = item.muted
      }
      else if (filter_mode === "suspended") {
        match = item.discarded
      }
      else if (filter_mode === "active") {
        match = item.active
      }
      else if (filter_mode === "images") {
        match = item.image
      }
      else if (filter_mode === "videos") {
        match = item.video
      }
      else if (filter_mode === "http") {
        match = item.protocol === "http:"
      }
      else if (filter_mode === "https") {
        match = item.protocol === "https:"
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
  App.update_footer_count.call(mode)
}

// Show item
App.show_item = function (it) {
  it.element.classList.remove("hidden")
  it.visible = true
}

// Hide item
App.hide_item = function (it) {
  it.element.classList.add("hidden")
  it.visible = false
}

// Show item menu
App.show_item_menu = function (item, x, y) {
  let items = []

  if (item.mode === "tabs") {
    if (item.pinned) {
      items.push({
        text: "Unpin",
        action: function () {
          App.unpin_tabs(item)
        }
      })
    }
    else {
      items.push({
        text: "Pin",
        action: function () {
          App.pin_tabs(item)
        }
      })
    }

    if (item.muted) {
      items.push({
        text: "Unmute",
        action: function () {
          App.unmute_tabs(item)
        }
      })
    }
    else {
      items.push({
        text: "Mute",
        action: function () {
          App.mute_tabs(item)
        }
      })
    }

    items.push({
      separator: true
    })
  }

  items.push({
    text: "Filter",
    action: function () {
      App.filter_domain(item)
    }
  })

  items.push({
    text: "Copy",
    items: [
    {
      text: "Copy URL",
      action: function () {
        App.copy_to_clipboard(item.url)
      }
    },
    {
      text: "Copy Title",
      action: function () {
        App.copy_to_clipboard(item.title)
      }
    }]
  })

  if (item.mode === "tabs") {
    items.push({
      text: "More",
      get_items: function () { return App.get_more_menu_items(item) }
    })

    items.push({
      separator: true
    })

    items.push({
      text: "Close",
      action: function () {
        App.close_tabs(item)
      }
    })
  }
  else {
    items.push({
      text: "Launch",
      action: function () {
        App.launch_items(item)
      }
    })
  }
  
  NeedContext.show(x, y, items)
}

// Show tab move menu
App.get_move_menu_items = async function (item) {
  let items = []
  let wins = await browser.windows.getAll({populate: false})

  items.push({
    text: "Detach",
    action: function () {
      App.detach_tab(item)
    }
  })

  for (let win of wins) {
    if (item.window_id === win.id) {
      continue
    }

    let s = `${win.title.substring(0, 25).trim()} (ID: ${win.id})`
    let text = `Move to: ${s}`

    items.push({
      text: text,
      action: function () {
        App.move_tabs(win.id)
      }
    })
  }

  return items
}

// Show tab more menu
App.get_more_menu_items = function (item) {
  let items = []

  items.push({
    text: "Duplicate",
    action: function () {
      App.duplicate_tab(item)
    }
  })

  if (!item.discarded) {
    items.push({
      text: "Suspend",
      action: function () {
        App.suspend_tabs()
      }
    })
  }

  items.push({
    text: "Move",
    get_items: async function () { return await App.get_move_menu_items(item) }
  })

  return items
}

// Process items
App.process_items = function (mode, items) {
  let container = App.el(`#${mode}_container`)
  container.innerHTML = ""
  App[`${mode}_items`] = []
  App[`${mode}_idx`] = 0
  App[`${mode}_items_original`] = items
  let exclude = []

  for (let item of items) {
    let obj = App.process_item(mode, item, exclude)

    if (!obj) {
      continue
    }

    if (mode === "closed" || mode === "history") {
      exclude.push(obj.url)
    }

    App.get_items(mode).push(obj)
    container.append(obj.element)
  }

  App.update_footer_count.now(mode)

  if (mode === "tabs") {
    App.do_check_playing(mode)
  }
}

// Process an item
App.process_item = function (mode, item, exclude = [], o_item) {
  if (!item || !item.url) {
    return false
  }

  try {
    url_obj = new URL(item.url)
    decodeURI(item.url)
  } catch (err) {
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

  if (mode === "tabs") {
    obj.active = item.active
    obj.pinned = item.pinned
    obj.audible = item.audible
    obj.muted = item.mutedInfo.muted
    obj.discarded = item.discarded
    obj.date = item.lastAccessed
  }
  else if (mode === "history") {
    obj.date = item.lastVisitTime
  }
  else if (mode === "closed") {
    obj.date = item.lastAccessed
  }

  if (o_item) {
    o_item = Object.assign(o_item, obj)
    App.create_item_element(o_item)
  }
  else {
    obj.id = item.id || App[`${mode}_idx`]
    obj.visible = true
    obj.highlighted = false
    App.create_empty_item_element(obj)
    App[`${mode}_idx`] += 1
    return obj
  }
}

// Create empty item
App.create_empty_item_element = function (item) {
  item.element = App.create("div", `item ${item.mode}_item action`)
  item.element.dataset.id = item.id
  App[`${item.mode}_item_observer`].observe(item.element)
}

// Create an item element
App.create_item_element = function (item) {
  item.element.innerHTML = ""

  if (item.mode === "tabs") {
    item.element.draggable = true
  }

  let icon = App.get_img_icon(item.favicon, item.url, item.pinned)
  item.element.append(icon)

  let status = App.create("div", "item_status hidden")
  item.element.append(status)

  let text = App.create("div", "item_text")
  item.element.append(text)
  App.set_item_text(item)

  if (item.mode === "tabs") {
    let pin_icon = App.create("div", "item_info item_info_pin transparent")
    pin_icon.textContent = App.settings.pin_icon

    if (item.pinned) {
      pin_icon.classList.remove("transparent")
      pin_icon.title = "This tab is pinned"
    }

    item.element.append(pin_icon)
  }
  else {
    let launched = App.create("div", "item_info item_info_launched")
    item.element.append(launched)
  }

  if (item.highlighted) {
    item.element.classList.add("highlighted")
  }
  else {
    item.element.classList.remove("highlighted")
  }

  item.created = true
  console.info(`Item created in ${item.mode}`)
}

// Get image favicon
App.get_img_icon = function (favicon, url) {
  let icon = App.create("img", "item_icon")
  icon.loading = "lazy"
  icon.width = App.icon_size
  icon.height = App.icon_size

  App.ev(icon, "error", function () {
    let icon_2 = App.get_jdenticon(url)
    icon.replaceWith(icon_2)
  })

  icon.src = favicon
  return icon
}

// Get jdenticon icon
App.get_jdenticon = function (url) {
  let hostname = App.get_hostname(url) || "hostname"
  let icon = App.create("canvas", "item_icon")
  icon.width = App.icon_size
  icon.height = App.icon_size
  jdenticon.update(icon, hostname)
  return icon
}

// Set item text content
App.set_item_text = function (item) {
  if (item.mode === "tabs") {
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
      let status = App.el(".item_status", item.element)

      for (let icon of icons) {
        let el = App.create("div")
        el.textContent = icon
        status.append(el)
      }

      status.classList.remove("hidden")
    }
  }

  let content

  if (App.settings.text_mode === "title") {
    content = item.title || item.path
    item.footer = decodeURI(item.path) || item.title
  }
  else if (App.settings.text_mode === "url") {
    content = decodeURI(item.path) || item.title
    item.footer = item.title || item.path
  }

  content = content.substring(0, App.max_text_length).trim()
  let text = App.el(".item_text", item.element)
  text.textContent = content
}

// Get an item by id
App.get_item_by_id = function (mode, id) {
  id = id.toString()

  for (let item of App.get_items(mode)) {
    if (item.id.toString() === id) {
      return item
    }
  }
}

// Get an item by url
App.get_item_by_url = function (mode, url) {
  for (let item of App.get_items(mode)) {
    if (item.url) {
      if (App.urls_equal(item.url, url)) {
        return item
      }
    }
  }
}

// Used for lazy-loading components
App.start_item_observers = function () {
  for (let mode of App.item_order) {
    let options = {
      root: App.el(`#${mode}_container`),
      rootMargin: "0px",
      threshold: 0.1,
    }

    App.intersection_observer(mode, options)
  }
}

// Start intersection observer
App.intersection_observer = function (mode, options) {
  App[`${mode}_item_observer`] = new IntersectionObserver(function (entries) {
    for (let entry of entries) {
      if (!entry.isIntersecting) {
        continue
      }

      if (!entry.target.classList.contains("item")) {
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
App.get_last_window_value = function (cycle) {
  let last_mode = App.window_mode

  if (!App.item_order.includes(last_mode)) {
    last_mode = "tabs"
  }

  let value = ""

  if (cycle) {
    value = App.get_filter(last_mode, false)
  }

  return value
}

// Show a window by mode
App.show_item_window = async function (mode, cycle = false) {
  let value = App.get_last_window_value(cycle)
  App.windows[mode].show()
  App.empty_footer_info()
  App[`${mode}_item_filter`].cancel()
  App.el(`#${mode}_container`).innerHTML = ""
  App.set_filter(mode, value, false)

  let m = App[`${mode}_filter_modes`][0]
  App.set_filter_mode(mode, m, false)
  App[`${mode}_filter_mode`] = m[0]

  let items = await App[`get_${mode}`]()

  if (mode !== App.window_mode) {
    return
  }

  if (mode === "history" && value) {
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
App.setup_item_window = function (mode) {
  let args = {}
  args.id = mode
  args.close_button = false
  args.align_top = "left"

  args.setup = function () {
    App[`${mode}_item_filter`] = App.create_debouncer(function () {
      App.do_item_filter(mode)
    }, App.filter_delay)

    let win = App.el(`#window_content_${mode}`)
    let container = App.create("div", "container unselectable", `${mode}_container`)
    let footer = App.create("div", "footer unselectable", `${mode}_footer`)
    let top = App.create("div", "item_top_container", `${mode}_top_container`)
    App.el(`#window_top_${mode}`).append(top)

    win.append(container)
    win.append(footer)

    let footer_count = App.create("div", "footer_count action")
    footer_count.textContent = "(--)"

    App.ev(footer_count, "click", function () {
      App.highlight_items(mode)
    })

    footer.append(footer_count)
    footer.append(App.create_icon("cube"))

    let footer_info = App.create("div", "footer_info")
    footer.append(footer_info)

    App.setup_window_mouse(mode)

    //
    let main_menu = App.create("div", "button icon_button", `${mode}_main_menu`)
    main_menu.title = "Main Menu (Ctrl + Left)"
    let main_menu_icon = App.create_icon("triangle")

    App.ev(main_menu, "click", function () {
      App.show_main_menu(mode)
    })

    main_menu.append(main_menu_icon)

    App.ev(main_menu, "wheel", function (e) {
      if (e.deltaY < 0) {
        App.cycle_item_windows(true)
      }
      else {
        App.cycle_item_windows(false)
      }
    })

    //
    let filter = App.create("input", "text filter", `${mode}_filter`)
    filter.type = "text"
    filter.autocomplete = "off"
    filter.spellcheck = false
    filter.placeholder = App.get_mode_name(mode)

    App.ev(filter, "input", function () {
      App[`${mode}_item_filter`].call()
    })

    //
    let filter_modes = App.create("div", "button icon_button", `${mode}_filter_modes`)
    filter_modes.title = "Filter Modes (Ctrl + Down)"
    let filter_modes_icon = App.create_icon("triangle")
    let filter_modes_text = App.create("div", "", `${mode}_filter_modes_text`)
    filter_modes.append(filter_modes_text)
    filter_modes.append(filter_modes_icon)

    App[`${mode}_filter_modes`] = App[`${mode}_filter_modes`] || []
    App[`${mode}_filter_modes`].unshift(["videos", "Videos"])
    App[`${mode}_filter_modes`].unshift(["images", "Images"])
    App[`${mode}_filter_modes`].unshift(["all", "All"])

    App.ev(filter_modes, "click", function () {
      App.show_filter_modes(mode)
    })

    App.ev(filter_modes, "wheel", function (e) {
      if (e.deltaY < 0) {
        App.cycle_filter_modes(mode, true)
      }
      else {
        App.cycle_filter_modes(mode, false)
      }
    })

    //
    let playing

    if (mode === "tabs") {
      playing = App.create("div", "button icon_button hidden", `${mode}_playing`)
      playing.title = "Go To Playing Tab (Ctrl + Up)"
      let playing_icon = App.create_icon("speaker")

      App.ev(playing, "click", function () {
        App.go_to_playing()
      })

      playing.append(playing_icon)
    }

    //
    if (!App[`${mode}_actions`]) {
      App[`${mode}_actions`] = []
    }

    App[`${mode}_actions`].unshift({text: "Bottom", action: function () {
      App.goto_bottom(mode)
    }})

    App[`${mode}_actions`].unshift({text: "Top", action: function () {
      App.goto_top(mode)
    }})

    let actions_menu = App.create("div", "button icon_button", `${mode}_actions`)
    let actions_icon = App.create_icon("triangle")
    let actions_text = App.create("div")
    actions_text.textContent = "Actions"
    actions_menu.append(actions_text)
    actions_menu.append(actions_icon)
    actions_menu.title = "Actions (Ctrl + Right)"

    App[`show_${mode}_actions`] = function () {
      let items = []

      for (let item of App[`${mode}_actions`]) {
        if (item.text === "--separator--") {
          items.push({separator: true})
          continue
        }

        if (item.conditional) {
          items.push(item.conditional())
        }
        else if (item.action) {
          items.push({text: item.text, action: function () {
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

      NeedContext.show_on_element(actions_menu, items, true, actions_menu.clientHeight)
    }

    App.ev(actions_menu, "click", function () {
      App.show_actions(mode)
    })

    //
    if (mode === "tabs") {
      App.setup_drag(mode, container)
    }

    // Append the top components
    let left_top = App.create("div", "item_top_left")
    let right_top = App.create("div", "item_top_right")

    left_top.append(main_menu)
    left_top.append(filter)

    if (playing) {
      right_top.append(playing)
    }

    right_top.append(filter_modes)
    right_top.append(actions_menu)

    top.append(left_top)
    top.append(right_top)
  }

  App.create_window(args)
}

// Cycle between item windows
App.cycle_item_windows = function (reverse = false, cycle = false) {
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
App.update_item_order = function () {
  let boxes = App.els(".item_order_row", App.el("#settings_item_order"))
  let modes = boxes.map(x => x.dataset.mode)

  for (let [i, mode] of modes.entries()) {
    App.settings[`${mode}_index`] = i
  }

  App.stor_save_settings()
  App.get_item_order()
}

// Window order up
App.item_order_up = function (el) {
  let prev = el.previousElementSibling

  if (prev) {
    el.parentNode.insertBefore(el, prev)
    App.update_item_order()
  }
}

// Window order down
App.item_order_down = function (el) {
  let next = el.nextElementSibling

  if (next) {
    el.parentNode.insertBefore(next, el)
    App.update_item_order()
  }
}

// Show first item window
App.show_first_item_window = function () {
  App.show_item_window(App.item_order[0])
}

// Focus an open tab or launch a new one
App.focus_or_open_item = async function (item, close = true) {
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
App.get_item_order = function () {
  let items = []

  for (let mode of App.item_modes) {
    items.push({mode: mode, index: App.settings[`${mode}_index`]})
  }

  items.sort((a, b) => (a.index > b.index) ? 1 : -1)
  App.item_order = items.map(x => x.mode)
}

// Update footer count
App.do_update_footer_count = function (mode) {
  let n1 = App.get_highlights(mode).length
  let n2 = App.get_visible(mode).length
  let s1 = n1.toLocaleString()
  let s2 = n2.toLocaleString()
  let footer = App.el(`#${mode}_footer`)
  let count = App.el(".footer_count", footer)

  if (n1 > 0) {
    count.textContent = `${s1} of ${s2} items`
  }
  else {
    count.textContent = `${s2} ${App.plural_2(n2, "item", "items")}`
  }
}

// Set item filter
App.set_filter = function (mode, text, action = true) {
  App.el(`#${mode}_filter`).value = text

  if (action) {
    App.do_item_filter(mode)
  }
}

// Get filter value
App.get_filter = function (mode, trim = true) {
  let value = App.el(`#${mode}_filter`).value

  if (trim) {
    value = value.trim()
  }

  return value
}

// Any item visible
App.any_item_visible = function (mode) {
  for (let item of App.get_items(mode)) {
    if (item.visible) {
      return true
    }
  }

  return false
}

// Get number of visible items
App.get_visible = function (mode) {
  let items = []

  for (let item of App.get_items(mode)) {
    if (item.visible) {
      items.push(item)
    }
  }

  return items
}

// Clear the filter
App.clear_filter = function (mode) {
  App.set_filter(mode, "", false)
  App.do_item_filter(mode)
  App.focus_filter(mode)
}

// Show launched indicator
App.show_launched = function (item) {
  let launched = App.el(".item_info_launched", item.element)
  launched.textContent = "(Launched)"
}

// Update item
App.update_item = function (mode, id, info) {
  for (let item of App.get_items(mode)) {
    if (item.id === id) {
      App.process_item(mode, info, [], item)
      break
    }
  }
}

// Show similar tabs
App.filter_domain = function (item) {
  let hostname = App.get_hostname(item.url)

  if (!hostname && item.url.includes(":")) {
    hostname = item.url.split(":")[0] + ":"
  }

  if (!hostname) {
    return
  }

  App.set_filter(item.mode, hostname)
}

// Show the actions menu
App.show_actions = function (mode) {
  App[`show_${mode}_actions`]()
}

// Show filter modes
App.show_filter_modes = function (mode) {
  let items = []

  for (let filter_mode of App[`${mode}_filter_modes`]) {
    let selected = App[`${mode}_filter_mode`] === filter_mode[0]

    items.push({
      text: filter_mode[1],
      action: function () {
        App.set_filter_mode(mode, filter_mode)
      },
      selected: selected
    })
  }

  let btn = App.el(`#${mode}_filter_modes`)
  NeedContext.show_on_element(btn, items, false, btn.clientHeight)
}

// Cycle filter modes
App.cycle_filter_modes = function (mode, reverse = true) {
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
App.set_filter_mode = function (mode, filter_mode, action = true) {
  App[`${mode}_filter_mode`] = filter_mode[0]
  App.el(`#${mode}_filter_modes_text`).textContent = filter_mode[1]

  if (action) {
    if (filter_mode[0] === "all") {
      App.clear_filter(mode)
    }
  }

  App.do_item_filter(mode)
}

// Get mode index
App.get_mode_index = function (mode) {
  for (let [i, it] of App.item_order.entries()) {
    if (it === mode) {
      return i
    }
  }
}

// Get item's element index
App.get_item_element_index = function (mode, el) {
  let nodes = Array.prototype.slice.call(App.els(`.${mode}_item`))
  return nodes.indexOf(el)
}

// Move an item to another place in an item list
App.move_item = function (mode, from_index, to_index) {
  let it = App.get_items(mode).splice(from_index, 1)[0]
  App.get_items(mode).splice(to_index, 0, it)
  App.move_item_element(mode, it.element, to_index)
}

// Move item element
App.move_item_element = function (mode, el, to_index) {
  let container = App.el(`#${mode}_container`)
  let items = App.els(`.${mode}_item`)
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
App.highlight_range = function (item) {
  if (item.highlighted) {
    App.dehighlight(item.mode)
    return
  }

  App.toggle_highlight(item, true)

  if (App.last_highlight && App.last_highlight.highlighted) {
    let items = App[`${item.mode}_items`]
    let index_1 = items.indexOf(item)
    let index_2 = items.indexOf(App.last_highlight)

    if (index_1 < index_2) {
      for (let it of items.slice(index_1 + 1, index_2)) {
        if (!it.visible) {
          continue
        }

        App.toggle_highlight(it, true)
      }
    }
    else if (index_1 > index_2) {
      for (let it of items.slice(index_2 + 1, index_1)) {
        if (!it.visible) {
          continue
        }

        App.toggle_highlight(it, true)
      }
    }
  }

  App.last_highlight = item
}

// Dehighlight items
App.dehighlight = function (mode) {
  let some = false

  for (let item of App.get_items(mode)) {
    if (item.highlighted) {
      App.toggle_highlight(item)
      some = true
    }
  }

  App.last_highlight = undefined
  return some
}

// Highlight or dehighlight an item
App.toggle_highlight = async function (item, what) {
  let highlight

  if (what !== undefined) {
    highlight = what
  }
  else {
    highlight = !item.highlighted
  }

  if (highlight) {
    item.element.classList.add("highlighted")
  }
  else {
    item.element.classList.remove("highlighted")
  }

  item.highlighted = highlight
  App.update_footer_count.call(item.mode)
}

// Get highlighted items
App.get_highlights = function (mode) {
  let ans = []

  for (let item of App.get_items(mode)) {
    if (item.highlighted) {
      ans.push(item)
    }
  }

  return ans
}

// Launch an item
App.launch_item = function (item, close = true) {
  App.open_tab(item.url, close)

  if (close) {
    App.close_window()
  }
  else {
    App.show_launched(item)
  }
}

// Launch items
App.launch_items = function (item) {
  let mode = item.mode
  let items = App.get_active_items(mode, item)

  if (items.length === 1) {
    App.open_tab(items[0].url, false)
    App.show_launched(items[0])
    return
  }

  let s = App.plural(items.length, "item", "items")

  App.show_confirm(`Launch ${s}?`, function () {
    for (let item of items) {
      App.launch_item(item, false)
    }

    App.dehighlight(mode)
  }, function () {
    App.dehighlight(mode)
  })
}

// Scroll container to top
App.goto_top = function (mode) {
  App.el(`#${mode}_container`).scrollTop = 0
}

// Scroll container to bottom
App.goto_bottom = function (mode) {
  App.el(`#${mode}_container`).scrollTop = App.el(`#${mode}_container`).scrollHeight
}

// Highlight visible items
App.highlight_items = function (mode) {
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
App.get_visible_media = function (mode, what) {
  let items = []

  for (let item of App.get_items(mode)) {
    if (item[what]) {
      items.push(item)
    }
  }

  return items
}

// Create an svg icon
App.create_icon = function (name, type = 1) {
  let icon = document.createElementNS("http://www.w3.org/2000/svg", "svg")
  icon.classList.add(`icon_${type}`)
  let icon_use = document.createElementNS("http://www.w3.org/2000/svg", "use")
  icon_use.href.baseVal = `#${name}_icon`
  icon.append(icon_use)
  return icon
}

// Show main menu
App.show_main_menu = function (mode) {
  let el = App.el(`#${mode}_main_menu`)
  let items = []

  if (App.get_filter(mode)) {
    items.push({
      text: "Clear",
      action: function () {
        App.clear_filter(mode)
      }
    })

    items.push({
      separator: true
    })
  }

  for (let m of App.item_order) {
    items.push({
      text: App.get_mode_name(m),
      action: function () {
        App.show_item_window(m)
      },
      selected: m === mode
    })
  }

  items.push({
    separator: true
  })

  items.push({
    text: "Settings",
    action: function () {
      App.show_window("settings_basic")
    }
  })

  items.push({
    text: "About",
    action: function () {
      App.show_window("about")
    }
  })

  NeedContext.show_on_element(el, items, true, el.clientHeight)
}

// Get active items
App.get_active_items = function (mode, item) {
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
App.insert_item = function (mode, info) {
  let item = App.process_item(mode, info)
  App.get_items(mode).splice(info.index, 0, item)
  App.el(`#${mode}_container`).append(item.element)

  if (mode === "tabs") {
    App.move_item_element("tabs", item.element, info.index)
  }

  App.update_footer_count.call(mode)
  return item
}

// Get mode name
App.get_mode_name = function (mode) {
  return App.capitalize(mode)
}

// Item action
App.item_action = function (item) {
  let highlighted = App.get_highlights(item.mode)

  if (highlighted.length > 0) {
    App.launch_items(item)
  }
  else {
    if (App.check_media(item)) {
      return
    }

    App.focus_or_open_item(item)
  }
}

// Item action
App.item_action_alt = function (item) {
  let highlighted = App.get_highlights(item.mode)

  if (highlighted.length > 0) {
    App.launch_items(item)
  }
  else {
    App.launch_item(item, false)
  }
}

// Setup drag events
App.setup_drag = function (mode, container) {
  container.addEventListener("dragstart", function (e) {
    if (App.settings.lock_drag && !e.ctrlKey) {
      e.preventDefault()
      return
    }

    App.drag_y = e.clientY
    App.drag_element = e.target.closest(".item")
    let id = App.drag_element.dataset.id
    App.drag_item = App.get_item_by_id(mode, id)
    App.drag_start_index = App.get_item_element_index(mode, App.drag_element)
    e.dataTransfer.setDragImage(new Image(), 0, 0)
    e.dataTransfer.setData("text/plain", App.drag_item.url)

    App.drag_items = []

    if (App.drag_item.highlighted) {
      for (let tab of App.get_items(mode)) {
        if (tab.highlighted) {
          App.drag_items.push(tab)
        }
      }
    }
    else {
      App.drag_items.push(App.drag_item)
    }

    App.drag_els = []

    for (let tab of App.drag_items) {
      App.drag_els.push(tab.element)
    }

    App.drag_moved = false
  })

  container.addEventListener("dragend", function () {
    if (!App.drag_moved) {
      return
    }

    App.dehighlight(mode)
    App.update_tab_index()
  })

  container.addEventListener("dragover", function (e) {
    let direction = e.clientY > App.drag_y ? "down" : "up"
    App.drag_y = e.clientY

    if (e.target.closest(".item")) {
      let el = e.target.closest(".item")

      if (App.drag_els.includes(el)) {
        e.preventDefault()
        return false
      }

      let target = App.get_item_by_id(mode, el.dataset.id)

      for (let item of App.drag_items) {
        if ((target.pinned && !item.pinned) || (!target.pinned && item.pinned)) {
          e.preventDefault()
          return false
        }
      }

      if (direction === "down") {
        el.after(...App.drag_els)
      }
      else {
        el.before(...App.drag_els)
      }

      App.drag_moved = true
    }

    e.preventDefault()
    return false
  })
}