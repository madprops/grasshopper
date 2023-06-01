App.setup_gestures = () => {
  NiceGesture.button = App.get_setting(`gestures_button`)
  NiceGesture.threshold = App.get_setting(`gestures_threshold`)

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
    up_and_down_1: (e) => {
      App.gesture_action(`up_and_down`)
    },
    up_and_down_2: (e) => {
      App.gesture_action(`up_and_down`)
    },
    left_and_right_1: (e) => {
      App.gesture_action(`left_and_right`)
    },
    left_and_right_2: (e) => {
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

  if (action === `go_back`) {
    if (App.on_item_window()) {
      App.back_action(App.window_mode)
    }
  }
  else if (action === `go_to_top`) {
    if (App.on_item_window()) {
      App.goto_top(App.window_mode)
    }
  }
  else if (action === `go_to_bottom`) {
    if (App.on_item_window()) {
      App.goto_bottom(App.window_mode)
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
  else if (action === `random_theme`) {
    App.random_theme()
  }
  else if (action === `go_to_playing`) {
    if (App.window_mode !== `tabs`) {
      App.show_item_window(`tabs`)
    }

    App.go_to_playing()
  }
  else if (action === `clear_filter`) {
    if (App.on_item_window()) {
      App.clear_filter(App.window_mode)
    }
  }
  else if (action === `clean_tabs`) {
    if (App.window_mode !== `tabs`) {
      App.show_item_window(`tabs`)
    }

    App.clean_tabs()
  }
  else if (action === `duplicates`) {
    if (App.window_mode !== `tabs`) {
      App.show_item_window(`tabs`)
    }

    App.close_duplicates()
  }
  else if (action === `tabs_info`) {
    if (App.window_mode !== `tabs`) {
      App.show_item_window(`tabs`)
    }

    App.show_tabs_info()
  }
  else if (action === `select_all`) {
    if (App.on_item_window()) {
      App.highlight_items(App.window_mode)
    }
  }
  else if (action === `new_star`) {
    App.new_star_from_active()
  }
  else if (action === `new_tab`) {
    if (App.window_mode !== `tabs`) {
      App.show_item_window(`tabs`)
    }

    App.new_tab()
  }
}

App.refresh_gestures = () => {
  NiceGesture.enabled = App.get_setting(`gestures_enabled`)
  NiceGesture.button = App.get_setting(`gestures_button`)
  NiceGesture.threshold = App.get_setting(`gestures_threshold`)
}