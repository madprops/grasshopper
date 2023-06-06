const App = {}

App.item_modes = [`tabs`, `stars`, `bookmarks`, `closed`, `history`]
App.stor_settings_name = `settings_v30`
App.stor_stars_name = `stars_state_v20`
App.stor_titles_name = `titles_v3`
App.stor_command_history_name = `command_history_v1`
App.windows = {}
App.popups = {}
App.max_closed = 25
App.history_max_results = 640
App.history_max_months = 18
App.icon_size = 25
App.star_counter = 1
App.max_stars = 1000 * 5
App.max_titles = 1000 * 5
App.previous_tabs = []
App.empty_previous_tabs_delay = 2500
App.max_text_length = 200
App.filter_delay = 200
App.alert_autohide_delay = 1500
App.normal_scroll_pixels = 150
App.fast_scroll_percent = 16.66
App.wheel_delay = 100
App.max_star_visits = 1000000 * 100
App.settings_save_delay = 250
App.export_string = `Copy this to import later`
App.import_string = `Paste data text here`
App.pinline_debouncer_delay = 100
App.double_tap_date = 0
App.double_tap_delay = 300
App.footer_debouncer_delay = 100
App.scroller_max_top = 3
App.dragging = false
App.scroll_behavior = `instant`

NeedContext.min_width = `4.5rem`