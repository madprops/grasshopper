App.setup_lists = function () {
  let list = App.el("#lists")

  // When list items are clicked
  App.ev(list, "click", function (e) {
    if (e.target.closest(".item")) {
      let el = e.target.closest(".item")
      let item = App.get_item_by_id(el.dataset.id)

      if (e.target.closest(".item_icon_container")) {
        App.show_item_menu(item)
      } else if (e.target.closest(".item_text")) {
        App.open_tab(item)
      }      
    }
  })

  // When list items get hovered
  App.ev(list, "mouseover", function (e) {
    if (App.mouse_over_disabled) {
      return
    }
    
    if (e.target.closest(".item")) {
      let el = e.target.closest(".item")
      let item = App.get_item_by_id(el.dataset.id)
      App.select_item(item, false)
    }
  })
}

// Disable mouse over
App.disable_mouse_over = function () {
  App.mouse_over_disabled = true
}

// Enable mouse over with a timeout
App.enable_mouse_over = function () {
  clearTimeout(App.enable_mouse_over_timeout)

  App.enable_mouse_over_timeout = setTimeout(function () {
    App.mouse_over_disabled = false
  }, App.disable_mouse_delay)
}

// Get a list
App.get_list = function (list) {
  return App.el(`#${list}`)
}

// Switch to the other list
App.switch_list = function () {
  if (App.selected_item) {
    let list = App.get_other_list(App.selected_item.list)
    let item = App.get_first_visible_item(list)
    
    if (item) {
      App.select_item(item)
    }
  }
}

// Get other list
App.get_other_list = function (list) {
  return list == "tabs" ? "history" : "tabs"
}

// Scroll lists to top
App.scroll_lists = function () {
  App.get_list("tabs").scrollTop = 0
  App.get_list("history").scrollTop = 0
}