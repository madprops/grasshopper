App.commands = [
  {name: `Go To Top`, cmd: `go_to_top`, mode: `items`, action: (args) => {
    App.goto_top()
  }},
  {name: `Go To Bottom`, cmd: `go_to_bottom`, mode: `items`, action: (args) => {
    App.goto_bottom()
  }},
  {name: `Go Back`, cmd: `go_back`, mode: `items`, action: (args) => {
    App.back_action()
  }},
  {name: `Filter Domain`, cmd: `filter_domain`, mode: `items`, action: (args) => {
    App.filter_domain(args.item)
  }},
  {name: `Select All`, cmd: `select_all`, mode: `items`, action: (args) => {
    App.highlight_items()
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
  {name: `Show Tabs`, cmd: `show_tabs`, action: (args) => {
    App.show_mode(`tabs`)
  }},
  {name: `Show History`, cmd: `show_history`, action: (args) => {
    App.show_mode(`history`)
  }},
  {name: `Show Bookmarks`, cmd: `show_bookmarks`, action: (args) => {
    App.show_mode(`bookmarks`)
  }},
  {name: `Show Closed`, cmd: `show_closed`, action: (args) => {
    App.show_mode(`closed`)
  }},
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

  {name: `Open Items`, cmd: `open_items`, mode: `items`, action: (args) => {
    App.open_items(args.item, true)
  }},
  {name: `Bookmark Items`, cmd: `bookmark_items`, mode: `items`, action: (args) => {
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

  {name: `Back (Browser)`, cmd: `browser_back`, action: (args) => {
    App.browser_back()
  }},
  {name: `Forward (Browser)`, cmd: `browser_forward`, action: (args) => {
    App.browser_forward()
  }},
  {name: `Reload (Browser)`, cmd: `browser_reload`, action: (args) => {
    App.browser_reload()
  }},

  {name: App.separator_string},

  {name: `New Tab`, cmd: `new_tab`, mode: `tabs`, action: (args) => {
    App.new_tab()
  }},
  {name: `Unload Tabs`, cmd: `unload_tabs`, mode: `tabs`, action: (args) => {
    App.unload_tabs(args.item)
  }},
  {name: `Duplicate Tabs`, cmd: `duplicate_tab`, mode: `tabs`, action: (args) => {
    App.duplicate_tabs(args.item)
  }},
  {name: `Detach Tabs`, cmd: `detach_tabs`, mode: `tabs`, action: (args) => {
    App.detach_tabs(args.item)
  }},
  {name: `Tabs To Top`, cmd: `tabs_to_top`, mode: `tabs`, action: (args) => {
    App.move_tabs_vertically(`top`)
  }},
  {name: `Tabs To Bottom`, cmd: `tabs_to_bottom`, mode: `tabs`, action: (args) => {
    App.move_tabs_vertically(`bottom`)
  }},
  {name: `Pin Tabs`, cmd: `pin_tabs`, mode: `tabs`, action: (args) => {
    App.pin_tabs(args.item)
  }},
  {name: `Unpin Tabs`, cmd: `unpin_tabs`, mode: `tabs`, action: (args) => {
    App.unpin_tabs(args.item)
  }},
  {name: `Toggle Pin Tabs`, cmd: `toggle_pin_tabs`, mode: `tabs`, action: (args) => {
    App.toggle_pin_tabs(args.item)
  }},
  {name: `Mute Tabs`, cmd: `mute_tabs`, mode: `tabs`, action: (args) => {
    App.mute_tabs(args.item)
  }},
  {name: `Unmute Tabs`, cmd: `unmute_tabs`, mode: `tabs`, action: (args) => {
    App.unmute_tabs(args.item)
  }},
  {name: `Toggle Mute Tabs`, cmd: `toggle_mute_tabs`, mode: `tabs`, action: (args) => {
    App.toggle_mute_tabs(args.item)
  }},
  {name: `Toggle Tabs`, cmd: `toggle_tabs`, mode: `tabs`, action: (args) => {
    App.toggle_tabs(args.item)
  }},
  {name: `Close Tabs`, cmd: `close_tabs`, mode: `tabs`, action: (args) => {
    App.close_tabs(args.item)
  }},
  {name: `Close Normal`, cmd: `close_normal_tabs`, mode: `tabs`, action: (args) => {
    App.close_normal_tabs()
  }},
  {name: `Close Duplicates`, cmd: `close_duplicate_tabs`, mode: `tabs`, action: (args) => {
    App.close_duplicate_tabs()
  }},
  {name: `Go To Playing Tab`, cmd: `go_to_playing_tab`, mode: `tabs`, action: (args) => {
    App.go_to_playing_tab()
  }},
  {name: `Tabs Info`, cmd: `tabs_info`, mode: `tabs`, action: (args) => {
    App.show_tabs_info()
  }},
  {name: `Undo Close Tab`, cmd: `undo_close_tab`, action: (args) => {
    App.undo_close_tab()
  }},

  {name: App.separator_string},

  {name: `Filter Image`, cmd: `filter_image`, mode: `items`, action: (args) => {
    App.set_filter_mode(args.mode, `image`)
  }},
  {name: `Filter Video`, cmd: `filter_video`, mode: `items`, action: (args) => {
    App.set_filter_mode(args.mode, `video`)
  }},
  {name: `Filter Audio`, cmd: `filter_audio`, mode: `items`, action: (args) => {
    App.set_filter_mode(args.mode, `audio`)
  }},
  {name: `Filter Text`, cmd: `filter_text`, mode: `items`, action: (args) => {
    App.set_filter_mode(args.mode, `text`)
  }},

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

  {name: App.separator_string},

  {name: `Reload Extension`, cmd: `reload_extension`, action: (args) => {
    App.reload_extension()
  }},
]

App.setup_commands = () => {
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
    if (args.item.image) {
      args.media = `image`
    }
    else if (args.item.video) {
      args.media = `video`
    }
    else if (args.item.audio) {
      args.media = `audio`
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