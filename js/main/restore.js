App.check_restore = () => {
  if (App.get_setting(`auto_restore`) === `action`) {
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
  NeedContext.hide()

  if (App.on_items()) {
    let mode = App.active_mode

    if ((mode !== App.primary_mode()) || App.is_filtered(mode)) {
      App.show_primary_mode()
    }
    else {
      let item = App.get_selected(mode)

      if (item && !App.item_is_visible(item)) {
        App.select_item({item: item, scroll: `center`})
      }
    }
  }
}

App.clear_restore = () => {
  clearTimeout(App.restore_timeout)
}