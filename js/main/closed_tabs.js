// Show closed tabs
App.show_closed_tabs = async function () {
  let closed = await browser.sessions.getRecentlyClosed({
    maxResults: 25
  })

  let el = App.create("div", "", "closed_main")
  el.innerHTML = App.get_template("closed")
  let container = App.el("#closed_container", el)
  let urls = []

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
    
    let div = App.create("div", "closed_item")
    let icon = App.get_img_icon(c.tab.favIconUrl)

    div.append(icon)
    let text = App.create("div")
    text.textContent = c.tab.title
    div.append(text)
    div.title = c.tab.url
    div.dataset.url = c.tab.url
    div.dataset.title = c.tab.title
    
    App.ev(div, "click", function () {
      App.restore_tab(c.tab)
    })

    App.ev(div, "auxclick", function (e) {
      if (e.button === 1) {
        App.restore_tab(c.tab, false)
        div.remove()
      }
    })

    container.append(div)
  }

  App.show_window_2(el)

  let filter = App.el("#closed_filter", el)

  App.closed_filter = App.create_debouncer(function () {
    App.filter_closed_tabs()
  }, App.filter_delay)
  
  App.ev(filter, "input", function () {
    App.closed_filter()
  })

  filter.focus()
  container.scrollTop = 0
  App.window_mode = "closed_tabs"
}

// Remove item of a closed tab
App.clean_closed_tab = function (id) {
  let item = App.get_item_by_id(id)

  if (item) {
    App.close_tab(item, false)
  }
}

// Filter closed tabs
App.filter_closed_tabs = function () {
  let value = App.el("#closed_filter").value.toLowerCase().trim()

  for (let item of App.els(".closed_item")) {
    if (item.dataset.title.toLowerCase().includes(value) || 
        item.dataset.url.toLowerCase().includes(value)) {
      item.classList.remove("hidden")
    } else {
      item.classList.add("hidden")
    }
  }
}

App.focus_closed_filter = function () {
  App.el("#closed_filter").focus()
}