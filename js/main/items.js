// Setup items
App.setup_items = function () {
  App.get_item_order()
  App.start_item_observers()
}

// Select an item
App.select_item = function (item, highlight = false) {
  if (App[`selected_${item.mode}_item`] === item) {
    return
  }

  if (!item.created) {
    App.create_item_element(item)
  }

  App[`selected_${item.mode}_item`] = item
  
  if (highlight) {    
    for (let el of App.els(`.${item.mode}_item`)) {
      el.classList.remove("selected")
    }

    App[`selected_${item.mode}_item`].element.classList.add("selected")  
    App[`selected_${item.mode}_item`].element.scrollIntoView({block: "nearest"})
  }

  App.update_footer(item.mode)

  if (item.mode === "tabs") {
    browser.tabs.warmup(item.id)
  }
}

// Select item above
App.select_item_above = function (mode) {
  let item = App.get_prev_visible_item(mode)

  if (item) {
    App.select_item(item, true)
  }
}

// Select item below
App.select_item_below = function (mode) {
  let item = App.get_next_visible_item(mode)

  if (item) {
    App.select_item(item, true)
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
App.select_first_item = function (mode, by_active = false) {
  if (mode === "tabs" && by_active) {
    for (let item of App[`${mode}_items`]) {
      if (item.visible && item.active) {
        App.select_item(item, true)
        return
      }
    }  
  }

  for (let item of App[`${mode}_items`]) {
    if (item.visible) {
      App.select_item(item, true)
      return
    }
  }
}

// Remove an item from the list
App.remove_item = function (item) {
  let mode = item.mode
  let next_item = App.get_next_visible_item(mode, false) || App.get_prev_visible_item(mode, false)
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
    App.select_item(next_item)
  } else {
    App.select_first_item(mode)
  }

  App.update_info(mode)

  if (App.el(`#${mode}_filter`).value.trim()) {
    if (App.get_num_visible(mode) === 0) {
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

  if (mode === "history") {
    await App.search_history()

    if (App.window_mode !== "history") {
      return
    }
  }

  if (!App[`${mode}_items`]) {
    return
  }

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
      } else if (filter_mode === "normal") {
        match = App.tab_is_normal(item)
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
      } else if (filter_mode === "other_windows") {
        match = item.window_id !== App.window_id
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
App.show_item_menu = function (item, x, y) {
  let items = []

  if (item.mode === "tabs") {
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

    items.push({
      separator: true
    })
  }

  items.push({
    text: "Star",
    action: function () {
      App.add_or_edit_star(item)
    }
  })

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
        App.confirm_close_tab(item)
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
        if (App.tab_is_normal(item)) {
          App.suspend_tab(item)
        } else {
          App.show_confirm("Suspend tab?", function () {
            App.suspend_tab(item)
          })
        }
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
    obj.active = item.active
    obj.pinned = item.pinned
    obj.audible = item.audible
    obj.muted = item.mutedInfo.muted
    obj.discarded = item.discarded
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
  item.element.draggable = true

  let icon = App.get_img_icon(item.favicon, item.url, item.pinned)
  item.element.append(icon)

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
  let content = ""

  if (item.mode === "tabs") {
    let status = []

    if (item.discarded) {
      status.push(App.settings.suspended_icon)
    }

    if (item.audible) {
      status.push(App.settings.playing_icon)
    }

    if (item.muted) {
      status.push(App.settings.muted_icon)
    }

    if (status.length > 0) {
      content = status.join(" ")
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
  App.el(`#${mode}_item_picker`).textContent = `${App.get_mode_index(mode) + 1}. ${App.capitalize(mode)}`
  App.el(`#${mode}_filter_mode`).textContent = "Show: All"
  App[`${mode}_filter_mode`] = "all"

  let items = await App[`get_${mode}`]()

  if (mode !== App.window_mode) {
    return
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
App.setup_item_window = function (mode, actions) {
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

    let footer_left = App.create("div", "footer_left")
    footer.append(footer_left)

    let footer_right = App.create("div", "footer_right")
    footer.append(footer_right)

    App.setup_window_mouse(mode)

    //
    let item_picker = App.create("div", "button top_button", `${mode}_item_picker`)
    item_picker.title = "Main Menu (Tab)"
    item_picker.textContent = App.capitalize(mode)

    App.ev(item_picker, "click", function () {
      App.show_item_picker(this)
    })

    App.ev(item_picker, "wheel", function (e) {
      if (e.deltaY < 0) {
        App.cycle_item_windows(true)
      } else {
        App.cycle_item_windows(false)
      }
    })

    top.append(item_picker)

    //
    let filter = App.create("input", "text filter", `${mode}_filter`)
    filter.type = "text"
    filter.autocomplete = "off"
    filter.placeholder = "Type to filter..."

    App.ev(filter, "input", function () {
      item_filter()
    })

    top.append(filter)

    //
    let filter_mode = App.create("div", "button top_button", `${mode}_filter_mode`)
    filter_mode.title = "Filter Mode (Shift + Down)"

    if (!App[`${mode}_filter_modes`]) {
      App[`${mode}_filter_modes`] = [
        ["all", "All"],
        ["secure", "Secure"],
        ["insecure", "Insecure"],
      ]
    }

    App.ev(filter_mode, "click", function () {
      App.show_filter_mode(mode)
    })

    App.ev(filter_mode, "wheel", function (e) {
      if (e.deltaY < 0) {
        App.cycle_filter_modes(mode, true)
      } else {
        App.cycle_filter_modes(mode, false)
      }
    })

    top.append(filter_mode)

    //
    if (actions) {
      let menu = App.create("div", "button top_button", `${mode}_menu`)
      menu.title = "Item Actions (Shift + Space)"
      menu.textContent = "Actions"

      App[`show_${mode}_menu`] = function () {
        let items = []

        for (let item of actions) {
          if (item[0] === "--separator--") {
            items.push({separator: true})
            continue
          }

          if (item[1]) {
            items.push({text: item[0], action: function () {
              item[1]()
            }})
          } else if (item[2]) {
            items.push({text: item[0], items:item[2]})
          }
        }

        NeedContext.show_on_element(menu, items, true, menu.clientHeight)
      }

      App.ev(menu, "click", function () {
        App.show_menu()
      })

      if (mode === "tabs") {
        container.addEventListener("dragstart", function (e) {
          if (App.tab_sort_mode !== "index") {
            e.preventDefault()
            return false
          }
          
          e.dataTransfer.setDragImage(new Image(), 0, 0)
          App.drag_y = e.clientY
          App.drag_element = e.target.closest(".item")
          let id = App.drag_element.dataset.id
          App.drag_item = App.get_item_by_id(mode, id)
          App.select_item(App.drag_item)
        })

        container.addEventListener("dragend", function (e) {
          let new_index = App.get_item_element_index(mode, App.drag_element)
          App.update_tab_index(App.drag_element, new_index)
        })

        container.addEventListener("dragover", function (e) {
          let direction = e.clientY > App.drag_y ? "down" : "up"
          
          if (e.target.closest(".item")) {
            let item = e.target.closest(".item")
            
            if (App.drag_target !== item) {
              App.drag_target = item

              if (direction === "down") {
                App.drag_element.before(App.drag_target)
              } else {
                App.drag_target.before(App.drag_element)
              }

              App.select_item(App.drag_item)
            }
          }

          App.drag_y = e.clientY
        })
      }      

      top.append(menu)
    }
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

// Show item picker
App.show_item_picker = function (btn) {
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
    action: function () {
      App.show_window("settings")
    }
  })

  items.push({
    text: "About",
    action: function () {
      App.show_window("about")
    }
  })

  NeedContext.show_on_element(btn, items, true, btn.clientHeight)
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

  App.open_tab(item.url, close)

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
    App.create_item_element(new_item)
    App[`${mode}_items`][i].element.replaceWith(new_item.element)
    App[`${mode}_items`][i] = new_item

    if (selected) {
      App.select_item(new_item)
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

// Show current item menu
App.show_menu = function () {
  App[`show_${App.window_mode}_menu`]()
}

// Show filter mode
App.show_filter_mode = function (mode) {
  let items = []

  for (let filter_mode of App[`${mode}_filter_modes`]) {
    let selected = App[`${mode}_filter_mode`] === filter_mode[0]

    items.push({
      text: `Show: ${filter_mode[1]}`,
      action: function () {
        App.set_filter_mode(mode, filter_mode)
      },
      selected: selected
    })
  }

  let btn = App.el(`#${mode}_filter_mode`)
  NeedContext.show_on_element(btn, items, true, btn.clientHeight)
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
App.set_filter_mode = function (mode, filter_mode) {
  App[`${mode}_filter_mode`] = filter_mode[0]
  App.el(`#${mode}_filter_mode`).textContent = `Show: ${filter_mode[1]}`

  if (filter_mode[0] === "all") {
    if (mode === "tabs" && App.tab_sort_mode === "access") {
      App.tab_sort_mode = "index"
      App.show_item_window("tabs")
      return
    }

    App.clear_filter(mode)
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