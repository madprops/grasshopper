// Setup stars
App.setup_stars = function () {
  App.setup_item_window("stars")

  App.ev(App.el("#stars_new_button"), "click", function () {
    App.new_star()
  })
  
  App.create_window({id: "star_editor", setup: function () {
    App.ev(App.el("#star_editor_save"), "click", function () {
      App.star_editor_save()
    })
  }, on_hide: function () {
    App.show_window(App.last_window_mode)
  }})

  App.stars_items = App.get_stars()
}

// Selected stars item action
App.stars_action = function () {
  App.star_item(App.selected_stars_item)
  App.focus_or_open_item(App.selected_stars_item)
}

// Get stars
App.get_stars = function () {
  let stars = App.stars.items
  stars.sort((a, b) => (a.date_last_visit < b.date_last_visit) ? 1 : -1)
  return stars
}

// Update star data
App.update_star = function (item) {
  item.date_last_visit = Date.now()
  item.visits += 1
  App.stor_save_stars()
}

// Add an item to stars
App.star_item = function (item) {
  App.stars.items.unshift({
    id: `${Date.now()}_${item.url.substring(0, 45)}`,
    url: item.url,
    title: item.title,
    date_added: Date.now(),
    date_last_visit: Date.now(),
    visits: 1
  })

  App.stor_save_stars()
}

// Remove an item from stars
App.unstar_item = function (item) {
  let star = App.get_item_by_url("stars", item.url)
  App.remove_item("stars", star)
  App.stars.items = App.stars_items.slice(0, App.max_stars)
  App.stor_save_stars()
}

// Show stars editor
App.show_star_editor = function (item) {
  App.star_edited = item
  App.el("#star_editor_title").value = item.title
  App.el("#star_editor_url").value = item.url
  App.show_window("star_editor")
  App.el("#star_editor_title").focus()
}

// Update star information
App.star_editor_save = function () {
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
    let star = App.get_star_by_id(App.star_edited.id)

    if (star) {
      star.title = title
      star.url = url
      App.update_star(star)
      App.windows["star_editor"].hide()
      return
    }
  }
    
  App.star_item({
    title: title,
    url: url
  })

  App.windows["star_editor"].hide()
}

// Get star by id
App.get_star_by_id = function (id) {
  for (let it of App.get_stars()) {
    if (it.id === id) {
      return it
    }
  }
}

// Add a new star manually
App.new_star = function (title = "", url = "") {
  App.star_edited = undefined
  App.el("#star_editor_title").value = title
  App.el("#star_editor_url").value = url
  App.show_window("star_editor")
  App.el("#star_editor_title").focus()
}


// Show information about stars
App.show_stars_info = async function () {
  let n = App.stars_items.length
  let s = App.plural(n, "star", "stars")
  alert(`${s} saved`)
}

// Confirm un-star item
App.confirm_unstar_item = function (item) {
  if (confirm("Remove this star?")) {
    App.unstar_item(item)
  }
}