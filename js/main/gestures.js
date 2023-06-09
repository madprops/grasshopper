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
      let on_items = App.on_item_window(App.window_mode) && !App.popup_open

      if (on_items) {
        if (App.cursor_on_item(e, App.window_mode)) {
          let item = App.get_cursor_item(App.window_mode, e)

          if (item) {
            App[`${App.window_mode}_action_alt`](item, e.shiftKey)
          }
        }
      }
    }
  })
}

App.gesture_action = (gesture) => {
  let cmd = App.get_setting(`gesture_${gesture}`)

  if (cmd !== `none`) {
    App.run_command(cmd)
  }
}

App.refresh_gestures = () => {
  NiceGesture.enabled = App.get_setting(`gestures_enabled`)
  NiceGesture.threshold = App.get_setting(`gestures_threshold`)
}