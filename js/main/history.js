// Setup history
App.setup_history = function () {
  App.create_window("history") 

  App.ev(App.el("#history_button"), "click", function () {  
    App.show_history()
  })

  App.filter_history = App.create_debouncer(function () {
    App.do_item_filter("history")
  }, App.filter_delay)
  
  App.ev(App.el("#history_filter"), "input", function () {
    App.filter_history()
  })  

  App.ev(App.el("#history_filter_mode"), "change", function () {
    App.do_item_filter("history")
  })

  App.ev(App.el("#history_case_sensitive"), "change", function () {
    App.do_item_filter("history")
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
    App.do_item_filter("history")
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