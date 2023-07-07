App.setup_gestures = () => {
  App.refresh_gestures()
  let obj = {}

  for (let gesture of App.gestures) {
    obj[gesture] = () => {
      App.gesture_action(gesture)
    }
  }

  obj.default = (e) => {
    if (App.on_items()) {
      if (App.cursor_on_item(e, App.window_mode)) {
        let item = App.get_cursor_item(App.window_mode, e)

        if (e.target.classList.contains(`item_pick`)) {
          return
        }

        if (e.target.classList.contains(`item_alt`)) {
          App.alt_button_action(item, e.shiftKey)
          return
        }

        if (item) {
          App[`${App.window_mode}_action_alt`](item, e.shiftKey)
        }
      }
    }
  }

  NiceGesture.start(DOM.el(`#main`), obj)
  App.check_gestures()
}

App.gesture_action = (gesture) => {
  let cmd = App.get_setting(`gesture_${gesture}`)

  if (cmd !== `none`) {
    App.run_command({cmd: cmd, from: `gesture`})
  }
}

App.refresh_gestures = () => {
  NiceGesture.enabled = App.get_setting(`gestures_enabled`)
  NiceGesture.threshold = App.get_setting(`gestures_threshold`)
}

App.check_gestures = () => {
  for (let gesture of App.gestures) {
    if (!App.cmds.includes(App.get_setting(`gesture_${gesture}`))) {
      App.set_setting(`gesture_${gesture}`, `none`)
    }
  }
}