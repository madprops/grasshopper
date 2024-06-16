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
  let placeholder = App.filter_placeholder
  let sett = App.get_setting(`clock`)

  if (sett !== `none`) {
    let date = App.now()

    if (sett === `show_24`) {
      placeholder = dateFormat(date, `HH:MM`)
    }
    else {
      placeholder = dateFormat(date, `h:MM tt`)
    }
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

App.toggle_clock = () => {
  App.toggle_setting(`show_clock`, false)
  App.check_clock(true)
}