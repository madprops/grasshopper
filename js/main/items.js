// Setup items
App.setup_items = function () {
  App.start_item_observer()

  let text_mode = App.el("#text_mode")
  text_mode.value = App.state.text_mode

  App.ev(text_mode, "change", function () {
    App.state.text_mode = text_mode.value
    App.update_text()
    App.save_state()
  })
}

// When results are found
App.process_items = function (items, list, container) {
  let list_el = App.el(`#${list}`)
  list_el.innerHTML = ""
  App[`${list}_id`] = 0
  let urls = []
  let tab_urls

  if (list === "history") {
    tab_urls = App.tab_items.map(x => x.url)
  }

  for (let item of items) {
    if (!item.url) {
      continue
    }

    item.url = App.format_url(item.url)

    if (urls.includes(item.url)) {
      continue
    }

    if (list === "history") {
      if (tab_urls.includes(item.url)) {
        continue
      }
    }

    urls.push(item.url)

    let obj = App.process_item(item, list)
    
    if (!obj) {
      continue
    }
    
    container.push(obj)
    list_el.append(obj.element)
  }
}

// Process an item
App.process_item = function (item, list) {
  let url_obj

  try {
    url_obj = new URL(item.url)
  } catch (err) {
    return
  }

  let hostname = App.remove_slashes(url_obj.hostname)
  let path = App.remove_protocol(item.url)
  let id = `${list}_${App[`${list}_id`]}`
  
  let el = App.create("div", `item hidden ${list}_item`)
  el.dataset.id = id
  
  let text = App.create("div", "item_text")
  text.textContent = "Empty"
  el.append(text)

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
    element: el,
    id: id,
    tab_id: item.id,
    list: list
  }

  App[`${list}_id`] += 1
  return obj
}

// Start intersection observer to check visibility
// Used for lazy-loading components
App.start_item_observer = function () {
  let options = {
    root: App.el("#lists"),
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

      if (!item.created && App.item_is_visible(item)) {
        App.create_item_element(item)
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
  jdenticon.update(icon, item.hostname)
  icon_container.append(icon)
  item.element.prepend(icon_container)

  App.set_item_text(item)

  item.created = true
  App.log("Element created")
}

// Set item text content
App.set_item_text = function (item) {
  let content
  
  if (App.state.text_mode === "title") {
    content = item.title || item.path
    item.footer = item.path || item.title
  } else if (App.state.text_mode === "url") {
    content = item.path || item.title
    item.footer = item.title || item.path
  }
  
  content = content.substring(0, 200).trim()
  let text = App.el(".item_text", item.element)
  text.textContent = content
}

// Get all items
App.get_all_items = function () {
  return App.tab_items.concat(App.history_items)
}

// Change item text mode
App.update_text = function () {
  for (let item of App.get_all_items()) {
    if (item.created) {
      App.set_item_text(item)      
    }
  }
}

// Get next item that is visible
App.get_next_visible_item = function (o_item) {
  let items = App.get_list(o_item.list)
  let waypoint = false

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
App.get_prev_visible_item = function (o_item) {
  let items = App.get_list(o_item.list)
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
  for (let item of App.get_all_items()) {
    if (item.id === id) {
      return item
    }
  }
}

// Make item visible
App.show_item = function (item) {  
  item.element.classList.remove("hidden")
}

// Make an item not visible
App.hide_item = function (item) {
  item.element.classList.add("hidden")
}

// Make an item selected
// Unselect all the others
App.select_item = function (s_item, scroll = true) {
  if (!s_item.created) {
    App.create_item_element(s_item)
  }

  for (let el of App.els(".selected")) {
    el.classList.remove("selected")
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

// Show item menu
App.show_item_menu = function (item) {
  let items = [
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
    }
  ]

  let menu = App.el(".item_icon_container", item.element)
  NeedContext.show_on_element(menu, items)
}