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
  App.run_command(action)
}

App.refresh_gestures = () => {
  NiceGesture.enabled = App.get_setting(`gestures_enabled`)
  NiceGesture.threshold = App.get_setting(`gestures_threshold`)
  NiceGesture.button = `right`
}