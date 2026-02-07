// ########################################################
// Please don't ruin the code with terrible formatting
// There's an eslint config that should clean up things
// It should be ran periodically to find and fix flaws
// But apart from that, all the code is structured manually
// ########################################################

const App = {}

App.stor_settings_name = `settings_v200`
App.stor_command_history_name = `command_history_v200`
App.stor_filter_history_name = `filter_history_v200`
App.stor_palette_history_name = `palette_history_v200`
App.stor_tag_history_name = `tag_history_v200`
App.stor_title_history_name = `title_history_v200`
App.stor_icon_history_name = `icon_history_v200`
App.stor_first_time_name = `first_time_v200`
App.stor_notes_name = `notes_v200`
App.stor_bookmark_folder_picks = `bookmark_folder_picks_v202`
App.stor_history_picks = `history_picks_v202`
App.stor_datastore = `datastore_v204`
App.stor_memory = `memory_v204`

// Backwards compatibility check
// This should only be used if the structure of the objects have not changed
// Like when moving from one storage methood to another
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

App.close_tabs_types = [
  `normal`, `pinned`, `playing`, `unloaded`, `loaded`, `duplicate`,
  `visible`, `empty`, `other`, `domain`, `domain_other`,
  `clusters`, `clusters_trim`, `all`,
]

App.no_favicons = [`history`, `bookmarks`]
App.fonts = [`serif`, `sans-serif`, `monospace`, `Nova Square`, `Bitcount`, `Antic Slab`]
App.optional_modes = [`history`, `bookmarks`]

App.color_types = [`active`, `header`, `subheader`, `playing`, `loaded`,
  `unloaded`, `unread`, `pinned`, `normal`, `unloaded`, `loaded`]

App.letters = `abcdefghijklmnopqrstuvwxyz`
App.default_icons = [`😀`, `❤️`, `🤖`, `✅`, `🕒`]
App.default_setting_string = `__default__`
App.separator_string = `--separator--`
App.windows = {}
App.popups = {}
App.previous_tabs = []
App.max_closed = 25
App.icon_size = 50
App.max_text_length = 200
App.double_key_date = 0
App.scroller_max_top = 8
App.dragging = false
App.new_tab_url = `about:newtab`
App.header_file = `header/index.html`
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
App.filter_placeholder = `Filter`
App.last_filter_placeholder = ``
App.red_title = `rgba(166, 84, 107, 1)`
App.green_title = `rgba(88, 132, 118, 1)`
App.blue_title = `rgba(93, 93, 188, 1)`
App.dark_title = `rgba(54, 54, 54, 1)`
App.light_title = `rgba(240, 240, 240, 1)`
App.max_browser_urls = 5
App.password_length = 20
App.mode_vars = {}
App.locust_swarm_on = false
App.last_opacity_cycle_date = 0
App.last_zoom_cycle_date = 0
App.settings_list_id = 1
App.playing = false
App.settings_done = false
App.last_main_title = ``
App.main_title_scroll_direction = `right`
App.main_title_min_overflow = 24
App.main_title_scroll_pause = false
App.max_tab_num = 10
App.breathe_effect_on = false
App.tab_blink_diff = 2
App.num_browser_commands = 10
App.prompt_mode = false
App.max_padding_setting = 100
App.signal_intervals = []
App.bookmark_items_cache = []
App.bookmark_folders_cache = []
App.bookmarks_received = false
App.tab_tree = {}
App.last_settings = {}
App.tab_box_items = []
App.tab_box_o_items = []
App.num_generic_menus = 10
App.max_command_check_items = 50
App.max_bookmark_folder_picks = 50
App.max_history_picks = 50
App.bookmarks_folder_url = `https://bookmarks.folder`
App.shrink_on_tab_box_leave
App.font_sizes = [6, 28, 1]
App.default_font_size = 17
App.default_font = `Nova Square`
App.last_selected_date = {}
App.semi_white_color = `rgba(250, 250, 250, 1)`
App.semi_black_color = `rgba(5, 5, 5, 1)`
App.mouse_inside = true
App.border_widths = [0, 10, 1]
App.flashlight_on = false
App.command_combo_num = 10
App.container_data = {}
App.bkmarks = `Bkmarks`
App.override_icons = []
App.tabs_to_first = []
App.icon_pick_date = 0
App.close_tabs_date = 0
App.close_tabs_min = 500
App.scroll_done = false
App.main_title_history = []
App.main_title_history_max = 100
App.mirror_mode = `none`
App.progressive_fill_delay = App.SECOND * 10
App.progressive_fill_throttle = 100
App.progressive_fill_batch = 10
App.datastore_max = 250
App.datastore_max_text = 20 * 1000
App.calculator_text = ``
App.background_autocolor_prev = -1
App.oracle_words = 2
App.memory = {}

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

App.domain_rules_addlist_ready = false
App.bookmark_rules_addlist_ready = false
App.signals_addlist_ready = false
App.templates_addlist_ready = false
App.command_combos_addlist_ready = false
App.colors_addlist_ready = false
App.keyboard_addlist_ready = false
App.custom_commands_addlist_ready = false

App.alert_autohide_delay = 1500
App.favorites_bar_show_delay = 100
App.tab_box_grow_delay = 100
App.tab_box_ungrow_delay = 500
App.tab_box_shrink_delay = 100
App.tab_box_follow_delay = 100
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
App.update_tab_count_delay = 100
App.check_playing_delay = 100
App.context_auto_hide_delay = App.SECOND
App.restore_delay = 600
App.footer_message_delay = App.SECOND * 2
App.check_clock_delay = 500
App.check_main_title_date_delay = 500
App.check_refresh_settings_delay = 100
App.popup_commands_delay = 250
App.prompt_close_delay = 250
App.signal_min_delay = 3
App.last_settings_scroll_delay = 350
App.default_combo_delay = 100
App.mouse_over_delay = 150
App.mouse_out_delay = 150
App.ensure_scroll_delay = 800
App.icon_pick_delay = 100
App.autoclick_delay = 450
App.idle_tabs_delay = App.MINUTE

App.settings_icons = {
  all: `🔍`,
  general: `⚡`,
  theme: `🎨`,
  colors: `🇲🇲`,
  zones: `🚥`,
  edits: `📝`,
  media: `📷`,
  icons: `😀`,
  show: `👁️`,
  menus: `📑`,
  tab_box: `📦`,
  favorites: `❤️`,
  tags: `✝️`,
  gestures: `⏫`,
  warns: `🚨`,
  filter: `🔍`,
  triggers: `🔮`,
  signals: `📡`,
  more: `💠`,
  title: `✍🏻`,
  footer: `⚽`,
  lock: `🔒`,
  browser: `🌐`,
  hover: `🔆`,
  bookmarks: `⭐`,
  close: `❌`,
  pinline: `📍`,
  compact: `💎`,
  autoclick: `🖱️`,
}

App.clipboard_icon = `📋`
App.bot_icon = `🤖`
App.icon_placeholder = `Icon`
App.notepad_icon = `📝`
App.tag_icon = `🏷️`
App.command_icon = `🔆`
App.up_arrow_icon = `⬆️`
App.down_arrow_icon = `⬇️`
App.left_arrow_icon = `⬅️`
App.right_arrow_icon = `➡️`
App.close_icon = `❌`
App.smiley_icon = `😀`
App.zone_icon = `🚥`
App.extra_icon = `✳️`
App.globe_icon = `🌎`
App.data_icon = `💾`
App.action_icon = `🚀`
App.time_icon = `⏰`
App.grasshopper_icon = `🦗`
App.lock_icon = `🔒`
App.key_icon = `🔑`
App.rewind_icon = `⏪`
App.new_icon = `🆕`
App.duplicate_icon = `👭🏻`
App.keyboard_icon = `⌨️`
App.mouse_icon = `🖱️`
App.tree_icon = `🌳`
App.combo_icon = `🍔`
App.template_icon = `🛕`
App.plus_icon = `📈`
App.minus_icon = `📉`
App.flashlight_icon = `🔦`
App.green_icon = `🟢`
App.shroom_icon = `🍄`
App.window_icon = `🪟`
App.hat_icon = `📤`
App.letters_icon = `🔠`
App.blur_icon = `🥶`
App.prev_icon = `👈`
App.next_icon = `👉`
App.open_icon = `🌻`
App.action_icon = `🚀`
App.select_icon = `🎯`
App.mirror_icon = `🪞`
App.data_icon = `💾`
App.info_icon = `ℹ️`
App.cluster_icon = `✨`
App.https_icon = `🔒`
App.http_icon = `🔗`
App.file_icon = `📃`
App.injection_icon = `💉`
App.container_icon = `🛍️`
App.calculator_icon = `🔢`
App.oracle_icon = `🔮`
App.gematria_icon = `🧮`
App.photo_icon = `🖼️`
App.chemistry_icon = `⚛️`
App.toggle_icon = `🔛`
App.filter_icon = `🔍`
App.color_picker_icon = `🎨`
App.cael_icon = `🧿`

App.filter_bottom_icon = `v`
App.filter_bottom_title = `Go to the bottom`
App.filter_clear_icon = `x`
App.filter_clear_title = `Clear the filter`

App.sizes = [
  {text: `None`, value: `none`},
  {text: App.separator_string},
  {text: `Tiny`, value: `tiny`},
  {text: `Small`, value: `small`},
  {text: `Normal`, value: `normal`},
  {text: `Big`, value: `big`},
  {text: `Huge`, value: `huge`},
]

App.sizes_2 = [
  {text: `Compact`, value: `compact`},
  {text: `Tiny`, value: `tiny`},
  {text: `Small`, value: `small`},
  {text: `Normal`, value: `normal`},
  {text: `Big`, value: `big`},
  {text: `Huge`, value: `huge`},
]

App.sizes_3 = [
  {text: `Tiny`, value: `tiny`},
  {text: `Small`, value: `small`},
  {text: `Normal`, value: `normal`},
  {text: `Big`, value: `big`},
  {text: `Huge`, value: `huge`},
]

App.item_borders = [
  {text: `None`, value: `none`},
  {text: App.separator_string},
  {text: `Normal`, value: `normal`},
  {text: `Big`, value: `big`},
  {text: `Huge`, value: `huge`},
]

App.dark_colors = {
  background: `rgb(55, 55, 55)`,
  text: `rgb(250, 250, 250)`,
}

App.light_colors = {
  background: `rgb(205, 205, 205)`,
  text: `rgb(30, 30, 30)`,
}

App.effects = [
  {text: `None`, value: `none`},
  {text: App.separator_string},
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
  {text: App.separator_string},
  {text: `Blur`, value: `blur`},
  {text: `Gray`, value: `grayscale`},
  {text: `Gray Blur`, value: `grayscale_blur`},
  {text: `Invert`, value: `invert`},
  {text: `Invert Blur`, value: `invert_blur`},
  {text: `Rotate 1`, value: `rotate_1`},
  {text: `Rotate 1 Blur`, value: `rotate_1_blur`},
  {text: `Rotate 2`, value: `rotate_2`},
  {text: `Rotate 2 Blur`, value: `rotate_2_blur`},
  {text: `Rotate 3`, value: `rotate_3`},
  {text: `Rotate 3 Blur`, value: `rotate_3_blur`},
]

App.color_modes = [
  {text: `None`, value: `none`},
  {text: App.separator_string},
  {text: `Normal`, value: `normal`},
  {text: `Tab Box`, value: `tab_box`},
  {text: `Everywhere`, value: `everywhere`},
]

App.color_displays = [
  {text: `None`, value: `none`},
  {text: App.separator_string},
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
  {text: App.separator_string},
  {text: `Multiple`, value: `multiple`},
  {text: `Special`, value: `special`},
  {text: `Always`, value: `always`},
]

App.media_modes = [
  {text: `Never`, value: `never`},
  {text: App.separator_string},
  {text: `On Icon Click`, value: `icon`},
  {text: `On Item Click`, value: `item`},
]

App.loading_effects = [
  {text: `None`, value: `none`},
  {text: App.separator_string},
  {text: `Icon`, value: `icon`},
  {text: `Icon Spin`, value: `icon_spin`},
  {text: `Icon Fade`, value: `icon_fade`},
  {text: `Item Fade`, value: `item_fade`},
]

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
  `zone`,
  `zones`,
  `container`,
  `containers`,
  `char`,
  `chars`,
  `sim`,
  `sims`,
]

App.themes = [
  {
    num: 1, opacity: 90,
  },
  {
    num: 2, opacity: 85,
  },
  {
    num: 3, opacity: 80,
    effect: `rotate_1`,
  },
  {
    num: 4, opacity: 70,
  },
  {
    num: 5, opacity: 85,
    effect: `rotate_3`,
  },
  {
    num: 6, opacity: 70,
    effect: `rotate_3`,
  },
]

App.aligns = [
  {text: `Left`, value: `left`},
  {text: `Center`, value: `center`},
  {text: `Right`, value: `right`},
]

App.aligns_2 = [
  {text: `Top`, value: `top`},
  {text: `Center`, value: `center`},
  {text: `Bottom`, value: `bottom`},
]

App.sides = [
  {text: `Icon`, value: `icon`, info: `Replace the normal item icon with this one`},
  {text: `Left`, value: `left`},
  {text: `Right`, value: `right`},
]

App.sides_2 = [
  {text: `Left`, value: `left`},
  {text: `Right`, value: `right`},
]

App.show_icon = [
  {text: `Never`, value: `never`, info: `Never show the icon`},
  {text: App.separator_string},
  {text: `Always`, value: `always`, info: `Always show the icon`},
  {text: `On Hover`, value: `hover`, info: `Show when hovering an item`},
  {text: `On Select`, value: `select`, info: `Show when an item is selected`},
  {text: `On Focus`, value: `focus`, info: `Show on hover or select`},
  {text: `On Global`, value: `global`, info: `Show when hovering the window`},
]

App.header_actions = [
  {text: `Normal`, value: `normal`},
  {text: `Select Group`, value: `select_group`},
  {text: `Close Group`, value: `close_group`},
]

App.scroll_modes = [
  {text: `Top`, value: `top`},
  {text: `Bottom`, value: `bottom`},
]

App.opacity_values = {
  full: 1.0,
  high: 0.85,
  medium: 0.7,
  low: 0.55,
}

App.justify_map = {
  left: `flex-start`,
  center: `center`,
  right: `flex-end`,
}

App.media_icons = [
  `image`,
  `video`,
  `audio`,
]

App.item_icons = [
  `active`,
  `pin`,
  `normal`,
  `playing`,
  `muted`,
  `unloaded`,
  `loading`,
  `loaded`,
  `unread`,
  `image`,
  `video`,
  `audio`,
  `title`,
  `tags`,
  `notes`,
  `root`,
  `edited`,
  `obfuscated`,
  `idle`,
  `parent`,
  `node`,
  `color`,
  `custom`,
  `container`,
]

App.icon_weight = [
  {text: `1: One`, value: 1},
  {text: `2: Two`, value: 2},
  {text: `3: Three`, value: 3},
  {text: `4: Four`, value: 4},
  {text: `5: Five`, value: 5},
]

App.title_buttons = [
  {text: `Never`, value: `never`, info: `Never show the button`},
  {text: App.separator_string},
  {text: `Always`, value: `always`, info: `Always show the button`},
  {text: `On Hover`, value: `hover`, info: `Show when hovering the button`},
  {text: `On Global`, value: `global`, info: `Show when hovering the window`},
]

App.taglist_show_modes = [
  {text: `Always`, value: `always`, info: `Always show the taglist`},
  {text: `On Hover`, value: `hover`, info: `Show when hovering an item`},
  {text: `On Select`, value: `select`, info: `Show when an item is selected`},
  {text: `On Focus`, value: `focus`, info: `Show on hover or select`},
  {text: `On Global`, value: `global`, info: `Show when hovering the window`},
]

App.panel_sizes = {
  normal: 0.28,
  steps: 0.1,
}

App.footer_tab_box_click_cmd = `toggle_tab_box`

App.footer_up_click_cmd = `move_tabs_to_top`
App.footer_up_middle_click_cmd = `select_items_above`
App.footer_up_shift_click_cmd = `page_up`
App.footer_up_ctrl_click_cmd = `jump_tabs_all_up`
App.footer_up_ctrl_shift_click_cmd = `move_to_zone_up`

App.footer_down_click_cmd = `move_tabs_to_bottom`
App.footer_down_middle_click_cmd = `select_items_below`
App.footer_down_shift_click_cmd = `page_down`
App.footer_down_ctrl_click_cmd = `jump_tabs_all_down`
App.footer_down_ctrl_shift_click_cmd = `move_to_zone_down`

App.date_format_info = `To use text surround it between [ and ], like -> [Time]: HH:MM:ss`