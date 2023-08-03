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
}, App.scroller_delay)

App.check_scroller = (mode) => {
  if (App.get_setting(`show_scroller`)) {
    App.scroller_debouncer.call(mode)
  }
}

App.do_check_scroller = (mode) => {
  App.scroller_debouncer.cancel()

  if (App.dragging) {
    return
  }

  let container = DOM.el(`#${mode}_container`)

  if (container.scrollTop > App.scroller_max_top) {
    App.show_scroller(mode)
  }
  else {
    App.hide_scroller(mode)
  }
}

App.create_scroller = (mode) => {
  let scroller = DOM.create(`div`, `scroller`, `${mode}_scroller`)
  scroller.textContent = `Go To Top`

  DOM.ev(scroller, `click`, (e) => {
    if (e.ctrlKey) {
      return
    }

    if (e.shiftKey) {
      App.highlight_to_edge(mode, `up`)
    }

    App.goto_top(mode)
  })

  return scroller
}