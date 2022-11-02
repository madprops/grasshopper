App.stor_settings = "settings_v1"
App.stor_stars = "stars_v1"
App.windows = {}
App.filter_delay = 123
App.color_delay = 123
App.history_max_months = 12
App.max_stars = 1000 * 5
App.item_windows = ["tabs", "stars", "closed", "history"]

App.init = async function () {
  await App.stor_get_settings()
  await App.stor_get_stars()
  App.setup_theme()
  App.setup_tabs()
  App.setup_stars()
  App.setup_closed()
  App.setup_history()
  App.setup_about()
  App.setup_mouse()
  App.setup_keyboard()
  App.setup_items()

  // Show first window
  App.show_first_item_window()
}

App.init()