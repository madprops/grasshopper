App.create_active_trace = () => {
  return DOM.create(`div`, `item_trace item_node hidden`)
}

App.update_active_trace = () => {
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