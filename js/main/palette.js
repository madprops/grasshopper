App.setup_palette = () => {
  App.create_popup({
    id: `palette`, setup: () => {
      let container = DOM.el(`#palette_commands`)
      let filter = DOM.el(`#palette_filter`)

      for (let cmd of App.commands) {
        let el = DOM.create(`div`, `palette_item action`)
        el.textContent = cmd[0]
        el.dataset.command = cmd[1]
        container.append(el)
      }

      DOM.ev(container, `click`, (e) => {
        App.palette_action(e.target)
      })

      DOM.ev(filter, `input`, (e) => {
        App.filter_palette()
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
  App.palette_selected = undefined
  let container = DOM.el(`#palette_commands`)
  let filter = DOM.el(`#palette_filter`)
  let value = filter.value.trim().toLowerCase()
  value = App.remove_spaces(value)

  for (let el of DOM.els(`.palette_item`, container)) {
    let text = el.textContent.toLowerCase()
    text = App.remove_spaces(text)

    if (text.includes(value)) {
      el.classList.remove(`hidden`)
    }
    else {
      el.classList.add(`hidden`)
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

  if (els.length < 2) {
    return
  }

  let waypoint = false

  if (reverse) {
    els.reverse()
  }

  let first

  for (let el of els) {
    if (!el.classList.contains(`hidden`)) {
      if (waypoint) {
        App.palette_select(el)
        return
      }
      else {
        if (!first) {
          first = el
        }
      }
    }

    if (el === App.palette_selected) {
      waypoint = true
    }
  }

  App.palette_select(first)
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
    App.hide_popup(`palette`)
    App.run_command(cmd)
  }
}