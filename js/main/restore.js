App.check_restore = () => {
  if (App.get_setting(`auto_restore`) === `action`) {
    if (App.last_restore_date > 0) {
      if ((App.now() - App.last_restore_date) < App.restore_delay) {
        return
      }
    }

    App.last_restore_date = App.now()
    App.update_filter_history()
    return App.restore()
  }
}

App.start_auto_restore = () => {
  App.clear_restore()
  let d = App.get_setting(`auto_restore`)

  if ((d === `never`) || (d === `action`)) {
    return
  }

  let delay = App.parse_delay(d)

  App.restore_timeout = setTimeout(() => {
    App.restore()
  }, delay)
}

App.restore = () => {
  App.hide_context()
  App.hide_all_popups()

  if (!App.on_items()) {
    if (App.on_settings()) {
      App.hide_window()
      return false
    }

    App.hide_window()
  }

  let mode = App.active_mode

  if (mode !== App.main_mode()) {
    App.show_main_mode(mode)
    return true
  }
  else if (App.is_filtered(mode)) {
    App.filter_all(mode)
    return true
  }
}

App.clear_restore = () => {
  clearTimeout(App.restore_timeout)
}