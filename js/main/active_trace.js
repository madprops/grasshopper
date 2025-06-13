App.setup_active_trace = () => {
  App.update_active_trace_debouncer = App.create_debouncer((what) => {
    App.do_update_active_trace(what)
  }, App.update_active_trace_delay)
}

App.create_active_trace = () => {
  return DOM.create(`div`, `item_trace item_node hidden`)
}

App.update_active_trace = () => {
  App.update_active_trace_debouncer.call()
}

App.do_update_active_trace = () => {
  App.update_active_trace_debouncer.cancel()

  if (!App.get_setting(`active_trace`)) {
    return
  }

  for (let item of App.get_items(`tabs`)) {
    let trace = DOM.el(`.item_trace`, item.element)
    DOM.hide(trace)
  }

  let n = 1
  let items = App.get_recent_tabs({max: 9})

  for (let item of items) {
    if (item.active) {
      continue
    }

    let trace = DOM.el(`.item_trace`, item.element)
    trace.textContent = n
    DOM.show(trace)

    if (n === 9) {
      break
    }

    n += 1
  }
}

App.pick_active_trace = (index) => {
  let items = App.get_recent_tabs({max: 9})
  let tab = items[index]

  if (tab) {
    App.tabs_action({item: tab, from: `active_trace`})
  }
}