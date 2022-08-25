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
App.save_favorites = async function () {
  await App.save_storage(App.ls_favorites, App.favorites)
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
  
  if (App.mode === "history") {
    item.element.classList.add("removed")
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

  item.element.remove()
  App.save_favorites()
  App.update_footer()
}

// Update a favorite item
App.update_favorite = function (item) {
  for (let it of App.favorites) {
    if (it.url === item.url) {
      it.title = item.title
      App.save_favorites()
      return
    }
  }
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
  if (App.mode === "favorites") {
    App.remove_favorite(item)
  } else {
    App.add_favorite(item)
  }
}

// Change to favorites
App.change_to_favorites = function () {
  App.log("Mode changed to favorites")

  if (App.favorites_need_refresh) {
    App.reload_favorites()
  }

  App.set_mode("favorites")
  App.do_filter()
}

// Update a favorite item
App.update_favorite_info = async function (item) {
  let h = await App.get_history_item(item.url)

  if (h) {
    item.title = h.title
    item.title_lower = h.title.toLowerCase()
    App.remake_element(item)    
    App.update_favorite(item)
  }
}