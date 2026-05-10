App.start_auto_close = () => {
  clearTimeout(App.auto_close_timeout)

  if (!App.get_setting(`auto_close_enabled`)) {
    return
  }

  let hours = App.get_setting(`auto_close_delay`)
  let word = App.plural(hours, `hour`, `hours`)
  App.log(`Auto Close started: ${hours} ${word}`)

  App.start_auto_close_timeout()
}

App.start_auto_close_timeout = () => {
  if (!App.get_setting(`auto_close_enabled`)) {
    return
  }

  App.auto_close_timeout = setTimeout(() => {
    App.auto_close_action()
    App.start_auto_close_timeout()
  }, App.auto_close_delay)
}

App.auto_close_action = () => {
  if (!App.get_setting(`auto_close_enabled`)) {
    return
  }

  let now = App.now()
  let auto_close_delay = App.get_setting(`auto_close_delay`) * 60 * 60 * 1000
  let to_close = []

  for (let tab of App.get_normal_tabs()) {
    if (tab.active) {
      continue
    }

    if ((now - tab.last_access) >= auto_close_delay) {
      if (tab.pinned && !App.get_setting(`auto_close_pinned`)) {
        continue
      }

      if (!tab.pinned && !App.get_setting(`auto_close_normal`)) {
        continue
      }

      if (tab.unloaded && !App.get_setting(`auto_close_unloaded`)) {
        continue
      }

      if (tab.playing && !App.get_setting(`auto_close_playing`)) {
        continue
      }

      if (tab.muted && !App.get_setting(`auto_close_muted`)) {
        continue
      }

      if (App.edited(tab) && !App.get_setting(`auto_close_edited`)) {
        continue
      }

      if (App.is_media(tab) && !App.get_setting(`auto_close_media`)) {
        continue
      }

      if (App.is_zone(tab) && !App.get_setting(`auto_close_zones`)) {
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