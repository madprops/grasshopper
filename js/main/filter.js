App.setup_filter = () => {
  App.filter_debouncer = App.create_debouncer((mode) => {
    App.do_filter(mode)
  }, App.filter_delay)
}

App.filter = (mode) => {
  App.filter_debouncer.call(mode)
}

App.cancel_filter = () => {
  App.filter_debouncer.cancel()
}

App.do_filter = async (mode, force = false) => {
  App.cancel_filter()
  App.log(`Filter: ${mode}`)
  let value = App.get_clean_filter(mode, false)

  if (value.endsWith(`|`)) {
    return
  }

  let by_what

  if (value.startsWith(`title:`)) {
    value = value.replace(`title:`, ``).trim()
    by_what = `title`
  }
  else if (value.startsWith(`url:`)) {
    value = value.replace(`url:`, ``).trim()
    by_what = `url`
  }
  else {
    value = value
    by_what = `all`
  }

  let regex

  try {
    if (App.get_setting(`case_insensitive_filter`)) {
      regex = new RegExp(value, `i`)
    }
    else {
      regex = new RegExp(value)
    }
  }
  catch (err) {
    return
  }

  // This check is to avoid re-fetching items
  // For instance when moving from All to Image
  if (App.maxed_items.includes(mode)) {
    if (force || (value !== App[`last_${mode}_query`])) {
      await App.search_items(mode, value)

      if (App.window_mode !== mode) {
        return
      }
    }
  }

  let items = App.get_items(mode)

  if (!items) {
    return
  }

  let filter_mode = App.filter_mode(mode)
  let skip = !value && filter_mode === `all`
  let duplicates

  if (filter_mode === `duplicate`) {
    duplicates = App.find_duplicates(items, `url`)
  }

  function matched (item) {
    let args = {
      item: item,
      regex: regex,
      by_what: by_what,
      filter_mode: filter_mode,
      duplicates: duplicates,
    }

    return App.filter_check(args)
  }

  for (let item of items) {
    if (!item.element) {
      continue
    }

    if (skip || matched(item)) {
      App.show_item(item)
    }
    else {
      App.hide_item(item)
    }
  }

  App.set_selected(mode, undefined)
  App.select_first_item(mode, !App.is_filtered(mode))
  App.update_footer_info(App.get_selected(mode))
  App.update_footer_count(mode)
  App.do_check_pinline()
  App.do_check_scroller(mode)
}

App.filter_check = (args) => {
  let match = false

  if (args.by_what === `all`) {
    match = args.regex.test(args.item.title) || args.regex.test(args.item.path)
  }
  else if (args.by_what === `title`) {
    match = args.regex.test(args.item.title)
  }
  else if (args.by_what === `url`) {
    match = args.regex.test(args.item.path)
  }

  if (match) {
    if (args.filter_mode === `all`) {
      match = true
    }
    else if (args.filter_mode === `normal`) {
      match = App.tab_is_normal(args.item)
    }
    else if (args.filter_mode === `playing`) {
      match = args.item.audible || args.item.muted
    }
    else if (args.filter_mode === `pinned`) {
      match = args.item.pinned
    }
    else if (args.filter_mode === `unloaded`) {
      match = args.item.discarded
    }
    else if (args.filter_mode === `title`) {
      match = App.get_title(args.item.url)
    }
    else if (args.filter_mode === `image`) {
      match = args.item.image
    }
    else if (args.filter_mode === `video`) {
      match = args.item.video
    }
    else if (args.filter_mode === `audio`) {
      match = args.item.audio
    }
    else if (args.filter_mode === `text`) {
      match = args.item.text
    }
    else if (args.filter_mode === `duplicate`) {
      match = args.duplicates.includes(args.item)
    }
  }

  return match
}

App.focus_filter = (mode) => {
  DOM.el(`#${mode}_filter`).focus()
}

App.is_filtered = (mode) => {
  return App.filter_has_value(mode) || App.filter_mode(mode) !== `all`
}

App.check_clear_filter = () => {
  if (App.on_item_window()) {
    if (App.get_setting(`clear_filter`)) {
      if (App.is_filtered(App.window_mode)) {
        App.show_mode(App.window_mode)
      }
    }
  }
}

App.clear_filter = (mode = App.window_mode) => {
  if (App.filter_has_value(mode)) {
    App.set_filter(mode, ``)
  }
}

App.set_filter = (mode, text, filter = true) => {
  DOM.el(`#${mode}_filter`).value = text
  App.focus_filter(mode)

  if (filter) {
    if (App.on_item_window(mode)) {
      App.do_filter(mode)
    }
    else if (App.on_settings_window(mode)) {
      App.do_filter_settings()
    }
    else {
      App[`do_filter_${mode}`]()
    }
  }
}

App.filter_cmd = (mode, cmd) => {
  let new_text

  if (cmd === `all`) {
    new_text = ``
  }
  else {
    new_text = `${cmd}: `
  }

  let current = App.get_filter(mode)

  if (current) {
    let regex = new RegExp(/^(\w+\:)/)
    let cleaned = current.replace(regex, ``).trim()
    new_text += cleaned
  }

  App.set_filter(mode, new_text)
}

App.filter_has_value = (mode) => {
  return App.get_filter(mode) !== ``
}

App.get_filter = (mode) => {
  return DOM.el(`#${mode}_filter`).value
}

App.get_clean_filter = (mode, lowercase = true) => {
  let value = App.single_space(App.get_filter(mode)).trim()

  if (lowercase) {
    value = value.toLowerCase()
  }

  return value
}

App.show_filter_menu = (mode) => {
  let items = []

  for (let filter_mode of App.filter_modes(mode)) {
    if (filter_mode[0] === App.separator_string) {
      items.push({separator: true})
      continue
    }

    if (filter_mode[0] === `custom`) {
      let filters = App.get_setting(`custom_filters`)

      if (filters.length > 0) {
        if (filters.length === 1) {
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
      }

      continue
    }
    else if (filter_mode[0] === `refine`) {
      items.push({
        text: filter_mode[1],
        get_items: () => {
          return App.get_filter_refine(mode)
        },
      })

      continue
    }

    let selected = App.filter_mode(mode) === filter_mode[0]

    items.push({
      text: filter_mode[1],
      action: () => {
        App.set_filter_mode(mode, filter_mode[0])
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
    modes = modes.slice(0).reverse()
  }

  let first

  for (let filter_mode of modes.slice(0).reverse()) {
    if (filter_mode[0].startsWith(`--`)) {
      continue
    }
    else if (filter_mode[0] === `custom`) {
      continue
    }
    else if (filter_mode[0] === `refine`) {
      continue
    }

    if (!first) {
      first = filter_mode
    }

    if (waypoint) {
      App.set_filter_mode(mode, filter_mode[0])
      return
    }

    if (filter_mode[0] === App.filter_mode(mode)) {
      waypoint = true
    }
  }

  App.set_filter_mode(mode, first[0])
}

App.filter_modes = (mode) => {
  return App[`${mode}_filter_modes`]
}

App.filter_mode = (mode) => {
  return App[`${mode}_filter_mode`]
}

App.get_filter_mode = (mode, name) => {
  for (let fm of App.filter_modes(mode)) {
    if (fm[0] === name) {
      return fm
    }
  }
}

App.set_filter_mode = (mode, name, filter = true) => {
  let filter_mode = App.get_filter_mode(mode, name)

  // If All is clicked again, clear the filter
  if (filter && filter_mode[0] === `all`) {
    if (App.filter_mode(mode) === `all`) {
      if (App.filter_has_value(mode)) {
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

App.create_filter_menu = (mode) => {
  let filter_menu = DOM.create(`div`, `button icon_button`, `${mode}_filter_modes`)
  filter_menu.title = `Filters (Ctrl + F)`
  filter_menu.append(DOM.create(`div`, ``, `${mode}_filter_modes_text`))

  let fmodes = []
  fmodes.push([`all`, `All`])
  fmodes.push([App.separator_string])
  fmodes.push([`image`, `Image`])
  fmodes.push([`video`, `Video`])
  fmodes.push([`audio`, `Audio`])
  fmodes.push([`text`, `Text`])
  fmodes.push(...(App.filter_modes(mode) || []))
  fmodes.push([App.separator_string])
  fmodes.push([`custom`, `Custom`])
  fmodes.push([`refine`, `Refine`])
  App[`${mode}_filter_modes`] = fmodes

  DOM.ev(filter_menu, `click`, () => {
    App.show_filter_menu(mode)
  })

  DOM.ev(filter_menu, `auxclick`, (e) => {
    if (e.button === 1) {
      let cmd = App.get_setting(`middle_click_filter_menu`)

      if (cmd !== `none`) {
        App.run_command({cmd: cmd, from: `filter_menu`})
      }
    }
  })

  DOM.ev(filter_menu, `wheel`, (e) => {
    let direction = App.wheel_direction(e)

    if (direction === `down`) {
      App.cycle_filter_modes(mode, true)
    }
    else if (direction === `up`) {
      App.cycle_filter_modes(mode, false)
    }
  })

  return filter_menu
}

App.create_filter = (mode) => {
  let filter = DOM.create(`input`, `text filter`, `${mode}_filter`)
  filter.type = `text`
  filter.autocomplete = `off`
  filter.spellcheck = false
  filter.placeholder = `Filter`

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

App.do_filter_2 = (mode) => {
  let value = App.get_clean_filter(mode)
  let win = DOM.el(`#${mode}_container`)
  let container = DOM.el_or_self(`.filter_container`, win)
  let items = DOM.els(`.filter_item`, container)

  for (let item of items) {
    let text = DOM.el_or_self(`.filter_text`, item).textContent
    text = text.toLowerCase().trim()

    if (text.includes(value)) {
      item.classList.remove(`hidden`)
    }
    else if (item.dataset.alias && item.dataset.alias.includes(value)) {
      item.classList.remove(`hidden`)
    }
    else {
      item.classList.add(`hidden`)
    }
  }
}

App.get_filter_refine = (mode) => {
  let items = []

  items.push({
    text: `By Title`,
    action: () => {
      App.filter_cmd(mode, `title`)
    },
  })

  items.push({
    text: `By URL`,
    action: () => {
      App.filter_cmd(mode, `url`)
    },
  })

  items.push({
    text: `By Both`,
    action: () => {
      App.filter_cmd(mode, `all`)
    },
  })

  return items
}