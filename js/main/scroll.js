App.setup_scroll = () => {
  App.scroller_debouncer = App.create_debouncer((mode) => {
    App.do_check_scroller(mode)
  }, App.scroller_delay)

  App.ensure_scroll_debouncer = App.create_debouncer((args) => {
    App.do_ensure_scroll(args)
  }, App.ensure_scroll_delay)
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
        if ((App.now() - args.item.last_scroll) < App.last_scroll_delay) {
          return
        }
      }
    }

    if (!args.item.element) {
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

    if (!App.get_setting(`smooth_scroll`)) {
      behavior = `instant`
    }

    args.item.element.scrollIntoView({
      block: args.scroll,
      behavior,
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

    App.ensure_scroll(args)
    args.item.last_scroll = App.now()
  })
}

App.scroll = (mode, direction) => {
  App.stop_ensure_scroll()
  App.scroll_done = true
  let container = DOM.el(`#${mode}_container`)
  let amount = App.get_setting(`scroll_amount`)

  if (direction === `up`) {
    container.scrollBy(0, -amount)
  }
  else if (direction === `down`) {
    container.scrollBy(0, amount)
  }
}

App.get_scroll_waypoints = (mode) => {
  let el = DOM.el(`#${mode}_container`)
  let height = el.offsetHeight
  let num_screens = Math.ceil(el.scrollHeight / height)
  let waypoints = []

  for (let i = 0; i < num_screens; i++) {
    waypoints.push(i * height * 0.8)
  }

  if (waypoints.length) {
    if (waypoints.at(-1) < el.scrollHeight) {
      waypoints.push(el.scrollHeight)
    }
  }

  return waypoints
}

App.scroll_page = (mode, direction) => {
  App.stop_ensure_scroll()
  let waypoints = App.get_scroll_waypoints(mode)
  let el = DOM.el(`#${mode}_container`)
  let current = el.scrollTop

  if (direction === `up`) {
    waypoints.reverse()
  }

  for (let waypoint of waypoints) {
    if (Math.abs(waypoint - current) < 3) {
      continue
    }

    if (direction === `up`) {
      if (waypoint < current) {
        el.scrollTop = waypoint
        break
      }
    }
    else if (direction === `down`) {
      if (waypoint > current) {
        el.scrollTop = waypoint
        break
      }
    }
  }
}

App.show_scroller = (mode) => {
  if (!App.get_setting(`show_scroller`)) {
    return
  }

  let scroller = DOM.el(`#${mode}_scroller`)
  DOM.show(scroller)
}

App.hide_scroller = (mode) => {
  if (!App.get_setting(`show_scroller`)) {
    return
  }

  let scroller = DOM.el(`#${mode}_scroller`)
  DOM.hide(scroller)
}

App.check_scroller = (mode) => {
  App.scroller_debouncer.call(mode)
}

App.do_check_scroller = (mode = App.active_mode) => {
  App.scroller_debouncer.cancel()

  if (!App.get_setting(`show_scroller`)) {
    return
  }

  let container = DOM.el(`#${mode}_container`)

  if (container.scrollTop > App.scroller_max_top) {
    if (App.get_setting(`show_scroller_info`)) {
      let percentage = 100 - ((container.scrollTop /
      (container.scrollHeight - container.clientHeight)) * 100)

      if (isNaN(percentage)) {
        percentage = 100
      }

      let per = parseInt(percentage)
      DOM.el(`#${mode}_scroller_percentage`).textContent = `(${per}%)`
    }

    App.show_scroller(mode)
  }
  else {
    App.hide_scroller(mode)
  }
}

App.create_scroller = (mode) => {
  let scroller = DOM.create(`div`, `scroller glowbox`, `${mode}_scroller`)
  let content = DOM.create(`div`, `scroller_content`)

  if (App.tooltips()) {
    let click = App.get_cmd_name(`go_to_top`)
    let mclick = App.get_cmd_name(`page_up`)
    scroller.title = `This is the Scroller\nClick: ${click}\nMiddle Click: ${mclick}`
  }

  let text = DOM.create(`div`)
  text.textContent = `Go To Top`
  let percentage = DOM.create(`div`, ``, `${mode}_scroller_percentage`)
  content.append(text)
  content.append(percentage)
  scroller.append(content)
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

App.goto_top_or_bottom = (args = {}) => {
  let def_args = {
    what: `top`,
    mode: App.active_mode,
    select: false,
  }

  App.def_args(def_args, args)
  App.stop_ensure_scroll()

  if (args.select) {
    let visible = App.get_visible(args.mode).slice()

    if (args.what === `bottom`) {
      visible = visible.reverse()
    }

    App.select_item({item: visible.at(0), scroll: `nearest`})
  }
  else {
    let el, box

    if (args.e) {
      box = DOM.parent(args.e.target, [`.box_container`])
    }

    if (box) {
      el = box
    }
    else {
      el = DOM.el(`#${args.mode}_container`)
    }

    if (args.what === `top`) {
      el.scrollTo({
        top: 0,
        behavior: `instant`,
      })
    }
    else if (args.what === `bottom`) {
      el.scrollTo({
        top: el.scrollHeight,
        behavior: `instant`,
      })
    }
  }

  App.do_check_scroller(args.mode)
}

App.scroller_click = (mode, e) => {
  if (e.shiftKey || e.ctrlKey) {
    return
  }

  App.goto_top_or_bottom({what: `top`, mode})
}

App.show_scroller_menu = (e) => {
  let items = App.custom_menu_items({
    name: `scroller_menu`,
  })

  App.show_context({items, e})
}

App.ensure_scroll = (args) => {
  App.ensure_scroll_debouncer.call(args)
}

App.stop_ensure_scroll = () => {
  App.ensure_scroll_debouncer.cancel()
}

App.do_ensure_scroll = (args) => {
  let mode = args.item.mode
  let container = DOM.el(`#${mode}_container`)
  let top = args.item.element.offsetTop
  let bottom = top + args.item.element.offsetHeight
  let scroller = DOM.el(`#${mode}_scroller`)
  let scroller_height

  if (!DOM.is_hidden(scroller)) {
    scroller_height = scroller.offsetHeight
  }
  else {
    scroller_height = 0
  }

  if ((top < scroller_height) || (bottom > container.clientHeight)) {
    args.item.element.scrollIntoView({
      block: args.scroll,
      behavior: `instant`,
    })
  }
}