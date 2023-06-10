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
  {name: `Clear Filter`, cmd: `clear_filter`, mode: `items`, action: (args) => {
    App.clear_filter()
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
  {name: `Prev Window`, cmd: `prev_window`, mode: `items`, action: (args) => {
    App.cycle_item_windows(true)
  }},
  {name: `Next Window`, cmd: `next_window`, mode: `items`, action: (args) => {
    App.cycle_item_windows()
  }},
  {name: `Show Tabs`, cmd: `show_tabs`, action: (args) => {
    App.show_item_window(`tabs`)
  }},
  {name: `Show History`, cmd: `show_history`, action: (args) => {
    App.show_item_window(`history`)
  }},
  {name: `Show Bookmarks`, cmd: `show_bookmarks`, action: (args) => {
    App.show_item_window(`bookmarks`)
  }},
  {name: `Show Closed`, cmd: `show_closed`, action: (args) => {
    App.show_item_window(`closed`)
  }},
  {name: `Show Stars`, cmd: `show_stars`, action: (args) => {
    App.show_item_window(`stars`)
  }},
  {name: `Show Settings`, cmd: `show_settings`, action: (args) => {
    App.show_settings()
  }},
  {name: `Show About`, cmd: `show_about`, action: (args) => {
    App.show_window(`about`)
  }},
  {name: `Close Window`, cmd: `close_window`, action: (args) => {
    App.hide_current_window()
  }},
  {name: `New Tab`, cmd: `new_tab`, mode: `tabs`, action: (args) => {
    App.new_tab()
  }},
  {name: `Star Item`, cmd: `star_tab`, mode: `items`, action: (args) => {
    App.star_items(args.item)
  }},
  {name: `Title Tab`, cmd: `title_tab`, mode: `tabs`, action: (args) => {
    App.show_title_editor(args.item)
  }},
  {name: `Copy URL`, cmd: `copy_tab_url`, mode: `items`, action: (args) => {
    App.copy_url(args.item, true)
  }},
  {name: `Copy Title`, cmd: `copy_tab_title`, mode: `items`, action: (args) => {
    App.copy_title(args.item, true)
  }},
  {name: `Tabs Info`, cmd: `tabs_info`, mode: `tabs`, action: (args) => {
    App.show_tabs_info()
  }},
  {name: `Close Normal Tabs`, cmd: `close_normal_tabs`, mode: `tabs`, action: (args) => {
    App.close_normal_tabs()
  }},
  {name: `Close Duplicate Tabs`, cmd: `close_duplicate_tabs`, mode: `tabs`, action: (args) => {
    App.close_duplicate_tabs()
  }},
  {name: `Go To Playing Tab`, cmd: `go_to_playing_tab`, mode: `tabs`, action: (args) => {
    App.go_to_playing_tab()
  }},
  {name: `Back (Browser)`, cmd: `browser_back`, action: (args) => {
    App.browser_back()
  }},
  {name: `Forward (Browser)`, cmd: `browser_forward`, action: (args) => {
    App.browser_forward()
  }},
  {name: `Reload Tab (Browser)`, cmd: `browser_reload`, action: (args) => {
    App.browser_reload()
  }},
  {name: `Duplicate Tab`, cmd: `duplicate_tab`, mode: `tabs`, action: (args) => {
    App.duplicate_tab(args.item)
  }},
  {name: `Suspend Tab`, cmd: `suspend_tab`, mode: `tabs`, action: (args) => {
    App.suspend_tabs(args.item)
  }},
  {name: `Detach Tab`, cmd: `detach_tab`, mode: `tabs`, action: (args) => {
    App.detach_tabs(args.item)
  }},
  {name: `Tab To Top`, cmd: `tab_to_top`, mode: `tabs`, action: (args) => {
    App.move_tabs_vertically(`top`)
  }},
  {name: `Tab To Bottom`, cmd: `tab_to_bottom`, mode: `tabs`, action: (args) => {
    App.move_tabs_vertically(`bottom`)
  }},
  {name: `Pin Tab`, cmd: `pin_tab`, mode: `tabs`, action: (args) => {
    App.pin_tabs(args.item)
  }},
  {name: `Unpin Tab`, cmd: `unpin_tab`, mode: `tabs`, action: (args) => {
    App.unpin_tabs(args.item)
  }},
  {name: `Toggle Pin Tab`, cmd: `toggle_pin_tab`, mode: `tabs`, action: (args) => {
    App.toggle_pin_tabs(args.item)
  }},
  {name: `Mute Tab`, cmd: `mute_tab`, mode: `tabs`, action: (args) => {
    App.mute_tabs(args.item)
  }},
  {name: `Unmute Tab`, cmd: `unmute_tab`, mode: `tabs`, action: (args) => {
    App.unmute_tabs(args.item)
  }},
  {name: `Toggle Mute Tab`, cmd: `toggle_mute_tab`, mode: `tabs`, action: (args) => {
    App.toggle_mute_tabs(args.item)
  }},
  {name: `Close Tab`, cmd: `close_tab`, action: (args) => {
    App.close_tabs(args.item)
  }},
  {name: `Show All`, cmd: `show_all`, mode: `items`, action: (args) => {
    App.show_all()
  }},
  {name: `Show Images`, cmd: `show_images`, mode: `items`, action: (args) => {
    App.show_images()
  }},
  {name: `Show Videos`, cmd: `show_videos`, mode: `items`, action: (args) => {
    App.show_videos()
  }},
  {name: `Dark Theme`, cmd: `dark_theme`, action: (args) => {
    App.change_theme(`dark`)
  }},
  {name: `Light Theme`, cmd: `light_theme`, action: (args) => {
    App.change_theme(`light`)
  }},
  {name: `Detect Theme`, cmd: `detect_theme`, action: (args) => {
    App.detect_theme()
  }},
  {name: `Random Theme`, cmd: `random_theme`, action: (args) => {
    App.random_theme()
  }},
  {name: `Reload Extension`, cmd: `reload_extension`, action: (args) => {
    App.reload_extension()
  }},
  {name: `Clear All Data`, cmd: `clear_all_data`, action: (args) => {
    App.stor_clear_all_data()
  }},
]

App.setup_commands = () => {
  for (let plugin of App.plugins) {
    App.commands.push({name: plugin.name, cmd: plugin.cmd, action: () => {
      App.show_plugin(plugin.id)
    }})
  }

  App.ordered_commands = App.commands.slice(0)
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
  App.commands.sort((a, b) => {
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

App.run_command = (cmd, item) => {
  let on_items = App.on_items()

  if (on_items && !item) {
    item = App.get_selected()
  }

  let args = {
    item: item,
    on_items: on_items,
    mode: App.window_mode,
  }

  let command

  for (let c of App.commands) {
    if (c.cmd === cmd) {
      command = c
      break
    }
  }

  if (command) {
    if (command.mode) {
      if (command.mode === `items`) {
        if (!args.on_items) {
          return
        }
      }
      else {
        if (command.mode !== args.mode) {
          return
        }
      }
    }

    command.action(args)
  }
}