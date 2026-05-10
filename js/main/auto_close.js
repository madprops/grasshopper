App.setup_auto_close = () => {

}

App.start_auto_close = () => {
  clearInterval(App.auto_close_interval)

  if (!App.get_setting(`auto_close_enabled`)) {
    return
  }

  App.auto_close_interval = setInterval(() => {
    App.auto_close_action()
  }, App.auto_close_delay)
}

App.auto_close_action = () => {
  if (!App.get_setting(`auto_close_enabled`)) {
    return
  }

  let now = App.now()
  let auto_close_delay = App.get_setting(`auto_close_delay`) * 60 * 1000
  let to_close = []

  for (let tab of App.get_normal_tabs()) {
    if ((now - tab.last_access) >= auto_close_delay) {
      if (tab.pinned && !App.get_setting(`auto_close_pinned`)) {
        continue
      }

      if (!tab.pinned && App.get_setting(`auto_close_normal`)) {
        continue
      }

      if (tab.unloaded && !App.get_setting(`auto_close_unloaded`)) {
        continue
      }

      if ((tab.playing || tab.muted) && !App.get_setting(`auto_close_playing`)) {
        continue
      }

      if (App.edited(tab) && !App.get_setting(`auto_close_edited`)) {
        continue
      }

      if (App.is_media(tab) && !App.get_setting(`auto_close_media`)) {
        continue
      }

      to_close.push(tab)
    }
  }

  if (!to_close.length) {
    return
  }

  App.close_tabs({selection: to_close, force: true})
}