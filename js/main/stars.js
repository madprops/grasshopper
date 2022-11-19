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

    App.ev(App.el("#star_editor_unstar"), "click", function () {
      App.unstar_item()
    })
  }, on_x: function () {
    App.show_last_window()
  }, after_show: function () {
    App.update_star_editor_info()
  }, on_hide: function () {
    App.show_last_window()
  }})
}

// Hide star editor
App.hide_star_editor = function () {
  App.windows.star_editor.hide()
}

// Stars action
App.stars_action = function (item) {
  App.open_star(item)
}

// Stars action alt
App.stars_action_alt = function (item) {
  App.open_star(item, false)
}

// Open star
App.open_star = async function (item, close = true) {
  let star = await App.get_star_by_id(item.id)
  App.update_star(star)
  App.focus_or_open_item(App.selected_stars_item, close)
}

// Get stars
App.get_stars = async function () {
  if (!App.stars) {
    await App.stor_get_stars()
  }

  App.stars.items.sort((a, b) => (a.date_last_visit < b.date_last_visit) ? 1 : -1)
  return App.stars.items
}

// Update star data
App.update_star = function (item) {
  item.date_last_visit = Date.now()
  App.stor_save_stars()
}

// Add an item to stars
App.star_item = function (item) {
  App.stars.items.unshift({
    id: `${Date.now()}_${item.url.substring(0, 45)}`,
    url: item.url,
    title: item.title,
    date_added: Date.now(),
    date_last_visit: Date.now()
  })

  if (App.stars.items.length > App.max_stars) {
    App.stars.items.pop()
  }

  App.stor_save_stars()
}

// Remove an item from stars
App.unstar_item = function () {
  if (!App.star_edited) {
    return
  }

  if (!confirm("Remove this star?")) {
    return
  }

  if (App.stars_items) {
    App.remove_item("stars", App.selected_stars_item)
  }
  
  for (let [i, it] of App.stars.items.entries()) {
    if (it.id === App.star_edited.id) {
      App.stars.items.splice(i, 1)
      break
    }
  }

  App.stor_save_stars()
  App.hide_star_editor()
}

// Show stars editor
App.show_star_editor = async function (item) {
  App.star_edited = await App.get_star_by_id(item.id)
  App.el("#star_editor_title").value = item.title
  App.el("#star_editor_url").value = item.url
  App.show_window("star_editor")
  App.el("#star_editor_title").focus()
}

// Add or update star information
App.star_editor_save = async function () {
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
    let star = await App.get_star_by_id(App.star_edited.id)

    if (star) {
      star.title = title
      star.url = url
      App.update_star(star)
      App.hide_star_editor()
      return
    }
  }
    
  App.star_item({
    title: title,
    url: url
  })

  App.hide_star_editor()
}

// Get star by id
App.get_star_by_id = async function (id) {
  if (!App.stars) {
    await App.get_stars()
  }

  for (let it of App.stars.items) {
    if (it.id === id) {
      return it
    }
  }
}

// Get star by url (first result)
App.get_star_by_url = async function (url) {
  if (!App.stars) {
    await App.get_stars()
  }

  for (let it of App.stars.items) {
    if (App.urls_equal(it.url, url)) {
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

// Add a star or edit an existing one
App.add_or_edit_star = async function (item) {
  let star = await App.get_star_by_url(item.url)

  if (star) {
    App.show_star_editor(star)
  } else {
    App.new_star(item.title, item.url)
  }
}

// Update star editor info
App.update_star_editor_info = function () {
  let info = App.el("#star_editor_info")
  let added = App.el("#star_editor_added")
  let visited = App.el("#star_editor_visited")
  let save = App.el("#star_editor_save")

  if (App.star_edited) {
    save.textContent = "Update"
    visited.textContent = App.nice_date(App.star_edited.date_last_visit)
    added.textContent = App.nice_date(App.star_edited.date_added)
    info.classList.remove("hidden")
    App.el("#star_editor_unstar").classList.remove("hidden")
  } else {
    save.textContent = "Save"
    info.classList.add("hidden")
    App.el("#star_editor_unstar").classList.add("hidden")
  }
}