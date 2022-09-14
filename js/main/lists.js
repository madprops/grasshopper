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
      App.disable_mouse_over()
      App.select_item({item: item})
      App.enable_mouse_over()
    }
  }
}

// Get other list
App.get_other_list = function (list) {
  return list == "tabs" ? "history" : "tabs"
}

// Scroll a list to the top
App.scroll_list = function (list) {
  App.get_list(list).scrollTop = 0
}

// Show tabs and history
App.show_lists = async function (mode = "slice") {
  if (mode === "slice") {
    let tabs = await App.get_tabs()
    App.process_tabs(tabs)
  }

  let history = await App.get_history(mode)
  App.process_history(history)

  App.do_filter()
}

// Set list title
App.set_list_title = function (list, num) {
  if (list === "tabs") {
    App.el("#tabs_title").textContent = `Tabs (${num})`
  } else if (list === "history") {
    App.el("#history_title").textContent = `History (${num})`
  }
}

// Count and update list titles
App.update_list_title = function (list) {
  App.set_list_title(list, App.count_visible_items(list))
}