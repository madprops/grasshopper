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
  let exclude = [] 

  if (list === "history") {
    exclude = App.tab_items.map(x => x.url)
  }

  for (let item of items) {
    if (!item.url) {
      continue
    }

    let obj = App.process_item(item, list, exclude)

    if (list === "history") {
      exclude.push(item.url)    
    }
    
    if (!obj) {
      continue
    }
    
    container.push(obj)
    list_el.append(obj.element)
  }
}

// Process an item
App.process_item = function (item, list, exclude) {
  item.url = App.format_url(item.url)

  if (list === "history") {
    if (exclude.includes(item.url)) {
      return
    }
  }   

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
    list: list,
    favicon: item.favIconUrl
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

// Get generated icon
App.get_gen_icon = function (item) {
  let icon = App.create("canvas", "item_icon")
  icon.width = 25
  icon.height = 25
  jdenticon.update(icon, item.hostname)
  return icon
}

// Create an item element
App.create_item_element = function (item) {
  let icon_container = App.create("div", "item_icon_container")
  let icon

  if (item.favicon) {
    icon = App.create("img", "item_icon")
    icon.loading = "lazy"
    icon.width = 25
    icon.height = 25
    
    App.ev(icon, "error", function () {
      let icon = App.get_gen_icon(item)
      this.replaceWith(icon)
    })

    icon.src = item.favicon
  } else {
    icon = App.get_gen_icon(item)
  }

  icon_container.append(icon)
  item.element.prepend(icon_container)

  App.set_item_text(item)

  if (item.list === "tabs") {
    let close = App.create("div", "item_close action unselectable")
    close.textContent = "Close"
    item.element.append(close)
  }

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
  let items = App.get_items(o_item.list)
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
  let items = App.get_items(o_item.list)
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

// Get first visible item
App.get_first_visible_item = function (list) {
  let items = App.get_items(list)
  
  for (item of items) {
    if (App.item_is_visible(item)) {
      return item
    }
  }
}

// Get items of a list
App.get_items = function (list) {
  return list === "tabs" ? App.tab_items : App.history_items
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

// Remove an item
App.remove_item = function (item) {
  let items = App.get_items(item.list)
  item.element.remove()

  for (let [i, it] of items.entries()) {
    if (it.id === item.id) {
      items.splice(i, 1)
      break
    }
  }
}