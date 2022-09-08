// Setup items
App.setup_items = function () {
  App.start_item_observer()
}

// When results are found
App.process_items = function (items) {
  App.el("#list").innerHTML = ""
  App.current_id = 0
  App.items = []
  let list = App.el("#list")
  let urls = []

  for (let item of items) {
    if (!item.url) {
      continue
    }

    item.url = App.format_url(item.url)

    if (urls.includes(item.url)) {
      continue
    }

    urls.push(item.url)

    let obj = App.process_item(item)

    if (!obj) {
      continue
    }

    App.items.push(obj)
    list.append(obj.element)
  }
}

// Process an item
App.process_item = function (item) {
  let url_obj

  try {
    url_obj = new URL(item.url)
  } catch (err) {
    return
  }

  let hostname = App.remove_slashes(url_obj.hostname)
  let path = App.remove_protocol(item.url)
  let el = App.create("div", "item hidden")
  el.dataset.id = App.current_id
  App.item_observer.observe(el)
  let title = item.title || path

  let obj = {
    title: title,
    title_lower: title.toLowerCase(),
    url: item.url,
    path: path,
    path_lower: path.toLowerCase(),
    hostname: hostname,
    created: false,
    filled: false,
    element: el,
    id: App.current_id
  }

  App.current_id += 1
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
  let icon = App.create("canvas", "item_icon")
  icon.width = 25
  icon.height = 25
  item.element.append(icon)

  let text = App.create("div", "item_text")
  let content
  
  if (App.config.text_mode === "path") {
    content = item.path || item.title
    item.footer = item.title || item.path
  } else if (App.config.text_mode === "title") {
    content = item.title || item.path
    item.footer = item.path || item.title
  } 
  
  content = content.substring(0, 200).trim()
  text.textContent = content  
  item.element.append(text)
  item.created = true
}

// Fully create the item element
App.fill_item_element = function (item) {
  let icon = App.el(".item_icon", item.element)
  jdenticon.update(icon, item.hostname)
  item.filled = true
  App.log("Element created")
}

// Get next item that is visible
App.get_next_visible_item = function (o_item) {
  let items = App.items
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
  let items = App.items
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

// Get an item by id dataset
App.get_item_by_id = function (id) {
  id = parseInt(id)

  for (let item of App.items) {
    if (item.id === id) {
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
  let items = App.items

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

// Element to item
App.element_to_item = function (el) {
  return App.get_item_by_id(el.dataset.id)
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