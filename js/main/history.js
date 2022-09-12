// Get items from history
App.get_history = async function (mode = "slice") {
  App.log(`Getting history: ${mode}`)
  
  let max

  if (mode === "slice") {
    max = App.history_slice_results
    App.full_history = false
  } else if (mode === "full") {
    max = App.history_max_results
    App.full_history = true
  }

  let items = await browser.history.search({
    text: "",
    maxResults: max,
    startTime: App.history_months()
  })

  return items
}

// Process history
App.process_history = function (history) {
  App.history_items = []
  App.process_items(history, "history", App.history_items)
}

// Get history months date
App.history_months = function () {
  return Date.now() - (1000 * 60 * 60 * 24 * 30 * App.history_max_months)
}

// Prepend to history
App.prepend_history = function (info) {
  let item = App.process_item({
    item: info,
    list: "history"
  })

  App.history_items.unshift(item)
  App.el("#history").prepend(item.element)
  App.create_item_element(item)
  App.do_filter({select_new: false, disable_mouse_over: false})  
}

// Get history item by url
// Get an item by id dataset
App.get_history_item_by_url = function (url) {
  for (let item of App.history_items) {
    if (item.url === url) {
      return item
    }
  }
}