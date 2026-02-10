App.start_themed_week = () => {
  let enabled = App.get_setting(`themed_week_enabled`)
  clearInterval(App.themed_week_interval)

  if (!enabled) {
    return
  }

  let delay = App.themed_week_delay

  if (isNaN(delay)) {
    return
  }

  if (delay <= 0) {
    return
  }

  App.check_themed_week()

  App.themed_week_interval = setInterval(() => {
    App.check_themed_week()
  }, delay)
}

App.check_themed_week = () => {
  if (!App.get_setting(`themed_week_enabled`)) {
    return
  }

  let day = App.get_day_number()
  App.settings_mirror = false
  App.set_theme(day)
  App.settings_mirror = true
}

App.toggle_themed_week = () => {
  let ac = App.get_setting(`themed_week_enabled`)

  App.set_setting({
    setting: `themed_week_enabled`,
    value: !ac,
    action: true,
  })

  App.toggle_message(`Themed Week`, `themed_week_enabled`)
  App.start_themed_week()
}