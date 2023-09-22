App.build_settings = () => {
  let props = {}

  // ###################
  let category = `general`

  props.wrap_text = {
    value: false, category: category, type: `checkbox`,
    name: `Wrap Text`, version: 1,
    info: `Allow long lines to wrap`
  }

  props.font_size = {
    value: 16, category: category, type: `number`,
    name: `Font Size`, placeholder: `px`, min: 6, max: 28, action: `theme`, version: 1,
    info: `The font size in pixels to use for text. The interface scales accordingly`
  }

  props.font = {
    value: `sans-serif`, category: category, type: `menu`,
    name: `Font`, version: 1,
    info: `The font to use for text`
  }

  props.text_mode = {
    value: `title`, category: category, type: `menu`,
    name: `Text Mode`, version: 1,
    info: `What to show as the text for each item`
  }

  props.item_height = {
    value: `normal`, category: category, type: `menu`,
    name: `Item Height`, version: 1,
    info: `How tall each item should be`
  }

  props.item_border = {
    value: `none`, category: category, type: `menu`,
    name: `Item Border`, version: 2,
    info: `Border between each item`
  }

  props.width = {
    value: 75, category: category, type: `menu`,
    name: `Width`, version: 1,
    info: `Width of the popup`
  }

  props.height = {
    value: 85, category: category, type: `menu`,
    name: `Height`, version: 1,
    info: `Height of the popup`
  }

  props.primary_mode = {
    value: `tabs`, category: category, type: `menu`,
    name: `Primary Mode`, version: 1,
    info: `The main preferred mode. This is shown at startup`
  }

  props.auto_restore = {
    value: `1_seconds`, category: category, type: `menu`,
    name: `Auto-Restore`, version: 1,
    info: `When to auto-restore after the mouse leaves the window. Or if it should restore instantly after an action.
    Restore means going back to the primary mode and clearing the filter`}

  props.bookmarks_folder = {
    value: `Grasshopper`, category: category, type: `text`,
    name: `Bookmarks Folder`, placeholder: `Folder name`, no_empty: true, version: 1,
    info: `Where to save bookmarks`
  }

  // ###################
  category = `theme`

  props.background_color = {
    value: App.dark_colors.background, category: category, type: `color`,
    name: `Background Color`, action: `theme`, version: 1,
    info: `The background color`
  }

  props.text_color = {
    value: App.dark_colors.text, category: category, type: `color`,
    name: `Text Color`, action: `theme`, version: 1,
    info: `The text color`
  }

  props.background_image = {
    value: `Background 1`, category: category, type: `text`,
    name: `Background Image`,
    action: `theme`, placeholder: `Image URL`, btns: [`pick`], version: 1,
    info: `The background image. Pick from the buttons or enter a URL`
  }

  props.background_effect = {
    value: `none`, category: category, type: `menu`,
    name: `Background Effect`, action: `theme`, version: 1,
    info: `The effect on the background image`
  }

  props.background_tiles = {
    value: `none`, category: category, type: `menu`,
    name: `Background Tiles`, action: `theme`, version: 1,
    info: `The tile size of the background image`
  }

  // ###################
  category = `media`

  props.image_icon = {
    value: `🖼️`, category: category, type: `text_smaller`,
    name: `View Image Icon`, placeholder: App.icon_placeholder, version: 1,
    info: `Media icon for images`
  }

  props.view_image_tabs = {
    value: `icon`, category: category, type: `menu`,
    name: `View Image (Tabs)`, version: 1,
    info: `What to do when clicking on an image in tabs mode`
  }

  props.view_image_history = {
    value: `icon`, category: category, type: `menu`,
    name: `View Image (History)`, version: 1,
    info: `What to do when clicking on an image in history mode`
  }

  props.view_image_bookmarks = {
    value: `icon`, category: category, type: `menu`,
    name: `View Image (Bookmarks)`, version: 1,
    info: `What to do when clicking on an image in bookmarks mode`
  }

  props.view_image_closed = {
    value: `icon`, category: category, type: `menu`,
    name: `View Image (Closed)`, version: 1,
    info: `What to do when clicking on an image in closed mode`
  }

  props.video_icon = {
    value: `▶️`, category: category, type: `text_smaller`,
    name: `View Video Icon`, placeholder: App.icon_placeholder, version: 1,
    info: `Media icon for videos`
  }

  props.view_video_tabs = {
    value: `icon`, category: category, type: `menu`,
    name: `View Video (Tabs)`, version: 1,
    info: `What to do when clicking on a video in tabs mode`
  }

  props.view_video_history = {
    value: `icon`, category: category, type: `menu`,
    name: `View Video (History)`, version: 1,
    info: `What to do when clicking on a video in history mode`
  }

  props.view_video_bookmarks = {
    value: `icon`, category: category, type: `menu`,
    name: `View Video (Bookmarks)`, version: 1,
    info: `What to do when clicking on a video in bookmarks mode`
  }

  props.view_video_closed = {
    value: `icon`, category: category, type: `menu`,
    name: `View Video (Closed)`, version: 1,
    info: `What to do when clicking on a video in closed mode`
  }

  props.audio_icon = {
    value: `🎵`, category: category, type: `text_smaller`,
    name: `View Audio Icon`, placeholder: App.icon_placeholder, version: 1,
    info: `Media icon for audio`
  }

  props.view_audio_tabs = {
    value: `icon`, category: category, type: `menu`,
    name: `View Audio (Tabs)`, version: 1,
    info: `What to do when clicking on an audio in tabs mode`
  }

  props.view_audio_history = {
    value: `icon`, category: category, type: `menu`,
    name: `View Audio (History)`, version: 1,
    info: `What to do when clicking on an audio in history mode`
  }

  props.view_audio_bookmarks = {
    value: `icon`, category: category, type: `menu`,
    name: `View Audio (Bookmarks)`, version: 1,
    info: `What to do when clicking on an audio in bookmarks mode`
  }

  props.view_audio_closed = {
    value: `icon`, category: category, type: `menu`,
    name: `View Audio (Closed)`, version: 1,
    info: `What to do when clicking on an audio in closed mode`
  }

  // ###################
  category = `icons`

  props.pin_icon = {
    value: ``, category: category, type: `text_smaller`,
    name: `Pin Icon`, placeholder: App.icon_placeholder, version: 1,
    info: `Icon for pinned tabs`
  }

  props.normal_icon = {
    value: ``, category: category, type: `text_smaller`,
    name: `Normal Icon`, placeholder: App.icon_placeholder, version: 1,
    info: `Icon for normal tabs`
  }

  props.playing_icon = {
    value: `🔊`, category: category, type: `text_smaller`,
    name: `Playing Icon`, placeholder: App.icon_placeholder, version: 1,
    info: `Icons for tabs emitting audio`
  }

  props.muted_icon = {
    value: `🔇`, category: category, type: `text_smaller`,
    name: `Muted Icon`, placeholder: App.icon_placeholder, version: 1,
    info: `Icons for muted tabs`
  }

  props.unloaded_icon = {
    value: `💤`, category: category, type: `text_smaller`,
    name: `Unloaded Icon`, placeholder: App.icon_placeholder, version: 1,
    info: `Icons for unloaded tabs`
  }

  props.notes_icon = {
    value: `📜`, category: category, type: `text_smaller`,
    name: `Notes Icon`, placeholder: App.icon_placeholder, version: 1,
    info: `Icon for items with notes📜`
  }

  props.close_icon = {
    value: `x`, category: category, type: `text_smaller`,
    name: `Close Icon`, placeholder: App.icon_placeholder, version: 1,
    info: `Icon for the close buttons`
  }

  // ###################
  category = `show`

  props.show_pinline = {
    value: `normal`, category: category, type: `menu`,
    name: `Show Pinline`, version: 2,
    info: `Show the widget between pinned and normal tabs`
  }

  props.show_tooltips = {
    value: true, category: category, type: `checkbox`,
    name: `Show Tooltips`, version: 1,
    info: `Show tooltips when hovering items`
  }

  props.show_icons = {
    value: true, category: category, type: `checkbox`,
    name: `Show Icons`, version: 1,
    info: `Show item icons`
  }

  props.show_scroller = {
    value: true, category: category, type: `checkbox`,
    name: `Show Scrollers`, version: 1,
    info: `Show the scroller widget when scrolling the lists`
  }

  props.show_footer = {
    value: true, category: category, type: `checkbox`,
    name: `Show Footer`, version: 1,
    info: `Show the footer at the bottom`
  }

  props.show_filter_history = {
    value: true, category: category, type: `checkbox`,
    name: `Show Filter History`, version: 1,
    info: `Show the filter history when right clicking the filter`
  }

  props.show_feedback = {
    value: true, category: category, type: `checkbox`,
    name: `Show Feedback`, version: 1,
    info: `Show feedback messages on certain actions`
  }

  props.show_footer_count = {
    value: true, category: category, type: `checkbox`,
    name: `Count In Footer`, version: 1,
    info: `Show the item count in the footer`
  }

  props.show_scrollbars = {
    value: false, category: category, type: `checkbox`,
    name: `Show Scrollbars`, version: 1,
    info: `Show the regular scrollbars. Else scrollbars are disabled`
  }

  props.reverse_scroller_percentage = {
    value: false, category: category, type: `checkbox`,
    name: `Reverse Scroller %`, version: 1,
    info: `Reverse the scrolling percentage in the scroller`
  }

  props.close_icon_on_left = {
    value: false, category: category, type: `checkbox`,
    name: `Close Icon On Left`, version: 1,
    info: `Put the close icon on the left side`
  }

  // ###################
  category = `gestures`

  props.gestures_enabled = {
    value: true, category: category, type: `checkbox`,
    name: `Gestures Enabled`, version: 1,
    info: `Enable mouse gestures`
  }

  props.gestures_threshold = {
    value: 10, category: category, type: `menu`,
    name: `Gestures Threshold`, version: 1,
    info: `How sensitive gestures are`
  }

  props.gesture_up = {
    value: `go_to_top`, category: category, type: `menu`,
    name: `Gesture Up`, version: 1,
    info: `Up gesture`
  }

  props.gesture_down = {
    value: `go_to_bottom`, category: category, type: `menu`,
    name: `Gesture Down`, version: 1,
    info: `Down gesture`
  }

  props.gesture_left = {
    value: `prev_mode`, category: category, type: `menu`,
    name: `Gesture Left`, version: 1,
    info: `Left gesture`
  }

  props.gesture_right = {
    value: `next_mode`, category: category, type: `menu`,
    name: `Gesture Right`, version: 1,
    info: `Right gesture`
  }

  props.gesture_up_and_down = {
    value: `show_all_items`, category: category, type: `menu`,
    name: `Gesture Up Down`, version: 1,
    info: `Up and Down gesture`
  }

  props.gesture_left_and_right = {
    value: `filter_domain`, category: category, type: `menu`,
    name: `Gesture Left Right`, version: 1,
    info: `Left and Right gesture`
  }

  // ###################
  category = `auxclick`

  props.middle_click_tabs = {
    value: `close_tabs`, category: category, type: `menu`,
    name: `Middle-Click Tabs`, version: 1,
    info: `Middle-click on tab items`
  }

  props.middle_click_history = {
    value: `open_items`, category: category, type: `menu`,
    name: `Middle-Click History`, version: 1,
    info: `Middle-click on history items`
  }

  props.middle_click_bookmarks = {
    value: `open_items`, category: category, type: `menu`,
    name: `Middle-Click Bookmarks`, version: 1,
    info: `Middle-click on bookmark items`
  }

  props.middle_click_closed = {
    value: `open_items`, category: category, type: `menu`,
    name: `Middle-Click Closed`, version: 1,
    info: `Middle-click on closed items`
  }

  props.middle_click_main_menu = {
    value: `show_primary`, category: category, type: `menu`,
    name: `Middle-Click Main Menu`, version: 1,
    info: `Middle-click on the main menu`
  }

  props.middle_click_filter_menu = {
    value: `show_all_items`, category: category, type: `menu`,
    name: `Middle-Click Filter Menu`, version: 1,
    info: `Middle-click on the filter menu`
  }

  props.middle_click_back_button = {
    value: `browser_back`, category: category, type: `menu`,
    name: `Middle-Click Back Button`, version: 1,
    info: `Middle-click on the back button`
  }

  props.middle_click_actions_menu = {
    value: `browser_reload`, category: category, type: `menu`,
    name: `Middle-Click Actions Menu`, version: 1,
    info: `Middle-click on the actions menu`
  }

  props.middle_click_footer = {
    value: `copy_item_url`, category: category, type: `menu`,
    name: `Middle-Click Footer`, version: 1,
    info: `Middle-click on the footer`
  }

  props.middle_click_pinline = {
    value: `close_normal_tabs`, category: category, type: `menu`,
    name: `Middle-Click Pinline`, version: 1,
    info: `Middle-click on the pinline`
  }

  props.middle_click_close_icon = {
    value: `unload_tabs`, category: category, type: `menu`,
    name: `Middle-Click Close Icon`, version: 1,
    info: `Middle-click on the close buttons`
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
    ], category: category, type: `list`,
    name: `Tab Actions`, version: 1,
    info: `Tabs action menu`
  }

  props.history_actions = {
    value: [
      { cmd: `deep_search` },
      { cmd: `search_media` },
    ], category: category, type: `list`,
    name: `History Actions`, version: 1,
    info: `History action menu`
  }

  props.bookmarks_actions = {
    value: [
      { cmd: `bookmark_page` },
      { cmd: `deep_search` },
      { cmd: `search_media` },
    ], category: category, type: `list`,
    name: `Bookmark Actions`, version: 1,
    info: `Bookmarks action menu`
  }

  props.closed_actions = {
    value: [
      { cmd: `forget_closed` },
    ], category: category, type: `list`,
    name: `Closed Actions`, version: 1,
    info: `Closed action menu`
  }

  props.extra_menu = {
    value: [], category: category, type: `list`,
    name: `Extra Menu`, version: 4,
    info: `If this has items an Extra menu is shown in the item menu when right clicking items`
  }

  props.pinline_menu = {
    value: [
      { cmd: `select_pinned_tabs` },
      { cmd: `select_normal_tabs` },
      { cmd: `select_all_items` },
    ], category: category, type: `list`,
    name: `Pinline Menu`, version: 4,
    info: `Menu when clicking the pinline`
  }

  props.empty_menu = {
    value: [
      { cmd: `new_tab` },
      { cmd: `select_all_items` },
    ], category: category, type: `list`,
    name: `Empty Menu`, version: 4,
    info: `Menu when right clicking empty space`
  }

  props.footer_menu = {
    value: [
      { cmd: `copy_item_url` },
      { cmd: `copy_item_title` },
    ], category: category, type: `list`,
    name: `Footer Menu`, version: 4,
    info: `Menu when right clicking the footer`
  }

  // ###################
  category = `keyboard`

  props.keyboard_shortcuts = {
    value: [], category: category, type: `list`,
    name: `Keyboard Shortcuts`, version: 4,
    info: `Extra keyboard shortcuts. If these are triggered the default shortcuts get ignored`
  }

  // ###################
  category = `warns`

  props.warn_on_close_tabs = {
    value: `special`, category: category, type: `menu`,
    name: `Warn On Close Tabs`, version: 1,
    info: `When to warn on close tabs`
  }

  props.warn_on_unload_tabs = {
    value: `special`, category: category, type: `menu`,
    name: `Warn On Unload Tabs`, version: 1,
    info: `When to warn on unload tabs`
  }

  props.warn_on_close_normal_tabs = {
    value: true, category: category, type: `checkbox`,
    name: `Warn On Close Normal`, version: 1,
    info: `Warn when closing normal tabs using the close menu`
  }

  props.warn_on_close_unloaded_tabs = {
    value: true, category: category, type: `checkbox`,
    name: `Warn On Close Unloaded`, version: 1,
    info: `Warn when closing unloaded tabs using the close menu`
  }

  props.warn_on_close_duplicate_tabs = {
    value: true, category: category, type: `checkbox`,
    name: `Warn On Close Duplicates`, version: 1,
    info: `Warn when closing duplicate tabs using the close menu`
  }

  props.warn_on_close_visible_tabs = {
    value: true, category: category, type: `checkbox`,
    name: `Warn On Close Visible`, version: 1,
    info: `Warn when closing visible tabs using the close menu`
  }

  props.warn_on_duplicate_tabs = {
    value: true, category: category, type: `checkbox`,
    name: `Warn Duplicate Tabs`, version: 1,
    info: `Warn when duplicating tabs`
  }

  props.warn_on_open = {
    value: true, category: category, type: `checkbox`,
    name: `Warn On Open`, version: 1,
    info: `Warn when opening items`
  }

  props.warn_on_remove_profiles = {
    value: true, category: category, type: `checkbox`,
    name: `Warn On Remove Profiles`, version: 1,
    info: `Warn when removing profiles`
  }

  props.warn_on_bookmark = {
    value: true, category: category, type: `checkbox`,
    name: `Warn On Bookmark`, version: 1,
    info: `Warn when adding bookmarks`
  }

  props.warn_on_pin_tabs = {
    value: true, category: category, type: `checkbox`,
    name: `Warn On Pin Tabs`, version: 1,
    info: `Warn when pinning tabs`
  }

  props.warn_on_unpin_tabs = {
    value: true, category: category, type: `checkbox`,
    name: `Warn On Unpin Tabs`, version: 1,
    info: `Warn when unpinning tabs`
  }

  props.warn_on_load_tabs = {
    value: true, category: category, type: `checkbox`,
    name: `Warn On Load Tabs`, version: 1,
    info: `Warn when loading tabs`
  }

  props.warn_on_mute_tabs = {
    value: true, category: category, type: `checkbox`,
    name: `Warn On Mute Tabs`, version: 1,
    info: `Warn when muting tabs`
  }

  props.warn_on_unmute_tabs = {
    value: true, category: category, type: `checkbox`,
    name: `Warn On Unmute Tabs`, version: 1,
    info: `Warn when unmuting tabs`
  }

  props.warn_on_color = {
    value: false, category: category, type: `checkbox`,
    name: `Warn On Color`, version: 1,
    info: `Warn when changing colors`
  }

  props.warn_on_remove_color = {
    value: false, category: category, type: `checkbox`,
    name: `Warn On Remove Color`, version: 1,
    info: `Warn when removing colors`
  }

  // ###################
  category = `colors`

  props.color_mode = {
    value: `border_icon`, category: category, type: `menu`,
    name: `Color Mode`, version: 2,
    info: `What color mode to use`
  }

  props.color_red = {
    value: `rgb(172, 59, 59)`, category: category, type: `color`,
    name: `Color Red`, version: 1,
    info: `Color an item red`
  }

  props.color_green = {
    value: `rgb(45, 115, 45)`, category: category, type: `color`,
    name: `Color Green`, version: 1,
    info: `Color an item green`
  }

  props.color_blue = {
    value: `rgb(59, 59, 147)`, category: category, type: `color`,
    name: `Color Blue`, version: 1,
    info: `Color an item blue`
  }

  props.color_yellow = {
    value: `rgb(200, 200, 88)`, category: category, type: `color`,
    name: `Color Yellow`, version: 1,
    info: `Color an item yellow`
  }

  props.color_purple = {
    value: `rgb(124, 35, 166)`, category: category, type: `color`,
    name: `Color Purple`, version: 1,
    info: `Color an item purple`
  }

  props.color_orange = {
    value: `rgb(189, 144, 74)`, category: category, type: `color`,
    name: `Color Orange`, version: 1,
    info: `Color an item orange`
  }

  // ###################
  category = `more`

  props.aliases = {
    value: [], category: category, type: `list`,
    name: `Aliases`, version: 3,
    info: `Aliases to use when using the filter. For example, 'big' will match 'huge' if you added that`
  }

  props.custom_filters = {
    value: [
      { filter: `re: (today | $day)` },
      { filter: `re: ($month | $year)` },
      { filter: `re: \\d{2}\\/\\d{2}\\/\\d{4}` },
      { filter: `re: (youtu|twitch)` },
    ], category: category, type: `list`,
    name: `Custom Filters`, version: 3,
    info: `Pre-made filters to use. These appear in the Custom section`
  }

  props.hover_effect = {
    value: `glow`, category: category, type: `menu`,
    name: `Hover Effect`, version: 1,
    info: `What effect to use when hoving items`
  }

  props.selected_effect = {
    value: `background`, category: category, type: `menu`,
    name: `Selected Effect`, version: 1,
    info: `What effect to use on selected items`
  }

  props.double_click_command = {
    value: `none`, category: category, type: `menu`,
    name: `Double Click Command`, version: 1,
    info: `What command to perform when double clicking an item`
  }

  props.icon_pick = {
    value: false, category: category, type: `checkbox`,
    name: `Icon Pick`, version: 1,
    info: `Clicking the the icons selects items`
  }

  props.lock_drag = {
    value: false, category: category, type: `checkbox`,
    name: `Lock Drag`, version: 1,
    info: `Require holding Ctrl to re-order tab items`
  }

  props.single_new_tab = {
    value: true, category: category, type: `checkbox`,
    name: `Single New Tab`, version: 1,
    info: `Keep only one new tab at any time`
  }

  props.close_on_focus = {
    value: true, category: category, type: `checkbox`,
    name: `Close On Focus`, version: 1,
    info: `Close the popup when focusing a tab`
  }

  props.close_on_open = {
    value: true, category: category, type: `checkbox`,
    name: `Close On Open`, version: 1,
    info: `Close the popup when opening a popup`
  }

  props.case_insensitive = {
    value: true, category: category, type: `checkbox`,
    name: `Case Insensitive`, version: 1,
    info: `Make the filter case insensitive`
  }

  props.mute_click = {
    value: true, category: category, type: `checkbox`,
    name: `Mute Click`, version: 1,
    info: `Un-Mute tabs when clicking on the mute icon`
  }

  props.notes_click = {
    value: true, category: category, type: `checkbox`,
    name: `Notes Click`, version: 1,
    info: `Show notes when clicking the notes icon`
  }

  props.double_click_new = {
    value: true, category: category, type: `checkbox`,
    name: `Double Click New`, version: 1,
    info: `Open a new tab when double clicking empty space`
  }

  props.rounded_corners = {
    value: true, category: category, type: `checkbox`,
    name: `Rounded Corners`, version: 1,
    info: `Allow rounded corners in some parts of the interface`
  }

  props.direct_settings = {
    value: true, category: category, type: `checkbox`,
    name: `Direct Settings`, version: 1,
    info: `Go straight to General when clicking Settings. Else show a menu to pick a category`
  }

  props.sort_commands = {
    value: true, category: category, type: `checkbox`,
    name: `Sort Commands`, version: 1,
    info: `Sort commands in the palette by recent use`
  }

  props.all_bookmarks = {
    value: true, category: category, type: `checkbox`,
    name: `All Bookmarks`, version: 1,
    info: `Show other bookmarks apart from the configured bookmarks folder`
  }

  props.reuse_filter = {
    value: true, category: category, type: `checkbox`,
    name: `Re-Use Filter`, version: 1,
    info: `Re-use the filter when moving across modes`
  }

  props.max_search_items = {
    value: 500, category: category, type: `number`,
    name: `Max Search Items`, placeholder: `Number`, min: 1, max: 99999, version: 1,
    info: `Max items to return on search modes like history and bookmarks`
  }

  props.deep_max_search_items = {
    value: 5000, category: category, type: `number`,
    name: `Deep Max Search Items`, placeholder: `Number`, min: 1, max: 99999, version: 1,
    info: `Max search items to return in deep mode (more items)`
  }

  props.history_max_months = {
    value: 18, category: category, type: `number`,
    name: `History Max Months`, placeholder: `Number`, min: 1, max: 9999, version: 1,
    info: `How many months back to consider when searching history`
  }

  props.deep_history_max_months = {
    value: 54, category: category, type: `number`,
    name: `Deep History Max Months`, placeholder: `Number`, min: 1, max: 9999, version: 1,
    info: `How many months back to consider when searching history in deep mode (more months)`
  }

  props.filter_delay = {
    value: 50, category: category, type: `number`,
    name: `Filter Delay`, action: `filter_debouncers`, placeholder: `Number`, min: 1, max: 9999, version: 1,
    info: `The filter delay on instant modes like tabs and closed`
  }

  props.filter_delay_search = {
    value: 225, category: category, type: `number`,
    name: `Filter Delay (Search)`, action: `filter_debouncers`, placeholder: `Number`, min: 1, max: 9999, version: 1,
    info: `The filter delay on search modes like history and bookmarks`
  }

  props.debug_mode = {
    value: false, category: category, type: `checkbox`,
    name: `Debug Mode`, version: 1,
    info: `Enable some data for developers`
  }

  App.setting_props = props

  // Category data
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