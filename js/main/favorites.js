// Get favorites
App.get_favorites = async function () {
  App.favorites = await App.get_storage(App.ls_favorites, [])
  App.process_favorites()
}

// Get favorite items
App.process_favorites = function () {
  App.favorite_items = []
  App.process_items(App.favorite_items, App.favorites, "favorites")
  App.favorites_need_refresh = false
}

// Saves the favorite storage object
App.save_favorites = function () {
  App.save_storage(App.ls_favorites, App.favorites)
  App.favorites_need_refresh = true
}

// Add a favorite item
App.add_favorite = function (item) {
  App.favorites = App.favorites.filter(x => x.url !== item.url)
  
  let o = {}
  o.url = item.url
  o.title = item.title
  
  App.favorites.unshift(o)
  App.favorites = App.favorites.slice(0, App.config.max_favorites)
    
  for (let it of App.history_items) {
    if (it.url === item.url) {
      it.element.classList.add("removed")
      break
    }
  }

  App.save_favorites()
  App.update_footer()
}

// Remove a favorite item
App.remove_favorite = function (item) {
  App.favorite_items = App.favorite_items.filter(x => x.url !== item.url)
  App.favorites = App.favorites.filter(x => x.url !== item.url)

  for (let it of App.history_items) {
    if (it.url === item.url) {
      it.element.classList.remove("removed")
      break
    }
  }

  item.element.classList.add("removed")
  App.save_favorites()
  App.update_footer()
}

// Show favorites
App.show_favorites = function () {
  App.set_mode("favorites")
  App.clear_filter()
  App.do_filter()
}

// Reload favorites
App.reload_favorites = function () {
  for (let item of App.favorite_items) {
    item.element.remove()
  }

  if (App.mode === "favorites") {
    App.selected_item = undefined
  }
  
  App.process_favorites()
}

// Toggle favorite
App.toggle_favorite = function (item) {
  if (item.type === "favorites") {
    App.remove_favorite(item)
  } else if (item.type === "history") {
    App.add_favorite(item)
  }

  if (App.mode === "both") {
    App.reload_favorites()
    App.do_filter()
  }
}

// Change to favorites
App.change_to_favorites = function (force = false) {
  App.log("Mode changed to favorites")

  if (force || App.favorites_need_refresh) {
    App.reload_favorites()
  }

  App.mouse_over_disabled = true
  App.set_mode("favorites")
  App.do_filter("mode_change")
}

// Simply data into an easily editable list
App.to_easy_data = function (list) {
  let items = []

  for (let item of list) {
    let props = []
    props.push(`title: ${item.title}`)
    props.push(`url: ${item.url}`)
    items.push(props.join("\n"))
  }

  return items.join("\n\n")
}

// Simply data into an easily editable list
App.from_easy_data = function (datastring) {
  let s = datastring.trim()

  if (!s) {
    return []
  }

  let items = datastring.split("\n\n")
  let obs = []

  for (let item of items) {
    let it = item.trim()

    if (!it) {
      continue
    }

    let o = {}

    for (let line of it.split("\n")) {
      let [key, ...value] = line.split(":")
      key = key.trim()
      value = value.join(":").trim()
      o[key] = value
    }

    obs.push(o)
  }

  return obs
}

// Get favorite urls
App.favorite_urls = function () {
  return App.favorite_items.map(x => x.url)
}

// Show recent history in a contex menu and other options
App.show_add_favorite = async function () {
  let history = await browser.history.search({
    text: "",
    maxResults: 100,
    startTime: App.history_months()
  })

  let urls = []
  let items = []
  let favorite_urls = App.favorite_urls()

  for (let h of history) {
    let url = App.format_url(h.url)

    if (favorite_urls.includes(url)) {
      continue
    }

    if (urls.includes(url)) {
      continue
    }

    urls.push(url)

    let title = h.title || h.url
    title = title.substring(0, 65)

    items.push({
      text: title,
      title: h.url,
      action: function () {
        App.add_favorite({
          title: h.title,
          url: url
        })

        App.change_to_favorites()
      }
    })

    if (items.length === 14) {
      break
    }
  }

  items.push({
    text: "< Enter Info Manually >",
    action: function () {
      App.show_item_editor()
    }
  })  

  NeedContext.show_on_element(App.el("#add_favorite_button"), items)
}