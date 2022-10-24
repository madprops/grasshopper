// Setup closed tabs
App.setup_closed_tabs = function () {
  App.create_window({id: "closed_tabs"}) 

  App.filter_closed_tabs = App.create_debouncer(function () {
    App.do_filter_closed_tabs()
  }, App.filter_delay)
  
  App.ev(App.el("#closed_tabs_filter"), "input", function () {
    App.filter_closed_tabs()
  })

  App.ev(App.el("#closed_tabs_filter_mode"), "change", function () {
    App.do_filter_closed_tabs()
  })

  App.ev(App.el("#closed_tabs_case_sensitive"), "change", function () {
    App.do_filter_closed_tabs()
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
  App.closed_tabs = []
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

    App.closed_tabs.push(ct)  
  }

  container.scrollTop = 0
  App.windows["closed_tabs"].show()
  App.select_first_closed_tab()
  let v = App.el("#filter").value.trim()
  App.el("#closed_tabs_filter").value = v

  if (v) {
    App.do_filter_closed_tabs()
  }
}

// Select first closed tab
App.select_first_closed_tab = function () {
  for (let tab of App.closed_tabs) {
    if (App.closed_tab_is_visible(tab)) {
      App.select_closed_tab(tab)
      return
    }
  }
}

// Remove a closed tab
App.clean_closed_tab = function (id) {
  let tab = App.get_tab_by_id(id)

  if (tab) {
    App.close_tab(tab, false)
  }
}

// Filter closed tabs
App.do_filter_closed_tabs = function () {
  let value = App.el("#closed_tabs_filter").value.trim()
  let words = value.split(" ").filter(x => x !== "")
  let case_sensitive = App.el("#closed_tabs_case_sensitive").checked
  let filter_mode = App.el("#closed_tabs_filter_mode").value
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

  for (let it of App.closed_tabs) {
    if (matched(it)) {
      it.element.classList.remove("hidden")
    } else {
      it.element.classList.add("hidden")
    }
  }

  App.select_first_closed_tab()
  App.update_closed_tabs_footer()
}

// Focus the closed tabs filter
App.focus_closed_tabs_filter = function () {
  App.el("#closed_tabs_filter").focus()
}

// Select a closed tab
App.select_closed_tab = function (tab) {
  for (let el of App.els(".closed_tabs_item")) {
    el.classList.remove("selected")
  }

  tab.element.classList.add("selected")
  App.selected_closed_tab = tab
  App.selected_closed_tab.element.scrollIntoView({block: "nearest"})
  App.update_closed_tabs_footer()
}

// Selected closed tab action
App.closed_tab_action = function () {
  App.restore_tab(App.selected_closed_tab)
}

// Get previous visible closed tab
App.get_prev_visible_closed_tab = function (t) {
  let i = t.index

  for (let tab of App.closed_tabs.slice(0).reverse()) {
    if (!tab.removed && tab.index < i) {
      if (App.closed_tab_is_visible(tab)) {
        return tab
      }
    }
  }
}

// Get next visible closed tab
App.get_next_visible_closed_tab = function (t) {
  let i = t.index

  for (let tab of App.closed_tabs) {
    if (!tab.removed && tab.index > i) {
      if (App.closed_tab_is_visible(tab)) {
        return tab
      }
    }
  }
}

// Get closed tab above
App.closed_tab_above = function () {
  let tab = App.get_prev_visible_closed_tab(App.selected_closed_tab)

  if (tab) {
    App.select_closed_tab(tab, true)
  }
}

// Get closed tab below
App.closed_tab_below = function () {
  let tab = App.get_next_visible_closed_tab(App.selected_closed_tab)

  if (tab) {
    App.select_closed_tab(tab, true)
  }
}

// Check if closed tab is visible
App.closed_tab_is_visible = function (tab) {
  return !tab.element.classList.contains("hidden")
}

// Remove a closed tab from the list
App.remove_closed_tab = function (tab) {
  let next_tab = App.get_next_visible_closed_tab(tab) || App.get_prev_visible_closed_tab(tab)
  tab.element.remove()
  
  if (next_tab) {
    App.select_closed_tab(next_tab)
  }

  tab.removed = true
}

// Show closed tab menu
App.show_closed_tab_menu = function (tab, x, y) {
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

// Update the closed tabs footer
App.update_closed_tabs_footer = function () {
  if (App.selected_closed_tab_valid()) {
    App.el("#closed_tabs_footer").textContent = App.selected_closed_tab.footer
  } else {
    App.el("#closed_tabs_footer").textContent = "No Results"
  }
}

// Check if selected closed tab is valid
App.selected_closed_tab_valid = function () {
  return App.selected_closed_tab && !App.selected_closed_tab.removed && App.tab_is_visible(App.selected_closed_tab)
}