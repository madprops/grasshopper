App.start_clock = () => {
  setInterval(() => {
    App.check_clock()
  }, App.check_clock_delay)

  App.check_clock()
}

App.check_clock = () => {
  let placeholder = App.filter_placeholder

  if (App.get_setting(`show_clock`)) {
    let date = App.now()
    placeholder = dateFormat(date, `h:MM tt`)
  }

  if (placeholder === App.last_filter_placeholder) {
    return
  }

  let filters = DOM.els(`.mode_filter`)

  for (let el of filters) {
    el.placeholder = placeholder
  }

  App.last_filter_placeholder = placeholder
}

App.toggle_clock = () => {
  App.toggle_setting(`show_clock`, false)
  App.check_clock()
}