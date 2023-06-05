App.check_scroller_debouncer = App.create_debouncer((mode) => {
  App.do_check_scroller(mode)
}, App.check_scroller_debouncer_delay)

App.check_scroller = (mode) => {
  if (App.get_setting(`show_scroller`)) {
    App.check_scroller_debouncer.call(mode)
  }
}

App.show_scroller = (mode) => {
  let scroller = DOM.el(`#${mode}_scroller`)
  scroller.classList.remove(`hidden`)
}

App.hide_scroller = (mode) => {
  let scroller = DOM.el(`#${mode}_scroller`)
  scroller.classList.add(`hidden`)
}

App.do_check_scroller = (mode) => {
  let container = DOM.el(`#${mode}_container`)

  if (container.scrollTop >= 5) {
    App.show_scroller(mode)
  }
  else {
    App.hide_scroller(mode)
  }
}

App.create_scroller = (mode) => {
  let scroller = DOM.create(`div`, `scroller`, `${mode}_scroller`)
  scroller.textContent = `Go To Top`

  DOM.ev(scroller, `click`, () => {
    App.goto_top(mode)
  })

  return scroller
}