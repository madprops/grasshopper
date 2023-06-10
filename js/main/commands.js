App.commands = [
  {name: `Go To Top`, cmd: `go_to_top`, action: (args) => {
    if (args.on_items) {
      App.goto_top()
    }
  }},
  {name: `Go To Bottom`, cmd: `go_to_bottom`, action: (args) => {
    if (args.on_items) {
      App.goto_bottom()
    }
  }},
  {name: `Go Back`, cmd: `go_back`, action: (args) => {
    if (args.on_items) {
      App.back_action()
    }
  }},
  {name: `Filter Domain`, cmd: `filter_domain`, action: (args) => {
    if (args.on_items) {
      App.filter_domain(args.item)
    }
  }},
  {name: `Clear Filter`, cmd: `clear_filter`, action: (args) => {
    if (args.on_items) {
      App.clear_filter()
    }
  }},
  {name: `Select All`, cmd: `select_all`, action: (args) => {
    if (args.on_items) {
      App.highlight_items()
    }
  }},
  {name: `Scroll Up`, cmd: `scroll_up`, action: (args) => {
    if (args.on_items) {
      App.scroll(args.mode, `up`, true)
    }
  }},
  {name: `Scroll Down`, cmd: `scroll_down`, action: (args) => {
    if (args.on_items) {
      App.scroll(args.mode, `down`, true)
    }
  }},
  {name: `Prev Window`, cmd: `prev_window`, action: (args) => {
    if (args.on_items) {
      App.cycle_item_windows(true)
    }
  }},
  {name: `Next Window`, cmd: `next_window`, action: (args) => {
    if (args.on_items) {
      App.cycle_item_windows()
    }
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
  {name: `New Tab`, cmd: `new_tab`, action: (args) => {
    if (args.mode !== `tabs`) {
      App.show_item_window(`tabs`)
    }

    App.new_tab()
  }},
  {name: `Star Tab`, cmd: `star_tab`, action: (args) => {
    if (args.item) {
      App.star_items(args.item)
    }
    else {
      App.star_from_active()
    }
  }},
  {name: `Title Tab`, cmd: `title_tab`, action: (args) => {
    if (args.item) {
      App.show_title_editor(args.item)
    }
    else {
      App.title_from_active()
    }
  }},
  {name: `Copy URL`, cmd: `copy_tab_url`, action: (args) => {
    if (args.item) {
      App.copy_url(args.item, true)
    }
    else {
      App.copy_current_tab_url()
    }
  }},
  {name: `Copy Title`, cmd: `copy_tab_title`, action: (args) => {
    if (args.item) {
      App.copy_title(args.item, true)
    }
    else {
      App.copy_current_tab_title()
    }
  }},
  {name: `Tabs Info`, cmd: `tabs_info`, action: (args) => {
    if (args.mode !== `tabs`) {
      App.show_item_window(`tabs`)
    }

    App.show_tabs_info()
  }},
  {name: `Close Normal Tabs`, cmd: `close_normal_tabs`, action: (args) => {
    if (args.mode !== `tabs`) {
      App.show_item_window(`tabs`)
    }

    App.close_normal_tabs()
  }},
  {name: `Close Duplicate Tabs`, cmd: `close_duplicate_tabs`, action: (args) => {
    if (args.mode !== `tabs`) {
      App.show_item_window(`tabs`)
    }

    App.close_duplicate_tabs()
  }},
  {name: `Go To Playing Tab`, cmd: `go_to_playing_tab`, action: (args) => {
    if (args.mode !== `tabs`) {
      App.show_item_window(`tabs`)
    }

    App.go_to_playing_tab()
  }},
  {name: `Back (Tab)`, cmd: `tab_back`, action: (args) => {
    App.tab_back()
  }},
  {name: `Forward (Tab)`, cmd: `tab_forward`, action: (args) => {
    App.tab_forward()
  }},
  {name: `Reload Tab`, cmd: `reload_tab`, action: (args) => {
    App.reload_current_tab()
  }},
  {name: `Duplicate Tab`, cmd: `duplicate_tab`, action: (args) => {
    if (args.item) {
      App.duplicate_tab(args.item)
    }
    else {
      App.duplicate_current_tab()
    }
  }},
  {name: `Suspend Tab`, cmd: `suspend_tab`, action: (args) => {
    if (args.item) {
      App.suspend_tabs(args.item)
    }
    else {
      App.suspend_current_tab()
    }
  }},
  {name: `Detach Tab`, cmd: `detach_tab`, action: (args) => {
    if (args.item) {
      App.detach_tabs(args.item)
    }
    else {
      App.detach_current_tab()
    }
  }},
  {name: `Tab To Top`, cmd: `tab_to_top`, action: (args) => {
    if (args.on_items) {
      App.move_tabs_vertically(`top`)
    }
  }},
  {name: `Tab To Bottom`, cmd: `tab_to_bottom`, action: (args) => {
    if (args.on_items) {
      App.move_tabs_vertically(`bottom`)
    }
  }},
  {name: `Pin Tab`, cmd: `pin_tab`, action: (args) => {
    if (args.mode !== `tabs`) {
      App.show_item_window(`tabs`)
    }

    if (args.item) {
      App.pin_tabs(args.item)
    }
    else {
      App.pin_tabs()
    }
  }},
  {name: `Unpin Tab`, cmd: `unpin_tab`, action: (args) => {
    if (args.mode !== `tabs`) {
      App.show_item_window(`tabs`)
    }

    if (args.item) {
      App.unpin_tabs(args.item)
    }
    else {
      App.unpin_tabs()
    }
  }},
  {name: `Toggle Pin Tab`, cmd: `toggle_pin_tab`, action: (args) => {
    if (args.mode !== `tabs`) {
      App.show_item_window(`tabs`)
    }

    if (item.pinned) {
      if (args.item) {
        App.unpin_tabs(args.item)
      }
      else {
        App.unpin_tabs()
      }
    }
    else {
      if (args.item) {
        App.pin_tabs(args.item)
      }
      else {
        App.pin_tabs()
      }
    }
  }},
  {name: `Mute Tab`, cmd: `mute_tab`, action: (args) => {
    if (args.mode !== `tabs`) {
      App.show_item_window(`tabs`)
    }

    if (args.item) {
      App.mute_tabs(args.item)
    }
    else {
      App.mute_tabs()
    }
  }},
  {name: `Unmute Tab`, cmd: `unmute_tab`, action: (args) => {
    if (args.mode !== `tabs`) {
      App.show_item_window(`tabs`)
    }

    if (args.item) {
      App.unmute_tabs(args.item)
    }
    else {
      App.unmute_tabs()
    }
  }},
  {name: `Toggle Mute Tab`, cmd: `toggle_mute_tab`, action: (args) => {
    if (args.mode !== `tabs`) {
      App.show_item_window(`tabs`)
    }

    if (item.muted) {
      if (args.item) {
        App.unmute_tabs(args.item)
      }
      else {
        App.unmute_tabs()
      }
    }
    else {
      if (args.item) {
        App.mute_tabs(args.item)
      }
      else {
        App.mute_tabs()
      }
    }
  }},
  {name: `Close Tab`, cmd: `close_tab`, action: (args) => {
    if (args.item) {
      App.close_tabs(args.item)
    }
    else {
      App.close_current_tab()
    }
  }},
  {name: `Show All`, cmd: `show_all`, action: (args) => {
    if (args.on_items) {
      App.show_all()
    }
  }},
  {name: `Show Images`, cmd: `show_images`, action: (args) => {
    if (args.on_items) {
      App.show_images()
    }
  }},
  {name: `Show Videos`, cmd: `show_videos`, action: (args) => {
    if (args.on_items) {
      App.show_videos()
    }
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

  for (let c of App.commands) {
    if (c.cmd === cmd) {
      c.action(args)
      break
    }
  }
}