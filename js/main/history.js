// Setup history
App.setup_history = function () {
  App.create_window({id: "history"}) 

  App.ev(App.el("#history_button"), "click", function () {  
    App.show_history()
  })

  App.filter_history = App.create_debouncer(function () {
    App.do_filter_history()
  }, App.filter_delay)
  
  App.ev(App.el("#history_filter"), "input", function () {
    App.filter_history()
  })  
}

// Get items from history
App.get_history = async function () {
  let items = await browser.history.search({
    text: "",
    maxResults: App.history_max_items,
    startTime: App.history_months()
  })

  return items
}

// Get history months date
App.history_months = function () {
  return Date.now() - (1000 * 60 * 60 * 24 * 30 * App.history_max_months)
}

// Show history
App.show_history = async function () {
  let items = await App.get_history()
  let container = App.el("#history_container")
  container.innerHTML = ""

  let urls = []
  App.history_items = []
  let index = 0

  for (let c of items) {
    if (c.url.startsWith("about:")) {
      continue
    }

    c.url = App.format_url(c.url)

    try {
      url_obj = new URL(c.url)
    } catch (err) {
      continue
    }

    if (urls.includes(c.url)) {
      continue
    }

    urls.push(c.url)
    
    let div = App.create("div", "item history_item")
    let icon = App.get_jdenticon(c.url)
    div.append(icon)

    let text = App.create("div", "item_text")
    let path = App.remove_protocol(c.url)
    let content, purl, footer

    if (c.url.startsWith("http://")) {
      purl = c.url
    } else {
      purl = path
    }  

    if (App.state.text_mode === "title") {
      content = c.title || purl
      footer = decodeURI(purl) || c.title
    } else if (App.state.text_mode === "url") {
      content = decodeURI(purl) || c.title
      footer = c.title || purl
    }  

    text.textContent = content
    div.append(text)

    div.dataset.index = index
    
    let open = App.create("div", "item_button history_open")
    open.textContent = "Open"
    div.append(open)
    
    container.append(div)

    let item = {
      index: index,
      url: c.url,
      title: c.title || "No Title",
      element: div,
      footer: footer
    }

    index += 1

    App.history_items.push(item)  
  }

  container.scrollTop = 0
  App.windows["history"].show()
  App.select_first_history_item()
  let v = App.el("#filter").value.trim()
  App.el("#history_filter").value = v

  if (v) {
    App.do_filter_history()
  }  
}

// Select first history item
App.select_first_history_item = function () {
  for (let item of App.history_items) {
    if (App.history_item_is_visible(item)) {
      App.select_history_item(item)
      return
    }
  }
}

// Check if history item is visible
App.history_item_is_visible = function (item) {
  return !item.element.classList.contains("hidden")
}

// Select a history item
App.select_history_item = function (item, disable_mouse_over = false) {
  for (let el of App.els(".history_item")) {
    el.classList.remove("selected")
  }

  item.element.classList.add("selected")

  if (disable_mouse_over) {
    App.flash_mouse_over()
  }

  App.selected_history_item = item
  App.selected_history_item.element.scrollIntoView({block: "nearest"})
  App.update_history_footer()
}

// Update history footer
App.update_history_footer = function () {
  if (App.selected_valid()) {
    App.el("#history_footer").textContent = App.selected_history_item.footer
  } else {
    App.el("#history_footer").textContent = "No Results"
  }
}

// Open history item
App.open_history_item = function (item, close = true) {
  browser.tabs.create({url: item.url, active: close})

  if (close) {
    window.close()
  }
}

// Remove a history item from the list
App.remove_history_item = function (item) {
  let next_item = App.get_next_visible_history_item(item) || App.get_prev_visible_history_item(item)
  item.element.remove()
  
  if (next_item) {
    App.select_history_item(next_item)
  }

  item.removed = true
}

// Get previous visible history item
App.get_prev_visible_history_item = function (t) {
  let i = t.index

  for (let item of App.history_items.slice(0).reverse()) {
    if (!item.removed && item.index < i) {
      if (App.history_item_is_visible(item)) {
        return item
      }
    }
  }
}

// Get next visible history item
App.get_next_visible_history_item = function (t) {
  let i = t.index

  for (let item of App.history_items) {
    if (!item.removed && item.index > i) {
      if (App.history_item_is_visible(item)) {
        return item
      }
    }
  }
}

// Selected history item action
App.history_item_action = function () {
  App.open_history_item(App.selected_history_item)
}

// Focus the history filter
App.focus_history_filter = function () {
  App.el("#history_filter").focus()
}

// Get history item above
App.history_item_above = function () {
  let item = App.get_prev_visible_history_item(App.selected_history_item)

  if (item) {
    App.select_history_item(item, true)
  }
}

// Get history item below
App.history_item_below = function () {
  let item = App.get_next_visible_history_item(App.selected_history_item)

  if (item) {
    App.select_history_item(item, true)
  }
}

// Filter history items
App.do_filter_history = function () {
  let value = App.el("#history_filter").value.toLowerCase().trim()
  App.disable_mouse_over()

  for (let item of App.history_items) {
    if (item.title.toLowerCase().includes(value) || 
        item.url.toLowerCase().includes(value)) {
      item.element.classList.remove("hidden")
    } else {
      item.element.classList.add("hidden")
    }
  }

  App.select_first_history_item()
  App.enable_mouse_over()
}