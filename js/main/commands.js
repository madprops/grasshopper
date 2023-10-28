App.setup_commands = () => {
  let command_icon = App.command_icon
  let pin_icon = App.get_setting(`pin_icon`)
  let normal_icon = App.get_setting(`normal_icon`)
  let playing_icon = App.get_setting(`playing_icon`)
  let loaded_icon = App.get_setting(`loaded_icon`)
  let unloaded_icon = App.get_setting(`unloaded_icon`)
  let muted_icon = App.get_setting(`muted_icon`)
  let unread_icon = App.get_setting(`unread_icon`)
  let step_back_icon = App.create_icon(`back`)
  let settings_icon = App.settings_icons.general
  let theme_icon = App.settings_icons.theme
  let filter_icon = App.settings_icons.filter
  let media_icon = App.settings_icons.media
  let tabs_icon =  App.mode_icons.tabs
  let bookmarks_icon = App.mode_icons.bookmarks
  let closed_icon = App.mode_icons.closed
  let browser_icon = App.browser_icon
  let clipboard_icon = App.clipboard_icon
  let edit_icon = App.edit_icon
  let bot_icon = App.bot_icon
  let up_icon = App.up_arrow_icon
  let down_icon = App.down_arrow_icon
  let heart_icon = App.heart_icon
  let close_icon = App.close_icon
  let tag_icon = App.tag_icon
  let color_filters = []
  let color_changers = []
  let color_removers = []
  let color_closers = []

  color_filters.push({
    name: `Filter All Colors`,
    cmd: `filter_color_all`,
    modes: [`items`],
    icon: filter_icon,
    action: (args) => {
      App.filter_color(args.mode, `all`)
    },
    info: `Filter: Show all colors`,
  })

  for (let color of App.colors) {
    let icon, name
    icon = filter_icon
    name = `Filter ${App.capitalize(color)}`

    color_filters.push({
      name: name,
      cmd: `filter_color_${color}`,
      modes: [`tabs`],
      icon: icon,
      action: (args) => {
        App.filter_color(args.mode, color)
      },
      info: `Filter tabs with this color (${color})`,
    })

    icon = App.color_icon(color)
    name = `Color ${App.capitalize(color)}`

    color_changers.push({
      name: name,
      cmd: `color_${color}`,
      modes: [`tabs`],
      item: true,
      icon: icon,
      action: (args) => {
        App.edit_tab_color({item: args.item, color: color})
      },
      info: `Add a custom color to tabs (${color})`,
    })

    icon = App.color_icon(color)
    name = `Toggle ${App.capitalize(color)}`

    color_changers.push({
      name: name,
      cmd: `toggle_color_${color}`,
      modes: [`tabs`],
      item: true,
      icon: icon,
      action: (args) => {
        App.edit_tab_color({item: args.item, color: color, toggle: true})
      },
      info: `Toggle color on or off (${color})`,
    })

    icon = theme_icon
    name = `Remove ${App.capitalize(color)}`

    color_removers.push({
      name: name,
      cmd: `remove_color_${color}`,
      modes: [`tabs`],
      icon: icon,
      action: (args) => {
        App.remove_color(color)
      },
      info: `Remove color from tabs (${color})`,
    })

    icon = App.close_icon
    name = `Close ${App.capitalize(color)}`

    color_closers.push({
      name: name,
      cmd: `close_color_${color}`,
      modes: [`tabs`],
      icon: icon,
      action: (args) => {
        App.close_color(color)
      },
      info: `Close tabs with this color (${color})`,
    })
  }

  color_filters.push({
    name: `Filter Color Menu`,
    cmd: `show_filter_color_menu`,
    modes: [`items`],
    item: true,
    icon: filter_icon,
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
      App.remove_edits({what: `color`})
    },
    info: `Remove all colors from tabs`,
  })

  color_closers.push({
    name: `Close Color`,
    cmd: `show_close_color_menu`,
    modes: [`tabs`],
    item: true,
    icon: close_icon,
    action: (args) => {
      App.show_close_color_menu(args.item, args.e)
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
      icon: step_back_icon,
      action: (args) => {
        App.step_back()
      },
      info: `Trigger the back button`,
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
      name: App.separator_string
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
      info: `Show the settings`,
    },
    {
      name: `Show About`,
      cmd: `show_about`,
      icon: bot_icon,
      action: (args) => {
        App.show_about()
      },
      info: `Show the about window`,
    },
    {
      name: `Show Palette`,
      cmd: `show_palette`,
      icon: command_icon,
      action: (args) => {
        App.show_palette()
      },
      info: `Show the palette`,
    },
    {
      name: `Toggle Header`,
      cmd: `toggle_header`,
      icon: command_icon,
      action: (args) => {
        App.toggle_header()
      },
      info: `Show or hide the header`,
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
      info: `Show the item menu`,
    },
    {
      name: `Favorites`,
      cmd: `show_favorites_menu`,
      modes: [`items`],
      item: true,
      icon: heart_icon,
      action: (args) => {
        App.show_favorites_menu(args.item)
      },
      info: `Show the favorites menu`,
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
      name: App.separator_string
    },
    {
      name: `Item Action`,
      cmd: `item_action`,
      modes: [`items`],
      item: true,
      icon: command_icon,
      action: (args) => {
        App[`${args.mode}_action`](args.item)
      },
      info: `Trigger the action for the selected item`,
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
      icon: clipboard_icon,
      action: (args) => {
        App.copy_title(args.item)
      },
      info: `Copy the title of an item`,
    },
    {
      name: App.separator_string
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
      name: App.separator_string
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
      info: `Unload all tabs except the active one`,
    },
    {
      name: `Load`,
      cmd: `load_tabs`,
      modes: [`tabs`],
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
      name: `Detach`,
      cmd: `detach_tabs`,
      modes: [`tabs`],
      item: true,
      icon: tabs_icon,
      action: (args) => {
        App.detach_tabs(args.item)
      },
      info: `Detach tabs to another window`,
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
      info: `Detach tabs to another window`,
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
      info: ``,
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
      info: `Move tabs to the top`,
    },
    {
      name: `Pin`,
      cmd: `pin_tabs`,
      modes: [`tabs`],
      item: true,
      icon: tabs_icon,
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
      icon: tabs_icon,
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
      icon: tabs_icon,
      action: (args) => {
        App.toggle_pin_tabs(args.item)
      },
      info: `Pin or unpin tabs`,
    },
    {
      name: `Mute`,
      cmd: `mute_tabs`,
      modes: [`tabs`],
      item: true,
      icon: muted_icon || command_icon,
      action: (args) => {
        App.mute_tabs(args.item)
      },
      info: `Mute tabs`,
    },
    {
      name: `Unmute`,
      cmd: `unmute_tabs`,
      modes: [`tabs`],
      item: true,
      icon: muted_icon || command_icon,
      action: (args) => {
        App.unmute_tabs(args.item)
      },
      info: `Unmite tabs`,
    },
    {
      name: `Toggle Mute`,
      cmd: `toggle_mute_tabs`,
      modes: [`tabs`],
      item: true,
      icon: muted_icon || command_icon,
      action: (args) => {
        App.toggle_mute_tabs(args.item)
      },
      info: `Mute or unmute tabs`,
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
        App.show_close_tabs_menu(args.e)
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
      name: `Select Pins`,
      cmd: `select_pinned_tabs`,
      modes: [`tabs`],
      icon: pin_icon || tabs_icon,
      action: (args) => {
        App.select_tabs(`pins`)
      },
      info: `Select all pinned tabs`,
    },
    {
      name: `Select Normal`,
      cmd: `select_normal_tabs`,
      modes: [`tabs`],
      icon: normal_icon || tabs_icon,
      action: (args) => {
        App.select_tabs(`normal`)
      },
      info: `Select all normal tabs`,
    },
    {
      name: App.separator_string
    },
    {
      name: `Filter History`,
      cmd: `show_filter_history`,
      modes: [`items`],
      icon: filter_icon,
      action: (args) => {
        App.show_filter_history(args.mode, args.e)
      },
      info: `Show the filter history`,
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
      name: App.separator_string
    },
    {
      name: `Edit Title`,
      short_name: `Title`,
      cmd: `edit_title`,
      modes: [`tabs`],
      item: true,
      icon: edit_icon,
      action: (args) => {
        App.edit_title(args.item)
      },
      info: `Edit tab titles`,
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

    ...color_removers,

    {
      name: `Remove All Titles`,
      cmd: `remove_all_titles`,
      modes: [`tabs`],
      icon: edit_icon,
      action: (args) => {
        App.remove_edits({what: `title`})
      },
      info: `Remove all titles from tabs`,
    },
    {
      name: `Remove Tag`,
      cmd: `remove_tag`,
      modes: [`tabs`],
      icon: tag_icon,
      action: (args) => {
        App.remove_tag_all()
      },
      info: `Remove a specific tag from tabs`,
    },
    {
      name: `Remove All Tags`,
      cmd: `remove_all_tags`,
      modes: [`tabs`],
      icon: tag_icon,
      action: (args) => {
        App.remove_edits({what: `tags`})
      },
      info: `Remove all tags from tabs`,
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
      cmd: `close_tag`,
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
      icon: edit_icon,
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
      icon: edit_icon,
      action: (args) => {
        App.remove_item_edits(args.item)
      },
      info: `Remove all edits from specific items`,
    },
    {
      name: App.separator_string
    },

    ...color_changers,

    {
      name: App.separator_string
    },

    ...media_filters,
    ...color_filters,

    {
      name: `Filter Domain`,
      cmd: `filter_domain`,
      modes: [`items`],
      item: true,
      icon: filter_icon,
      action: (args) => {
        App.filter_domain(args.item)
      },
      info: `Filter: Show same domain`,
    },
    {
      name: `Filter Color`,
      cmd: `filter_color`,
      modes: [`items`],
      item: true,
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
      item: true,
      icon: tag_icon,
      action: (args) => {
        App.filter_tag_pick(args.item, args.e)
      },
      info: `Filter by picking a tab`,
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
      icon: pin_icon || tabs_icon,
      action: (args) => {
        App.filter_pinned(args.mode)
      },
      info: `Filter: Show pinned tabs`,
    },
    {
      name: `Filter Normal`,
      cmd: `filter_normal_tabs`,
      modes: [`tabs`],
      icon: normal_icon || tabs_icon,
      action: (args) => {
        App.filter_normal(args.mode)
      },
      info: `Filter: Show normal tabs`,
    },
    {
      name: `Filter Playing`,
      cmd: `filter_playing_tabs`,
      modes: [`tabs`],
      icon: playing_icon || tabs_icon,
      action: (args) => {
        App.filter_playing(args.mode)
      },
      info: `Filter: Show playing tabs`,
    },
    {
      name: `Filter Loaded`,
      cmd: `filter_loaded_tabs`,
      modes: [`tabs`],
      icon: loaded_icon || tabs_icon,
      action: (args) => {
        App.filter_loaded(args.mode)
      },
      info: `Filter: Show loaded tabs`,
    },
    {
      name: `Filter Unloaded`,
      cmd: `filter_unloaded_tabs`,
      modes: [`tabs`],
      icon: unloaded_icon || tabs_icon,
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
      icon: unread_icon || tabs_icon,
      action: (args) => {
        App.filter_unread(args.mode)
      },
      info: `Filter: Show unread tabs`,
    },
    {
      name: `Filter Titled`,
      cmd: `filter_titled_tabs`,
      modes: [`tabs`],
      icon: edit_icon,
      action: (args) => {
        App.filter_titled(args.mode)
      },
      info: `Filter: Show tabs that have a custom title`,
    },
    {
      name: `Filter Edited`,
      cmd: `filter_edited_tabs`,
      modes: [`tabs`],
      icon: edit_icon,
      action: (args) => {
        App.filter_edited(args.mode)
      },
      info: `Filter: Show tabs that have custom properties`,
    },
    {
      name: `Filter No Tab`,
      cmd: `filter_no_tab`,
      modes: [`history`, `bookmarks`, `closed`],
      icon: filter_icon,
      action: (args) => {
        App.filter_no_tab(args.mode)
      },
      info: `Filter: Show duplicate tabs`,
    },
    {
      name: App.separator_string
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
      info: `Change to the light color theme`,
    },
    {
      name: `Random Dark`,
      cmd: `set_random_dark_colors`,
      icon: theme_icon,
      action: (args) => {
        App.random_colors(`dark`)
      },
      info: `Change to the dark color theme`,
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
      name: App.separator_string
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
  App.sorted_commands = App.commands.filter(x => !x.name.startsWith(`--`)).slice(0)

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
  for (let c of App.commands) {
    if (c.cmd === cmd) {
      return c
    }
  }
}

App.run_command = (args) => {
  if (!args.cmd || args.cmd === `none`) {
    return
  }

  let command = App.get_command(args.cmd)

  if (command) {
    if (!App.check_command(command, args)) {
      return
    }

    command.action(args)
  }
}

App.check_command = (command, args) => {
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
  }

  let valid = true

  if (command) {
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
            if (key2 === `cmd`) {
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
  let cmd = App.get_command(args.cmd)

  if (!cmd) {
    App.error(`${args.from} -> No command: ${args.cmd}`)
    return
  }

  let name

  if (args.short) {
    name = cmd.short_name || cmd.name
  }
  else {
    name = cmd.name
  }

  return {
    icon: cmd.icon,
    text: name,
    action: (e) => {
      App.run_command({
        cmd: cmd.cmd,
        item: args.item,
        from: args.from,
        e: e,
      })
    },
    direct: true,
  }
}