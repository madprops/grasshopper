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
  let percentage

  if (App.get_setting(`reverse_scroller_percentage`)) {
    percentage = (container.scrollTop /
    (container.scrollHeight - container.clientHeight)) * 100
  }
  else {
    percentage = 100 - ((container.scrollTop /
    (container.scrollHeight - container.clientHeight)) * 100)
  }

  let per = parseInt(percentage)
  let sper = App.fillpad(per, 2, 0)
  DOM.el(`#${mode}_scroller_percentage`).textContent = `(${sper}%)`

  if (container.scrollTop > App.scroller_max_top) {
    App.show_scroller(mode)
  }
  else {
    App.hide_scroller(mode)
  }
}

App.create_scroller = (mode) => {
  let scroller = DOM.create(`div`, `scroller`, `${mode}_scroller`)
  let text = DOM.create(`div`)
  text.textContent = `Go To Top`
  let percentage = DOM.create(`div`, ``, `${mode}_scroller_percentage`)
  scroller.append(text)
  scroller.append(percentage)

  DOM.ev(scroller, `click`, (e) => {
    if (e.shiftKey || e.ctrlKey) {
      return
    }

    App.goto_top(mode)
  })

  return scroller
}