// Setup items
App.setup_items = function () {
  App.start_item_observer()

  App.ev(App.el("#info_button"), "click", function () {  
    App.show_info_menu()
  })
}

// When results are found
App.process_items = function (container, items, type) {
  App.log(`Processing: ${type}`)

  let list = App.el(`#list_${type}`)
  let urls = []
  let removed = []

  if (type === "history") {
    removed = App.recent_urls()
  }

  for (let item of items) {
    if (!item.url) {
      continue
    }

    let original_url = item.url
    item.url = App.format_url(item.url)

    if (urls.includes(item.url)) {
      continue
    }

    urls.push(item.url)

    let obj = App.process_item(type, item, removed)

    if (!obj) {
      continue
    }

    obj.original_url = original_url
    container.push(obj)
    list.append(obj.element)
  }
  
  // Check performance
  App.log(`Results: ${items.length}`)
}

// Process an item
App.process_item = function (type, item, removed) {
  let url_obj

  try {
    url_obj = new URL(item.url)
  } catch (err) {
    return
  }

  let hostname = App.remove_slashes(url_obj.hostname)
  let pathname = App.remove_slashes(url_obj.pathname)
  let clean_url = App.remove_slashes(url_obj.origin + url_obj.pathname)
  
  let el = App.create("div", "item hidden")
  el.dataset.url = item.url

  if (type === "recent") {
    el.classList.add("recent_item")
  } else {
    el.classList.add("history_item")
  }

  App.item_observer.observe(el)

  if (type === "recent") {
    recent = true
  }

  if (removed) {
    if (removed.includes(item.url)) {
      el.classList.add("removed")
    }
  }

  let title = item.title || pathname

  let obj = {
    title: title,
    title_lower: title.toLowerCase(),
    url: item.url,
    clean_url: clean_url,
    clean_url_lower: clean_url.toLowerCase(),
    hostname: hostname,
    pathname: pathname,
    created: false,
    filled: false,
    element: el,
    type: type
  }

  return obj
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
      
      if (!entry.target.classList.contains("item")) {
        return
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
    item.footer = item.title || item.pathname
  } else if (App.config.text_mode === "path") {
    content = item.pathname || item.hostname
    item.footer = item.title || item.pathname
  }
  
  content = content.substring(0, 200).trim()
  text.textContent = content  
  item.element.append(text)

  let menu = App.create("div", "item_menu")
  menu.textContent = "Menu"
  item.element.append(menu)
  item.created = true
}

// Fully create the item element
App.fill_item_element = function (item) {
  let icon = App.el(".item_icon", item.element)
  jdenticon.update(icon, item.hostname)
  item.filled = true
  App.log("Element created")
}

// Get all items
App.get_all_items = function () {
  return App.recent_items.concat(App.history_items)
}

// Get next item that is visible
App.get_next_visible_item = function (o_item) {
  let items = App.get_items(o_item.type)
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

// Get first visible item of a list
App.get_first_visible_item = function (type) {
  for (let item of App.get_items(type)) {
    if (App.item_is_visible(item)) {
      return item
    }
  }
}

// Get prev item that is visible
App.get_prev_visible_item = function (o_item) {
  let items = App.get_items(o_item.type)
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

// Get the item of a recent
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
  let items = App.get_all_items()

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

// Element to item
App.element_to_item = function (el) {
  return App.get_item_by_url(App.get_all_items(), el.dataset.url)
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
    App.el("#footer").textContent = App.selected_item.footer
  } else {
    App.el("#footer").textContent = "No Results"
  }
}

// Show item context menu
App.show_item_menu = function (item) {
  let items = []
  let text = App.el(".item_text", item.element)

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

  if (items.length > 0) {
    NeedContext.show_on_element(App.el(".item_menu", item.element), items)
  }
}

// Remove items that match a url
App.remove_items_by_url = function (url) {
  let items = App.get_all_items()

  for (let item of items) {
    if (item.url === url) {
      item.element.classList.add("removed")
    }
  }
}

// Get the initial items of a list
App.get_slice = function (type) {
  return App.get_items(type).slice(0, App.initial_items)
}

// Show initial items
App.start_items = async function () {
  App.log("-- Starting items --")

  App.el("#list_recent").innerHTML = ""
  App.el("#list_history").innerHTML = ""

  await App.get_recent()
  App.process_recent()

  await App.get_history()
  App.process_history()

  App.do_filter()
}

// Get other list type string
App.other_list = function (type) {
  return type === "recent" ? "history" : "recent"
}

// Get items of a type
App.get_items = function (type) {
  return App[`${type}_items`]
}