// For internal checks
App.mouse_over_disabled = true
App.modal_open = false
App.help_ready = false
App.about_ready = false
App.slice_size = 250
App.ls_config = "config_v2"
App.default_filter_mode = "title_url"

App.init = async function () {
  await App.get_config()
  App.setup_windows()
  App.setup_items()
  App.setup_filter()
  App.setup_list()
  App.setup_keyboard()
  App.setup_configure()
  App.setup_about()
  
  await App.get_history_slice()
  App.do_filter()
}

App.init()