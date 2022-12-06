App.stor_settings_name = "settings_v1"
App.stor_stars_name = "stars_v6"
App.stor_tab_state_name = "tab_state_v1"
App.stor_filters_name = "filters_v2"
App.windows = {}
App.popups = {}
App.filter_delay = 250
App.color_delay = 150
App.max_stars = 1000 * 2
App.max_closed = 25
App.history_max_results = 640
App.history_max_months = 18
App.star_counter = 0
App.tabs_mode = "normal"
App.stars_mode = "normal"
App.history_mode = "normal"
App.max_filters = 8
App.num_background_images = 8

NeedContext.min_width = "4.5rem"

App.init = async function () {
  let win = await browser.windows.getCurrent({populate: false})
  App.window_id = win.id

  await App.stor_get_settings()
  await App.stor_get_filters()
  await App.stor_get_tab_state()
  
  App.setup_theme()
  App.setup_tabs()
  App.setup_stars()
  App.setup_history()
  App.setup_closed()
  App.setup_settings()
  App.setup_about()
  App.setup_keyboard()
  App.setup_popups()
  App.setup_image()
  App.setup_video()
  App.setup_items()

  // Show first window
  App.show_first_item_window()
}

App.init()