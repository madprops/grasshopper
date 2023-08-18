App.setup_modes = () => {
  for (let mode of App.modes) {
    App[`${mode}_changed`] = false
  }
}

App.show_mode = async (mode, cycle = false) => {
  App.windows[mode].show()
  let was_filtered = App.was_filtered(mode)

  if ((App.active_mode === mode) &&
  (App[`${mode}_items`].length > 0) &&
  !was_filtered && !App[`${mode}_changed`]) {
    App.select_first_item(mode, true)
    return
  }

  let value = App.get_last_filter_value(cycle)
  App.active_mode = mode
  App.empty_footer_info()
  App.cancel_filter()
  let container = DOM.el(`#${mode}_container`)
  App.set_filter(mode, value, false)
  let m = App.filter_modes(mode)[0]
  App.set_filter_mode(mode, m[0], false)
  App[`${mode}_filter_mode`] = m[0]
  App[`last_${mode}_query`] = undefined
  let persistent = App.persistent_modes.includes(mode)
  let maxed = App.maxed_items.includes(mode)
  let items_ready = false
  let items

  if (persistent) {
    if (App[`${mode}_items`].length > 0) {
      items = App[`${mode}_items`]
      items_ready = true
    }
  }

  // Clear inactive items
  for (let m of App.modes) {
    if (App.persistent_modes.includes(m)) {
      if (App[`${m}_items`].length > 0) {
        continue
      }
    }

    App.clear_items(m)
  }

  if (maxed && value) {
    items = []
  }
  else if (!items_ready) {
    items = await App[`get_${mode}`]()
    was_filtered = false
  }

  if (!persistent) {
    if (mode !== App.active_mode) {
      return
    }
  }

  if (mode === `tabs`) {
    if (App.get_setting(`pin_icon`)) {
      container.classList.add(`has_pin_icon`)
    }
    else {
      container.classList.remove(`has_pin_icon`)
    }

    if (App.get_setting(`normal_icon`)) {
      container.classList.add(`has_normal_icon`)
    }
    else {
      container.classList.remove(`has_normal_icon`)
    }
  }

  if (maxed && value) {
    // Filter will search
  }
  else if (!items_ready) {
    App.process_info_list(mode, items)
  }
  else {
    App.update_footer_info(App.get_selected(mode))
  }

  if (value || was_filtered) {
    App.do_filter(mode, true)
  }
  else {
    App.select_first_item(mode, true, `center_instant`)
  }

  App[`${mode}_changed`] = false
  App.focus_filter(mode)
  App.do_check_scroller(mode)
  App.check_item_theme()
  App.check_playing(mode)
}

App.mode_order_up = (el) => {
  let prev = el.previousElementSibling

  if (prev) {
    el.parentNode.insertBefore(el, prev)
    App.update_mode_order()
  }
}

App.mode_order_down = (el) => {
  let next = el.nextElementSibling

  if (next) {
    el.parentNode.insertBefore(next, el)
    App.update_mode_order()
  }
}

App.get_mode_order = () => {
  let imodes = []

  for (let mode of App.modes) {
    imodes.push({mode: mode, index: App.get_setting(`${mode}_index`)})
  }

  imodes.sort((a, b) => (a.index > b.index) ? 1 : -1)
  App.mode_order = imodes.map(x => x.mode)
}

App.get_mode_index = (mode) => {
  for (let [i, it] of App.mode_order.entries()) {
    if (it === mode) {
      return i
    }
  }
}

App.get_mode_name = (mode) => {
  if (mode === `bookmarks`) {
    return `BMarks`
  }

  return App.capitalize(mode)
}

App.show_main_mode = () => {
  App.show_mode(App.mode_order[0])
}

App.cycle_modes_debouncer = App.create_debouncer((reverse, cycle) => {
  App.do_cycle_modes(reverse, cycle)
}, App.wheel_delay)

App.cycle_modes = (reverse = false, cycle = false) => {
  App.cycle_modes_debouncer.call(reverse, cycle)
}

App.do_cycle_modes = (reverse, cycle) => {
  let modes = App.mode_order
  let index = modes.indexOf(App.window_mode)
  let new_mode

  if (index === -1) {
    return
  }

  if (reverse) {
    if (index === 0) {
      new_mode = modes.slice(-1)[0]
    }
    else {
      new_mode = modes[index - 1]
    }
  }
  else {
    if (index === modes.length - 1) {
      new_mode = modes[0]
    }
    else {
      new_mode = modes[index + 1]
    }
  }

  App.show_mode(new_mode, cycle)
}

App.update_mode_order = () => {
  let boxes = DOM.els(`.mode_order_row`, DOM.el(`#settings_mode_order`))
  let modes = boxes.map(x => x.dataset.mode)

  for (let [i, mode] of modes.entries()) {
    App.set_setting(`${mode}_index`, i)
  }

  App.get_mode_order()
}

App.show_first_mode = (allow_same = true) => {
  let mode = App.mode_order[0]

  if (!allow_same) {
    if (App.active_mode === mode) {
      return
    }
  }

  App.show_mode(mode)
}

App.first_mode = () => {
  return App.mode_order[0]
}

App.getting = (mode) => {
  let icon = App.mode_icons[mode]
  let name = App.capitalize(mode)
  App.debug(`${icon} Getting ${name}`)
}

App.make_mode_order = () => {
  let mode_order = DOM.el(`#settings_mode_order`)
  mode_order.innerHTML = ``

  for (let mode of App.mode_order) {
    let row = DOM.create(`div`, `mode_order_row`)
    row.dataset.mode = mode

    let up = DOM.create(`div`, `button mode_order_button`)
    up.textContent = `Up`
    row.append(up)

    DOM.ev(up, `click`, () => {
      App.mode_order_up(row)
    })

    let text = DOM.create(`div`, `mode_order_item_text`)
    text.textContent = App.get_mode_name(mode)
    row.append(text)

    let down = DOM.create(`div`, `button mode_order_button`)
    down.textContent = `Down`
    row.append(down)

    DOM.ev(down, `click`, () => {
      App.mode_order_down(row)
    })

    mode_order.append(row)
  }
}