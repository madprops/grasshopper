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
// Args: select_new, disable_mouse_over
App.do_filter = function (args = {}) {
  if (args.select_new === undefined) {
    args.select_new = true
  }

  if (args.disable_mouse_over === undefined) {
    args.disable_mouse_over = true
  }

  let value = App.el("#filter").value.trim()
  let filter_mode = App.el("#filter_mode").value
  let tabs_only = filter_mode === "playing"

  if (!tabs_only && !App.full_history && value) {
    App.show_lists("full")
    return
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
    } else if (filter_mode === "playing") {
      match = item.status.includes("Playing")
    } else if (filter_mode === "pinned") {
      match = item.status.includes("Pinned")
    }
        
    if (!match) {
      return false
    }

    return true
  }

  let selected
  let num_tabs = 0
  let num_history = 0

  if (args.disable_mouse_over) {
    App.disable_mouse_over()
  }

  for (let item of items) {
    if (matched(item)) {
      App.show_item(item)

      if (args.select_new && !selected) {
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

  if (selected) {
    App.select_item({item: selected})
  } else {
    App.update_footer()
  }

  // Avoid auto selecting when showing the window
  if (App.mouse_over_disabled) {
    App.enable_mouse_over()
  }

  if (selected) {
    App.scroll_list(App.get_other_list(selected.list))
  }

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
  App.el("#filter_mode").value = "title_url"
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