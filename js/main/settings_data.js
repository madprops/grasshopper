App.build_settings = () => {
  let obj = {}

  // ###################
  let category = `general`

  obj.wrap_text = {value: false, category: category, type: `checkbox`, name: `Wrap Text`, version: 1,
  info: `Allow long lines to wrap`}

  obj.primary_mode = {value: `tabs`, category: category, type: `menu`, name: `Primary Mode`, version: 1,
  info: `The main preferred mode. This is shown at startup`}

  obj.text_mode = {value: `title`, category: category, type: `menu`, name: `Text Mode`, version: 1,
  info: `What to show as the text for each item`}

  obj.item_height = {value: `normal`, category: category, type: `menu`, name: `Item Height`, version: 1,
  info: `How tall each item should be`}

  obj.item_border = {value: `none`, category: category, type: `menu`, name: `Item Border`, version: 2,
  info: `Border between each item`}

  obj.font = {value: `sans-serif`, category: category, type: `menu`, name: `Font`, version: 1,
  info: `The font to use for text`}

  obj.font_size = {value: 16, category: category, type: `menu`, name: `Font Size`, version: 1,
  info: `The font size to use for text. The interface scales accordingly`}

  obj.width = {value: 75, category: category, type: `menu`, name: `Width`, version: 1,
  info: `Width of the popup`}

  obj.height = {value: 85, category: category, type: `menu`, name: `Height`, version: 1,
  info: `Height of the popup`}

  obj.pick_mode = {value: `none`, category: category, type: `menu`, name: `Pick Mode`, version: 1,
  info: `What pick mode to use. The picks appear on the left of items`}

  obj.auto_restore = {value: `1_seconds`, category: category, type: `menu`, name: `Auto-Restore`, version: 1,
  info: `When to auto-restore after the mouse leaves the window. Or if it should restore instantly after an action.
  Restore means going back to the primary mode and clearing the filter`}

  obj.favicon_source = {value: `none`, category: category, type: `menu`, name: `Favicon Source`, version: 1,
  info: `Where to get favicons from, on modes that don't support local favicons like history and bookmarks`}

  obj.bookmarks_folder = {value: `Grasshopper`, category: category, type: `text`,
  name: `Bookmarks Folder`, placeholder: `Folder name`, no_empty: true, version: 1,
  info: `Where to save bookmarks`}

  // ###################
  category = `theme`

  obj.background_color = {value: App.dark_colors.background, category: category, type: `color`, name: `Background Color`, action: `theme`, btns: [`random`], version: 1,
  info: `The background color`}

  obj.text_color = {value: App.dark_colors.text, category: category, type: `color`, name: `Text Color`, action: `theme`, btns: [`random`], version: 1,
  info: `The text color`}

  obj.background_image = {value: `waves.jpg`, category: category, type: `text`, name: `BG Image`,
  action: `theme`, btns: [`pick`, `next`], placeholder: `Image URL`, version: 1,
  info: `The background image`}

  obj.background_effect = {value: `none`, category: category, type: `menu`, action: `theme`, name: `Background Effect`, version: 1,
  info: `The effect on the background image`}

  obj.background_tiles = {value: `none`, category: category, type: `menu`, action: `theme`, name: `Background Tiles`, version: 1,
  info: `The tile size of the background image`}

  obj.auto_colors = {value: `never`, category: category, type: `menu`, name: `Auto Colors`, version: 3,
  info: `Change the colors automatically`}

  obj.auto_background = {value: `never`, category: category, type: `menu`, name: `Auto Background`, version: 3,
  info: `Change the background automatically`}

  obj.random_colors = {value: `dark`, category: category, type: `menu`, name: `Random Colors`, version: 1,
  info: `Behavior of random colors`}

  obj.animate_colors = {value: true, category: category, type: `checkbox`, name: `Animate Colors`, version: 1,
  info: `Animate color changes`}

  // ###################
  category = `media`

  obj.image_icon = {value: `🖼️`, category: category, type: `text_smaller`, name: `View Image Icon`, placeholder: App.smile_icon, version: 1,
  info: `Media icon for images`}

  obj.view_image_tabs = {value: `icon`, category: category, type: `menu`, name: `View Image (Tabs)`, version: 1,
  info: `What to do when clicking on an image in tabs mode`}

  obj.view_image_history = {value: `icon`, category: category, type: `menu`, name: `View Image (History)`, version: 1,
  info: `What to do when clicking on an image in history mode`}

  obj.view_image_bookmarks = {value: `icon`, category: category, type: `menu`, name: `View Image (Bookmarks)`, version: 1,
  info: `What to do when clicking on an image in bookmarks mode`}

  obj.view_image_closed = {value: `icon`, category: category, type: `menu`, name: `View Image (Closed)`, version: 1,
  info: `What to do when clicking on an image in closed mode`}

  obj.video_icon = {value: `▶️`, category: category, type: `text_smaller`, name: `View Video Icon`, placeholder: App.smile_icon, version: 1,
  info: `Media icon for videos`}

  obj.view_video_tabs = {value: `icon`, category: category, type: `menu`, name: `View Video (Tabs)`, version: 1,
  info: `What to do when clicking on a video in tabs mode`}

  obj.view_video_history = {value: `icon`, category: category, type: `menu`, name: `View Video (History)`, version: 1,
  info: `What to do when clicking on a video in history mode`}

  obj.view_video_bookmarks = {value: `icon`, category: category, type: `menu`, name: `View Video (Bookmarks)`, version: 1,
  info: `What to do when clicking on a video in bookmarks mode`}

  obj.view_video_closed = {value: `icon`, category: category, type: `menu`, name: `View Video (Closed)`, version: 1,
  info: `What to do when clicking on a video in closed mode`}

  obj.audio_icon = {value: `🎵`, category: category, type: `text_smaller`, name: `View Audio Icon`, placeholder: App.smile_icon, version: 1,
  info: `Media icon for audio`}

  obj.view_audio_tabs = {value: `icon`, category: category, type: `menu`, name: `View Audio (Tabs)`, version: 1,
  info: `What to do when clicking on an audio in tabs mode`}

  obj.view_audio_history = {value: `icon`, category: category, type: `menu`, name: `View Audio (History)`, version: 1,
  info: `What to do when clicking on an audio in history mode`}

  obj.view_audio_bookmarks = {value: `icon`, category: category, type: `menu`, name: `View Audio (Bookmarks)`, version: 1,
  info: `What to do when clicking on an audio in bookmarks mode`}

  obj.view_audio_closed = {value: `icon`, category: category, type: `menu`, name: `View Audio (Closed)`, version: 1,
  info: `What to do when clicking on an audio in closed mode`}

  // ###################
  category = `icons`

  obj.pin_icon = {value: `+`, category: category, type: `text_smaller`, name: `Pin Icon`, placeholder: App.smile_icon, version: 1,
  info: `Icon for pinned tabs`}

  obj.normal_icon = {value: ``, category: category, type: `text_smaller`, name: `Normal Icon`, placeholder: App.smile_icon, version: 1,
  info: `Icon for normal tabs`}

  obj.playing_icon = {value: `🔊`, category: category, type: `text_smaller`, name: `Playing Icon`, placeholder: App.smile_icon, version: 1,
  info: `Icons for tabs emitting audio`}

  obj.muted_icon = {value: `🔇`, category: category, type: `text_smaller`, name: `Muted Icon`, placeholder: App.smile_icon, version: 1,
  info: `Icons for muted tabs`}

  obj.unloaded_icon = {value: `💤`, category: category, type: `text_smaller`, name: `Unloaded Icon`, placeholder: App.smile_icon, version: 1,
  info: `Icons for unloaded tabs`}

  obj.close_icon = {value: `x`, category: category, type: `text_smaller`, name: `Close Icon`, placeholder: App.smile_icon, version: 1,
  info: `Icon for the close buttons`}

  obj.open_icon = {value: `🚀`, category: category, type: `text_smaller`, name: `Open Icon`, placeholder: App.smile_icon, version: 1,
  info: `Icon for the open buttons`}

  obj.pick_icon = {value: `🎯`, category: category, type: `text_smaller`, name: `Pick Icon`, placeholder: App.smile_icon, version: 1,
  info: `Icon for the picks`}

  // ###################
  category = `show`

  obj.show_pinline = {value: `normal`, category: category, type: `menu`, name: `Show Pinline`, version: 2,
  info: `Show the widget between pinned and normal tabs`}

  obj.show_scrollbars = {value: true, category: category, type: `checkbox`, name: `Show Scrollbars`, version: 1,
  info: `Show the regular scrollbars. Else scrollbars are disabled`}

  obj.show_tooltips = {value: true, category: category, type: `checkbox`, name: `Show Tooltips`, version: 1,
  info: `Show tooltips when hovering items`}

  obj.show_icons = {value: true, category: category, type: `checkbox`, name: `Show Icons`, version: 1,
  info: `Show item icons`}

  obj.show_scroller = {value: true, category: category, type: `checkbox`, name: `Show Scrollers`, version: 1,
  info: `Show the scroller widget when scrolling the lists`}

  obj.show_footer = {value: true, category: category, type: `checkbox`, name: `Show Footer`, version: 1,
  info: `Show the footer at the bottom`}

  obj.show_filter_history = {value: true, category: category, type: `checkbox`, name: `Show Filter History`, version: 1,
  info: `Show the filter history when right clicking the filter`}

  obj.show_feedback = {value: true, category: category, type: `checkbox`, name: `Show Feedback`, version: 1,
  info: `Show feedback messages on certain actions`}

  obj.show_footer_count = {value: true, category: category, type: `checkbox`, name: `Count In Footer`, version: 1,
  info: `Show the item count in the footer`}

  obj.reverse_scroller_percentage = {value: false, category: category, type: `checkbox`, name: `Reverse Scroller %`, version: 1,
  info: `Reverse the scrolling percentage in the scroller`}

  // ###################
  category = `gestures`

  obj.gestures_enabled = {value: true, category: category, type: `checkbox`, name: `Gestures Enabled`, version: 1,
  info: `Enable mouse gestures`}

  obj.gestures_threshold = {value: 10, category: category, type: `menu`, name: `Gestures Threshold`, version: 1,
  info: `How sensitive gestures are`}

  obj.gesture_up = {value: `go_to_top`, category: category, type: `menu`, name: `Gesture Up`, version: 1,
  info: `Up gesture`}

  obj.gesture_down = {value: `go_to_bottom`, category: category, type: `menu`, name: `Gesture Down`, version: 1,
  info: `Down gesture`}

  obj.gesture_left = {value: `prev_mode`, category: category, type: `menu`, name: `Gesture Left`, version: 1,
  info: `Left gesture`}

  obj.gesture_right = {value: `next_mode`, category: category, type: `menu`, name: `Gesture Right`, version: 1,
  info: `Right gesture`}

  obj.gesture_up_and_down = {value: `show_all`, category: category, type: `menu`, name: `Gesture Up Down`, version: 1,
  info: `Up and Down gesture`}

  obj.gesture_left_and_right = {value: `filter_domain`, category: category, type: `menu`, name: `Gesture Left Right`, version: 1,
  info: `Left and Right gesture`}

  // ###################
  category = `auxclick`

  obj.middle_click_tabs = {value: `close`, category: category, type: `menu`, name: `Middle-Click Tabs`, version: 1,
  info: `Middle-click on tab items`}

  obj.middle_click_history = {value: `open`, category: category, type: `menu`, name: `Middle-Click History`, version: 1,
  info: `Middle-click on history items`}

  obj.middle_click_bookmarks = {value: `open`, category: category, type: `menu`, name: `Middle-Click Bookmarks`, version: 1,
  info: `Middle-click on bookmark items`}

  obj.middle_click_closed = {value: `open`, category: category, type: `menu`, name: `Middle-Click Closed`, version: 1,
  info: `Middle-click on closed items`}

  obj.middle_click_main_menu = {value: `show_main`, category: category, type: `menu`, name: `Middle-Click Main Menu`, version: 1,
  info: `Middle-click on the main menu`}

  obj.middle_click_filter_menu = {value: `show_all`, category: category, type: `menu`, name: `Middle-Click Filter Menu`, version: 1,
  info: `Middle-click on the filter menu`}

  obj.middle_click_back_button = {value: `browser_back`, category: category, type: `menu`, name: `Middle-Click Back Button`, version: 1,
  info: `Middle-click on the back button`}

  obj.middle_click_actions_menu = {value: `browser_reload`, category: category, type: `menu`, name: `Middle-Click Actions Menu`, version: 1,
  info: `Middle-click on the actions menu`}

  obj.middle_click_footer = {value: `copy_url`, category: category, type: `menu`, name: `Middle-Click Footer`, version: 1,
  info: `Middle-click on the footer`}

  obj.middle_click_pick_button = {value: `filter_domain`, category: category, type: `menu`, name: `Middle-Click Pick Button`, version: 1,
  info: `Middle-click on the pick button`}

  obj.middle_click_close_button = {value: `unload`, category: category, type: `menu`, name: `Middle-Click Close Button`, version: 1,
  info: `Middle-click on the close buttons`}

  obj.middle_click_open_button = {value: `open`, category: category, type: `menu`, name: `Middle-Click Open Button`, version: 1,
  info: `Middle-click on the open buttons`}

  obj.middle_click_pinline = {value: `close_normal`, category: category, type: `menu`, name: `Middle-Click Pinline`, version: 1,
  info: `Middle-click on the pinline`}

  // ###################
  category = `menus`

  obj.tabs_actions = {value: [
    {cmd: `new`},
    {cmd: `sort`},
    {cmd: `reopen`},
    {cmd: `info`},
    {cmd: `show_urls`},
    {cmd: `open_urls`},
    {cmd: `close_menu`},
  ], category: category, type: `list`, name: `Tab Actions`, version: 1,
  info: `Tabs action menu`}

  obj.history_actions = {value: [
    {cmd: `deep_search`},
    {cmd: `search_media`},
  ], category: category, type: `list`, name: `History Actions`, version: 1,
  info: `History action menu`}

  obj.bookmarks_actions = {value: [
    {cmd: `bookmark_this`},
    {cmd: `deep_search`},
    {cmd: `search_media`},
  ], category: category, type: `list`, name: `Bookmark Actions`, version: 1,
  info: `Bookmarks action menu`}

  obj.closed_actions = {value: [
    {cmd: `forget_closed`},
  ], category: category, type: `list`, name: `Closed Actions`, version: 1,
  info: `Closed action menu`}

  obj.extra_menu = {value: [], category: category, type: `list`, name: `Extra Menu`, version: 4,
  info: `If this has items an Extra menu is shown in the item menu when right clicking items`}

  obj.pinline_menu = {value: [
    {cmd: `select_pins`},
    {cmd: `select_normal`},
    {cmd: `select_all`},
  ], category: category, type: `list`, name: `Pinline Menu`, version: 4,
  info: `Menu when clicking the pinline`}

  obj.empty_menu = {value: [
    {cmd: `select_all`},
    {cmd: `new`},
  ], category: category, type: `list`, name: `Empty Menu`, version: 4,
  info: `Menu when right clicking empty space`}

  obj.footer_menu = {value: [
    {cmd: `copy_url`},
    {cmd: `copy_title`},
  ], category: category, type: `list`, name: `Footer Menu`, version: 4,
  info: `Menu when right clicking the footer`}

  // ###################
  category = `keyboard`

  obj.keyboard_shortcuts = {value: [], category: category, type: `list`, name: `Keyboard Shortcuts`, version: 4,
  info: `Extra keyboard shortcuts. If these are triggered the default shortcuts get ignored`}

  // ###################
  category = `warns`

  obj.warn_on_close_tabs = {value: `special`, category: category, type: `menu`, name: `Warn On Close Tabs`, version: 1,
  info: `When to warn on close tabs`}

  obj.warn_on_unload_tabs = {value: `special`, category: category, type: `menu`, name: `Warn On Unload Tabs`, version: 1,
  info: `When to warn on unload tabs`}

  obj.warn_on_close_normal_tabs = {value: true, category: category, type: `checkbox`, name: `Warn On Close Normal`, version: 1,
  info: `Warn when closing normal tabs using the close menu`}

  obj.warn_on_close_unloaded_tabs = {value: true, category: category, type: `checkbox`, name: `Warn On Close Unloaded`, version: 1,
  info: `Warn when closing unloaded tabs using the close menu`}

  obj.warn_on_close_duplicate_tabs = {value: true, category: category, type: `checkbox`, name: `Warn On Close Duplicates`, version: 1,
  info: `Warn when closing duplicate tabs using the close menu`}

  obj.warn_on_close_visible_tabs = {value: true, category: category, type: `checkbox`, name: `Warn On Close Visible`, version: 1,
  info: `Warn when closing visible tabs using the close menu`}

  obj.warn_on_duplicate_tabs = {value: true, category: category, type: `checkbox`, name: `Warn Duplicate Tabs`, version: 1,
  info: `Warn when duplicating tabs`}

  obj.warn_on_open = {value: true, category: category, type: `checkbox`, name: `Warn On Open`, version: 1,
  info: `Warn when opening items`}

  obj.warn_on_remove_profiles = {value: true, category: category, type: `checkbox`, name: `Warn On Remove Profiles`, version: 1,
  info: `Warn when removing profiles`}

  obj.warn_on_bookmark = {value: true, category: category, type: `checkbox`, name: `Warn On Bookmark`, version: 1,
  info: `Warn when adding bookmarks`}

  obj.warn_on_color = {value: true, category: category, type: `checkbox`, name: `Warn On Color`, version: 1,
  info: `Warn when changing colors`}

  obj.warn_on_remove_color = {value: true, category: category, type: `checkbox`, name: `Warn On Remove Color`, version: 1,
  info: `Warn when removing colors`}

  obj.warn_on_pin_tabs = {value: true, category: category, type: `checkbox`, name: `Warn On Pin Tabs`, version: 1,
  info: `Warn when pinning tabs`}

  obj.warn_on_unpin_tabs = {value: true, category: category, type: `checkbox`, name: `Warn On Unpin Tabs`, version: 1,
  info: `Warn when unpinning tabs`}

  obj.warn_on_load_tabs = {value: true, category: category, type: `checkbox`, name: `Warn On Load Tabs`, version: 1,
  info: `Warn when loading tabs`}

  obj.warn_on_mute_tabs = {value: true, category: category, type: `checkbox`, name: `Warn On Mute Tabs`, version: 1,
  info: `Warn when muting tabs`}

  obj.warn_on_unmute_tabs = {value: true, category: category, type: `checkbox`, name: `Warn On Unmute Tabs`, version: 1,
  info: `Warn when unmuting tabs`}

  // ###################
  category = `colors`

  obj.color_mode = {value: `item`, category: category, type: `menu`, name: `Color Mode`, version: 1,
  info: `What color mode to use`}

  obj.color_red = {value: `rgba(172, 59, 59, 0.44)`, category: category, type: `color`, name: `Color Red`, version: 1,
  info: `Color an item red`}

  obj.color_green = {value: `rgba(45, 115, 45, 0.44)`, category: category, type: `color`, name: `Color Green`, version: 1,
  info: `Color an item green`}

  obj.color_blue = {value: `rgba(59, 59, 147, 0.44)`, category: category, type: `color`, name: `Color Blue`, version: 1,
  info: `Color an item blue`}

  obj.color_yellow = {value: `rgba(200, 200, 88, 0.44)`, category: category, type: `color`, name: `Color Yellow`, version: 1,
  info: `Color an item yellow`}

  obj.color_purple = {value: `rgba(124, 35, 166, 0.44)`, category: category, type: `color`, name: `Color Purple`, version: 1,
  info: `Color an item purple`}

  obj.color_orange = {value: `rgba(189, 144, 74, 0.44)`, category: category, type: `color`, name: `Color Orange`, version: 1,
  info: `Color an item orange`}

  // ###################
  category = `more`

  obj.aliases = {value: [], category: category, type: `list`, name: `Aliases`, version: 3,
  info: `Aliases to use when using the filter. For example, 'big' will match 'huge' if you added that`}

  obj.custom_filters = {value: [
    {filter: `re: (today | $day)`},
    {filter: `re: ($month | $year)`},
    {filter: `re: \\d{2}\\/\\d{2}\\/\\d{4}`},
    {filter: `re: (youtu|twitch)`},
  ], category: category, type: `list`, name: `Custom Filters`, version: 3,
  info: `Pre-made filters to use. These appear in the Custom section`}

  obj.hover_effect = {value: `glow`, category: category, type: `menu`, name: `Hover Effect`, version: 1,
  info: `What effect to use when hoving items`}

  obj.selected_effect = {value: `background`, category: category, type: `menu`, name: `Selected Effect`, version: 1,
  info: `What effect to use on selected items`}

  obj.double_click_command = {value: `none`, category: category, type: `menu`, name: `Double Click Command`, version: 1,
  info: `What command to perform when double clicking an item`}

  obj.lock_drag = {value: false, category: category, type: `checkbox`, name: `Lock Drag`, version: 1,
  info: `Require holding Ctrl to re-order tab items`}

  obj.single_new_tab = {value: true, category: category, type: `checkbox`, name: `Single New Tab`, version: 1,
  info: `Keep only one new tab at any time`}

  obj.close_on_focus = {value: true, category: category, type: `checkbox`, name: `Close On Focus`, version: 1,
  info: `Close the popup when focusing a tab`}

  obj.close_on_open = {value: true, category: category, type: `checkbox`, name: `Close On Open`, version: 1,
  info: `Close the popup when opening a popup`}

  obj.case_insensitive = {value: true, category: category, type: `checkbox`, name: `Case Insensitive`, version: 1,
  info: `Make the filter case insensitive`}

  obj.mute_click = {value: true, category: category, type: `checkbox`, name: `Mute Click`, version: 1,
  info: `Un-Mute tabs when clicking on the mute icon`}

  obj.double_click_new = {value: true, category: category, type: `checkbox`, name: `Double Click New`, version: 1,
  info: `Open a new tab when double clicking empty space`}

  obj.rounded_corners = {value: true, category: category, type: `checkbox`, name: `Rounded Corners`, version: 1,
  info: `Allow rounded corners in some parts of the interface`}

  obj.direct_settings = {value: true, category: category, type: `checkbox`, name: `Direct Settings`, version: 1,
  info: `Go straight to General when clicking Settings. Else show a menu to pick a category`}

  obj.smooth_scrolling = {value: true, category: category, type: `checkbox`, name: `Smooth Scrolling`, version: 1,
  info: `Allow smooth scrolling in some cases. Else it's always instant`}

  obj.sort_commands = {value: true, category: category, type: `checkbox`, name: `Sort Commands`, version: 1,
  info: `Sort commands in the palette by recent use`}

  obj.all_bookmarks = {value: true, category: category, type: `checkbox`, name: `All Bookmarks`, version: 1,
  info: `Show other bookmarks apart from the configured bookmarks folder`}

  obj.reuse_filter = {value: true, category: category, type: `checkbox`, name: `Re-Use Filter`, version: 1,
  info: `Re-use the filter when moving across modes`}

  obj.max_search_items = {value: 500, category: category, type: `number`,
  name: `Max Search Items`, placeholder: `Number`, min: 1, version: 1,
  info: `Max items to return on search modes like history and bookmarks`}

  obj.deep_max_search_items = {value: 5000, category: category, type: `number`,
  name: `Deep Max Search Items`, placeholder: `Number`, min: 1, version: 1,
  info: `Max search items to return in deep mode (more items)`}

  obj.history_max_months = {value: 18, category: category, type: `number`,
  name: `History Max Months`, placeholder: `Number`, min: 1, version: 1,
  info: `How many months back to consider when searching history`}

  obj.deep_history_max_months = {value: 54, category: category, type: `number`,
  name: `Deep History Max Months`, placeholder: `Number`, min: 1, version: 1,
  info: `How many months back to consider when searching history in deep mode (more months)`}

  obj.filter_delay = {value: 50, category: category, type: `number`,
  name: `Filter Delay`, action: `filter_debouncers`, placeholder: `Number`, min: 1, version: 1,
  info: `The filter delay on instant modes like tabs and closed`}

  obj.filter_delay_search = {value: 225, category: category, type: `number`,
  name: `Filter Delay (Search)`, action: `filter_debouncers`, placeholder: `Number`, min: 1, version: 1,
  info: `The filter delay on search modes like history and bookmarks`}

  obj.debug_mode = {value: false, category: category, type: `checkbox`, name: `Debug Mode`, version: 1,
  info: `Enable some data for developers`}

  App.setting_props = obj

  // Category data
  // ###################

  App.setting_categories = {
    general: {
      info: `There are various categories. Clicking the labels shows menus`,
    },
    theme: {
      info: `Set the colors and background image. Can also enable automatic changes`,
    },
    colors: {
      info: `These are the colors you assign to items by editing their profiles`,
    },
    media: {
      info: `How to view media items. An icon appears to the left of items. You can make it view media when clicking the icons, the whole item, or never`,
    },
    icons: {
      info: `Customize the icons of items. You can leave them empty`,
    },
    show: {
      info: `Hide or show interface components. Set component behavior`,
    },
    gestures: {
      info: `You perform gestures by holding the middle mouse button, moving in a direction, and releasing the button`,
    },
    auxclick: {
      info: `Perform actions on middle-click`,
    },
    menus: {
      info: `Customize context and action menus`,
    },
    keyboard: {
      info: `You can use these custom shortcuts to run commands. You can define if you need ctrl, shift, or alt`,
      image: `img/cewik.jpg`,
      image_title: `Cewik using his keyboard`,
    },
    warns: {
      info: `When to show the confirmation dialog on some actions`,
    },
    more: {
      info: `More advanced settings`,
    },
  }
}