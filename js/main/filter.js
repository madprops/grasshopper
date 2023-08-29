App.setup_filter = () => {
  App.stor_get_filter_history()
}

App.filter_debouncer = App.create_debouncer((mode, force, deep) => {
  App.do_filter(mode, force, deep)
}, App.filter_delay)

App.filter = (mode, force, deep) => {
  App.filter_debouncer.call(mode, force, deep)
}

App.cancel_filter = () => {
  App.filter_debouncer.cancel()
}

App.do_filter = async (mode, force = false, deep = false) => {
  App.cancel_filter()
  App.debug(`Filter: ${mode}`)
  let value = App.get_clean_filter(mode, false)
  value = App.remove_protocol(value)

  if (value.endsWith(`|`)) {
    return
  }

  let by_what
  let cmd

  for (let c of [`title`, `url`, `re`, `re_title`, `re_url`]) {
    if (value.startsWith(`${c}:`)) {
      cmd = [c, value.replace(`${c}:`, ``).trim()]
    }
  }

  if (cmd) {
    value = cmd[1]
    by_what = cmd[0]
  }
  else {
    value = value
    by_what = `all`
  }

  // This check is to avoid re-fetching items
  // For instance when moving from All to Image
  if (App.maxed_items.includes(mode)) {
    let svalue = value

    if (force || (svalue !== App[`last_${mode}_query`])) {
      svalue = App.replace_filter_vars(svalue)
      await App.search_items(mode, svalue, deep)

      if (App.active_mode !== mode) {
        return
      }
    }
  }

  let items = App.get_items(mode)

  if (!items) {
    return
  }

  let filter_mode = App.filter_mode(mode)
  let filter_mode_split = filter_mode.split(`_`)
  let f_value

  if (filter_mode_split.length === 2) {
    filter_mode = filter_mode_split[0]
    f_value = filter_mode_split[1]
  }

  let skip = !value && filter_mode === `all`
  let duplicates

  if (filter_mode === `duplicate`) {
    duplicates = App.find_duplicates(items, `url`)
  }

  let regexes = []
  let reg = App.make_filter_regex(value, by_what)

  if (reg) {
    regexes.push(reg)
  }
  else {
    return
  }

  let value_lower = value.toLowerCase()
  let insensitive = App.get_setting(`case_insensitive`)

  function alias_regex (a, b) {
    if (insensitive) {
      let rep = value_lower.replace(b.toLowerCase(), a.toLowerCase())

      if (value_lower !== rep) {
        let reg = App.make_filter_regex(rep, by_what)

        if (reg) {
          regexes.push(reg)
        }
      }
    }
    else {
      let rep = value.replace(a, b)

      if (value !== rep) {
        regexes.push(App.make_filter_regex(rep, by_what))
      }
    }
  }

  if (value) {
    for (let alias of App.get_setting(`aliases`)) {
      if (alias.includes(`=`)) {
        try {
          let split = alias.split(`=`)
          let a = split[0].trim()
          let b = split[1].trim()
          alias_regex(a, b)
          alias_regex(b, a)
        }
        catch (err) {
          continue
        }
      }
    }
  }

  function matched (item) {
    let args = {
      item: item,
      regexes: regexes,
      by_what: by_what,
      filter_mode: filter_mode,
      duplicates: duplicates,
      value: value,
      f_value: f_value,
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

  App.clear_selected(mode)
  App.select_first_item(mode, !App.is_filtered(mode))
  App.update_footer_info(App.get_selected(mode))
  App.update_footer_count(mode)
  App.do_check_borders(mode)
  App.do_check_pinline()
  App.do_check_scroller(mode)
}

App.replace_filter_vars = (value) => {
  let date = Date.now()
  let day = dateFormat(date, `dddd`).toLowerCase()
  let month = dateFormat(date, `mmmm`).toLowerCase()
  let year = dateFormat(date, `yyyy`)
  value = value.replace(/\$day/g, day)
  value = value.replace(/\$month/g, month)
  value = value.replace(/\$year/g, year)
  return value
}

App.make_filter_regex = (value, by_what) => {
  value = App.replace_filter_vars(value)
  let regex

  if (by_what.startsWith(`re`)) {
    let cleaned = value.replace(/\\+$/, ``)

    try {
      if (App.get_setting(`case_insensitive`)) {
        regex = new RegExp(cleaned, `i`)
      }
      else {
        regex = new RegExp(cleaned)
      }
    }
    catch (err) {}
  }
  else {
    let cleaned = App.escape_regex(value)

    if (App.get_setting(`case_insensitive`)) {
      regex = new RegExp(cleaned, `i`)
    }
    else {
      regex = new RegExp(cleaned)
    }
  }

  return regex
}

App.filter_check = (args) => {
  let match = false
  let title = App.get_title(args.item)

  for (let regex of args.regexes) {
    if (args.by_what === `all` || args.by_what === `re`) {
      match = regex.test(title) || regex.test(args.item.path)
    }
    else if (args.by_what === `title` || args.by_what === `re_title`) {
      match = regex.test(title)
    }
    else if (args.by_what === `url` || args.by_what === `re_url`) {
      match = regex.test(args.item.path)
    }

    if (match) {
      break
    }
  }

  if (match) {
    if (args.filter_mode === `all`) {
      match = true
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
    else if (args.filter_mode === `tag`) {
      match = args.item.tags.includes(args.f_value)
    }
    else if (args.filter_mode === `color`) {
      match = args.item.color === args.f_value
    }
    else if (args.filter_mode === `edited`) {
      match = args.item.has_profile
    }
    else if (args.filter_mode === `pins`) {
      match = args.item.pinned
    }
    else if (args.filter_mode === `normal`) {
      match = !args.item.pinned
    }
    else if (args.filter_mode === `playing`) {
      match = args.item.audible || args.item.muted
    }
    else if (args.filter_mode === `unloaded`) {
      match = args.item.discarded
    }
    else if (args.filter_mode === `duplicate`) {
      match = args.duplicates.includes(args.item)
    }
    else if (args.filter_mode === `notab`) {
      let no_tab = true

      for (let tab of App.get_items(`tabs`)) {
        if (tab.path === args.item.path) {
          no_tab = false
          break
        }
      }

      match = no_tab
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

App.clear_filter = (mode = App.window_mode) => {
  if (App.filter_has_value(mode)) {
    App.set_filter(mode, ``)
  }
}

App.set_filter = (mode, text, filter = true, instant = true) => {
  DOM.el(`#${mode}_filter`).value = text
  App.focus_filter(mode)

  if (filter) {
    if (App.on_items(mode)) {
      if (instant) {
        App.do_filter(mode)
      }
      else {
        App.filter(mode)
      }
    }
    else if (App.on_settings(mode)) {
      if (instant) {
        App.do_filter_settings()
      }
      else {
        App.filter_settings()
      }
    }
    else {
      if (instant) {
        App[`do_filter_${mode}`]()
      }
      else {
        App[`filter_${mode}`]()
      }
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

App.filter_empty = (mode) => {
  return App.get_filter(mode) === ``
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
    else if (filter_mode[0] === `tag`) {
      items.push({
        text: filter_mode[1],
        get_items: () => {
          return App.get_tag_items(mode)
        },
      })

      continue
    }
    else if (filter_mode[0] === `color`) {
      items.push({
        text: filter_mode[1],
        get_items: () => {
          return App.get_color_items(mode)
        },
      })

      continue
    }
    else if (filter_mode[0] === `custom`) {
      items.push({
        text: `Custom`,
        get_items: () => {
          return App.get_custom_filters(mode)
        },
      })

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
    if (filter_mode[2]) {
      continue
    }

    if (!first) {
      first = filter_mode
    }

    if (waypoint) {
      App.set_filter_mode(mode, filter_mode[0], true, false)
      return
    }

    if (filter_mode[0] === App.filter_mode(mode)) {
      waypoint = true
    }
  }

  App.set_filter_mode(mode, first[0], true, false)
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

App.set_filter_mode = (mode, name, filter = true, instant = true) => {
  let filter_mode = App.get_filter_mode(mode, name)
  App[`${mode}_filter_mode`] = filter_mode[0]
  DOM.el(`#${mode}_filter_modes_text`).textContent = filter_mode[1]

  if (filter) {
    if (instant) {
      App.do_filter(mode)
    }
    else {
      App.filter(mode)
    }
  }
}

App.set_custom_filter_mode = (mode, name, title) => {
  App[`${mode}_filter_mode`] = name
  DOM.el(`#${mode}_filter_modes_text`).textContent = title
}

App.create_filter_menu = (mode) => {
  function separator () {
    return [App.separator_string, undefined, true]
  }

  let filter_menu = DOM.create(`div`, `button icon_button filter_button`, `${mode}_filter_modes`)
  filter_menu.title = `Filters (Ctrl + F)`
  filter_menu.append(DOM.create(`div`, ``, `${mode}_filter_modes_text`))
  let fmodes = []
  fmodes.push([`all`, `All`])
  let m_modes = App.filter_modes(mode)

  if (m_modes) {
    fmodes.push(separator())
    fmodes.push(...m_modes)
  }

  fmodes.push(separator())
  fmodes.push([`image`, `Image`])
  fmodes.push([`video`, `Video`])
  fmodes.push([`audio`, `Audio`])
  fmodes.push(separator())
  fmodes.push([`tag`, `Tag`, true])
  fmodes.push([`color`, `Color`, true])
  fmodes.push([`edited`, `Edited`])

  if (mode !== `tabs`) {
    fmodes.push([`notab`, `No Tab`])
  }

  fmodes.push(separator())
  fmodes.push([`refine`, `Refine`, true])
  fmodes.push([`custom`, `Custom`, true])
  App[`${mode}_filter_modes`] = fmodes

  DOM.evs(filter_menu, [`click`, `contextmenu`], (e) => {
    App.show_filter_menu(mode)
    e.preventDefault()
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
    App.last_filter_input = Date.now()
    App.filter(mode)
  })

  DOM.ev(filter, `contextmenu`, (e) => {
    if (App.get_setting(`show_filter_history`)) {
      App.show_filter_history(e, mode)
      e.preventDefault()
    }
  })

  return filter
}

App.get_custom_filters = (mode) => {
  let items = []

  for (let filter of App.get_setting(`custom_filters`)) {
    items.push({
      text: filter,
      action: () => {
        App.set_custom_filter(mode, filter)
      }
    })
  }

  return items
}

App.set_custom_filter = (mode, filter) => {
  App.set_filter_mode(mode, `all`, false)
  App.set_filter(mode, filter)
}

App.do_filter_2 = (mode) => {
  let value = App.get_clean_filter(mode)
  value = App.only_chars(value)
  let win = DOM.el(`#${mode}_container`)
  let container = DOM.el_or_self(`.filter_container`, win)
  let items = DOM.els(`.filter_item`, container)

  for (let item of items) {
    let text = DOM.el_or_self(`.filter_text`, item).textContent
    text = App.only_chars(text).toLowerCase()
    let show = false

    if (text.includes(value)) {
      show = true
    }

    if (!show) {
      if (item.dataset.alias) {
        let aliases = item.dataset.alias.split(`;`)

        for (let alias of aliases) {
          let text = App.only_chars(alias).toLowerCase()

          if (text.includes(value)) {
            show = true
            break
          }
          else if (App.similarity(value, alias) >= App.similarity_threshold) {
            show = true
            break
          }
        }
      }
    }

    if (!show) {
      if (App.similarity(value, text) >= App.similarity_threshold) {
        show = true
      }
    }

    if (show) {
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
    text: `By All`,
    action: () => {
      App.filter_cmd(mode, `all`)
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

  items.push({
    text: `Regex All`,
    action: () => {
      App.filter_cmd(mode, `re`)
    },
  })

  return items
}

App.search_items = async (mode, query, deep) => {
  let q = query || `Empty`
  App.debug(`Searching ${mode}: ${q}`)
  let items = await App[`get_${mode}`](query, deep)

  if (App.window_mode !== mode) {
    return
  }

  App.process_info_list(mode, items)
}

App.deep_search = (mode) => {
  App.do_filter(mode, true, true)
}

App.was_filtered = (mode) => {
  if (App.get_filter(mode)) {
    return true
  }

  let fmode = App.filter_mode(mode)

  if (fmode && fmode !== `all`) {
    return true
  }

  return false
}

App.get_last_filter_value = (cycle) => {
  let last_mode = App.active_mode

  if (!App.on_items(last_mode)) {
    last_mode = `tabs`
  }

  let value = ``

  if (cycle) {
    value = App.get_filter(last_mode)
  }

  return value
}

App.filter_domain = (item) => {
  if (!item) {
    item = App.get_selected(mode)
  }

  if (!item) {
    return
  }

  let hostname = item.hostname

  if (!hostname && item.url.includes(`:`)) {
    hostname = item.url.split(`:`)[0] + `:`
  }

  if (!hostname) {
    return
  }

  App.set_filter(item.mode, hostname)
}

App.filter_tag = (mode, tag) => {
  App.set_custom_filter_mode(mode, `tag_${tag}`, tag)
  App.set_filter(mode, ``)
}

App.filter_color = (mode, color) => {
  App.set_custom_filter_mode(mode, `color_${color}`, App.capitalize(color))
  App.set_filter(mode, ``)
}

App.show_all = (mode = App.window_mode) => {
  if (App.is_filtered(mode)) {
    App.set_filter_mode(mode, `all`, false)
    App.set_filter(mode, ``)
  }
}

App.show_filter_history = (e, mode) => {
  let items = []

  for (let value of App.filter_history) {
    items.push({
      text: value,
      action: () => {
        App.set_filter(mode, value)
      },
      alt_action: () => {
        App.forget_filter_history_item(value)
      }
    })
  }

  if (items.length > 0) {
    items.push({separator: true})

    items.push({
      text: `Forget`,
      action: () => {
        App.forget_filter_history()
      }
    })
  }
  else {
    items.push({
      text: `Empty`,
      action: () => {
        App.show_alert(`Filters you use appear here`)
      }
    })
  }

  if (e) {
    NeedContext.show(e.clientX, e.clientY, items)
  }
  else {
    NeedContext.show_on_center(items)
  }
}

App.update_filter_history = (mode) => {
  App.debug(`Update Filter History`)
  let value = App.get_filter(mode).trim()

  if (!value) {
    return
  }

  App.filter_history = App.filter_history.filter(x => x !== value)
  App.filter_history.unshift(value)
  App.filter_history = App.filter_history.slice(0, App.max_filter_history)
  App.stor_save_filter_history()
}

App.forget_filter_history = () => {
  App.show_confirm(`Forget filter history?`, () => {
    App.filter_history = []
    App.stor_save_filter_history()
  })
}

App.forget_filter_history_item = (value) => {
  App.filter_history = App.filter_history.filter(x => x !== value)
  App.stor_save_filter_history()
}