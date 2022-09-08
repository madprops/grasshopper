// Get items from history (slice)
App.get_history_slice = async function () {
  App.log("Getting history slice")
  App.full_history = false

  let items = await browser.history.search({
    text: "",
    maxResults: App.slice_size,
    startTime: App.history_months()
  })

  App.process_items(items) 
  App.do_filter()  
}

// Get items from history
App.get_full_history = async function () {
  App.log("Getting full history")
  App.full_history = true

  let items = await browser.history.search({
    text: "",
    maxResults: App.config.history_max_results,
    startTime: App.history_months()
  })

  App.process_items(items)
  App.do_filter()
}

// Get history months date
App.history_months = function () {
  return Date.now() - (1000 * 60 * 60 * 24 * 30 * App.config.history_max_months)
}