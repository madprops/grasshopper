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

App.do_filter = async (mode, force = false) => {
  App.cancel_filter()
  App.log(`Filter: ${mode}`)

  let regex_val, by_what, use_regex
  let value = App.get_filter(mode)
  let regex_modes = [`re:`, `re_title:`, `re_url:`]

  if (regex_modes.some(x => value.startsWith(x))) {
    if (value.startsWith(`re:`)) {
      regex_val = value.replace(`re:`, ``)
      by_what = `all`
    }
    else if (value.startsWith(`re_title:`)) {
      regex_val = value.replace(`re_title:`, ``)
      by_what = `title`
    }
    else if (value.startsWith(`re_url:`)) {
      regex_val = value.replace(`re_url:`, ``)
      by_what = `url`
    }

    use_regex = true
  }
  else {
    if (value.startsWith(`title:`)) {
      regex_val = value.replace(`title:`, ``)
      by_what = `title`
    }
    else if (value.startsWith(`url:`)) {
      regex_val = value.replace(`url:`, ``)
      by_what = `url`
    }
    else {
      regex_val = value
      by_what = `all`
    }

    use_regex = false
  }

  let clean_val = regex_val.trim()

  if (use_regex) {
    regex_val = clean_val
  }
  else {
    regex_val = App.escape_regex(clean_val)
  }

  let regex

  try {
    regex = new RegExp(regex_val, `i`)
  }
  catch (err) {
    return
  }

  if (App.maxed_items.includes(mode)) {
    let query

    if (use_regex) {
      query = ``
    }
    else {
      query = clean_val
    }

    if (force || (query !== App[`last_${mode}_query`])) {
      await App.search_items(mode, query)

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

  if (filter_mode === `duplicates`) {
    duplicates = App.find_duplicates(items, `url`)
  }

  function check (title, url) {
    if (by_what === `all`) {
      return regex.test(title) || regex.test(url)
    }
    else if (by_what === `title`) {
      return regex.test(title)
    }
    else if (by_what === `url`) {
      return regex.test(url)
    }
  }

  function matched (item) {
    let match = false
    let title = item.title
    let path = item.path

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
      else if (filter_mode === `unloaded`) {
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
  return App.get_filter(mode) || App.filter_mode(mode) !== `all`
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
  if (App.get_filter(mode, false)) {
    App.set_filter(mode, ``)
  }
}

App.set_filter = (mode, text, filter = true) => {
  DOM.el(`#${mode}_filter`).value = text
  App.focus_filter(mode)

  if (filter) {
    App.do_filter(mode)
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

App.get_filter = (mode, trim = true) => {
  let value = DOM.el(`#${mode}_filter`).value

  if (trim) {
    value = value.trim()
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
    else if (filter_mode[0] === `by_what`) {
      items.push({
        text: `By What`,
        get_items: () => {
          return App.get_filter_what(mode)
        },
      })

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
    else if (filter_mode[0] === `by_what`) {
      continue
    }

    if (!first) {
      first = filter_mode
    }

    if (waypoint) {
      App.set_filter_mode(mode, filter_mode)
      return
    }

    if (filter_mode[0] === App.filter_mode(mode)) {
      waypoint = true
    }
  }

  App.set_filter_mode(mode, first)
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
      if (App.get_filter(mode)) {
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
  fmodes.push([`images`, `Images`])
  fmodes.push([`videos`, `Videos`])
  fmodes.push([App.separator_string])
  fmodes.push([`custom`, `Custom`])
  fmodes.push([`by_what`, `By What`])
  App[`${mode}_filter_modes`] = [...fmodes, ...(App.filter_modes(mode) || [])]

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

App.get_filter_what = (mode) => {
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
    text: `Title & URL`,
    action: () => {
      App.filter_cmd(mode, `all`)
    },
  })

  items.push({
    text: `With Regex`,
    action: () => {
      App.filter_cmd(mode, `re`)
    },
  })

  items.push({
    text: `Regex Title`,
    action: () => {
      App.filter_cmd(mode, `re_title`)
    },
  })

  items.push({
    text: `Regex URL`,
    action: () => {
      App.filter_cmd(mode, `re_url`)
    },
  })

  return items
}

App.first_filter_mode = (mode) => {
  App.set_filter_mode(mode, App.filter_modes(mode)[0])
}