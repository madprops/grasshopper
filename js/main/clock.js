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
  let sett = App.get_setting(`clock`)

  if (sett === `none`) {
    App.set_setting(`clock`, `show_12`, false)
  }
  else if (sett === `show_12`) {
    App.set_setting(`clock`, `show_24`, false)
  }
  else {
    App.set_setting(`clock`, `none`, false)
  }

  App.check_clock(true)
}