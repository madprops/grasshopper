// For internal checks
App.mouse_over_disabled = true
App.modal_open = false
App.about_ready = false
App.slice_size = 250
App.ls_config = "config_v2"
App.default_filter_mode = "title_url"

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