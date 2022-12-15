// Setup items
App.setup_items = function () {
  App.get_item_order()
  App.start_item_observers()

  App.update_footer_count = App.create_debouncer(function (mode) {
    App.do_update_footer_count(mode)
  }, 200)
}

// Block select for some ms
App.block_select = function () {
  App.select_blocked = true

  setTimeout(function () {
    App.select_blocked = false
  }, 100)
}

// Select an item
App.select_item = function (item, scroll = "nearest") {
  if (App[`selected_${item.mode}_item`] === item) {
    return
  }

  if (!item.created) {
    App.create_item_element(item)
  }

  App[`selected_${item.mode}_item`] = item
  
  for (let el of App.els(`.${item.mode}_item`)) {
    el.classList.remove("selected")
  }

  App[`selected_${item.mode}_item`].element.classList.add("selected")  

  if (scroll !== "none") {
    App[`selected_${item.mode}_item`].element.scrollIntoView({block: scroll})
  }

  App.update_footer(item.mode)

  if (item.mode === "tabs") {
    browser.tabs.warmup(item.id)
  }
}

// Select item above
App.select_item_above = function (mode, highlight = false) {
  if (highlight) {
    App.toggle_highlight(App[`selected_${mode}_item`], true)
  } else {
    App.dehighlight(mode)
  }

  let item = App.get_prev_visible_item(mode)

  if (item) {
    App.select_item(item)

    if (highlight) {
      App.toggle_highlight(item, true)
    }    
  }
}

// Select item below
App.select_item_below = function (mode, highlight = false) {
  if (highlight) {
    App.toggle_highlight(App[`selected_${mode}_item`], true)
  } else {
    App.dehighlight(mode)
  }

  let item = App.get_next_visible_item(mode)

  if (item) {
    App.select_item(item)

    if (highlight) {
      App.toggle_highlight(item, true)
    }
  }
}

// Get next item that is visible
App.get_next_visible_item = function (mode, wrap = true) {
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
App.update_footer = function (mode) {
  if (App.selected_valid(mode)) {
    App.set_footer_info(mode, App[`selected_${mode}_item`].footer)
  } else {
    App.empty_footer(mode)
  }
}

// Empty the footer
App.empty_footer = function (mode) {
  App.set_footer_info(mode, "No Results")
}

// Set footer info
App.set_footer_info = function (mode, text) {
  let footer = App.el(`#${mode}_footer`)
  let info = App.el(".footer_info", footer)
  info.textContent = text
}

// Check if selected is valid
App.selected_valid = function (mode) {
  return App[`selected_${mode}_item`] &&
  App[`selected_${mode}_item`].created &&
  App[`selected_${mode}_item`].visible
}

// Select first item
App.select_first_item = function (mode, by_active = false) {
  if (mode === "tabs" && by_active) {
    for (let item of App[`${mode}_items`]) {
      if (item.visible && item.active) {
        App.select_item(item, "center")
        return
      }
    }  
  }

  for (let item of App[`${mode}_items`]) {
    if (item.visible) {
      App.select_item(item)
      return
    }
  }
}

// Remove an item from the list
App.remove_item = function (item) {
  let mode = item.mode
  let items = App[`${mode}_items`]

  if (App[`selected_${mode}_item`] === item) {
    let next_item = App.get_next_visible_item(mode, false) || App.get_prev_visible_item(mode, false)
  
    if (next_item) {
      App.select_item(next_item)
    } else {
      App.select_first_item(mode)
    }
  }

  item.element.remove()
  let id = item.id.toString()

  for (let [i, it] of items.entries()) {
    if (it.id.toString() === id) {
      items.splice(i, 1)
      break
    }
  }

  App.update_footer_count(mode)

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

  if (value === "iddqd") {
    App.el("#main").classList.add("invert")
    App.set_filter(mode, "")
    return
  } else if (value === "idkfa") {
    App.el("#main").classList.add("hue_rotate")
    App.set_filter(mode, "")
    return
  }

  if (mode === "history") {
    await App.search_history()

    if (App.window_mode !== "history") {
      return
    }
  }

  if (!App[`${mode}_items`]) {
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
    let today = 1000 * 60 * 60 * 24

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

      else if (filter_mode === "secure") {
        match = item.protocol === "https:"
      } 

      else if (filter_mode === "insecure") {
        match = item.protocol === "http:"
      }
      
      else if (filter_mode === "today") {
        match = (Date.now() - item.date) <= today
      } 
    }

    return match
  }

  for (let it of App[`${mode}_items`]) {
    if (!it.element) {
      continue
    }

    if (skip || matched(it)) {
      App.show_item(it)
    } else {
      App.hide_item(it)
    }
  }

  App[`selected_${mode}_item`] = undefined
  App.select_first_item(mode)
  App.update_footer(mode)
  App.update_footer_count(mode)
  App.save_filter(value)
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
    } else {
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
          App.unmute_tabs(item.id)
        }
      })
    } else {
      items.push({
        text: "Mute",
        action: function () {
          App.mute_tabs(item.id)
        }
      })
    }

    items.push({
      separator: true
    })
  }

  items.push({
    text: "Star",
    action: function () {
      App.star_items(item.mode)
    }
  })

  if (item.mode === "stars") {
    items.push({
      text: "Remove",
      action: function () {
        App.remove_stars()
      }
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

  items.push({
    text: "Pick",
    action: function () {
      App.toggle_highlight(item)
    }
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
        App.close_tabs()
      }
    })
  } else {
    items.push({
      text: "Launch",
      action: function () {
        App.launch_items(item.mode)
      }
    })
  }

  if (App[`selected_${item.mode}_item`] !== item) {
    App.select_item(item)
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

    App[`${mode}_items`].push(obj)
    container.append(obj.element)
  }

  App.do_update_footer_count(mode)
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
  let image = App.is_image(url)
  let video = App.is_video(url)

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
    visible: true,
    highlighted: false,
    image: image,
    video: video,
  }

  if (mode === "tabs") {
    obj.active = item.active
    obj.pinned = item.pinned
    obj.audible = item.audible
    obj.muted = item.mutedInfo.muted
    obj.discarded = item.discarded
    obj.date = item.lastAccessed
  } else if (mode === "stars") {
    obj.date = item.date_last_visit
  } else if (mode === "history") {
    obj.date = item.lastVisitTime
  } else if (mode === "closed") {
    obj.date = item.lastAccessed
  }

  App.create_empty_item_element(obj)
  App[`${mode}_idx`] += 1
  return obj
}

// Create empty item
App.create_empty_item_element = function (item) {
  item.element = App.create("div", `item ${item.mode}_item`)
  item.element.dataset.id = item.id
  App[`${item.mode}_item_observer`].observe(item.element)
}

// Create an item element
App.create_item_element = function (item) {
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
    pin_icon.classList.add("action")
    pin_icon.textContent = App.settings.pin_icon

    if (item.pinned) {
      pin_icon.classList.remove("transparent")
      pin_icon.title = "This tab is pinned"
    }

    item.element.append(pin_icon)
  } else {
    let launched = App.create("div", "item_info item_info_launched")
    item.element.append(launched)
  }

  if (item.highlighted) { 
    item.element.classList.add("highlighted")  
  } else {
    item.element.classList.remove("highlighted")
  }

  item.created = true
  console.info(`Item created in ${item.mode}`)
}

// Get image favicon
App.get_img_icon = function (favicon, url) {
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
  } else if (App.settings.text_mode === "url") {
    content = decodeURI(item.path) || item.title
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
  App.empty_footer(mode)
  App.el(`#${mode}_container`).innerHTML = ""
  App.el(`#${mode}_main_menu_text`).textContent = App.capitalize(mode)
  App.set_filter(mode, value, false)

  let m = App[`${mode}_filter_modes`][0]
  App.set_filter_mode(mode, m, false)
  App[`${mode}_filter_mode`] = m[0]

  if (!App.sort_state.items[mode]) {
    App.sort_state.items[mode] = "Normal"
    App.stor_save_sort_state()
  }

  App.set_footer_sort(mode)

  let items = await App[`get_${mode}`]()

  if (mode !== App.window_mode) {
    return
  }

  if (App.sort_state.items[mode] === "Alpha") {
    App.sort_items_by_alpha(items)
  }

  App.process_items(mode, items)

  if (value) {
    App.do_item_filter(mode)
  } else {
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
    let item_filter = App.create_debouncer(function () {
      App.do_item_filter(mode)
    }, App.filter_delay)

    let win = App.el(`#window_content_${mode}`)
    let container = App.create("div", "container unselectable", `${mode}_container`)
    let footer = App.create("div", "footer unselectable", `${mode}_footer`)
    let top = App.create("div", "item_top_container", `${mode}_top_container`)
    App.el(`#window_top_${mode}`).append(top)
    
    win.append(container)
    win.append(footer)

    let footer_sort = App.create("div", "footer_sort action", `${mode}_footer_sort`)
    footer_sort.title = App[`${mode}_sort_title`] + "\n" + "Alpha: Sorted alphanumerically"
    
    App.ev(footer_sort, "click", function () {
      App.show_pick_sort(mode, footer_sort)
    })

    footer.append(footer_sort)
    footer.append(App.create_icon("cube"))

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
    main_menu.title = "Main Menu (Tab)"
    let main_menu_icon = App.create_icon("triangle")
    let main_menu_text = App.create("div", "", `${mode}_main_menu_text`)
    main_menu.append(main_menu_text)
    main_menu.append(main_menu_icon)

    App.ev(main_menu, "click", function () {
      App.show_main_menu(this)
    })

    App.ev(main_menu, "wheel", function (e) {
      if (e.deltaY < 0) {
        App.cycle_item_windows(true)
      } else {
        App.cycle_item_windows(false)
      }
    })

    //
    let filters = App.create("div", "button icon_button", `${mode}_filters`)
    filters.title = "Filters"
    let filters_icon = App.create_icon("triangle")
    
    App.ev(filters, "click", function () {
      App.show_filters(mode)
    })   

    filters.append(filters_icon)

    //
    let filter = App.create("input", "text filter", `${mode}_filter`)
    filter.type = "text"
    filter.autocomplete = "off"
    filter.spellcheck = false
    filter.placeholder = "Type to filter"

    App.ev(filter, "input", function () {
      item_filter()
    })  

    //
    let filter_modes = App.create("div", "button icon_button", `${mode}_filter_modes`)
    filter_modes.title = "Filter Modes (Shift + Down)"
    let filter_modes_icon = App.create_icon("triangle")
    let filter_modes_text = App.create("div", "", `${mode}_filter_modes_text`)
    filter_modes.append(filter_modes_text)
    filter_modes.append(filter_modes_icon)
    
    App[`${mode}_filter_modes`] = App[`${mode}_filter_modes`] || []
    App[`${mode}_filter_modes`].unshift(["all", "All"])
    App[`${mode}_filter_modes`].push(["images", "Images"])
    App[`${mode}_filter_modes`].push(["videos", "Videos"])
    App[`${mode}_filter_modes`].push(["secure", "Secure"])
    App[`${mode}_filter_modes`].push(["insecure", "Insecure"])
    App[`${mode}_filter_modes`].push(["today", "Today"])

    App.ev(filter_modes, "click", function () {
      App.show_filter_modes(mode)
    })

    App.ev(filter_modes, "wheel", function (e) {
      if (e.deltaY < 0) {
        App.cycle_filter_modes(mode, true)
      } else {
        App.cycle_filter_modes(mode, false)
      }
    })  

    //
    if (!App[`${mode}_actions`]) {
      App[`${mode}_actions`] = []
    }

    App[`${mode}_actions`].unshift({text: "Sort", get_items: function () {
      return App.get_sort_items(mode)
    }})

    App[`${mode}_actions`].unshift({text: "Pick", action: function () {
      App.highlight_items(mode)
    }})

    App[`${mode}_actions`].unshift({text: "--separator--"})

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
    actions_menu.title = "Item Actions (Shift + Space)"

    App[`show_${mode}_actions`] = function () {
      let items = []

      for (let item of App[`${mode}_actions`]) {
        if (item.text === "--separator--") {
          items.push({separator: true})
          continue
        }

        if (item.conditional) {
          items.push(item.conditional())
        } else if (item.action) {
          items.push({text: item.text, action: function () {
            item.action()
          }})
        } else if (item.items) {
          items.push({text: item.text, items: item.items})
        } else if (item.get_items) {
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
      container.addEventListener("dragstart", function (e) {
        if (mode === "tabs" && App.sort_state.items.tabs !== "Normal") {
          e.preventDefault()
          return false
        }

        if (e.shiftKey) {
          e.preventDefault()
          return
        }

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
          for (let tab of App[`${mode}_items`]) {
            if (tab.highlighted) {
              App.drag_items.push(tab)
            }
          }
        } else {
          App.drag_items.push(App.drag_item)
        }

        App.drag_els = []

        for (let tab of App.drag_items) {
          App.drag_els.push(tab.element)
        }

        App.drag_moved = false
        App.select_item(App.drag_item)
      })

      container.addEventListener("dragend", function () {
        if (!App.drag_moved) {
          return
        }

        App.block_select()
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
          } else {
            el.before(...App.drag_els)
          }

          App.drag_moved = true
          App.select_item(App.drag_item)
        }

        e.preventDefault()
        return false
      })
    }

    // Append the top components

    let left_top = App.create("div", "item_top_left")
    let center_top = App.create("div", "item_top_center")
    let right_top = App.create("div", "item_top_right")

    left_top.append(main_menu)
    left_top.append(filter_modes)
    center_top.append(filter)
    center_top.append(filters)
    right_top.append(actions_menu)

    top.append(left_top)
    top.append(center_top)
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

// Show main menu
App.show_main_menu = function (btn) {
  let items = []

  for (let [i, m] of App.item_order.entries()) {
    let selected = App.window_mode === m

    items.push({
      text: App.capitalize(m),
      action: function () {
        App.show_item_window(m)
      },
      selected: selected
    })
  }
  
  items.push({
    separator: true
  })

  items.push({
    text: "Settings",
    items: [
      {
        text: "Basic",
        action: function () {
          App.show_window("settings_basic")
        }
      },
      {
        text: "Theme",
        action: function () {
          App.show_window("settings_theme")
        }
      },
      {
        text: "Icons",
        action: function () {
          App.show_window("settings_icons")
        }
      },

      {separator: true},
      
      {
        text: "Reset",
        action: function () {
          App.reset_settings()
        }
      },
    ]
  })

  items.push({
    text: "About",
    action: function () {
      App.show_window("about")
    }
  })

  NeedContext.show_on_element(btn, items, false, btn.clientHeight)
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

      App.focus_tab(o, true)
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
  } else {
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
  for (let item of App[`${mode}_items`]) {
    if (item.visible) {
      return true
    }
  }

  return false
}

// Get number of visible items
App.get_visible = function (mode) {
  let items = []

  for (let item of App[`${mode}_items`]) {
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
    let highlighted = it.highlighted
    App.create_item_element(new_item)
    App[`${mode}_items`][i].element.replaceWith(new_item.element)
    App[`${mode}_items`][i] = new_item

    if (selected) {
      App.select_item(new_item)
    }

    if (highlighted) {
      App.toggle_highlight(new_item, true)
    }

    break
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
  } else {
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
  } else {
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
  let it = App[`${mode}_items`].splice(from_index, 1)[0]
  App[`${mode}_items`].splice(to_index, 0, it)
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
  } else {
    if (from_index < to_index) {
      container.insertBefore(el, items[to_index + 1])
    } else {
      container.insertBefore(el, items[to_index])
    }
  }
}

// Highlight a range of items
App.highlight_range = function (item) {
  if (App.selection_mode === undefined) {
    App.selection_mode = !item.highlighted
  }

  App.toggle_highlight(item, App.selection_mode)
}

// Dehighlight items
App.dehighlight = function (mode) {
  for (let item of App[`${mode}_items`]) {
    if (item.highlighted) {
      App.toggle_highlight(item)
    }
  }
}

// Highlight or dehighlight an item
App.toggle_highlight = async function (item, what) {
  let highlight

  if (what !== undefined) {
    highlight = what
  } else {
    highlight = !item.highlighted
  }

  if (highlight) {
    item.element.classList.add("highlighted")
  } else {
    item.element.classList.remove("highlighted")
  }

  item.highlighted = highlight
  App.update_footer_count(item.mode)
}

// Get highlighted items
App.get_highlights = function (mode) {
  let ans = []

  for (let item of App[`${mode}_items`]) {
    if (item.highlighted) {
      ans.push(item)
    }
  }

  return ans
}

// Item is to be included in action
App.item_in_action = function (highlights, item) {
  if (highlights.length > 0) {
    if (highlights.includes(item)) {
      return true
    }
  } else {
    if (App[`selected_${item.mode}_item`] === item) {
      return true
    }
  }

  return false
}

// Launch an item
App.launch_item = function (item, close = true) {
  App.open_tab(item.url, close)

  if (close) {
    window.close()
  } else {
    App.show_launched(item)
  }
}

// Launch items
App.launch_items = function (mode) {
  let items = []
  let highlights = App.get_highlights(mode)

  for (let item of App[`${mode}_items`]) {
    if (!App.item_in_action(highlights, item)) {
      continue
    }

    items.push(item)
  }

  if (items.length === 0) {
    return
  }

  if (items.length === 1) {
    App.open_tab(items[0].url, false)
    App.show_launched(items[0])
    return
  }

  let s = App.plural(items.length, "item", "items")
  App.dehighlight(mode)
  
  App.show_confirm(`Launch ${s}?`, function () {
    for (let item of items) {
      App.launch_item(item, false)
    }
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

// Star items
App.star_items = async function (mode) {
  let highlights = App.get_highlights(mode)
  App.dehighlight(mode)
  
  if (highlights.length === 0) {
    App.add_or_edit_star(App[`selected_${mode}_item`])
    return
  }
  
  let items = []

  for (let item of App[`${mode}_items`]) {
    if (!App.item_in_action(highlights, item)) {
      continue
    }

    let exists = await App.get_star_by_url(item.url)

    if (exists) {
      continue
    }

    items.push(item)
  }

  if (items.length === 0) {
    return
  }

  App.show_confirm(`Star items? (${items.length})`, async function () {
    for (let item of items) {
      await App.star_item(item, false)
    }

    App.stor_save_stars()
    App.show_alert("Stars created", App.alert_autohide_delay)
  })  
}

// Highlight visible items
App.highlight_items = function (mode) {
  let what
  let highlights = App.get_highlights(mode)

  if (highlights.length > 0) {
    what = false
  }

  for (let item of App[`${mode}_items`]) {
    if (item.visible) {
      if (what === undefined) {
        what = !item.highlighted
      }

      App.toggle_highlight(item, what)
    } else {
      App.toggle_highlight(item, false)
    }
  }
}

// Check media
App.check_media = function (item) {
  if (item.image) {
    App.show_media("image", item)
    return true
  }

  if (item.video) {
    App.show_media("video", item)
    return true
  }

  return false
}

// Show prev image
App.cycle_media = function (item, what, dir) {
  let items = App.get_visible_media(item.mode, what)
  
  if (items.length <= 1) {
    return
  }
  
  let waypoint = false
  let next_item

  if (dir === "prev") {
    items.reverse()
  }

  for (let it of items) {
    if (!it[what] || !it.visible) {
      continue
    }

    if (waypoint) {
      next_item = it
      break
    }

    if (it === item) {
      waypoint = true
    }
  }

  if (!next_item) {
    next_item = items[0]
  }

  App.show_media(what, next_item)
}

// Get visible media
App.get_visible_media = function (mode, what) {
  let items = []

  for (let item of App[`${mode}_items`]) {
    if (item[what]) {
      items.push(item)
    }
  }

  return items
}

// Set sort
App.set_sort = function (mode, sort) {
  App.sort_state.items[mode] = sort
  App.stor_save_sort_state()
  App.show_item_window(mode, false)
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

// Set footer sort
App.set_footer_sort = function (mode) { 
  App.el(`#${mode}_footer_sort`).textContent = `Sort: ${App.sort_state.items[mode]}`
}

// Sort items alphanumerically
App.sort_items_by_alpha = function (items) {
  items.sort(function (a, b) {
    if (App.settings.text_mode === "title") {
      return a.title > b.title
    } else if (App.settings.text_mode === "url") {
      return a.url > b.url
    }
  })
}

// Show recent filters
App.show_filters = function (mode) {
  let el = App.el(`#${mode}_filters`)
  let items = []

  items.push({
    text: "Clear",
    action: function () {
      App.clear_filter(mode)
    }
  })  

  if (App.filters.items.length > 0) {
    items.push({
      separator: true
    })  

    for (let filter of App.filters.items) {
      items.push({
        text: filter,
        action: function () {
          App.set_filter(mode, filter)
        }
      })
    }

    items.push({
      separator: true
    })

    items.push({
      text: "Forget",
      action: function () {
        App.forget_filters()
      }
    }) 
  }
  
  NeedContext.show_on_element(el, items, true, el.clientHeight)
}

// Save a filter
App.save_filter = function (filter) {
  if (filter) {
    filter = filter.substring(0, 20).trim()
    App.filters.items = App.filters.items.filter(x => x !== filter)
    App.filters.items.unshift(filter)
    App.filters.items = App.filters.items.slice(0, App.max_filters)
    App.stor_save_filters()
  }
}

// Forget filters
App.forget_filters = function () {
  App.filters.items = []
  App.stor_save_filters()
}

// Get sort items
App.get_sort_items = function (mode) {
  let modes = ["Normal", "Special", "Alpha"]
  let items = []

  for (let m of modes) {
    items.push({
      text: m,
      action: function () {
        App.set_sort(mode, m)
      },
      selected: App.sort_state.items[mode] === m
    })  
  }

  return items
}

// Show sort options
App.show_pick_sort = function (mode, el) {
  NeedContext.show_on_element(el, App.get_sort_items(mode))
}