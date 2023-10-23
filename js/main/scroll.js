App.setup_scroll = () => {
  App.scroll_debouncer = App.create_debouncer((args) => {
    App.do_scroll_to_item(args)
  }, App.scroll_delay)

  App.scroller_debouncer = App.create_debouncer((mode) => {
    App.do_check_scroller(mode)
  }, App.scroller_delay)
}

App.scroll_to_item = (args) => {
  App.scroll_debouncer.call(args)
}

App.do_scroll_to_item = (args = {}) => {
  App.scroll_debouncer.cancel()

  let def_args = {
    scroll: `nearest`,
  }

  App.def_args(def_args, args)

  if (args.scroll === `none`) {
    return
  }

  let behavior

  if (args.scroll.includes(`_`)) {
    let split = args.scroll.split(`_`)
    args.scroll = split[0]
    behavior = split[1]
  }
  else {
    behavior = `instant`
  }

  args.item.element.scrollIntoView({
    block: args.scroll,
    behavior: behavior,
  })

  if (behavior === `instant`) {
    App.do_check_scroller(args.item.mode)
  }
  else if (behavior === `smooth`) {
    let index = App.get_item_element_index(args.item.mode, args.item.element)

    if (index === 0) {
      App.hide_scroller(args.item.mode)
    }
  }
}

App.scroll = (mode, direction) => {
  let el = DOM.el(`#${mode}_container`)

  if (direction === `up`) {
    el.scrollTop -= App.scroll_amount
  }
  else if (direction === `down`) {
    el.scrollTop += App.scroll_amount
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
  DOM.el(`#${mode}_scroller_percentage`).textContent = `(${per}%)`

  if (container.scrollTop > App.scroller_max_top) {
    App.show_scroller(mode)
  }
  else {
    App.hide_scroller(mode)
  }
}

App.create_scroller = (mode) => {
  let scroller = DOM.create(`div`, `scroller`, `${mode}_scroller`)
  scroller.title = `This is the Scroller`
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

App.container_is_scrolled = (mode) => {
  let container = DOM.el(`#${mode}_container`)
  return container.scrollHeight > container.clientHeight
}