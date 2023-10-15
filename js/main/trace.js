App.update_active_trace = (new_active) => {
  for (let it of App.get_items(`tabs`)) {
    it.element.classList.remove(`show_trace`)
  }

  let n = 1

  for (let item of App.active_history) {
    if (item === new_active) {
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