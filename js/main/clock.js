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
  let clock_format = App.get_setting(`clock_format`)

  if (clock_format) {
    let date = App.now()
    placeholder = dateFormat(date, clock_format)
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