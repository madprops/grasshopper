// Do items filter
App.do_filter = function (mode = "typed") {
  App.log("Doing filter")
  App.disable_mouse_over()

  let value = App.el("#filter").value.trim()
  let items = App.get_items()
  let words = value.split(" ").filter(x => x !== "")
  let filter_mode = App.el("#filter_mode").value
  let case_sensitive = App.el("#case_sensitive").checked
  let filter_words = case_sensitive ? words : words.map(x => x.toLowerCase())
  
  App.hide_other_items()

  function matched (item) {
    let match
    let title = case_sensitive ? item.title : item.title_lower
    let clean_url = case_sensitive ? item.clean_url : item.clean_url_lower

    if (filter_mode === "title_url") {
      match = filter_words.every(x => title.includes(x)) || 
        filter_words.every(x => clean_url.includes(x))
    } else if (filter_mode === "title") {
      match = filter_words.every(x => title.includes(x))
    } else if (filter_mode === "url") {
      match = filter_words.every(x => clean_url.includes(x))
    } else if (filter_mode.startsWith("url_")) {
      match = filter_words.every(x => clean_url.includes(x))

      if (match) {
        let n = App.only_numbers(filter_mode)

        if (!item.pathname) {
          match = n === 1
        } else {
          let parts = item.pathname.split("/")
          match = n === parts.length + 1
        }
      }
    }
    
    if (!match) {
      return false
    }

    if (App.item_is_removed(item)) {
      return false
    }

    return true
  }

  let selected = false
  let matched_favorite = false  
  let matched_history = false

  for (let item of items) {
    if (matched(item)) {
      App.show_item(item)

      if (!selected) {
        if (App.item_is_visible(item)) {
          App.select_item(item)
          selected = true
        }
      }

      if (App.mode === "both") {
        if (item.type === "favorites") {
          matched_favorite = true
        } else if (item.type === "history") {
          matched_history = true
        }
      }
    } else {
      App.hide_item(item)
    }
  }

  if (App.mode === "both") {
    if (!matched_favorite) {
      App.hide_list_favorites()
    }
  
    if (!matched_history) {
      App.hide_list_history()
    }
  }

  if (!selected) {
    if (App.config.both_on_empty && App.mode !== "both" && mode !== "mode_change") {
      App.show_both()
    } else {
      App.selected_item = undefined
      App.update_footer()
    }
  }

  // Avoid auto selecting when showing the window
  if (App.mouse_over_disabled) {
    App.enable_mouse_over()
  }
}

// Focus the filter
App.focus_filter = function () {
  App.el("#filter").focus()
}

// Clear filter
App.clear_filter = function () {
  App.el("#filter").value = ""
}

// Reset filter mode
App.reset_filter_mode = function () {
  App.el("#filter_mode").value = "title_url"
}

// Reset case sensitive
App.reset_case_sensitive = function () {
  App.el("#case_sensitive").checked = false
}