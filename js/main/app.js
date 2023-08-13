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
App.restore_delay = 1000 * 10
App.double_tap_delay = 300
App.empty_previous_tabs_delay = 2000
App.alert_autohide_delay = 1500
App.filter_delay = 200
App.filter_delay_2 = 100
App.footer_delay = 100
App.scroller_delay = 100
App.pinline_delay = 100
App.wheel_delay = 100
App.scroll_amount = 150
App.double_tap_date = 0
App.scroller_max_top = 10
App.dragging = false
App.favicon_size = 64
App.no_favicons = [`history`, `bookmarks`]
App.new_tab_urls = [`about:newtab`, `about:blank`]
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
App.item_range_on = false
App.item_range_select = false
App.max_pick_delay = 2000
App.auto_theme_delay = 1000 * 60 * 30
App.seeded_theme_max = 88
App.color_contrast = 0.8
App.default_profile_background_color = `rgb(45, 45, 55)`
App.default_profile_text_color = `rgb(233, 233, 233)`
App.hostname_colors = {}
App.colors = [`red`, `green`, `blue`, `yellow`, `purple`, `orange`]
App.check_item_theme_delay = 33
App.theme_safe_mode_msg = false
App.last_filter_input = 0
App.recent_filter_input = 1250
App.persistent_modes = [`tabs`]
App.close_text = `Close`
App.similarity_threshold = 0.7
App.max_smooth_scroll = 1000 * 2

App.color_icons = {
  red: `🔴`,
  green: `🟢`,
  blue: `🔵`,
  yellow: `🟡`,
  purple: `🟣`,
  orange: `🟠`,
}

App.settings_icons = {
  general: `⚙️`,
  theme: `🎨`,
  icons: `🖼️`,
  media: `📷`,
  show: `👁️`,
  mouse: `🖱️`,
  warns: `🚨`,
  lists: `💾`,
  more: `💠`,
}

App.mode_icons = {
  tabs: `📚`,
  history: `⏳`,
  bookmarks: `⭐`,
  closed: `🔃`,
}

App.clipboard_icon = `📋`
App.bot_icon = `🤖`

App.dark_theme_colors = {
  background: `rgb(33, 33, 42)`,
  text: `rgb(242, 242, 242)`,
}

App.light_theme_colors = {
  background: `rgb(200, 200, 200)`,
  text: `rgb(50, 50, 55)`,
}

App.icontext = {
  bookmark: {
    icon: App.mode_icons.bookmarks,
    name: `Bookmark`,
  },
  bookmark_active: {
    icon: App.mode_icons.bookmarks,
    name: `Bookmark This`,
  },
  dark_theme: {
    icon: App.settings_icons.theme,
    name: `Dark Theme`,
  },
  light_theme: {
    icon: App.settings_icons.theme,
    name: `Light Theme`,
  },
  random_theme: {
    icon: App.settings_icons.theme,
    name: `Rnd Theme`,
  },
  random_background: {
    icon: App.settings_icons.theme,
    name: `Rnd Background`,
  },
  background: {
    icon: App.settings_icons.theme,
    name: `Background`,
  },
  restart: {
    icon: App.bot_icon,
    name: `Restart`,
  },
  copy_url: {
    icon: App.clipboard_icon,
    name: `Copy URL`,
  }
}

App.color_names = {
  aliceblue: `#f0f8ff`,
  antiquewhite: `#faebd7`,
  aqua: `#00ffff`,
  aquamarine: `#7fffd4`,
  azure: `#f0ffff`,
  beige: `#f5f5dc`,
  bisque: `#ffe4c4`,
  black: `#000000`,
  blanchedalmond: `#ffebcd`,
  blue: `#0000ff`,
  blueviolet: `#8a2be2`,
  brown: `#a52a2a`,
  burlywood: `#deb887`,
  cadetblue: `#5f9ea0`,
  chartreuse: `#7fff00`,
  chocolate: `#d2691e`,
  coral: `#ff7f50`,
  cornflowerblue: `#6495ed`,
  cornsilk: `#fff8dc`,
  crimson: `#dc143c`,
  cyan: `#00ffff`,
  darkblue: `#00008b`,
  darkcyan: `#008b8b`,
  darkgoldenrod: `#b8860b`,
  darkgray: `#a9a9a9`,
  darkgrey: `#a9a9a9`,
  darkgreen: `#006400`,
  darkkhaki: `#bdb76b`,
  darkmagenta: `#8b008b`,
  darkolivegreen: `#556b2f`,
  darkorange: `#ff8c00`,
  darkorchid: `#9932cc`,
  darkred: `#8b0000`,
  darksalmon: `#e9967a`,
  darkseagreen: `#8fbc8f`,
  darkslateblue: `#483d8b`,
  darkslategray: `#2f4f4f`,
  darkslategrey: `#2f4f4f`,
  darkturquoise: `#00ced1`,
  darkviolet: `#9400d3`,
  deeppink: `#ff1493`,
  deepskyblue: `#00bfff`,
  dimgray: `#696969`,
  dimgrey: `#696969`,
  dodgerblue: `#1e90ff`,
  firebrick: `#b22222`,
  floralwhite: `#fffaf0`,
  forestgreen: `#228b22`,
  fuchsia: `#ff00ff`,
  gainsboro: `#dcdcdc`,
  ghostwhite: `#f8f8ff`,
  gold: `#ffd700`,
  goldenrod: `#daa520`,
  gray: `#808080`,
  grey: `#808080`,
  green: `#008000`,
  greenyellow: `#adff2f`,
  honeydew: `#f0fff0`,
  hotpink: `#ff69b4`,
  indianred: `#cd5c5c`,
  indigo: `#4b0082`,
  ivory: `#fffff0`,
  khaki: `#f0e68c`,
  lavender: `#e6e6fa`,
  lavenderblush: `#fff0f5`,
  lawngreen: `#7cfc00`,
  lemonchiffon: `#fffacd`,
  lightblue: `#add8e6`,
  lightcoral: `#f08080`,
  lightcyan: `#e0ffff`,
  lightgoldenrodyellow: `#fafad2`,
  lightgray: `#d3d3d3`,
  lightgrey: `#d3d3d3`,
  lightgreen: `#90ee90`,
  lightpink: `#ffb6c1`,
  lightsalmon: `#ffa07a`,
  lightseagreen: `#20b2aa`,
  lightskyblue: `#87cefa`,
  lightslategray: `#778899`,
  lightslategrey: `#778899`,
  lightsteelblue: `#b0c4de`,
  lightyellow: `#ffffe0`,
  lime: `#00ff00`,
  limegreen: `#32cd32`,
  linen: `#faf0e6`,
  magenta: `#ff00ff`,
  maroon: `#800000`,
  mediumaquamarine: `#66cdaa`,
  mediumblue: `#0000cd`,
  mediumorchid: `#ba55d3`,
  mediumpurple: `#9370db`,
  mediumseagreen: `#3cb371`,
  mediumslateblue: `#7b68ee`,
  mediumspringgreen: `#00fa9a`,
  mediumturquoise: `#48d1cc`,
  mediumvioletred: `#c71585`,
  midnightblue: `#191970`,
  mintcream: `#f5fffa`,
  mistyrose: `#ffe4e1`,
  moccasin: `#ffe4b5`,
  navajowhite: `#ffdead`,
  navy: `#000080`,
  oldlace: `#fdf5e6`,
  olive: `#808000`,
  olivedrab: `#6b8e23`,
  orange: `#ffa500`,
  orangered: `#ff4500`,
  orchid: `#da70d6`,
  palegoldenrod: `#eee8aa`,
  palegreen: `#98fb98`,
  paleturquoise: `#afeeee`,
  palevioletred: `#db7093`,
  papayawhip: `#ffefd5`,
  peachpuff: `#ffdab9`,
  peru: `#cd853f`,
  pink: `#ffc0cb`,
  plum: `#dda0dd`,
  powderblue: `#b0e0e6`,
  purple: `#800080`,
  rebeccapurple: `#663399`,
  red: `#ff0000`,
  rosybrown: `#bc8f8f`,
  royalblue: `#4169e1`,
  saddlebrown: `#8b4513`,
  salmon: `#fa8072`,
  sandybrown: `#f4a460`,
  seagreen: `#2e8b57`,
  seashell: `#fff5ee`,
  sienna: `#a0522d`,
  silver: `#c0c0c0`,
  skyblue: `#87ceeb`,
  slateblue: `#6a5acd`,
  slategray: `#708090`,
  slategrey: `#708090`,
  snow: `#fffafa`,
  springgreen: `#00ff7f`,
  steelblue: `#4682b4`,
  tan: `#d2b48c`,
  teal: `#008080`,
  thistle: `#d8bfd8`,
  tomato: `#ff6347`,
  turquoise: `#40e0d0`,
  violet: `#ee82ee`,
  wheat: `#f5deb3`,
  white: `#ffffff`,
  whitesmoke: `#f5f5f5`,
  yellow: `#ffff00`,
  yellowgreen: `#9acd32`,
}