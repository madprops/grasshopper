App.show_scroller = (mode) => {
  let scroller = DOM.el(`#${mode}_scroller`)
  scroller.classList.remove(`hidden`)
}

App.hide_scroller = (mode) => {
  let scroller = DOM.el(`#${mode}_scroller`)
  scroller.classList.add(`hidden`)
}

App.scroller_debouncer = App.create_debouncer((mode) => {
  App.do_check_scroller(mode)
}, App.scroller_debouncer_delay)

App.check_scroller = (mode) => {
  App.scroller_debouncer.call(mode)
}

App.set_scroller_percentage = (mode, percentage) => {
  DOM.el(`#${mode}_scroller`).textContent = `Scrolled: ${percentage}%`
}

App.do_check_scroller = (mode) => {
  if (App.dragging) {
    return
  }

  let container = DOM.el(`#${mode}_container`)
  let a = container.scrollTop
  let b = container.scrollHeight - container.clientHeight
  let percentage = parseInt((a / b) * 100)
  App.set_scroller_percentage(mode, percentage)

  if (container.scrollTop > App.scroller_max_top) {
    App.show_scroller(mode)
  }
  else {
    App.hide_scroller(mode)
  }
}

App.create_scroller = (mode) => {
  let scroller = DOM.create(`div`, `scroller`, `${mode}_scroller`)
  scroller.title = `Click to go to top`

  DOM.ev(scroller, `click`, () => {
    App.goto_top(mode)
  })

  return scroller
}