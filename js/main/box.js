App.create_box = (mode) => {
  let box = DOM.create(`div`, `box`, `box_${mode}`)
  return box
}

App.update_tab_box = (new_active) => {
  let c = DOM.el(`#box_tabs`)
  c.innerHTML = ``

  for (let item of App.active_history) {
    if (item === new_active) {
      continue
    }

    let clone = DOM.create(`div`, `box_item action`)
    let icon = DOM.create(`div`, `box_item_icon`)
    let o_icon = DOM.el(`.item_icon_container`, item.element).cloneNode(true)
    icon.append(o_icon)
    let text = DOM.create(`div`, `box_item_text`)
    text.textContent = item.title
    clone.append(icon)
    clone.append(text)

    DOM.ev(clone, `click`, () => {
      App.tabs_action(item)
    })

    c.append(clone)
    App.scroll_to_top(c)
  }
}