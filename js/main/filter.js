App.setup_filter = () => {
  App.stor_get_filter_history()
  App.start_filter_debouncers()
}

App.start_filter_debouncers = () => {
  App.filter_debouncer = App.create_debouncer((args) => {
    App.do_filter(args)
  }, App.get_setting(`filter_delay`))

  App.filter_debouncer_search = App.create_debouncer((args) => {
    App.do_filter(args)
  }, App.get_setting(`filter_delay_search`))
}

App.filter = (args) => {
  if (App.search_modes.includes(args.mode)) {
    App.filter_debouncer_search.call(args)
  }
  else {
    App.filter_debouncer.call(args)
  }
}

App.cancel_filter = () => {
  App.filter_debouncer.cancel()
  App.filter_debouncer_search.cancel()
}

App.do_filter = async (args) => {
  let def_args = {
    force: false,
    deep: false,
  }

  args = Object.assign(def_args, args)
  App.cancel_filter()
  App.debug(`Filter: ${args.mode}`)
  let value = App.get_clean_filter(args.mode, false)
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

  let search = false

  // This check is to avoid re-fetching items
  // For instance when moving from All to Image
  if (App.search_modes.includes(args.mode)) {
    let svalue = value

    if (args.force || (svalue !== App[`last_${args.mode}_query`])) {
      svalue = App.replace_filter_vars(svalue)
      let search_date = App.now()
      App.filter_search_date = search_date
      await App.search_items(args.mode, svalue, args.deep, search_date)

      if (App.filter_search_date !== search_date) {
        return
      }

      if (App.active_mode !== args.mode) {
        return
      }

      search = true
    }
  }

  let items = App.get_items(args.mode)

  if (!items) {
    return
  }

  let filter_mode = App.filter_mode(args.mode)
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

  if (value && by_what === `all`) {
    let aliases = App.get_setting(`aliases`)

    for (let alias of aliases) {
      let match

      if (insensitive) {
        if (alias.a.toLowerCase().startsWith(value_lower)) {
          match = alias.b
        }
        else if (alias.b.toLowerCase().startsWith(value_lower)) {
          match = alias.a
        }
      }
      else {
        if (alias.a.startsWith(value)) {
          match = alias.b
        }
        else if (alias.b.startsWith(value)) {
          match = alias.a
        }
      }

      if (match) {
        reg = App.make_filter_regex(match, by_what)

        if (reg) {
          regexes.push(reg)
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
      search: search,
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

  App.clear_selected(args.mode)
  App.select_first_item(args.mode, !App.is_filtered(args.mode))
  App.update_footer_info(App.get_selected(args.mode))
  App.update_footer_count(args.mode)
  App.do_check_pinline()
  App.do_check_scroller(args.mode)
}

App.replace_filter_vars = (value) => {
  let date = App.now()
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

  if (args.search) {
    match = true
  }

  if (!match) {
    let title = App.get_title(args.item)
    title = App.filter_string(title)

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
    else if (args.filter_mode === `pinned`) {
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
  App.get_filter_el(mode).focus()
}

App.is_filtered = (mode) => {
  return App.filter_has_value(mode) || App.filter_mode(mode) !== `all`
}

App.clear_filter = (mode = App.window_mode) => {
  if (App.filter_has_value(mode)) {
    App.set_filter({mode: mode})
  }
}

App.set_filter = (args) => {
  let def_args = {
    text: ``,
    filter: true,
    instant: true,
  }

  args = Object.assign(def_args, args)
  App.get_filter_el(args.mode).value = args.text

  if (args.filter) {
    if (App.on_items(args.mode)) {
      if (args.instant) {
        App.do_filter({mode: args.mode})
      }
      else {
        App.filter({mode: args.mode})
      }
    }
    else if (App.on_settings(args.mode)) {
      if (args.instant) {
        App.do_filter_settings()
      }
      else {
        App.filter_settings()
      }
    }
    else {
      if (args.instant) {
        App[`do_filter_${args.mode}`]()
      }
      else {
        App[`filter_${args.mode}`]()
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

  App.set_filter({mode: mode, text: new_text})
}

App.filter_has_value = (mode) => {
  return App.get_filter(mode) !== ``
}

App.get_filter_el = (mode) => {
  return DOM.el(`#${mode}_filter`)
}

App.get_filter = (mode) => {
  return App.get_filter_el(mode).value
}

App.filter_empty = (mode) => {
  return App.get_filter(mode) === ``
}

App.get_clean_filter = (mode, lowercase = true) => {
  let value = App.get_filter(mode)
  value = App.filter_string(value)

  if (lowercase) {
    value = value.toLowerCase()
  }

  return value
}

App.show_filter_menu = (mode) => {
  let items = []

  for (let filter_mode of App.filter_modes(mode)) {
    if (filter_mode.type === App.separator_string) {
      App.sep(items)
      continue
    }
    else if (filter_mode.type === `tag`) {
      items.push({
        text: filter_mode.text,
        get_items: () => {
          return App.get_tag_items(mode)
        },
        info: filter_mode.info,
      })

      continue
    }
    else if (filter_mode.type === `color`) {
      items.push({
        text: filter_mode.text,
        get_items: () => {
          return App.get_color_items(mode)
        },
        info: filter_mode.info,
      })

      continue
    }
    else if (filter_mode.type === `custom`) {
      items.push({
        text: `Custom`,
        get_items: () => {
          return App.get_custom_filters(mode)
        },
        info: filter_mode.info,
      })

      continue
    }
    else if (filter_mode.type === `refine`) {
      items.push({
        text: filter_mode.text,
        get_items: () => {
          return App.get_filter_refine(mode)
        },
        info: filter_mode.info,
      })

      continue
    }

    let selected = App.filter_mode(mode) === filter_mode.type

    items.push({
      text: filter_mode.text,
      action: () => {
        App.set_filter_mode({mode: mode, type: filter_mode.type})
      },
      selected: selected,
      info: filter_mode.info,
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
    if (filter_mode.skip) {
      continue
    }

    if (!first) {
      first = filter_mode
    }

    if (waypoint) {
      App.set_filter_mode({mode: mode, type: filter_mode.type, instant: false})
      return
    }

    if (filter_mode.type === App.filter_mode(mode)) {
      waypoint = true
    }
  }

  App.set_filter_mode({mode: mode, type: first.type, instant: false})
}

App.filter_modes = (mode) => {
  return App[`${mode}_filter_modes`]
}

App.filter_mode = (mode) => {
  return App[`${mode}_filter_mode`]
}

App.get_filter_mode = (mode, type) => {
  for (let filter_mode of App.filter_modes(mode)) {
    if (filter_mode.type === type) {
      return filter_mode
    }
  }
}

App.set_filter_mode = (args) => {
  let def_args = {
    filter: true,
    instant: true,
  }

  args = Object.assign(def_args, args)
  let filter_mode = App.get_filter_mode(args.mode, args.type)
  App[`${args.mode}_filter_mode`] = filter_mode.type
  DOM.el(`#${args.mode}_filter_modes_text`).textContent = filter_mode.text

  if (args.filter) {
    if (args.instant) {
      App.do_filter({mode: args.mode})
    }
    else {
      App.filter({mode: args.mode})
    }
  }
}

App.set_custom_filter_mode = (mode, name, title) => {
  App[`${mode}_filter_mode`] = name
  DOM.el(`#${mode}_filter_modes_text`).textContent = title
}

App.create_filter_menu = (mode) => {
  function separator () {
    return {type: App.separator_string, skip: true}
  }

  let filter_menu = DOM.create(`div`, `button icon_button filter_button`, `${mode}_filter_modes`)
  filter_menu.title = `Filters (Ctrl + F)`
  filter_menu.append(DOM.create(`div`, ``, `${mode}_filter_modes_text`))
  let fmodes = []
  fmodes.push({type: `all`, text: `All`})
  let m_modes = App.filter_modes(mode)

  if (m_modes) {
    fmodes.push(separator())
    fmodes.push(...m_modes)
  }

  fmodes.push(separator())
  fmodes.push({type: `image`, text: `Image`, skip: false, info: `Show image items`})
  fmodes.push({type: `video`, text: `Video`, skip: false, info: `Show video items`})
  fmodes.push({type: `audio`, text: `Audio`, skip: false, info: `Show audio items`})
  fmodes.push(separator())
  fmodes.push({type: `tag`, text: `Tag`, skip: true, skip: `Filter by a specific tag`})
  fmodes.push({type: `color`, text: `Color`, skip: true, skip: `Filter by a specific color`})
  fmodes.push({type: `edited`, text: `Edited`, skip: false, info: `Items that have a profile`})

  if (mode !== `tabs`) {
    fmodes.push({type: `notab`, text: `No Tab`, skip: false, info: `Items that are not open in a tab`})
  }

  fmodes.push(separator())
  fmodes.push({type: `refine`, text: `Refine`, skip: true, skip: `Refine the filter`})
  fmodes.push({type: `custom`, text: `Custom`, skip: true, skip: `Pick a custom filter`})
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

  if (App.search_modes.includes(mode)) {
    filter.placeholder = `Search`
  }
  else {
    filter.placeholder = `Filter`
  }

  DOM.ev(filter, `contextmenu`, (e) => {
    if (App.get_setting(`show_filter_history`)) {
      App.show_filter_history(mode, e)
      e.preventDefault()
    }
  })

  DOM.ev(filter, `input`, () => {
    App.filter({mode: mode})
  })

  return filter
}

App.get_custom_filters = (mode) => {
  let items = []

  for (let obj of App.get_setting(`custom_filters`)) {
    items.push({
      text: obj.filter,
      action: () => {
        App.set_custom_filter(mode, obj.filter)
      }
    })
  }

  return items
}

App.set_custom_filter = (mode, filter) => {
  App.set_filter_mode({mode: mode, type: `all`, filter: false})
  App.set_filter({mode: mode, text: filter})
}

App.do_filter_2 = (mode) => {
  let value = App.get_clean_filter(mode)
  value = App.filter_string(value)
  let type = App.popup_open() ? `popup` : `window`
  let win = DOM.el(`#${type}_${mode}`)
  let container = DOM.el_or_self(`.filter_container`, win)
  let items = DOM.els(`.filter_item`, container)

  for (let item of items) {
    let text = DOM.el_or_self(`.filter_text`, item).textContent
    text = App.filter_string(text).toLowerCase()

    if (text.includes(value)) {
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

App.search_items = async (mode, query, deep, date) => {
  let q = query || `Empty`
  App.debug(`Searching ${mode}: ${q}`)
  let items = await App[`get_${mode}`](query, deep)

  if (App.filter_search_date !== date) {
    return
  }

  if (App.window_mode !== mode) {
    return
  }

  App.process_info_list(mode, items)
}

App.deep_search = (mode) => {
  App.do_filter({mode: mode, force: true, deep: true})
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

  App.set_filter({mode: item.mode, text: hostname})
}

App.filter_tag = (mode, tag) => {
  App.set_custom_filter_mode(mode, `tag_${tag}`, tag)
  App.set_filter({mode: mode})
}

App.filter_color = (mode, color) => {
  App.set_custom_filter_mode(mode, `color_${color}`, App.capitalize(color))
  App.set_filter({mode: mode})
}

App.show_all = (mode = App.window_mode) => {
  if (App.is_filtered(mode)) {
    App.set_filter_mode({mode: mode, type: `all`, filter: false})
    App.set_filter({mode: mode})
  }
}

App.show_filter_history = (mode, e) => {
  let items = []

  for (let value of App.filter_history) {
    items.push({
      text: value,
      action: () => {
        App.set_filter({mode: mode, text: value})
      },
      alt_action: () => {
        App.forget_filter_history_item(value)
      }
    })
  }

  if (items.length) {
    App.sep(items)

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
        App.alert(`Filters you use appear here`)
      }
    })
  }

  App.show_center_context(items, e)
}

App.update_filter_history = (mode) => {
  App.debug(`Update Filter History`)
  let value = App.get_filter(mode).trim()

  if (!value) {
    return
  }

  App.filter_history = App.filter_history.filter(x => x !== value)
  App.filter_history.unshift(value)
  let max = App.get_setting(`max_filter_history`)
  App.filter_history = App.filter_history.slice(0, max)
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

App.filter_is_focused = (mode) => {
  return App.get_filter_el(mode) === document.activeElement
}

App.blur_filter = (mode) => {
  App.get_filter_el(mode).blur()
}

App.filter_at_end = (mode) => {
  let filter = App.get_filter_el(mode)
  return filter.selectionStart === filter.selectionEnd &&
  filter.selectionEnd === filter.value.length
}

App.filter_string = (s) => {
  if (App.get_setting(`exact_filter`)) {
    return s
  }

  s = App.no_space(s)
  s = App.remove_quotes(s)
  s = App.remove_hyphens(s)
  s = s.trim()
  return s
}