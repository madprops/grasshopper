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
  App.clean_active_history()

  for (let item of App.get_items(`tabs`)) {
    let trace = DOM.el(`.item_trace`, item.element)
    trace.classList.add(`hidden`)
  }

  let n = 1

  for (let item of App.active_history) {
    if (item.active) {
      continue
    }

    let trace = DOM.el(`.item_trace`, item.element)
    trace.classList.remove(`hidden`)
    trace.textContent = n

    if (n === 9) {
      break
    }

    n += 1
  }
}