// For internal checks
App.tabs = []
App.filter_delay = 111
App.window_mode = "none"
App.windows = {}
App.history_max_months = 12
App.history_max_items = 1000 * 3

App.init = function () {
  App.setup_tabs()
  App.setup_closed_tabs()
  App.setup_history()
  App.setup_about()
  App.setup_mouse()
  App.setup_keyboard()
  App.show_tabs()
}

App.init()