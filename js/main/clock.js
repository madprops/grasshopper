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
  let clock = App.get_setting(`clock`)

  if (clock !== `none`) {
    let date = App.now()

    if (clock === `show_24`) {
      placeholder = dateFormat(date, `HH:MM Z`)
    }
    else {
      placeholder = dateFormat(date, `h:MM tt Z`)
    }
  }
  else {
    placeholder = App.filter_placeholder
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

App.cycle_clock = () => {
  let clock = App.get_setting(`clock`)

  if (clock === `none`) {
    App.set_setting({setting:`clock`, value: `show_12`})
  }
  else if (clock === `show_12`) {
    App.set_setting({setting:`clock`, value: `show_24`})
  }
  else {
    App.set_setting({setting: `clock`, value: `none`})
  }

  App.check_refresh_settings()
  App.check_clock(true)
}