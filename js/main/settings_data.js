App.build_settings = () => {
  // Setting Properties
  // ###################

  let props = {}

  // ###################
  let category = `general`

  props.wrap_text = {
    value: false,
    category: category,
    type: `checkbox`,
    name: `Wrap Text`,
    info: `Allow long lines to wrap`,
    version: 1,
  }

  props.font_size = {
    value: 16,
    category: category,
    type: `number`,
    name: `Font Size`,
    placeholder: `Px`,
    min: 6,
    max: 28,
    action: `theme`,
    info: `The font size in pixels to use for text. The interface scales accordingly`,
    version: 1,
  }

  props.font = {
    value: `sans-serif`,
    category: category,
    type: `menu`,
    name: `Font`,
    info: `The font to use for text`,
    version: 1,
  }

  props.text_mode = {
    value: `title`,
    category: category,
    type: `menu`,
    name: `Text Mode`,
    info: `What to show as the text for each item`,
    version: 1,
  }

  props.item_height = {
    value: `normal`,
    category: category,
    type: `menu`,
    name: `Item Height`,
    info: `How tall each item should be`,
    version: 1,
  }

  props.item_border = {
    value: `none`,
    category: category,
    type: `menu`,
    name: `Item Border`,
    info: `Border between each item`,
    version: 2,
  }

  props.width = {
    value: 75,
    category: category,
    type: `menu`,
    name: `Width`,
    info: `Width of the popup`,
    version: 1,
  }

  props.height = {
    value: 85,
    category: category,
    type: `menu`,
    name: `Height`,
    info: `Height of the popup`,
    version: 1,
  }

  props.primary_mode = {
    value: `tabs`,
    category: category,
    type: `menu`,
    name: `Primary Mode`,
    info: `The main preferred mode. This is shown at startup`,
    version: 1,
  }

  props.auto_restore = {
    value: `1_seconds`,
    category: category,
    type: `menu`,
    name: `Auto-Restore`,
    info: `When to auto-restore after the mouse leaves the window. Or if it should restore instantly after an action.
    Restore means going back to the primary mode and clearing the filter`,
    version: 1,
  }

  props.bookmarks_folder = {
    value: `Grasshopper`,
    category: category,
    type: `text`,
    name: `Bookmarks Folder`,
    placeholder: `Folder Name`,
    no_empty: true,
    info: `Where to save bookmarks`,
    version: 1,
  }

  // ###################
  category = `theme`

  props.background_color = {
    value: App.dark_colors.background,
    category: category,
    type: `color`,
    name: `Background Color`,
    action: `theme`,
    info: `The background color`,
    version: 1,
  }

  props.text_color = {
    value: App.dark_colors.text,
    category: category,
    type: `color`,
    name: `Text Color`,
    action: `theme`,
    info: `The text color`,
    version: 1,
  }

  props.background_image = {
    value: `Background 1`,
    category: category,
    type: `text`,
    name: `Background Image`,
    action: `theme`,
    placeholder: `Image URL`,
    btns: [`pick`],
    info: `The background image. Pick from the buttons or enter a URL`,
    version: 1,
  }

  props.background_effect = {
    value: `none`,
    category: category,
    type: `menu`,
    name: `Background Effect`,
    action: `theme`,
    info: `The effect on the background image`,
    version: 1,
  }

  props.background_tiles = {
    value: `none`,
    category: category,
    type: `menu`,
    name: `Background Tiles`,
    action: `theme`,
    info: `The tile size of the background image`,
    version: 1,
  }

  // ###################
  category = `media`

  props.image_icon = {
    value: `🖼️`,
    category: category,
    type: `text_smaller`,
    name: `View Image Icon`,
    placeholder: App.icon_placeholder,
    info: `Media icon for images`,
    version: 1,
  }

  props.view_image_tabs = {
    value: `icon`,
    category: category,
    type: `menu`,
    name: `View Image (Tabs)`,
    info: `What to do when clicking on an image in tabs mode`,
    version: 1,
  }

  props.view_image_history = {
    value: `icon`,
    category: category,
    type: `menu`,
    name: `View Image (History)`,
    info: `What to do when clicking on an image in history mode`,
    version: 1,
  }

  props.view_image_bookmarks = {
    value: `icon`,
    category: category,
    type: `menu`,
    name: `View Image (Bookmarks)`,
    info: `What to do when clicking on an image in bookmarks mode`,
    version: 1,
  }

  props.view_image_closed = {
    value: `icon`,
    category: category,
    type: `menu`,
    name: `View Image (Closed)`,
    info: `What to do when clicking on an image in closed mode`,
    version: 1,
  }

  props.video_icon = {
    value: `▶️`,
    category: category,
    type: `text_smaller`,
    name: `View Video Icon`,
    placeholder: App.icon_placeholder,
    info: `Media icon for videos`,
    version: 1,
  }

  props.view_video_tabs = {
    value: `icon`,
    category: category,
    type: `menu`,
    name: `View Video (Tabs)`,
    info: `What to do when clicking on a video in tabs mode`,
    version: 1,
  }

  props.view_video_history = {
    value: `icon`,
    category: category,
    type: `menu`,
    name: `View Video (History)`,
    info: `What to do when clicking on a video in history mode`,
    version: 1,
  }

  props.view_video_bookmarks = {
    value: `icon`,
    category: category,
    type: `menu`,
    name: `View Video (Bookmarks)`,
    info: `What to do when clicking on a video in bookmarks mode`,
    version: 1,
  }

  props.view_video_closed = {
    value: `icon`,
    category: category,
    type: `menu`,
    name: `View Video (Closed)`,
    info: `What to do when clicking on a video in closed mode`,
    version: 1,
  }

  props.audio_icon = {
    value: `🎵`,
    category: category,
    type: `text_smaller`,
    name: `View Audio Icon`,
    placeholder: App.icon_placeholder,
    info: `Media icon for audio`,
    version: 1,
  }

  props.view_audio_tabs = {
    value: `icon`,
    category: category,
    type: `menu`,
    name: `View Audio (Tabs)`,
    info: `What to do when clicking on an audio in tabs mode`,
    version: 1,
  }

  props.view_audio_history = {
    value: `icon`,
    category: category,
    type: `menu`,
    name: `View Audio (History)`,
    info: `What to do when clicking on an audio in history mode`,
    version: 1,
  }

  props.view_audio_bookmarks = {
    value: `icon`,
    category: category,
    type: `menu`,
    name: `View Audio (Bookmarks)`,
    info: `What to do when clicking on an audio in bookmarks mode`,
    version: 1,
  }

  props.view_audio_closed = {
    value: `icon`,
    category: category,
    type: `menu`,
    name: `View Audio (Closed)`,
    info: `What to do when clicking on an audio in closed mode`,
    version: 1,
  }

  // ###################
  category = `icons`

  props.pin_icon = {
    value: ``,
    category: category,
    type: `text_smaller`,
    name: `Pin Icon`,
    placeholder: App.icon_placeholder,
    info: `Icon for pinned tabs`,
    version: 1,
  }

  props.normal_icon = {
    value: ``,
    category: category,
    type: `text_smaller`,
    name: `Normal Icon`,
    placeholder: App.icon_placeholder,
    info: `Icon for normal tabs`,
    version: 1,
  }

  props.playing_icon = {
    value: `🔊`,
    category: category,
    type: `text_smaller`,
    name: `Playing Icon`,
    placeholder: App.icon_placeholder,
    info: `Icons for tabs emitting audio`,
    version: 1,
  }

  props.muted_icon = {
    value: `🔇`,
    category: category,
    type: `text_smaller`,
    name: `Muted Icon`,
    placeholder: App.icon_placeholder,
    info: `Icons for muted tabs`,
    version: 1,
  }

  props.unloaded_icon = {
    value: `💤`,
    category: category,
    type: `text_smaller`,
    name: `Unloaded Icon`,
    placeholder: App.icon_placeholder,
    info: `Icons for unloaded tabs`,
    version: 1,
  }

  props.notes_icon = {
    value: `📜`,
    category: category,
    type: `text_smaller`,
    name: `Notes Icon`,
    placeholder: App.icon_placeholder,
    info: `Icon for items with notes📜`,
    version: 1,
  }

  props.close_icon = {
    value: `x`,
    category: category,
    type: `text_smaller`,
    name: `Close Icon`,
    placeholder: App.icon_placeholder,
    info: `Icon for the close buttons`,
    version: 1,
  }

  // ###################
  category = `show`

  props.show_pinline = {
    value: `normal`,
    category: category,
    type: `menu`,
    name: `Show Pinline`,
    info: `Show the widget between pinned and normal tabs`,
    version: 2,
  }

  props.show_tooltips = {
    value: true,
    category: category,
    type: `checkbox`,
    name: `Show Tooltips`,
    info: `Show tooltips when hovering items`,
    version: 1,
  }

  props.show_icons = {
    value: true,
    category: category,
    type: `checkbox`,
    name: `Show Icons`,
    info: `Show item icons`,
    version: 1,
  }

  props.show_scroller = {
    value: true,
    category: category,
    type: `checkbox`,
    name: `Show Scrollers`,
    info: `Show the scroller widget when scrolling the lists`,
    version: 1,
  }

  props.show_footer = {
    value: true,
    category: category,
    type: `checkbox`,
    name: `Show Footer`,
    info: `Show the footer at the bottom`,
    version: 1,
  }

  props.show_filter_history = {
    value: true,
    category: category,
    type: `checkbox`,
    name: `Show Filter History`,
    info: `Show the filter history when right clicking the filter`,
    version: 1,
  }

  props.show_feedback = {
    value: true,
    category: category,
    type: `checkbox`,
    name: `Show Feedback`,
    info: `Show feedback messages on certain actions`,
    version: 1,
  }

  props.show_footer_count = {
    value: true,
    category: category,
    type: `checkbox`,
    name: `Count In Footer`,
    info: `Show the item count in the footer`,
    version: 1,
  }

  props.show_scrollbars = {
    value: false,
    category: category,
    type: `checkbox`,
    name: `Show Scrollbars`,
    info: `Show the regular scrollbars. Else scrollbars are disabled`,
    version: 1,
  }

  props.reverse_scroller_percentage = {
    value: false,
    category: category,
    type: `checkbox`,
    name: `Reverse Scroller %`,
    info: `Reverse the scrolling percentage in the scroller`,
    version: 1,
  }

  props.close_icon_on_left = {
    value: false,
    category: category,
    type: `checkbox`,
    name: `Close Icon On Left`,
    info: `Put the close icon on the left side`,
    version: 1,
  }

  // ###################
  category = `gestures`

  props.gestures_enabled = {
    value: true,
    category: category,
    type: `checkbox`,
    name: `Gestures Enabled`,
    info: `Enable mouse gestures`,
    version: 1,
  }

  props.gestures_threshold = {
    value: 10,
    category: category,
    type: `menu`,
    name: `Gestures Threshold`,
    info: `How sensitive gestures are`,
    version: 1,
  }

  props.gesture_up = {
    value: `go_to_top`,
    category: category,
    type: `menu`,
    name: `Gesture Up`,
    info: `Up gesture`,
    version: 1,
  }

  props.gesture_down = {
    value: `go_to_bottom`,
    category: category,
    type: `menu`,
    name: `Gesture Down`,
    info: `Down gesture`,
    version: 1,
  }

  props.gesture_left = {
    value: `prev_mode`,
    category: category,
    type: `menu`,
    name: `Gesture Left`,
    info: `Left gesture`,
    version: 1,
  }

  props.gesture_right = {
    value: `next_mode`,
    category: category,
    type: `menu`,
    name: `Gesture Right`,
    info: `Right gesture`,
    version: 1,
  }

  props.gesture_up_and_down = {
    value: `show_all_items`,
    category: category,
    type: `menu`,
    name: `Gesture Up Down`,
    info: `Up and Down gesture`,
    version: 1,
  }

  props.gesture_left_and_right = {
    value: `filter_domain`,
    category: category,
    type: `menu`,
    name: `Gesture Left Right`,
    info: `Left and Right gesture`,
    version: 1,
  }

  // ###################
  category = `auxclick`

  props.middle_click_tabs = {
    value: `close_tabs`,
    category: category,
    type: `menu`,
    name: `Middle-Click Tabs`,
    info: `Middle-click on tab items`,
    version: 1,
  }

  props.middle_click_history = {
    value: `open_items`,
    category: category,
    type: `menu`,
    name: `Middle-Click History`,
    info: `Middle-click on history items`,
    version: 1,
  }

  props.middle_click_bookmarks = {
    value: `open_items`,
    category: category,
    type: `menu`,
    name: `Middle-Click Bookmarks`,
    info: `Middle-click on bookmark items`,
    version: 1,
  }

  props.middle_click_closed = {
    value: `open_items`,
    category: category,
    type: `menu`,
    name: `Middle-Click Closed`,
    info: `Middle-click on closed items`,
    version: 1,
  }

  props.middle_click_main_menu = {
    value: `show_primary`,
    category: category,
    type: `menu`,
    name: `Middle-Click Main Menu`,
    info: `Middle-click on the main menu`,
    version: 1,
  }

  props.middle_click_filter_menu = {
    value: `show_all_items`,
    category: category,
    type: `menu`,
    name: `Middle-Click Filter Menu`,
    info: `Middle-click on the filter menu`,
    version: 1,
  }

  props.middle_click_back_button = {
    value: `browser_back`,
    category: category,
    type: `menu`,
    name: `Middle-Click Back Button`,
    info: `Middle-click on the back button`,
    version: 1,
  }

  props.middle_click_actions_menu = {
    value: `browser_reload`,
    category: category,
    type: `menu`,
    name: `Middle-Click Actions Menu`,
    info: `Middle-click on the actions menu`,
    version: 1,
  }

  props.middle_click_footer = {
    value: `copy_item_url`,
    category: category,
    type: `menu`,
    name: `Middle-Click Footer`,
    info: `Middle-click on the footer`,
    version: 1,
  }

  props.middle_click_pinline = {
    value: `close_normal_tabs`,
    category: category,
    type: `menu`,
    name: `Middle-Click Pinline`,
    info: `Middle-click on the pinline`,
    version: 1,
  }

  props.middle_click_close_icon = {
    value: `unload_tabs`,
    category: category,
    type: `menu`,
    name: `Middle-Click Close Icon`,
    info: `Middle-click on the close buttons`,
    version: 1,
  }

  // ###################
  category = `menus`

  props.tabs_actions = {
    value: [
      { cmd: `new_tab` },
      { cmd: `sort_tabs` },
      { cmd: `reopen_tab` },
      { cmd: `show_tabs_info` },
      { cmd: `show_tab_urls` },
      { cmd: `open_tab_urls` },
      { cmd: `show_close_tabs_menu` },
    ],
    category: category,
    type: `list`,
    name: `Tab Actions`,
    info: `Tabs action menu`,
    version: 1,
  }

  props.history_actions = {
    value: [
      { cmd: `deep_search` },
      { cmd: `search_media` },
    ],
    category: category,
    type: `list`,
    name: `History Actions`,
    info: `History action menu`,
    version: 1,
  }

  props.bookmarks_actions = {
    value: [
      { cmd: `bookmark_page` },
      { cmd: `deep_search` },
      { cmd: `search_media` },
    ],
    category: category,
    type: `list`,
    name: `Bookmark Actions`,
    info: `Bookmarks action menu`,
    version: 1,
  }

  props.closed_actions = {
    value: [
      { cmd: `forget_closed` },
    ],
    category: category,
    type: `list`,
    name: `Closed Actions`,
    info: `Closed action menu`,
    version: 1,
  }

  props.extra_menu = {
    value: [],
    category: category,
    type: `list`,
    name: `Extra Menu`,
    info: `If this has items an Extra menu is shown in the item menu when right clicking items`,
    version: 4,
  }

  props.pinline_menu = {
    value: [
      { cmd: `select_pinned_tabs` },
      { cmd: `select_normal_tabs` },
    ],
    category: category,
    type: `list`,
    name: `Pinline Menu`,
    info: `Menu when clicking the pinline`,
    version: 4,
  }

  props.empty_menu = {
    value: [
      { cmd: `new_tab` },
      { cmd: `select_all_items` },
    ],
    category: category,
    type: `list`,
    name: `Empty Menu`,
    info: `Menu when right clicking empty space`,
    version: 4,
  }

  props.footer_menu = {
    value: [
      { cmd: `copy_item_url` },
      { cmd: `copy_item_title` },
    ],
    category: category,
    type: `list`,
    name: `Footer Menu`,
    info: `Menu when right clicking the footer`,
    version: 4,
  }

  // ###################
  category = `keyboard`

  props.keyboard_shortcuts = {
    value: [],
    category: category,
    type: `list`,
    name: `Keyboard Shortcuts`,
    info: `Extra keyboard shortcuts. If these are triggered the default shortcuts get ignored`,
    version: 4,
  }

  // ###################
  category = `warns`

  props.warn_on_close_tabs = {
    value: `special`,
    category: category,
    type: `menu`,
    name: `Warn On Close Tabs`,
    info: `When to warn on close tabs`,
    version: 1,
  }

  props.warn_on_unload_tabs = {
    value: `special`,
    category: category,
    type: `menu`,
    name: `Warn On Unload Tabs`,
    info: `When to warn on unload tabs`,
    version: 1,
  }

  props.warn_on_close_normal_tabs = {
    value: true,
    category: category,
    type: `checkbox`,
    name: `Warn On Close Normal`,
    info: `Warn when closing normal tabs using the close menu`,
    version: 1,
  }

  props.warn_on_close_playing_tabs = {
    value: true,
    category: category,
    type: `checkbox`,
    name: `Warn On Close Playing`,
    info: `Warn when closing playing tabs using the close menu`,
    version: 1,
  }

  props.warn_on_close_unloaded_tabs = {
    value: true,
    category: category,
    type: `checkbox`,
    name: `Warn On Close Unloaded`,
    info: `Warn when closing unloaded tabs using the close menu`,
    version: 1,
  }

  props.warn_on_close_duplicate_tabs = {
    value: true,
    category: category,
    type: `checkbox`,
    name: `Warn On Close Duplicates`,
    info: `Warn when closing duplicate tabs using the close menu`,
    version: 1,
  }

  props.warn_on_close_visible_tabs = {
    value: true,
    category: category,
    type: `checkbox`,
    name: `Warn On Close Visible`,
    info: `Warn when closing visible tabs using the close menu`,
    version: 1,
  }

  props.warn_on_duplicate_tabs = {
    value: true,
    category: category,
    type: `checkbox`,
    name: `Warn Duplicate Tabs`,
    info: `Warn when duplicating tabs`,
    version: 1,
  }

  props.warn_on_open = {
    value: true,
    category: category,
    type: `checkbox`,
    name: `Warn On Open`,
    info: `Warn when opening items`,
    version: 1,
  }

  props.warn_on_remove_profiles = {
    value: true,
    category: category,
    type: `checkbox`,
    name: `Warn On Remove Profiles`,
    info: `Warn when removing profiles`,
    version: 1,
  }

  props.warn_on_bookmark = {
    value: true,
    category: category,
    type: `checkbox`,
    name: `Warn On Bookmark`,
    info: `Warn when adding bookmarks`,
    version: 1,
  }

  props.warn_on_pin_tabs = {
    value: true,
    category: category,
    type: `checkbox`,
    name: `Warn On Pin Tabs`,
    info: `Warn when pinning tabs`,
    version: 1,
  }

  props.warn_on_unpin_tabs = {
    value: true,
    category: category,
    type: `checkbox`,
    name: `Warn On Unpin Tabs`,
    info: `Warn when unpinning tabs`,
    version: 1,
  }

  props.warn_on_load_tabs = {
    value: true,
    category: category,
    type: `checkbox`,
    name: `Warn On Load Tabs`,
    info: `Warn when loading tabs`,
    version: 1,
  }

  props.warn_on_mute_tabs = {
    value: true,
    category: category,
    type: `checkbox`,
    name: `Warn On Mute Tabs`,
    info: `Warn when muting tabs`,
    version: 1,
  }

  props.warn_on_unmute_tabs = {
    value: true,
    category: category,
    type: `checkbox`,
    name: `Warn On Unmute Tabs`,
    info: `Warn when unmuting tabs`,
    version: 1,
  }

  props.warn_on_color = {
    value: false,
    category: category,
    type: `checkbox`,
    name: `Warn On Color`,
    info: `Warn when changing colors`,
    version: 1,
  }

  props.warn_on_remove_color = {
    value: false,
    category: category,
    type: `checkbox`,
    name: `Warn On Remove Color`,
    info: `Warn when removing colors`,
    version: 1,
  }

  // ###################
  category = `colors`

  props.color_mode = {
    value: `border_icon`,
    category: category,
    type: `menu`,
    name: `Color Mode`,
    info: `What color mode to use`,
    version: 2,
  }

  props.color_red = {
    value: `rgb(172,
      59,
      59)`,
    category: category,
    type: `color`,
    name: `Color Red`,
    info: `Color an item red`,
    version: 1,
  }

  props.color_green = {
    value: `rgb(45,
      115,
      45)`,
    category: category,
    type: `color`,
    name: `Color Green`,
    info: `Color an item green`,
    version: 1,
  }

  props.color_blue = {
    value: `rgb(59,
      59,
      147)`,
    category: category,
    type: `color`,
    name: `Color Blue`,
    info: `Color an item blue`,
    version: 1,
  }

  props.color_yellow = {
    value: `rgb(200,
      200,
      88)`,
    category: category,
    type: `color`,
    name: `Color Yellow`,
    info: `Color an item yellow`,
    version: 1,
  }

  props.color_purple = {
    value: `rgb(124,
      35,
      166)`,
    category: category,
    type: `color`,
    name: `Color Purple`,
    info: `Color an item purple`,
    version: 1,
  }

  props.color_orange = {
    value: `rgb(189,
      144,
      74)`,
    category: category,
    type: `color`,
    name: `Color Orange`,
    info: `Color an item orange`,
    version: 1,
  }

  // ###################
  category = `more`

  props.aliases = {
    value: [],
    category: category,
    type: `list`,
    name: `Aliases`,
    info: `Aliases to use when filtering items`,
    version: 3,
  }

  props.custom_filters = {
    value: [
      { filter: `re: (today|$day)` },
      { filter: `re: ($month|$year)` },
    ],
    category: category,
    type: `list`,
    name: `Custom Filters`,
    info: `Pre-made filters to use. These appear in the Custom section`,
    version: 3,
  }

  props.hover_effect = {
    value: `glow`,
    category: category,
    type: `menu`,
    name: `Hover Effect`,
    info: `What effect to use when hoving items`,
    version: 1,
  }

  props.selected_effect = {
    value: `background`,
    category: category,
    type: `menu`,
    name: `Selected Effect`,
    info: `What effect to use on selected items`,
    version: 1,
  }

  props.double_click_command = {
    value: `none`,
    category: category,
    type: `menu`,
    name: `Double Click Command`,
    info: `What command to perform when double clicking an item`,
    version: 1,
  }

  props.icon_pick = {
    value: false,
    category: category,
    type: `checkbox`,
    name: `Icon Pick`,
    info: `Clicking the the icons selects items`,
    version: 1,
  }

  props.lock_drag = {
    value: false,
    category: category,
    type: `checkbox`,
    name: `Lock Drag`,
    info: `Require holding Ctrl to re-order tab items`,
    version: 1,
  }

  props.single_new_tab = {
    value: true,
    category: category,
    type: `checkbox`,
    name: `Single New Tab`,
    info: `Keep only one new tab at any time`,
    version: 1,
  }

  props.close_on_focus = {
    value: true,
    category: category,
    type: `checkbox`,
    name: `Close On Focus`,
    info: `Close the popup when focusing a tab`,
    version: 1,
  }

  props.close_on_open = {
    value: true,
    category: category,
    type: `checkbox`,
    name: `Close On Open`,
    info: `Close the popup when opening a popup`,
    version: 1,
  }

  props.case_insensitive = {
    value: true,
    category: category,
    type: `checkbox`,
    name: `Case Insensitive`,
    info: `Make the filter case insensitive`,
    version: 1,
  }

  props.mute_click = {
    value: true,
    category: category,
    type: `checkbox`,
    name: `Mute Click`,
    info: `Un-Mute tabs when clicking on the mute icon`,
    version: 1,
  }

  props.notes_click = {
    value: true,
    category: category,
    type: `checkbox`,
    name: `Notes Click`,
    info: `Show notes when clicking the notes icon`,
    version: 1,
  }

  props.double_click_new = {
    value: true,
    category: category,
    type: `checkbox`,
    name: `Double Click New`,
    info: `Open a new tab when double clicking empty space`,
    version: 1,
  }

  props.rounded_corners = {
    value: true,
    category: category,
    type: `checkbox`,
    name: `Rounded Corners`,
    info: `Allow rounded corners in some parts of the interface`,
    version: 1,
  }

  props.direct_settings = {
    value: true,
    category: category,
    type: `checkbox`,
    name: `Direct Settings`,
    info: `Go straight to General when clicking Settings. Else show a menu to pick a category`,
    version: 1,
  }

  props.sort_commands = {
    value: true,
    category: category,
    type: `checkbox`,
    name: `Sort Commands`,
    info: `Sort commands in the palette by recent use`,
    version: 1,
  }

  props.all_bookmarks = {
    value: true,
    category: category,
    type: `checkbox`,
    name: `All Bookmarks`,
    info: `Show other bookmarks apart from the configured bookmarks folder`,
    version: 1,
  }

  props.reuse_filter = {
    value: true,
    category: category,
    type: `checkbox`,
    name: `Re-Use Filter`,
    info: `Re-use the filter when moving across modes`,
    version: 1,
  }

  props.max_search_items = {
    value: 500,
    category: category,
    type: `number`,
    name: `Max Search Items`,
    placeholder: `Number`,
    min: 1,
    max: 99999,
    info: `Max items to return on search modes like history and bookmarks`,
    version: 1,
  }

  props.deep_max_search_items = {
    value: 5000,
    category: category,
    type: `number`,
    name: `Deep Max Search Items`,
    placeholder: `Number`,
    min: 1,
    max: 99999,
    info: `Max search items to return in deep mode (more items)`,
    version: 1,
  }

  props.history_max_months = {
    value: 18,
    category: category,
    type: `number`,
    name: `History Max Months`,
    placeholder: `Number`,
    min: 1,
    max: 9999,
    info: `How many months back to consider when searching history`,
    version: 1,
  }

  props.deep_history_max_months = {
    value: 54,
    category: category,
    type: `number`,
    name: `Deep History Max Months`,
    placeholder: `Number`,
    min: 1,
    max: 9999,
    info: `How many months back to consider when searching history in deep mode (more months)`,
    version: 1,
  }

  props.filter_delay = {
    value: 50,
    category: category,
    type: `number`,
    name: `Filter Delay`,
    action: `filter_debouncers`,
    placeholder: `Number`,
    min: 1,
    max: 9999,
    info: `The filter delay on instant modes like tabs and closed`,
    version: 1,
  }

  props.filter_delay_search = {
    value: 225,
    category: category,
    type: `number`,
    name: `Filter Delay (Search)`,
    action: `filter_debouncers`,
    placeholder: `Number`,
    min: 1,
    max: 9999,
    info: `The filter delay on search modes like history and bookmarks`,
    version: 1,
  }

  props.debug_mode = {
    value: false,
    category: category,
    type: `checkbox`,
    name: `Debug Mode`,
    info: `Enable some data for developers`,
    version: 1,
  }

  App.setting_props = props

  // Category Properties
  // ###################

  let catprops = {}

  catprops.general = {
    info: `This is the main settings window with some general settings. There are various categories.
          Clicking the labels shows menus. Use the top buttons to navigate and save/load data`,
    setup: () => {
      App.settings_make_menu(`text_mode`, [
        { text: `Title`, value: `title` },
        { text: `URL`, value: `url` },
        { text: `Title / URL`, value: `title_url` },
        { text: `URL / Title`, value: `url_title` },
      ])

      App.settings_make_menu(`font`, [
        { text: `Sans`, value: `sans-serif` },
        { text: `Serif`, value: `serif` },
        { text: `Mono`, value: `monospace` },
        { text: `Cursive`, value: `cursive` },
      ], () => {
        App.apply_theme()
      })

      App.settings_make_menu(`auto_restore`, [
        { text: `Never`, value: `never` },
        { text: `1 Second`, value: `1_seconds` },
        { text: `5 Seconds`, value: `5_seconds` },
        { text: `10 Seconds`, value: `10_seconds` },
        { text: `30 Seconds`, value: `30_seconds` },
        { text: `On Action`, value: `action` },
      ], () => {
        clearTimeout(App.restore_timeout)
      })

      App.settings_make_menu(`item_height`, [
        { text: `Tiny`, value: `tiny` },
        { text: `Compact`, value: `compact` },
        { text: `Normal`, value: `normal` },
        { text: `Bigger`, value: `bigger` },
        { text: `Huge`, value: `huge` },
      ])

      App.settings_make_menu(`item_border`, [
        { text: `None`, value: `none` },
        { text: `Normal`, value: `normal` },
        { text: `Bigger`, value: `bigger` },
        { text: `Huge`, value: `huge` },
      ])

      App.settings_make_menu(`primary_mode`, [
        { text: `Tabs`, value: `tabs` },
        { text: `History`, value: `history` },
        { text: `Bookmarks`, value: `bookmarks` },
        { text: `Closed`, value: `closed` },
      ])

      App.settings_make_menu(`width`, App.get_size_options(), () => {
        App.apply_theme()
      })

      App.settings_make_menu(`height`, App.get_size_options(), () => {
        App.apply_theme()
      })
    },
  }

  catprops.theme = {
    info: `Here you can change the color theme and background image. Colors can be randomized. The background image can have an effect and/or tile mode`,
    setup: () => {
      App.start_color_picker(`background_color`)
      App.start_color_picker(`text_color`)

      App.settings_make_menu(`background_effect`, App.background_effects, () => {
        App.apply_theme()
      })

      App.settings_make_menu(`background_tiles`, [
        { text: `None`, value: `none` },
        { text: `50px`, value: `50px` },
        { text: `100px`, value: `100px` },
        { text: `150px`, value: `150px` },
        { text: `200px`, value: `200px` },
        { text: `250px`, value: `250px` },
        { text: `300px`, value: `300px` },
        { text: `350px`, value: `350px` },
        { text: `400px`, value: `400px` },
        { text: `450px`, value: `450px` },
        { text: `500px`, value: `500px` },
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

  catprops.colors = {
    info: `These are the colors you assign to items by editing their profiles`,
    setup: () => {
      for (let color of App.colors) {
        App.start_color_picker(`color_${color}`)
      }

      App.settings_make_menu(`color_mode`, [
        { text: `None`, value: `none` },
        { text: `Icon`, value: `icon` },
        { text: `Icon 2`, value: `icon_2` },
        { text: `Border`, value: `border` },
        { text: `Border & Icon`, value: `border_icon` },
        { text: `Border & Icon 2`, value: `border_icon_2` },
      ])
    },
  }

  catprops.media = {
    info: `How to view media items. An icon appears to the left of items. You can make it view media when clicking the icons, the whole item, or never`,
    setup: () => {
      let opts = [
        { text: `Never`, value: `never` },
        { text: `On Icon Click`, value: `icon` },
        { text: `On Item Click`, value: `item` },
      ]

      for (let m of App.modes) {
        App.settings_make_menu(`view_image_${m}`, opts)
        App.settings_make_menu(`view_video_${m}`, opts)
        App.settings_make_menu(`view_audio_${m}`, opts)
      }
    },
  }

  catprops.icons = {
    info: `Customize the icons of items. You can leave them empty`,
    setup: () => { },
  }

  catprops.show = {
    info: `Hide or show interface components. Set component behavior`,
    setup: () => {
      App.settings_make_menu(`show_pinline`, [
        { text: `Never`, value: `never` },
        { text: `Normal`, value: `normal` },
        { text: `Always`, value: `always` },
      ])
    },
  }

  catprops.gestures = {
    info: `You perform gestures by holding the middle mouse button, moving in a direction, and releasing the button`,
    setup: () => {
      DOM.ev(DOM.el(`#settings_gestures_enabled`), `change`, () => {
        App.refresh_gestures()
      })

      App.settings_make_menu(`gestures_threshold`, [
        { text: `Normal`, value: 10 },
        { text: `Less Sensitive`, value: 100 },
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

  catprops.auxclick = {
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

  catprops.menus = {
    info: `Customize context and action menus`,
    setup: () => { },
  }

  catprops.keyboard = {
    info: `You can use these custom shortcuts to run commands. You can define if you need ctrl, shift, or alt`,
    image: `img/cewik.jpg`,
    image_title: `Cewik using his keyboard`,
    setup: () => { },
  }

  catprops.warns = {
    info: `When to show the confirmation dialog on some actions`,
    setup: () => {
      App.settings_make_menu(`warn_on_close_tabs`, App.tab_warn_opts)
      App.settings_make_menu(`warn_on_unload_tabs`, App.tab_warn_opts)
    },
  }

  catprops.more = {
    info: `More advanced settings`,
    setup: () => {
      App.settings_make_menu(`hover_effect`, App.effects)
      App.settings_make_menu(`selected_effect`, App.effects)
      App.settings_make_menu(`double_click_command`, App.cmdlist)
    },
  }

  App.setting_catprops = catprops
}