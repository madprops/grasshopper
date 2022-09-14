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
  App[`${list}_id`] = 1
  let exclude = [] 

  if (list === "history") {
    exclude = App.tab_items.map(x => x.url)
  }

  for (let item of items) {
    if (!item.url) {
      continue
    }

    let obj = App.process_item({
      item: item, 
      list: list, 
      exclude: exclude
    })
    
    if (!obj) {
      continue
    }

    if (list === "history") {
      exclude.push(obj.url)    
    }    
    
    container.push(obj)
    list_el.append(obj.element)
  }
}

// Process an item
// Args: item, list, exclude, id
App.process_item = function (args) {
  let update

  if (args.id === undefined) {
    args.id = `${args.list}_${App[`${args.list}_id`]}`
    update = false
  } else {
    update = true
  }

  if (args.exclude === undefined) {
    args.exclude = []
  }

  args.item.url = App.format_url(args.item.url)

  if (args.list === "history") {
    if (args.exclude.includes(args.item.url)) {
      return
    }
  }   

  let url_obj

  try {
    url_obj = new URL(args.item.url)
  } catch (err) {
    return
  }

  let hostname = App.remove_slashes(url_obj.hostname)
  let path = App.remove_protocol(args.item.url)
  
  let el = App.create("div", `item hidden ${args.list}_item`)
  el.dataset.id = args.id
  App.empty_item_element(el)

  App.item_observer.observe(el)
  let title = args.item.title || path 
  let tab_id = args.list === "tabs" ? args.item.id : undefined
  let status = []

  if (args.item.audible) {
    status.push("Playing")
  }

  if (args.item.pinned) {
    status.push("Pinned")
  }

  let obj = {
    title: title,
    title_lower: title.toLowerCase(),
    url: args.item.url,
    path: path,
    path_lower: path.toLowerCase(),
    hostname: hostname,
    created: false,
    element: el,
    id: args.id,
    tab_id: tab_id,
    list: args.list,
    favicon: args.item.favIconUrl,
    audible: args.item.audible,
    status: status
  }

  if (!update) {
    App[`${args.list}_id`] += 1
  }

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

      let item = App.get_item_by_id(entry.target.dataset.id)

      if (!item) {
        continue
      }

      if (!item.created && App.item_is_visible(item)) {
        App.create_item_element(item)
      }
    }
  }, options)
}

// Get generated icon
App.get_gen_icon = function (hostname) {
  let icon = App.create("canvas", "item_icon")
  icon.width = 25
  icon.height = 25
  jdenticon.update(icon, hostname)
  return icon
}

// Get image favicon
App.get_img_icon = function (favicon, hostname) {
  let icon = App.create("img", "item_icon")
  icon.loading = "lazy"
  icon.width = 25
  icon.height = 25
  
  App.ev(icon, "error", function () {
    let icon = App.get_gen_icon(hostname)
    this.replaceWith(icon)
  })

  icon.src = favicon
  return icon
}

// Get an empty item element
App.empty_item_element = function (el) {
  el.innerHTML = ""
  let text = App.create("div", "item_text")
  text.textContent = "Empty"
  el.append(text)
}

// Create an item element
App.create_item_element = function (item) {
  let icon_container = App.create("div", "item_icon_container")
  let icon

  if (item.favicon) {
    icon = App.get_img_icon(item.favicon, item.hostname)
  } else {
    icon = App.get_gen_icon(item.hostname)
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
  let purl

  if (item.url.startsWith("http://")) {
    purl = item.url
  } else {
    purl = item.path
  }

  if (App.state.text_mode === "title") {
    content = item.title || purl
    item.footer = purl || item.title
  } else if (App.state.text_mode === "url") {
    content = purl || item.title
    item.footer = item.title || purl
  }

  if (item.status.includes("Playing")) {
    content = `(Playing) ${content}`
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
  let items = App.get_all_items()
  let waypoint = false

  if (!App.selected_valid()) {
    waypoint = true
  }

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
  let items = App.get_all_items()
  let waypoint = false

  if (!App.selected_valid()) {
    waypoint = true
  }  

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
// Args: item, scroll, disable_mouse_over
App.select_item = function (args) {
  if (args.scroll === undefined) {
    args.scroll = true
  }
  
  if (args.disable_mouse_over === undefined) {
    args.disable_mouse_over = false
  }  

  if (args.item.closed) {
    return
  }
  
  if (args.disable_mouse_over) {
    App.disable_mouse_over()
  }
  
  if (!args.item.created) {
    App.create_item_element(args.item)
  }

  for (let el of App.els(".selected")) {
    el.classList.remove("selected")
  }

  App.selected_item = args.item
  App.selected_item.element.classList.add("selected")

  if (args.scroll) {
    App.selected_item.element.scrollIntoView({block: "nearest"})
  }

  App.update_footer()

  if (args.item.list === "tabs") {
    browser.tabs.warmup(args.item.tab_id)
  }

  if (args.disable_mouse_over) {
    App.enable_mouse_over()
  }
}

// Check if item is visible
App.item_is_visible = function (item) {
  let hidden = item.element.classList.contains("hidden")
  return !hidden
}

// Update the footer
App.update_footer = function () {
  if (App.selected_valid()) {
    App.el("#footer").textContent = App.selected_item.footer
  } else {
    App.el("#footer").textContent = "No Results"
  }
}

// Show item menu
App.show_item_menu = function (item, x, y) {
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

  if (item.list === "tabs") {
    let index = App.get_item_index(item)

    if (index >= 0) {
      if (index > 0) {
        items.push({
          text: "Close Above",
          action: function () {
            App.close_tabs_above(item)
          }
        })
      }
  
      if (index < App.tab_items.length - 1) {
        items.push({
          text: "Close Below",
          action: function () {
            App.close_tabs_below(item)
          }
        })   
      }
    }

    if (App.tab_items.length > 1) {
      items.push({
        text: "Close Others",
        action: function () {
          App.close_other_tabs(item)
        }
      })    
    }

    items.push({
      text: "Keep Pins",
      action: function () {
        App.close_unpinned_tabs(item)
      }
    }) 
  }

  NeedContext.show(x, y, items)
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

// Select item above
App.select_item_above = function () {
  let item = App.get_prev_visible_item(App.selected_item)

  if (item) {
    App.select_item({item: item, disable_mouse_over: true})
  }
}

// Select item below
App.select_item_below = function () {
  let item = App.get_next_visible_item(App.selected_item)

  if (item) {
    App.select_item({item: item, disable_mouse_over: true})
  }
}

// Check if selected is valid
App.selected_valid = function () {
  return App.selected_item && App.item_is_visible(App.selected_item)
}

// Get index of item in list
App.get_item_index = function (item) {
  for (let [i, it] of App.get_items(item.list).entries()) {
    if (it === item) {
      return i
    }
  }

  return -1
}