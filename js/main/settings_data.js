App.build_settings = () => {
  // Setting Properties
  // ###################

  App.setting_props = {}

  // ###################
  let category = `general`

  App.setting_props.wrap_text = {
    name: `Wrap Text`,
    type: `checkbox`,
    value: false,
    info: `Allow long lines to wrap`,
    category: category,
    version: 1,
  }

  App.setting_props.font_size = {
    name: `Font Size`,
    type: `number`,
    value: 16,
    action: `theme`,
    placeholder: `Px`,
    min: 6,
    max: 28,
    info: `The font size in pixels to use for text. The interface scales accordingly`,
    category: category,
    version: 1,
  }

  App.setting_props.font = {
    name: `Font`,
    type: `menu`,
    value: `sans-serif`,
    info: `The font to use for text`,
    category: category,
    version: 1,
  }

  App.setting_props.text_mode = {
    name: `Text Mode`,
    type: `menu`,
    value: `title`,
    info: `What to show as the text for each item`,
    category: category,
    version: 1,
  }

  App.setting_props.item_height = {
    name: `Item Height`,
    type: `menu`,
    value: `normal`,
    info: `How tall each item should be`,
    category: category,
    version: 1,
  }

  App.setting_props.item_border = {
    name: `Item Border`,
    type: `menu`,
    value: `none`,
    info: `Border between each item`,
    category: category,
    version: 2,
  }

  App.setting_props.width = {
    name: `Width`,
    type: `menu`,
    value: 75,
    info: `Width of the popup`,
    category: category,
    version: 1,
  }

  App.setting_props.height = {
    name: `Height`,
    type: `menu`,
    value: 85,
    info: `Height of the popup`,
    category: category,
    version: 1,
  }

  App.setting_props.primary_mode = {
    name: `Primary Mode`,
    type: `menu`,
    value: `tabs`,
    info: `The main preferred mode. This is shown at startup`,
    category: category,
    version: 1,
  }

  App.setting_props.auto_restore = {
    name: `Auto-Restore`,
    type: `menu`,
    value: `3_seconds`,
    info: `When to auto-restore after the mouse leaves the window. Or if it should restore instantly after an action.
    Restore means going back to the primary mode and clearing the filter`,
    category: category,
    version: 1,
  }

  App.setting_props.bookmarks_folder = {
    name: `Bookmarks Folder`,
    type: `text`,
    value: `Grasshopper`,
    placeholder: `Folder Name`,
    no_empty: true,
    info: `Where to save bookmarks`,
    category: category,
    version: 1,
  }

  // ###################
  category = `theme`

  App.setting_props.background_color = {
    name: `Background Color`,
    type: `color`,
    value: App.dark_colors.background,
    action: `theme`,
    info: `The background color`,
    category: category,
    version: 1,
  }

  App.setting_props.text_color = {
    name: `Text Color`,
    type: `color`,
    value: App.dark_colors.text,
    action: `theme`,
    info: `The text color`,
    category: category,
    version: 1,
  }

  App.setting_props.background_image = {
    name: `Background Image`,
    type: `text`,
    value: `Background 1`,
    action: `theme`,
    placeholder: `Image URL`,
    btns: [`pick`],
    info: `The background image. Pick from the buttons or enter a URL`,
    category: category,
    version: 1,
  }

  App.setting_props.background_effect = {
    name: `Background Effect`,
    type: `menu`,
    value: `none`,
    action: `theme`,
    info: `The effect on the background image`,
    category: category,
    version: 1,
  }

  App.setting_props.background_tiles = {
    name: `Background Tiles`,
    type: `menu`,
    value: `none`,
    action: `theme`,
    info: `The tile size of the background image`,
    category: category,
    version: 1,
  }

  // ###################
  category = `media`

  App.setting_props.image_icon = {
    name: `View Image Icon`,
    type: `text_smaller`,
    value: `🖼️`,
    placeholder: App.icon_placeholder,
    info: `Media icon for images`,
    category: category,
    version: 1,
  }

  App.setting_props.view_image_tabs = {
    name: `View Image (Tabs)`,
    type: `menu`,
    value: `icon`,
    info: `What to do when clicking on an image in tabs mode`,
    category: category,
    version: 1,
  }

  App.setting_props.view_image_history = {
    name: `View Image (History)`,
    type: `menu`,
    value: `icon`,
    info: `What to do when clicking on an image in history mode`,
    category: category,
    version: 1,
  }

  App.setting_props.view_image_bookmarks = {
    name: `View Image (Bookmarks)`,
    type: `menu`,
    value: `icon`,
    info: `What to do when clicking on an image in bookmarks mode`,
    category: category,
    version: 1,
  }

  App.setting_props.view_image_closed = {
    name: `View Image (Closed)`,
    type: `menu`,
    value: `icon`,
    info: `What to do when clicking on an image in closed mode`,
    category: category,
    version: 1,
  }

  App.setting_props.video_icon = {
    name: `View Video Icon`,
    type: `text_smaller`,
    value: `▶️`,
    placeholder: App.icon_placeholder,
    info: `Media icon for videos`,
    category: category,
    version: 1,
  }

  App.setting_props.view_video_tabs = {
    name: `View Video (Tabs)`,
    type: `menu`,
    value: `icon`,
    info: `What to do when clicking on a video in tabs mode`,
    category: category,
    version: 1,
  }

  App.setting_props.view_video_history = {
    name: `View Video (History)`,
    type: `menu`,
    value: `icon`,
    info: `What to do when clicking on a video in history mode`,
    category: category,
    version: 1,
  }

  App.setting_props.view_video_bookmarks = {
    name: `View Video (Bookmarks)`,
    type: `menu`,
    value: `icon`,
    info: `What to do when clicking on a video in bookmarks mode`,
    category: category,
    version: 1,
  }

  App.setting_props.view_video_closed = {
    name: `View Video (Closed)`,
    type: `menu`,
    value: `icon`,
    info: `What to do when clicking on a video in closed mode`,
    category: category,
    version: 1,
  }

  App.setting_props.audio_icon = {
    name: `View Audio Icon`,
    type: `text_smaller`,
    value: `🎵`,
    placeholder: App.icon_placeholder,
    info: `Media icon for audio`,
    category: category,
    version: 1,
  }

  App.setting_props.view_audio_tabs = {
    name: `View Audio (Tabs)`,
    type: `menu`,
    value: `icon`,
    info: `What to do when clicking on an audio in tabs mode`,
    category: category,
    version: 1,
  }

  App.setting_props.view_audio_history = {
    name: `View Audio (History)`,
    type: `menu`,
    value: `icon`,
    info: `What to do when clicking on an audio in history mode`,
    category: category,
    version: 1,
  }

  App.setting_props.view_audio_bookmarks = {
    name: `View Audio (Bookmarks)`,
    type: `menu`,
    value: `icon`,
    info: `What to do when clicking on an audio in bookmarks mode`,
    category: category,
    version: 1,
  }

  App.setting_props.view_audio_closed = {
    name: `View Audio (Closed)`,
    type: `menu`,
    value: `icon`,
    info: `What to do when clicking on an audio in closed mode`,
    category: category,
    version: 1,
  }

  // ###################
  category = `icons`

  App.setting_props.pin_icon = {
    name: `Pin Icon`,
    type: `text_smaller`,
    value: ``,
    placeholder: App.icon_placeholder,
    info: `Icon for pinned tabs`,
    category: category,
    version: 1,
  }

  App.setting_props.normal_icon = {
    name: `Normal Icon`,
    type: `text_smaller`,
    value: ``,
    placeholder: App.icon_placeholder,
    info: `Icon for normal tabs`,
    category: category,
    version: 1,
  }

  App.setting_props.playing_icon = {
    name: `Playing Icon`,
    type: `text_smaller`,
    value: `🔊`,
    placeholder: App.icon_placeholder,
    info: `Icons for tabs emitting audio`,
    category: category,
    version: 1,
  }

  App.setting_props.muted_icon = {
    name: `Muted Icon`,
    type: `text_smaller`,
    value: `🔇`,
    placeholder: App.icon_placeholder,
    info: `Icons for muted tabs`,
    category: category,
    version: 1,
  }

  App.setting_props.unloaded_icon = {
    name: `Unloaded Icon`,
    type: `text_smaller`,
    value: `💤`,
    info: `Icons for unloaded tabs`,
    placeholder: App.icon_placeholder,
    category: category,
    version: 1,
  }

  App.setting_props.notes_icon = {
    name: `Notes Icon`,
    type: `text_smaller`,
    value: `📜`,
    placeholder: App.icon_placeholder,
    info: `Icon for items with notes📜`,
    category: category,
    version: 1,
  }

  App.setting_props.close_icon = {
    name: `Close Icon`,
    type: `text_smaller`,
    value: `x`,
    placeholder: App.icon_placeholder,
    info: `Icon for the close buttons`,
    category: category,
    version: 1,
  }

  // ###################
  category = `show`

  App.setting_props.show_pinline = {
    name: `Show Pinline`,
    type: `menu`,
    value: `normal`,
    info: `Show the widget between pinned and normal tabs`,
    category: category,
    version: 2,
  }

  App.setting_props.show_tooltips = {
    name: `Show Tooltips`,
    type: `checkbox`,
    value: true,
    info: `Show tooltips when hovering items`,
    category: category,
    version: 1,
  }

  App.setting_props.show_icons = {
    name: `Show Icons`,
    type: `checkbox`,
    value: true,
    info: `Show item icons`,
    category: category,
    version: 1,
  }

  App.setting_props.show_scroller = {
    name: `Show Scrollers`,
    type: `checkbox`,
    value: true,
    info: `Show the scroller widget when scrolling the lists`,
    category: category,
    version: 1,
  }

  App.setting_props.show_footer = {
    name: `Show Footer`,
    type: `checkbox`,
    value: true,
    info: `Show the footer at the bottom`,
    category: category,
    version: 1,
  }

  App.setting_props.show_filter_history = {
    name: `Show Filter History`,
    type: `checkbox`,
    value: true,
    info: `Show the filter history when right clicking the filter`,
    category: category,
    version: 1,
  }

  App.setting_props.show_feedback = {
    name: `Show Feedback`,
    type: `checkbox`,
    value: true,
    info: `Show feedback messages on certain actions`,
    category: category,
    version: 1,
  }

  App.setting_props.show_footer_count = {
    name: `Count In Footer`,
    type: `checkbox`,
    value: true,
    info: `Show the item count in the footer`,
    category: category,
    version: 1,
  }

  App.setting_props.show_scrollbars = {
    name: `Show Scrollbars`,
    type: `checkbox`,
    value: false,
    info: `Show the regular scrollbars. Else scrollbars are disabled`,
    category: category,
    version: 1,
  }

  App.setting_props.reverse_scroller_percentage = {
    name: `Reverse Scroller %`,
    type: `checkbox`,
    value: false,
    info: `Reverse the scrolling percentage in the scroller`,
    category: category,
    version: 1,
  }

  App.setting_props.close_icon_on_left = {
    name: `Close Icon On Left`,
    type: `checkbox`,
    value: false,
    info: `Put the close icon on the left side`,
    category: category,
    version: 1,
  }

  // ###################
  category = `gestures`

  App.setting_props.gestures_enabled = {
    name: `Gestures Enabled`,
    type: `checkbox`,
    value: true,
    info: `Enable mouse gestures`,
    category: category,
    version: 1,
  }

  App.setting_props.gestures_threshold = {
    name: `Gestures Threshold`,
    type: `menu`,
    value: 10,
    info: `How sensitive gestures are`,
    category: category,
    version: 1,
  }

  App.setting_props.gesture_up = {
    name: `Gesture Up`,
    type: `menu`,
    value: `go_to_top`,
    info: `Up gesture`,
    category: category,
    version: 1,
  }

  App.setting_props.gesture_down = {
    name: `Gesture Down`,
    type: `menu`,
    value: `go_to_bottom`,
    info: `Down gesture`,
    category: category,
    version: 1,
  }

  App.setting_props.gesture_left = {
    name: `Gesture Left`,
    type: `menu`,
    value: `prev_mode`,
    info: `Left gesture`,
    category: category,
    version: 1,
  }

  App.setting_props.gesture_right = {
    name: `Gesture Right`,
    type: `menu`,
    value: `next_mode`,
    info: `Right gesture`,
    category: category,
    version: 1,
  }

  App.setting_props.gesture_up_and_down = {
    name: `Gesture Up Down`,
    type: `menu`,
    value: `show_all_items`,
    info: `Up and Down gesture`,
    category: category,
    version: 1,
  }

  App.setting_props.gesture_left_and_right = {
    name: `Gesture Left Right`,
    type: `menu`,
    value: `filter_domain`,
    info: `Left and Right gesture`,
    category: category,
    version: 1,
  }

  // ###################
  category = `auxclick`

  App.setting_props.middle_click_tabs = {
    name: `Middle-Click Tabs`,
    type: `menu`,
    value: `close_tabs`,
    info: `Middle-click on tab items`,
    category: category,
    version: 1,
  }

  App.setting_props.middle_click_history = {
    name: `Middle-Click History`,
    type: `menu`,
    value: `open_items`,
    info: `Middle-click on history items`,
    category: category,
    version: 1,
  }

  App.setting_props.middle_click_bookmarks = {
    name: `Middle-Click Bookmarks`,
    type: `menu`,
    value: `open_items`,
    info: `Middle-click on bookmark items`,
    category: category,
    version: 1,
  }

  App.setting_props.middle_click_closed = {
    name: `Middle-Click Closed`,
    type: `menu`,
    value: `open_items`,
    info: `Middle-click on closed items`,
    category: category,
    version: 1,
  }

  App.setting_props.middle_click_main_menu = {
    name: `Middle-Click Main Menu`,
    type: `menu`,
    value: `show_primary`,
    info: `Middle-click on the main menu`,
    category: category,
    version: 1,
  }

  App.setting_props.middle_click_filter_menu = {
    name: `Middle-Click Filter Menu`,
    type: `menu`,
    value: `show_all_items`,
    info: `Middle-click on the filter menu`,
    category: category,
    version: 1,
  }

  App.setting_props.middle_click_back_button = {
    name: `Middle-Click Back Button`,
    type: `menu`,
    value: `browser_back`,
    info: `Middle-click on the back button`,
    category: category,
    version: 1,
  }

  App.setting_props.middle_click_actions_menu = {
    name: `Middle-Click Actions Menu`,
    type: `menu`,
    value: `browser_reload`,
    info: `Middle-click on the actions menu`,
    category: category,
    version: 1,
  }

  App.setting_props.middle_click_footer = {
    name: `Middle-Click Footer`,
    type: `menu`,
    value: `copy_item_url`,
    info: `Middle-click on the footer`,
    category: category,
    version: 1,
  }

  App.setting_props.middle_click_pinline = {
    name: `Middle-Click Pinline`,
    type: `menu`,
    value: `close_normal_tabs`,
    info: `Middle-click on the pinline`,
    category: category,
    version: 1,
  }

  App.setting_props.middle_click_close_icon = {
    name: `Middle-Click Close Icon`,
    type: `menu`,
    value: `unload_tabs`,
    info: `Middle-click on the close buttons`,
    category: category,
    version: 1,
  }

  // ###################
  category = `menus`

  App.setting_props.tabs_actions = {
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
    category: category,
    version: 1,
  }

  App.setting_props.history_actions = {
    name: `History Actions`,
    type: `list`,
    value: [
      {cmd: `deep_search`},
      {cmd: `search_media`},
    ],
    info: `History action menu`,
    category: category,
    version: 1,
  }

  App.setting_props.bookmarks_actions = {
    name: `Bookmark Actions`,
    type: `list`,
    value: [
      {cmd: `bookmark_page`},
      {cmd: `deep_search`},
      {cmd: `search_media`},
    ],
    info: `Bookmarks action menu`,
    category: category,
    version: 1,
  }

  App.setting_props.closed_actions = {
    name: `Closed Actions`,
    type: `list`,
    value: [
      {cmd: `forget_closed`},
    ],
    info: `Closed action menu`,
    category: category,
    version: 1,
  }

  App.setting_props.extra_menu = {
    name: `Extra Menu`,
    type: `list`,
    value: [],
    info: `If this has items an Extra menu is shown in the item menu when right clicking items`,
    category: category,
    version: 4,
  }

  App.setting_props.pinline_menu = {
    name: `Pinline Menu`,
    type: `list`,
    value: [
      {cmd: `select_pinned_tabs`},
      {cmd: `select_normal_tabs`},
    ],
    info: `Menu when clicking the pinline`,
    category: category,
    version: 4,
  }

  App.setting_props.empty_menu = {
    name: `Empty Menu`,
    type: `list`,
    value: [
      {cmd: `new_tab`},
      {cmd: `select_all_items`},
    ],
    info: `Menu when right clicking empty space`,
    category: category,
    version: 4,
  }

  App.setting_props.footer_menu = {
    name: `Footer Menu`,
    type: `list`,
    value: [
      {cmd: `copy_item_url`},
      {cmd: `copy_item_title`},
    ],
    info: `Menu when right clicking the footer`,
    category: category,
    version: 4,
  }

  // ###################
  category = `keyboard`

  App.setting_props.keyboard_shortcuts = {
    name: `Keyboard Shortcuts`,
    type: `list`,
    value: [],
    info: `Extra keyboard shortcuts. If these are triggered the default shortcuts get ignored`,
    category: category,
    version: 4,
  }

  // ###################
  category = `warns`

  App.setting_props.warn_on_close_tabs = {
    name: `Warn On Close Tabs`,
    type: `menu`,
    value: `special`,
    info: `When to warn on close tabs`,
    category: category,
    version: 1,
  }

  App.setting_props.warn_on_unload_tabs = {
    name: `Warn On Unload Tabs`,
    type: `menu`,
    value: `special`,
    info: `When to warn on unload tabs`,
    category: category,
    version: 1,
  }

  App.setting_props.warn_on_close_normal_tabs = {
    name: `Warn On Close Normal`,
    type: `checkbox`,
    value: true,
    info: `Warn when closing normal tabs using the close menu`,
    category: category,
    version: 1,
  }

  App.setting_props.warn_on_close_playing_tabs = {
    name: `Warn On Close Playing`,
    type: `checkbox`,
    value: true,
    info: `Warn when closing playing tabs using the close menu`,
    category: category,
    version: 1,
  }

  App.setting_props.warn_on_close_unloaded_tabs = {
    name: `Warn On Close Unloaded`,
    type: `checkbox`,
    value: true,
    info: `Warn when closing unloaded tabs using the close menu`,
    category: category,
    version: 1,
  }

  App.setting_props.warn_on_close_duplicate_tabs = {
    name: `Warn On Close Duplicates`,
    type: `checkbox`,
    value: true,
    info: `Warn when closing duplicate tabs using the close menu`,
    category: category,
    version: 1,
  }

  App.setting_props.warn_on_close_visible_tabs = {
    name: `Warn On Close Visible`,
    type: `checkbox`,
    value: true,
    info: `Warn when closing visible tabs using the close menu`,
    category: category,
    version: 1,
  }

  App.setting_props.warn_on_duplicate_tabs = {
    name: `Warn Duplicate Tabs`,
    type: `checkbox`,
    value: true,
    info: `Warn when duplicating tabs`,
    category: category,
    version: 1,
  }

  App.setting_props.warn_on_open = {
    name: `Warn On Open`,
    type: `checkbox`,
    value: true,
    info: `Warn when opening items`,
    category: category,
    version: 1,
  }

  App.setting_props.warn_on_remove_profiles = {
    name: `Warn On Remove Profiles`,
    type: `checkbox`,
    value: true,
    info: `Warn when removing profiles`,
    category: category,
    version: 1,
  }

  App.setting_props.warn_on_bookmark = {
    name: `Warn On Bookmark`,
    type: `checkbox`,
    value: true,
    info: `Warn when adding bookmarks`,
    category: category,
    version: 1,
  }

  App.setting_props.warn_on_pin_tabs = {
    name: `Warn On Pin Tabs`,
    type: `checkbox`,
    value: true,
    info: `Warn when pinning tabs`,
    category: category,
    version: 1,
  }

  App.setting_props.warn_on_unpin_tabs = {
    name: `Warn On Unpin Tabs`,
    type: `checkbox`,
    value: true,
    info: `Warn when unpinning tabs`,
    category: category,
    version: 1,
  }

  App.setting_props.warn_on_load_tabs = {
    name: `Warn On Load Tabs`,
    type: `checkbox`,
    value: true,
    info: `Warn when loading tabs`,
    category: category,
    version: 1,
  }

  App.setting_props.warn_on_mute_tabs = {
    name: `Warn On Mute Tabs`,
    type: `checkbox`,
    value: true,
    info: `Warn when muting tabs`,
    category: category,
    version: 1,
  }

  App.setting_props.warn_on_unmute_tabs = {
    name: `Warn On Unmute Tabs`,
    type: `checkbox`,
    value: true,
    info: `Warn when unmuting tabs`,
    category: category,
    version: 1,
  }

  App.setting_props.warn_on_color = {
    name: `Warn On Color`,
    type: `checkbox`,
    value: false,
    info: `Warn when changing colors`,
    category: category,
    version: 1,
  }

  App.setting_props.warn_on_remove_color = {
    name: `Warn On Remove Color`,
    type: `checkbox`,
    value: false,
    info: `Warn when removing colors`,
    category: category,
    version: 1,
  }

  // ###################
  category = `colors`

  App.setting_props.color_mode = {
    name: `Color Mode`,
    type: `menu`,
    value: `border_icon`,
    info: `What color mode to use`,
    category: category,
    version: 2,
  }

  App.setting_props.color_red = {
    name: `Color Red`,
    type: `color`,
    value: `rgb(172, 59, 59)`,
    info: `Color an item red`,
    category: category,
    version: 1,
  }

  App.setting_props.color_green = {
    name: `Color Green`,
    type: `color`,
    value: `rgb(45, 115, 45)`,
    info: `Color an item green`,
    category: category,
    version: 1,
  }

  App.setting_props.color_blue = {
    name: `Color Blue`,
    type: `color`,
    value: `rgb(59, 59, 147)`,
    info: `Color an item blue`,
    category: category,
    version: 1,
  }

  App.setting_props.color_yellow = {
    name: `Color Yellow`,
    type: `color`,
    value: `rgb(200, 200, 88)`,
    info: `Color an item yellow`,
    category: category,
    version: 1,
  }

  App.setting_props.color_purple = {
    name: `Color Purple`,
    type: `color`,
    value: `rgb(124, 35, 166)`,
    info: `Color an item purple`,
    category: category,
    version: 1,
  }

  App.setting_props.color_orange = {
    name: `Color Orange`,
    type: `color`,
    value: `rgb(189, 144, 74)`,
    info: `Color an item orange`,
    category: category,
    version: 1,
  }

  // ###################
  category = `more`

  App.setting_props.aliases = {
    name: `Aliases`,
    type: `list`,
    value: [],
    info: `Aliases to use when filtering items`,
    category: category,
    version: 3,
  }

  App.setting_props.custom_filters = {
    name: `Custom Filters`,
    type: `list`,
    value: [
      {filter: `re: (today|$day)`},
      {filter: `re: ($month|$year)`},
    ],
    info: `Pre-made filters to use. These appear in the Custom section`,
    category: category,
    version: 3,
  }

  App.setting_props.hover_effect = {
    name: `Hover Effect`,
    type: `menu`,
    value: `glow`,
    info: `What effect to use when hoving items`,
    category: category,
    version: 1,
  }

  App.setting_props.selected_effect = {
    name: `Selected Effect`,
    type: `menu`,
    value: `background`,
    info: `What effect to use on selected items`,
    category: category,
    version: 1,
  }

  App.setting_props.double_click_command = {
    name: `Double Click Command`,
    type: `menu`,
    value: `none`,
    info: `What command to perform when double clicking an item`,
    category: category,
    version: 1,
  }

  App.setting_props.icon_pick = {
    name: `Icon Pick`,
    type: `checkbox`,
    value: false,
    info: `Clicking the the icons selects items`,
    category: category,
    version: 1,
  }

  App.setting_props.lock_drag = {
    name: `Lock Drag`,
    type: `checkbox`,
    value: false,
    info: `Require holding Ctrl to re-order tab items`,
    category: category,
    version: 1,
  }

  App.setting_props.single_new_tab = {
    name: `Single New Tab`,
    type: `checkbox`,
    value: true,
    info: `Keep only one new tab at any time`,
    category: category,
    version: 1,
  }

  App.setting_props.close_on_focus = {
    name: `Close On Focus`,
    type: `checkbox`,
    value: true,
    info: `Close the popup when focusing a tab`,
    category: category,
    version: 1,
  }

  App.setting_props.close_on_open = {
    name: `Close On Open`,
    type: `checkbox`,
    value: true,
    info: `Close the popup when opening a popup`,
    category: category,
    version: 1,
  }

  App.setting_props.case_insensitive = {
    name: `Case Insensitive`,
    type: `checkbox`,
    value: true,
    info: `Make the filter case insensitive`,
    category: category,
    version: 1,
  }

  App.setting_props.mute_click = {
    name: `Mute Click`,
    type: `checkbox`,
    value: true,
    info: `Un-Mute tabs when clicking on the mute icon`,
    category: category,
    version: 1,
  }

  App.setting_props.notes_click = {
    name: `Notes Click`,
    type: `checkbox`,
    value: true,
    info: `Show notes when clicking the notes icon`,
    category: category,
    version: 1,
  }

  App.setting_props.double_click_new = {
    name: `Double Click New`,
    type: `checkbox`,
    value: true,
    info: `Open a new tab when double clicking empty space`,
    category: category,
    version: 1,
  }

  App.setting_props.rounded_corners = {
    name: `Rounded Corners`,
    type: `checkbox`,
    value: true,
    info: `Allow rounded corners in some parts of the interface`,
    category: category,
    version: 1,
  }

  App.setting_props.direct_settings = {
    name: `Direct Settings`,
    type: `checkbox`,
    value: true,
    info: `Go straight to General when clicking Settings. Else show a menu to pick a category`,
    category: category,
    version: 1,
  }

  App.setting_props.sort_commands = {
    name: `Sort Commands`,
    type: `checkbox`,
    value: true,
    info: `Sort commands in the palette by recent use`,
    category: category,
    version: 1,
  }

  App.setting_props.all_bookmarks = {
    name: `All Bookmarks`,
    type: `checkbox`,
    value: true,
    info: `Show other bookmarks apart from the configured bookmarks folder`,
    category: category,
    version: 1,
  }

  App.setting_props.reuse_filter = {
    name: `Re-Use Filter`,
    type: `checkbox`,
    value: true,
    info: `Re-use the filter when moving across modes`,
    category: category,
    version: 1,
  }

  App.setting_props.max_search_items = {
    name: `Max Search Items`,
    type: `number`,
    value: 500,
    placeholder: `Number`,
    min: 1,
    max: 99999,
    info: `Max items to return on search modes like history and bookmarks`,
    category: category,
    version: 1,
  }

  App.setting_props.deep_max_search_items = {
    name: `Deep Max Search Items`,
    type: `number`,
    value: 5000,
    placeholder: `Number`,
    min: 1,
    max: 99999,
    info: `Max search items to return in deep mode (more items)`,
    category: category,
    version: 1,
  }

  App.setting_props.history_max_months = {
    name: `History Max Months`,
    type: `number`,
    value: 18,
    placeholder: `Number`,
    min: 1,
    max: 9999,
    info: `How many months back to consider when searching history`,
    category: category,
    version: 1,
  }

  App.setting_props.deep_history_max_months = {
    name: `Deep History Max Months`,
    type: `number`,
    value: 54,
    placeholder: `Number`,
    min: 1,
    max: 9999,
    info: `How many months back to consider when searching history in deep mode (more months)`,
    category: category,
    version: 1,
  }

  App.setting_props.filter_delay = {
    name: `Filter Delay`,
    type: `number`,
    value: 50,
    action: `filter_debouncers`,
    placeholder: `Number`,
    min: 1,
    max: 9999,
    info: `The filter delay on instant modes like tabs and closed`,
    category: category,
    version: 1,
  }

  App.setting_props.filter_delay_search = {
    name: `Filter Delay (Search)`,
    type: `number`,
    value: 225,
    action: `filter_debouncers`,
    placeholder: `Number`,
    min: 1,
    max: 9999,
    info: `The filter delay on search modes like history and bookmarks`,
    category: category,
    version: 1,
  }

  App.setting_props.debug_mode = {
    name: `Debug Mode`,
    type: `checkbox`,
    value: false,
    info: `Enable some data for developers`,
    category: category,
    version: 1,
  }

  // Category Properties
  // ###################

  App.setting_catprops = {}

  App.setting_catprops.general = {
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
        {text: `Compact`, value: `compact`},
        {text: `Normal`, value: `normal`},
        {text: `Bigger`, value: `bigger`},
        {text: `Huge`, value: `huge`},
      ])

      App.settings_make_menu(`item_border`, [
        {text: `None`, value: `none`},
        {text: `Normal`, value: `normal`},
        {text: `Bigger`, value: `bigger`},
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
  }

  App.setting_catprops.theme = {
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
  }

  App.setting_catprops.colors = {
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
  }

  App.setting_catprops.media = {
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
  }

  App.setting_catprops.icons = {
    info: `Customize the icons of items. You can leave them empty`,
    setup: () => {},
  }

  App.setting_catprops.show = {
    info: `Hide or show interface components. Set component behavior`,
    setup: () => {
      App.settings_make_menu(`show_pinline`, [
        {text: `Never`, value: `never`},
        {text: `Normal`, value: `normal`},
        {text: `Always`, value: `always`},
      ])
    },
  }

  App.setting_catprops.gestures = {
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
  }

  App.setting_catprops.auxclick = {
    info: `Perform actions on middle-click`,
    setup: () => {
      for (let key in App.setting_props) {
        let props = App.setting_props[key]

        if (props.category === `auxclick`) {
          App.settings_make_menu(key, App.cmdlist)
        }
      }
    },
  }

  App.setting_catprops.menus = {
    info: `Customize context and action menus`,
    setup: () => {},
  }

  App.setting_catprops.keyboard = {
    info: `You can use these custom shortcuts to run commands. You can define if you need ctrl, shift, or alt`,
    image: `img/cewik.jpg`,
    image_title: `Cewik using his keyboard`,
    setup: () => {},
  }

  App.setting_catprops.warns = {
    info: `When to show the confirmation dialog on some actions`,
    setup: () => {
      App.settings_make_menu(`warn_on_close_tabs`, App.tab_warn_opts)
      App.settings_make_menu(`warn_on_unload_tabs`, App.tab_warn_opts)
    },
  }

  App.setting_catprops.more = {
    info: `More advanced settings`,
    setup: () => {
      App.settings_make_menu(`hover_effect`, App.effects)
      App.settings_make_menu(`selected_effect`, App.effects)
      App.settings_make_menu(`double_click_command`, App.cmdlist)
    },
  }
}