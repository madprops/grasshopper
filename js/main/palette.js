App.start_palette = () => {
  if (App.check_ready(`palette`)) {
    return
  }

  App.create_popup({
    id: `palette`,
    setup: () => {
      App.fill_palette()
      let container = DOM.el(`#palette_items`)

      DOM.ev(container, `click`, (e) => {
        App.palette_action(e.target)
      })

      DOM.ev(`#palette_filter`, `input`, () => {
        App.filter_palette()
      })
    },
  })

  App.filter_palette_debouncer = App.create_debouncer(() => {
    App.do_filter_palette()
  }, App.filter_delay_2)

  DOM.ev(`#palette_filter_clear`, `click`, () => {
    App.reset_generic_filter(`palette`)
  })
}

App.show_palette = (prefilter = ``) => {
  App.start_palette()
  App.setup_popup(`palette`)
  let container = DOM.el(`#palette_items`)
  let filter = DOM.el(`#palette_filter`)
  let els = DOM.els(`.palette_item`, container)
  let active = App.get_active_items()
  let too_many = active.length > App.max_command_check_items
  let num_selected = App.get_active_items().length
  let num = 0

  for (let el of els) {
    let split = el.dataset.name.split(` `)
    let cname

    if (split.length < 2) {
      cname = el.dataset.name
    }
    else {
      cname = split.slice(1).join(` `)
    }

    if (cname.startsWith(`!`)) {
      DOM.hide(el)
    }
    else {
      DOM.show(el)
    }

    let command = App.get_command(el.dataset.command)
    let nel = DOM.el(`.cmd_name`, el)

    if ((num_selected > 1) && command.name_multiple) {
      nel.textContent = command.name_multiple
    }
    else {
      nel.textContent = command.name
    }

    if (too_many || App.check_command(command, {from: `palette`})) {
      DOM.show(el, 2)
      num += 1
    }
    else {
      DOM.hide(el, 2)
    }
  }

  filter.placeholder = `Command (${num})`
  App.hide_context()
  App.show_popup(`palette`)
  App.palette_select_first()
  container.scrollTop = 0
  filter.value = prefilter
  filter.focus()

  if (prefilter) {
    App.do_filter_palette()
  }
}

App.hide_palette = () => {
  App.hide_popup(`palette`)
}

App.palette_select = (el) => {
  let container = DOM.el(`#palette_items`)
  let els = DOM.els(`.palette_item`, container)

  for (let el of els) {
    el.classList.remove(`palette_selected`)
  }

  App.palette_selected = el
  App.palette_selected.classList.add(`palette_selected`)
  App.palette_selected.scrollIntoView({block: `nearest`})
}

App.palette_item_hidden = (el) => {
  return DOM.class(el, [`hidden`, `hidden_2`])
}

App.palette_select_first = () => {
  let container = DOM.el(`#palette_items`)
  let els = DOM.els(`.palette_item`, container)

  for (let el of els) {
    if (!App.palette_item_hidden(el)) {
      App.palette_select(el)
      break
    }
  }
}

App.palette_next = (reverse = false) => {
  let container = DOM.el(`#palette_items`)
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
    if (!App.palette_item_hidden(el)) {
      if (waypoint) {
        App.palette_select(el)
        return
      }

      if (!first) {
        first = el
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

  let item = DOM.parent(el, [`.palette_item`])

  if (!item) {
    return
  }

  let cmd = item.dataset.command

  if (cmd) {
    App.hide_all_popups()
    App.update_command_history(cmd)
    App.fill_palette()
    App.run_command({cmd, from: `palette`})
  }
}

App.fill_palette = () => {
  if (!App.palette_ready) {
    return
  }

  let container = DOM.el(`#palette_items`)
  container.innerHTML = ``
  let num = 0

  for (let cmd of App.command_palette_items) {
    if (cmd.skip_palette) {
      continue
    }

    let el = DOM.create(`div`, `palette_item action filter_item filter_text`)
    el.dataset.command = cmd.cmd
    el.dataset.name = cmd.name

    if (cmd.icon) {
      let icon = DOM.create(`div`, `palette_icon`)
      icon.append(cmd.icon)
      el.append(icon)
    }

    let name = DOM.create(`div`, `cmd_name`)
    name.append(cmd.name)
    el.append(name)
    el.title = `${cmd.info}\nKey: ${cmd.cmd}`
    container.append(el)
    num += 1
  }
}

App.palette_filter_focused = () => {
  return document.activeElement.id === `palette_filter`
}

App.clear_palette_filter = () => {
  if (App.filter_has_value(`palette`)) {
    App.reset_generic_filter(`palette`)
  }
  else {
    App.hide_all_popups()
  }
}

App.filter_palette = () => {
  App.filter_palette_debouncer.call()
}

App.do_filter_palette = () => {
  App.filter_palette_debouncer.cancel()
  App.palette_selected = undefined
  App.do_filter_2(`palette`)
  App.palette_select_first()
}