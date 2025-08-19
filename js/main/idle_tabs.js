App.idle_tabs_enabled = () => {
  return App.get_setting(`idle_tabs_check`)
}

App.get_idle_tabs_delay = () => {
  return App.get_setting(`idle_tabs_delay`)
}

App.start_idle_tabs_check = () => {
  if (!App.idle_tabs_enabled()) {
    App.stop_idle_tabs_timeout()
    return
  }

  App.start_idle_tabs_timeout()
}

App.start_idle_tabs_timeout = () => {
  App.idle_tabs_timeout = setTimeout(() => {
    App.do_idle_tabs_check()
  }, App.idle_tabs_delay)
}

App.stop_idle_tabs_timeout = () => {
  clearTimeout(App.idle_tabs_timeout)
}

App.do_idle_tabs_check = () => {
  if (!App.idle_tabs_enabled()) {
    return
  }

  let delay = App.get_idle_tabs_delay()
  let tabs = App.get_items(`tabs`)

  for (let tab of tabs) {
    if (!tab.activated) {
      continue
    }

    App.do_idle_tab_check(tab, App.now(), delay)
  }

  App.start_idle_tabs_timeout()
}

App.check_idle_tab = (tab) => {
  let delay = App.get_idle_tabs_delay()
  App.do_idle_tab_check(tab, App.now(), delay)
}

App.do_idle_tab_check = (tab, now, delay) => {
  let diff = now - tab.last_access || 0
  let mins = Math.floor(diff / App.MINUTE)

  if (mins >= delay) {
    if (!tab.idle) {
      tab.idle = true
      App.update_item({mode: `tabs`, id: tab.id, info: tab})
    }
  }
  else if (tab.idle) {
    tab.idle = false
    App.update_item({mode: `tabs`, id: tab.id, info: tab})
  }
}

App.tab_is_idle = (tab) => {
  return tab.idle && !tab.unloaded && !tab.header
}