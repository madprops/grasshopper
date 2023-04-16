App.item_modes = ["tabs", "stars", "bookmarks", "closed", "history"]
App.stor_settings_name = "settings_v20"
App.stor_stars_name = "stars_state_v20"
App.windows = {}
App.popups = {}
App.previous_tabs = []
App.max_closed = 25
App.history_max_results = 640
App.history_max_months = 18
App.num_background_images = 11
App.theme_color_diff = 0.77
App.icon_size = 25
App.star_counter = 1
App.max_stars = 1000 * 5
App.empty_previous_tabs_delay = 2000
App.max_text_length = 200
App.filter_delay = 200
App.alert_autohide_delay = 1500
NeedContext.min_width = "4.5rem"

App.init = async function () {
  let win = await browser.windows.getCurrent({populate: false})
  App.window_id = win.id

  App.stor_get_settings()
  App.stor_get_stars()

  App.setup_theme()
  App.setup_tabs()
  App.setup_stars()
  App.setup_bookmarks()
  App.setup_history()
  App.setup_closed()
  App.setup_settings()
  App.setup_about()
  App.setup_keyboard()
  App.setup_popups()
  App.setup_media()
  App.setup_window()
  App.setup_items()

  // Show first window
  App.show_first_item_window()
}

App.init()