App.setup_commands = () => {
  let color_filters = []

  for (let color in App.colors) {
    let icon = App.color_emojis[color]
    let name = `${icon} Filter ${App.capitalize(color)}`

    color_filters.push({name: name, cmd: `filter_${color}`, mode: `items`, action: (args) => {
      App.filter_color(args.mode, color)
    }})
  }

  let color_changers = []

  for (let color in App.colors) {
    let icon = App.color_emojis[color]
    let name = `${icon} Color ${App.capitalize(color)}`

    color_changers.push({name: name, cmd: `color_${color}`, mode: `items`, action: (args) => {
      App.change_color(args.item, color)
    }})
  }

  let media_filters = []

  for (let media of App.media_types) {
    let icon = App.get_setting(`${media}_icon`) || ``
    let name = `${icon} Filter ${App.capitalize(media)}`.trim()

    media_filters.push({name: name, cmd: `filter_${media}`, mode: `items`, action: (args) => {
      App.change_filter_mode(args.mode, media)
    }})
  }

  let show_modes = []

  for (let mode of App.modes) {
    let icon = App.mode_emojis[mode]
    let name = `${icon} Show ${App.get_mode_name(mode)}`

    show_modes.push({name: name, cmd: `show_${mode}`, action: (args) => {
      App.show_mode(mode)
    }})
  }

  App.commands = [
    {name: `Go To Top`, cmd: `go_to_top`, mode: `items`, action: (args) => {
      App.goto_top()
    }},
    {name: `Go To Bottom`, cmd: `go_to_bottom`, mode: `items`, action: (args) => {
      App.goto_bottom()
    }},
    {name: `Step Back`, cmd: `step_back`, mode: `items`, action: (args) => {
      App.step_back()
    }},
    {name: `Select All`, cmd: `select_all`, mode: `items`, action: (args) => {
      App.select_all()
    }},
    {name: `Scroll Up`, cmd: `scroll_up`, mode: `items`, action: (args) => {
      App.scroll(args.mode, `up`, true)
    }},
    {name: `Scroll Down`, cmd: `scroll_down`, mode: `items`, action: (args) => {
      App.scroll(args.mode, `down`, true)
    }},

    {name: App.separator_string},

    {name: `Prev Mode`, cmd: `prev_mode`, mode: `items`, action: (args) => {
      App.cycle_modes(true)
    }},
    {name: `Next Mode`, cmd: `next_mode`, mode: `items`, action: (args) => {
      App.cycle_modes()
    }},
    ...show_modes,
    {name: `Show Main`, cmd: `show_main`, action: (args) => {
      App.show_main_mode()
    }},
    {name: `Show Settings`, cmd: `show_settings`, action: (args) => {
      App.show_settings()
    }},
    {name: `Show About`, cmd: `show_about`, action: (args) => {
      App.show_window(`about`)
    }},
    {name: `Show Palette`, cmd: `show_palette`, action: (args) => {
      App.show_palette()
    }},
    {name: `Show All`, cmd: `show_all`, mode: `items`, action: (args) => {
      App.show_all()
    }},

    {name: App.separator_string},

    {name: `Open`, cmd: `open_items`, mode: `items`, action: (args) => {
      App.open_items(args.mode, true)
    }},
    {name: `Bookmark`, cmd: `bookmark_items`, mode: `items`, action: (args) => {
      App.bookmark_items(args.item)
    }},
    {name: `Bookmark Active`, cmd: `bookmark_active`, action: (args) => {
      App.bookmark_active(args.item)
    }},
    {name: `Copy URL`, cmd: `copy_item_url`, mode: `items`, action: (args) => {
      App.copy_url(args.item)
    }},
    {name: `Copy Title`, cmd: `copy_item_title`, mode: `items`, action: (args) => {
      App.copy_title(args.item)
    }},
    {name: `Background`, cmd: `set_background`, media: `image`, action: (args) => {
      App.change_background(args.item.url)
    }},

    {name: App.separator_string},

    {name: `Back`, cmd: `browser_back`, action: (args) => {
      App.browser_back()
    }},
    {name: `Forward`, cmd: `browser_forward`, action: (args) => {
      App.browser_forward()
    }},
    {name: `Reload`, cmd: `browser_reload`, action: (args) => {
      App.browser_reload()
    }},

    {name: App.separator_string},

    {name: `New Tab`, cmd: `new_tab`, mode: `tabs`, action: (args) => {
      App.new_tab()
    }},
    {name: `Unload`, cmd: `unload_tabs`, mode: `tabs`, action: (args) => {
      App.unload_tabs()
    }},
    {name: `Duplicate`, cmd: `duplicate_tab`, mode: `tabs`, action: (args) => {
      App.duplicate_tabs()
    }},
    {name: `Detach`, cmd: `detach_tabs`, mode: `tabs`, action: (args) => {
      App.detach_tabs()
    }},
    {name: `Move To Top`, cmd: `tabs_to_top`, mode: `tabs`, action: (args) => {
      App.move_tabs_vertically(`top`)
    }},
    {name: `Move To Bottom`, cmd: `tabs_to_bottom`, mode: `tabs`, action: (args) => {
      App.move_tabs_vertically(`bottom`)
    }},
    {name: `Pin`, cmd: `pin_tabs`, mode: `tabs`, action: (args) => {
      App.pin_tabs()
    }},
    {name: `Unpin`, cmd: `unpin_tabs`, mode: `tabs`, action: (args) => {
      App.unpin_tabs()
    }},
    {name: `Toggle Pin`, cmd: `toggle_pin_tabs`, mode: `tabs`, action: (args) => {
      App.toggle_pin_tabs()
    }},
    {name: `Mute`, cmd: `mute_tabs`, mode: `tabs`, action: (args) => {
      App.mute_tabs()
    }},
    {name: `Unmute`, cmd: `unmute_tabs`, mode: `tabs`, action: (args) => {
      App.unmute_tabs()
    }},
    {name: `Toggle Mute`, cmd: `toggle_mute_tabs`, mode: `tabs`, action: (args) => {
      App.toggle_mute_tabs()
    }},
    {name: `Close`, cmd: `close_tabs`, mode: `tabs`, action: (args) => {
      App.close_tabs()
    }},
    {name: `Close Normal`, cmd: `close_normal_tabs`, mode: `tabs`, action: (args) => {
      App.close_normal_tabs()
    }},
    {name: `Close Duplicates`, cmd: `close_duplicate_tabs`, mode: `tabs`, action: (args) => {
      App.close_duplicate_tabs()
    }},
    {name: `Go To Playing`, cmd: `go_to_playing_tab`, mode: `tabs`, action: (args) => {
      App.go_to_playing_tab()
    }},
    {name: `Tabs Info`, cmd: `tabs_info`, mode: `tabs`, action: (args) => {
      App.show_tabs_info()
    }},
    {name: `Undo Close`, cmd: `undo_close_tab`, action: (args) => {
      App.undo_close_tab()
    }},
    {name: `Select Pins`, cmd: `select_pinned_tabs`, mode: `tabs`, action: (args) => {
      App.select_pinned_tabs()
    }},
    {name: `Select Normal`, cmd: `select_normal_tabs`, mode: `tabs`, action: (args) => {
      App.select_normal_tabs()
    }},

    {name: App.separator_string},

    {name: `Filter Domain`, cmd: `filter_domain`, mode: `items`, action: (args) => {
      App.filter_domain(args.item)
    }},
    {name: `Filter Playing`, cmd: `filter_playing`, mode: `tabs`, action: (args) => {
      App.change_filter_mode(args.mode, `playing`)
    }},
    {name: `Filter Edited`, cmd: `filter_edited`, mode: `items`, action: (args) => {
      App.change_filter_mode(args.mode, `edited`)
    }},
    ...media_filters,
    ...color_filters,

    {name: App.separator_string},

    {name: `Edit Profiles`, cmd: `edit_profiles`, mode: `items`, action: (args) => {
      App.edit_profiles(args.item)
    }},
    {name: `Add Tags`, cmd: `add_tags`, mode: `items`, action: (args) => {
      App.add_tags(args.item)
    }},
    {name: `Add Notes`, cmd: `add_notes`, mode: `items`, action: (args) => {
      App.add_notes(args.item)
    }},
    ...color_changers,

    {name: App.separator_string},

    {name: `Random Theme`, cmd: `random_theme`, action: (args) => {
      App.random_theme()
    }},
    {name: `🤖 Restart`, cmd: `restart_extension`, action: (args) => {
      App.restart_extension()
    }},
  ]

  App.cmds = App.commands.filter(x => !x.name.startsWith(`--`)).map(x => x.cmd)
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
  }

  let valid = false

  if (command) {
    if (command.mode) {
      if (command.mode === `items`) {
        if (args.on_items) {
          valid = true
        }
      }
      else if (command.mode === args.mode) {
        valid = true
      }
    }
    else if (command.media) {
      if (command.media === args.media) {
        valid = true
      }
    }
    else {
      valid = true
    }
  }

  return valid
}