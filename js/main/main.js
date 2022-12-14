App.stor_settings_name = "settings_v1"
App.stor_stars_name = "stars_v6"
App.stor_tab_state_name = "tab_state_v1"
App.stor_sort_state_name = "sort_state_v3"
App.windows = {}
App.popups = {}
App.filter_delay = 250
App.color_delay = 150
App.max_stars = 1000 * 5
App.max_closed = 25
App.history_max_results = 640
App.history_max_months = 18
App.star_counter = 0
App.max_filters = 8
App.num_background_images = 9
App.theme_color_diff = 0.77

NeedContext.min_width = "4.5rem"

App.init = async function () {
  let win = await browser.windows.getCurrent({populate: false})
  App.window_id = win.id

  await App.stor_get_settings()
  await App.stor_get_tab_state()
  await App.stor_get_sort_state()
  
  App.setup_theme()
  App.setup_tabs()
  App.setup_stars()
  App.setup_history()
  App.setup_closed()
  App.setup_settings()
  App.setup_about()
  App.setup_keyboard()
  App.setup_popups()
  App.setup_media()
  App.setup_items()

  // Show first window
  App.show_first_item_window()
}

App.init()