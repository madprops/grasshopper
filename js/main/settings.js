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

  obj.auto_restore = {value: `1_seconds`, category: category, type: `menu`, name: `Auto Restore`, version: 1,
  info: `When to auto-restore after the mouse leaves the window. Or if it should restore instantly after an action.
  Restore means going back to the primary mode and clearing the filter`}

  obj.favicon_source = {value: `none`, category: category, type: `menu`, name: `Favicon Source`, version: 1,
  info: `Where to get favicons from, on modes that don't support local favicons like history and bookmarks`}

  obj.bookmarks_folder = {value: `Grasshopper`, category: category, type: `text`,
  name: `Bookmarks Folder`, placeholder: `Folder name`, version: 1,
  info: `Where to save bookmarks`}

  obj.aliases = {value: [], category: category, type: `list`, name: `Aliases`, version: 3,
  info: `Aliases to use when using the filter. For example, 'big' will match 'huge' if you added that`}

  obj.custom_filters = {value: [
    {filter: `re: (today | $day)`},
    {filter: `re: ($month | $year)`},
    {filter: `re: \\d{2}\\/\\d{2}\\/\\d{4}`},
    {filter: `re: (youtu|twitch)`},
  ], category: category, type: `list`, name: `Custom Filters`, version: 3,
  info: `Pre-made filters to use. These appear in the Custom section`}

  // ###################
  category = `theme`

  obj.background_color = {value: App.dark_colors.background, category: category, type: `color`, name: `Background Color`, action: `theme`, btns: [`random`], version: 1,
  info: `The background color`}

  obj.text_color = {value: App.dark_colors.text, category: category, type: `color`, name: `Text Color`, action: `theme`, btns: [`random`], version: 1,
  info: `The text color`}

  obj.background_image = {value: `waves.jpg`, category: category, type: `text`, name: `Background Image`,
  action: `theme`, btns: [`random`], placeholder: `Image URL`, version: 1,
  info: `The background image`}

  obj.background_pool = {value: App.backgrounds, category: category, type: `list`, name: `Pool`, btns: [`view`, `next`, `shuffle`], version: 3,
  info: `Prepared backgrounds to use, either manually or automatically`}

  obj.background_effect = {value: `none`, category: category, type: `menu`, action: `theme`, name: `Background Effect`, version: 1,
  info: `The effect on the background image`}

  obj.background_tiles = {value: `none`, category: category, type: `menu`, action: `theme`, name: `Background Tiles`, version: 1,
  info: `The tile size of the background image`}

  obj.auto_colors = {value: `never`, category: category, type: `menu`, name: `Auto Colors`, version: 3,
  info: `Change the colors automatically`}

  obj.auto_background = {value: `never`, category: category, type: `menu`, name: `Auto Background`, version: 3,
  info: `Change the background automatically`}

  obj.auto_background_mode = {value: `pool`, category: category, type: `menu`, name: `Auto Background Mode`, version: 1,
  info: `Behavior of the auto background`}

  obj.random_colors = {value: `dark`, category: category, type: `menu`, name: `Random Colors`, version: 1,
  info: `Behavior of random colors`}

  obj.animate_color = {value: true, category: category, type: `checkbox`, name: `Animate Color`, version: 1,
  info: `Animate color changes`}

  obj.animate_background = {value: true, category: category, type: `checkbox`, name: `Animate Background`, version: 1,
  info: `Animate background changes`}

  obj.random_background_gifs = {value: true, category: category, type: `checkbox`, name: `Include Gifs`, version: 1,
  info: `Consider gifs on random backgrounds`}

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

  obj.middle_click_tabs = {value: `close`, category: category, type: `menu`, name: `Middle Click Tabs`, version: 1,
  info: `Middle click on tab items`}

  obj.middle_click_history = {value: `open`, category: category, type: `menu`, name: `Middle Click History`, version: 1,
  info: `Middle click on history items`}

  obj.middle_click_bookmarks = {value: `open`, category: category, type: `menu`, name: `Middle Click Bookmarks`, version: 1,
  info: `Middle click on bookmark items`}

  obj.middle_click_closed = {value: `open`, category: category, type: `menu`, name: `Middle Click Closed`, version: 1,
  info: `Middle click on closed items`}

  obj.middle_click_main_menu = {value: `show_main`, category: category, type: `menu`, name: `Middle Click Main Menu`, version: 1,
  info: `Middle click on the main menu`}

  obj.middle_click_filter_menu = {value: `show_all`, category: category, type: `menu`, name: `Middle Click Filter Menu`, version: 1,
  info: `Middle click on the filter menu`}

  obj.middle_click_back_button = {value: `browser_back`, category: category, type: `menu`, name: `Middle Click Back Button`, version: 1,
  info: `Middle click on the back button`}

  obj.middle_click_actions_menu = {value: `browser_reload`, category: category, type: `menu`, name: `Middle Click Actions Menu`, version: 1,
  info: `Middle click on the actions menu`}

  obj.middle_click_footer = {value: `copy_url`, category: category, type: `menu`, name: `Middle Click Footer`, version: 1,
  info: `Middle click on the footer`}

  obj.middle_click_pick_button = {value: `filter_domain`, category: category, type: `menu`, name: `Middle Click Pick Button`, version: 1,
  info: `Middle click on the pick button`}

  obj.middle_click_close_button = {value: `unload`, category: category, type: `menu`, name: `Middle Click Close Button`, version: 1,
  info: `Middle click on the close buttons`}

  obj.middle_click_open_button = {value: `open`, category: category, type: `menu`, name: `Middle Click Open Button`, version: 1,
  info: `Middle click on the open buttons`}

  obj.middle_click_pinline = {value: `close_normal`, category: category, type: `menu`, name: `Middle Click Pinline`, version: 1,
  info: `Middle click on the pinline`}

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

  obj.color_red = {value: `rgba(172, 59, 59, 0.44)`, category: category, type: `color`, name: `Color Red`, version: 1,
  info: `Color an item red`}

  obj.color_green = {value: `rgba(46, 104, 46, 0.44)`, category: category, type: `color`, name: `Color Green`, version: 1,
  info: `Color an item green`}

  obj.color_blue = {value: `rgba(59, 59, 147, 0.44)`, category: category, type: `color`, name: `Color Blue`, version: 1,
  info: `Color an item blue`}

  obj.color_yellow = {value: `rgba(128, 128, 41, 0.44)`, category: category, type: `color`, name: `Color Yellow`, version: 1,
  info: `Color an item yellow`}

  obj.color_purple = {value: `rgba(124, 35, 166, 0.44)`, category: category, type: `color`, name: `Color Purple`, version: 1,
  info: `Color an item purple`}

  obj.color_orange = {value: `rgba(170, 127, 59, 0.44)`, category: category, type: `color`, name: `Color Orange`, version: 1,
  info: `Color an item orange`}

  obj.color_mode = {value: `item`, category: category, type: `menu`, name: `Color Mode`, version: 1,
  info: `What color mode to use`}

  // ###################
  category = `more`

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
  name: `Max Search Items`, placeholder: `Number`, version: 1,
  info: `Max items to return on search modes like history and bookmarks`}

  obj.deep_max_search_items = {value: 5000, category: category, type: `number`,
  name: `Deep Max Search Items`, placeholder: `Number`, version: 1,
  info: `Max search items to return in deep mode (more items)`}

  obj.history_max_months = {value: 18, category: category, type: `number`,
  name: `History Max Months`, placeholder: `Number`, version: 1,
  info: `How many months back to consider when searching history`}

  obj.deep_history_max_months = {value: 54, category: category, type: `number`,
  name: `Deep History Max Months`, placeholder: `Number`, version: 1,
  info: `How many months back to consider when searching history in deep mode (more months)`}

  obj.filter_delay = {value: 50, category: category, type: `number`,
  name: `Filter Delay`, action: `filter_debouncers`, placeholder: `Number`, version: 1,
  info: `The filter delay on instant modes like tabs and closed`}

  obj.filter_delay_search = {value: 225, category: category, type: `number`,
  name: `Filter Delay (Search)`, action: `filter_debouncers`, placeholder: `Number`, version: 1,
  info: `The filter delay on search modes like history and bookmarks`}

  obj.debug_mode = {value: false, category: category, type: `checkbox`, name: `Debug Mode`, version: 1,
  info: `Enable some data for developers`}

  App.settings_props = obj
}

App.settings_do_action = (what) => {
  if (what === `theme`) {
    App.apply_theme_2()
  }
  else if (what === `filter_debouncers`) {
    App.start_filter_debouncers()
  }
}

App.get_settings_label = (setting) => {
  let item = DOM.el(`#settings_${setting}`)
  let container = item.closest(`.settings_item`)
  let label = DOM.el(`.settings_label`, container)
  return label
}

App.settings_setup_labels = (category) => {
  function proc (item, btns) {
    let bc = DOM.create(`div`, `flex_row_center gap_1`)
    let cls = `action underline`

    for (let btn of btns) {
      let c = DOM.create(`div`, `flex_row_center gap_1`)
      let d = DOM.create(`div`)
      d.textContent = `|`
      let a = DOM.create(`div`, cls)
      a.id = btn[0]
      a.textContent = btn[1]
      c.append(d)
      c.append(a)
      bc.append(c)
    }

    item.before(bc)
    bc.prepend(item)
  }

  for (let key in App.settings_props) {
    let props = App.settings_props[key]

    if ((props.category === category) && props.btns) {
      let btns = []

      if (props.btns.includes(`random`)) {
        btns.push([`settings_${key}_random`, App.random_text])
      }

      if (props.btns.includes(`view`)) {
        btns.push([`settings_${key}_view`, `View`])
      }

      if (props.btns.includes(`next`)) {
        btns.push([`settings_${key}_next`, `Next`])
      }

      if (props.btns.includes(`shuffle`)) {
        btns.push([`settings_${key}_shuffle`, `Shuffle`])
      }

      if (btns.length) {
        proc(DOM.el(`#settings_label_${key}`), btns)
      }
    }
  }
}

App.settings_setup_checkboxes = (category) => {
  for (let key in App.settings_props) {
    let props = App.settings_props[key]

    if ((props.category === category) && props.type === `checkbox`) {
      let el = DOM.el(`#settings_${key}`)
      el.checked = App.get_setting(key)

      DOM.ev(el, `change`, () => {
        App.set_setting(key, el.checked)
      })

      DOM.evs(App.get_settings_label(key), [`click`, `contextmenu`], (e) => {
        App.settings_label_menu(e,
        [
          {
            name: `Reset`, action: () => {
              let force = App.check_setting_default(key)

              App.show_confirm(`Reset setting?`, () => {
                App.set_default_setting(key)
                el.checked = App.get_setting(key)
              }, undefined, force)
            }
          },
        ])
      })
    }
  }
}

App.settings_setup_text = (category) => {
  for (let key in App.settings_props) {
    let props = App.settings_props[key]

    if (props.category !== category) {
      continue
    }

    if (props.type !== `text` && props.type !== `text_smaller`) {
      continue
    }

    let el = DOM.el(`#settings_${key}`)
    let value = App.get_setting(key)
    el.value = value

    DOM.ev(el, `change`, () => {
      App.scroll_to_top(el)
      App.do_save_text_setting(key, el)
    })

    let menu = [
      {
        name: `Reset`,  action: () => {
          let force = App.check_setting_default(key)

          App.show_confirm(`Reset setting?`, () => {
            App.set_default_setting(key)
            el.value = App.get_setting(key)
            App.scroll_to_top(el)
          }, undefined, force)
        },
      },
      {
        name: `Clear`,  action: () => {
          if (el.value === ``) {
            return
          }

          App.show_confirm(`Clear setting?`, () => {
            el.value = ``
            App.set_setting(key, ``)
            el.focus()
          })
        },
      },
      {
        name: `Copy`,  action: () => {
          if (el.value === ``) {
            return
          }

          App.copy_to_clipboard(el.value)
        },
      },
    ]

    DOM.evs(App.get_settings_label(key), [`click`, `contextmenu`], (e) => {
      App.settings_label_menu(e, menu)
    })
  }
}

App.settings_setup_number = (category) => {
  for (let key in App.settings_props) {
    let props = App.settings_props[key]

    if (props.category !== category) {
      continue
    }

    if (props.type !== `number`) {
      continue
    }

    let el = DOM.el(`#settings_${key}`)
    let value = App.get_setting(key)
    el.value = value

    DOM.ev(el, `change`, () => {
      let value = parseInt(el.value)

      if (el.min) {
        let min = parseInt(el.min)

        if (value < min) {
          value = min
          el.value = value
        }
      }

      if (isNaN(value)) {
        return
      }

      App.set_setting(key, value)
    })

    let menu = [
      {
        name: `Reset`,  action: () => {
          let force = App.check_setting_default(key)

          App.show_confirm(`Reset setting?`, () => {
            App.set_default_setting(key)
            let value = App.get_setting(key)
            el.value = value
          }, undefined, force)
        },
      },
      {
        name: `Copy`,  action: () => {
          if (el.value === ``) {
            return
          }

          App.copy_to_clipboard(el.value)
        },
      },
    ]

    DOM.evs(App.get_settings_label(key), [`click`, `contextmenu`], (e) => {
      App.settings_label_menu(e, menu)
    })
  }
}

App.add_settings_addlist = (category) => {
  for (let key in App.settings_props) {
    let props = App.settings_props[key]

    if (props.category === category) {
      if (props.type !== `list`) {
        continue
      }

      App.addlist_add_buttons(`settings_${key}`)

      let menu = [
        {
          name: `Reset`,  action: () => {
            let force = App.check_setting_default(key)

            App.show_confirm(`Reset setting?`, () => {
              App.set_default_setting(key)
            }, undefined, force)
          },
        },
      ]

      DOM.evs(App.get_settings_label(key), [`click`, `contextmenu`], (e) => {
        App.settings_label_menu(e, menu)
      })
    }
  }
}

App.settings_make_menu = (setting, opts, action = () => {}) => {
  let no_wrap = [`font_size`, `width`, `height`]

  App[`settings_menubutton_${setting}`] = App.create_menubutton({
    opts: opts,
    button: DOM.el(`#settings_${setting}`),
    selected: App.get_setting(setting),
    wrap: !no_wrap.includes(setting),
    on_change: (args, opt) => {
      App.set_setting(setting, opt.value)
      action()
    },
  })

  DOM.evs(App.get_settings_label(setting), [`click`, `contextmenu`], (e) => {
    App.settings_label_menu(e,
    [
      {
        name: `Reset`, action: () => {
          let force = App.check_setting_default(setting)

          App.show_confirm(`Reset setting?`, () => {
            App.set_default_setting(setting)
            App.set_settings_menu(setting)
            action()
          }, undefined, force)
        }
      },
    ])
  })
}

App.add_settings_filter = (category) => {
  let container = DOM.el(`#settings_${category}_container`)
  let filter = DOM.create(`input`, `settings_filter text small_filter`, `settings_${category}_filter`)
  filter.type = `text`
  filter.autocomplete = `off`
  filter.spellcheck = false
  let s = ``

  if (App.get_setting(`debug_mode`)) {
    let items = DOM.els(`.settings_item`, container)
    s = ` (${items.length})`
  }

  filter.placeholder = `Filter${s}`
  container.prepend(filter)
}

App.filter_settings_debouncer = App.create_debouncer(() => {
  App.do_filter_settings()
}, App.filter_delay_2)

App.filter_settings = () => {
  App.filter_settings_debouncer.call()
}

App.do_filter_settings = () => {
  App.filter_settings_debouncer.cancel()
  App.do_filter_2(`settings_${App.settings_category}`)
}

App.clear_settings_filter = () => {
  if (App.settings_filter_focused()) {
    let mode = `settings_${App.settings_category}`

    if (App.filter_has_value(mode)) {
      App.set_filter(mode, ``)
    }
    else {
      App.hide_window()
    }
  }
}

App.settings_filter_focused = () => {
  return document.activeElement.classList.contains(`settings_filter`)
}

App.setup_settings = () => {
  App.settings_categories = [`general`, `theme`, `media`, `icons`, `show`, `gestures`, `auxclick`, `menus`, `keyboard`, `warns`, `colors`, `more`]

  let common = {
    persistent: false,
    colored_top: true,
    after_show: () => {
      DOM.el(`#settings_${App.settings_category}_filter`).focus()
    },
    on_hide: async () => {
      App.apply_theme_2()
      App.clear_show()
    },
  }

  function prepare (category) {
    App.fill_settings(category)
    App.settings_setup_checkboxes(category)
    App.settings_setup_text(category)
    App.settings_setup_number(category)
    App.add_settings_addlist(category)
    App.settings_setup_labels(category)
    App.add_settings_switchers(category)
    App.add_settings_filter(category)
    let container = DOM.el(`#settings_${category}_container`)
    container.classList.add(`filter_container`)

    for (let el of DOM.els(`.settings_item`, container)) {
      el.classList.add(`filter_item`)
    }

    for (let el of DOM.els(`.settings_label`, container)) {
      el.classList.add(`filter_text`)
      el.classList.add(`action`)
    }
  }

  App.create_window(Object.assign({}, common, {id: `settings_general`, setup: () => {
    prepare(`general`)

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
      App.apply_theme_2()
    })

    App.settings_make_menu(`auto_restore`, [
      {text: `Never`, value: `never`},
      {text: `1 Second`, value: `1_seconds`},
      {text: `5 Seconds`, value: `5_seconds`},
      {text: `10 Seconds`, value: `10_seconds`},
      {text: `30 Seconds`, value: `30_seconds`},
      {text: `On Action`, value: `action`},
    ], () => {
      clearTimeout(App.restore_timeout)
    })

    App.settings_make_menu(`font_size`, App.get_font_size_options(), () => {
      App.apply_theme_2()
    })

    App.settings_make_menu(`item_height`, [
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

    App.settings_make_menu(`pick_mode`, [
      {text: `None`, value: `none`},
      {text: `Smart`, value: `smart`},
      {text: `Single`, value: `single`},
      {text: `Simple`, value: `simple`},
    ])

    App.settings_make_menu(`favicon_source`, [
      {text: `None`, value: `none`},
      {text: `Google`, value: `google`},
      {text: `4get`, value: `4get`},
    ])

    App.settings_make_menu(`primary_mode`, [
      {text: `Tabs`, value: `tabs`},
      {text: `History`, value: `history`},
      {text: `Bookmarks`, value: `bookmarks`},
      {text: `Closed`, value: `closed`},
    ])

    App.settings_make_menu(`width`, App.get_size_options(), () => {
      App.apply_theme_2()
    })

    App.settings_make_menu(`height`, App.get_size_options(), () => {
      App.apply_theme_2()
    })
  }}))

  App.create_window(Object.assign({}, common, {id: `settings_theme`, setup: () => {
    prepare(`theme`)
    App.start_theme_settings()
  }}))

  App.create_window(Object.assign({}, common, {id: `settings_colors`, setup: () => {
    prepare(`colors`)
    for (let color of App.colors) {
      App.start_color_picker(`color_${color}`, true)
    }

    App.settings_make_menu(`color_mode`, [
      {text: `None`, value: `none`},
      {text: `Icon`, value: `icon`},
      {text: `Icon 2`, value: `icon_2`},
      {text: `Item`, value: `item`},
    ])
  }}))

  App.create_window(Object.assign({}, common, {id: `settings_warns`, setup: () => {
    prepare(`warns`)
    App.settings_make_menu(`warn_on_close_tabs`, App.tab_warn_opts)
    App.settings_make_menu(`warn_on_unload_tabs`, App.tab_warn_opts)
  }}))

  App.create_window(Object.assign({}, common, {id: `settings_more`, setup: () => {
    prepare(`more`)
    App.settings_make_menu(`hover_effect`, App.effects)
    App.settings_make_menu(`selected_effect`, App.effects)
    App.settings_make_menu(`double_click_command`, App.settings_commands())
  }}))

  App.create_window(Object.assign({}, common, {id: `settings_media`, setup: () => {
    prepare(`media`)

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
  }}))

  App.create_window(Object.assign({}, common, {id: `settings_icons`, setup: () => {
    prepare(`icons`)
  }}))

  App.create_window(Object.assign({}, common, {id: `settings_show`, setup: () => {
    prepare(`show`)

    App.settings_make_menu(`show_pinline`, [
      {text: `Never`, value: `never`},
      {text: `Normal`, value: `normal`},
      {text: `Always`, value: `always`},
    ])
  }}))

  App.create_window(Object.assign({}, common, {id: `settings_gestures`, setup: () => {
    prepare(`gestures`)

    DOM.ev(DOM.el(`#settings_gestures_enabled`), `change`, () => {
      App.refresh_gestures()
    })

    App.settings_make_menu(`gestures_threshold`, [
      {text: `Normal`, value: 10},
      {text: `Less Sensitive`, value: 100},
    ], () => {
      App.refresh_gestures()
    })

    let opts = App.settings_commands()

    for (let key in App.settings_props) {
      let props = App.settings_props[key]

      if (props.category === `gestures`) {
        if (key.startsWith(`gesture_`)) {
          App.settings_make_menu(key, opts)
        }
      }
    }
  }}))

  App.create_window(Object.assign({}, common, {id: `settings_auxclick`, setup: () => {
    prepare(`auxclick`)
    let opts = App.settings_commands()

    for (let key in App.settings_props) {
      let props = App.settings_props[key]

      if (props.category === `auxclick`) {
        App.settings_make_menu(key, opts)
      }
    }
  }}))

  App.create_window(Object.assign({}, common, {id: `settings_menus`, setup: () => {
    prepare(`menus`)
  }}))

  App.create_window(Object.assign({}, common, {id: `settings_keyboard`, setup: () => {
    prepare(`keyboard`)
  }}))

  window.addEventListener(`storage`, (e) => {
    if (e.key === App.stor_settings_name) {
      App.debug(`Settings changed in another window`)
      App.stor_get_settings()
      App.restart_settings(`sync`)
    }
  })
}

App.add_settings_switchers = (category) => {
  let top = DOM.el(`#window_top_settings_${category}`)

  if (DOM.dataset(top, `done`)) {
    return
  }

  let container = DOM.create(`div`, `flex_row_center gap_2 grow`)
  top.append(container)
  let title = DOM.create(`div`, `settings_title button`)
  title.id = `settings_title_${category}`
  title.textContent = App.capitalize(category)
  container.append(title)
  let actions = DOM.create(`div`, `button icon_button`)
  actions.id = `settings_actions_${category}`
  actions.append(App.create_icon(`sun`))
  container.append(actions)
  let close = DOM.create(`div`, `button`)
  close.textContent = App.close_text
  container.append(close)

  DOM.ev(actions, `click`, () => {
    App.settings_actions(category)
  })

  DOM.ev(close, `click`, () => {
    App.hide_window()
  })

  let prev = DOM.create(`div`, `button arrow_prev`)
  prev.textContent = `<`
  container.prepend(prev)

  DOM.ev(prev, `click`, () => {
    App.show_prev_settings()
  })

  let next = DOM.create(`div`, `button arrow_next`)
  next.textContent = `>`
  container.append(next)

  DOM.ev(next, `click`, () => {
    App.show_next_settings()
  })

  DOM.ev(title, `click`, () => {
    App.show_settings_menu()
  })

  DOM.ev(title, `contextmenu`, (e) => {
    App.show_settings_menu()
    e.preventDefault()
  })

  DOM.ev(title, `auxclick`, (e) => {
    if (e.button === 1) {
      App.hide_window()
    }
  })

  DOM.ev(title.closest(`.window_top`), `wheel`, (e) => {
    App.settings_wheel.call(e)
  })

  DOM.dataset(top, `done`, true)
}

App.start_color_picker = (setting, alpha = false) => {
  let el = DOM.el(`#settings_${setting}`)

  App[setting] = AColorPicker.createPicker(el, {
    showAlpha: alpha,
    showHSL: false,
    showHEX: false,
    showRGB: true,
    color: App.get_setting(setting)
  })

  App[setting].on(`change`, (picker, color) => {
    App.set_setting(setting, color)
  })

  DOM.evs(App.get_settings_label(setting), [`click`, `contextmenu`], (e) => {
    App.settings_label_menu(e,
    [
      {
        name: `Reset`, action: () => {
          let force = App.check_setting_default(setting)

          App.show_confirm(`Reset setting?`, () => {
            App[setting].setColor(App.get_default_setting(setting))
            App.set_default_setting(setting)
          }, undefined, force)
        }
      },
    ])
  })
}

App.start_theme_settings = () => {
  App.start_color_picker(`background_color`)
  App.start_color_picker(`text_color`)

  App.settings_make_menu(`background_effect`, App.background_effects, () => {
    App.apply_theme_2()
  })

  App.settings_make_menu(`background_tiles`, App.background_tiles, () => {
    App.apply_theme_2()
  })

  let auto_opts = [
    {text: `Never`, value: `never`},
    {text: `1 minute`, value: `1_minutes`},
    {text: `5 minutes`, value: `5_minutes`},
    {text: `30 minutes`, value: `30_minutes`},
    {text: `1 hour`, value: `1_hours`},
    {text: `6 hours`, value: `6_hours`},
    {text: `12 hours`, value: `12_hours`},
    {text: `24 hours`, value: `24_hours`},
  ]

  let color_opts = [...auto_opts]
  color_opts.push({text: `Domain`, value: `domain`})
  color_opts.push({text: `Party`, value: `party`})

  App.settings_make_menu(`auto_colors`, color_opts, () => {
    App.start_theme_interval(`auto_colors`)
  })

  App.settings_make_menu(`auto_background`, auto_opts, () => {
    App.start_theme_interval(`auto_background`)
  })

  App.settings_make_menu(`auto_background_mode`, [
    {text: `Only Pool`, value: `pool`},
    {text: `Only Random`, value: `random`},
    {text: `Pool & Random`, value: `pool_random`},
  ])

  App.settings_make_menu(`random_colors`, [
    {text: `Only Dark`, value: `dark`},
    {text: `Only Light`, value: `light`},
    {text: `Dark & Light`, value: `both`},
  ], () => {
    App.hostname_colors = {}
  })

  DOM.ev(DOM.el(`#settings_background_color_random`), `click`, () => {
    App.random_settings_color(`background`)
  })

  DOM.ev(DOM.el(`#settings_text_color_random`), `click`, () => {
    App.random_settings_color(`text`)
  })

  DOM.ev(DOM.el(`#settings_background_image_random`), `click`, () => {
    App.random_background()
  })

  DOM.ev(DOM.el(`#settings_background_pool_next`), `click`, () => {
    App.background_from_pool()
  })

  DOM.ev(DOM.el(`#settings_background_pool_shuffle`), `click`, () => {
    App.shuffle_addlist(`background_pool`)
  })

  DOM.ev(DOM.el(`#settings_background_pool_view`), `click`, () => {
    let items = {
      url: App.get_setting(`background_image`),
      effect: App.get_setting(`background_effect`),
      tiles: App.get_setting(`background_tiles`),
    }
  })
}

App.settings_default_category = (category) => {
  for (let key in App.settings_props) {
    let props = App.settings_props[key]

    if (props.category === category) {
      App.set_default_setting(key, false)
    }
  }
}

App.set_default_setting = (setting, do_action) => {
  App.set_setting(setting, App.default_setting_string, do_action)
}

App.reset_settings = (category) => {
  App.show_confirm(`Reset settings? (${App.capitalize(category)})`, () => {
    App.settings_default_category(category)

    if (category === `gestures`) {
      App.refresh_gestures()
    }

    App.apply_theme_2()
    App.show_settings_category(category)
  })
}

App.reset_all_settings = () => {
  App.show_confirm(`Reset all settings?`, () => {
    for (let key in App.settings_props) {
      App.set_default_setting(key)
    }

    App.restart_settings()
  })
}

App.get_font_size_options = () => {
  let opts = []

  for (let i=12; i<=22; i++) {
    opts.push({text: `${i} px`, value: i})
  }

  return opts
}

App.get_size_options = () => {
  let opts = []

  for (let i=50; i<=100; i+=5) {
    opts.push({text: `${i}%`, value: i})
  }

  return opts
}

App.show_settings = () => {
  App.show_settings_category(`general`)
}

App.show_settings_category = (category) => {
  App.check_settings_addlist()
  App.settings_category = category
  App.show_window(`settings_${category}`)
  App.set_default_theme()
}

App.show_prev_settings = () => {
  let index = App.settings_index()
  index -= 1

  if (index < 0) {
    index = App.settings_categories.length - 1
  }

  App.show_settings_category(App.settings_categories[index])
}

App.show_next_settings = () => {
  let index = App.settings_index()
  index += 1

  if (index >= App.settings_categories.length) {
    index = 0
  }

  App.show_settings_category(App.settings_categories[index])
}

App.settings_index = () => {
  return App.settings_categories.indexOf(App.settings_category)
}

App.show_settings_menu = () => {
  let category = App.settings_category
  let btn = DOM.el(`#settings_title_${category}`)
  let items = App.settings_menu_items()
  NeedContext.show_on_element(btn, items)
}

App.export_settings = () => {
  App.export_data(App.settings)
}

App.import_settings = () => {
  App.import_data((json) => {
    if (App.is_object(json)) {
      App.settings = json
      App.check_settings()
      App.stor_save_settings()
      App.restart_settings()
    }
  })
}

App.restart_settings = (type = `normal`) => {
  App.apply_theme_2()
  App.refresh_gestures()

  if (App.on_items() || type === `sync`) {
    App.clear_show()
  }
  else {
    App.show_settings()
  }
}

App.settings_data_items = () => {
  let items = []

  items.push({
    text: `Export`,
    action: () => {
      App.export_settings()
    }
  })

  items.push({
    text: `Import`,
    action: () => {
      App.import_settings()
    }
  })

  items.push({
    text: `Reset All`,
    action: () => {
      App.reset_all_settings()
    }
  })

  return items
}

App.settings_label_menu = (e, args) => {
  let items = []

  for (let arg of args) {
    items.push({
      text: arg.name,
      action: arg.action,
    })
  }

  NeedContext.show(e.clientX, e.clientY, items)
  e.preventDefault()
}

App.settings_wheel = App.create_debouncer((e, direction) => {
  if (!direction) {
    direction = App.wheel_direction(e)
  }

  if (direction === `down`) {
    App.show_next_settings()
  }
  else if (direction === `up`) {
    App.show_prev_settings()
  }
}, App.wheel_delay)

App.get_setting = (setting) => {
  let value = App.settings[setting].value

  if (value === App.default_setting_string) {
    value = App.get_default_setting(setting)
  }

  return value
}

App.set_setting = (setting, value, do_action = true) => {
  if (App.str(App.settings[setting].value) !== App.str(value)) {
    App.settings[setting].value = value
    App.save_settings_debouncer.call()

    if (do_action) {
      let props = App.settings_props[setting]

      if (props.action) {
        App.settings_do_action(props.action)
      }
    }
  }
}

App.get_default_setting = (setting) => {
  let value = App.settings_props[setting].value

  if (typeof value === `object`) {
    value = [...value]
  }

  return value
}

App.save_settings_debouncer = App.create_debouncer(() => {
  App.stor_save_settings()
}, App.settings_save_delay)

App.check_settings = () => {
  let changed = false

  function set_default (setting) {
    App.settings[setting].value = App.default_setting_string
    App.settings[setting].version = App.settings_props[setting].version
  }

  for (let key in App.settings_props) {
    // Fill defaults
    if (App.settings[key] === undefined ||
      App.settings[key].value === undefined ||
      App.settings[key].version === undefined)
    {
      App.debug(`Stor: Adding setting: ${key}`)
      App.settings[key] = {}
      set_default(key)
      changed = true
    }
  }

  for (let key in App.settings) {
    // Remove unused settings
    if (App.settings_props[key] === undefined) {
      App.debug(`Stor: Deleting setting: ${key}`)
      delete App.settings[key]
      changed = true
    }
    // Check new version
    else if (App.settings[key].version !== App.settings_props[key].version) {
      App.debug(`Stor: Upgrading setting: ${key}`)
      set_default(key)
      changed = true
    }
  }

  if (changed) {
    App.stor_save_settings()
  }
}

App.on_settings = (mode = App.window_mode) => {
  return mode.startsWith(`settings_`)
}

App.settings_commands = () => {
  let items = [
    {text: `Do Nothing`, value: `none`},
    {text: App.separator_string},
  ]

  for (let cmd of App.commands) {
    if (cmd.name === App.separator_string) {
      items.push({text: App.separator_string})
    }
    else {
      items.push({text: cmd.name, value: cmd.cmd, icon: cmd.icon, info: cmd.info})
    }
  }

  return items
}

App.tab_warn_opts = [
  {text: `Never`, value: `never`},
  {text: `Always`, value: `always`},
  {text: `Special`, value: `special`},
]

App.settings_menu_items = () => {
  let items = []

  for (let c of App.settings_categories) {
    let icon = App.settings_icons[c]
    let name = App.capitalize(c)

    items.push({
      icon: icon,
      text: name,
      action: () => {
        App.show_settings_category(c)
      },
    })
  }

  return items
}

App.is_default_setting = (setting) => {
  return (App.settings[setting].value === App.default_setting_string) ||
  (App.str(App.settings[setting].value) === App.str(App.get_default_setting(setting)))
}

App.check_setting_default = (setting) => {
  return App.is_default_setting(setting)
}

App.set_settings_menu = (setting, value, on_change) => {
  if (!value) {
    value = App.get_setting(setting)
  }

  App[`settings_menubutton_${setting}`].set(value, on_change)
}

App.apply_background = (bg) => {
  App.change_background(bg.url, bg.effect, bg.tiles)
}

App.do_save_text_setting = (setting, el) => {
  let value = el.value.trim()
  el.value = value
  el.scrollTop = 0
  App.set_setting(setting, value)
}

App.shuffle_addlist = (setting) => {
  App.show_confirm(`Shuffle items?`, () => {
    let items = App.get_setting(setting)
    App.shuffle_array(items)
    App.set_setting(setting, items)
    App.check_theme_refresh()
  })
}

App.settings_actions = (category) => {
  let items = []

  items.push({
    text: `Reset`,
    action: () => {
      App.reset_settings(category)
    }
  })

  items.push({
    text: `Data`,
    get_items: () => {
      return App.settings_data_items()
    },
  })

  let btn = DOM.el(`#settings_actions_${category}`)
  NeedContext.show_on_element(btn, items, true, btn.clientHeight)
}

App.get_background_effect = (value) => {
  for (let key in App.background_effects) {
    let eff = App.background_effects[key]

    if (eff.value === value) {
      return eff
    }
  }
}

App.fill_settings = (category) => {
  let c = DOM.el(`#setting_${category}`)
  c.innerHTML = ``

  for (let key in App.settings_props) {
    let props = App.settings_props[key]

    if (props.category === category) {
      let el = DOM.create(`div`, `settings_item`)
      let label = DOM.create(`div`, `settings_label`)
      label.id = `settings_label_${key}`
      label.textContent = props.name
      el.append(label)
      let widget

      if (props.type === `menu`) {
        widget = DOM.create(`div`, `settings_menu button`)
      }
      else if (props.type === `list`) {
        widget = DOM.create(`div`, `settings_addlist`)
      }
      else if (props.type === `text`) {
        widget = DOM.create(`input`, `text settings_text`)
        widget.type = `text`
        widget.autocomplete = `off`
        widget.spellcheck = `false`
        widget.placeholder = props.placeholder
      }
      else if (props.type === `text_smaller`) {
        widget = DOM.create(`input`, `text settings_text text_smaller`)
        widget.type = `text`
        widget.autocomplete = `off`
        widget.spellcheck = `false`
        widget.placeholder = props.placeholder
      }
      else if (props.type === `number`) {
        widget = DOM.create(`input`, `text settings_number`)
        widget.type = `number`
        widget.autocomplete = `off`
        widget.spellcheck = `false`
        widget.placeholder = props.placeholder
      }
      else if (props.type === `checkbox`) {
        widget = DOM.create(`input`, `settings_checkbox`)
        widget.type = `checkbox`
      }
      else if (props.type === `color`) {
        widget = DOM.create(`div`, `settings_color`)
      }

      widget.id = `settings_${key}`
      el.append(widget)
      el.title = props.info
      c.append(el)
    }
  }
}

App.check_settings_addlist = () => {
  if (!App.settings_addlist_ready) {
    App.setup_settings_addlist()
    App.settings_addlist_ready = true
  }
}

App.setup_settings_addlist = () => {
  App.addlist_commands = App.settings_commands()

  function cmd_name (cmd) {
    let c = App.get_command(cmd)

    if (c) {
      return c.name
    }
    else {
      return `None`
    }
  }

  function on_hide () {
    App.hide_addlist()
  }

  function after_hide () {
    App.addlist_clear_image()
  }

  let args = {
    on_hide: on_hide,
    after_hide: after_hide,
  }

  let from = `settings`
  let id = `settings_aliases`

  App.create_popup(Object.assign({}, args, {
    id: `addlist_${id}`,
    element: App.addlist_register({
      from: from,
      id: id,
      pk: `a`,
      widgets: [`text`, `text`],
      labels: [`Term A`, `Term B`],
      keys: [`a`, `b`],
      list_text: (items) => {
        return `${items.a} = ${items.b}`
      }
    })
  }))

  id = `settings_custom_filters`

  App.create_popup(Object.assign({}, args, {
    id: `addlist_${id}`,
    element: App.addlist_register({
      from: from,
      id: id,
      pk: `filter`,
      widgets: [`text`],
      labels: [`Filter`],
      keys: [`filter`],
      list_text: (items) => {
        return items.filter
      }
    })
  }))

  id = `settings_background_pool`

  App.create_popup(Object.assign({}, args, {
    id: `addlist_${id}`,
    element: App.addlist_register({
      from: from,
      id: id,
      pk: `url`,
      widgets: [`text`, `select`, `select`],
      labels: [`Image URL`, `Effect`, `Tiles`],
      image: 0,
      sources: [undefined, App.background_effects, App.background_tiles],
      keys: [`url`, `effect`, `tiles`],
      list_text: (items) => {
        let s = App.remove_protocol(items.url)

        if (items.effect !== `none`) {
          let eff = App.get_background_effect(items.effect)

          if (eff) {
            s += ` (${eff.text})`
          }
        }

        if (items.tiles !== `none`) {
          s += ` (Tiled)`
        }

        return s
      }
    })
  }))

  id = `settings_keyboard_shortcuts`

  App.create_popup(Object.assign({}, args, {
    id: `addlist_${id}`,
    element: App.addlist_register({
      from: from,
      id: id,
      pk: `key`,
      widgets: [`key`, `select`, `checkbox`, `checkbox`, `checkbox`],
      labels: [`Key`, `Command`, `Require Ctrl`, `Require Shift`, `Require Alt`],
      sources: [undefined, App.addlist_commands.slice(0), true, false, false],
      keys: [`key`, `cmd`, `ctrl`, `shift`, `alt`],
      list_text: (items) => {
        let cmd = cmd_name(items.cmd)
        return `${items.key} = ${cmd}`
      }
    })
  }))

  for (let key in App.settings_props) {
    let props = App.settings_props[key]
    let id = `settings_${key}`

    if (props.category === `menus`) {
      App.create_popup(Object.assign({}, args, {
        id: `addlist_${id}`,
        element: App.addlist_register({
          from: from,
          id: id,
          pk: `cmd`,
          widgets: [`select`], labels: [`Command`],
          sources: [App.addlist_commands.slice(0)],
          keys: [`cmd`], list_text: (items) => {
            return cmd_name(items.cmd)
          }
        })
      }))
    }
  }
}