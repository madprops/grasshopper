App.setup_commands = () => {
  App.commands = [
    {name: `Go To Top`, cmd: `go_to_top`},
    {name: `Go To Bottom`, cmd: `go_to_bottom`},
    {name: `Go Back`, cmd: `go_back`},
    {name: `Clear Filter`, cmd: `clear_filter`},
    {name: `Select All`, cmd: `select_all`},
    {name: `Scroll Up`, cmd: `scroll_up`},
    {name: `Scroll Down`, cmd: `scroll_down`},
    {name: `Prev Window`, cmd: `prev_window`},
    {name: `Next Window`, cmd: `next_window`},
    {name: `Show Tabs`, cmd: `show_tabs`},
    {name: `Show History`, cmd: `show_history`},
    {name: `Show Bookmarks`, cmd: `show_bookmarks`},
    {name: `Show Closed`, cmd: `show_closed`},
    {name: `Show Stars`, cmd: `show_stars`},
    {name: `Show Settings`, cmd: `show_settings`},
    {name: `Show About`, cmd: `show_about`},
    {name: `Close Window`, cmd: `close_window`},
    {name: `New Tab`, cmd: `new_tab`},
    {name: `Star Tab`, cmd: `star_tab`},
    {name: `Title Tab`, cmd: `title_tab`},
    {name: `Copy URL`, cmd: `copy_tab_url`},
    {name: `Copy Title`, cmd: `copy_tab_title`},
    {name: `Tabs Info`, cmd: `tabs_info`},
    {name: `Close Normal Tabs`, cmd: `close_normal_tabs`},
    {name: `Close Duplicate Tabs`, cmd: `close_duplicate_tabs`},
    {name: `Go To Playing Tab`, cmd: `go_to_playing_tab`},
    {name: `Back (Tab)`, cmd: `tab_back`},
    {name: `Forward (Tab)`, cmd: `tab_forward`},
    {name: `Reload Tab`, cmd: `reload_tab`},
    {name: `Duplicate Tab`, cmd: `duplicate_tab`},
    {name: `Suspend Tab`, cmd: `suspend_tab`},
    {name: `Detach Tab`, cmd: `detach_tab`},
    {name: `Tab To Top`, cmd: `tab_to_top`},
    {name: `Tab To Bottom`, cmd: `tab_to_bottom`},
    {name: `Close Tab`, cmd: `close_tab`},
    {name: `Show All`, cmd: `show_all`},
    {name: `Show Images`, cmd: `show_images`},
    {name: `Show Videos`, cmd: `show_videos`},
    {name: `Dark Theme`, cmd: `dark_theme`},
    {name: `Light Theme`, cmd: `light_theme`},
    {name: `Detect Theme`, cmd: `detect_theme`},
    {name: `Random Theme`, cmd: `random_theme`},
    {name: `Reload Extension`, cmd: `reload_extension`},
    {name: `Clear All Data`, cmd: `clear_all_data`},
  ]

  for (let plugin of App.plugins) {
    App.commands.push({name: plugin.name, cmd: `show_${plugin.id}`})
  }

  App.ordered_commands = App.commands.slice(0)
  App.sort_commands()
}


App.run_command = (cmd, item) => {
  let mode = App.window_mode
  let on_items = App.on_item_window(mode) && !App.popup_open

  if (cmd === `go_back`) {
    if (on_items) {
      App.back_action(mode)
    }
  }
  else if (cmd === `go_to_top`) {
    if (on_items) {
      App.goto_top(mode)
    }
  }
  else if (cmd === `go_to_bottom`) {
    if (on_items) {
      App.goto_bottom(mode)
    }
  }
  else if (cmd === `next_window`) {
    if (on_items) {
      App.cycle_item_windows()
    }
  }
  else if (cmd === `prev_window`) {
    if (on_items) {
      App.cycle_item_windows(true)
    }
  }
  else if (cmd === `select_all`) {
    if (on_items) {
      App.highlight_items(mode)
    }
  }
  else if (cmd === `clear_filter`) {
    if (on_items) {
      App.clear_filter(mode)
    }
  }
  else if (cmd === `show_all`) {
    if (on_items) {
      App.show_all(mode)
    }
  }
  else if (cmd === `show_images`) {
    if (on_items) {
      App.show_images(mode)
    }
  }
  else if (cmd === `show_videos`) {
    if (on_items) {
      App.show_videos(mode)
    }
  }
  else if (cmd === `scroll_up`) {
    if (on_items) {
      App.scroll(mode, `up`, true)
    }
  }
  else if (cmd === `scroll_down`) {
    if (on_items) {
      App.scroll(mode, `down`, true)
    }
  }
  else if (cmd === `tab_to_top`) {
    if (on_items) {
      App.move_tabs_vertically(`top`)
    }
  }
  else if (cmd === `tab_to_bottom`) {
    if (on_items) {
      App.move_tabs_vertically(`bottom`)
    }
  }
  else if (cmd === `show_tabs`) {
    App.show_item_window(`tabs`)
  }
  else if (cmd === `show_history`) {
    App.show_item_window(`history`)
  }
  else if (cmd === `show_bookmarks`) {
    App.show_item_window(`bookmarks`)
  }
  else if (cmd === `show_closed`) {
    App.show_item_window(`closed`)
  }
  else if (cmd === `show_stars`) {
    App.show_item_window(`stars`)
  }
  else if (cmd === `show_settings`) {
    App.show_settings()
  }
  else if (cmd === `show_about`) {
    App.show_window(`about`)
  }
  else if (cmd === `close_window`) {
    App.hide_current_window()
  }
  else if (cmd === `go_to_playing_tab`) {
    if (mode !== `tabs`) {
      App.show_item_window(`tabs`)
    }

    App.go_to_playing_tab()
  }
  else if (cmd === `close_normal_tabs`) {
    if (mode !== `tabs`) {
      App.show_item_window(`tabs`)
    }

    App.close_normal_tabs()
  }
  else if (cmd === `tabs_info`) {
    if (mode !== `tabs`) {
      App.show_item_window(`tabs`)
    }

    App.show_tabs_info()
  }
  else if (cmd === `close_duplicate_tabs`) {
    if (mode !== `tabs`) {
      App.show_item_window(`tabs`)
    }

    App.close_duplicate_tabs()
  }
  else if (cmd === `new_tab`) {
    if (mode !== `tabs`) {
      App.show_item_window(`tabs`)
    }

    App.new_tab()
  }
  else if (cmd === `title_tab`) {
    if (item) {
      App.show_title_editor(item)
    }
    else {
      App.title_from_active()
    }
  }
  else if (cmd === `star_tab`) {
    if (item) {
      App.star_items(item)
    }
    else {
      App.star_from_active()
    }
  }
  else if (cmd === `dark_theme`) {
    App.change_theme(`dark`)
  }
  else if (cmd === `light_theme`) {
    App.change_theme(`light`)
  }
  else if (cmd === `detect_theme`) {
    App.detect_theme()
  }
  else if (cmd === `random_theme`) {
    App.random_theme()
  }
  else if (cmd === `tab_back`) {
    App.tab_back()
  }
  else if (cmd === `tab_forward`) {
    App.tab_forward()
  }
  else if (cmd === `reload_extension`) {
    App.reload_extension()
  }
  else if (cmd === `clear_all_data`) {
    App.stor_clear_all_data()
  }
  else if (cmd === `duplicate_tab`) {
    if (item) {
      App.duplicate_tab(item)
    }
    else {
      App.duplicate_current_tab()
    }
  }
  else if (cmd === `suspend_tab`) {
    if (item) {
      App.suspend_tabs(item)
    }
    else {
      App.suspend_current_tab()
    }
  }
  else if (cmd === `detach_tab`) {
    if (item) {
      App.detach_tabs(item)
    }
    else {
      App.detach_current_tab()
    }
  }
  else if (cmd === `copy_tab_url`) {
    if (item) {
      App.copy_url(item, true)
    }
    else {
      App.copy_current_tab_url()
    }
  }
  else if (cmd === `copy_tab_title`) {
    if (item) {
      App.copy_title(item, true)
    }
    else {
      App.copy_current_tab_title()
    }
  }
  else if (cmd === `close_tab`) {
    if (item) {
      App.close_tabs(item)
    }
    else {
      App.close_current_tab()
    }
  }
  else if (cmd === `reload_tab`) {
    App.reload_current_tab()
  }
  else if (cmd === `show_colorscreen`) {
    App.show_plugin(`colorscreen`)
  }
  else if (cmd === `show_minesweeper`) {
    App.show_plugin(`minesweeper`)
  }
  else if (cmd === `show_hoff`) {
    App.show_plugin(`hoff`)
  }
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