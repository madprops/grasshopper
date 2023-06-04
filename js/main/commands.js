App.commands = [
  [`To Top`, `go_to_top`],
  [`To Bottom`, `go_to_bottom`],
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
  [`Close Window`, `close_window`],
  [`New Tab`, `new_tab`],
  [`Star Tab`, `star_tab`],
  [`Title Tab`, `title_tab`],
  [`Tabs Info`, `tabs_info`],
  [`Clean Tabs`, `clean_tabs`],
  [`Duplicates`, `close_duplicates`],
  [`To Playing`, `go_to_playing`],
  [`Back`, `tab_back`],
  [`Forward`, `tab_forward`],
  [`Reload`, `reload_tab`],
  [`Duplicate`, `duplicate_tab`],
  [`Close`, `close_tab`],
  [`Show All`, `show_all`],
  [`Show Images`, `show_images`],
  [`Show Videos`, `show_videos`],
  [`Dark Theme`, `random_dark_theme`],
  [`Light Theme`, `random_light_theme`],
  [`Dark / Light`, `random_theme`],
  [`Reload Extension`, `reload_extension`],
]

App.run_command = (cmd) => {
  let mode = App.window_mode

  if (cmd === `go_back`) {
    if (App.on_item_window()) {
      App.back_action(mode)
    }
  }
  else if (cmd === `go_to_top`) {
    if (App.on_item_window()) {
      App.goto_top(mode)
    }
  }
  else if (cmd === `go_to_bottom`) {
    if (App.on_item_window()) {
      App.goto_bottom(mode)
    }
  }
  else if (cmd === `next_window`) {
    if (App.on_item_window()) {
      App.cycle_item_windows()
    }
  }
  else if (cmd === `prev_window`) {
    if (App.on_item_window()) {
      App.cycle_item_windows(true)
    }
  }
  else if (cmd === `select_all`) {
    if (App.on_item_window()) {
      App.highlight_items(mode)
    }
  }
  else if (cmd === `clear_filter`) {
    if (App.on_item_window()) {
      App.clear_filter(mode)
    }
  }
  else if (cmd === `show_all`) {
    if (App.on_item_window()) {
      App.show_all(mode)
    }
  }
  else if (cmd === `show_images`) {
    if (App.on_item_window()) {
      App.show_images(mode)
    }
  }
  else if (cmd === `show_videos`) {
    if (App.on_item_window()) {
      App.show_videos(mode)
    }
  }
  else if (cmd === `scroll_up`) {
    if (App.on_item_window()) {
      App.scroll(mode, `up`, true)
    }
  }
  else if (cmd === `scroll_down`) {
    if (App.on_item_window()) {
      App.scroll(mode, `down`, true)
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
  else if (cmd === `close_tab`) {
    if (mode !== `tabs`) {
      App.show_item_window(`tabs`)
    }

    App.close_current_tab()
  }
  else if (cmd === `star_tab`) {
    App.star_from_active()
  }
  else if (cmd === `random_theme`) {
    App.random_theme()
  }
  else if (cmd === `random_dark_theme`) {
    App.random_theme(`dark`)
  }
  else if (cmd === `random_light_theme`) {
    App.random_theme(`light`)
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