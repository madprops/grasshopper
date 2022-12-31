// Setup stars
App.setup_stars = function () {
  App.stars_actions = [
    {text: "--separator--"},

    {text: "Undo", action: function () {
      App.restore_stars()
    }},

    {text: "Export", action: function () {
      App.export_stars()
    }},

    {text: "Import", action: function () {
      App.import_stars()
    }},
  ]

  App.setup_item_window("stars")

  App.create_window({id: "star_editor", setup: function () {
    App.ev(App.el("#star_editor_save"), "click", function () {
      App.star_editor_save()
    })

    App.ev(App.el("#star_editor_remove"), "click", function () {
      App.remove_star()
    })

    App.ev(App.el("#star_editor_clear"), "click", function () {
      App.clear_star_editor()
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
  App.item_action(item)
}

// Stars action alt
App.stars_action_alt = function (item, shift_key) {
  App.remove_stars(item, shift_key)
}

// Open star
App.open_star = function (item, close = true) {
  let star = App.get_star_by_id(item.id)
  App.update_star(star)
  App.focus_or_open_item(item, close)
}

// Launch star
App.launch_star = function (item) {
  let star = App.get_star_by_id(item.id)
  App.update_star(star)
  App.launch_item(item, false)
}

// Get stars
App.get_stars = function () {
  let stars = structuredClone(App.stars)
  stars.sort((a, b) => (a.date_last_visit < b.date_last_visit) ? 1 : -1)
  return stars
}

// Update star data
App.update_star = function (item, add_visit = true) {
  item.date_last_visit = Date.now()

  if (add_visit) {
    item.visits += 1
  }

  App.stor_save_stars()
}

// Add an item to stars
App.star_item = function (item, save = true) {
  let old = App.get_star_by_url(item.url)

  if (old) {
    old.title = item.title
    old.url = item.url
    App.update_star(old, false)
    return
  }

  let obj = {
    id: `${Date.now()}_${App.star_counter}`,
    url: item.url,
    title: item.title,
    date_added: Date.now(),
    date_last_visit: Date.now(),
    visits: 0
  }

  App.star_counter += 1
  App.stars.unshift(obj)

  if (App.stars.length > App.max_stars) {
    App.stars = App.stars.slice(0, App.max_stars)
  }

  if (save) {
    App.stor_save_stars()
  }

  return obj
}

// Remove an item from stars
App.remove_star = function () {
  if (!App.star_edited) {
    return
  }

  App.show_confirm("Remove this star?", function () {
    App.do_remove_stars([App.star_edited.id])
    App.hide_star_editor()
  })
}

// Do remove action
App.do_remove_stars = function (ids) {
  for (let id of ids) {
    if (App.stars_items) {
      let item = App.get_item_by_id("stars", id)

      if (item) {
        App.remove_item(item)
      }
    }
  }

  App.stars = App.stars.filter(x => !ids.includes(x.id))
  App.stor_save_stars()
}

// Show stars editor
App.show_star_editor = function (item) {
  App.star_edited = App.get_star_by_id(item.id)
  App.el("#star_editor_title").value = item.title
  App.el("#star_editor_url").value = item.url
  App.show_window("star_editor")
  App.el("#star_editor_title").focus()
}

// Add or update star information
App.star_editor_save = function () {
  let title = App.el("#star_editor_title").value.trim()
  let url = App.el("#star_editor_url").value.trim()

  if (!title || !url) {
    return
  }

  try {
    new URL(url)
  } catch (err) {
    App.show_alert("Invalid URL")
    return
  }

  if (App.star_edited) {
    let star = App.get_star_by_id(App.star_edited.id)

    if (star) {
      star.title = title
      star.url = url
      App.update_star(star, false)

      if (App.stars_items) {
        App.update_item("stars", App.star_edited.id, star)
      }

      App.hide_star_editor()
      return
    }
  }

  App.star_item({
    title: title,
    url: url
  })

  if (App.last_window_mode === "stars") {
    App.show_item_window("stars")
  }
  else {
    App.hide_star_editor()
  }
}

// Get star by id
App.get_star_by_id = function (id) {
  for (let it of App.stars) {
    if (it.id === id) {
      return it
    }
  }
}

// Get star by url (first result)
App.get_star_by_url = function (url) {
  for (let it of App.stars) {
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

// New star with pre-filled details
App.new_star_from_active = async function () {
  let tab = await App.get_active_tab()

  if (tab) {
    App.new_star(tab.title, tab.url)
  }
}

// Add a star or edit an existing one
App.add_or_edit_star = function (item) {
  let star

  if (item.mode === "stars") {
    star = App.get_star_by_id(item.id)
  }
  else{
    star = App.get_star_by_url(item.url)
  }

  if (star) {
    App.show_star_editor(star)
  }
  else {
    App.new_star(item.title, item.url)
  }
}

// Update star editor info
App.update_star_editor_info = function () {
  let about = App.el("#star_editor_about")
  let info = App.el("#star_editor_info")
  let visits = App.el("#star_editor_visits")
  let visited = App.el("#star_editor_visited")
  let added = App.el("#star_editor_added")
  let save = App.el("#star_editor_save")
  let remove = App.el("#star_editor_remove")
  let clear = App.el("#star_editor_clear")

  if (App.star_edited) {
    save.textContent = "Update"
    visits.textContent = App.star_edited.visits.toLocaleString()
    visited.textContent = App.nice_date(App.star_edited.date_last_visit)
    added.textContent = App.nice_date(App.star_edited.date_added)
    about.classList.add("hidden")
    info.classList.remove("hidden")
    remove.classList.remove("hidden")
    clear.classList.add("hidden")
  }
  else {
    save.textContent = "Save"
    about.classList.remove("hidden")
    info.classList.add("hidden")
    remove.classList.add("hidden")
    clear.classList.remove("hidden")
  }
}

// Remove multiple stars
App.remove_stars = function (item, force = false) {
  let active = App.get_active_items("stars", item)
  let ids = active.map(x => x.id)

  App.show_confirm(`Remove stars? (${ids.length})`, function () {
    App.backup_stars()
    App.do_remove_stars(ids)
    App.dehighlight("stars")
  }, function () {
    App.dehighlight("stars")
  }, force)
}

// Backup stars
App.backup_stars = function () {
  App.stars_backup = structuredClone(App.stars)
}

// Undo remove stars
App.restore_stars = function () {
  if (App.stars_backup) {
    App.stars = App.stars_backup
    App.stor_save_stars()
    App.show_window("stars")
  }
  else {
    App.show_feedback("Nothing to undo")
  }
}

// Display stars json
App.export_stars = function () {
  App.show_textarea("Copy this to import it later", JSON.stringify(App.stars, null, 2))
}

// Use star json to replace stars
App.import_stars = function () {
  App.show_input("Paste the data text here", "Import", function (text) {
    if (!text) {
      return
    }

    let json

    try {
      json = JSON.parse(text)
    } catch (err) {
      App.show_alert("Invalid JSON")
      return
    }

    if (json) {
      App.show_confirm("Use this data?", function () {
        App.stars = json
        App.stor_save_stars()
        App.show_window("stars")
      })
    }
  })
}

// Star items
App.star_items = function (item) {
  let items = []
  let active = App.get_active_items(item.mode, item)

  if (active.length === 1) {
    App.add_or_edit_star(active[0])
    App.dehighlight(item.mode)
    return
  }

  for (let item of active) {
    let exists = App.get_star_by_url(item.url)

    if (exists) {
      continue
    }

    items.push(item)
  }

  if (items.length === 0) {
    App.dehighlight(item.mode)
    return
  }

  App.show_confirm(`Star items? (${items.length})`, function () {
    for (let item of items) {
      App.star_item(item, false)
    }

    App.stor_save_stars()
    App.dehighlight(item.mode)
  }, function () {
    App.dehighlight(item.mode)
  })
}

// Toggle star
App.toggle_star = function (item) {
  let star = App.get_star_by_url(item.url)

  if (star) {
    App.remove_stars(star, true)
    return false
  }
  else {
    App.star_item(item)
    return true
  }
}

// Clear star editor
App.clear_star_editor = function () {
  App.el("#star_editor_title").value = ""
  App.el("#star_editor_url").value = ""
  App.el("#star_editor_title").focus()
}