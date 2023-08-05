const App = {}

NeedContext.min_width = `4.5rem`

App.stor_settings_name = `settings_v100`
App.stor_profiles_name = `profiles_v1`
App.stor_command_history_name = `command_history_v1`

App.modes = [`tabs`, `bookmarks`, `closed`, `history`]
App.gestures = [`up`, `down`, `left`, `right`, `up_and_down`, `left_and_right`]
App.default_setting_string = `__default__`
App.separator_string = `--separator--`
App.windows = {}
App.popups = {}
App.previous_tabs = []
App.max_closed = 25
App.icon_size = 25
App.max_profiles = 1000 * 5
App.max_text_length = 200
App.settings_save_delay = 250
App.activated_delay = 2600
App.opened_delay = 2600
App.refocus_delay = 2000
App.double_tap_delay = 300
App.empty_previous_tabs_delay = 2000
App.alert_autohide_delay = 1500
App.filter_delay = 180
App.filter_delay_2 = 100
App.footer_delay = 100
App.scroller_delay = 100
App.pinline_delay = 100
App.wheel_delay = 100
App.normal_scroll_pixels = 150
App.fast_scroll_percent = 16.66
App.double_tap_date = 0
App.scroller_max_top = 10
App.dragging = false
App.favicon_size = 64
App.no_favicons = [`history`, `bookmarks`]
App.new_tab_urls = [`about:newtab`, `about:blank`]
App.item_range_on = false
App.item_range_select = false
App.maxed_items = [`history`, `bookmarks`]
App.max_items = 500
App.deep_max_items = 5000
App.history_max_months = 18
App.deep_history_max_months = 54
App.media_scroll = 33
App.media_types = [`image`, `video`, `audio`]
App.mousedown_max = 500
App.max_warn_limit = 20
App.max_tag_filters = 50

App.colors = {
  red: `rgb(255, 77, 77)`,
  green: `rgb(77, 255, 77)`,
  blue: `rgb(77, 77, 255)`,
  yellow: `rgb(255, 255, 77)`,
}

App.color_emojis = {
  none: `⚫`,
  red: `🔴`,
  green: `🟢`,
  blue: `🔵`,
  yellow: `🟡`,
}

App.settings_emojis = {
  general: `⚙️`,
  theme: `🎨`,
  icons: `🖼️`,
  media: `📷`,
  show: `👁️`,
  mouse: `🖱️`,
  warns: `🚨`,
  more: `💠`,
}

App.mode_emojis = {
  tabs: `📚`,
  history: `⏳`,
  bookmarks: `⭐`,
  closed: `🔃`,
}

App.clipboard_icon = `📋`
App.bot_emoji = `🤖`

App.dark_theme_colors = {
  background: `rgb(30, 30, 33)`,
  text: `rgb(250, 250, 250)`,
}

App.light_theme_colors = {
  background: `rgb(200, 200, 200)`,
  text: `rgb(50, 50, 55)`,
}