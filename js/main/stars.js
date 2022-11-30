// Setup stars
App.setup_stars = function () {
  let actions = [
    ["New Star", function () {
      App.new_star()
    }],

    ["Un-Star", function () {
      App.unstar_stars()
    }],

    ["--separator--"],

    ["Export", function () {
      App.export_stars()
    }],

    ["Import", function () {
      App.import_stars()
    }]    
  ]

  App.setup_item_window("stars", actions)
  
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
App.star_item = async function (item, save = true) {
  if (!App.stars) {
    await App.get_stars()
  }
    
  let obj = {
    id: `${Date.now()}_${App.star_counter}`,
    url: item.url,
    title: item.title,
    date_added: Date.now(),
    date_last_visit: Date.now()
  }

  App.star_counter += 1
  App.stars.items.unshift(obj)

  if (App.stars.items.length > App.max_stars) {
    App.stars.items = App.stars.items.slice(0, App.max_stars)
  }

  if (save) {
    App.stor_save_stars()
  }
  
  return obj
}

// Remove an item from stars
App.unstar_item = function () {
  if (!App.star_edited) {
    return
  }

  App.show_confirm("Remove this star?", function () {
    App.do_unstar([App.star_edited.id])
    App.hide_star_editor()
  })
}

// Do unstar action
App.do_unstar = function (ids) {
  for (let id of ids) {
    if (App.stars_items) {
      let item = App.get_item_by_id("stars", id)
  
      if (item) {
        App.remove_item(item)
      }
    }
  }

  App.stars.items = App.stars.items.filter(x => !ids.includes(x.id))
  App.stor_save_stars()
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
    App.show_alert("Invalid URL")
    return
  }

  if (App.star_edited) {
    let star = await App.get_star_by_id(App.star_edited.id)

    if (star) {
      star.title = title
      star.url = url
      App.update_star(star)

      if (App.stars_items) {
        App.update_item("stars", App.star_edited.id, star)
      }

      App.hide_star_editor()
      return
    }
  }
    
  let new_star = App.star_item({
    title: title,
    url: url
  })

  App.prepend_star(new_star)
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
  let star

  if (item.mode === "stars") {
    star = await App.get_star_by_id(item.id)
  } else{
    star = await App.get_star_by_url(item.url)
  }

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

// Unstar multiple stars
App.unstar_stars = function () {
  let ids = []
  let highlights = App.get_highlights("stars")

  for (let star of App.stars_items) {
    if (highlights.length > 0) {
      if (!highlights.includes(star)) {
        continue
      }
    } else {
      if (!star.visible) {
        continue
      }
    }
    
    ids.push(star.id)
  }

  if (ids.length === 0) {
    return
  }
  
  let s = App.plural(ids.length, "star", "stars")

  App.show_confirm(`Remove stars? (${s})`, function () {
    App.stars_backup = App.stars.items.slice(0)
    App.do_unstar(ids)
    App.show_dialog("Stars have been deleted", [
      ["Undo", function () {
        App.undo_unstar_stars()
      }]
    ])
  })
}

// Undo unstar stars
App.undo_unstar_stars = function () {
  App.stars.items = App.stars_backup
  App.stor_save_stars()
  App.show_window("stars")
  App.show_alert("Stars have been restored")
}

// Prepend a star
App.prepend_star = function (star) {
  if (App.last_window_mode === "stars") {
    let item = App.process_item("stars", star)

    if (item) {
      App.stars_items.unshift(item)
      App.create_item_element(item)
      App.update_info("stars")
      App.el("#stars_container").prepend(item.element)
    }
  }
}

// Display stars json
App.export_stars = function () {
  App.show_textarea("Copy this to import it later", JSON.stringify(App.stars.items, null, 2))
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
        App.stars.items = json
        App.stor_save_stars()
        App.show_window("stars")
      })
    }
  })
}