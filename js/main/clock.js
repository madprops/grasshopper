App.start_clock = () => {
  let delay = App.check_clock_delay

  if (!delay || (delay < App.SECOND)) {
    App.error(`Clock delay is invalid`)
    return
  }

  setInterval(() => {
    App.check_clock()
  }, delay)
}

App.check_clock = (force = false) => {
  let placeholder
  let enabled = App.get_setting(`clock_enabled`)
  let format = App.get_setting(`clock_format`)

  if (enabled && format) {
    let date = App.now()
    placeholder = dateFormat(date, format)
  }
  else {
    placeholder = App.get_filter_placeholder()
  }

  if (!force) {
    if (placeholder === App.last_filter_placeholder) {
      return
    }
  }

  let filters = DOM.els(`.mode_filter`)

  for (let el of filters) {
    el.placeholder = placeholder
  }

  App.last_filter_placeholder = placeholder
}

App.pick_clock_format = (e) => {
  let items = []

  items.push({
    text: `12 Hour`,
    action: () => {
      App.set_setting({setting: `clock_format`, value: `h:MM tt Z`})
      App.refresh_setting_widgets([`clock_format`])
    },
  })

  items.push({
    text: `24 Hour`,
    action: () => {
      App.set_setting({setting: `clock_format`, value: `HH:MM Z`})
      App.refresh_setting_widgets([`clock_format`])
    },
  })

  App.show_context({e, items})
}