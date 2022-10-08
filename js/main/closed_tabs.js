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
    
    let div = App.create("div", "closed_tabs_item")
    let icon = App.get_img_icon(c.tab.favIconUrl)
    div.append(icon)

    let text = App.create("div")
    text.textContent = c.tab.title
    div.append(text)

    div.title = c.tab.url
    div.dataset.index = index

    container.append(div)

    let ct = {
      index: index,
      url: c.tab.url,
      title: c.tab.title,
      window_id: c.tab.windowId,
      session_id: c.tab.sessionId,
      element: div
    }

    index += 1

    App.closed_tabs.push(ct)  
  }

  container.scrollTop = 0
  App.windows["closed_tabs"].show()
  App.select_first_closed_tab()
  App.focus_closed_tabs_filter()
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

// Remove item of a closed tab
App.clean_closed_tab = function (id) {
  let item = App.get_item_by_id(id)

  if (item) {
    App.close_tab(item, false)
  }
}

// Filter closed tabs
App.do_filter_closed_tabs = function () {
  let value = App.el("#closed_tabs_filter").value.toLowerCase().trim()

  for (let tab of App.closed_tabs) {
    if (tab.title.toLowerCase().includes(value) || 
        tab.url.toLowerCase().includes(value)) {
      tab.element.classList.remove("hidden")
    } else {
      tab.element.classList.add("hidden")
    }
  }

  App.select_first_closed_tab()
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
}

// Selected closed tab action
App.closed_tab_action = function () {
  App.restore_tab(App.selected_closed_tab)
}

// Select item above
App.closed_tab_above = function () {
  let i = App.selected_closed_tab.index

  for (let tab of App.closed_tabs.slice(0).reverse()) {
    if (tab.index < i) {
      if (App.closed_tab_is_visible(tab)) {
        App.select_closed_tab(tab)
        return
      }
    }
  }
}

// Select item below
App.closed_tab_below = function () {
  let i = App.selected_closed_tab.index

  for (let tab of App.closed_tabs) {
    if (tab.index > i) {
      if (App.closed_tab_is_visible(tab)) {
        App.select_closed_tab(tab)
        return
      }
    }
  }
}

// Check if closed tab is visible
App.closed_tab_is_visible = function (tab) {
  return !tab.element.classList.contains("hidden")
}