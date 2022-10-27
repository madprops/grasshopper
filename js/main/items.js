// Select an item
App.select_item = function (mode, item) {
  if (item.closed) {
    return
  }

  for (let el of App.els(`.${mode}_item`)) {
    el.classList.remove("selected")
  }

  App[`selected_${mode}_item`] = item
  App[`selected_${mode}_item`].element.classList.add("selected")
  App[`selected_${mode}_item`].element.scrollIntoView({block: "nearest"})

  App.update_footer()

  if (mode === "tabs") {
    browser.tabs.warmup(item.id)
  }
}

// Select item above
App.select_item_above = function (mode) {
  let item = App.get_prev_visible_item(mode)

  if (item) {
    App.select_item(mode, item)
  }
}

// Select item below
App.select_item_below = function (mode) {
  let item = App.get_next_visible_item(mode)

  if (item) {
    App.select_item(mode, item)
  }
}

// Get next item that is visible
App.get_next_visible_item = function (mode) {
  let waypoint = false
  
  if (!App.selected_valid(mode)) {
    waypoint = true
  }
  
  let items = App[`${mode}_items`]
  let o_item = App[`selected_${mode}_item`]

  for (let i=0; i<items.length; i++) {
    let item = items[i]

    if (waypoint) {
      if (App.item_is_visible(item)) {
        return item
      }
    }

    if (item === o_item) {
      waypoint = true
    }
  }
}

// Get prev item that is visible
App.get_prev_visible_item = function (mode) {
  let waypoint = false

  if (!App.selected_valid(mode)) {
    waypoint = true
  }

  let items = App[`${mode}_items`]
  let o_item = App[`selected_${mode}_item`]

  for (let i=items.length-1; i>=0; i--) {
    let item = items[i]

    if (waypoint) {
      if (App.item_is_visible(item)) {
        return item
      }
    }

    if (item === o_item) {
      waypoint = true
    }
  }
}

// Check if an item is visible
App.item_is_visible = function (item) {
  let hidden = item.element.classList.contains("hidden")
  return !hidden
}

// Updates a footer
App.update_footer = function (mode) {
  if (App.selected_valid(mode)) {
    App.el("#footer").textContent = App.selected_tabs_item.footer
  } else {
    App.el("#footer").textContent = "No Results"
  }
}

// Check if selected is valid
App.selected_valid = function (mode) {
  return App[`selected_${mode}_item`] && 
  !App[`selected_${mode}_item`].closed && 
  App.item_is_visible(App[`selected_${mode}_item`])
}

// Select first item
App.select_first_item = function (mode) {
  for (let item of App[`${mode}_items`]) {
    if (App.item_is_visible(item)) {
      App.select_item(mode, item)
      return
    }
  }
}

// Remove an item from the list
App.remove_item = function (mode, item) {
  let next_item = App.get_next_visible_item(mode, item) || App.get_prev_visible_item(mode, item)
  item.element.remove()
  
  if (next_item) {
    App.select_item(mode, next_item)
  }

  item.closed = true
}