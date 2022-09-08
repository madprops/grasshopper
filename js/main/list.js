App.setup_list = function () {
  let list = App.el("#list")

  // When list items are clicked
  App.ev(list, "click", function (e) {
    if (e.target.closest(".item")) {
      let el = e.target.closest(".item")
      let item = App.get_item_by_id(App.get_all_items(), el.dataset.id)

      App.open_tab(item)
    }
  })

  // When list items are clicked
  App.ev(list, "auxclick", function (e) {
    if (e.target.closest(".item")) {
      let el = e.target.closest(".item")
      let item = App.get_item_by_id(App.get_all_items(), el.dataset.id)
      App.open_tab(item, false)
    }
  })

  // When list items get hovered
  App.ev(list, "mouseover", function (e) {
    if (App.mouse_over_disabled) {
      return
    }
    
    if (e.target.closest(".item")) {
      let el = e.target.closest(".item")
      let item = App.get_item_by_id(App.get_all_items(), el.dataset.id)
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
  }, 200)
}

// Switch to the other list
App.switch_list = function () {
  if (App.selected_item) {
    App.disable_mouse_over()

    App.select_item(
      App.get_first_visible_item(
        App.other_list(App.selected_item.type)
      )
    )

    App.enable_mouse_over()
  }
}

// Get other list type string
App.other_list = function (type) {
  return type === "recent" ? "history" : "recent"
}

// Scroll lists to top
App.scroll_lists = function () {
  App.get_list("recent").scrollTop = 0
  App.get_list("history").scrollTop = 0
}

// Get a list
App.get_list = function (type) {
  return App.el(`#${type}_list`)
}