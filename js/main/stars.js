// Setup stars
App.setup_stars = function () {
  App.setup_window("stars")
  
  App.create_window("star_editor", function () {
    App.ev(App.el("#star_editor_save"), "click", function () {
      App.update_star()
    })
  })

  App.stars_items = App.get_stars()
}

// Selected stars item action
App.stars_action = function () {
  App.open_stars_item(App.selected_stars_item)
}

// Open stars item
App.open_stars_item = function (item, close = true) {
  App.star_item(item)
  browser.tabs.create({url: item.url, active: close})

  if (close) {
    window.close()
  }
}

// Get stars
App.get_stars = function () {
  return App.state.stars
}

// Add an item to stars
App.star_item = function (item) {
  for (let [i, it] of App.stars_items.entries()) {
    if (it.url === item.url) {
      App.stars_items.splice(i, 1)
      break
    }
  }

  App.stars_items.unshift({
    id: `${Date.now()}_${item.url.substring(0, 100)}`,
    url: item.url,
    title: item.title
  })

  App.state.stars = App.stars_items.slice(0, App.max_stars)
  App.save_state()
}

// Remove an item from stars
App.unstar_item = function (item) {
  let star = App.get_item_by_url("stars", item.url)
  App.remove_item("stars", star)
  App.state.stars = App.stars_items.slice(0, App.max_stars)
  App.save_state()
}

// Show stars editor
App.show_star_editor = function (item) {
  App.star_edited = item
  App.el("#star_editor_title").value = item.title
  App.el("#star_editor_url").value = item.url
  App.windows["star_editor"].show()
  App.el("#star_editor_title").focus()
}

// Update star information
App.update_star = function () {
  let title = App.el("#star_editor_title").value
  let url = App.el("#star_editor_url").value

  App.unstar_item(App.star_edited)

  App.star_item({
    title: title,
    url: url
  })

  App.show_window("stars")
}