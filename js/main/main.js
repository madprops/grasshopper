App.stor_settings_name = "settings_v20"
App.stor_tab_state_name = "tab_state_v20"
App.stor_filters_name = "filters_v20"

App.item_modes = ["tabs", "bookmarks", "closed", "history"]

App.windows = {}
App.popups = {}

App.max_closed = 25
App.history_max_results = 640
App.history_max_months = 18
App.max_filters = 8
App.num_background_images = 10
App.theme_color_diff = 0.77
App.icon_size = 25
App.media_scroll_amount = 33

App.filter_delay = 250
App.color_delay = 150
App.alert_autohide_delay = 1500
App.save_filter_delay = 2000
App.update_footer_delay = 200
App.select_block_delay = 100
App.max_text_length = 200
App.lock_backup_delay = 2000
App.load_tabs_delay = 1000
App.check_playing_delay = 1000
App.create_item_element_delay = 1000

NeedContext.min_width = "4.5rem"

App.init = async function () {  
  App.stor_get_settings()
  App.stor_get_tab_state()
  App.stor_get_filters()

  App.setup_theme()
  App.setup_tabs()
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