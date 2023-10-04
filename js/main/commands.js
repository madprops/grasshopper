App.setup_commands = () => {
  let tabs_icon =  App.mode_icons.tabs
  let bookmarks_icon = App.mode_icons.bookmarks
  let closed_icon = App.mode_icons.closed
  let settings_icon = App.settings_icons.general
  let theme_icon = App.settings_icons.theme
  let filter_icon = App.settings_icons.filter
  let browser_icon = App.browser_icon
  let clipboard_icon = App.clipboard_icon
  let audio_icon = App.get_setting(`audio_icon`)
  let profile_icon = App.profile_icon
  let tag_icon = App.tag_icon
  let playing_icon = App.get_setting(`playing_icon`)
  let bot_icon = App.bot_icon
  let command_icon = App.command_icon
  let color_filters = []
  let color_changers = []

  for (let color of App.colors) {
    let icon = App.color_icon(color)
    let name = `Filter ${App.capitalize(color)}`

    color_filters.push({
      name: name,
      cmd: `filter_${color}`,
      mode: `items`,
      icon: icon,
      action: (args) => {
        App.filter_color(args.mode, color)
      },
      info: `Filter by color: ${color}`
    })

    icon = App.color_icon(color)
    name = `Color ${App.capitalize(color)}`

    color_changers.push({
      name: name,
      cmd: `color_${color}`,
      mode: `items`,
      icon: icon,
      action: (args) => {
        App.change_color(args.item, color)
      },
      info: `Change color of profile: ${color}`
    })

    icon = App.color_icon(color)
    name = `Toggle ${App.capitalize(color)}`

    color_changers.push({
      name: name,
      cmd: `toggle_${color}`,
      mode: `items`,
      icon: icon,
      action: (args) => {
        App.change_color(args.item, color, true)
      },
      info: `Toggle color on or off: ${color}`
    })
  }

  color_changers.push({
    name: `Remove Color`,
    cmd: `remove_color`,
    mode: `items`,
    icon: theme_icon,
    action: (args) => {
      App.change_color(args.item, `none`)
    },
    info: `Remove the current color of items`
  })

  color_changers.push({
    name: `Color Menu`,
    cmd: `show_color_menu`,
    mode: `items`,
    icon: theme_icon,
    action: (args) => {
      App.show_color_menu(args.item, args.e)
    }, info: `Show the colors menu`
  })

  let media_filters = []

  for (let media of App.media_types) {
    let icon = App.get_setting(`${media}_icon`) || ``
    let name = `Filter ${App.capitalize(media)}`.trim()

    media_filters.push({
      name: name,
      cmd: `filter_${media}`,
      mode: `items`,
      icon: icon,
      action: (args) => {
        App.set_filter_mode({mode: args.mode, type: media})
      },
      info: `Filter by media: ${media}`
    })
  }

  let show_modes = []

  for (let mode of App.modes) {
    let icon = App.mode_icons[mode]
    let name = `Show ${App.get_mode_name(mode)}`

    show_modes.push({
      name: name,
      cmd: `show_${mode}`,
      icon: icon,
      action: (args) => {
        App.show_mode({mode: mode})
      },
      info: `Show mode: ${mode}`
    })
  }

  App.commands = [
    {
      name: `Go To Top`,
      cmd: `go_to_top`,
      mode: `items`,
      icon: command_icon,
      action: (args) => {
        App.goto_top()
      },
      info: `Go to the top of the list`
    },
    {
      name: `Go To Bottom`,
      cmd: `go_to_bottom`,
      mode: `items`,
      icon: command_icon,
      action: (args) => {
        App.goto_bottom()
      },
      info: `Go to the bottom of the list`
    },
    {
      name: `Step Back`,
      cmd: `step_back`,
      mode: `items`,
      icon: command_icon,
      action: (args) => {
        App.step_back()
      },
      info: `Trigger the back button`
    },
    {
      name: `Prev Tabs`,
      cmd: `prev_tabs`,
      mode: `items`,
      icon: tabs_icon,
      action: (args) => {
        App.prev_tabs()
      },
      info: `Show the recent previous tabs`
    },
    {
      name: `Select All`,
      cmd: `select_all_items`,
      mode: `items`,
      icon: command_icon,
      action: (args) => {
        App.select_all(args.mode, true)
      },
      info: `Select all items`
    },
    {
      name: App.separator_string
    },
    {
      name: `Prev Mode`,
      cmd: `prev_mode`,
      mode: `items`,
      icon: command_icon,
      action: (args) => {
        App.cycle_modes(true)
      },
      info: `Go to the previous mode`
    },
    {
      name: `Next Mode`,
      cmd: `next_mode`,
      mode: `items`,
      icon: command_icon,
      action: (args) => {
        App.cycle_modes()
      },
      info: `Go to the next mode`
    },

    ...show_modes,

    {
      name: `Show Primary`,
      cmd: `show_primary`,
      icon: command_icon,
      action: (args) => {
        App.show_primary_mode()
      },
      info: `Show the primary mode`
    },
    {
      name: `Show Settings`,
      cmd: `show_settings`,
      icon: settings_icon,
      action: (args) => {
        App.show_settings()
      },
      info: `Show the settings`
    },
    {
      name: `Show About`,
      cmd: `show_about`,
      icon: command_icon,
      action: (args) => {
        App.show_about()
      },
      info: `Show the about window`
    },
    {
      name: `Show Palette`,
      cmd: `show_palette`,
      icon: command_icon,
      action: (args) => {
        App.show_palette()
      },
      info: `Show the palette`
    },
    {
      name: `Item Menu`,
      cmd: `show_item_menu`,
      mode: `items`,
      icon: command_icon,
      action: (args) => {
        App.show_item_menu_2(args.item)
      },
      info: `Show the item menu`
    },
    {
      name: `Show All`,
      cmd: `show_all_items`,
      mode: `items`,
      icon: command_icon,
      action: (args) => {
        App.show_all()
      },
      info: `Show all items`
    },
    {
      name: App.separator_string
    },
    {
      name: `Item Action`,
      cmd: `item_action`,
      mode: `items`,
      icon: command_icon,
      action: (args) => {
        App[`${args.mode}_action`](args.item)
      },
      info: `Trigger the action for the selected item`
    },
    {
      name: `Open`,
      cmd: `open_items`,
      mode: `items`,
      icon: command_icon,
      action: (args) => {
        App.open_items(args.item, true)
      },
      info: `Open items`
    },
    {
      name: `Bookmark`,
      cmd: `bookmark_items`,
      mode: `items`,
      icon: bookmarks_icon,
      action: (args) => {
        App.bookmark_items(args.item)
      },
      info: `Bookmark this item`
    },
    {
      name: `Bookmark Page`,
      cmd: `bookmark_page`,
      icon: bookmarks_icon,
      action: (args) => {
        App.bookmark_active(args.item)
      },
      info: `Bookmark the current page`
    },
    {
      name: `Copy URL`,
      cmd: `copy_item_url`,
      mode: `items`,
      icon: clipboard_icon,
      action: (args) => {
        App.copy_url(args.item)
      },
      info: `Copy the URL of an item`
    },
    {
      name: `Copy Title`,
      cmd: `copy_item_title`,
      mode: `items`,
      icon: clipboard_icon,
      action: (args) => {
        App.copy_title(args.item)
      },
      info: `Copy the title of an item`
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
      info: `Go back in browser history`
    },
    {
      name: `Go Forward`,
      cmd: `browser_forward`,
      icon: browser_icon,
      action: (args) => {
        App.browser_forward()
      },
      info: `Go forward in browser history`
    },
    {
      name: `Reload Page`,
      cmd: `browser_reload`,
      icon: browser_icon,
      action: (args) => {
        App.browser_reload()
      },
      info: `Reload the current page`
    },
    {
      name: App.separator_string
    },
    {
      name: `New`,
      cmd: `new_tab`,
      icon: tabs_icon,
      action: (args) => {
        App.new_tab()
      },
      info: `Open a new tab`
    },
    {
      name: `Unload`,
      cmd: `unload_tabs`,
      mode: `tabs`,
      icon: tabs_icon,
      action: (args) => {
        App.unload_tabs(args.item)
      },
      info: `Unload tabs`
    },
    {
      name: `Load`,
      cmd: `load_tabs`,
      mode: `tabs`,
      icon: tabs_icon,
      action: (args) => {
        App.load_tabs(args.item)
      },
      info: `Load tabs that are unloaded`
    },
    {
      name: `Duplicate`,
      cmd: `duplicate_tabs`,
      mode: `tabs`,
      icon: tabs_icon,
      action: (args) => {
        App.duplicate_tabs(args.item)
      },
      info: `Duplicate tabs`
    },
    {
      name: `Detach`,
      cmd: `detach_tabs`,
      mode: `tabs`,
      icon: tabs_icon,
      action: (args) => {
        App.detach_tabs(args.item)
      },
      info: `Detach tabs to another window`
    },
    {
      name: `To Window`,
      cmd: `show_window_menu`,
      mode: `tabs`,
      icon: tabs_icon,
      action: (args) => {
        App.to_window(args.item)
      },
      info: `Detach tabs to another window`
    },
    {
      name: `Move To Top`,
      cmd: `move_tabs_to_top`,
      mode: `tabs`,
      icon: tabs_icon,
      action: (args) => {
        App.move_tabs_vertically(`top`)
      },
      info: ``
    },
    {
      name: `Move To Bottom`,
      cmd: `move_tabs_to_bottom`,
      mode: `tabs`,
      icon: tabs_icon,
      action: (args) => {
        App.move_tabs_vertically(`bottom`)
      },
      info: `Move tabs to the top`
    },
    {
      name: `Pin`,
      cmd: `pin_tabs`,
      mode: `tabs`,
      icon: tabs_icon,
      action: (args) => {
        App.pin_tabs(args.item)
      },
      info: `Pin tabs`
    },
    {
      name: `Unpin`,
      cmd: `unpin_tabs`,
      mode: `tabs`,
      icon: tabs_icon,
      action: (args) => {
        App.unpin_tabs(args.item)
      },
      info: `Unpin tabs`
    },
    {
      name: `Toggle Pin`,
      cmd: `toggle_pin_tabs`,
      mode: `tabs`,
      icon: tabs_icon,
      action: (args) => {
        App.toggle_pin_tabs(args.item)
      },
      info: `Pin or unpin tabs`
    },
    {
      name: `Mute`,
      cmd: `mute_tabs`,
      mode: `tabs`,
      icon: tabs_icon,
      action: (args) => {
        App.mute_tabs(args.item)
      },
      info: `Mute tabs`
    },
    {
      name: `Unmute`,
      cmd: `unmute_tabs`,
      mode: `tabs`,
      icon: tabs_icon,
      action: (args) => {
        App.unmute_tabs(args.item)
      },
      info: `Unmite tabs`
    },
    {
      name: `Toggle Mute`,
      cmd: `toggle_mute_tabs`,
      mode: `tabs`,
      icon: tabs_icon,
      action: (args) => {
        App.toggle_mute_tabs(args.item)
      },
      info: `Mute or unmute tabs`
    },
    {
      name: `Close`,
      cmd: `close_tabs`,
      mode: `tabs`,
      icon: tabs_icon,
      action: (args) => {
        App.close_tabs(args.item)
      },
      info: `Close tabs`
    },
    {
      name: `Close Menu`,
      cmd: `show_close_tabs_menu`,
      mode: `items`,
      icon: tabs_icon,
      action: (args) => {
        App.close_tabs_menu(args.e)
      },
      info: `Open the menu with some tab closing options`
    },
    {
      name: `Close Normal`,
      cmd: `close_normal_tabs`,
      mode: `items`,
      icon: tabs_icon,
      action: (args) => {
        App.close_tabs_popup(`normal`)
      },
      info: `Close normal tabs`
    },
    {
      name: `Close Playing`,
      cmd: `close_playing_tabs`,
      mode: `items`,
      icon: tabs_icon,
      action: (args) => {
        App.close_tabs_popup(`playing`)
      },
      info: `Close playing tabs`
    },
    {
      name: `Close Unloaded`,
      cmd: `close_unloaded_tabs`,
      mode: `items`,
      icon: tabs_icon,
      action: (args) => {
        App.close_tabs_popup(`unloaded`)
      },
      info: `Close unloaded tabs`
    },
    {
      name: `Close Duplicate`,
      cmd: `close_duplicate_tabs`,
      mode: `items`,
      icon: tabs_icon,
      action: (args) => {
        App.close_tabs_popup(`duplicate`)
      },
      info: `Close duplicate tabs`
    },
    {
      name: `Close Visible`,
      cmd: `close_visible_tabs`,
      mode: `items`,
      icon: tabs_icon,
      action: (args) => {
        App.close_tabs_popup(`visible`)
      },
      info: `Close visible tabs`
    },
    {
      name: `Go To Playing`,
      cmd: `go_to_playing_tab`,
      icon: tabs_icon,
      action: (args) => {
        App.go_to_playing_tab()
      },
      info: `Go the tab emitting sound`
    },
    {
      name: `Sort`,
      cmd: `sort_tabs`,
      mode: `items`,
      icon: tabs_icon,
      action: (args) => {
        App.sort_tabs()
      },
      info: `Open the sort tabs window`
    },
    {
      name: `Show Info`,
      cmd: `show_tabs_info`,
      mode: `items`,
      icon: tabs_icon,
      action: (args) => {
        App.show_tabs_info()
      },
      info: `Show some tab info`
    },
    {
      name: `Show URLs`,
      cmd: `show_tab_urls`,
      mode: `items`,
      icon: tabs_icon,
      action: (args) => {
        App.show_urls()
      },
      info: `Show a list of open URLs`
    },
    {
      name: `Open URLs`,
      cmd: `open_tab_urls`,
      mode: `items`,
      icon: tabs_icon,
      action: (args) => {
        App.open_urls()
      },
      info: `Open a list of URLs`
    },
    {
      name: `Reopen`,
      cmd: `reopen_tab`,
      icon: tabs_icon,
      action: (args) => {
        App.reopen_tab()
      },
      info: `Reopen the latest closed tab`
    },
    {
      name: `Select Pins`,
      cmd: `select_pinned_tabs`,
      mode: `tabs`,
      icon: tabs_icon,
      action: (args) => {
        App.select_tabs(`pins`)
      },
      info: `Select all pinned tabs`
    },
    {
      name: `Select Normal`,
      cmd: `select_normal_tabs`,
      mode: `tabs`,
      icon: tabs_icon,
      action: (args) => {
        App.select_tabs(`normal`)
      },
      info: `Select all normal tabs`
    },
    {
      name: App.separator_string
    },
    {
      name: `Filter History`,
      cmd: `filter_history`,
      icon: filter_icon,
      mode: `items`,
      action: (args) => {
        App.show_filter_history(args.mode, args.e)
      },
      info: `Show the filter history`
    },
    {
      name: `Deep Search`,
      cmd: `deep_search`,
      icon: filter_icon,
      mode: `search`,
      action: (args) => {
        App.deep_search(args.mode)
      },
      info: `Do a deep search`
    },
    {
      name: `Search Media`,
      cmd: `search_media`,
      icon: audio_icon,
      mode: `items`,
      action: (args) => {
        App.search_media(args.mode, args.e)
      },
      info: `Search for media`
    },
    {
      name: `Forget Closed`,
      cmd: `forget_closed`,
      icon: closed_icon,
      mode: `closed`,
      action: (args) => {
        App.forget_closed()
      },
      info: `Forget closed items`
    },
    {
      name: App.separator_string
    },
    {
      name: `Edit Profile`,
      cmd: `edit_profile`,
      icon: profile_icon,
      mode: `items`,
      action: (args) => {
        App.edit_profiles(args.item)
      },
      info: `Edit the profile of a URL`
    },
    {
      name: `Add Note`,
      cmd: `add_note`,
      icon: App.get_setting(`notes_icon`),
      mode: `items`,
      action: (args) => {
        App.add_note(args.item)
      },
      info: `Add notes to a profile`
    },
    {
      name: `Add Tag`,
      cmd: `add_tag`,
      icon: tag_icon,
      mode: `items`,
      action: (args) => {
        App.add_tag(args.item)
      },
      info: `Add tags to a profile`
    },
    {
      name: `Edit Title`,
      cmd: `edit_title`,
      icon: profile_icon,
      mode: `items`,
      action: (args) => {
        App.edit_title(args.item)
      },
      info: `Edit a profile's title`
    },
    {
      name: `Edit Icon`,
      cmd: `edit_icon`,
      icon: profile_icon,
      mode: `items`,
      action: (args) => {
        App.edit_icon(args.item)
      },
      info: `Edit a profile's icon`
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
      icon: filter_icon,
      mode: `items`,
      action: (args) => {
        App.filter_domain(args.item)
      },
      info: `Filter by domain`
    },
    {
      name: `Filter Color`,
      cmd: `filter_color`,
      icon: theme_icon,
      mode: `items`,
      color: true,
      action: (args) => {
        App.filter_color(args.mode, args.item.color)
      },
      info: `Filter by color`
    },
    {
      name: `Filter Playing`,
      cmd: `filter_playing`,
      icon: playing_icon,
      mode: `tabs`,
      action: (args) => {
        App.set_filter_mode({mode: args.mode, type: `playing`})
      },
      info: `Filter by playing`
    },
    {
      name: `Filter Edited`,
      cmd: `filter_edited`,
      icon: profile_icon,
      mode: `items`,
      action: (args) => {
        App.set_filter_mode({mode: args.mode, type: `edited`})
      },
      info: `Filter by edited`
    },
    {
      name: App.separator_string
    },
    {
      name: `Dark Colors`,
      cmd: `dark_colors`,
      icon: theme_icon,
      action: (args) => {
        App.set_dark_colors()
      },
      info: `Change to the dark color theme`
    },
    {
      name: `Light Colors`,
      cmd: `light_colors`,
      icon: theme_icon,
      action: (args) => {
        App.set_light_colors()
      },
      info: `Change to the light color theme`
    },
    {
      name: `Random Dark`,
      cmd: `random_dark_colors`,
      icon: theme_icon,
      action: (args) => {
        App.random_colors(`dark`)
      },
      info: `Change to the dark color theme`
    },
    {
      name: `Random Light`,
      cmd: `random_light_colors`,
      icon: theme_icon,
      action: (args) => {
        App.random_colors(`light`)
      },
      info: `Change to the light color theme`
    },
    {
      name: `Background`,
      cmd: `change_background`,
      media: `image`,
      icon: theme_icon,
      action: (args) => {
        App.change_background(args.item.url)
      },
      info: `Change the background to the selected image`
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
      info: `Restart the extension (For debugging)`
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
    if (args.on_items) {
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

    if (args.item.color) {
      args.color = args.item.color
    }
  }

  let valid = true

  if (command) {
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
      if (command.mode) {
        if (command.mode === `items`) {
          if (!args.on_items) {
            valid = false
          }
        }
        else if (command.mode === `search`) {
          if (!App.search_modes.includes(args.mode)) {
            valid = false
          }
        }
        else if (command.mode !== args.mode) {
          valid = false
        }
      }
    }
  }

  return valid
}