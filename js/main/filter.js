// Setup filter
App.setup_filter = function () {
  App.filter = App.create_debouncer(function () {
    App.do_filter()
  }, App.filter_delay)

  App.ev(App.el("#filter"), "input", function () {
    App.filter()
  })

  App.ev(App.el("#clear_button"), "click", function () {
    App.clear()
    App.do_filter()
  })

  App.ev(App.el("#filter_mode"), "change", function () {
    App.do_filter()
  })

  App.ev(App.el("#case_sensitive"), "change", function () {
    App.do_filter()
  })   
}

// Do items filter
App.do_filter = function (select_new = true) {   
  let value = App.el("#filter").value.trim()
  let filter_mode = App.el("#filter_mode").value

  if (!App.full_history) {
    if (value || filter_mode !== App.default_filter_mode) {
      App.show_lists("full")
      return
    }
  }

  let items = App.get_all_items()

  if (items.length === 0) {
    return
  }
  
  App.log(`<< Filtering ${items.length} items >>`)
  let words = value.split(" ").filter(x => x !== "")
  let case_sensitive = App.el("#case_sensitive").checked
  let filter_words = case_sensitive ? words : words.map(x => x.toLowerCase())

  function matched (item) {
    let match
    let title = case_sensitive ? item.title : item.title_lower
    let path = case_sensitive ? item.path : item.path_lower

    if (filter_mode === "title_url") {
      match = filter_words.every(x => title.includes(x)) || 
        filter_words.every(x => path.includes(x))
    } else if (filter_mode === "title") {
      match = filter_words.every(x => title.includes(x))
    } else if (filter_mode === "url") {
      match = filter_words.every(x => path.includes(x))
    }
    
    if (!match) {
      return false
    }

    return true
  }

  let selected
  let num_tabs = 0
  let num_history = 0
  App.disable_mouse_over()

  for (let item of items) {
    if (matched(item)) {
      App.show_item(item)

      if (!selected) {
        selected = item
      }

      if (item.list === "tabs") {
        num_tabs += 1
      } else if (item.list === "history") {
        num_history += 1
      }
    } else {
      App.hide_item(item)
    }
  }

  if (!select_new && App.selected_item) {
    if (App.item_is_visible(App.selected_item)) {
      selected = App.selected_item
    }
  }

  if (selected) {
    App.select_item(selected)
  } else {
    App.selected_item = undefined
    App.update_footer()
  }

  // Avoid auto selecting when showing the window
  if (App.mouse_over_disabled) {
    App.enable_mouse_over()
  }

  App.scroll_lists()
  App.set_list_title("tabs", num_tabs)
  App.set_list_title("history", num_history)
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
  App.el("#filter_mode").value = App.default_filter_mode
}

// Reset case sensitive
App.reset_case_sensitive = function () {
  App.el("#case_sensitive").checked = false
}

// Clear some state
App.clear = function () {
  App.clear_filter()
  App.reset_filter_mode()
  App.reset_case_sensitive()
}