// For internal checks
App.tabs = []
App.filter_delay = 111
App.window_mode = "tabs"
App.windows = {}
App.history_max_months = 12
App.ls_state = "state_v2"

App.init = function () {
  App.get_state()
  App.setup_tabs()
  App.setup_closed_tabs()
  App.setup_history()
  App.setup_about()
  App.setup_mouse()
  App.setup_keyboard()
  App.setup_items()
  App.show_tabs()
}

App.init()