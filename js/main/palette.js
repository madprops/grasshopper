App.setup_palette = () => {
  App.create_popup({
    id: `palette`, setup: () => {
      let container = DOM.el(`#palette_commands`)

      for (let cmd of App.commands) {
        let el = DOM.create(`div`, `palette_item action`)
        el.textContent = cmd[0]
        el.dataset.command = cmd[1]
        container.append(el)
      }

      DOM.ev(container, `click`, (e) => {
        App.palette_action(e.target)
      })
    }
  })
}

App.show_palette = () => {
  App.show_popup(`palette`)
  let container = DOM.el(`#palette_commands`)
  let filter = DOM.el(`#palette_filter`)
  let els = DOM.els(`.palette_item`, container)

  for (let el of els) {
    el.classList.remove(`hidden`)
  }

  App.palette_select_first()

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

  App.palette_select_first()
}

App.palette_select = (el) => {
  let container = DOM.el(`#palette_commands`)
  let els = DOM.els(`.palette_item`, container)

  for (let el of els) {
    el.classList.remove(`palette_selected`)
  }

  App.palette_selected = el
  App.palette_selected.classList.add(`palette_selected`)
  App.palette_selected.scrollIntoView({block: `nearest`})
}

App.palette_select_first = () => {
  let container = DOM.el(`#palette_commands`)
  let els = DOM.els(`.palette_item`, container)

  for (let el of els) {
    if (!el.classList.contains(`hidden`)) {
      App.palette_select(el)
      break
    }
  }
}

App.palette_next = (reverse = false) => {
  let container = DOM.el(`#palette_commands`)
  let els = DOM.els(`.palette_item`, container)
  let waypoint = false

  if (reverse) {
    els.reverse()
  }

  for (let el of els) {
    if (waypoint) {
      App.palette_select(el)
      break
    }

    if (el === App.palette_selected) {
      waypoint = true
    }
  }
}

App.palette_enter = () => {
  App.palette_action(App.palette_selected)
}

App.palette_action = (el) => {
  if (!el) {
    return
  }

  let cmd = el.dataset.command

  if (cmd) {
    App.run_command(cmd)
    App.hide_popup(`palette`)
  }
}