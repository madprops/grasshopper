App.start_clock = () => {
  setInterval(() => {
    App.check_clock()
  }, App.check_clock_delay)

  App.check_clock()
}

App.check_clock = () => {
  if (!App.get_setting(`show_clock`)) {
    return
  }

  let date = App.now()
  let time = dateFormat(date, `h:MM tt`)
  let filters = DOM.els(`.mode_filter`)

  for (let el of filters) {
    el.placeholder = time
  }
}