const App = {}

App.stor_settings_name = `settings_v200`
App.stor_command_history_name = `command_history_v200`
App.stor_filter_history_name = `filter_history_v200`
App.stor_tag_history_name = `tag_history_v200`
App.stor_title_history_name = `title_history_v200`
App.stor_icon_history_name = `icon_history_v200`
App.stor_first_time_name = `first_time_v200`
App.stor_notes_name = `notes_v200`

// Backwards compatibility check
// This should only be used if the structure of the objects have not changed
// Like when moving from one storage method to another
// Empty array to disable compat check
App.stor_compat_check_name = `compat_check_v1`
App.stor_compat = []

App.SECOND = 1000
App.MINUTE = 60 * App.SECOND
App.HOUR = 60 * App.MINUTE
App.DAY = 24 * App.HOUR
App.MONTH = 30 * App.DAY
App.YEAR = 365 * App.DAY

App.RED = `rgba(255, 0, 0, 1)`
App.GREEN = `rgba(0, 255, 0, 1)`
App.BLUE = `rgba(0, 0, 255, 1)`

App.modes = [`tabs`, `history`, `bookmarks`, `closed`]
App.gestures = [`up`, `down`, `left`, `right`, `up_and_down`, `left_and_right`]
App.close_tabs_types = [`normal`, `pinned`, `playing`, `unloaded`, `loaded`, `duplicate`, `visible`, `empty`, `other`, `all`]
App.tab_box_modes = [`recent`, `pins`, `playing`, `colors`, `tags`, `icons`, `headers`]
App.no_favicons = [`history`, `bookmarks`]
App.fonts = [`serif`, `sans-serif`, `monospace`, `Nova Square`]
App.optional_modes = [`history`, `bookmarks`]
App.color_types = [`active`, `header`, `subheader`, `playing`, `unread`, `pinned`, `normal`, `unloaded`, `loaded`]
App.default_icons = [`😀`, `❤️`, `🤖`, `✅`, `🕒`]
App.default_setting_string = `__default__`
App.separator_string = `--separator--`
App.windows = {}
App.popups = {}
App.previous_tabs = []
App.max_closed = 25
App.icon_size = 50
App.max_text_length = 200
App.scroll_amount = 150
App.double_key_date = 0
App.scroller_max_top = 8
App.dragging = false
App.new_tab_url = `about:newtab`
App.header_file = "header/index.html"
App.search_modes = [`history`, `bookmarks`]
App.media_scroll = 33
App.media_types = [`image`, `video`, `audio`]
App.theme_safe_mode_msg = false
App.persistent_modes = [`tabs`]
App.close_text = `Close`
App.filter_search_date = 0
App.backgrounds_dir = `/img/backgrounds/`
App.number_min = 1
App.number_max = 99999
App.tag_history_max = 10
App.title_history_max = 10
App.icon_history_max = 10
App.active_history = []
App.click_press_done = false
App.max_tag_picks = 10
App.max_icon_picks = 10
App.popup_width = 800
App.popup_height = 600
App.browser_protocol = `moz-extension://`
App.tab_session_first = false
App.force_debug = false
App.copied_tabs = []
App.filter_menus = {}
App.refine_string = `refine_filter`
App.default_color = `rgba(100, 100, 100, 1)`
App.last_restore_date = 0
App.pinline_visible = false
App.similarity_threshold = 0.7
App.palette_threshold = 100
App.item_menu_threshold = 100
App.filter_placeholder = `Filter`
App.last_filter_placeholder = ``
App.red_title = `rgb(166, 84, 107, 1)`
App.green_title = `rgb(88, 132, 118, 1)`
App.blue_title = `rgb(93, 93, 188, 1)`
App.default_font_size = 17
App.last_main_title = undefined
App.max_browser_urls = 5
App.password_length = 20
App.mode_vars = {}
App.locust_swarm_on = false

App.settings_done = false
App.settings_ready = false
App.media_image_ready = false
App.media_video_ready = false
App.media_audio_ready = false
App.about_ready = false
App.popups_ready = false
App.palette_ready = false
App.sort_tabs_ready = false
App.close_tabs_ready = false
App.setup_history_ready = false
App.setup_bookmarks_ready = false
App.domain_rules_ready = false
App.playing = false
App.last_opacity_cycle_date = 0
App.filter_click_date = 0

App.alert_autohide_delay = 1500
App.tab_box_shrink_delay = 500
App.favorites_bar_show_delay = 100
App.tab_box_grow_delay = 100
App.favorites_bar_hide_delay = 500
App.settings_save_delay = 100
App.filter_delay_2 = 100
App.footer_delay = 100
App.scroller_delay = 100
App.pinline_delay = 100
App.wheel_delay = 100
App.show_mode_delay = 100
App.check_filter_delay = 100
App.apply_theme_delay = 100
App.last_scroll_delay = 100
App.check_selected_delay = 100
App.update_tab_box_delay = 100
App.check_tab_box_playing_delay = 100
App.update_active_trace_delay = 100
App.check_playing_delay = 100
App.context_auto_hide_delay = 1000
App.restore_delay = 600
App.footer_message_delay = 1000
App.check_clock_delay = App.SECOND * 10
App.check_main_title_date_delay = App.SECOND * 10
App.check_refresh_settings_delay = 100

App.settings_icons = {
  general: `⚡`,
  theme: `🎨`,
  colors: `🇿🇼`,
  zones: `🚥`,
  edits: `📝`,
  icons: `🖼️`,
  media: `📷`,
  icons: `😀`,
  show: `👁️`,
  tab_box: `📦`,
  favorites: `❤️`,
  taglist: `✝️`,
  gestures: `⏫`,
  auxclick: `🖱️`,
  warns: `🚨`,
  filter: `🔍`,
  triggers: `🔮`,
  more: `💠`,
  title: `✍🏻`,
  footer: `⚽`,
}

App.mode_icons = {
  tabs: `📚`,
  history: `⏳`,
  bookmarks: `⭐`,
  closed: `🔃`,
}

App.clipboard_icon = `📋`
App.bot_icon = `🤖`
App.icon_placeholder = `Icon`
App.notepad_icon = `📝`
App.browser_icon = `🌐`
App.command_icon = `🔆`
App.up_arrow_icon = `⬆️`
App.down_arrow_icon = `⬇️`
App.left_arrow_icon = `⬅️`
App.right_arrow_icon = `➡️`
App.close_icon = `❌`
App.tag_icon = `✝️`
App.close_tab_icon = `x`
App.smiley_icon = `😀`
App.zone_icon = `🚥`
App.extra_icon = `✳️`
App.pin_icon = `📌`
App.audio_icon = `🔊`
App.muted_icon = `🔇`
App.sleeping_icon = `💤`
App.circle_icon = `⭕`
App.globe_icon = `🌎`
App.data_icon = `💾`
App.time_icon = `⏰`
App.grasshopper_icon = `🦗`

App.sizes = [
  {text: `Tiny`, value: `tiny`},
  {text: `Small`, value: `small`},
  {text: `Normal`, value: `normal`},
  {text: `Big`, value: `big`},
  {text: `Huge`, value: `huge`},
]

App.dark_colors = {
  background: `rgb(45, 45, 55)`,
  text: `rgb(233, 233, 233)`,
}

App.light_colors = {
  background: `rgb(200, 200, 200)`,
  text: `rgb(50, 50, 55)`,
}

App.effects = [
  {text: `None`, value: `none`},
  {text: `Glow`, value: `glow`},
  {text: `Opacity`, value: `opacity`},
  {text: `Background`, value: `background`},
  {text: `Underline`, value: `underline`},
  {text: `Bold`, value: `bold`},
  {text: `Bigger`, value: `bigger`},
  {text: `Border`, value: `border`},
]

App.background_effects = [
  {text: `None`, value: `none`},
  {text: `Gray`, value: `grayscale`},
  {text: `Invert`, value: `invert`},
  {text: `Rotate 1`, value: `rotate_1`},
  {text: `Rotate 2`, value: `rotate_2`},
  {text: `Rotate 3`, value: `rotate_3`},
  {text: `Blur`, value: `blur`},
]

App.color_modes = [
  {text: `None`, value: `none`},
  {text: `Normal`, value: `normal`},
  {text: `Tab Box`, value: `tab_box`},
  {text: `Everywhere`, value: `everywhere`},
]

App.color_displays = [
  {text: `None`, value: `none`},
  {text: `Icon`, value: `icon`},
  {text: `Border`, value: `border`},
  {text: `Border & Icon`, value: `border_icon`},
  {text: `Text`, value: `text`},
  {text: `Text & Icon`, value: `text_icon`},
  {text: `Background`, value: `background`},
  {text: `BG & Icon`, value: `background_icon`},
]

App.warn_modes = [
  {text: `Never`, value: `never`},
  {text: `Multiple`, value: `multiple`},
  {text: `Special`, value: `special`},
  {text: `Always`, value: `always`},
]

App.media_modes = [
  {text: `Never`, value: `never`},
  {text: `On Icon Click`, value: `icon`},
  {text: `On Item Click`, value: `item`},
]

App.loading_effects = [
  {text: `None`, value: `none`},
  {text: `Icon`, value: `icon`},
  {text: `Icon Spin`, value: `icon_spin`},
  {text: `Icon Fade`, value: `icon_fade`},
  {text: `Item Fade`, value: `item_fade`},
]

App.favorites_title = `Favorites`

App.filter_whats = [
  `title`,
  `titles`,
  `url`,
  `urls`,
  `re`,
  `re_title`,
  `re_titles`,
  `re_url`,
  `re_urls`,
  `color`,
  `colors`,
  `tag`,
  `tags`,
]

App.themes = [
  {num: 1, opacity: 90},
  {num: 2, opacity: 88},
  {
    num: 3, opacity: 80,
    text_color: `rgb(207, 228, 204)`,
    background_color: `rgb(54, 49, 55)`,
    effect: `rotate_1`,
  },
  {
    num: 4, opacity: 70,
    text_color: `rgb(253, 244, 207)`,
    background_color: `rgb(49, 45, 49)`,
  },
  {num: 5, opacity: 75},
]

App.aligns = [
  {text: `Left`, value: `left`},
  {text: `Center`, value: `center`},
  {text: `Right`, value: `right`},
]