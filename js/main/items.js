// Setup items
App.setup_items = function () {
  App.get_item_order()
  App.start_item_observers()
}

// Select an item
App.select_item = function (mode, item) {
  if (App[`selected_${mode}_item`] === item) {
    return
  }

  if (!item.created) {
    App.create_item_element(mode, item)
  }

  for (let el of App.els(`.${mode}_item`)) {
    el.classList.remove("selected")
  }

  App[`selected_${mode}_item`] = item
  App[`selected_${mode}_item`].element.classList.add("selected")
  App[`selected_${mode}_item`].element.scrollIntoView({block: "nearest"})

  App.update_footer(mode)

  if (mode === "tabs") {
    browser.tabs.warmup(item.id)
  }
}

// Select item above
App.select_item_above = function (mode) {
  let item = App.get_prev_visible_item(mode)

  if (item) {
    App.select_item(mode, item)
  }
}

// Select item below
App.select_item_below = function (mode) {
  let item = App.get_next_visible_item(mode)

  if (item) {
    App.select_item(mode, item)
  }
}

// Get next item that is visible
App.get_next_visible_item = function (mode) {
  let waypoint = false
  
  if (!App.selected_valid(mode)) {
    waypoint = true
  }
  
  let items = App[`${mode}_items`]
  let o_item = App[`selected_${mode}_item`]

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
}

// Get prev item that is visible
App.get_prev_visible_item = function (mode) {
  let waypoint = false

  if (!App.selected_valid(mode)) {
    waypoint = true
  }

  let items = App[`${mode}_items`]
  let o_item = App[`selected_${mode}_item`]

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
}

// Updates a footer
App.update_footer = function (mode) {
  if (App.selected_valid(mode)) {
    App.set_footer(mode, App[`selected_${mode}_item`].footer)
  } else {
    App.empty_footer(mode)
  }
}

// Empty the footer
App.empty_footer = function (mode) {
  App.set_footer(mode, "No Results")
}

// Set footer
App.set_footer = function (mode, text) {
  let footer = App.el(`#${mode}_footer`)
  let right = App.el(".footer_right", footer)
  right.textContent = text
}

// Check if selected is valid
App.selected_valid = function (mode) {
  return App[`selected_${mode}_item`] && 
  App[`selected_${mode}_item`].created &&
  App[`selected_${mode}_item`].visible
}

// Select first item
App.select_first_item = function (mode) {
  for (let item of App[`${mode}_items`]) {
    if (item.visible) {
      App.select_item(mode, item)
      return
    }
  }
}

// Remove an item from the list
App.remove_item = function (mode, item) {
  let next_item = App.get_next_visible_item(mode, item) || App.get_prev_visible_item(mode, item)
  let items = App[`${mode}_items`]
  item.element.remove()
  let id = item.id.toString()
  
  for (let [i, it] of items.entries()) {
    if (it.id.toString() === id) {
      items.splice(i, 1)
      break
    }
  }
  
  if (next_item) {
    App.select_item(mode, next_item)
  } else {
    App.select_first_item(mode)
  }

  App.update_info(mode)
}

App.focus_filter = function (mode) {
  App.el(`#${mode}_filter`).focus()
}

// Filter items
App.do_item_filter = async function (mode) {  
  console.info(`Filter: ${mode}`)

  if (mode === "history") {
    await App.search_history()
  }

  if (!App[`${mode}_items`]) {
    return
  }  

  let value = App.el(`#${mode}_filter`).value.trim()

  if (value === "iddqd") {
    App.el("#main").classList.add("invert")
    App.set_filter(mode, "")
    return
  } else if (value === "idkfa") {
    App.el("#main").classList.add("hue_rotate")
    App.set_filter(mode, "")
    return
  }

  let filter_mode
  let filter_mode_select = App.el(`#${mode}_filter_mode`)

  if (filter_mode_select) {
    filter_mode = filter_mode_select.value
  } else {
    filter_mode = "all"
  }

  let words = value.split(" ").filter(x => x !== "")
  let filter_words = words.map(x => x.toLowerCase())

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
      } else if (filter_mode === "normal") {
        match = !item.audible && !item.pinned
      } else if (filter_mode === "playing") {
        match = item.audible
      } else if (filter_mode === "pins") {
        match = item.pinned
      } else if (filter_mode === "muted") {
        match = item.muted
      } else if (filter_mode === "secure") {
        match = item.protocol === "https:"
      } else if (filter_mode === "insecure") {
        match = item.protocol === "http:"
      } else if (filter_mode === "suspended") {
        match = item.discarded
      } else if (filter_mode === "this_window") {
        match = item.window_id === App.window_id
      } else if (filter_mode === "other_window") {
        match = item.window_id !== App.window_id
      }
    }
        
    return match
  }

  for (let it of App[`${mode}_items`]) {
    if (!it.element) {
      continue
    }

    if (matched(it)) {
      App.show_item(it)
    } else {
      App.hide_item(it)
    }
  }
  
  App[`selected_${mode}_item`] = undefined
  App.select_first_item(mode)
  App.update_footer(mode)
  App.update_info(mode)
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
App.show_item_menu = function (mode, item, x, y) {
  let items = []

  if (mode === "tabs") {
    if (item.pinned) {
      items.push({
        text: "Unpin",
        action: function () {
          App.unpin_tab(item.id)
        }
      })
    } else {
      items.push({
        text: "Pin",
        action: function () {
          App.pin_tab(item.id)
        }
      })
    }
  
    if (item.muted) {
      items.push({
        text: "Unmute",
        action: function () {
          App.unmute_tab(item.id)
        }
      })
    } else {
      items.push({
        text: "Mute",
        action: function () {
          App.mute_tab(item.id)
        }
      })
    }
  }

  items.push({
    text: "Star...",
    action: function () {
      App.add_or_edit_star(item)
    }
  })

  items.push({
    text: "Copy...",
    action: function () {
      App.show_copy_menu(x, y, item)
    }
  })  

  if (mode === "tabs") {
    items.push({
      text: "Move...",
      action: function () {
        App.show_move_menu(x, y, item)
      }
    })     
    
    items.push({
      text: "More...",
      action: function () {
        App.show_more_menu(x, y, item)
      }
    })     

    items.push({
      text: "Close",
      action: function () {
        App.confirm_close_tab(item)
      }
    })
  }

  if (App[`selected_${mode}_item`] !== item) {
    App.select_item(mode, item)
  }

  NeedContext.show(x, y, items)
}

// Show copy menu
App.show_copy_menu = function (x, y, item) {
  let items = []

  items.push({
    text: "Copy URL",
    action: function () {
      App.copy_to_clipboard(item.url)
    }
  })

  items.push({
    text: "Copy Title",
    action: function () {
      App.copy_to_clipboard(item.title)
    }
  })

  NeedContext.show(x, y, items)
}

// Show tab move menu
App.show_move_menu = async function (x, y, item) {
  let items = []
  let wins = await browser.windows.getAll({populate: false}) 
  
  items.push({
    text: "New Window",
    action: function () {
      App.detach_tab(item)
    }
  })  

  for (let win of wins) {
    if (item.window_id === win.id) {
      continue
    }
    
    let text

    if (win.id === App.window_id) {
      text = "This Window"
    } else {
      let s = `${win.title.substring(0, 25).trim()} (ID: ${win.id})`
      text = `Move to: ${s}`
    }

    items.push({
      text: text,
      action: function () {
        App.move_tab(item, win.id)
      }
    })
  }

  NeedContext.show(x, y, items)
}

// Show tab more menu
App.show_more_menu = async function (x, y, item) {
  let items = []

  if (!item.discared) {
    items.push({
      text: "Similar",
      action: function () {
        App.set_filter("tabs", App.get_hostname(item.url))
      }
    })  
  }  

  items.push({
    text: "Duplicate",
    action: function () {
      App.duplicate_tab(item)
    }
  })  

  if (!item.discared) {
    items.push({
      text: "Suspend",
      action: function () {
        App.suspend_tab(item)
      }
    })  
  }  

  NeedContext.show(x, y, items)
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

    App[`${mode}_items`].push(obj)
    container.append(obj.element)
  }

  App.update_info(mode)
}

// Process an item
App.process_item = function (mode, item, exclude = []) {
  if (!item || !item.url) {
    return false
  }

  try {
    url_obj = new URL(item.url)
  } catch (err) {
    return false
  }

  let url = App.format_url(item.url)

  if (exclude.includes(url)) {
    return false
  }

  let path = App.remove_protocol(url)
  let title = item.title || path

  let obj = {
    id: item.id || App[`${mode}_idx`],
    title: title,
    title_lower: title.toLowerCase(),
    url: url,
    path: path,
    path_lower: path.toLowerCase(),
    favicon: item.favIconUrl,
    empty: false,
    created: false,
    mode: mode,
    protocol: url_obj.protocol,
    closed: false,
    window_id: item.windowId,
    session_id: item.sessionId,
    visible: true
  }
  
  if (mode === "tabs") {
    obj.index = item.index,
    obj.active = item.active
    obj.pinned = item.pinned
    obj.audible = item.audible
    obj.muted = item.mutedInfo.muted
    obj.discarded = item.discarded
  }

  App.create_empty_item_element(mode, obj)
  App[`${mode}_idx`] += 1
  return obj
}

// Create empty item
App.create_empty_item_element = function (mode, item) {
  item.element = App.create("div", `item ${mode}_item item_empty`)
  item.element.dataset.id = item.id
  App[`${mode}_item_observer`].observe(item.element)
}

// Create an item element
App.create_item_element = function (mode, item) {
  item.element.classList.remove("item_empty")
  
  let icon = App.get_img_icon(item.favicon, item.url, item.pinned)
  item.element.append(icon)

  let text = App.create("div", "item_text")
  item.element.append(text)
  App.set_item_text(mode, item)
  let info_container = App.create("div", "item_info_container")

  if (mode === "tabs") {   
    if (App.settings.all_windows) {
      let window_icon = App.create("div", "item_info faded")
      window_icon.textContent = App.settings.window_icon
      info_container.append(window_icon)
      
      if (item.window_id === App.window_id) {
        window_icon.title = "This tab belongs to the current window"
        window_icon.classList.remove("faded")
      }
    }     

    let pin_icon = App.create("div", "item_info faded")
    pin_icon.textContent = App.settings.pin_icon
    info_container.append(pin_icon)
    
    if (item.pinned) {
      pin_icon.title = "This tab is pinned"  
      pin_icon.classList.remove("faded")
    }
  } else {
    let launched = App.create("div", "item_info item_info_launched")
    info_container.append(launched)
  }

  item.element.append(info_container)
  item.created = true
  console.info(`Item created in ${mode}`)
}

// Get image favicon
App.get_img_icon = function (favicon, url, pinned = false) {
  let icon = App.create("img", "item_icon")
  icon.loading = "lazy"
  icon.width = 25
  icon.height = 25

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
  icon.width = 25
  icon.height = 25
  jdenticon.update(icon, hostname)
  return icon
}

// Set item text content
App.set_item_text = function (mode, item) {
  let content = ""

  if (mode === "tabs") {
    let status = []

    if (item.discarded) {
      status.push("Suspended")
    }
    
    if (item.audible) {
      status.push("Playing")
    }
  
    if (item.muted) {
      status.push("Muted")
    }
  
    if (status.length > 0) {
      content = status.map(x => `(${x})`).join(" ")
      content += "  "
    }
  }

  if (App.settings.text_mode === "title") {
    content += item.title || item.path
    item.footer = decodeURI(item.path) || item.title
  } else if (App.settings.text_mode === "url") {
    content += decodeURI(item.path) || item.title
    item.footer = item.title || item.path
  }

  content = content.substring(0, 200).trim()
  let text = App.el(".item_text", item.element)
  text.textContent = content
}

// Get an item by id
App.get_item_by_id = function (mode, id) {
  id = id.toString()

  for (let item of App[`${mode}_items`]) {
    if (item.id.toString() === id) {
      return item
    }
  }
}

// Get an item by url
App.get_item_by_url = function (mode, url) {
  for (let item of App[`${mode}_items`]) {
    if (App.urls_equal(item.url, url)) {
      return item
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
        App.create_item_element(mode, item)
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
    let search = App.el(`#${last_mode}_search`)

    if (search && search.value.trim()) {
      value = search.value.trim()
    } else {
      value = App.el(`#${last_mode}_filter`).value.trim()
    }
  }

  return value
}

// Show a window by mode
App.show_item_window = async function (mode, cycle = false) {  
  let value = App.get_last_window_value(cycle)
  App.windows[mode].show()
  App.empty_footer(mode)

  App.el(`#${mode}_container`).innerHTML = ""
  App.el(`#${mode}_filter`).value = value
  App.el(`#${mode}_select`).value = mode
  
  let filter_mode = App.el(`#${mode}_filter_mode`)

  if (filter_mode) {
    filter_mode.selectedIndex = 0
  }

  let items = await App[`get_${mode}`]()
  
  if (mode !== App.window_mode) {
    return
  }
  
  App.process_items(mode, items)

  if (value) {
    App.do_item_filter(mode)
  } else {
    App.select_first_item(mode)
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
    let item_filter = App.create_debouncer(function () {
      App.do_item_filter(mode)
    }, App.filter_delay)

    let win = App.el(`#window_content_${mode}`)
    let container = App.create("div", "container unselectable", `${mode}_container`)
    let footer = App.create("div", "footer unselectable", `${mode}_footer`)
    let top = App.el(`#${mode}_top_container`)

    win.append(container)
    win.append(footer)

    let clear_filter = App.create("button", "button clear_filter_button", `${mode}_clear_filter`)
    clear_filter.title = "Clear Filter"
    clear_filter.textContent = "X"

    App.ev(clear_filter, "click", function () {
      App.clear_filter(mode)
    })  

    top.prepend(clear_filter)

    let generic_filter_mode = App.el(".generic_filter_mode", top)

    if (generic_filter_mode) {
      let select = App.create("select", "select filter_mode_select", `${mode}_filter_mode`)
      select.title = "Filter Mode"
      
      let o1 = App.create("option")
      o1.value = "all"
      o1.selected = true
      o1.textContent = "All"
      select.append(o1)

      let o2 = App.create("option")
      o2.value = "secure"
      o2.textContent = "Secure"
      select.append(o2)

      let o3 = App.create("option")
      o3.value = "insecure"
      o3.textContent = "Insecure"
      select.append(o3)

      generic_filter_mode.replaceWith(select)
    }
    
    let filter = App.create("input", "filter", `${mode}_filter`)
    filter.type = "text"
    filter.autocomplete = "off"
    filter.placeholder = "Filter"

    App.ev(filter, "input", function () {
      item_filter()
    })  

    top.prepend(filter)

    let filter_mode = App.el(`#${mode}_filter_mode`)

    if (filter_mode) {
      App.ev(filter_mode, "change", function () {
        App.do_item_filter(mode)
      })
  
      App.wrap_select(filter_mode, function () {
        App.do_item_filter(mode)
      })    
    }

    let footer_left = App.create("div", "footer_left")
    footer.append(footer_left)

    let footer_right = App.create("div", "footer_right")
    footer.append(footer_right)

    let select = App.make_items_select(mode)
    top.prepend(select) 
    App.setup_window_mouse(mode) 
  }

  App.create_window(args) 
}

// Cycle between item windows
App.cycle_item_windows = function (reverse = false) {
  let modes = App.item_order
  let index = modes.indexOf(App.window_mode)
  let new_mode

  if (index === -1) {
    return
  }

  if (reverse) {
    if (index === 0) {
      new_mode = modes.slice(-1)[0]
    } else {
      new_mode = modes[index - 1]
    }
  } else {
    if (index === modes.length - 1) {
      new_mode = modes[0]
    } else {
      new_mode = modes[index + 1]
    }
  }

  App.show_item_window(new_mode, true)
}

// Update window order
App.update_item_order = function () {
  let boxes = App.els(".item_order_item", App.el("#item_order"))
  let modes = boxes.map(x => x.dataset.mode)

  for (let [i, mode] of modes.entries()) {
    App.settings[`${mode}_index`] = i
  }

  App.stor_save_settings()
  App.get_item_order()
  App.remake_items_selects()
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

// Make items select
App.make_items_select = function (mode) {
  let select = App.create("select", "select item_select", `${mode}_select`)

  for (let [i, m] of App.item_order.entries()) {
    let option = App.create("option")
    
    if (m === mode) {
      option.selected = true
    }

    option.value = m
    option.textContent = `${i + 1}. ${App.capitalize(m)}`
    select.append(option)
  }

  let separator = App.create("option")
  separator.value = "none"
  separator.textContent = "--------"
  separator.disabled = true
  select.append(separator)

  let settings = App.create("option")
  settings.value = "settings"
  settings.textContent = "Settings"
  select.append(settings)

  let about = App.create("option")
  about.value = "about"
  about.textContent = "About"
  select.append(about)

  App.ev(select, "change", function () {
    if (select.value === "none") {
      return
    }

    if (select.value === "settings") {
      App.show_window("settings")
    } else if (select.value === "about") {
      App.show_window("about")
    } else {
      App.show_item_window(select.value)
    }
  })
  
  App.wrap_select(select, function () {
    App.show_item_window(select.value, true)
  }, App.item_order.length)

  return select
}

// Remake item selects
App.remake_items_selects = function () {
  for (let mode of App.item_order) {
    let select = App.el(`#${mode}_select`)
    
    if (select) {
      select.replaceWith(App.make_items_select(mode))
    }
  }
}

// Show first item window
App.show_first_item_window = function () {
  App.show_item_window(App.item_order[0])
}

// Focus an open tab or launch a new one
App.focus_or_open_item = async function (item, close = true) {
  if (close) {
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
  }
  
  browser.tabs.create({url: item.url, active: close})

  if (close) {
    window.close()
  } else {
    App.show_launched(item)
  }
}

// Get window order
App.get_item_order = function () {
  let modes = ["tabs", "stars", "closed", "history"]
  let items = []

  for (let mode of modes) {
    items.push({mode: mode, index: App.settings[`${mode}_index`]})
  }

  items.sort((a, b) => (a.index > b.index) ? 1 : -1)
  App.item_order = items.map(x => x.mode)
}

// Update item info
App.update_info = function (mode) {
  let n1 = App.get_num_visible(mode).toLocaleString()
  let n2 = App[`${mode}_items`].length.toLocaleString()
  let footer = App.el(`#${mode}_footer`)
  let left = App.el(".footer_left", footer)

  if (n1 === n2) {
    left.textContent = `(${n1})`
  } else {
    left.textContent = `(${n1}/${n2})`
  }
}

// Set item filter
App.set_filter = function (mode, text) {
  App.el(`#${mode}_filter`).value = text
  App.do_item_filter(mode)
}

// Any item visible
App.any_item_visible = function (mode) {
  for (let item of App[`${mode}_items`]) {
    if (item.visible) {
      return true
    }
  }

  return false
}

// Get number of visible items
App.get_num_visible = function (mode) {
  let n = 0

  for (let item of App[`${mode}_items`]) {
    if (item.visible) {
      n += 1
    }
  }

  return n
}

// Clear the filter
App.clear_filter = function (mode) {
  App.el(`#${mode}_filter`).value = ""
  App.do_item_filter(mode)
  App.focus_filter(mode)
}

// Show launched indicator
App.show_launched = function (item) {
  let launched = App.el(".item_info_launched", item.element)
  launched.textContent = "(Launched)"
}

// Update item
App.update_item = function (mode, id, source) {
  for (let [i, it] of App[`${mode}_items`].entries()) {
    if (it.id !== id) {
      continue
    }
    
    let new_item = App.process_item(mode, source)
      
    if (!new_item) {
      break
    }

    if (!it.visible) {
      App.hide_item(new_item)
    }

    let selected = App[`selected_${mode}_item`] === it
    App.create_item_element(mode, new_item)
    App[`${mode}_items`][i].element.replaceWith(new_item.element)
    App[`${mode}_items`][i] = new_item

    if (selected) {
      App.select_item(mode, new_item)
    }

    break
  }
}