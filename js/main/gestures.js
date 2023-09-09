App.setup_gestures = () => {
  App.refresh_gestures()
  let obj = {}

  for (let gesture of App.gestures) {
    obj[gesture] = (e) => {
      App.gesture_action(e, gesture)
    }
  }

  obj.default = (e) => {
    App.mouse_middle_action(App.window_mode, e)
  }

  NiceGesture.start(DOM.el(`#main`), obj)
  App.check_gestures()
}

App.gesture_action = (e, gesture) => {
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