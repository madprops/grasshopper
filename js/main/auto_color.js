App.start_auto_color = () => {
  let enabled = App.get_setting(`auto_color_enabled`)
  clearInterval(App.auto_color_interval)

  if (!enabled) {
    return
  }

  let delay = parseInt(App.get_setting(`auto_color_delay`))

  if (isNaN(delay)) {
    return
  }

  if (delay <= 0) {
    return
  }

  App.do_auto_color()

  App.auto_color_interval = setInterval(() => {
    if (!App.on_items()) {
      return
    }

    App.do_auto_color()
  }, delay)
}

App.do_auto_color = () => {
  if (App.is_dark_mode()) {
    App.random_colors(`dark`)
  }
  else {
    App.random_colors(`light`)
  }
}

App.toggle_auto_color = () => {
  let ac = App.get_setting(`auto_color_enabled`)

  App.set_setting({
    setting: `auto_color_enabled`,
    value: !ac,
    action: true,
  })

  App.toggle_message(`Auto Color`, `auto_color_enabled`)
  App.start_auto_color()
}