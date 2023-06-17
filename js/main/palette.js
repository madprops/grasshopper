App.setup_palette = () => {
  App.create_popup({
    id: `palette`, setup: () => {
      App.fill_palette_container()
      let container = DOM.el(`#palette_commands`)

      DOM.ev(container, `click`, (e) => {
        App.palette_action(e.target)
      })

      DOM.ev(DOM.el(`#palette_filter`), `input`, (e) => {
        App.filter_palette()
      })

      DOM.ev(DOM.el(`#palette_info`), `click`, () => {
        let s = `This is the command palette. You can use it to quickly run commands.`
        s += ` Just type something and hit Enter or Up/Down arrows.`
        s += ` You can also open the palette by tapping Ctrl twice in a row.`
        App.show_alert(s, undefined, false)
      })
    }
  })
}

App.show_palette = () => {
  NeedContext.hide()
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
  let filter_el = DOM.el(`#palette_filter`)
  let filter = App.single_space(filter_el.value.trim().toLowerCase())
  let filter_words = filter.split(` `)
  let filter_clean = App.remove_spaces(filter)

  for (let el of DOM.els(`.palette_item`, container)) {
    let text = el.textContent.toLowerCase()
    let text_clean = App.remove_spaces(text)
    let match = filter_words.every(x => text.includes(x)) || text_clean.includes(filter_clean)

    if (!match) {
      if (App.string_similarity(filter, text) >= App.similarity_threshold) {
        match = true
      }
    }

    if (match) {
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

  if (first) {
    App.palette_select(first)
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
    App.hide_popup(`palette`)
    App.run_command({cmd: cmd, from: `palette`})
    App.update_command_history(cmd)
    App.fill_palette_container()
  }
}

App.fill_palette_container = () => {
  let container = DOM.el(`#palette_commands`)
  container.innerHTML = ``

  for (let cmd of App.sorted_commands) {
    let el = DOM.create(`div`, `palette_item action`)
    el.textContent = cmd.name
    el.dataset.command = cmd.cmd
    container.append(el)
  }
}