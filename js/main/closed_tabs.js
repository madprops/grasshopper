// Setup closed tabs
App.setup_closed_tabs = function () {
  App.create_window("closed_tabs")

  App.filter_closed_tabs = App.create_debouncer(function () {
    App.do_item_filter("closed_tabs")
  }, App.filter_delay)
  
  App.ev(App.el("#closed_tabs_filter"), "input", function () {
    App.filter_closed_tabs()
  })

  App.ev(App.el("#closed_tabs_filter_mode"), "change", function () {
    App.do_item_filter("closed_tabs")
  })

  App.ev(App.el("#closed_tabs_case_sensitive"), "change", function () {
    App.do_item_filter("closed_tabs")
  })    
}

// Show closed tabs
App.show_closed_tabs = async function () {
  let closed = await browser.sessions.getRecentlyClosed({
    maxResults: 25
  })

  let container = App.el("#closed_tabs_container")
  container.innerHTML = ""

  let urls = []
  App.closed_tabs_items = []
  let index = 0

  for (let c of closed) {
    if (!c.tab) {
      continue
    }

    if (c.tab.url.startsWith("about:")) {
      continue
    }

    c.tab.url = App.format_url(c.tab.url)

    try {
      url_obj = new URL(c.tab.url)
    } catch (err) {
      continue
    }

    if (urls.includes(c.tab.url)) {
      continue
    }

    urls.push(c.tab.url)
    
    let div = App.create("div", "item closed_tabs_item")
    let icon = App.get_img_icon(c.tab.favIconUrl, c.tab.url)
    div.append(icon)

    let text = App.create("div", "item_text")
    let path = App.remove_protocol(c.tab.url)
    let purl

    if (c.tab.url.startsWith("http://")) {
      purl = c.tab.url
    } else {
      purl = path
    }  

    let content = c.tab.title || purl
    let footer = decodeURI(purl) || tab.title

    text.textContent = content
    div.append(text)

    div.dataset.index = index
    
    let open = App.create("div", "item_button closed_tabs_open")
    open.textContent = "Open"
    div.append(open)
    
    container.append(div)
    let title = c.tab.title || path

    let ct = {
      index: index,
      url: c.tab.url,
      title: title,
      title_lower: title.toLowerCase(),
      window_id: c.tab.windowId,
      session_id: c.tab.sessionId,
      element: div,
      removed: false,
      footer: footer,
      path: path,
      path_lower: path.toLowerCase()
    }

    index += 1

    App.closed_tabs_items.push(ct)  
  }

  container.scrollTop = 0
  App.windows["closed_tabs"].show()
  App.select_first_item("closed_tabs")
  let v = App.el("#tabs_filter").value.trim()
  App.el("#closed_tabs_filter").value = v

  if (v) {
    App.do_item_filter("closed_tabs")
  }
}

// Remove a closed tab
App.clean_closed_tab = function (id) {
  let tab = App.get_tab_by_id(id)

  if (tab) {
    App.close_tab(tab, false)
  }
}

// Selected closed tab action
App.closed_tab_action = function () {
  App.restore_tab(App.selected_closed_tab)
}