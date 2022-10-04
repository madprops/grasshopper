// For internal checks
App.tab_items = []
App.history_items = []
App.window_open = false
App.mouse_over_disabled = true
App.filter_delay = 222
App.refresh_tabs_delay = 500
App.disable_mouse_delay = 111
App.history_slice_results = 250
App.history_max_results = 1000 * 6
App.history_max_months = 24
App.ls_state = "state_v1"
App.first_mousedown = false

App.init = function () {
  App.get_state()
  App.setup_tabs()
  App.setup_windows()
  App.setup_items()
  App.setup_filter()
  App.setup_mouse()
  App.setup_keyboard()
  App.show_lists()
}

App.init()