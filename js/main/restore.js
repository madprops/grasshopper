/* global App, DOM, browser, dateFormat, Addlist, AColorPicker, Menubutton, jdenticon, ColorLib, NiceGesture, NeedContext */

App.check_restore = () => {
  if (App.get_setting(`auto_restore`) === `action`) {
    if (App.last_restore_date > 0) {
      if ((Date.now() - App.last_restore_date) < App.restore_delay) {
        return
      }
    }

    App.last_restore_date = Date.now()
    App.update_filter_history()
    App.restore()
  }
}

App.start_auto_restore = () => {
  App.clear_restore()
  let d = App.get_setting(`auto_restore`)

  if (d === `never` || d === `action`) {
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
      return
    }
    else {
      App.hide_window()
    }
  }

  let mode = App.active_mode

  if (mode !== App.main_mode()) {
    App.show_main_mode(mode)
  }
  else if (App.is_filtered(mode)) {
    App.filter_all(mode)
  }
  else {
    let item = App.get_selected(mode)

    if (!item) {
      return
    }

    if (mode === `tabs`) {
      if (!item.active) {
        App.focus_current_tab()
        return
      }
    }

    if (!App.item_is_visible(item)) {
      App.select_item({item: item, scroll: `nearest_smooth`})
    }
  }
}

App.clear_restore = () => {
  clearTimeout(App.restore_timeout)
}