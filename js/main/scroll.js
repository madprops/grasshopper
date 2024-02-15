App.setup_scroll = () => {
  App.scroller_debouncer = App.create_debouncer((mode) => {
    App.do_check_scroller(mode)
  }, App.scroller_delay)
}

App.scroll_to_item = (args = {}) => {
  requestAnimationFrame(() => {
    let def_args = {
      scroll: `nearest`,
      force: false,
    }

    App.def_args(def_args, args)

    if (args.scroll === `none`) {
      return
    }

    if (!args.force) {
      if (args.item.last_scroll > 0) {
        if ((Date.now() - args.item.last_scroll) < App.last_scroll_delay) {
          return
        }
      }
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

    if (!App.get_setting(`smooth_scroll`)) {
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
      let index = App.get_item_element_index({mode: args.item.mode, element: args.item.element})

      if (index === 0) {
        App.hide_scroller(args.item.mode)
      }
      else {
        App.check_scroller(args.item.mode)
      }
    }

    args.item.last_scroll = Date.now()
  })
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
  if (!App.get_setting(`show_scroller`)) {
    return
  }

  let scroller = DOM.el(`#${mode}_scroller`)
  scroller.classList.remove(`hidden`)
}

App.hide_scroller = (mode) => {
  if (!App.get_setting(`show_scroller`)) {
    return
  }

  let scroller = DOM.el(`#${mode}_scroller`)
  scroller.classList.add(`hidden`)
}

App.check_scroller = (mode) => {
  App.scroller_debouncer.call(mode)
}

App.do_check_scroller = (mode = App.window_mode) => {
  App.scroller_debouncer.cancel()

  if (!App.get_setting(`show_scroller`)) {
    return
  }

  let container = DOM.el(`#${mode}_container`)
  let percentage = 100 - ((container.scrollTop /
  (container.scrollHeight - container.clientHeight)) * 100)
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
  let scroller = DOM.create(`div`, `scroller glowbox`, `${mode}_scroller`)
  let content = DOM.create(`div`, `scroller_content`)
  scroller.title = `This is the Scroller`
  let text = DOM.create(`div`)
  text.textContent = `Go To Top`
  let percentage = DOM.create(`div`, ``, `${mode}_scroller_percentage`)
  content.append(text)
  content.append(percentage)
  scroller.append(content)

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

App.scroll_to_selected = (mode) => {
  let selected = App.get_selected(mode)

  if (selected) {
    if (!App.item_is_visible(selected)) {
      App.scroll_to_item({item: selected, scroll: `nearest_instant`, force: true})
    }
  }
}