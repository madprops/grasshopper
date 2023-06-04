App.show_palette = () => {
  App.show_popup(`palette`)
  let container = DOM.el(`#palette_commands`)
  let filter = DOM.el(`#palette_filter`)
  let els = DOM.els(`.palette_item`, container)

  for (let el of els) {
    el.classList.remove(`hidden`)
  }

  els[0].classList.add(`palette_selected`)

  container.scrollTop = 0
  filter.value = ``
  filter.focus()
}

App.filter_palette = () => {
  let container = DOM.el(`#palette_commands`)
  let filter = DOM.el(`#palette_filter`)
  let value = filter.value.trim().toLowerCase()

  for (let el of DOM.els(`.palette_item`, container)) {
    if (el.textContent.toLowerCase().indexOf(value) === -1) {
      el.classList.add(`hidden`)
    }
    else {
      el.classList.remove(`hidden`)
    }
  }
}

App.palette_select = (reverse = false) => {
  let container = DOM.el(`#palette_commands`)
  let els = DOM.els(`.palette_item`, container)
  let waypoint = false

  if (reverse) {
    els.reverse()
  }

  for (let el of els) {
    if (waypoint) {
      waypoint.classList.remove(`palette_selected`)
      el.classList.add(`palette_selected`)
      el.scrollIntoView({block: `nearest`})
      break
    }

    if (el.classList.contains(`palette_selected`)) {
      waypoint = el
    }
  }
}

App.palette_select_next = () => {

}

App.palette_enter = () => {
  App.hide_popup(`palette`)
}