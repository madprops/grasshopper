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

  if (App.tab_items.length === 0) {
    return
  }
  
  App.log(`<< Filtering ${App.tab_items.length} items >>`)
  let words = value.split(" ").filter(x => x !== "")
  let case_sensitive = App.el("#case_sensitive").checked
  let filter_words = case_sensitive ? words : words.map(x => x.toLowerCase())

  function check (what) {
    return filter_words.every(x => what.includes(x))
  }

  function matched (item) {
    let match
    let title = case_sensitive ? item.title : item.title_lower
    let path = case_sensitive ? item.path : item.path_lower
    
    if (filter_mode === "title_url") {
      match = check(title) || check(path)
    } else if (filter_mode === "title") {
      match = check(title)
    } else if (filter_mode === "url") {
      match = check(path)
    } else if (filter_mode === "playing") {
      match = item.status.includes("playing") &&
      (check(title) || check(path))    
    } else if (filter_mode === "pins") {
      match = item.status.includes("pinned") &&
      (check(title) || check(path))  
    }
        
    if (!match) {
      return false
    }

    return true
  }

  let selected
  let num_matched = 0

  if (args.disable_mouse_over) {
    App.disable_mouse_over()
  }

  for (let item of App.tab_items) {
    if (matched(item)) {
      App.show_item(item)

      if (args.select_new && !selected) {
        selected = item
      }

      num_matched += 1
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