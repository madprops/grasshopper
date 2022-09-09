// For internal checks
App.mouse_over_disabled = true
App.window_open = false
App.about_ready = false
App.history_slice_results = 200
App.history_max_results = 10000
App.default_filter_mode = "title_url"
App.history_max_months = 24
App.filter_delay = 222
App.items = []
App.text_mode = "title"

App.init = function () {
  App.setup_windows()
  App.setup_items()
  App.setup_filter()
  App.setup_list()
  App.setup_keyboard()
  App.get_history()
}

App.init()