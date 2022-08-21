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
    App.do_filter()
  })

  App.ev(App.el("#favorites_button"), "click", function () {
    App.change_to_favorites()
  })  

  App.ev(App.el("#history_button"), "click", function () {
    App.change_to_history()
  })
}

// Reload favorites
App.reload_favorites = function () {
  for (let item of App.favorite_items) {
    item.element.remove()
  }

  if (App.mode === "favorites") {
    App.selected_item = undefined
  }
  
  App.process_favorites()
}

// Empty history
App.empty_history = function () {
  for (let item of App.history_items) {
    item.element.remove()
  }

  App.history_fetched = false
}

// Get items from history
App.get_history = function () {
  console.time("Get history")

  if (App.mode === "history") {
    App.selected_item = undefined
  }

  App.history_items = []
  App.history_fetched = true
  browser.history.search({
    text: "",
    maxResults: App.config.history_max_results,
    startTime: Date.now() - (1000 * 60 * 60 * 24 * 30 * App.config.history_months)
  }).then(function (items) {
    App.process_items(App.history_items, items, "history")
    App.show_history()
    console.timeEnd("Get history")
  })
}

// When results are found
App.process_items = function (container, items, type) {
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

    let curl

    try {
      curl = new URL(url).hostname
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
      title: item.title || curl,
      url: url,
      clean_url: curl,
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

      if (item.created && App.item_is_visible(item) && !item.filled) {
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
  let text_content = item.title || item.url
  text_content = text_content.substring(0, 140)
  text.textContent = text_content

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
  jdenticon.update(icon, App.get_unit(item.clean_url).toLowerCase())

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
  let value = App.el("#filter").value.trim()
  let items = App.get_items()
  let words = value.toLowerCase().split(" ").filter(x => x !== "")
  
  App.hide_other_items()

  function matched (item) {
    let match = words.every(x => item.title.toLowerCase().includes(x)) || 
      words.every(x => item.url.toLowerCase().includes(x))
    
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
    App.update_footer()
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

// Show history
App.show_history = function () {
  App.set_mode("history")
  App.do_filter()
}

// Get favorites
App.get_favorites = async function () {
  let ans = await browser.storage.sync.get(App.ls_favorites) 

  if (ans[App.ls_favorites]) {
    App.favorites = ans[App.ls_favorites]
  } else {
    App.favorites = []
  }

  App.process_favorites()
}

// Get favorite items
App.process_favorites = function () {
  App.favorite_items = []
  App.process_items(App.favorite_items, App.favorites, "favorites")
  App.favorites_need_refresh = false
}

// Saves the favorite storage object
App.save_favorites = async function () {
  let o = {}
  o[App.ls_favorites] = App.favorites
  await browser.storage.sync.set(o)
  App.favorites_need_refresh = true
}

// Add a favorite item
App.add_favorite = function (item) {
  App.favorites = App.favorites.filter(x => x.url !== item.url)
  
  let o = {}
  o.url = item.url
  o.title = item.title
  
  App.favorites.unshift(o)
  App.favorites = App.favorites.slice(0, App.config.max_favorites)
  
  item.element.classList.add("removed")
  App.save_favorites()
  App.update_footer()
}

// Remove a favorite item
App.remove_favorite = function (item) {
  App.favorite_items = App.favorite_items.filter(x => x.url !== item.url)
  App.favorites = App.favorites.filter(x => x.url !== item.url)

  for (let it of App.history_items) {
    if (it.url === item.url) {
      it.element.classList.remove("removed")
      break
    }
  }

  item.element.remove()
  App.save_favorites()
  App.update_footer()
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

// Show favorites
App.show_favorites = function () {
  App.set_mode("favorites")
  App.clear_filter()
  App.do_filter()
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

// Get favorite by url
App.get_favorite_by_url = function (url) {
  for (let [i, item] of App.favorites.entries()) {
    if (item.url === url) {
      return [i, item]
    }
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

// Change to history
App.change_to_history = function () {
  if (!App.history_fetched) {
    App.get_history()
    return
  }

  App.show_history()
}

// Change to favorites
App.change_to_favorites = function () {
  if (App.favorites_need_refresh) {
    App.reload_favorites()
  }

  App.set_mode("favorites")
  App.do_filter()
}

// Toggle favorite
App.toggle_favorite = function (item) {
  if (App.mode === "favorites") {
    App.remove_favorite(item)
  } else {
    App.add_favorite(item)
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
  if (App.selected_item && App.item_is_visible(App.selected_item)) {
    App.el("#footer").textContent = App.selected_item.url
  } else {
    App.el("#footer").textContent = "No Results"
  }
}