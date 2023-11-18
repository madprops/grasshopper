App.setup_commands = () => {
  let pin_icon = App.get_setting(`pin_icon`) || App.pin_icon
  let normal_icon = App.get_setting(`normal_icon`) || App.mode_icons.tabs
  let playing_icon = App.get_setting(`playing_icon`) || App.audio_icon
  let loaded_icon = App.get_setting(`loaded_icon`) || App.mode_icons.tabs
  let unloaded_icon = App.get_setting(`unloaded_icon`) || App.sleeping_icon
  let muted_icon = App.get_setting(`muted_icon`) || App.muted_icon
  let unread_icon = App.get_setting(`unread_icon`) || App.circle_icon
  let command_icon = App.command_icon
  let settings_icon = App.settings_icons.general
  let theme_icon = App.settings_icons.theme
  let filter_icon = App.settings_icons.filter
  let media_icon = App.settings_icons.media
  let tabs_icon =  App.mode_icons.tabs
  let bookmarks_icon = App.mode_icons.bookmarks
  let closed_icon = App.mode_icons.closed
  let browser_icon = App.browser_icon
  let clipboard_icon = App.clipboard_icon
  let notepad_icon = App.notepad_icon
  let bot_icon = App.bot_icon
  let up_icon = App.up_arrow_icon
  let down_icon = App.down_arrow_icon
  let left_icon = App.left_arrow_icon
  let heart_icon = App.heart_icon
  let close_icon = App.close_icon
  let tag_icon = App.tag_icon
  let zone_icon = App.zone_icon
  let color_filters = []
  let color_changers = []
  let color_removers = []
  let color_closers = []

  color_filters.push({
    name: `Filter All Colors`,
    cmd: `filter_color_all`,
    modes: [`items`],
    icon: theme_icon,
    action: (args) => {
      App.filter_color(args.mode, `all`)
    },
    info: `Filter: Show all colors`,
  })

  for (let color of App.colors()) {
    let icon, name, short
    icon = App.color_icon(color.id)
    name = `Filter ${color.name}`

    color_filters.push({
      name: name,
      cmd: `filter_color_${color.id}`,
      modes: [`items`],
      icon: icon,
      action: (args) => {
        App.filter_color(args.mode, color.id)
      },
      info: `Filter items with this color (${color.name})`,
    })

    icon = App.color_icon(color.id)
    name = `Color ${color.name}`
    short = color.name

    color_changers.push({
      name: name,
      short_name: short,
      cmd: `color_${color.id}`,
      modes: [`tabs`],
      item: true,
      icon: icon,
      action: (args) => {
        App.edit_tab_color({item: args.item, color: color.id})
      },
      info: `Add a custom color to tabs (${color.name})`,
    })

    icon = App.color_icon(color.id)
    name = `Toggle ${color.name}`
    short = color.name

    color_changers.push({
      name: name,
      short_name: short,
      cmd: `toggle_color_${color.id}`,
      modes: [`tabs`],
      item: true,
      icon: icon,
      action: (args) => {
        App.edit_tab_color({item: args.item, color: color.id, toggle: true})
      },
      info: `Toggle color on or off (${color.name})`,
    })

    icon = App.color_icon(color.id)
    name = `Remove ${color.name}`

    color_removers.push({
      name: name,
      cmd: `remove_color_${color.id}`,
      modes: [`tabs`],
      icon: icon,
      action: (args) => {
        App.remove_color(color.id)
      },
      info: `Remove color from tabs (${color.name})`,
    })

    icon = App.color_icon(color.id)
    name = `Close ${color.name}`

    color_closers.push({
      name: name,
      cmd: `close_color_${color.id}`,
      modes: [`tabs`],
      icon: icon,
      action: (args) => {
        App.close_color(color.id)
      },
      info: `Close tabs with this color (${color.name})`,
    })
  }

  color_filters.push({
    name: `Filter Color Menu`,
    cmd: `show_filter_color_menu`,
    modes: [`items`],
    item: true,
    icon: theme_icon,
    action: (args) => {
      App.show_filter_color_menu(args.mode, args.e)
    },
    info: `Show the filter color menu`,
  })

  color_changers.push({
    name: `Color Menu`,
    short_name: `Color`,
    cmd: `show_color_menu`,
    modes: [`tabs`],
    item: true,
    icon: theme_icon,
    action: (args) => {
      App.show_color_menu(args.item, args.e)
    },
    info: `Show the colors menu`,
  })

  color_removers.push({
    name: `Remove Color`,
    cmd: `remove_color`,
    modes: [`tabs`],
    item: true,
    icon: theme_icon,
    action: (args) => {
      App.edit_tab_color({item: args.item})
    },
    info: `Remove the custom color of tabs`,
  })

  color_removers.push({
    name: `Remove All Colors`,
    cmd: `remove_all_colors`,
    modes: [`tabs`],
    item: true,
    icon: theme_icon,
    action: (args) => {
      App.remove_edits({what: [`color`]})
    },
    info: `Remove all colors from tabs`,
  })

  color_closers.push({
    name: `Close Color`,
    cmd: `close_color_all`,
    modes: [`tabs`],
    icon: close_icon,
    action: (args) => {
      App.close_color_all(args.e)
    },
    info: `Show the close color menu`,
  })

  let media_filters = []

  for (let media of App.media_types) {
    let icon = App.get_setting(`${media}_icon`) || command_icon
    let name = `Filter ${App.capitalize(media)}`.trim()

    media_filters.push({
      name: name,
      cmd: `filter_media_${media}`,
      modes: [`items`],
      icon: icon,
      action: (args) => {
        App.set_filter_mode({mode: args.mode, type: media})
      },
      info: `Filter: Show media items (${media})`,
    })
  }

  let show_modes = []

  for (let mode of App.modes) {
    let icon = App.mode_icons[mode]
    let name = `Show ${App.get_mode_name(mode)}`

    show_modes.push({
      name: name,
      cmd: `show_mode_${mode}`,
      icon: icon,
      action: (args) => {
        App.show_mode({mode: mode})
      },
      info: `Show mode: ${mode}`,
    })
  }

  App.commands = [
    {
      name: `Go To Top`,
      cmd: `go_to_top`,
      modes: [`items`],
      icon: up_icon,
      action: (args) => {
        App.goto_top()
      },
      info: `Go to the top of the list`,
    },
    {
      name: `Go To Bottom`,
      cmd: `go_to_bottom`,
      modes: [`items`],
      icon: down_icon,
      action: (args) => {
        App.goto_bottom()
      },
      info: `Go to the bottom of the list`,
    },
    {
      name: `Step Back`,
      cmd: `step_back`,
      modes: [`items`],
      icon: left_icon,
      action: (args) => {
        App.step_back()
      },
      info: `Do the Step Back action. What it does depend on the current state`,
    },
    {
      name: `Recent Tabs`,
      cmd: `show_recent_tabs`,
      modes: [`items`],
      icon: tabs_icon,
      action: (args) => {
        App.show_recent_tabs()
      },
      info: `Show the recent previous tabs`,
    },
    {
      name: `Select All`,
      cmd: `select_all_items`,
      modes: [`items`],
      icon: command_icon,
      action: (args) => {
        App.select_all(args.mode, true)
      },
      info: `Select all items`,
    },
    {
      name: `Copy Tabs`,
      cmd: `copy_tabs`,
      modes: [`tabs`],
      item: true,
      icon: clipboard_icon,
      action: (args) => {
        App.copy_tabs(args.item)
      },
      info: `Copy tabs to paste later at another position`,
    },
    {
      name: `Paste Tabs`,
      cmd: `paste_tabs`,
      modes: [`tabs`],
      item: true,
      icon: clipboard_icon,
      action: (args) => {
        App.paste_tabs(args.item)
      },
      info: `Paste tabs at the current position`,
    },
    {
      name: `Previous Mode`,
      cmd: `show_previous_mode`,
      modes: [`items`],
      icon: command_icon,
      action: (args) => {
        App.cycle_modes(true)
      },
      info: `Go to the previous mode`,
    },
    {
      name: `Next Mode`,
      cmd: `show_next_mode`,
      modes: [`items`],
      icon: command_icon,
      action: (args) => {
        App.cycle_modes()
      },
      info: `Go to the next mode`,
    },

    ...show_modes,

    {
      name: `Show Primary`,
      cmd: `show_primary_mode`,
      icon: command_icon,
      action: (args) => {
        App.show_primary_mode()
      },
      info: `Show the primary mode`,
    },
    {
      name: `Show Settings`,
      short_name: `Settings`,
      cmd: `show_settings`,
      icon: settings_icon,
      action: (args) => {
        App.show_settings_resolve(args.e)
      },
      info: `Show the Settings window`,
    },
    {
      name: `Show About`,
      cmd: `show_about`,
      icon: bot_icon,
      action: (args) => {
        App.show_about()
      },
      info: `Show the About window`,
    },
    {
      name: `Show Palette`,
      cmd: `show_palette`,
      icon: command_icon,
      action: (args) => {
        App.show_palette()
      },
      info: `Show the Palette`,
    },
    {
      name: `Toggle Taglist`,
      cmd: `toggle_taglist`,
      modes: [`items`],
      icon: tag_icon,
      action: (args) => {
        App.toggle_taglist(args.mode)
      },
      info: `Show or hide the Taglist`,
    },
    {
      name: `Fullscreen`,
      cmd: `toggle_fullscreen`,
      icon: command_icon,
      action: (args) => {
        App.toggle_fullscreen()
      },
      info: `Hide some interface components`,
    },
    {
      name: `Item Menu`,
      cmd: `show_item_menu`,
      modes: [`items`],
      item: true,
      icon: command_icon,
      action: (args) => {
        App.show_item_menu({item: args.item, e: args.e})
      },
      info: `Show the Item Menu`,
    },
    {
      name: `Favorites`,
      cmd: `show_favorites_menu`,
      modes: [`items`],
      icon: heart_icon,
      action: (args) => {
        App.show_favorites_menu(args.e, args.item)
      },
      info: `Show the Favorites menu`,
    },
    {
      name: `Filter All`,
      cmd: `filter_all`,
      modes: [`items`],
      icon: filter_icon,
      action: (args) => {
        App.filter_all(args.mode)
      },
      info: `Filter: Show all items`,
    },
    {
      name: `Previous Filter`,
      cmd: `previous_filter`,
      modes: [`items`],
      icon: filter_icon,
      action: (args) => {
        App.previous_filter(args.mode)
      },
      info: `Show the previous filter used before going back to All`,
    },
    {
      name: `Open`,
      cmd: `open_items`,
      modes: [`items`],
      item: true,
      icon: command_icon,
      action: (args) => {
        App.open_items(args.item, true)
      },
      info: `Open items`,
    },
    {
      name: `View`,
      cmd: `view_media`,
      modes: [`items`],
      item: true,
      icon: media_icon,
      action: (args) => {
        App.view_media(args.item)
      },
      info: `View media item`,
    },
    {
      name: `Bookmark`,
      cmd: `bookmark_items`,
      modes: [`items`],
      item: true,
      icon: bookmarks_icon,
      action: (args) => {
        App.bookmark_items(args.item)
      },
      info: `Bookmark this item`,
    },
    {
      name: `Bookmark Page`,
      cmd: `bookmark_page`,
      item: true,
      icon: bookmarks_icon,
      action: (args) => {
        App.bookmark_active(args.item)
      },
      info: `Bookmark the current page`,
    },
    {
      name: `Copy URL`,
      cmd: `copy_item_url`,
      modes: [`items`],
      item: true,
      single: true,
      icon: clipboard_icon,
      action: (args) => {
        App.copy_url(args.item)
      },
      info: `Copy the URL of an item`,
    },
    {
      name: `Copy Title`,
      cmd: `copy_item_title`,
      modes: [`items`],
      item: true,
      single: true,
      icon: clipboard_icon,
      action: (args) => {
        App.copy_title(args.item)
      },
      info: `Copy the title of an item`,
    },
    {
      name: `Go Back`,
      cmd: `browser_back`,
      icon: browser_icon,
      action: (args) => {
        App.browser_back()
      },
      info: `Go back in browser history`,
    },
    {
      name: `Go Forward`,
      cmd: `browser_forward`,
      icon: browser_icon,
      action: (args) => {
        App.browser_forward()
      },
      info: `Go forward in browser history`,
    },
    {
      name: `Reload Page`,
      cmd: `browser_reload`,
      icon: browser_icon,
      action: (args) => {
        App.browser_reload()
      },
      info: `Reload the current page`,
    },
    {
      name: `Browser Menu`,
      cmd: `show_browser_menu`,
      icon: browser_icon,
      action: (args) => {
        App.show_browser_menu(args.e)
      },
      info: `Show the browser menu`,
    },
    {
      name: `New`,
      cmd: `open_new_tab`,
      icon: tabs_icon,
      action: (args) => {
        App.new_tab()
      },
      info: `Open a new tab`,
    },
    {
      name: `Unload`,
      cmd: `unload_tabs`,
      modes: [`tabs`],
      some_loaded: true,
      item: true,
      icon: unloaded_icon,
      action: (args) => {
        App.unload_tabs(args.item)
      },
      info: `Unload tabs`,
    },
    {
      name: `Unload Others`,
      cmd: `unload_other_tabs`,
      modes: [`tabs`],
      item: true,
      icon: unloaded_icon,
      action: (args) => {
        App.unload_other_tabs(args.item)
      },
      info: `Unload all tabs except the selected one`,
    },
    {
      name: `Load`,
      cmd: `load_tabs`,
      modes: [`tabs`],
      some_unloaded: true,
      item: true,
      icon: tabs_icon,
      action: (args) => {
        App.load_tabs(args.item)
      },
      info: `Load tabs that are unloaded`,
    },
    {
      name: `Duplicate`,
      cmd: `duplicate_tabs`,
      modes: [`tabs`],
      item: true,
      icon: tabs_icon,
      action: (args) => {
        App.duplicate_tabs(args.item)
      },
      info: `Duplicate tabs`,
    },
    {
      name: `To Window`,
      cmd: `show_windows_menu`,
      modes: [`tabs`],
      item: true,
      icon: tabs_icon,
      action: (args) => {
        App.show_windows_menu(args.item, args.e)
      },
      info: `Move tabs to another window`,
    },
    {
      name: `Move To Top`,
      short_name: `To Top`,
      cmd: `move_tabs_to_top`,
      modes: [`tabs`],
      item: true,
      icon: up_icon,
      action: (args) => {
        App.move_tabs_vertically(`top`, args.item)
      },
      info: `Move tabs to the top`,
    },
    {
      name: `Move To Bottom`,
      short_name: `To Bottom`,
      cmd: `move_tabs_to_bottom`,
      modes: [`tabs`],
      item: true,
      icon: down_icon,
      action: (args) => {
        App.move_tabs_vertically(`bottom`, args.item)
      },
      info: `Move tabs to the bottom`,
    },
    {
      name: `Pin`,
      cmd: `pin_tabs`,
      modes: [`tabs`],
      item: true,
      some_loaded: true,
      some_unpinned: true,
      icon: pin_icon,
      action: (args) => {
        App.pin_tabs(args.item)
      },
      info: `Pin tabs`,
    },
    {
      name: `Unpin`,
      cmd: `unpin_tabs`,
      modes: [`tabs`],
      item: true,
      some_loaded: true,
      some_pinned: true,
      icon: pin_icon,
      action: (args) => {
        App.unpin_tabs(args.item)
      },
      info: `Unpin tabs`,
    },
    {
      name: `Toggle Pin`,
      cmd: `toggle_pin_tabs`,
      modes: [`tabs`],
      item: true,
      some_loaded: true,
      icon: pin_icon,
      action: (args) => {
        App.toggle_pin_tabs(args.item)
      },
      info: `Pin or unpin tabs`,
    },
    {
      name: `Mute`,
      cmd: `mute_tabs`,
      modes: [`tabs`],
      some_unmuted: true,
      item: true,
      icon: muted_icon,
      action: (args) => {
        App.mute_tabs(args.item)
      },
      info: `Mute tabs`,
    },
    {
      name: `Unmute`,
      cmd: `unmute_tabs`,
      modes: [`tabs`],
      some_muted: true,
      item: true,
      icon: muted_icon,
      action: (args) => {
        App.unmute_tabs(args.item)
      },
      info: `Unmute tabs`,
    },
    {
      name: `Toggle Mute`,
      cmd: `toggle_mute_tabs`,
      modes: [`tabs`],
      item: true,
      icon: muted_icon,
      action: (args) => {
        App.toggle_mute_tabs(args.item)
      },
      info: `Mute or unmute tabs`,
    },
    {
      name: `Mute Playing`,
      cmd: `mute_playing_tabs`,
      modes: [`tabs`],
      item: true,
      icon: muted_icon,
      action: (args) => {
        App.mute_playing_tabs(args.item)
      },
      info: `Mute tabs that are playing audio`,
    },
    {
      name: `Unmute All`,
      cmd: `mute_all_tabs`,
      modes: [`tabs`],
      item: true,
      icon: muted_icon,
      action: (args) => {
        App.unmute_all_tabs(args.item)
      },
      info: `Unmute all muted tabs`,
    },
    {
      name: `Close`,
      cmd: `close_tabs`,
      modes: [`tabs`],
      item: true,
      icon: close_icon,
      action: (args) => {
        App.close_tabs(args.item)
      },
      info: `Close tabs`,
    },
    {
      name: `Close Menu`,
      cmd: `show_close_tabs_menu`,
      modes: [`tabs`],
      icon: close_icon,
      action: (args) => {
        App.show_close_tabs_menu(args.e, args.item)
      },
      info: `Open the menu with some tab closing options`,
    },
    {
      name: `Close Normal`,
      cmd: `close_normal_tabs`,
      modes: [`tabs`],
      icon: close_icon,
      action: (args) => {
        App.close_tabs_popup(`normal`)
      },
      info: `Close normal tabs`,
    },
    {
      name: `Close Playing`,
      cmd: `close_playing_tabs`,
      modes: [`tabs`],
      icon: close_icon,
      action: (args) => {
        App.close_tabs_popup(`playing`)
      },
      info: `Close playing tabs`,
    },
    {
      name: `Close Loaded`,
      cmd: `close_loaded_tabs`,
      modes: [`tabs`],
      icon: close_icon,
      action: (args) => {
        App.close_tabs_popup(`loaded`)
      },
      info: `Close loaded tabs`,
    },
    {
      name: `Close Unloaded`,
      cmd: `close_unloaded_tabs`,
      modes: [`tabs`],
      icon: close_icon,
      action: (args) => {
        App.close_tabs_popup(`unloaded`)
      },
      info: `Close unloaded tabs`,
    },
    {
      name: `Close Duplicate`,
      cmd: `close_duplicate_tabs`,
      modes: [`tabs`],
      icon: close_icon,
      action: (args) => {
        App.close_tabs_popup(`duplicate`)
      },
      info: `Close duplicate tabs`,
    },
    {
      name: `Close Visible`,
      cmd: `close_visible_tabs`,
      modes: [`tabs`],
      icon: close_icon,
      action: (args) => {
        App.close_tabs_popup(`visible`)
      },
      info: `Close visible tabs`,
    },
    {
      name: `Close Others`,
      cmd: `close_other_tabs`,
      modes: [`tabs`],
      item: true,
      icon: close_icon,
      action: (args) => {
        App.close_tabs_popup(`other`, args.item)
      },
      info: `Close other tabs`,
    },

    ...color_closers,

    {
      name: `Go To Playing`,
      cmd: `go_to_playing_tab`,
      icon: tabs_icon,
      action: (args) => {
        App.go_to_playing_tab()
      },
      info: `Go the tab emitting sound`,
    },
    {
      name: `Sort`,
      cmd: `sort_tabs`,
      modes: [`items`],
      icon: tabs_icon,
      action: (args) => {
        App.sort_tabs()
      },
      info: `Open the sort tabs window`,
    },
    {
      name: `Show Info`,
      cmd: `show_tabs_info`,
      modes: [`items`],
      icon: tabs_icon,
      action: (args) => {
        App.show_tabs_info()
      },
      info: `Show some tab info`,
    },
    {
      name: `Show URLs`,
      cmd: `show_tab_urls`,
      modes: [`items`],
      icon: tabs_icon,
      action: (args) => {
        App.show_tab_urls()
      },
      info: `Show a list of open URLs`,
    },
    {
      name: `Open URLs`,
      cmd: `open_tab_urls`,
      modes: [`items`],
      icon: tabs_icon,
      action: (args) => {
        App.open_tab_urls()
      },
      info: `Open a list of URLs`,
    },
    {
      name: `Reopen`,
      cmd: `reopen_tab`,
      icon: tabs_icon,
      action: (args) => {
        App.reopen_tab()
      },
      info: `Reopen the latest closed tab`,
    },
    {
      name: `Insert Header`,
      short_name: `Header`,
      cmd: `insert_header`,
      modes: [`tabs`],
      item: true,
      icon: zone_icon,
      action: (args) => {
        App.insert_header(args.item)
      },
      info: `Add a header tab above a tab`,
    },
    {
      name: `Select Pins`,
      cmd: `select_pinned_tabs`,
      modes: [`tabs`],
      icon: pin_icon,
      action: (args) => {
        App.select_tabs(`pins`)
      },
      info: `Select all pinned tabs`,
    },
    {
      name: `Select Normal`,
      cmd: `select_normal_tabs`,
      modes: [`tabs`],
      icon: normal_icon,
      action: (args) => {
        App.select_tabs(`normal`)
      },
      info: `Select all normal tabs`,
    },
    {
      name: `Select Unloaded`,
      cmd: `select_unloaded_tabs`,
      modes: [`tabs`],
      icon: unloaded_icon,
      action: (args) => {
        App.select_tabs(`unloaded`)
      },
      info: `Select all unloaded tabs`,
    },
    {
      name: `Filter History`,
      cmd: `show_filter_history`,
      modes: [`items`],
      icon: filter_icon,
      action: (args) => {
        App.show_filter_history(args.mode, args.e)
      },
      info: `Show the Filter History`,
    },
    {
      name: `Deep Search`,
      cmd: `deep_search`,
      modes: [`search`],
      icon: filter_icon,
      action: (args) => {
        App.deep_search(args.mode)
      },
      info: `Do a deep search`,
    },
    {
      name: `Search Media`,
      cmd: `show_search_media_menu`,
      modes: [`items`],
      icon: media_icon,
      action: (args) => {
        App.search_media(args.mode, args.e)
      },
      info: `Search for media`,
    },
    {
      name: `Forget Closed`,
      cmd: `forget_closed`,
      modes: [`closed`],
      icon: closed_icon,
      action: (args) => {
        App.forget_closed()
      },
      info: `Forget closed items`,
    },
    {
      name: `Forget Closed Item`,
      short_name: `Forget`,
      cmd: `forget_closed_item`,
      modes: [`closed`],
      item: true,
      icon: closed_icon,
      action: (args) => {
        App.forget_closed_item(args.item)
      },
      info: `Forget a single closed item`,
    },
    {
      name: `Edit Title`,
      short_name: `Title`,
      cmd: `edit_title`,
      modes: [`tabs`],
      item: true,
      icon: notepad_icon,
      action: (args) => {
        App.edit_title(args.item)
      },
      info: `Edit tab titles`,
    },
    {
      name: `Edit Icon`,
      short_name: `Icon`,
      cmd: `edit_icon`,
      modes: [`tabs`],
      item: true,
      icon: notepad_icon,
      action: (args) => {
        App.edit_icon(args.item)
      },
      info: `Edit tab icons`,
    },
    {
      name: `Edit Tags`,
      short_name: `Tags`,
      cmd: `edit_tags`,
      modes: [`tabs`],
      item: true,
      icon: tag_icon,
      action: (args) => {
        App.edit_tags(args.item)
      },
      info: `Edit tab tags`,
    },
    {
      name: `Edit Notes`,
      short_name: `Notes`,
      cmd: `edit_notes`,
      modes: [`tabs`],
      item: true,
      icon: notepad_icon,
      action: (args) => {
        App.edit_notes(args.item)
      },
      info: `Edit tab notes`,
    },
    {
      name: `Add Tags`,
      cmd: `add_tags`,
      modes: [`tabs`],
      item: true,
      icon: tag_icon,
      action: (args) => {
        App.add_tags(args.item)
      },
      info: `Add tags to tabs`,
    },
    {
      name: `Split Both`,
      cmd: `add_split_both`,
      modes: [`tabs`],
      item: true,
      multiple: true,
      icon: zone_icon,
      action: (args) => {
        App.edit_tab_split({item: args.item, which: `both`})
      },
      info: `Add a split above and below the selected tabs`,
    },
    {
      name: `Split Top`,
      cmd: `add_split_top`,
      modes: [`tabs`],
      item: true,
      some_not_split_top: true,
      icon: zone_icon,
      action: (args) => {
        App.edit_tab_split({item: args.item, which: `top`})
      },
      info: `Add a split above the tab`,
    },
    {
      name: `Split Bottom`,
      cmd: `add_split_bottom`,
      modes: [`tabs`],
      item: true,
      some_not_split_bottom: true,
      icon: zone_icon,
      action: (args) => {
        App.edit_tab_split({item: args.item, which: `bottom`})
      },
      info: `Add a split below the tab`,
    },

    ...color_removers,

    {
      name: `Remove Title`,
      cmd: `remove_title`,
      modes: [`tabs`],
      item: true,
      icon: notepad_icon,
      action: (args) => {
        App.remove_item_title(args.item)
      },
      info: `Remove the title from tabs`,
    },
    {
      name: `Remove All Titles`,
      cmd: `remove_all_titles`,
      modes: [`tabs`],
      icon: notepad_icon,
      action: (args) => {
        App.remove_edits({what: [`title`]})
      },
      info: `Remove all titles from tabs`,
    },
    {
      name: `Remove Icon`,
      cmd: `remove_icon`,
      modes: [`tabs`],
      item: true,
      icon: notepad_icon,
      action: (args) => {
        App.remove_item_icon(args.item)
      },
      info: `Remove the icon from tabs`,
    },
    {
      name: `Remove All Icons`,
      cmd: `remove_all_icons`,
      modes: [`tabs`],
      icon: notepad_icon,
      action: (args) => {
        App.remove_edits({what: [`icon`]})
      },
      info: `Remove all icons from tabs`,
    },
    {
      name: `Remove Notes`,
      cmd: `remove_notes`,
      modes: [`tabs`],
      item: true,
      icon: notepad_icon,
      action: (args) => {
        App.remove_item_notes(args.item)
      },
      info: `Remove notes from tabs`,
    },
    {
      name: `Wipe Tag`,
      cmd: `wipe_tag`,
      modes: [`tabs`],
      icon: tag_icon,
      action: (args) => {
        App.wipe_tag()
      },
      info: `Remove a specific tag from all tabs`,
    },
    {
      name: `Remove Tags`,
      cmd: `remove_tags`,
      modes: [`tabs`],
      item: true,
      icon: tag_icon,
      action: (args) => {
        App.remove_item_tags(args.item)
      },
      info: `Remove the tags from tabs`,
    },
    {
      name: `Remove All Tags`,
      cmd: `remove_all_tags`,
      modes: [`tabs`],
      icon: tag_icon,
      action: (args) => {
        App.remove_edits({what: [`tags`]})
      },
      info: `Remove all tags from tabs`,
    },
    {
      name: `Remove All Notes`,
      cmd: `remove_all_notes`,
      modes: [`tabs`],
      icon: notepad_icon,
      action: (args) => {
        App.remove_edits({what: [`notes`]})
      },
      info: `Remove all notes from tabs`,
    },
    {
      name: `Remove Split`,
      cmd: `remove_split`,
      modes: [`tabs`],
      some_split: true,
      item: true,
      icon: zone_icon,
      action: (args) => {
        App.remove_item_split(args.item)
      },
      info: `Remove the splits from tabs`,
    },
    {
      name: `Remove All Splits`,
      cmd: `remove_all_splits`,
      modes: [`tabs`],
      icon: zone_icon,
      action: (args) => {
        App.remove_all_splits()
      },
      info: `Remove all splits from tabs`,
    },
    {
      name: `Remove All Headers`,
      cmd: `remove_all_headers`,
      modes: [`tabs`],
      icon: zone_icon,
      action: (args) => {
        App.remove_all_headers(args.item)
      },
      info: `Remove all header tabs`,
    },
    {
      name: `Replace Tag`,
      cmd: `replace_tag`,
      modes: [`tabs`],
      icon: tag_icon,
      action: (args) => {
        App.replace_tag()
      },
      info: `Replace tag with another tag among all tabs`,
    },
    {
      name: `Close Tag`,
      cmd: `close_tag_all`,
      modes: [`tabs`],
      icon: close_icon,
      action: (args) => {
        App.close_tag_all()
      },
      info: `Close tabs with this tag`,
    },
    {
      name: `Remove All Edits`,
      cmd: `remove_all_edits`,
      modes: [`tabs`],
      icon: notepad_icon,
      action: (args) => {
        App.remove_all_edits()
      },
      info: `Remove all edits from tabs`,
    },
    {
      name: `Remove Edits`,
      cmd: `remove_item_edits`,
      modes: [`tabs`],
      item: true,
      icon: notepad_icon,
      action: (args) => {
        App.remove_item_edits(args.item)
      },
      info: `Remove all edits from specific items`,
    },

    ...color_changers,
    ...media_filters,
    ...color_filters,

    {
      name: `Filter Domain`,
      cmd: `filter_domain`,
      modes: [`items`],
      item: true,
      single: true,
      icon: filter_icon,
      action: (args) => {
        App.filter_domain(args.item)
      },
      info: `Filter: Show same domain`,
    },
    {
      name: `Filter Title`,
      cmd: `filter_title`,
      modes: [`items`],
      item: true,
      single: true,
      icon: filter_icon,
      action: (args) => {
        App.filter_title(args.item)
      },
      info: `Filter: Show same title`,
    },
    {
      name: `Filter Color`,
      cmd: `filter_color`,
      modes: [`items`],
      item: true,
      single: true,
      color: true,
      icon: theme_icon,
      action: (args) => {
        App.filter_color(args.mode, App.get_color(args.item))
      },
      info: `Filter: Show same color`,
    },
    {
      name: `Filter Tag`,
      cmd: `filter_tag`,
      modes: [`items`],
      some_tagged: true,
      item: true,
      icon: tag_icon,
      action: (args) => {
        App.filter_tag_pick(args.item, args.e)
      },
      info: `Filter by picking a tag from the current item`,
    },
    {
      name: `Filter Tag Menu`,
      cmd: `show_filter_tag_menu`,
      modes: [`items`],
      icon: tag_icon,
      action: (args) => {
        App.show_filter_tag_menu(args.mode, args.e)
      },
      info: `Filter all items by picking a tag`,
    },
    {
      name: `Filter All Tags`,
      cmd: `filter_tag_all`,
      modes: [`items`],
      item: true,
      icon: tag_icon,
      action: (args) => {
        App.filter_tag(args.mode, `all`)
      },
      info: `Filter all tagged tabs`,
    },
    {
      name: `Filter Pins`,
      cmd: `filter_pinned_tabs`,
      modes: [`tabs`],
      icon: pin_icon,
      action: (args) => {
        App.filter_pinned(args.mode)
      },
      info: `Filter: Show pinned tabs`,
    },
    {
      name: `Filter Normal`,
      cmd: `filter_normal_tabs`,
      modes: [`tabs`],
      icon: normal_icon,
      action: (args) => {
        App.filter_normal(args.mode)
      },
      info: `Filter: Show normal tabs`,
    },
    {
      name: `Filter Playing`,
      cmd: `filter_playing_tabs`,
      modes: [`tabs`],
      icon: playing_icon,
      action: (args) => {
        App.filter_playing(args.mode)
      },
      info: `Filter: Show playing tabs`,
    },
    {
      name: `Filter Loaded`,
      cmd: `filter_loaded_tabs`,
      modes: [`tabs`],
      icon: loaded_icon,
      action: (args) => {
        App.filter_loaded(args.mode)
      },
      info: `Filter: Show loaded tabs`,
    },
    {
      name: `Filter Unloaded`,
      cmd: `filter_unloaded_tabs`,
      modes: [`tabs`],
      icon: unloaded_icon,
      action: (args) => {
        App.filter_unloaded(args.mode)
      },
      info: `Filter: Show unloaded tabs`,
    },
    {
      name: `Filter Duplicate`,
      cmd: `filter_duplicate_tabs`,
      modes: [`tabs`],
      icon: tabs_icon,
      action: (args) => {
        App.filter_duplicate(args.mode)
      },
      info: `Filter: Show duplicate tabs`,
    },
    {
      name: `Filter Unread`,
      cmd: `filter_unread_tabs`,
      modes: [`tabs`],
      icon: unread_icon,
      action: (args) => {
        App.filter_unread(args.mode)
      },
      info: `Filter: Show unread tabs`,
    },
    {
      name: `Filter Titled`,
      cmd: `filter_titled_tabs`,
      modes: [`items`],
      icon: notepad_icon,
      action: (args) => {
        App.filter_titled(args.mode)
      },
      info: `Filter: Show tabs that have a custom title`,
    },
    {
      name: `Filter Notes`,
      cmd: `filter_notes_tabs`,
      modes: [`items`],
      icon: notepad_icon,
      action: (args) => {
        App.filter_notes(args.mode)
      },
      info: `Filter: Show tabs that have notes`,
    },
    {
      name: `Filter Edited`,
      cmd: `filter_edited_tabs`,
      modes: [`items`],
      icon: notepad_icon,
      action: (args) => {
        App.filter_edited(args.mode)
      },
      info: `Filter: Show tabs that have custom properties`,
    },
    {
      name: `Filter Header`,
      cmd: `filter_header_tabs`,
      modes: [`items`],
      icon: zone_icon,
      action: (args) => {
        App.filter_header(args.mode)
      },
      info: `Filter: Show header tabs`,
    },
    {
      name: `Filter No Tab`,
      cmd: `filter_no_tab`,
      modes: [`history`, `bookmarks`, `closed`],
      icon: filter_icon,
      action: (args) => {
        App.filter_no_tab(args.mode)
      },
      info: `Filter: Show items that are not open in a tab`,
    },
    {
      name: `Custom Filters`,
      cmd: `show_custom_filters`,
      modes: [`items`],
      icon: filter_icon,
      action: (args) => {
        App.show_custom_filters(args.mode, args.e)
      },
      info: `Show the Custom Filters`,
    },
    {
      name: `Add Domain Rule`,
      cmd: `add_domain_rule`,
      modes: [`items`],
      single: true,
      icon: notepad_icon,
      action: (args) => {
        App.add_domain_rule(args.item)
      },
      info: `Shortcut to edit a domain rule`,
    },
    {
      name: `Light Colors`,
      cmd: `set_light_colors`,
      icon: theme_icon,
      action: (args) => {
        App.set_light_colors()
      },
      info: `Change to the light color theme`,
    },
    {
      name: `Dark Colors`,
      cmd: `set_dark_colors`,
      icon: theme_icon,
      action: (args) => {
        App.set_dark_colors()
      },
      info: `Change to the dark color theme`,
    },
    {
      name: `Random Light`,
      cmd: `set_random_light_colors`,
      icon: theme_icon,
      action: (args) => {
        App.random_colors(`light`)
      },
      info: `Set a random light color theme`,
    },
    {
      name: `Random Dark`,
      cmd: `set_random_dark_colors`,
      icon: theme_icon,
      action: (args) => {
        App.random_colors(`dark`)
      },
      info: `Set a random dark color theme`,
    },
    {
      name: `Background`,
      cmd: `set_background_image`,
      media: `image`,
      item: true,
      icon: theme_icon,
      action: (args) => {
        App.change_background(args.item.url)
      },
      info: `Change the background to the selected image`,
    },
    {
      name: `Restart`,
      cmd: `restart_extension`,
      icon: bot_icon,
      action: (args) => {
        App.restart_extension()
      },
      info: `Restart the extension (For debugging)`,
    }
  ]

  App.sort_commands()
}

App.update_command_history = (cmd) => {
  App.command_history = App.command_history.filter(x => x !== cmd)

  // Remove non-existent commands
  App.command_history = App.command_history.filter(x => {
    return App.commands.some(y => y.cmd === x)
  })

  App.command_history.unshift(cmd)
  App.stor_save_command_history()
  App.sort_commands()
}

App.sort_commands = () => {
  App.sorted_commands = App.commands.slice(0)

  if (!App.get_setting(`sort_commands`)) {
    return
  }

  App.sorted_commands.sort((a, b) => {
    let ia = App.command_history.indexOf(a.cmd)
    let ib = App.command_history.indexOf(b.cmd)

    if (ia !== -1 && ib !== -1) {
      return ia - ib
    }

    if (ia !== -1) {
      return -1
    }

    if (ib !== -1) {
      return 1
    }
  })
}

App.get_command = (cmd) => {
  if (!cmd || cmd === `none`) {
    return
  }

  for (let c of App.commands) {
    if (c.cmd === cmd) {
      return c
    }
  }
}

App.run_command = (args) => {
  if (!args.cmd || args.cmd === `none`) {
    return false
  }

  let command = App.get_command(args.cmd)

  if (command) {
    if (!App.check_command(command, args)) {
      return false
    }

    command.action(args)
  }

  return true
}

App.check_command = (command, args = {}) => {
  if (!command) {
    return false
  }

  let def_args = {
    active: [],
  }

  App.def_args(def_args, args)
  args.mode = App.window_mode
  args.on_items = App.on_items()
  args.on_media = App.on_media()

  if (!args.item) {
    if (args.from === `extra_menu`) {
      args.item = App.command_item
    }
    else if (args.from === `hover_menu`) {
      args.item = App.command_item
    }
    else if (args.on_items) {
      args.item = App.get_selected()
    }
    else if (args.on_media) {
      args.item = App.current_media_item()
    }
  }

  if (args.item) {
    for (let media of App.media_types) {
      if (args.item[media]) {
        args.media = media
        break
      }
    }

    if (App.get_color(args.item)) {
      args.color = App.get_color(args.item)
    }

    if (!args.active.length) {
      args.active = App.get_active_items({mode: args.mode, item: args.item})
    }

    if (args.active.length === 1) {
      args.single = true
      args.multiple = false
    }
    else {
      args.single = false
      args.multiple = true
    }

    for (let item of args.active) {
      if (args.mode === `tabs`) {
        if (item.pinned) {
          args.some_pinned = true
        }
        else {
          args.some_unpinned = true
        }

        if (item.muted) {
          args.some_muted = true
        }
        else {
          args.some_unmuted = true
        }

        if (item.discarded) {
          args.some_unloaded = true
        }
        else {
          args.some_loaded = true
        }

        if (App.get_split(item, `top`)) {
          args.some_split_top = true
        }
        else {
          args.some_not_split_top = true
        }

        if (App.get_split(item, `bottom`)) {
          args.some_split_bottom = true
        }
        else {
          args.some_not_split_bottom = true
        }

        if (args.some_split_top || args.some_split_bottom) {
          args.some_split = true
        }
        else {
          args.some_not_split = true
        }
      }

      if (App.get_tags(item).length) {
        args.some_tagged = true
      }
      else {
        args.some_untagged = true
      }
    }
  }

  let valid = true

  if (valid) {
    if (command.item) {
      if (!args.item) {
        valid = false
      }
    }
  }

  if (valid) {
    if (command.media) {
      if (command.media !== args.media) {
        valid = false
      }
    }
  }

  if (valid) {
    if (command.color) {
      if (!args.color) {
        valid = false
      }
    }
  }

  if (valid) {
    if (command.some_pinned) {
      if (!args.some_pinned) {
        valid = false
      }
    }
  }

  if (valid) {
    if (command.some_unpinned) {
      if (!args.some_unpinned) {
        valid = false
      }
    }
  }

  if (valid) {
    if (command.some_muted) {
      if (!args.some_muted) {
        valid = false
      }
    }
  }

  if (valid) {
    if (command.some_unmuted) {
      if (!args.some_unmuted) {
        valid = false
      }
    }
  }

  if (valid) {
    if (command.some_loaded) {
      if (!args.some_loaded) {
        valid = false
      }
    }
  }

  if (valid) {
    if (command.some_unloaded) {
      if (!args.some_unloaded) {
        valid = false
      }
    }
  }

  if (valid) {
    if (command.some_split) {
      if (!args.some_split) {
        valid = false
      }
    }
  }

  if (valid) {
    if (command.some_not_split) {
      if (!args.some_not_split) {
        valid = false
      }
    }
  }

  if (valid) {
    if (command.some_split_top) {
      if (!args.some_split_top) {
        valid = false
      }
    }
  }

  if (valid) {
    if (command.some_split_bottom) {
      if (!args.some_split_bottom) {
        valid = false
      }
    }
  }

  if (valid) {
    if (command.some_not_split_top) {
      if (!args.some_not_split_top) {
        valid = false
      }
    }
  }

  if (valid) {
    if (command.some_not_split_bottom) {
      if (!args.some_not_split_bottom) {
        valid = false
      }
    }
  }

  if (valid) {
    if (command.some_tagged) {
      if (!args.some_tagged) {
        valid = false
      }
    }
  }

  if (valid) {
    if (command.single) {
      if (!args.single) {
        valid = false
      }
    }
  }

  if (valid) {
    if (command.multiple) {
      if (!args.multiple) {
        valid = false
      }
    }
  }

  if (valid) {
    if (command.some_tagged) {
      if (!args.some_tagged) {
        valid = false
      }
    }
  }

  if (valid) {
    if (command.modes) {
      if (command.modes.includes(`items`)) {
        if (!args.on_items) {
          valid = false
        }
      }
      else if (command.modes.includes(`search`)) {
        if (!App.search_modes.includes(args.mode)) {
          valid = false
        }
      }
      else if (!command.modes.includes(args.mode)) {
        valid = false
      }
    }
  }

  return valid
}

// For devs to check once in a while
App.check_dead_commands = () => {
  function check (cmd, key) {
    if (cmd === `none`) {
      return
    }

    if (!App.get_command(cmd)) {
      App.error(`Dead command: ${cmd} in ${key}`)
    }
  }

  for (let key in App.setting_props) {
    let value = App.setting_props[key].value

    if (Array.isArray(value)) {
      for (let item of value) {
        if (typeof item === `object`) {
          for (let key2 in item) {
            if (key2 === `cmd` || key2 === `alt`) {
              check(item[key2], key)
            }
          }
        }
      }
    }
    else {
      let value = App.setting_props[key].value

      if (key === `double_click_command`) {
        check(value, key)
      }
      else if (key.startsWith(`middle_click_`)) {
        check(value, key)
      }
      else if (key.startsWith(`gesture_`)) {
        check(value, key)
      }
    }
  }
}

App.cmd_item = (args = {}) => {
  let def_args = {
    short: true,
    from: `cmd_item`,
  }

  App.def_args(def_args, args)

  if (!args.command) {
    args.command = App.get_command(args.cmd)
  }

  if (!args.command) {
    App.error(`${args.from} -> No command: ${args.cmd}`)
    return
  }

  return {
    e: args.e,
    icon: args.command.icon,
    text: App.command_name(args.command, args.short),
    info: args.command.info,
    action: (e) => {
      App.run_command({
        cmd: args.command.cmd,
        item: args.item,
        from: args.from,
        e: e,
      })
    },
  }
}

App.cmd_list = (cmds) => {
  let items = []

  for (let cmd of cmds) {
    items.push(App.cmd_item({cmd: cmd}))
  }

  return items
}

App.show_cmds_menu = (cmds, from, item) => {
  let items = []

  if (!cmds.length) {
    items.push({
      text: `No items yet`,
      action: (e) => {
        App.alert(`Add some in Settings`)
      },
    })
  }
  else {
    for (let obj of cmds) {
      let cmd = App.get_command(obj.cmd)

      if (!cmd) {
        continue
      }

      let cmd_obj = {
        from: from,
        item: item,
      }

      if (!App.check_command(cmd, cmd_obj)) {
        continue
      }

      let item_obj = {
        text: App.command_name(cmd),
        action: (e) => {
          cmd_obj.e = e
          cmd_obj.cmd = cmd.cmd
          App.run_command(cmd_obj)
        },
        icon: cmd.icon,
      }

      if (obj.alt) {
        let alt = App.get_command(obj.alt)

        if (alt) {
          item_obj.alt_action = (e) => {
            App.run_command({
              cmd: alt.cmd,
              from: from,
              item: item,
              e: e,
            })
          }

          item_obj.info = `Middle Click: ${alt.name}`
        }
      }

      items.push(item_obj)
    }
  }

  return items
}

App.command_name = (command, force_short) => {
  if (command.short_name && App.get_setting(`short_commands`)) {
    return command.short_name
  }
  else if (command.short_name && force_short) {
    return command.short_name
  }
  else {
    return command.name
  }
}