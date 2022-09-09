// For internal checks
App.items = []
App.window_open = false
App.mouse_over_disabled = true
App.filter_delay = 222
App.disable_mouse_delay = 200
App.history_slice_results = 200
App.history_max_results = 10000
App.history_max_months = 24
App.default_filter_mode = "title_url"
App.ls_state = "state_v1"

App.init = function () {
  App.get_state()
  App.setup_windows()
  App.setup_items()
  App.setup_filter()
  App.setup_list()
  App.setup_keyboard()
  App.get_history()
}

App.init()