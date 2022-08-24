// Setup items
App.setup_items = function () {
  App.start_item_observer()

  App.filter = App.create_debouncer(function () {
    App.do_filter()
  }, 222)

  App.ev(App.el("#filter"), "input", function () {
    App.filter()
  })

  App.ev(App.el("#clear_button"), "click", function () {
    App.clear_filter()
    App.reset_filter_mode()
    App.do_filter()
  })

  App.ev(App.el("#favorites_button"), "click", function () {
    App.change_to_favorites()
  })  

  App.ev(App.el("#history_button"), "click", function () {
    App.change_to_history()
  })

  App.ev(App.el("#filter_mode"), "change", function () {
    App.do_filter()
  })
}

// When results are found
App.process_items = function (container, items, type) {
  App.log(`Processing: ${type}`)

  let list = App.el("#list")
  let favorite_urls
  let urls = []

  if (type === "history") {
    favorite_urls = App.favorites.map(x => x.url)
  }

  for (let item of items) {
    if (!item.url) {
      continue
    }

    let url = App.remove_hash(item.url)

    if (urls.includes(url)) {
      continue
    }

    let hostname, pathname

    try {
      hostname = App.remove_slashes(new URL(url).hostname)
    } catch (err) {
      continue
    }

    try {
      pathname = App.remove_slashes(new URL(url).pathname)
    } catch (err) {
      continue
    }    

    urls.push(url)
    
    let el = App.create("div", "item hidden")
    el.dataset.url = url
    App.item_observer.observe(el)

    if (type === "favorites") {
      favorite = true
    } else {
      if (favorite_urls.includes(url)) {
        el.classList.add("removed")
      }
    }

    let obj = {
      title: item.title || pathname,
      url: url,
      hostname: hostname,
      pathname: pathname,
      created: false,
      filled: false,
      element: el,
      type: type
    }
    
    container.push(obj)
    list.append(el)

  }
  
  // Check performance
  App.log(`Results: ${items.length}`)
}

// Start intersection observer to check visibility
// Used for lazy-loading components
App.start_item_observer = function () {
  let options = {
    root: App.el("#list"),
    rootMargin: "0px",
    threshold: 0.1,
  }
  
  App.item_observer = new IntersectionObserver(function (entries) {
    for (let entry of entries) {
      if (!entry.isIntersecting) {
        continue
      }
      
      let item = App.element_to_item(entry.target)

      if (item.created && !item.filled && App.item_is_visible(item)) {
        App.fill_item_element(item)
      }
    }
  }, options)
}

// Create an item element
App.create_item_element = function (item) {
  let icon_container = App.create("div", "item_icon_container")
  let icon = App.create("canvas", "item_icon")
  icon.width = 25
  icon.height = 25
  icon_container.append(icon)
  item.element.append(icon_container)

  let text = App.create("div", "item_text")

  let content
  
  if (App.config.text_mode === "title") {
    content = item.title || item.url
    item.footer = item.url || item.title
  } else if (App.config.text_mode === "url") {
    content = item.url || item.title
    item.footer = item.title || item.url
  }

  content = content.substring(0, App.config.max_text_length).trim()
  text.textContent = content

  item.element.append(text)
  item.created = true
}

// Fully create the item element
App.fill_item_element = function (item) {
  if (item.type === "favorites") {
    item.element.classList.add("favorites_item")
  } else {
    item.element.classList.add("history_item")
  }

  let icon = App.el(".item_icon", item.element)
  jdenticon.update(icon, item.hostname)

  let icon_title = item.type === "favorites" ? "Remove from favorites" : "Add to favorites"
  App.el(".item_icon_container", item.element).title = icon_title

  item.filled = true
  App.log("Element created")
}

// Get the active items
App.get_items = function () {
  if (App.mode === "favorites") {
    return App.favorite_items || []
  } else {
    return App.history_items || []
  }
}

// Get the other items
App.get_other_items = function () {
  if (App.mode === "favorites") {
    return App.history_items || []
  } else {
    return App.favorite_items || []
  }
}

// Get next item that is visible
App.get_next_visible_item = function (o_item) {
  let items = App.get_items()
  let waypoint = false

  for (let i=0; i<items.length; i++) {
    let item = items[i]

    if (waypoint) {
      if (item.created && App.item_is_visible(item)) {
        return item
      }
    }

    if (item === o_item) {
      waypoint = true
    }
  }
}

// Get prev item that is visible
App.get_prev_visible_item = function (o_item) {
  let items = App.get_items()
  let waypoint = false

  for (let i=items.length-1; i>=0; i--) {
    let item = items[i]

    if (waypoint) {
      if (item.created && App.item_is_visible(item)) {
        return item
      }
    }

    if (item === o_item) {
      waypoint = true
    }
  }
}

// Get the item of a favorite
App.get_item_by_url = function (items, url) {
  for (let item of items) {
    if (item.url === url) {
      return item
    }
  }
}

// Make item visible
App.show_item = function (item) {
  if (!item.created) {
    App.create_item_element(item)
  }

  item.element.classList.remove("hidden")
}

// Make an item not visible
App.hide_item = function (item) {
  if (!item.created) {
    return
  }

  item.element.classList.add("hidden")
}

// Make an item selected
// Unselect all the others
App.select_item = function (s_item, scroll = true) {
  let items = App.get_items()

  for (let item of items) {
    if (item.created) {
      item.element.classList.remove("selected")
    }
  }

  App.selected_item = s_item
  App.selected_item.element.classList.add("selected")

  if (scroll) {
    App.selected_item.element.scrollIntoView({block: "nearest"})
  }

  App.update_footer()
}

// Do items filter
App.do_filter = function () {
  App.log("Doing filter")

  let value = App.el("#filter").value.trim()
  let items = App.get_items()
  let words = value.toLowerCase().split(" ").filter(x => x !== "")
  let filter_mode = App.el("#filter_mode").value
  
  App.hide_other_items()

  function matched (item) {
    let match

    if (filter_mode === "title_url") {
      match = words.every(x => item.title.toLowerCase().includes(x)) || 
        words.every(x => item.url.toLowerCase().includes(x))
    } else if (filter_mode === "title") {
      match = words.every(x => item.title.toLowerCase().includes(x))
    } else if (filter_mode === "url") {
      match = words.every(x => item.url.toLowerCase().includes(x))
    } else if (filter_mode.startsWith("url_")) {
      match = words.every(x => item.url.toLowerCase().includes(x))

      if (match) {
        let n = App.only_numbers(filter_mode)
        let parts = item.pathname.split("/")
        return n === parts.length
      }
    }
    
    if (!match) {
      return false
    }

    if (App.item_is_removed(item)) {
      return false
    }

    return true
  }

  let selected = false

  for (let item of items) {
    if (matched(item)) {
      App.show_item(item)

      if (!selected) {
        App.select_item(item)
        selected = true
      }
    } else {
      App.hide_item(item)
    }
  }

  if (!selected) {
    App.selected_item = undefined
    App.update_footer()
  }

  // Avoid auto selecting when showing the window
  if (App.mouse_over_disabled) {
    setTimeout(function () {
      App.mouse_over_disabled = false
    }, 200)
  }
}

// Focus the filter
App.focus_filter = function () {
  App.el("#filter").focus()
}

// Clear filter
App.clear_filter = function () {
  App.el("#filter").value = ""
}

// Select next item
App.select_next_item = function (item) {
  let prev = App.get_prev_visible_item(item)
  let next = App.get_next_visible_item(item)
  let n_item

  if (next) {
    n_item = App.element_to_item(next.element)
  } else if (prev) {
    n_item = App.element_to_item(prev.element)
  }
  
  if (n_item) {
    App.select_item(n_item)
  } else {
    App.selected_item = undefined
  }
}

// Hide all items
App.hide_other_items = function () {
  for (let item of App.get_other_items()) {
    App.hide_item(item)
  }
}

// Set app mode
App.set_mode = function (mode) {
  App.mode = mode

  if (mode === "favorites") {
    App.el("#favorites_button").classList.add("button_selected")
    App.el("#history_button").classList.remove("button_selected")
  } else {
    App.el("#history_button").classList.add("button_selected")
    App.el("#favorites_button").classList.remove("button_selected")
  }
}

// Change mode
App.change_mode = function () {
  if (App.mode === "favorites") {
    App.change_to_history()
  } else {
    App.change_to_favorites()
  }
}

// Element to item
App.element_to_item = function (el) {
  return App.get_item_by_url(App.get_items(), el.dataset.url)
}

// Item is hidden
App.item_is_hidden = function (item) {
  return item.element.classList.contains("hidden")
}

// Item is removed
App.item_is_removed = function (item) {
  return item.element.classList.contains("removed")
}

// Check if item is visible
App.item_is_visible = function (item) {
  let hidden = App.item_is_hidden(item) || App.item_is_removed(item)
  return !hidden
}

// Update the footer
App.update_footer = function () {
  if (App.selected_item) {
    App.el("#footer").textContent = App.selected_item.footer
  } else {
    App.el("#footer").textContent = "No Results"
  }
}

// Reset filter mode
App.reset_filter_mode = function () {
  App.el("#filter_mode").value = "title_url"
}