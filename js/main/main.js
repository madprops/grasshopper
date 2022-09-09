// For internal checks
App.mouse_over_disabled = true
App.modal_open = false
App.about_ready = false
App.configure_ready = false
App.slice_size = 200
App.ls_config = "config_v2"
App.default_filter_mode = "title_url"
App.history_max_months = 24
App.filter_delay = 222

App.init = function () {
  App.get_config()
  App.setup_windows()
  App.setup_items()
  App.setup_filter()
  App.setup_list()
  App.setup_keyboard()
  App.setup_configure()
  App.setup_about()
  App.get_history()
}

App.init()