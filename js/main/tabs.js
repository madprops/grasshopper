// Get list of open tabs
App.get_tabs = async function () {
  let items = await browser.tabs.query({ currentWindow: true })
  items.sort((a, b) => (a.lastAccessed < b.lastAccessed) ? 1 : -1)
  return items
}

// Process tabs
App.process_tabs = function (tabs) {
  App.tab_items = []
  App.process_items(tabs, "tabs", App.tab_items)
}

// Open a new tab with a url
App.open_tab = function (item, close = true) {
  if (item.list === "tabs") {
    browser.tabs.update(item.tab_id, {active: close})
  } else {
    browser.tabs.create({url: item.url, active: close})
  }

  if (close) {
    window.close()
  }
}

// Close a tab
App.close_tab = function (item) {
  browser.tabs.remove(item.tab_id)
  App.remove_item(item)
  App.do_filter()
}

// Setup tabs
App.setup_tabs = async function () {
  App.ev(App.el("#closed_button"), "click", function () {
    App.show_closed_tabs()
  })

  App.ev(App.el("#new_button"), "click", function () {
    App.new_tab()
  })  

  browser.tabs.onUpdated.addListener(function (tab_id) {
    App.refresh_tab(tab_id)
  })
}

// Restore a closed tab
App.restore_tab = async function (tab) {
  await browser.sessions.forgetClosedTab(tab.windowId, tab.sessionId)
  App.open_tab(tab, true)
}

// Open a new tab
App.new_tab = function () {
  browser.tabs.create({active: true})
  window.close()
}

// Refresh tabs
App.refresh_tab = async function (tab_id) {
  let item = App.get_item_by_tab_id(tab_id)
  let info = await browser.tabs.get(tab_id)
  console.log(info.title)

  if (item) {
    App.update_tab(item, info)
  } else {
    App.prepend_tab(info)
  }
}

// Get tab by tab id
App.get_item_by_tab_id = function (tab_id) {
  for (let item of App.tab_items) {
    if (item.tab_id === tab_id) {
      return item
    }
  }
}

// Update a tab
App.update_tab = function (item, info) {
  for (let [i, it] of App.tab_items.entries()) {
    if (it.tab_id === item.tab_id) {
      let item = App.process_item({
        item: info,
        list: "tabs",
        id: it.id
      })

      App.tab_items[i].element.replaceWith(item.element)
      App.tab_items[i] = item
      App.create_item_element(item)
      App.do_filter(false)
      break
    }
  }
}

// Prepend tab to the top
App.prepend_tab = function (tab) {
  let item = App.process_item({
    item: tab,
    list: "tabs"
  })

  App.tab_items.unshift(item)
  App.el("#tabs").prepend(item.element)
  App.create_item_element(item)
  App.do_filter(false)
}

// Show closed tabs
App.show_closed_tabs = async function () {
  let closed = await browser.sessions.getRecentlyClosed()
  let container = App.create("div", "unselectable", "closed_container")
  let urls = []

  for (let c of closed) {
    if (c.tab) {
      c.tab.url = App.format_url(c.tab.url)
      let url_obj

      try {
        url_obj = new URL(c.tab.url)
      } catch (err) {
        continue
      }

      if (urls.includes(c.tab.url)) {
        continue
      }

      urls.push(c.tab.url)
      
      let div = App.create("div", "closed_item action")
      let hostname = App.remove_slashes(url_obj.hostname)
      let icon = App.get_gen_icon(hostname)
      div.append(icon)
      let text = App.create("div")
      text.textContent = c.tab.title
      div.append(text)
      div.title = c.tab.url
      
      App.ev(div, "click", function () {
        App.restore_tab(c.tab)
      })

      container.append(div)
    }
  }

  App.show_window_2(container)
}