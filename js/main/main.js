// For internal checks
App.tab_items = []
App.mouse_over_disabled = true
App.filter_delay = 111
App.refresh_tabs_delay = 500
App.disable_mouse_delay = 111
App.ls_state = "state_v1"
App.window_mode = "none"
App.windows = {}
App.sorted = false

App.init = function () {
  App.get_state()
  App.setup_windows()
  App.setup_tabs()
  App.setup_items()
  App.setup_filter()
  App.setup_mouse()
  App.setup_keyboard()
  App.show_tabs()
}

App.init()