App.stor_settings_name = "settings_v20"
App.stor_tab_state_name = "tab_state_v20"
App.stor_stars_name = "stars_state_v20"

App.item_modes = ["tabs", "stars", "bookmarks", "closed", "history"]

App.windows = {}
App.popups = {}

App.max_closed = 25
App.history_max_results = 640
App.history_max_months = 18
App.num_background_images = 11
App.theme_color_diff = 0.77
App.icon_size = 25
App.media_scroll_amount = 33
App.star_counter = 1
App.max_stars = 1000 * 5
App.previous_tab_date = 0
App.previous_tab_date_max = 3000
App.max_text_length = 200

App.filter_delay = 200
App.alert_autohide_delay = 1500
App.lock_backup_delay = 2000
App.load_tabs_delay = 1000

NeedContext.min_width = "4.5rem"

App.init = async function () {
  let win = await browser.windows.getCurrent({populate: false})
  App.window_id = win.id

  App.stor_get_settings()
  App.stor_get_tab_state()
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
  App.setup_items()

  // Show first window
  App.show_first_item_window()
}

App.init()