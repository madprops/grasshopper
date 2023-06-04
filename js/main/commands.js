App.setup_commands = () => {
  App.sort_commands()
}

App.commands = [
  [`Go To Top`, `go_to_top`],
  [`Go To Bottom`, `go_to_bottom`],
  [`Go Back`, `go_back`],
  [`Clear Filter`, `clear_filter`],
  [`Select All`, `select_all`],
  [`Scroll Up`, `scroll_up`],
  [`Scroll Down`, `scroll_down`],
  [`Prev Window`, `prev_window`],
  [`Next Window`, `next_window`],
  [`Show Tabs`, `show_tabs`],
  [`Show History`, `show_history`],
  [`Show BMarks`, `show_bookmarks`],
  [`Show Closed`, `show_closed`],
  [`Show Stars`, `show_stars`],
  [`Show Settings`, `show_settings`],
  [`Show About`, `show_about`],
  [`Close Window`, `close_window`],
  [`New Tab`, `new_tab`],
  [`Star Tab`, `star_tab`],
  [`Title Tab`, `title_tab`],
  [`Copy URL`, `copy_tab_url`],
  [`Copy Title`, `copy_tab_title`],
  [`Tabs Info`, `tabs_info`],
  [`Clean Tabs`, `clean_tabs`],
  [`Close Duplicates`, `close_duplicates`],
  [`Go To Playing`, `go_to_playing`],
  [`Back`, `tab_back`],
  [`Forward`, `tab_forward`],
  [`Reload`, `reload_tab`],
  [`Duplicate`, `duplicate_tab`],
  [`Detach`, `detach_tab`],
  [`To Top`, `to_top`],
  [`To Bottom`, `to_bottom`],
  [`Close`, `close_tab`],
  [`Show All`, `show_all`],
  [`Show Images`, `show_images`],
  [`Show Videos`, `show_videos`],
  [`Dark Theme`, `dark_theme`],
  [`Light Theme`, `light_theme`],
  [`Detect Theme`, `detect_theme`],
  [`Random Theme`, `random_theme`],
  [`Reload Extension`, `reload_extension`],
]

App.run_command = (cmd) => {
  let mode = App.window_mode
  let on_items = App.on_item_window(mode) && !App.popup_open
  App.update_command_history(cmd)

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
  else if (cmd === `to_top`) {
    if (on_items) {
      App.move_tabs_vertically(`top`)
    }
  }
  else if (cmd === `to_bottom`) {
    if (on_items) {
      App.move_tabs_vertically(`bottom`)
    }
  }
  else if (cmd === `detach_tab`) {
    if (on_items) {
      App.detach_current_tab()
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
    App.show_window(`settings_basic`)
  }
  else if (cmd === `show_about`) {
    App.show_window(`about`)
  }
  else if (cmd === `close_window`) {
    App.hide_current_window()
  }
  else if (cmd === `go_to_playing`) {
    if (mode !== `tabs`) {
      App.show_item_window(`tabs`)
    }

    App.go_to_playing()
  }
  else if (cmd === `clean_tabs`) {
    if (mode !== `tabs`) {
      App.show_item_window(`tabs`)
    }

    App.clean_tabs()
  }
  else if (cmd === `tabs_info`) {
    if (mode !== `tabs`) {
      App.show_item_window(`tabs`)
    }

    App.show_tabs_info()
  }
  else if (cmd === `close_duplicates`) {
    if (mode !== `tabs`) {
      App.show_item_window(`tabs`)
    }

    App.close_duplicates()
  }
  else if (cmd === `new_tab`) {
    if (mode !== `tabs`) {
      App.show_item_window(`tabs`)
    }

    App.new_tab()
  }
  else if (cmd === `title_tab`) {
    if (mode !== `tabs`) {
      App.show_item_window(`tabs`)
    }

    App.title_from_active()
  }
  else if (cmd === `copy_tab_url`) {
    if (mode !== `tabs`) {
      App.show_item_window(`tabs`)
    }

    App.copy_current_tab_url()
  }
  else if (cmd === `copy_tab_title`) {
    if (mode !== `tabs`) {
      App.show_item_window(`tabs`)
    }

    App.copy_current_tab_title()
  }
  else if (cmd === `close_tab`) {
    if (mode !== `tabs`) {
      App.show_item_window(`tabs`)
    }

    App.close_current_tab()
  }
  else if (cmd === `star_tab`) {
    App.star_from_active()
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
  else if (cmd === `reload_tab`) {
    App.reload_current_tab()
  }
  else if (cmd === `tab_back`) {
    App.tab_back()
  }
  else if (cmd === `tab_forward`) {
    App.tab_forward()
  }
  else if (cmd === `duplicate_tab`) {
    App.duplicate_current_tab()
  }
  else if (cmd === `reload_extension`) {
    App.reload_extension()
  }
}

App.update_command_history = (cmd) => {
  App.command_history = App.command_history.filter(x => x !== cmd)
  App.command_history.unshift(cmd)
  App.stor_save_command_history()
  App.sort_commands()
}

App.sort_commands = () => {
  App.commands.sort((a, b) => {
    let ia = App.command_history.indexOf(a[1])
    let ib = App.command_history.indexOf(b[1])

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

  App.fill_palette_container()
}