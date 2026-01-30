App.start_clock = () => {
  let delay = App.check_clock_delay

  if (!delay || (delay < 1)) {
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

App.pick_clock_format = (e, setting = `clock_format`) => {
  let items = []

  items.push({
    text: `12 Hour`,
    action: () => {
      App.set_setting({setting, value: `h:MM tt`})
      App.refresh_setting_widgets([setting])
    },
  })

  items.push({
    text: `24 Hour`,
    action: () => {
      App.set_setting({setting, value: `HH:MM`})
      App.refresh_setting_widgets([setting])
    },
  })

  items.push({
    text: `Seconds`,
    action: () => {
      App.set_setting({setting, value: `MM:ss`})
      App.refresh_setting_widgets([setting])
    },
  })

  items.push({
    text: `Full Date`,
    action: () => {
      App.set_setting({setting, value: `dddd dS mmmm yyyy`})
      App.refresh_setting_widgets([setting])
    },
  })

  items.push({
    text: `Short Date`,
    action: () => {
      App.set_setting({setting, value: `dd/mm/yy`})
      App.refresh_setting_widgets([setting])
    },
  })

  App.show_context({e, items})
}