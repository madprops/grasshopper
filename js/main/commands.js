App.commands = [
  {name: `Go To Top`, cmd: `go_to_top`, action: (item) => {
    if (App.on_items()) {
      App.goto_top()
    }
  }},
  {name: `Go To Bottom`, cmd: `go_to_bottom`, action: (item) => {
    if (App.on_items()) {
      App.goto_bottom()
    }
  }},
  {name: `Go Back`, cmd: `go_back`, action: (item) => {
    if (App.on_items()) {
      App.back_action()
    }
  }},
  {name: `Clear Filter`, cmd: `clear_filter`, action: (item) => {
    if (App.on_items()) {
      App.clear_filter()
    }
  }},
  {name: `Select All`, cmd: `select_all`, action: (item) => {
    if (App.on_items()) {
      App.highlight_items()
    }
  }},
  {name: `Scroll Up`, cmd: `scroll_up`, action: (item) => {
    if (App.on_items()) {
      App.scroll(App.window_mode, `up`, true)
    }
  }},
  {name: `Scroll Down`, cmd: `scroll_down`, action: (item) => {
    if (App.on_items()) {
      App.scroll(App.window_mode, `down`, true)
    }
  }},
  {name: `Prev Window`, cmd: `prev_window`, action: (item) => {
    if (App.on_items()) {
      App.cycle_item_windows(true)
    }
  }},
  {name: `Next Window`, cmd: `next_window`, action: (item) => {
    if (App.on_items()) {
      App.cycle_item_windows()
    }
  }},
  {name: `Show Tabs`, cmd: `show_tabs`, action: (item) => {
    App.show_item_window(`tabs`)
  }},
  {name: `Show History`, cmd: `show_history`, action: (item) => {
    App.show_item_window(`history`)
  }},
  {name: `Show Bookmarks`, cmd: `show_bookmarks`, action: (item) => {
    App.show_item_window(`bookmarks`)
  }},
  {name: `Show Closed`, cmd: `show_closed`, action: (item) => {
    App.show_item_window(`closed`)
  }},
  {name: `Show Stars`, cmd: `show_stars`, action: (item) => {
    App.show_item_window(`stars`)
  }},
  {name: `Show Settings`, cmd: `show_settings`, action: (item) => {
    App.show_settings()
  }},
  {name: `Show About`, cmd: `show_about`, action: (item) => {
    App.show_window(`about`)
  }},
  {name: `Close Window`, cmd: `close_window`, action: (item) => {
    App.hide_current_window()
  }},
  {name: `New Tab`, cmd: `new_tab`, action: (item) => {
    if (App.window_mode !== `tabs`) {
      App.show_item_window(`tabs`)
    }

    App.new_tab()
  }},
  {name: `Star Tab`, cmd: `star_tab`, action: (item) => {
    if (item) {
      App.star_items(item)
    }
    else {
      App.star_from_active()
    }
  }},
  {name: `Title Tab`, cmd: `title_tab`, action: (item) => {
    if (item) {
      App.show_title_editor(item)
    }
    else {
      App.title_from_active()
    }
  }},
  {name: `Copy URL`, cmd: `copy_tab_url`, action: (item) => {
    if (item) {
      App.copy_url(item, true)
    }
    else {
      App.copy_current_tab_url()
    }
  }},
  {name: `Copy Title`, cmd: `copy_tab_title`, action: (item) => {
    if (item) {
      App.copy_title(item, true)
    }
    else {
      App.copy_current_tab_title()
    }
  }},
  {name: `Tabs Info`, cmd: `tabs_info`, action: (item) => {
    if (App.window_mode !== `tabs`) {
      App.show_item_window(`tabs`)
    }

    App.show_tabs_info()
  }},
  {name: `Close Normal Tabs`, cmd: `close_normal_tabs`, action: (item) => {
    if (App.window_mode !== `tabs`) {
      App.show_item_window(`tabs`)
    }

    App.close_normal_tabs()
  }},
  {name: `Close Duplicate Tabs`, cmd: `close_duplicate_tabs`, action: (item) => {
    if (App.window_mode !== `tabs`) {
      App.show_item_window(`tabs`)
    }

    App.close_duplicate_tabs()
  }},
  {name: `Go To Playing Tab`, cmd: `go_to_playing_tab`, action: (item) => {
    if (App.window_mode !== `tabs`) {
      App.show_item_window(`tabs`)
    }

    App.go_to_playing_tab()
  }},
  {name: `Back (Tab)`, cmd: `tab_back`, action: (item) => {
    App.tab_back()
  }},
  {name: `Forward (Tab)`, cmd: `tab_forward`, action: (item) => {
    App.tab_forward()
  }},
  {name: `Reload Tab`, cmd: `reload_tab`, action: (item) => {
    App.reload_current_tab()
  }},
  {name: `Duplicate Tab`, cmd: `duplicate_tab`, action: (item) => {
    if (item) {
      App.duplicate_tab(item)
    }
    else {
      App.duplicate_current_tab()
    }
  }},
  {name: `Suspend Tab`, cmd: `suspend_tab`, action: (item) => {
    if (item) {
      App.suspend_tabs(item)
    }
    else {
      App.suspend_current_tab()
    }
  }},
  {name: `Detach Tab`, cmd: `detach_tab`, action: (item) => {
    if (item) {
      App.detach_tabs(item)
    }
    else {
      App.detach_current_tab()
    }
  }},
  {name: `Tab To Top`, cmd: `tab_to_top`, action: (item) => {
    if (App.on_items()) {
      App.move_tabs_vertically(`top`)
    }
  }},
  {name: `Tab To Bottom`, cmd: `tab_to_bottom`, action: (item) => {
    if (App.on_items()) {
      App.move_tabs_vertically(`bottom`)
    }
  }},
  {name: `Pin Tab`, cmd: `pin_tab`, action: (item) => {
    if (App.window_mode !== `tabs`) {
      App.show_item_window(`tabs`)
    }

    if (item) {
      App.pin_tabs(item)
    }
    else {
      App.pin_tabs()
    }
  }},
  {name: `Unpin Tab`, cmd: `unpin_tab`, action: (item) => {
    if (App.window_mode !== `tabs`) {
      App.show_item_window(`tabs`)
    }

    if (item) {
      App.unpin_tabs(item)
    }
    else {
      App.unpin_tabs()
    }
  }},
  {name: `Mute Tab`, cmd: `mute_tab`, action: (item) => {
    if (App.window_mode !== `tabs`) {
      App.show_item_window(`tabs`)
    }

    if (item) {
      App.mute_tabs(item)
    }
    else {
      App.mute_tabs()
    }
  }},
  {name: `Unmute Tab`, cmd: `unmute_tab`, action: (item) => {
    if (App.window_mode !== `tabs`) {
      App.show_item_window(`tabs`)
    }

    if (item) {
      App.unmute_tabs(item)
    }
    else {
      App.unmute_tabs()
    }
  }},
  {name: `Close Tab`, cmd: `close_tab`, action: (item) => {
    if (item) {
      App.close_tabs(item)
    }
    else {
      App.close_current_tab()
    }
  }},
  {name: `Show All`, cmd: `show_all`, action: (item) => {
    if (App.on_items()) {
      App.show_all()
    }
  }},
  {name: `Show Images`, cmd: `show_images`, action: (item) => {
    if (App.on_items()) {
      App.show_images()
    }
  }},
  {name: `Show Videos`, cmd: `show_videos`, action: (item) => {
    if (App.on_items()) {
      App.show_videos()
    }
  }},
  {name: `Dark Theme`, cmd: `dark_theme`, action: (item) => {
    App.change_theme(`dark`)
  }},
  {name: `Light Theme`, cmd: `light_theme`, action: (item) => {
    App.change_theme(`light`)
  }},
  {name: `Detect Theme`, cmd: `detect_theme`, action: (item) => {
    App.detect_theme()
  }},
  {name: `Random Theme`, cmd: `random_theme`, action: (item) => {
    App.random_theme()
  }},
  {name: `Reload Extension`, cmd: `reload_extension`, action: (item) => {
    App.reload_extension()
  }},
  {name: `Clear All Data`, cmd: `clear_all_data`, action: (item) => {
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
  for (let c of App.commands) {
    if (c.cmd === cmd) {
      c.action(item)
      break
    }
  }
}