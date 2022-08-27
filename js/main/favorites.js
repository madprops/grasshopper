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

  App.reload_favorites()
  App.do_filter()
}

// Change to favorites
App.change_to_favorites = function () {
  App.log("Mode changed to favorites")

  if (App.favorites_need_refresh) {
    App.reload_favorites()
  }

  App.set_mode("favorites")
  App.do_filter("mode_change")
}

// Edit the title of a favorite
App.edit_favorite_title = function (item) {
  let new_title = prompt("Enter new Title", item.title)

  if (new_title) {
    item.title = new_title
    App.add_favorite(item)
    App.reload_favorites()
    App.do_filter()
  }
}

// Edit the url of a favorite
App.edit_favorite_url = function (item) {
  let new_url = prompt("Enter new URL", item.url)

  if (new_url) {
    App.remove_favorite(item)
    item.url = new_url
    App.add_favorite(item)
    App.reload_favorites()
    App.do_filter()
  }
}