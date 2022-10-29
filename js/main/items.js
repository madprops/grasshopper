// Setup items
App.setup_items = function () {
  App.start_item_observers()
}

// Select an item
App.select_item = function (mode, item) {
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
      if (App.item_is_visible(item)) {
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
      if (App.item_is_visible(item)) {
        return item
      }
    }

    if (item === o_item) {
      waypoint = true
    }
  }
}

// Check if an item is visible
App.item_is_visible = function (item) {
  let hidden = item.element.classList.contains("hidden")
  return !hidden
}

// Updates a footer
App.update_footer = function (mode) {
  if (App.selected_valid(mode)) {
    App.el(`#${mode}_footer`).textContent = App[`selected_${mode}_item`].footer
  } else {
    App.el(`#${mode}_footer`).textContent = "No Results"
  }
}

// Check if selected is valid
App.selected_valid = function (mode) {
  return App[`selected_${mode}_item`] && 
  App.item_is_visible(App[`selected_${mode}_item`])
}

// Select first item
App.select_first_item = function (mode) {
  for (let item of App[`${mode}_items`]) {
    if (App.item_is_visible(item)) {
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
  
  for (let [i, it] of items.entries()) {
    if (it.id === item.id) {
      items.splice(i, 1)
      break
    }
  }
  
  if (next_item) {
    App.select_item(mode, next_item)
  }
}

App.focus_filter = function (mode) {
  App.el(`#${mode}_filter`).focus()
}

// Filter items
App.do_item_filter = function (mode, select = true) {
  let value = App.el(`#${mode}_filter`).value.trim()
  let words = value.split(" ").filter(x => x !== "")
  let case_sensitive = App.el(`#${mode}_case_sensitive`).checked
  let filter_mode = App.el(`#${mode}_filter_mode`).value
  let filter_words = case_sensitive ? words : words.map(x => x.toLowerCase())

  function check (what) {
    return filter_words.every(x => what.includes(x))
  }

  function matched (item) {
    let match = false
    let title = case_sensitive ? item.title : item.title_lower
    let path = case_sensitive ? item.path : item.path_lower
    
    if (filter_mode === "all") {
      match = check(title) || check(path)
    } else if (filter_mode === "title") {
      match = check(title)
    } else if (filter_mode === "url") {
      match = check(path)
    } else if (filter_mode === "playing") {
      match = item.audible &&
      (check(title) || check(path))    
    } else if (filter_mode === "pins") {
      match = item.pinned &&
      (check(title) || check(path))  
    } else if (filter_mode === "muted") {
      match = item.muted &&
      (check(title) || check(path))    
    } else if (filter_mode === "normal") {
      match = !item.audible && !item.pinned &&
      (check(title) || check(path)) 
    }
        
    return match
  }

  for (let it of App[`${mode}_items`]) {
    if (matched(it)) {
      it.element.classList.remove("hidden")
    } else {
      it.element.classList.add("hidden")
    }
  }

  if (select) {
    App.select_first_item(mode)
  }

  App.update_footer(mode)
}

// Show item menu
App.show_item_menu = function (mode, item, x, y) {
  let items = []

  if (mode === "tabs") {
    if (item.pinned) {
      items.push({
        text: "Unpin",
        action: function () {
          App.unpin_tab(item)
        }
      })
    } else {
      items.push({
        text: "Pin",
        action: function () {
          App.pin_tab(item)
        }
      })
    }
  
    if (item.muted) {
      items.push({
        text: "Unmute",
        action: function () {
          App.unmute_tab(item)
        }
      })
    } else {
      items.push({
        text: "Mute",
        action: function () {
          App.mute_tab(item)
        }
      })
    }
  }

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

// Process items
App.process_items = function (mode, items) {
  let container = App.el(`#${mode}_container`)
  container.innerHTML = ""
  App[`${mode}_items`] = []
  App[`${mode}_idx`] = 0

  for (let item of items) {
    let obj = App.process_item(mode, item)

    if (!obj) {
      continue
    }

    App[`${mode}_items`].push(obj)
    container.append(obj.element)
  }
}

// Process an item
App.process_item = function (mode, item) {
  if (!item || !item.url) {
    return false
  }

  item.url = App.format_url(item.url)

  try {
    url_obj = new URL(item.url)
  } catch (err) {
    return
  }

  let path = App.remove_protocol(item.url)
  let title = item.title || path

  let obj = {
    id: item.id || App[`${mode}_idx`],
    title: title,
    title_lower: title.toLowerCase(),
    url: item.url,
    path: path,
    path_lower: path.toLowerCase(),
    favicon: item.favIconUrl,
    empty: false,
    created: false
  }
  
  if (mode === "tabs") {
    obj.index = item.index,
    obj.active = item.active
    obj.pinned = item.pinned
    obj.audible = item.audible
    obj.muted = item.mutedInfo.muted
  } else if (mode === "closed_tabs") {
    obj.window_id = item.windowId
    obj.session_id = item.sessionId
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
  
  let icon = App.get_img_icon(item.favicon, item.url)
  item.element.append(icon)

  let text = App.create("div", "item_text")
  item.element.append(text)
  App.set_item_text(mode, item)

  let action = App.create("div", "item_button action_button")

  if (mode === "tabs") {
    action.textContent = "Close"
  } else if (mode === "closed_tabs" || mode === "history") {
    action.textContent = "Open"
  }
  
  item.element.append(action)
  item.created = true
  console.info(`Item created in ${mode}`)
}

// Set item text content
App.set_item_text = function (mode, item) {
  let content = ""

  if (mode === "tabs") {
    let status = []
  
    if (item.pinned) {
      status.push("Pin")
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

  let purl

  if (item.url.startsWith("http://")) {
    purl = item.url
  } else {
    purl = item.path
  }

  if (App.state.text_mode === "title") {
    content += item.title || purl
    item.footer = decodeURI(purl) || item.title
  } else if (App.state.text_mode === "url") {
    content += decodeURI(purl) || item.title
    item.footer = item.title || purl
  }

  content = content.substring(0, 200).trim()
  let text = App.el(".item_text", item.element)
  text.textContent = content
}

// Get an item by the id dataset
App.get_item_by_id = function (mode, id) {
  id = id.toString()

  for (let item of App[`${mode}_items`]) {
    if (item.id.toString() === id) {
      return item
    }
  }
}

// Used for lazy-loading components
App.start_item_observers = function () {
  let modes = ["tabs", "closed_tabs", "history"]

  for (let mode of modes) {
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

      if (!item.created && App.item_is_visible(item)) {
        App.create_item_element(mode, item)
      }
    }
  }, options)
}