App.setup_palette = () => {
  App.create_popup({
    id: `palette`, setup: () => {
      App.fill_palette_container()
      let container = DOM.el(`#palette_commands`)

      DOM.ev(container, `click`, (e) => {
        App.palette_action(e.target)
      })

      DOM.ev(DOM.el(`#palette_info`), `click`, () => {
        let s = `You can use this palette to run commands.`
        s += ` You can also open this by tapping Ctrl twice in a row.`
        App.show_alert_2(s)
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
    App.update_command_history(cmd)
    App.fill_palette_container()
    App.run_command({cmd: cmd, from: `palette`})
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

App.palette_filter_focused = () => {
  return document.activeElement.id === `palette_filter`
}

App.clear_palette_filter = () => {
  if (App.filter_has_value(`palette`)) {
    App.set_filter(`palette`, ``)
  }
  else {
    App.hide_all_popups()
  }
}

App.filter_palette_debouncer = App.create_debouncer(() => {
  App.do_filter_palette()
}, App.filter_debouncer_delay_2)

App.filter_palette = () => {
  App.filter_palette_debouncer.call()
}

App.do_filter_palette = () => {
  App.filter_palette_debouncer.cancel()
  App.palette_selected = undefined
  let container = DOM.el(`#palette_commands`)
  let value = App.get_clean_filter(`palette`)
  let words = value.split(` `)
  let value_clean = App.remove_spaces(value)

  for (let el of DOM.els(`.palette_item`, container)) {
    let text = el.textContent.toLowerCase()
    let text_clean = App.remove_spaces(text)
    let match = words.every(x => text.includes(x)) || text_clean.includes(value_clean)

    if (!match) {
      if (App.string_similarity(value, text) >= App.similarity_threshold) {
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