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
    wrap_text: {
      name: `Wrap`,
      type: `checkbox`,
      value: false,
      info: `Allow long lines to wrap`,
      version: 1,
    },
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
    primary_mode: {
      name: `Primary Mode`,
      type: `menu`,
      value: `tabs`,
      info: `The main preferred mode. This is shown at startup`,
      version: 1,
    },
    auto_restore: {
      name: `Auto-Restore`,
      type: `menu`,
      value: `3_seconds`,
      info: `When to auto-restore after the mouse leaves the window. Or if it should restore instantly after an action.
      Restore means going back to the primary mode and clearing the filter`,
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
  }

  add_props()
  category = `theme`

  props = {
    background_color: {
      name: `Background Color`,
      type: `color`,
      value: App.dark_colors.background,
      action: `theme`,
      info: `The background color`,
      version: 1,
    },
    text_color: {
      name: `Text Color`,
      type: `color`,
      value: App.dark_colors.text,
      action: `theme`,
      info: `The text color`,
      version: 1,
    },
    background_image: {
      name: `Background Image`,
      type: `text`,
      value: `Background 1`,
      action: `theme`,
      placeholder: `Image URL`,
      btns: [`pick`],
      info: `The background image. Pick from the buttons or enter a URL`,
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
    unloaded_icon: {
      name: `Unloaded Icon`,
      type: `text_smaller`,
      value: `💤`,
      info: `Icons for unloaded tabs`,
      placeholder: App.icon_placeholder,
      version: 1,
    },
    notes_icon: {
      name: `Notes Icon`,
      type: `text_smaller`,
      value: `📜`,
      placeholder: App.icon_placeholder,
      info: `Icon for items with notes📜`,
      version: 1,
    },
    close_icon: {
      name: `Close Icon`,
      type: `text_smaller`,
      value: `x`,
      placeholder: App.icon_placeholder,
      info: `Icon for the close buttons`,
      version: 1,
    },
  }

  add_props()
  category = `show`

  props = {
    show_pinline: {
      name: `Show Pinline`,
      type: `menu`,
      value: `auto`,
      info: `Show the widget between pinned and normal tabs`,
      version: 3,
    },
    show_tooltips: {
      name: `Show Tooltips`,
      type: `checkbox`,
      value: true,
      info: `Show tooltips when hovering items`,
      version: 1,
    },
    show_scroller: {
      name: `Show Scrollers`,
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
    show_filter_history: {
      name: `Show Filter History`,
      type: `checkbox`,
      value: true,
      info: `Show the filter history when right clicking the filter`,
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
    show_scrollbars: {
      name: `Show Scrollbars`,
      type: `checkbox`,
      value: false,
      info: `Show the regular scrollbars. Else scrollbars are disabled`,
      version: 1,
    },
    reverse_scroller_percentage: {
      name: `Reverse Scroller %`,
      type: `checkbox`,
      value: false,
      info: `Reverse the scrolling percentage in the scroller`,
      version: 1,
    },
    close_icon_on_left: {
      name: `Close Icon On Left`,
      type: `checkbox`,
      value: false,
      info: `Put the close icon on the left side`,
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
      value: `prev_mode`,
      info: `Left gesture`,
      version: 1,
    },
    gesture_right: {
      name: `Gesture Right`,
      type: `menu`,
      value: `next_mode`,
      info: `Right gesture`,
      version: 1,
    },
    gesture_up_and_down: {
      name: `Gesture Up Down`,
      type: `menu`,
      value: `show_all_items`,
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
      name: `Middle-Click Tabs`,
      type: `menu`,
      value: `close_tabs`,
      info: `Middle-click on tab items`,
      version: 1,
    },
    middle_click_history: {
      name: `Middle-Click History`,
      type: `menu`,
      value: `open_items`,
      info: `Middle-click on history items`,
      version: 1,
    },
    middle_click_bookmarks: {
      name: `Middle-Click Bookmarks`,
      type: `menu`,
      value: `open_items`,
      info: `Middle-click on bookmark items`,
      version: 1,
    },
    middle_click_closed: {
      name: `Middle-Click Closed`,
      type: `menu`,
      value: `open_items`,
      info: `Middle-click on closed items`,
      version: 1,
    },
    middle_click_main_menu: {
      name: `Middle-Click Main Menu`,
      type: `menu`,
      value: `show_primary`,
      info: `Middle-click on the main menu`,
      version: 1,
    },
    middle_click_filter_menu: {
      name: `Middle-Click Filter Menu`,
      type: `menu`,
      value: `show_all_items`,
      info: `Middle-click on the filter menu`,
      version: 1,
    },
    middle_click_back_button: {
      name: `Middle-Click Back Button`,
      type: `menu`,
      value: `browser_back`,
      info: `Middle-click on the back button`,
      version: 1,
    },
    middle_click_actions_menu: {
      name: `Middle-Click Actions Menu`,
      type: `menu`,
      value: `browser_reload`,
      info: `Middle-click on the actions menu`,
      version: 1,
    },
    middle_click_footer: {
      name: `Middle-Click Footer`,
      type: `menu`,
      value: `copy_item_url`,
      info: `Middle-click on the footer`,
      version: 1,
    },
    middle_click_pinline: {
      name: `Middle-Click Pinline`,
      type: `menu`,
      value: `close_normal_tabs`,
      info: `Middle-click on the pinline`,
      version: 1,
    },
    middle_click_close_icon: {
      name: `Middle-Click Close Icon`,
      type: `menu`,
      value: `unload_tabs`,
      info: `Middle-click on the close buttons`,
      version: 1,
    },
  }

  add_props()
  category = `menus`

  props = {
    tabs_actions: {
      name: `Tab Actions`,
      type: `list`,
      value: [
        {cmd: `new_tab`},
        {cmd: `sort_tabs`},
        {cmd: `reopen_tab`},
        {cmd: `show_tabs_info`},
        {cmd: `show_tab_urls`},
        {cmd: `open_tab_urls`},
        {cmd: `show_close_tabs_menu`},
      ],
      info: `Tabs action menu`,
      version: 1,
    },
    history_actions: {
      name: `History Actions`,
      type: `list`,
      value: [
        {cmd: `deep_search`},
        {cmd: `search_media`},
      ],
      info: `History action menu`,
      version: 1,
    },
    bookmarks_actions: {
      name: `Bookmark Actions`,
      type: `list`,
      value: [
        {cmd: `bookmark_page`},
        {cmd: `deep_search`},
        {cmd: `search_media`},
      ],
      info: `Bookmarks action menu`,
      version: 1,
    },
    closed_actions: {
      name: `Closed Actions`,
      type: `list`,
      value: [
        {cmd: `forget_closed`},
      ],
      info: `Closed action menu`,
      version: 1,
    },
    extra_menu: {
      name: `Extra Menu`,
      type: `list`,
      value: [],
      info: `If this has items an Extra menu is shown in the item menu when right clicking items`,
      version: 4,
    },
    pinline_menu: {
      name: `Pinline Menu`,
      type: `list`,
      value: [
        {cmd: `select_pinned_tabs`},
        {cmd: `select_normal_tabs`},
      ],
      info: `Menu when clicking the pinline`,
      version: 4,
    },
    empty_menu: {
      name: `Empty Menu`,
      type: `list`,
      value: [
        {cmd: `new_tab`},
        {cmd: `select_all_items`},
      ],
      info: `Menu when right clicking empty space`,
      version: 4,
    },
    footer_menu: {
      name: `Footer Menu`,
      type: `list`,
      value: [
        {cmd: `copy_item_url`},
        {cmd: `copy_item_title`},
      ],
      info: `Menu when right clicking the footer`,
      version: 4,
    },
  }

  add_props()
  category = `keyboard`

  props = {
    keyboard_shortcuts: {
      name: `Keyboard Shortcuts`,
      type: `list`,
      value: [],
      info: `Extra keyboard shortcuts. If these are triggered the default shortcuts get ignored`,
      version: 4,
    },
  }

  add_props()
  category = `warns`

  props = {
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
    warn_on_close_normal_tabs: {
      name: `Warn On Close Normal`,
      type: `menu`,
      value: `multiple`,
      info: `Warn when closing normal tabs using the close menu`,
      version: 2,
    },
    warn_on_close_playing_tabs: {
      name: `Warn On Close Playing`,
      type: `menu`,
      value: `multiple`,
      info: `Warn when closing playing tabs using the close menu`,
      version: 2,
    },
    warn_on_close_unloaded_tabs: {
      name: `Warn On Close Unloaded`,
      type: `menu`,
      value: `multiple`,
      info: `Warn when closing unloaded tabs using the close menu`,
      version: 2,
    },
    warn_on_close_duplicate_tabs: {
      name: `Warn On Close Duplicates`,
      type: `menu`,
      value: `multiple`,
      info: `Warn when closing duplicate tabs using the close menu`,
      version: 2,
    },
    warn_on_close_visible_tabs: {
      name: `Warn On Close Visible`,
      type: `menu`,
      value: `multiple`,
      info: `Warn when closing visible tabs using the close menu`,
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
    warn_on_remove_profiles: {
      name: `Warn On Remove Profiles`,
      type: `menu`,
      value: `always`,
      info: `Warn when removing profiles`,
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
    warn_on_color: {
      name: `Warn On Color`,
      type: `menu`,
      value: `multiple`,
      info: `Warn when changing colors`,
      version: 2,
    },
    warn_on_remove_color: {
      name: `Warn On Remove Color`,
      type: `menu`,
      value: `multiple`,
      info: `Warn when removing colors`,
      version: 2,
    },
    max_warn_limit: {
      name: `Max Warn Limit`,
      type: `number`,
      value: 25,
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      info: `Force a confirm after this many items`,
      version: 1,
    },
  }

  add_props()
  category = `colors`

  props = {
    color_mode: {
      name: `Color Mode`,
      type: `menu`,
      value: `border_icon`,
      info: `What color mode to use`,
      version: 2,
    },
    color_red: {
      name: `Color Red`,
      type: `color`,
      value: `rgb(172, 59, 59)`,
      info: `Color an item red`,
      version: 1,
    },
    color_green: {
      name: `Color Green`,
      type: `color`,
      value: `rgb(45, 115, 45)`,
      info: `Color an item green`,
      version: 1,
    },
    color_blue: {
      name: `Color Blue`,
      type: `color`,
      value: `rgb(59, 59, 147)`,
      info: `Color an item blue`,
      version: 1,
    },
    color_yellow: {
      name: `Color Yellow`,
      type: `color`,
      value: `rgb(200, 200, 88)`,
      info: `Color an item yellow`,
      version: 1,
    },
    color_purple: {
      name: `Color Purple`,
      type: `color`,
      value: `rgb(124, 35, 166)`,
      info: `Color an item purple`,
      version: 1,
    },
    color_orange: {
      name: `Color Orange`,
      type: `color`,
      value: `rgb(189, 144, 74)`,
      info: `Color an item orange`,
      version: 1,
    },
  }

  add_props()
  category = `filter`

  props = {
    aliases: {
      name: `Aliases`,
      type: `list`,
      value: [],
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
    filter_enter: {
      name: `Filter Enter`,
      type: `checkbox`,
      value: false,
      info: `Require pressing Enter to use filter or search`,
      version: 1,
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
      info: `The filter delay on instant modes like tabs and closed`,
      version: 1,
    },
    filter_delay_search: {
      name: `Filter Delay (Search)`,
      type: `number`,
      value: 225,
      action: `filter_debouncers`,
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      info: `The filter delay on search modes like history and bookmarks`,
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
  category = `more`

  props = {
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
    double_click_command: {
      name: `Double Click Command`,
      type: `menu`,
      value: `none`,
      info: `What command to perform when double clicking an item`,
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
      info: `Clicking the the icons selects items`,
      version: 1,
    },
    lock_drag: {
      name: `Lock Drag`,
      type: `checkbox`,
      value: false,
      info: `Require holding Ctrl to re-order tab items`,
      version: 1,
    },
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
    notes_click: {
      name: `Notes Click`,
      type: `checkbox`,
      value: true,
      info: `Show notes when clicking the notes icon`,
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
    max_prev_tabs: {
      name: `Max Prev Tabs`,
      type: `number`,
      value: 11,
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      info: `Max items to show in prev tabs`,
      version: 1,
    },
    debug_mode: {
      name: `Debug Mode`,
      type: `checkbox`,
      value: false,
      info: `Enable some data for developers`,
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

        App.settings_make_menu(`item_height`, [
          {text: `Tiny`, value: `tiny`},
          {text: `Small`, value: `small`},
          {text: `Normal`, value: `normal`},
          {text: `Big`, value: `big`},
          {text: `Huge`, value: `huge`},
        ])

        App.settings_make_menu(`item_border`, [
          {text: `None`, value: `none`},
          {text: `Normal`, value: `normal`},
          {text: `Big`, value: `big`},
          {text: `Huge`, value: `huge`},
        ])

        App.settings_make_menu(`item_icon`, [
          {text: `None`, value: `none`},
          {text: `Tiny`, value: `tiny`},
          {text: `Small`, value: `small`},
          {text: `Normal`, value: `normal`},
          {text: `Big`, value: `big`},
          {text: `Huge`, value: `huge`},
        ])

        App.settings_make_menu(`primary_mode`, [
          {text: `Tabs`, value: `tabs`},
          {text: `History`, value: `history`},
          {text: `Bookmarks`, value: `bookmarks`},
          {text: `Closed`, value: `closed`},
        ])

        App.settings_make_menu(`width`, App.get_size_options(), () => {
          App.apply_theme()
        })

        App.settings_make_menu(`height`, App.get_size_options(), () => {
          App.apply_theme()
        })
      },
    },
    theme: {
      info: `Here you can change the color theme and background image. Colors can be randomized. The background image can have an effect and/or tile mode`,
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
            text: `Dark Colors`, action: () => {
              App.set_dark_colors()
            }
          },
          {
            text: `Light Colors`, action: () => {
              App.set_light_colors()
            }
          },
        ],
        [
          {
            text: `Random Dark`, action: () => {
              App.random_colors(`dark`)
            }
          },
          {
            text: `Random Light`, action: () => {
              App.random_colors(`light`)
            }
          },
        ],
      ]
    },
    colors: {
      info: `These are the colors you assign to items by editing their profiles`,
      setup: () => {
        for (let color of App.colors) {
          App.start_color_picker(`color_${color}`)
        }

        App.settings_make_menu(`color_mode`, [
          {text: `None`, value: `none`},
          {text: `Icon`, value: `icon`},
          {text: `Icon 2`, value: `icon_2`},
          {text: `Border`, value: `border`},
          {text: `Border & Icon`, value: `border_icon`},
          {text: `Border & Icon 2`, value: `border_icon_2`},
        ])
      },
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
    icons: {
      info: `Customize the icons of items. You can leave them empty`,
      setup: () => {},
    },
    show: {
      info: `Hide or show interface components. Set component behavior`,
      setup: () => {
        App.settings_make_menu(`show_pinline`, [
          {text: `Never`, value: `never`},
          {text: `Auto`, value: `auto`},
          {text: `Always`, value: `always`},
        ])
      },
    },
    gestures: {
      info: `You perform gestures by holding the middle mouse button, moving in a direction, and releasing the button`,
      setup: () => {
        DOM.ev(DOM.el(`#settings_gestures_enabled`), `change`, () => {
          App.refresh_gestures()
        })

        App.settings_make_menu(`gestures_threshold`, [
          {text: `Normal`, value: 10},
          {text: `Less Sensitive`, value: 100},
        ], () => {
          App.refresh_gestures()
        })

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
      info: `Perform actions on middle-click`,
      setup: () => {
        for (let key in App.setting_props) {
          let props = App.setting_props[key]

          if (props.category === `auxclick`) {
            App.settings_make_menu(key, App.cmdlist)
          }
        }
      },
    },
    menus: {
      info: `Customize context and action menus`,
      setup: () => {},
    },
    keyboard: {
      info: `You can use these custom shortcuts to run commands. You can define if you need ctrl, shift, or alt`,
      image: `img/cewik.jpg`,
      image_title: `Cewik using his keyboard`,
      setup: () => {},
    },
    warns: {
      info: `When to show the confirmation dialog on some actions.
      Special does action depending if tabs are pinned. Multiple warns if multiple items are selected`,
      setup: () => {
        let tab_warn_opts = [
          {text: `Never`, value: `never`},
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
        App.settings_make_menu(`warn_on_close_normal_tabs`, tab_warn_opts_2)
        App.settings_make_menu(`warn_on_close_playing_tabs`, tab_warn_opts_2)
        App.settings_make_menu(`warn_on_close_unloaded_tabs`, tab_warn_opts_2)
        App.settings_make_menu(`warn_on_close_duplicate_tabs`, tab_warn_opts_2)
        App.settings_make_menu(`warn_on_close_visible_tabs`, tab_warn_opts_2)
        App.settings_make_menu(`warn_on_duplicate_tabs`, tab_warn_opts_2)
        App.settings_make_menu(`warn_on_open`, tab_warn_opts_2)
        App.settings_make_menu(`warn_on_remove_profiles`, tab_warn_opts_2)
        App.settings_make_menu(`warn_on_bookmark`, tab_warn_opts_2)
        App.settings_make_menu(`warn_on_load_tabs`, tab_warn_opts_2)
        App.settings_make_menu(`warn_on_mute_tabs`, tab_warn_opts_2)
        App.settings_make_menu(`warn_on_unmute_tabs`, tab_warn_opts_2)
        App.settings_make_menu(`warn_on_color`, tab_warn_opts_2)
        App.settings_make_menu(`warn_on_remove_color`, tab_warn_opts_2)
      },
    },
    filter: {
      info: `Adjust the filter and search`,
      setup: () => {},
    },
    more: {
      info: `More advanced settings`,
      setup: () => {
        App.settings_make_menu(`hover_effect`, App.effects)
        App.settings_make_menu(`selected_effect`, App.effects)
        App.settings_make_menu(`double_click_command`, App.cmdlist)
      },
    },
  }
}