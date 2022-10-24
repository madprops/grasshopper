// For internal checks
App.tabs = []
App.mouse_over_disabled = true
App.filter_delay = 111
App.refresh_tabs_delay = 500
App.disable_mouse_delay = 111
App.ls_state = "state_v1"
App.window_mode = "none"
App.windows = {}
App.sorted = false
App.history_max_months = 12
App.history_max_items = 10

App.init = function () {
  App.get_state()
  App.setup_tabs()
  App.setup_closed_tabs()
  App.setup_history()
  App.setup_about()
  App.setup_filter_tabs()
  App.setup_mouse()
  App.setup_keyboard()
  App.show_tabs()
}

App.init()