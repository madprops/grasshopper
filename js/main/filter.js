// Setup filter
App.setup_filter = function () {
  App.filter = App.create_debouncer(function () {
    App.do_filter()
  }, App.filter_delay)

  App.ev(App.el("#filter"), "input", function () {
    App.filter()
  })

  App.ev(App.el("#filter_mode"), "change", function () {
    App.do_filter()
  })

  App.ev(App.el("#case_sensitive"), "change", function () {
    App.do_filter()
  })   
}

// Do tab filter
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

  if (App.tabs.length === 0) {
    return
  }
  
  let words = value.split(" ").filter(x => x !== "")
  let case_sensitive = App.el("#case_sensitive").checked
  let filter_words = case_sensitive ? words : words.map(x => x.toLowerCase())

  function check (what) {
    return filter_words.every(x => what.includes(x))
  }

  function matched (tab) {
    let match
    let title = case_sensitive ? tab.title : tab.title_lower
    let path = case_sensitive ? tab.path : tab.path_lower
    
    if (filter_mode === "title_url") {
      match = check(title) || check(path)
    } else if (filter_mode === "title") {
      match = check(title)
    } else if (filter_mode === "url") {
      match = check(path)
    } else if (filter_mode === "playing") {
      match = tab.audible &&
      (check(title) || check(path))    
    } else if (filter_mode === "pins") {
      match = tab.pinned &&
      (check(title) || check(path))  
    } else if (filter_mode === "muted") {
      match = tab.muted &&
      (check(title) || check(path))    
    } 
        
    if (!match) {
      return false
    }

    return true
  }

  let selected

  if (args.disable_mouse_over) {
    App.disable_mouse_over()
  }

  for (let tab of App.tabs) {
    if (matched(tab)) {
      App.show_tab(tab)

      if (!selected) {
        if (args.select_tab_id) {
          if (tab.id === args.select_tab_id) {
            selected = tab
            args.select_tab_id = undefined
          }
        } else if (args.select_new) {
          selected = tab
        }
      }
    } else {
      App.hide_tab(tab)
    }
  }

  if (selected) {
    App.select_tab({tab: selected})
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