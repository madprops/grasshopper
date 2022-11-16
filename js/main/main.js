App.stor_settings_name = "settings_v1"
App.stor_stars_name = "stars_v6"
App.windows = {}
App.filter_delay = 250
App.color_delay = 150
App.max_stars = 1000 * 2
App.max_closed = 25


App.init = async function () {
  let win = await browser.windows.getCurrent({populate: false})
  App.window_id = win.id

  await App.stor_get_settings()
  await App.setup_theme()

  App.setup_tabs()
  App.setup_stars()
  App.setup_closed()
  App.setup_history()
  App.setup_settings()
  App.setup_mouse()
  App.setup_keyboard()
  App.setup_items()

  // Show first window
  App.show_first_item_window()
}

App.init()