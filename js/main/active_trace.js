App.update_active_trace = () => {
  for (let item of App.get_items(`tabs`)) {
    item.element.classList.remove(`show_trace`)
  }

  let n = 1

  for (let item of App.active_history) {
    if (item.active) {
      continue
    }

    item.element.classList.add(`show_trace`)
    let trace = DOM.el(`.item_trace`, item.element)
    trace.textContent = n

    if (n === 9) {
      break
    }

    n += 1
  }
}