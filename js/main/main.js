App.stor_settings_name = "settings_v1"
App.stor_stars_name = "stars_v6"
App.windows = {}
App.popups = {}
App.filter_delay = 250
App.color_delay = 150
App.max_stars = 1000 * 2
App.max_closed = 25
App.history_max_results = 600
App.history_max_months = 12


App.init = async function () {
  let win = await browser.windows.getCurrent({populate: false})
  App.window_id = win.id

  await App.stor_get_settings()
  await App.setup_theme()

  App.setup_tabs()
  App.setup_stars()
  App.setup_history()
  App.setup_closed()
  App.setup_settings()
  App.setup_about()
  App.setup_keyboard()
  App.setup_popups()
  App.setup_items()

  // Show first window
  App.show_first_item_window()
}

App.init()