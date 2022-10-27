// Setup history
App.setup_history = function () {
  App.create_window("history") 

  App.ev(App.el("#history_button"), "click", function () {  
    App.show_history()
  })

  App.filter_history = App.create_debouncer(function () {
    App.do_filter_history()
  }, App.filter_delay)
  
  App.ev(App.el("#history_filter"), "input", function () {
    App.filter_history()
  })  

  App.ev(App.el("#history_filter_mode"), "change", function () {
    App.do_filter_history()
  })

  App.ev(App.el("#history_case_sensitive"), "change", function () {
    App.do_filter_history()
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
    let purl

    if (c.url.startsWith("http://")) {
      purl = c.url
    } else {
      purl = path
    }  

    let content = c.title || purl
    let footer = decodeURI(purl) || c.title

    text.textContent = content
    div.append(text)

    div.dataset.index = index
    
    let open = App.create("div", "item_button history_open")
    open.textContent = "Open"
    div.append(open)
    
    container.append(div)
    let title = c.title || path

    let item = {
      index: index,
      url: c.url,
      title: title,
      title_lower: title.toLowerCase(),
      element: div,
      footer: footer,
      path: path,
      path_lower: path.toLowerCase(),
      removed: false
    }

    index += 1

    App.history_items.push(item)  
  }

  container.scrollTop = 0
  App.windows["history"].show()
  App.select_first_item("history")
  let v = App.el("#tabs_filter").value.trim()
  App.el("#history_filter").value = v

  if (v) {
    App.do_filter_history()
  }  
}

// Open history item
App.open_history_item = function (item, close = true) {
  browser.tabs.create({url: item.url, active: close})

  if (close) {
    window.close()
  }
}

// Selected history item action
App.history_item_action = function () {
  App.open_history_item(App.selected_history_item)
}

// Filter history tabs
App.do_filter_history = function () {
  let value = App.el("#history_filter").value.trim()
  let words = value.split(" ").filter(x => x !== "")
  let case_sensitive = App.el("#history_case_sensitive").checked
  let filter_mode = App.el("#history_filter_mode").value
  let filter_words = case_sensitive ? words : words.map(x => x.toLowerCase())

  function check (what) {
    return filter_words.every(x => what.includes(x))
  }

  function matched (it) {
    let match = false
    let title = case_sensitive ? it.title : it.title_lower
    let path = case_sensitive ? it.path : it.path_lower
    
    if (filter_mode === "all") {
      match = check(title) || check(path)
    } else if (filter_mode === "title") {
      match = check(title)
    } else if (filter_mode === "url") {
      match = check(path)
    }

    return match
  }

  for (let it of App.history_items) {
    if (matched(it)) {
      it.element.classList.remove("hidden")
    } else {
      it.element.classList.add("hidden")
    }
  }

  App.select_first_item("history")
  App.update_history_footer()
}

// Show history item menu
App.show_history_item_menu = function (tab, x, y) {
  let items = []

  items.push({
    text: "Copy URL",
    action: function () {
      App.copy_to_clipboard(tab.url)
    }
  })

  items.push({
    text: "Copy Title",
    action: function () {
      App.copy_to_clipboard(tab.title)
    }
  }) 

  NeedContext.show(x, y, items)
}