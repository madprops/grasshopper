App.stor_settings_name = "settings_v1"
App.stor_stars_name = "stars_v6"
App.stor_tab_state_name = "tab_state_v1"
App.stor_sort_state_name = "sort_state_v3"
App.stor_filters_name = "filters_v2"

App.item_modes = ["tabs", "stars", "closed", "history"]

App.windows = {}
App.popups = {}

App.max_stars = 1000 * 3
App.max_closed = 25
App.history_max_results = 640
App.history_max_months = 18
App.star_counter = 0
App.max_filters = 8
App.num_background_images = 9
App.theme_color_diff = 0.77
App.icon_size = 25

App.filter_delay = 250
App.color_delay = 150
App.alert_autohide_delay = 1500
App.save_filter_delay = 2000
App.update_footer_delay = 200
App.select_block_delay = 100
App.max_text_length = 200
App.lock_backup_delay = 2000
App.load_tabs_delay = 1000

NeedContext.min_width = "4.5rem"

App.init = async function () {
  let win = await browser.windows.getCurrent({populate: false})
  App.window_id = win.id

  await App.stor_get_settings()
  await App.stor_get_tab_state()
  await App.stor_get_sort_state()
  await App.stor_get_filters()
  
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