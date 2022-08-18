// Setup items
App.setup_items = function () {
  App.start_item_observer()

  App.filter = App.create_debouncer(function () {
    App.do_filter()
  }, 250)  

  App.el("#filter").addEventListener("input", function () {
    App.filter()
  })

  App.el("#favorites_button").addEventListener("click", function () {
    if (App.favorites_need_refresh) {
      App.reload_favorites()
    }

    App.set_mode("favorites")
    App.clear_filter()
    App.do_filter()
  })  

  App.el("#history_button").addEventListener("click", function () {
    if (!App.history_fetched) {
      App.get_history()
      return
    }

    App.show_history()
  })
}

// Reload favorites
App.reload_favorites = function () {
  for (let item of App.favorite_items) {
    item.element.remove()
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
  App.history_items = []
  App.history_fetched = true
  browser.history.search({
    text: "",
    maxResults: App.config.history_max_results,
    startTime: Date.now() - (1000 * 60 * 60 * 24 * 30 * App.config.history_months)
  }).then(function (items) {
    App.process_items(App.history_items, items, "history")
    App.show_history()
  })
}

// When results are found
App.process_items = function (container, items, type) {
  let list = App.el("#list")
  let i = 0

  let favorite_urls

  if (type === "history") {
    favorite_urls = App.favorites.map(x => x.url)
  }

  for (let item of items) {
    if (!item.url) {
      continue
    }

    let curl

    try {
      curl = new URL(item.url).hostname
    } catch (err) {
      continue
    }

    let favorite

    if (type === "favorites") {
      favorite = true
    } else {
      favorite = favorite_urls.includes(item.url)
    }
    
    let el = document.createElement("div")
    el.classList.add("item")
    el.classList.add("hidden")
    el.dataset.url = item.url
    App.item_observer.observe(el)

    if (favorite) {
      el.classList.add("favorite")
    }

    let obj = {
      title: item.title || curl,
      url: item.url,
      clean_url: curl,
      favorite: favorite,
      created: false,
      filled: false,
      hidden: true,
      element: el
    }
    
    container.push(obj)
    list.append(el)

    i += 1
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
      
      let item = App.get_item_by_url(App.get_items(), entry.target.dataset.url)

      if (item.created && !item.hidden && !item.filled) {
        App.fill_item_element(item)
      }
    }
  }, options)
}

// Create an item element
App.create_item_element = function (item) {
  let icon_container = document.createElement("div")
  icon_container.classList.add("item_icon_container")
  let icon = document.createElement("canvas")
  icon.classList.add("item_icon")
  icon.width = 25
  icon.height = 25
  icon_container.append(icon)
  item.element.append(icon_container)

  let text = document.createElement("div")
  text.classList.add("item_text")
  let text_content = item.title || item.url
  text_content = text_content.substring(0, 250)
  text.textContent = text_content

  item.element.append(text)
  item.created = true
}

// Fully create the item element
App.fill_item_element = function (item) {
  item.element.title = item.url

  let icon = App.el(".item_icon", item.element)
  jdenticon.update(icon, App.get_unit(item.clean_url).toLowerCase())

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
      if (item.created && !item.hidden) {
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
      if (item.created && !item.hidden) {
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
  item.hidden = false

  if (!item.created) {
    App.create_item_element(item)
  }

  item.element.classList.remove("hidden")
}

// Make an item not visible
App.hide_item = function (item) {
  item.hidden = true

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
}

// Do items filter
App.do_filter = function () {
  let value = App.el("#filter").value.trim()
  let items = App.get_items()
  let words = value.toLowerCase().split(" ").filter(x => x !== "")
  
  App.hide_other_items()

  function matched (item) {
    return words.every(x => item.title.toLowerCase().includes(x)) || 
      words.every(x => item.url.toLowerCase().includes(x))
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
  App.clear_filter()
  App.do_filter()
}

// Get favorite local storage
App.setup_favorites = function () {
  App.get_favorites()
  App.process_favorites()
}

// Get favorites
App.get_favorites = function () {
  App.favorites = App.get_local_storage(App.ls_favorites)

  if (App.favorites === null) {
    App.favorites = []
  }

  App.favorites = App.favorites.slice(0, App.config.max_favorites)  
}

// Get favorite items
App.process_favorites = function () {
  App.favorite_items = []
  App.process_items(App.favorite_items, App.favorites, "favorites")
  App.favorites_need_refresh = false
}

// Saves the favorite localStorage object
App.save_favorites = function () {
  App.save_local_storage(App.ls_favorites, App.favorites)
  App.favorites_need_refresh = true
}

// Add a favorite item
App.add_favorite = function (item) {
  item.favorite = true
  item.element.classList.add("favorite")

  // Remove from list first
  for (let i=0; i<App.favorites.length; i++) {
    if (App.favorites[i].url === item.url) {
      App.favorites.splice(i, 1)
      break
    }
  }

  let o = {}
  o.title = item.title
  o.url = item.url
  o.title = item.title
  App.favorites.unshift(o)
  let removed = App.favorites.slice(App.config.max_favorites)
  App.favorites = App.favorites.slice(0, App.config.max_favorites)

  // Remove items that are no longer favorite
  for (let r of removed) {
    let r_item = App.get_item_by_url(App.history_items, r.url)

    if (r_item) {
      r_item.favorite = false
      r_item.element.classList.remove("favorite")
    }
  }

  App.save_favorites()
}

// Remove a favorite item
App.remove_favorite = function (item) {
  item.favorite = false
  item.element.classList.remove("favorite")

  for (let i=0; i<App.favorites.length; i++) {
    let it = App.favorites[i]

    if (it.url === item.url) {
      App.favorites.splice(i, 1)
      App.save_favorites()
      break
    }
  }

  for (let item2 of App.history_items) {
    if (item2.url === item.url) {
      item2.favorite = false
      item2.element.classList.remove("favorite")
      break
    }
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