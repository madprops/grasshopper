// Setup stars
App.setup_stars = function () {
  App.setup_item_window("stars")

  App.ev(App.el("#stars_new_button"), "click", function () {
    App.new_star()
  })
  
  App.create_window({id: "star_editor", setup: function () {
    App.ev(App.el("#star_editor_save"), "click", function () {
      App.update_star()
    })
  }, on_hide: function () {
    App.show_item_window("stars")
  }})

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
    title: item.title,
    date: Date.now()
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
  let title = App.el("#star_editor_title").value.trim()
  let url = App.el("#star_editor_url").value.trim()

  if (!title || !url) {
    return
  }

  try {
    new URL(url)
  } catch (err) {
    alert("Invalid URL")
    return
  }

  if (App.star_edited) {
    App.unstar_item(App.star_edited)
  }

  App.star_item({
    title: title,
    url: url
  })

  App.windows["star_editor"].hide()
}

// Add a new star manually
App.new_star = function () {
  App.star_edited = undefined
  App.el("#star_editor_title").value = ""
  App.el("#star_editor_url").value = ""
  App.windows["star_editor"].show()
  App.el("#star_editor_title").focus()
}
