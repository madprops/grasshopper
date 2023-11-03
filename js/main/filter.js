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

  App.check_filter_debouncer = App.create_debouncer((args) => {
    if (App.is_filtered(args.mode)) {
      args.select = false
      App.do_filter(args)
    }
  }, App.check_filter_delay)

  App.filter_debouncer_cycle = App.create_debouncer((args) => {
    App.do_filter(args)
  }, App.filter_cycle_delay)
}

App.check_filter = (mode) => {
  if (App.is_filtered(mode)) {
    App.check_filter_debouncer.call({mode: mode})
  }
}

App.filter = (args) => {
  if (args.from === `cycle`) {
    App.filter_debouncer_cycle.call(args)
  }
  else if (App.search_modes.includes(args.mode)) {
    App.filter_debouncer_search.call(args)
  }
  else {
    App.filter_debouncer.call(args)
  }
}

App.cancel_filter = () => {
  App.filter_debouncer.cancel()
  App.filter_debouncer_search.cancel()
  App.check_filter_debouncer.cancel()
  App.filter_debouncer_cycle.cancel()
}

App.do_filter = async (args = {}) => {
  App.cancel_filter()

  let def_args = {
    force: false,
    deep: false,
    select: true,
  }

  App.def_args(def_args, args)
  App.debug(`Filter: ${args.mode}`)
  let value = App.get_filter(args.mode)
  App[`last_${args.mode}_filter`] = value
  value = App.remove_protocol(value)

  if (value.endsWith(`|`)) {
    return
  }

  let by_what
  let cmd

  for (let c of [`title`, `url`, `re`, `re_title`, `re_url`, `color`, `tag`]) {
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

  let insensitive = App.get_setting(`case_insensitive`)

  if (value && by_what === `all`) {
    value = App.clean_filter(value)
    let value_lower = value.toLowerCase()
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

  let some_matched = false

  for (let item of items) {
    if (!item.element) {
      continue
    }

    if (skip || matched(item)) {
      App.show_item(item)
      some_matched = true
    }
    else {
      App.hide_item(item)
    }
  }

  if (args.select) {
    App.clear_selected(args.mode)

    if (some_matched) {
      App.select_first_item(args.mode, !App.is_filtered(args.mode))
    }
  }

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
  let regex
  value = App.replace_filter_vars(value)

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
    let cleaned = App.escape_regex(App.clean_filter(value))

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

  let words = args.value.split(` `)
  let word_lower = words[0].toLowerCase()

  if (!match && (words.length === 1)) {
    if (args.by_what === `color` || App.get_setting(`filter_colors`)) {
      let color = App.get_color(args.item)

      if (color) {
        match = App.get_color(args.item).startsWith(word_lower)
      }
    }

    if (!match) {
      if (args.by_what === `tag` || App.get_setting(`filter_tags`)) {
        for (let tag of App.get_tags(args.item)) {
          if (tag.toLowerCase().startsWith(word_lower)) {
            match = true
            break
          }
        }
      }
    }
  }

  if (!match) {
    let title = App.get_title(args.item)
    title = App.clean_filter(title)

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
    else if (args.filter_mode === `color`) {
      if (args.f_value === `all`) {
        match = App.get_color(args.item)
      }
      else {
        match = App.get_color(args.item) === args.f_value
      }
    }
    else if (args.filter_mode === `tag`) {
      if (args.f_value === `all`) {
        match = App.tagged(args.item)
      }
      else {
        match = App.tagged(args.item) &&
        App.get_tags(args.item).includes(args.f_value)
      }
    }
    else if (args.filter_mode === `titled`) {
      match = args.item.custom_title || args.item.rule_title
    }
    else if (args.filter_mode === `notes`) {
      match = App.get_notes(args.item)
    }
    else if (args.filter_mode === `edited`) {
      match = App.edited(args.item)
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
    else if (args.filter_mode === `loaded`) {
      match = !args.item.discarded
    }
    else if (args.filter_mode === `unloaded`) {
      match = args.item.discarded
    }
    else if (args.filter_mode === `duplicate`) {
      match = args.duplicates.includes(args.item)
    }
    else if (args.filter_mode === `unread`) {
      match = args.item.unread
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

  return Boolean(match)
}

App.focus_filter = (mode = App.window_mode) => {
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

App.set_filter = (args = {}) => {
  let def_args = {
    text: ``,
    filter: true,
    instant: true,
  }

  App.def_args(def_args, args)
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

App.filter_modes = (mode) => {
  return App[`${mode}_filter_modes_all`] || []
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

App.set_filter_mode = (args = {}) => {
  let def_args = {
    filter: true,
    instant: true,
  }

  App.def_args(def_args, args)
  let filter_mode = App.get_filter_mode(args.mode, args.type)
  App[`${args.mode}_filter_mode`] = filter_mode.type
  DOM.el(`#${args.mode}_filter_modes_text`).textContent = filter_mode.text

  if (args.filter) {
    if (args.instant) {
      App.do_filter({mode: args.mode})
    }
    else {
      App.filter({mode: args.mode, from: `cycle`})
    }
  }
}

App.set_custom_filter_mode = (mode, name, title) => {
  App[`${mode}_filter_mode`] = name
  DOM.el(`#${mode}_filter_modes_text`).textContent = title
}

App.create_filter = (mode) => {
  let filter = DOM.create(`input`, `text filter`, `${mode}_filter`)
  filter.type = `text`
  filter.autocomplete = `off`
  filter.spellcheck = false
  filter.tabIndex = 0

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
    if (App.get_setting(`filter_enter`)) {
      return
    }

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
  let value = App.clean_filter(App.get_filter(mode)).toLowerCase()
  let type = App.popup_open() ? `popup` : `window`
  let win = DOM.el(`#${type}_${mode}`)
  let container = DOM.el_or_self(`.filter_container`, win)
  let items = DOM.els(`.filter_item`, container)
  let ignore = DOM.els(`.filter_ignore`, container)

  for (let item of ignore) {
    if (value) {
      item.classList.add(`hidden`)
    }
    else {
      item.classList.remove(`hidden`)
    }
  }

  for (let item of items) {
    let text = DOM.el_or_self(`.filter_text`, item).textContent
    text = App.clean_filter(text).toLowerCase()

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

  items.push({
    text: `By Color`,
    action: () => {
      App.filter_cmd(mode, `color`)
    },
  })

  items.push({
    text: `By Tag`,
    action: () => {
      App.filter_cmd(mode, `tag`)
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

App.filter_color = (mode, color) => {
  let name = `color_${color}`

  if (App[`${mode}_filter_mode`] === name) {
    App.filter_all(mode)
    return
  }

  if (color === `all`) {
    s = `All Colors`
  }
  else {
    s = App.capitalize(color)
  }

  App.set_custom_filter_mode(mode, name, s)
  App.set_filter({mode: mode})
}

App.filter_all = (mode = App.window_mode) => {
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

  App.show_context({items: items, e: e})
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
  App.show_confirm({
    message: `Forget filter history?`,
    confirm_action: () => {
      App.filter_history = []
      App.stor_save_filter_history()
    },
  })
}

App.forget_filter_history_item = (value) => {
  App.filter_history = App.filter_history.filter(x => x !== value)
  App.stor_save_filter_history()
}

App.filter_is_focused = (mode) => {
  return App.get_filter_el(mode) === document.activeElement
}

App.filter_is_highlighted = (mode) => {
  let filter = App.get_filter_el(mode)
  return filter.selectionStart !== filter.selectionEnd
}

App.filter_at_end = (mode) => {
  let filter = App.get_filter_el(mode)
  return filter.selectionStart === filter.selectionEnd &&
  filter.selectionEnd === filter.value.length
}

App.clean_filter = (s) => {
  if (!App.get_setting(`clean_filter`)) {
    return s
  }

  s = App.no_space(s)
  s = App.remove_special(s)
  s = s.trim()
  return s
}

App.show_filter_color_menu = (mode, e) => {
  let items = App.get_color_items(mode, `filter`)
  App.show_context({items: items, e: e})
}

App.filter_playing = (mode) => {
  App.set_filter_mode({mode: mode, type: `playing`})
}

App.filter_duplicate = (mode) => {
  App.set_filter_mode({mode: mode, type: `duplicate`})
}

App.filter_unloaded = (mode) => {
  App.set_filter_mode({mode: mode, type: `unloaded`})
}

App.filter_pinned = (mode) => {
  App.set_filter_mode({mode: mode, type: `pinned`})
}

App.filter_normal = (mode) => {
  App.set_filter_mode({mode: mode, type: `normal`})
}

App.filter_loaded = (mode) => {
  App.set_filter_mode({mode: mode, type: `loaded`})
}

App.filter_no_tab = (mode) => {
  App.set_filter_mode({mode: mode, type: `notab`})
}

App.filter_unread = (mode) => {
  App.set_filter_mode({mode: mode, type: `unread`})
}

App.filter_titled = (mode) => {
  App.set_filter_mode({mode: mode, type: `titled`})
}

App.filter_notes = (mode) => {
  App.set_filter_mode({mode: mode, type: `notes`})
}

App.filter_edited = (mode) => {
  App.set_filter_mode({mode: mode, type: `edited`})
}

App.filter_tag = (mode, tag) => {
  let s

  if (tag === `all`) {
    s = `All Tags`
  }
  else {
    s = tag
  }

  App.set_custom_filter_mode(mode, `tag_${tag}`, s)
  App.set_filter({mode: mode})
}

App.blur_filter = (mode) => {
  DOM.el(`#${mode}_filter`).blur()
}