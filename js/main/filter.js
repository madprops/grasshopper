App.setup_filter = () => {
  App.filter_debouncer = App.create_debouncer((mode) => {
    App.do_filter(mode)
  }, App.filter_debouncer_delay)
}

App.filter = (mode) => {
  App.filter_debouncer.call(mode)
}

App.cancel_filter = () => {
  App.filter_debouncer.cancel()
}

App.do_filter = async (mode) => {
  App.cancel_filter()
  App.log(`Filter: ${mode}`)
  let value = App.get_filter(mode)

  if (mode === `history`) {
    await App.search_history()

    if (App.window_mode !== `history`) {
      return
    }
  }

  App.hide_result(mode)

  // Try to solve math expression
  if (App.contains_number(value)) {
    let ans = App.calc(value)

    if (ans) {
      if (ans.toString() !== value) {
        App.show_result(mode, ans)
      }
    }
  }

  let items = App.get_items(mode)

  if (!items) {
    return
  }

  let filter_mode = App.filter_mode(mode)
  let skip = !value && filter_mode === `all`
  let words, filter_words

  if (!skip) {
    words = value.split(` `).filter(x => x !== ``)
    filter_words = words.map(x => x.toLowerCase())
  }

  let duplicates

  if (filter_mode === `duplicates`) {
    duplicates = App.find_duplicates(items, `url`)
  }

  let use_regex = false
  let regex_filter

  if (value.startsWith(`/`) && value.endsWith(`/`)) {
    use_regex = true
    regex_filter = new RegExp(value.slice(1, -1))
  }

  function check (title, path) {
    if (use_regex) {
      return regex_filter.test(title) || regex_filter.test(path)
    }
    else {
      return filter_words.every(x => title.includes(x) || path.includes(x))
    }
  }

  function matched (item) {
    let match = false
    let title = item.title_lower
    let path = item.path_lower

    if (check(title, path)) {
      if (filter_mode === `all`) {
        match = true
      }
      else if (filter_mode === `normal`) {
        match = App.tab_is_normal(item)
      }
      else if (filter_mode === `playing`) {
        match = item.audible || item.muted
      }
      else if (filter_mode === `pins`) {
        match = item.pinned
      }
      else if (filter_mode === `suspended`) {
        match = item.discarded
      }
      else if (filter_mode === `title`) {
        match = App.get_title(item.url)
      }
      else if (filter_mode === `star`) {
        match = App.get_star_by_url(item.url)
      }
      else if (filter_mode === `images`) {
        match = item.image
      }
      else if (filter_mode === `videos`) {
        match = item.video
      }
      else if (filter_mode === `duplicates`) {
        match = duplicates.includes(item)
      }
    }

    return match
  }

  for (let it of items) {
    if (!it.element) {
      continue
    }

    if (skip || matched(it)) {
      App.show_item(it)
    }
    else {
      App.hide_item(it)
    }
  }

  App.set_selected(mode, undefined)
  App.select_first_item(mode, !App.is_filtered(mode))
  App.update_footer_info(App.get_selected(mode))
  App.update_footer_count(mode)
  App.do_check_pinline()
  App.do_check_scroller(mode)
}

App.focus_filter = (mode) => {
  DOM.el(`#${mode}_filter`).focus()
}

App.is_filtered = (mode) => {
  return App.get_filter(mode, true) || App.filter_mode(mode) !== `all`
}

App.check_clear_filter = () => {
  if (App.on_item_window()) {
    if (App.get_setting(`clear_filter`)) {
      if (App.is_filtered(App.window_mode)) {
        App.show_item_window(App.window_mode)
      }
    }
  }
}

App.clear_filter = (mode = App.window_mode) => {
  if (App.get_filter(mode, false)) {
    App.set_filter(mode, ``)
  }
}

App.set_filter = (mode, text, filter = true) => {
  DOM.el(`#${mode}_filter`).value = text

  if (filter) {
    App.do_filter(mode)
  }
}

App.get_filter = (mode, trim = true) => {
  let value = DOM.el(`#${mode}_filter`).value

  if (trim) {
    value = value.trim()
  }

  return value
}

App.show_filter_modes = (mode) => {
  let items = []

  for (let filter_mode of App.filter_modes(mode)) {
    if (filter_mode[0] === `--separator--`) {
      items.push({separator: true})
      continue
    }

    if (filter_mode[0] === `custom`) {
      let filters = App.get_setting(`custom_filters`)

      if (filters.length === 0) {
        items.push({
          text: `Custom`,
          action: () => {
            App.show_alert(`You have no custom filters. Add some in the settings.`, undefined, false)
          }
        })
      }
      else if (filters.length === 1) {
        items.push({
          text: `Custom`,
          action: () => {
            App.set_filter(mode, filters[0])
          }
        })
      }
      else {
        items.push({
          text: `Custom`,
          get_items: () => {
            return App.get_custom_filters(mode)
          },
        })
      }

      continue
    }

    let selected = App.filter_mode(mode) === filter_mode[0]

    items.push({
      text: filter_mode[1],
      action: () => {
        App.set_filter_mode(mode, filter_mode)
      },
      selected: selected
    })
  }

  let btn = DOM.el(`#${mode}_filter_modes`)
  NeedContext.show_on_element(btn, items, false, btn.clientHeight)
}

App.cycle_filter_modes = (mode, reverse = true) => {
  let modes = App.filter_modes(mode)
  let waypoint = false

  if (reverse) {
    for (let filter_mode of modes.slice(0).reverse()) {
      if (filter_mode[0].startsWith(`--`)) {
        continue
      }

      if (waypoint) {
        App.set_filter_mode(mode, filter_mode)
        return
      }

      if (filter_mode[0] === App.filter_mode(mode)) {
        waypoint = true
      }
    }
  }
  else {
    for (let filter_mode of modes) {
      if (filter_mode[0].startsWith(`--`)) {
        continue
      }

      if (waypoint) {
        App.set_filter_mode(mode, filter_mode)
        return
      }

      if (filter_mode[0] === App.filter_mode(mode)) {
        waypoint = true
      }
    }
  }

  // If no result
  if (reverse) {
    App.set_filter_mode(mode, modes[modes.length - 1])
  }
  else {
    App.set_filter_mode(mode, modes[0])
  }
}

App.filter_modes = (mode) => {
  return App[`${mode}_filter_modes`]
}

App.filter_mode = (mode) => {
  return App[`${mode}_filter_mode`]
}

App.set_filter_mode = (mode, filter_mode, filter = true) => {
  // If All is clicked again, clear the filter
  if (filter && filter_mode[0] === `all`) {
    if (App.filter_mode(mode) === `all`) {
      if (App.get_filter(mode, true)) {
        App.clear_filter(mode)
        return
      }
    }
  }

  App[`${mode}_filter_mode`] = filter_mode[0]
  DOM.el(`#${mode}_filter_modes_text`).textContent = filter_mode[1]

  if (filter) {
    App.do_filter(mode)
  }
}

App.filter_domain = (item) => {
  if (!item) {
    item = App.get_selected(mode)
  }

  if (!item) {
    return
  }

  let hostname = App.get_hostname(item.url)

  if (!hostname && item.url.includes(`:`)) {
    hostname = item.url.split(`:`)[0] + `:`
  }

  if (!hostname) {
    return
  }

  App.set_filter(item.mode, hostname)
}

App.refresh_filter = (mode, what) => {
  if (App.filter_mode(mode) === what) {
    App.filter(mode)
  }
}

App.create_filter_modes = (mode) => {
  let filter_modes = DOM.create(`div`, `button icon_button`, `${mode}_filter_modes`)
  filter_modes.title = `Filter Modes (Ctrl + F)`
  let filter_modes_text = DOM.create(`div`, ``, `${mode}_filter_modes_text`)
  filter_modes.append(filter_modes_text)

  let fmodes = []
  fmodes.push([`all`, `All`])
  fmodes.push([`--separator--`])
  fmodes.push([`images`, `Images`])
  fmodes.push([`videos`, `Videos`])
  fmodes.push([`custom`, `Custom`])
  App[`${mode}_filter_modes`] = [...fmodes, ...(App.filter_modes(mode) || [])]

  DOM.ev(filter_modes, `click`, () => {
    App.show_filter_modes(mode)
  })

  DOM.ev(filter_modes, `wheel`, (e) => {
    let direction = App.wheel_direction(e)

    if (direction === `down`) {
      App.cycle_filter_modes(mode, false)
    }
    else if (direction === `up`) {
      App.cycle_filter_modes(mode, true)
    }
  })

  return filter_modes
}

App.create_filter = (mode) => {
  let filter = DOM.create(`input`, `text filter`, `${mode}_filter`)
  filter.type = `text`
  filter.autocomplete = `off`
  filter.spellcheck = false
  filter.placeholder = `Type to filter`

  DOM.ev(filter, `input`, () => {
    App.filter(mode)
  })

  return filter
}

App.get_custom_filters = (mode) => {
  let items = []

  for (let filter of App.get_setting(`custom_filters`)) {
    items.push({
      text: filter,
      action: () => {
        App.set_filter(mode, filter)
      }
    })
  }

  return items
}