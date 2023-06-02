App.setup_gestures = () => {
  App.refresh_gestures()

  NiceGesture.start(DOM.el(`#main`), {
    up: (e) => {
      App.gesture_action(`up`)
    },
    down: (e) => {
      App.gesture_action(`down`)
    },
    left: (e) => {
      App.gesture_action(`left`)
    },
    right: (e) => {
      App.gesture_action(`right`)
    },
    up_and_down: (e) => {
      App.gesture_action(`up_and_down`)
    },
    left_and_right: (e) => {
      App.gesture_action(`left_and_right`)
    },
    default: (e) => {
      if (App.cursor_on_item(e, App.window_mode)) {
        let item = App.get_cursor_item(App.window_mode, e)

        if (!item.highlighted) {
          if (App.get_highlights(App.window_mode).length > 0) {
            App.pick_item(item)
          }
        }

        App.show_item_menu(item, e.clientX, e.clientY)
        e.preventDefault()
      }
    }
  })
}

App.gesture_action = (gesture) => {
  let action = App.get_setting(`gesture_${gesture}`)
  let mode = App.window_mode

  if (action === `go_back`) {
    if (App.on_item_window()) {
      App.back_action(mode)
    }
  }
  else if (action === `go_to_top`) {
    if (App.on_item_window()) {
      App.goto_top(mode)
    }
  }
  else if (action === `go_to_bottom`) {
    if (App.on_item_window()) {
      App.goto_bottom(mode)
    }
  }
  else if (action === `next_window`) {
    if (App.on_item_window()) {
      App.cycle_item_windows()
    }
  }
  else if (action === `prev_window`) {
    if (App.on_item_window()) {
      App.cycle_item_windows(true)
    }
  }
  else if (action === `select_all`) {
    if (App.on_item_window()) {
      App.highlight_items(mode)
    }
  }
  else if (action === `clear_filter`) {
    if (App.on_item_window()) {
      App.clear_filter(mode)
    }
  }
  else if (action === `show_all`) {
    if (App.on_item_window()) {
      App.show_all(mode)
    }
  }
  else if (action === `show_images`) {
    if (App.on_item_window()) {
      App.show_images(mode)
    }
  }
  else if (action === `show_videos`) {
    if (App.on_item_window()) {
      App.show_videos(mode)
    }
  }
  else if (action === `scroll_up`) {
    if (App.on_item_window()) {
      App.scroll(mode, `up`, true)
    }
  }
  else if (action === `scroll_down`) {
    if (App.on_item_window()) {
      App.scroll(mode, `down`, true)
    }
  }
  else if (action === `show_tabs`) {
    App.show_item_window(`tabs`)
  }
  else if (action === `show_history`) {
    App.show_item_window(`history`)
  }
  else if (action === `show_bookmarks`) {
    App.show_item_window(`bookmarks`)
  }
  else if (action === `show_closed`) {
    App.show_item_window(`closed`)
  }
  else if (action === `show_stars`) {
    App.show_item_window(`stars`)
  }
  else if (action === `show_settings`) {
    App.show_window(`settings_basic`)
  }
  else if (action === `close_window`) {
    App.hide_current_window()
  }
  else if (action === `go_to_playing`) {
    if (mode !== `tabs`) {
      App.show_item_window(`tabs`)
    }

    App.go_to_playing()
  }
  else if (action === `clean_tabs`) {
    if (mode !== `tabs`) {
      App.show_item_window(`tabs`)
    }

    App.clean_tabs()
  }
  else if (action === `tabs_info`) {
    if (mode !== `tabs`) {
      App.show_item_window(`tabs`)
    }

    App.show_tabs_info()
  }
  else if (action === `close_duplicates`) {
    if (mode !== `tabs`) {
      App.show_item_window(`tabs`)
    }

    App.close_duplicates()
  }
  else if (action === `new_tab`) {
    if (mode !== `tabs`) {
      App.show_item_window(`tabs`)
    }

    App.new_tab()
  }
  else if (action === `title_tab`) {
    if (mode !== `tabs`) {
      App.show_item_window(`tabs`)
    }

    App.title_from_active()
  }
  else if (action === `close_tab`) {
    if (mode !== `tabs`) {
      App.show_item_window(`tabs`)
    }

    App.close_current_tab()
  }
  else if (action === `star_tab`) {
    App.star_from_active()
  }
  else if (action === `random_theme`) {
    App.random_theme()
  }
  else if (action === `reload_tab`) {
    App.reload_current_tab()
  }
  else if (action === `tab_back`) {
    App.tab_back()
  }
  else if (action === `tab_forward`) {
    App.tab_forward()
  }
  else if (action === `duplicate_tab`) {
    App.duplicate_current_tab()
  }
  else if (action === `reload_extension`) {
    App.reload_extension()
  }
}

App.refresh_gestures = () => {
  NiceGesture.enabled = App.get_setting(`gestures_enabled`)
  NiceGesture.threshold = App.get_setting(`gestures_threshold`)
  NiceGesture.button = `right`
}