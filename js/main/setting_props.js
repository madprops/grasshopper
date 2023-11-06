App.build_settings = () => {
  // Setting Properties
  App.setting_props = {}
  let category, props

  // Add category props to main object
  function add_props () {
    for (let key in props) {
      props[key].category = category
      App.setting_props[key] = props[key]
    }
  }

  category = `general`

  props = {
    font_size: {
      name: `Font Size`,
      type: `number`,
      value: 16,
      action: `theme`,
      placeholder: `Px`,
      min: 6,
      max: 28,
      info: `The font size in pixels to use for text. The interface scales accordingly`,
      version: 1,
    },
    font: {
      name: `Font`,
      type: `menu`,
      value: `sans-serif`,
      info: `The font to use for text`,
      version: 1,
    },
    text_mode: {
      name: `Text`,
      type: `menu`,
      value: `title`,
      info: `What to show as the text for each item`,
      version: 1,
    },
    item_height: {
      name: `Spacing`,
      type: `menu`,
      value: `normal`,
      info: `The space between items`,
      version: 1,
    },
    item_border: {
      name: `Borders`,
      type: `menu`,
      value: `none`,
      info: `Borders between items`,
      version: 2,
    },
    item_icon: {
      name: `Icons`,
      type: `menu`,
      value: `normal`,
      info: `The size of the item icons`,
      version: 1,
    },
    icon_effect: {
      name: `Icon Efect`,
      type: `menu`,
      value: `spin`,
      info: `Effect for icons when multiple items are selected`,
      version: 1,
    },
    hover_effect: {
      name: `Hover Effect`,
      type: `menu`,
      value: `glow`,
      info: `What effect to use when hoving items`,
      version: 1,
    },
    selected_effect: {
      name: `Selected Effect`,
      type: `menu`,
      value: `background`,
      info: `What effect to use on selected items`,
      version: 1,
    },
    primary_mode: {
      name: `Primary Mode`,
      type: `menu`,
      value: `tabs`,
      info: `The main preferred mode. This is shown at startup`,
      version: 1,
    },
    tab_sort: {
      name: `Tab Sort`,
      type: `menu`,
      value: `normal`,
      info: `How to sort the tabs. Either normally by index order, or by having the most recently visited tabs at the top`,
      version: 1,
    },
    auto_restore: {
      name: `Auto-Restore`,
      type: `menu`,
      value: `never`,
      info: `When to auto-restore after the mouse leaves the window. Or if it should restore instantly after an action.
      Restore means going back to the primary mode and clearing the filter`,
      version: 1,
    },
    width: {
      name: `Width`,
      type: `menu`,
      value: 75,
      info: `Width of the popup`,
      version: 1,
    },
    height: {
      name: `Height`,
      type: `menu`,
      value: 85,
      info: `Height of the popup`,
      version: 1,
    },
    bookmarks_folder: {
      name: `Bookmarks Folder`,
      type: `text`,
      value: `Grasshopper`,
      placeholder: `Folder Name`,
      no_empty: true,
      info: `Where to save bookmarks`,
      version: 1,
    },
    smooth_scroll: {
      name: `Smooth Scroll`,
      type: `checkbox`,
      value: true,
      info: `Enable smooth list scrolling in some cases`,
      version: 1,
    },
    wrap_text: {
      name: `Wrap Text`,
      type: `checkbox`,
      value: false,
      info: `Allow long lines to wrap into multiple lines, increasing the height of some items`,
      version: 1,
    },
    click_select: {
      name: `Click Select`,
      type: `checkbox`,
      value: false,
      info: `Click to select without triggering an action`,
      version: 1,
    },
    icon_pick: {
      name: `Icon Pick`,
      type: `checkbox`,
      value: false,
      info: `Clicking the icons on the left of items toggles select`,
      version: 1,
    },
    lock_drag: {
      name: `Lock Drag`,
      type: `checkbox`,
      value: false,
      info: `Require holding Ctrl to drag tab items vertically. This is to avoid accidental re-ordering`,
      version: 1,
    },
    auto_blur: {
      name: `Auto Blur`,
      type: `checkbox`,
      value: false,
      info: `Blur the sidebar automatically for privacy`,
      version: 1,
    },
  }

  add_props()
  category = `theme`

  props = {
    text_color: {
      name: `Text Color`,
      type: `color`,
      value: App.dark_colors.text,
      action: `theme`,
      info: `The text color`,
      version: 1,
    },
    background_color: {
      name: `Background Color`,
      type: `color`,
      value: App.dark_colors.background,
      action: `theme`,
      info: `The background color`,
      version: 1,
    },
    background_image: {
      name: `Background Image`,
      type: `text`,
      value: `Background 1`,
      action: `theme`,
      placeholder: `Image URL`,
      btns: [`pick`],
      info: `The background image. Pick from the list or enter a URL`,
      version: 1,
    },
    background_effect: {
      name: `Background Effect`,
      type: `menu`,
      value: `none`,
      action: `theme`,
      info: `The effect on the background image`,
      version: 1,
    },
    background_tiles: {
      name: `Background Tiles`,
      type: `menu`,
      value: `none`,
      action: `theme`,
      info: `The tile size of the background image`,
      version: 1,
    },
    text_glow: {
      name: `Text Glow`,
      type: `checkbox`,
      action: `theme`,
      value: false,
      info: `Add a glow effect to all text`,
      version: 1,
    },
    custom_css: {
      name: `Custom CSS`,
      type: `textarea`,
      action: `theme`,
      value: ``,
      placeholder: `Paste CSS here`,
      info: `Add custom CSS to override the default style`,
      version: 1,
    },
  }

  add_props()
  category = `media`

  props = {
    image_icon: {
      name: `View Image Icon`,
      type: `text_smaller`,
      value: `🖼️`,
      placeholder: App.icon_placeholder,
      info: `Media icon for images`,
      version: 1,
    },
    view_image_tabs: {
      name: `View Image (Tabs)`,
      type: `menu`,
      value: `icon`,
      info: `What to do when clicking on an image in tabs mode`,
      version: 1,
    },
    view_image_history: {
      name: `View Image (History)`,
      type: `menu`,
      value: `icon`,
      info: `What to do when clicking on an image in history mode`,
      version: 1,
    },
    view_image_bookmarks: {
      name: `View Image (Bookmarks)`,
      type: `menu`,
      value: `icon`,
      info: `What to do when clicking on an image in bookmarks mode`,
      version: 1,
    },
    view_image_closed: {
      name: `View Image (Closed)`,
      type: `menu`,
      value: `icon`,
      info: `What to do when clicking on an image in closed mode`,
      version: 1,
    },
    video_icon: {
      name: `View Video Icon`,
      type: `text_smaller`,
      value: `▶️`,
      placeholder: App.icon_placeholder,
      info: `Media icon for videos`,
      version: 1,
    },
    view_video_tabs: {
      name: `View Video (Tabs)`,
      type: `menu`,
      value: `icon`,
      info: `What to do when clicking on a video in tabs mode`,
      version: 1,
    },
    view_video_history: {
      name: `View Video (History)`,
      type: `menu`,
      value: `icon`,
      info: `What to do when clicking on a video in history mode`,
      version: 1,
    },
    view_video_bookmarks: {
      name: `View Video (Bookmarks)`,
      type: `menu`,
      value: `icon`,
      info: `What to do when clicking on a video in bookmarks mode`,
      version: 1,
    },
    view_video_closed: {
      name: `View Video (Closed)`,
      type: `menu`,
      value: `icon`,
      info: `What to do when clicking on a video in closed mode`,
      version: 1,
    },
    audio_icon: {
      name: `View Audio Icon`,
      type: `text_smaller`,
      value: `🎵`,
      placeholder: App.icon_placeholder,
      info: `Media icon for audio`,
      version: 1,
    },
    view_audio_tabs: {
      name: `View Audio (Tabs)`,
      type: `menu`,
      value: `icon`,
      info: `What to do when clicking on an audio in tabs mode`,
      version: 1,
    },
    view_audio_history: {
      name: `View Audio (History)`,
      type: `menu`,
      value: `icon`,
      info: `What to do when clicking on an audio in history mode`,
      version: 1,
    },
    view_audio_bookmarks: {
      name: `View Audio (Bookmarks)`,
      type: `menu`,
      value: `icon`,
      info: `What to do when clicking on an audio in bookmarks mode`,
      version: 1,
    },
    view_audio_closed: {
      name: `View Audio (Closed)`,
      type: `menu`,
      value: `icon`,
      info: `What to do when clicking on an audio in closed mode`,
      version: 1,
    },
  }

  add_props()
  category = `icons`

  props = {
    active_icon: {
      name: `Active Icon`,
      type: `text_smaller`,
      value: ``,
      placeholder: App.icon_placeholder,
      info: `Icon for active tabs`,
      version: 1,
    },
    pin_icon: {
      name: `Pin Icon`,
      type: `text_smaller`,
      value: ``,
      placeholder: App.icon_placeholder,
      info: `Icon for pinned tabs`,
      version: 1,
    },
    normal_icon: {
      name: `Normal Icon`,
      type: `text_smaller`,
      value: ``,
      placeholder: App.icon_placeholder,
      info: `Icon for normal tabs`,
      version: 1,
    },
    playing_icon: {
      name: `Playing Icon`,
      type: `text_smaller`,
      value: `🔊`,
      placeholder: App.icon_placeholder,
      info: `Icons for tabs emitting audio`,
      version: 1,
    },
    muted_icon: {
      name: `Muted Icon`,
      type: `text_smaller`,
      value: `🔇`,
      placeholder: App.icon_placeholder,
      info: `Icons for muted tabs`,
      version: 1,
    },
    loaded_icon: {
      name: `Loaded Icon`,
      type: `text_smaller`,
      value: ``,
      info: `Icons for loaded tabs`,
      placeholder: App.icon_placeholder,
      version: 1,
    },
    unloaded_icon: {
      name: `Unloaded Icon`,
      type: `text_smaller`,
      value: `💤`,
      info: `Icons for unloaded tabs`,
      placeholder: App.icon_placeholder,
      version: 1,
    },
    unread_icon: {
      name: `Unread Icon`,
      type: `text_smaller`,
      value: `⭕`,
      info: `Icons for unread tabs`,
      placeholder: App.icon_placeholder,
      version: 1,
    },
    titled_icon: {
      name: `Titled Icon`,
      type: `text_smaller`,
      value: ``,
      placeholder: App.icon_placeholder,
      info: `Icon for titled tabs`,
      version: 1,
    },
    tagged_icon: {
      name: `Tagged Icon`,
      type: `text_smaller`,
      value: ``,
      placeholder: App.icon_placeholder,
      info: `Icon for tagged tabs`,
      version: 1,
    },
    notes_icon: {
      name: `Notes Icon`,
      type: `text_smaller`,
      value: `📝`,
      placeholder: App.icon_placeholder,
      info: `Icon for tabs with notes`,
      version: 1,
    },
    edited_icon: {
      name: `Edited Icon`,
      type: `text_smaller`,
      value: ``,
      placeholder: App.icon_placeholder,
      info: `Icon for edited tabs`,
      version: 1,
    },
  }

  add_props()
  category = `show`

  props = {
    favorites_mode: {
      name: `Favorites Mode`,
      type: `menu`,
      value: `none`,
      info: `How to show favorites`,
      version: 1,
    },
    favorites_menu: {
      name: `Favorites Menu`,
      type: `list`,
      value: [
        {cmd: `color_red`, alt: `filter_color_red`},
        {cmd: `color_green`, alt: `filter_color_green`},
        {cmd: `color_blue`, alt: `filter_color_blue`},
        {cmd: `color_yellow`, alt: `filter_color_yellow`},
        {cmd: `set_random_light_colors`, alt: `set_light_colors`},
        {cmd: `set_random_dark_colors`, alt: `set_dark_colors`},
      ],
      info: `List of commands that can appear in various forms`,
      separator: true,
      version: 1,
    },
    extra_menu_mode: {
      name: `Extra Menu Mode`,
      type: `menu`,
      value: `none`,
      info: `How to show the extra menu on right click. Either on its own submenu,
      flat at the root level, or totally replace the item menu. This menu only appears in tabs mode`,
      version: 1,
    },
    extra_menu: {
      name: `Extra Menu`,
      type: `list`,
      value: [
        {cmd: `toggle_color_red`, alt: `filter_color_red`},
        {cmd: `toggle_color_green`, alt: `filter_color_green`},
        {cmd: `toggle_color_blue`, alt: `filter_color_blue`},
        {cmd: `toggle_color_yellow`, alt: `filter_color_yellow`},
      ],
      info: `Extra menu to show when right clicking items`,
      separator: true,
      version: 4,
    },
    hover_button: {
      name: `Hover Button`,
      type: `menu`,
      value: `none`,
      info: `How to show the hover button on tabs`,
      version: 2,
    },
    hover_menu: {
      name: `Hover Menu`,
      type: `list`,
      value: [
        {cmd: `filter_domain`},
        {cmd: `filter_color`},
        {cmd: `duplicate_tabs`},
        {cmd: `unload_tabs`},
      ],
      info: `Menu to show when clicking the hover button`,
      separator: true,
      version: 1,
    },
    tab_box: {
      name: `Tab Box`,
      type: `menu`,
      value: `none`,
      info: `The height of the tab box with recent tabs`,
      version: 2,
    },
    tab_box_mode: {
      name: `Tab Box Mode`,
      type: `menu`,
      value: `title`,
      info: `What to show in the tab box`,
      version: 2,
    },
    tab_box_position: {
      name: `Tab Box Position`,
      type: `menu`,
      value: `bottom`,
      info: `The position of the tab box`,
      separator: true,
      version: 1,
    },
    taglist: {
      name: `Taglist`,
      type: `menu`,
      value: `none`,
      info: `Tags get displayed at the bottom of tabs`,
      version: 1,
    },
    taglist_mode: {
      name: `Taglist Mode`,
      type: `menu`,
      value: `filter`,
      info: `What to do when clicking the taglist items`,
      separator: true,
      version: 1,
    },
    show_pinline: {
      name: `Show Pinline`,
      type: `menu`,
      value: `auto`,
      info: `Show the widget between pinned and normal tabs`,
      version: 3,
    },
    close_button: {
      name: `Close Button`,
      type: `menu`,
      value: `right`,
      info: `How to show the close button on tabs`,
      separator: true,
      version: 1,
    },
    show_tooltips: {
      name: `Show Tooltips`,
      type: `checkbox`,
      value: true,
      info: `Show tooltips when hovering items`,
      version: 1,
    },
    show_scroller: {
      name: `Show Scroller`,
      type: `checkbox`,
      value: true,
      info: `Show the scroller widget when scrolling the lists`,
      version: 1,
    },
    show_footer: {
      name: `Show Footer`,
      type: `checkbox`,
      value: true,
      info: `Show the footer at the bottom`,
      version: 1,
    },
    show_feedback: {
      name: `Show Feedback`,
      type: `checkbox`,
      value: true,
      info: `Show feedback messages on certain actions`,
      version: 1,
    },
    show_footer_count: {
      name: `Count In Footer`,
      type: `checkbox`,
      value: true,
      info: `Show the item count in the footer`,
      version: 1,
    },
    taglist_add: {
      name: `Taglist Add`,
      type: `checkbox`,
      value: true,
      info: `Show the taglist add button`,
      version: 1,
    },
    sort_taglist: {
      name: `Sort Taglist`,
      type: `checkbox`,
      value: false,
      info: `Sort tags alphabetically in the taglist`,
      version: 1,
    },
    active_trace: {
      name: `Active Trace`,
      type: `checkbox`,
      value: false,
      info: `Show numbers as a trace on recently used tabs`,
      version: 1,
    },
    show_scrollbars: {
      name: `Show Scrollbars`,
      type: `checkbox`,
      value: false,
      info: `Show the regular scrollbars. Else scrollbars are disabled`,
      version: 1,
    },
  }

  add_props()
  category = `gestures`

  props = {
    gestures_enabled: {
      name: `Gestures Enabled`,
      type: `checkbox`,
      value: true,
      info: `Enable mouse gestures`,
      version: 1,
    },
    gestures_threshold: {
      name: `Gestures Threshold`,
      type: `menu`,
      value: 10,
      info: `How sensitive gestures are`,
      version: 1,
    },
    gesture_up: {
      name: `Gesture Up`,
      type: `menu`,
      value: `go_to_top`,
      info: `Up gesture`,
      version: 1,
    },
    gesture_down: {
      name: `Gesture Down`,
      type: `menu`,
      value: `go_to_bottom`,
      info: `Down gesture`,
      version: 1,
    },
    gesture_left: {
      name: `Gesture Left`,
      type: `menu`,
      value: `show_previous_mode`,
      info: `Left gesture`,
      version: 1,
    },
    gesture_right: {
      name: `Gesture Right`,
      type: `menu`,
      value: `show_next_mode`,
      info: `Right gesture`,
      version: 1,
    },
    gesture_up_and_down: {
      name: `Gesture Up Down`,
      type: `menu`,
      value: `filter_all`,
      info: `Up and Down gesture`,
      version: 1,
    },
    gesture_left_and_right: {
      name: `Gesture Left Right`,
      type: `menu`,
      value: `filter_domain`,
      info: `Left and Right gesture`,
      version: 1,
    },
  }

  add_props()
  category = `auxclick`

  props = {
    middle_click_tabs: {
      name: `Middle Click Tabs`,
      type: `menu`,
      value: `close_tabs`,
      info: `Middle-click on tab items`,
      version: 1,
    },
    middle_click_history: {
      name: `Middle Click History`,
      type: `menu`,
      value: `open_items`,
      info: `Middle-click on history items`,
      version: 1,
    },
    middle_click_bookmarks: {
      name: `Middle Click Bookmarks`,
      type: `menu`,
      value: `open_items`,
      info: `Middle-click on bookmark items`,
      version: 1,
    },
    middle_click_closed: {
      name: `Middle Click Closed`,
      type: `menu`,
      value: `open_items`,
      info: `Middle-click on closed items`,
      separator: true,
      version: 1,
    },
    middle_click_main_menu: {
      name: `Middle Click Main Menu`,
      type: `menu`,
      value: `show_primary_mode`,
      info: `Middle-click on the main menu`,
      version: 1,
    },
    middle_click_filter_menu: {
      name: `Middle Click Filter Menu`,
      type: `menu`,
      value: `filter_all`,
      info: `Middle-click on the filter menu`,
      version: 1,
    },
    middle_click_playing: {
      name: `Middle Click Playing`,
      type: `menu`,
      value: `mute_playing_tabs`,
      info: `Middle-click on the playing button`,
      version: 1,
    },
    middle_click_step_back: {
      name: `Middle Click Step Back`,
      type: `menu`,
      value: `browser_back`,
      info: `Middle-click on the step back button`,
      version: 1,
    },
    middle_click_actions_menu: {
      name: `Middle Click Actions Menu`,
      type: `menu`,
      value: `browser_reload`,
      info: `Middle-click on the actions menu`,
      separator: true,
      version: 1,
    },
    middle_click_footer: {
      name: `Middle Click Footer`,
      type: `menu`,
      value: `copy_item_url`,
      info: `Middle-click on the footer`,
      version: 1,
    },
    middle_click_pinline: {
      name: `Middle Click Pinline`,
      type: `menu`,
      value: `close_normal_tabs`,
      info: `Middle-click on the pinline`,
      version: 1,
    },
    middle_click_favorites: {
      name: `Middle Click Favorites`,
      type: `menu`,
      value: `none`,
      info: `Middle-click on the favorites button`,
      version: 1,
    },
    middle_click_hover_button: {
      name: `Middle Click Hover Button`,
      type: `menu`,
      value: `close_tabs`,
      info: `Middle-click on the hover button of tab items`,
      version: 1,
    },
    middle_click_close_button: {
      name: `Middle Click Close Button`,
      type: `menu`,
      value: `unload_tabs`,
      info: `Middle-click on the close buttons`,
      version: 1,
    },
  }

  add_props()
  category = `warns`

  props = {
    edited_special: {
      name: `Edited Special`,
      type: `checkbox`,
      value: true,
      info: `Treat edited tabs as special`,
      version: 1,
    },
    warn_on_close_tabs: {
      name: `Warn On Close Tabs`,
      type: `menu`,
      value: `special`,
      info: `Warn when closing tabs`,
      version: 1,
    },
    warn_on_unload_tabs: {
      name: `Warn On Unload Tabs`,
      type: `menu`,
      value: `special`,
      info: `Warn when unloading tabs`,
      version: 1,
    },
    warn_on_pin_tabs: {
      name: `Warn On Pin Tabs`,
      type: `menu`,
      value: `multiple`,
      info: `Warn when pinning tabs`,
      version: 2,
    },
    warn_on_unpin_tabs: {
      name: `Warn On Unpin Tabs`,
      type: `menu`,
      value: `multiple`,
      info: `Warn when unpinning tabs`,
      version: 2,
    },
    warn_on_duplicate_tabs: {
      name: `Warn Duplicate Tabs`,
      type: `menu`,
      value: `multiple`,
      info: `Warn when duplicating tabs`,
      version: 2,
    },
    warn_on_open: {
      name: `Warn On Open`,
      type: `menu`,
      value: `multiple`,
      info: `Warn when opening items`,
      version: 2,
    },
    warn_on_bookmark: {
      name: `Warn On Bookmark`,
      type: `menu`,
      value: `multiple`,
      info: `Warn when adding bookmarks`,
      version: 2,
    },
    warn_on_load_tabs: {
      name: `Warn On Load Tabs`,
      type: `menu`,
      value: `multiple`,
      info: `Warn when loading tabs`,
      version: 2,
    },
    warn_on_mute_tabs: {
      name: `Warn On Mute Tabs`,
      type: `menu`,
      value: `multiple`,
      info: `Warn when muting tabs`,
      version: 2,
    },
    warn_on_unmute_tabs: {
      name: `Warn On Unmute Tabs`,
      type: `menu`,
      value: `multiple`,
      info: `Warn when unmuting tabs`,
      version: 2,
    },
    warn_on_edit_tabs: {
      name: `Warn On Edit Tabs`,
      type: `menu`,
      value: `multiple`,
      info: `Warn when changing colors or titles`,
      version: 2,
    },
    max_warn_limit: {
      name: `Max Warn Limit`,
      type: `number`,
      value: 25,
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      info: `Force a confirm after this many items regardless of warn settings`,
      version: 1,
    },
  }

  add_props()
  category = `edits`

  props = {
    domain_rules: {
      name: `Domain Rules`,
      type: `list`,
      value: [],
      info: `Apply rules to domains automatically, like color, title, and tags`,
      version: 1,
    },
    color_mode: {
      name: `Color Mode`,
      type: `menu`,
      value: `icon`,
      info: `How to display the colors`,
      version: 2,
    },
    color_icon_click: {
      name: `Color Icon Click`,
      type: `checkbox`,
      value: true,
      info: `Show the color menu by clicking a color icon`,
      version: 1,
    },
    notes_icon_click: {
      name: `Notes Icon Click`,
      type: `checkbox`,
      value: true,
      info: `Show the notes when clicking the notes icon`,
      version: 1,
    },
    color_red: {
      name: `Color Red`,
      type: `color`,
      value: `rgb(255, 0, 153)`,
      info: `Color an item red`,
      version: 1,
    },
    color_green: {
      name: `Color Green`,
      type: `color`,
      value: `rgb(102, 204, 0)`,
      info: `Color an item green`,
      version: 1,
    },
    color_blue: {
      name: `Color Blue`,
      type: `color`,
      value: `rgb(0, 153, 255)`,
      info: `Color an item blue`,
      version: 1,
    },
    color_yellow: {
      name: `Color Yellow`,
      type: `color`,
      value: `rgb(255, 153, 0)`,
      info: `Color an item yellow`,
      version: 1,
    },
  }

  add_props()
  category = `colors`

  props = {
    text_color_active_enabled: {
      name: `Active Tabs (Text)`,
      type: `checkbox`,
      value: false,
      info: `Use custom text color for active tabs`,
      version: 1,
    },
    text_color_active: {
      name: `Active Tabs (Text)`,
      hide_name: true,
      type: `color`,
      value: `rgb(100, 100, 100)`,
      info: `Custom text color for active tabs`,
      version: 1,
    },
    background_color_active_enabled: {
      name: `Active Tabs (Background)`,
      type: `checkbox`,
      value: false,
      info: `Use custom background color for active tabs`,
      version: 1,
    },
    background_color_active: {
      name: `Active Tabs (Background)`,
      hide_name: true,
      type: `color`,
      value: `rgb(100, 100, 100)`,
      info: `Custom background color for active tabs`,
      version: 1,
    },
    text_color_playing_enabled: {
      name: `Playing Tabs (Text)`,
      type: `checkbox`,
      value: false,
      info: `Use custom text color for playing tabs`,
      version: 1,
    },
    text_color_playing: {
      name: `Playing Tabs (Text)`,
      hide_name: true,
      type: `color`,
      value: `rgb(100, 100, 100)`,
      info: `Custom text color for playing tabs`,
      version: 1,
    },
    background_color_playing_enabled: {
      name: `Playing Tabs (Background)`,
      type: `checkbox`,
      value: false,
      info: `Use custom background color for playing tabs`,
      version: 1,
    },
    background_color_playing: {
      name: `Playing Tabs (Background)`,
      hide_name: true,
      type: `color`,
      value: `rgb(100, 100, 100)`,
      info: `Custom background color for playing tabs`,
      version: 1,
    },
    text_color_unread_enabled: {
      name: `Unread Tabs (Text)`,
      type: `checkbox`,
      value: false,
      info: `Use custom text color for unread tabs`,
      version: 1,
    },
    text_color_unread: {
      name: `Unread Tabs (Text)`,
      hide_name: true,
      type: `color`,
      value: `rgb(100, 100, 100)`,
      info: `Custom text color for unread tabs`,
      version: 1,
    },
    background_color_unread_enabled: {
      name: `Unread Tabs (Background)`,
      type: `checkbox`,
      value: false,
      info: `Use custom background color for unread tabs`,
      version: 1,
    },
    background_color_unread: {
      name: `Unread Tabs (Background)`,
      hide_name: true,
      type: `color`,
      value: `rgb(100, 100, 100)`,
      info: `Custom background color for unread tabs`,
      version: 1,
    },
    text_color_pinned_enabled: {
      name: `Pinned Tabs (Text)`,
      type: `checkbox`,
      value: false,
      info: `Use custom text color for pins`,
      version: 1,
    },
    text_color_pinned: {
      name: `Pinned Tabs (Text)`,
      hide_name: true,
      type: `color`,
      value: `rgb(100, 100, 100)`,
      info: `Custom text color for pins`,
      version: 1,
    },
    background_color_pinned_enabled: {
      name: `Pinned Tabs (Background)`,
      type: `checkbox`,
      value: false,
      info: `Use custom background color for pins`,
      version: 1,
    },
    background_color_pinned: {
      name: `Pinned Tabs (Background)`,
      hide_name: true,
      type: `color`,
      value: `rgb(100, 100, 100)`,
      info: `Custom background color for pins`,
      version: 1,
    },
    text_color_normal_enabled: {
      name: `Normal Tabs (Text)`,
      type: `checkbox`,
      value: false,
      info: `Use custom text color for normal tabs`,
      version: 1,
    },
    text_color_normal: {
      name: `Normal Tabs (Text)`,
      hide_name: true,
      type: `color`,
      value: `rgb(100, 100, 100)`,
      info: `Custom text color for normal tabs`,
      version: 1,
    },
    background_color_normal_enabled: {
      name: `Normal Tabs (Background)`,
      type: `checkbox`,
      value: false,
      info: `Use custom background color for normal tabs`,
      version: 1,
    },
    background_color_normal: {
      name: `Normal Tabs (Background)`,
      hide_name: true,
      type: `color`,
      value: `rgb(100, 100, 100)`,
      info: `Custom background color for normal tabs`,
      version: 1,
    },
    text_color_loaded_enabled: {
      name: `Loaded Tabs (Text)`,
      type: `checkbox`,
      value: false,
      info: `Use custom text color for loaded tabs`,
      version: 1,
    },
    text_color_loaded: {
      name: `Loaded Tabs (Text)`,
      hide_name: true,
      type: `color`,
      value: `rgb(100, 100, 100)`,
      info: `Custom text color for loaded tabs`,
      version: 1,
    },
    background_color_loaded_enabled: {
      name: `Loaded Tabs (Background)`,
      type: `checkbox`,
      value: false,
      info: `Use custom background color for loaded tabs`,
      version: 1,
    },
    background_color_loaded: {
      name: `Loaded Tabs (Background)`,
      hide_name: true,
      type: `color`,
      value: `rgb(100, 100, 100)`,
      info: `Custom background color for loaded tabs`,
      version: 1,
    },
    text_color_unloaded_enabled: {
      name: `Unloaded Tabs (Text)`,
      type: `checkbox`,
      value: false,
      info: `Use custom text color for unloaded tabs`,
      version: 1,
    },
    text_color_unloaded: {
      name: `Unloaded Tabs (Text)`,
      hide_name: true,
      type: `color`,
      value: `rgb(100, 100, 100)`,
      info: `Custom text color for unloaded tabs`,
      version: 1,
    },
    background_color_unloaded_enabled: {
      name: `Unloaded Tabs (Background)`,
      type: `checkbox`,
      value: false,
      info: `Use custom background color for unloaded tabs`,
      version: 1,
    },
    background_color_unloaded: {
      name: `Unloaded Tabs (Background)`,
      hide_name: true,
      type: `color`,
      value: `rgb(100, 100, 100)`,
      info: `Custom background color for unloaded tabs`,
      version: 1,
    },
  }

  add_props()
  category = `filter`

  props = {
    aliases: {
      name: `Aliases`,
      type: `list`,
      value: [
        {a: `planet`, b: `earth`}
      ],
      info: `Aliases to use when filtering items`,
      version: 3,
    },
    custom_filters: {
      name: `Custom Filters`,
      type: `list`,
      value: [
        {filter: `re: (today|$day)`},
        {filter: `re: ($month|$year)`},
      ],
      info: `Pre-made filters to use. These appear in the Custom section`,
      version: 3,
    },
    clean_filter: {
      name: `Clean Filter`,
      type: `checkbox`,
      value: true,
      info: `Remove special characters from the filter`,
      version: 1,
    },
    case_insensitive: {
      name: `Case Insensitive`,
      type: `checkbox`,
      value: true,
      info: `Make the filter case insensitive`,
      version: 1,
    },
    reuse_filter: {
      name: `Re-Use Filter`,
      type: `checkbox`,
      value: true,
      info: `Re-use the filter when moving across modes`,
      version: 1,
    },
    show_filter_history: {
      name: `Show Filter History`,
      type: `checkbox`,
      value: true,
      info: `Show the filter history when right clicking the filter`,
      version: 1,
    },
    filter_colors: {
      name: `Filter Colors`,
      type: `checkbox`,
      value: true,
      info: `Consider colors when using the filter normally`,
      version: 1,
    },
    filter_tags: {
      name: `Filter Tags`,
      type: `checkbox`,
      value: true,
      info: `Consider tags when using the filter normally`,
      version: 1,
    },
    filter_enter: {
      name: `Filter Enter`,
      type: `checkbox`,
      value: false,
      info: `Require pressing Enter to use filter or search`,
      version: 1,
    },
    max_search_items: {
      name: `Max Search Items`,
      type: `number`,
      value: 500,
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      info: `Max items to return on search modes like history and bookmarks`,
      version: 1,
    },
    deep_max_search_items: {
      name: `Deep Max Search Items`,
      type: `number`,
      value: 5000,
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      info: `Max search items to return in deep mode (more items)`,
      version: 1,
    },
    history_max_months: {
      name: `History Max Months`,
      type: `number`,
      value: 18,
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      info: `How many months back to consider when searching history`,
      version: 1,
    },
    deep_history_max_months: {
      name: `Deep History Max Months`,
      type: `number`,
      value: 54,
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      info: `How many months back to consider when searching history in deep mode (more months)`,
      version: 1,
    },
    filter_delay: {
      name: `Filter Delay`,
      type: `number`,
      value: 50,
      action: `filter_debouncers`,
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      info: `The filter delay on instant modes like tabs and closed (milliseconds)`,
      version: 1,
    },
    filter_delay_search: {
      name: `Filter Delay (Search)`,
      type: `number`,
      value: 200,
      action: `filter_debouncers`,
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      info: `The filter delay on search modes like history and bookmarks (milliseconds)`,
      version: 1,
    },
    max_filter_history: {
      name: `Max Filter History`,
      type: `number`,
      value: 10,
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      info: `Max items to show in the filter history`,
      version: 1,
    },
  }

  add_props()
  category = `triggers`

  props = {
    keyboard_shortcuts: {
      name: `Keyboard Shortcuts`,
      type: `list`,
      value: [],
      info: `Extra keyboard shortcuts. If these are triggered the default shortcuts get ignored`,
      separator: true,
      version: 4,
    },
    double_click_command: {
      name: `On Double Click`,
      type: `menu`,
      value: `none`,
      info: `What command to run when double clicking an item`,
      version: 1,
    },
    left_click_press_command: {
      name: `On Left Click Press`,
      type: `menu`,
      value: `none`,
      info: `What command to run when pressing the left mouse button on an item for a short time`,
      version: 1,
    },
    middle_click_press_command: {
      name: `On Middle Click Press`,
      type: `menu`,
      value: `none`,
      info: `What command to run when pressing the middle mouse button on an item for a short time`,
      separator: true,
      version: 1,
    },
    double_ctrl_command: {
      name: `On Double Ctrl`,
      type: `menu`,
      value: `show_palette`,
      info: `What command to run when pressing Ctrl twice quickly`,
      version: 1,
    },
    double_shift_command: {
      name: `On Double Shift`,
      type: `menu`,
      value: `none`,
      info: `What command to run when pressing Shift twice quickly`,
      version: 1,
    },
    ctrl_press_command: {
      name: `On Ctrl Press`,
      type: `menu`,
      value: `none`,
      info: `What command to run when pressing and holding Ctrl for a short time`,
      version: 1,
    },
    shift_press_command: {
      name: `On Shift Press`,
      type: `menu`,
      value: `none`,
      info: `What command to run when pressing and holding Shift for a short time`,
      separator: true,
      version: 1,
    },
    double_key_delay: {
      name: `Double Key Delay`,
      type: `number`,
      value: 350,
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      info: `Delay to trigger action when double tapping a key like Ctrl (ms).
      The bigger the delay the easier it is to trigger a command`,
      version: 1,
    },
    key_press_delay: {
      name: `Key Press Delay`,
      type: `number`,
      value: 480,
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      info: `Delay to trigger action when long pressing a key like Ctrl (ms).
      This is the amount of time to hold the key down to trigger a command`,
      version: 1,
    },
    click_press_delay: {
      name: `Click Press Delay`,
      type: `number`,
      value: 480,
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      info: `Delay to trigger action when long pressing a mouse button (ms).
      This is the amount of time to hold the mouse button down to trigger a command`,
      version: 1,
    },
  }

  add_props()
  category = `more`

  props = {
    single_new_tab: {
      name: `Single New Tab`,
      type: `checkbox`,
      value: true,
      info: `Keep only one new tab at any time`,
      version: 1,
    },
    close_on_focus: {
      name: `Close On Focus`,
      type: `checkbox`,
      value: true,
      info: `Close the popup when focusing a tab`,
      version: 1,
    },
    close_on_open: {
      name: `Close On Open`,
      type: `checkbox`,
      value: true,
      info: `Close the popup when opening a popup`,
      version: 1,
    },
    mute_click: {
      name: `Mute Click`,
      type: `checkbox`,
      value: true,
      info: `Un-Mute tabs when clicking on the mute icon`,
      version: 1,
    },
    double_click_new: {
      name: `Double Click New`,
      type: `checkbox`,
      value: true,
      info: `Open a new tab when double clicking empty space`,
      version: 1,
    },
    rounded_corners: {
      name: `Rounded Corners`,
      type: `checkbox`,
      value: true,
      action: `theme`,
      info: `Allow rounded corners in some parts of the interface`,
      version: 1,
    },
    direct_settings: {
      name: `Direct Settings`,
      type: `checkbox`,
      value: true,
      info: `Go straight to General when clicking Settings. Else show a menu to pick a category`,
      version: 1,
    },
    sort_commands: {
      name: `Sort Commands`,
      type: `checkbox`,
      value: true,
      info: `Sort commands in the palette by recent use`,
      version: 1,
    },
    all_bookmarks: {
      name: `All Bookmarks`,
      type: `checkbox`,
      value: true,
      info: `Show other bookmarks apart from the configured bookmarks folder`,
      version: 1,
    },
    tab_box_active: {
      name: `Tab Box Active`,
      type: `checkbox`,
      value: true,
      info: `Show the active tab in the tab box`,
      version: 1,
    },
    hover_button_pick: {
      name: `Hover Button Pick`,
      type: `checkbox`,
      value: true,
      info: `Pick items when right clicking the hover button`,
      version: 1,
    },
    generate_icons: {
      name: `Generate Icons`,
      type: `checkbox`,
      value: true,
      info: `Generate icons if favicons are not found`,
      version: 1,
    },
    all_caps: {
      name: `All Caps`,
      type: `checkbox`,
      value: false,
      info: `ALL CAPS when you spell the tab name`,
      version: 1,
    },
    item_menu_select: {
      name: `Item Menu Select`,
      type: `checkbox`,
      value: false,
      info: `Select items when right clicking them to show the item menu`,
      version: 1,
    },
    debug_mode: {
      name: `Debug Mode`,
      type: `checkbox`,
      value: false,
      info: `Enable some data for developers`,
      version: 1,
    },
    max_recent_tabs: {
      name: `Max Recent Tabs`,
      type: `number`,
      value: 10,
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      info: `Max items to show in Recent Tabs`,
      version: 1,
    },
    max_active_history: {
      name: `Max Active History`,
      type: `number`,
      value: 20,
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      info: `Max active tab history to remember. This aftects Active Trace and the Tab Box`,
      version: 1,
    },
  }

  add_props()

  // Category Properties
  App.setting_catprops = {
    general: {
      info: `This is the main settings window with some general settings. There are various categories.
            Clicking the labels shows menus. Use the top buttons to navigate and save/load data`,
      setup: () => {
        App.settings_make_menu(`text_mode`, [
          {text: `Title`, value: `title`},
          {text: `URL`, value: `url`},
          {text: `Title / URL`, value: `title_url`},
          {text: `URL / Title`, value: `url_title`},
        ])

        App.settings_make_menu(`font`, [
          {text: `Sans`, value: `sans-serif`},
          {text: `Serif`, value: `serif`},
          {text: `Mono`, value: `monospace`},
          {text: `Cursive`, value: `cursive`},
        ], () => {
          App.apply_theme()
        })

        App.settings_make_menu(`auto_restore`, [
          {text: `Never`, value: `never`},
          {text: `1 Second`, value: `1_seconds`},
          {text: `3 Seconds`, value: `3_seconds`},
          {text: `5 Seconds`, value: `5_seconds`},
          {text: `10 Seconds`, value: `10_seconds`},
          {text: `30 Seconds`, value: `30_seconds`},
          {text: `On Action`, value: `action`},
        ], () => {
          clearTimeout(App.restore_timeout)
        })

        App.settings_make_menu(`item_height`, App.sizes)

        App.settings_make_menu(`item_border`, [
          {text: `None`, value: `none`},
          {text: `Normal`, value: `normal`},
          {text: `Big`, value: `big`},
          {text: `Huge`, value: `huge`},
        ])

        App.settings_make_menu(`item_icon`, [{text: `None`, value: `none`}, ...App.sizes])

        App.settings_make_menu(`icon_effect`, [
          {text: `None`, value: `none`},
          {text: `Spin`, value: `spin`},
          {text: `Invert`, value: `invert`},
          {text: `Border`, value: `border`},
        ])

        App.settings_make_menu(`primary_mode`, [
          {text: `Tabs`, value: `tabs`},
          {text: `History`, value: `history`},
          {text: `Bookmarks`, value: `bookmarks`},
          {text: `Closed`, value: `closed`},
        ])

        App.settings_make_menu(`tab_sort`, [
          {text: `Normal`, value: `normal`},
          {text: `Recent`, value: `recent`},
        ])

        App.settings_make_menu(`hover_effect`, App.effects)
        App.settings_make_menu(`selected_effect`, App.effects)

        App.settings_make_menu(`width`, App.get_size_options(), () => {
          App.apply_theme()
        })

        App.settings_make_menu(`height`, App.get_size_options(), () => {
          App.apply_theme()
        })
      },
    },
    theme: {
      info: `Here you can change the color theme and background image. Colors can be randomized.
      The background image can have an effect and/or tile mode. You can also override the CSS`,
      setup: () => {
        App.start_color_picker(`background_color`)
        App.start_color_picker(`text_color`)

        App.settings_make_menu(`background_effect`, App.background_effects, () => {
          App.apply_theme()
        })

        App.settings_make_menu(`background_tiles`, [
          {text: `None`, value: `none`},
          {text: `50px`, value: `50px`},
          {text: `100px`, value: `100px`},
          {text: `150px`, value: `150px`},
          {text: `200px`, value: `200px`},
          {text: `250px`, value: `250px`},
          {text: `300px`, value: `300px`},
          {text: `350px`, value: `350px`},
          {text: `400px`, value: `400px`},
          {text: `450px`, value: `450px`},
          {text: `500px`, value: `500px`},
        ], () => {
          App.apply_theme()
        })

        DOM.ev(DOM.el(`#settings_background_image_pick`), `click`, (e) => {
          App.pick_background(e)
        })
      },
      buttons: [
        [
          {
            text: `Light Colors`, action: () => {
              App.set_light_colors()
            }
          },
          {
            text: `Dark Colors`, action: () => {
              App.set_dark_colors()
            }
          },
        ],
        [
          {
            text: `Random Light`, action: () => {
              App.random_colors(`light`)
            }
          },
          {
            text: `Random Dark`, action: () => {
              App.random_colors(`dark`)
            }
          },
        ],
      ]
    },
    colors: {
      info: `Custom colors for tabs. You can enable/disable each color for different kinds of tabs.
      Some colors take precendence over others`,
      setup: () => {
        for (let key in App.setting_props) {
          let props = App.setting_props[key]

          if (props.category !== `colors`) {
            continue
          }

          if (!key.includes(`_color_`) || key.endsWith(`_enabled`)) {
            continue
          }

          App.start_color_picker(key)
        }
      },
    },
    show: {
      info: `Hide or show interface components. Set component behavior and their menus`,
      setup: () => {
        App.settings_make_menu(`show_pinline`, [
          {text: `Never`, value: `never`},
          {text: `Auto`, value: `auto`},
          {text: `Always`, value: `always`},
        ])

        App.settings_make_menu(`tab_box`, [{text: `None`, value: `none`}, ...App.sizes])

        App.settings_make_menu(`tab_box_mode`, [
          {text: `Title`, value: `title`},
          {text: `URL`, value: `url`},
        ])

        App.settings_make_menu(`tab_box_position`, [
          {text: `Top`, value: `top`},
          {text: `Bottom`, value: `bottom`},
        ])

        App.settings_make_menu(`favorites_mode`, [
          {text: `None`, value: `none`},
          {text: `Bar`, value: `bar`},
          {text: `Button`, value: `button`},
        ])

        App.settings_make_menu(`close_button`, [
          {text: `None`, value: `none`},
          {text: `Left`, value: `left`},
          {text: `Right`, value: `right`},
        ])

        App.settings_make_menu(`hover_button`, [
          {text: `None`, value: `none`},
          {text: `Left`, value: `left`},
          {text: `Right`, value: `right`},
        ])

        App.settings_make_menu(`extra_menu_mode`, [
          {text: `None`, value: `none`},
          {text: `Normal`, value: `normal`},
          {text: `Flat`, value: `flat`},
          {text: `Total`, value: `total`},
        ])

        App.settings_make_menu(`taglist`, [
          {text: `None`, value: `none`},
          {text: `Above`, value: `above`},
          {text: `Below`, value: `below`},
          {text: `Left`, value: `left`},
          {text: `Right`, value: `right`},
        ])

        App.settings_make_menu(`taglist_mode`, [
          {text: `None`, value: `none`},
          {text: `Menu`, value: `menu`},
          {text: `Edit`, value: `edit`},
          {text: `Filter`, value: `filter`},
          {text: `Remove`, value: `remove`},
        ])
      },
    },
    icons: {
      info: `Customize the icons of items. You can leave them empty`,
      setup: () => {},
    },
    edits: {
      info: `Settings regarding edits you can apply to tabs.
      This also includes Domain Rules which apply automatically based on URL`,
      setup: () => {
        for (let color of App.colors) {
          App.start_color_picker(`color_${color}`)
        }

        App.settings_make_menu(`color_mode`, [
          {text: `None`, value: `none`},
          {text: `Icon`, value: `icon`},
          {text: `Border`, value: `border`},
          {text: `Border & Icon`, value: `border_icon`},
          {text: `Background`, value: `background`},
        ])
      },
    },
    filter: {
      info: `Adjust the filter and search`,
      setup: () => {},
    },
    media: {
      info: `How to view media items. An icon appears to the left of items. You can make it view media when clicking the icons, the whole item, or never`,
      setup: () => {
        let opts = [
          {text: `Never`, value: `never`},
          {text: `On Icon Click`, value: `icon`},
          {text: `On Item Click`, value: `item`},
        ]

        for (let m of App.modes) {
          App.settings_make_menu(`view_image_${m}`, opts)
          App.settings_make_menu(`view_video_${m}`, opts)
          App.settings_make_menu(`view_audio_${m}`, opts)
        }
      },
    },
    triggers: {
      info: `Run commands on certain keyboard and mouse actions`,
      setup: () => {
        App.settings_make_menu(`double_click_command`, App.cmdlist)
        App.settings_make_menu(`double_ctrl_command`, App.cmdlist)
        App.settings_make_menu(`double_shift_command`, App.cmdlist)
        App.settings_make_menu(`ctrl_press_command`, App.cmdlist)
        App.settings_make_menu(`shift_press_command`, App.cmdlist)
        App.settings_make_menu(`left_click_press_command`, App.cmdlist)
        App.settings_make_menu(`middle_click_press_command`, App.cmdlist)
      },
    },
    gestures: {
      info: `You perform gestures by holding the middle mouse button, moving in a direction, and releasing the button.
      Each gesture runs a specified command. You can also set the sensitivity of the gestures`,
      setup: () => {
        App.settings_make_menu(`gestures_threshold`, [
          {text: `Normal`, value: 10},
          {text: `Less Sensitive`, value: 100},
        ])

        for (let key in App.setting_props) {
          let props = App.setting_props[key]

          if (props.category === `gestures`) {
            if (key.startsWith(`gesture_`)) {
              App.settings_make_menu(key, App.cmdlist)
            }
          }
        }
      },
    },
    auxclick: {
      info: `Run commands when middle-clicking various components`,
      setup: () => {
        for (let key in App.setting_props) {
          let props = App.setting_props[key]

          if (props.category === `auxclick`) {
            App.settings_make_menu(key, App.cmdlist)
          }
        }
      },
    },
    warns: {
      info: `When to show the confirmation dialog on certain actions.
      'Special' forces a confirm depending if tabs have a certain state like pinned, playing, or colored.
      'Multiple' forces a confirm if multiple items are selected`,
      setup: () => {
        let tab_warn_opts = [
          {text: `Never`, value: `never`},
          {text: `Multiple`, value: `multiple`},
          {text: `Special`, value: `special`},
          {text: `Always`, value: `always`},
        ]

        App.settings_make_menu(`warn_on_close_tabs`, tab_warn_opts)
        App.settings_make_menu(`warn_on_unload_tabs`, tab_warn_opts)

        let tab_warn_opts_2 = [
          {text: `Never`, value: `never`},
          {text: `Multiple`, value: `multiple`},
          {text: `Always`, value: `always`},
        ]

        App.settings_make_menu(`warn_on_pin_tabs`, tab_warn_opts_2)
        App.settings_make_menu(`warn_on_unpin_tabs`, tab_warn_opts_2)
        App.settings_make_menu(`warn_on_duplicate_tabs`, tab_warn_opts_2)
        App.settings_make_menu(`warn_on_open`, tab_warn_opts_2)
        App.settings_make_menu(`warn_on_bookmark`, tab_warn_opts_2)
        App.settings_make_menu(`warn_on_load_tabs`, tab_warn_opts_2)
        App.settings_make_menu(`warn_on_mute_tabs`, tab_warn_opts_2)
        App.settings_make_menu(`warn_on_unmute_tabs`, tab_warn_opts_2)
        App.settings_make_menu(`warn_on_edit_tabs`, tab_warn_opts_2)
      },
    },
    more: {
      info: `Even more settings`,
      setup: () => {},
    },
  }
}