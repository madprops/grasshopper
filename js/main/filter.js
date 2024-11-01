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
}

App.check_filter = (mode) => {
  App.check_filter_debouncer.call({mode})
}

App.check_filter_special = (mode) => {
  let modes = [
    `filter_duplicate_tabs`,
  ]

  if (modes.includes(App.filter_mode(mode))) {
    App.check_filter(mode)
  }
}

App.filter = (args) => {
  args.sticky = false

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
  App.check_filter_debouncer.cancel()
}

App.do_filter = async (args = {}) => {
  App.cancel_filter()

  let def_args = {
    force: false,
    deep: false,
    select: true,
    from: `normal`,
    refine: false,
    sticky: true,
  }

  App.def_args(def_args, args)
  App.debug(`Filter: ${args.mode}`)
  let value = App.get_filter(args.mode)
  App.check_filtered(args.mode)
  App[`last_${args.mode}_filter`] = value
  value = App.remove_protocol(value)
  App.save_previous_filter(args.mode)

  if (value.endsWith(`|`)) {
    return
  }

  let by_what
  let cmd

  for (let what of App.filter_whats) {
    if (value.startsWith(`${what}:`)) {
      cmd = [what, value.replace(`${what}:`, ``).trim()]
    }
  }

  if (cmd) {
    value = cmd[1]
    by_what = cmd[0]
  }
  else {
    by_what = `all`
  }

  function check_quotes_enabled(val) {
    if (App.get_setting(`special_quotes`)) {
      if (val.includes(`"`)) {
        if (!by_what.includes(`re`)) {
          if (by_what === `all`) {
            by_what = `title`
          }

          return true
        }
      }
    }

    return false
  }

  let quotes_enabled = check_quotes_enabled(value)

  if (by_what !== `all`) {
    if (!value) {
      return
    }
  }

  let search = false
  let search_results = []

  // This check is to avoid re-fetching items
  // For instance when moving from All to Image
  if (App.search_modes.includes(args.mode)) {
    let svalue = value

    if (args.force || (svalue !== App[`last_${args.mode}_query`])) {
      svalue = App.replace_filter_vars(svalue)

      if (quotes_enabled) {
        svalue = App.remove_quotes(svalue)
      }

      let search_date = App.now()
      App.filter_search_date = search_date

      search_results = await App.search_items({
        mode: args.mode,
        query: svalue,
        deep: args.deep,
        date: search_date,
        by_what,
      })

      if (App.filter_search_date !== search_date) {
        return
      }

      if (App.active_mode !== args.mode) {
        return
      }

      search = true
    }
  }

  let items

  if (search) {
    items = search_results

    for (let info of items) {
      App.process_search_item(info)
    }
  }
  else if (args.refine) {
    items = App.get_visible(args.mode)
  }
  else {
    items = App.get_items(args.mode)
  }

  if (!items) {
    return
  }

  let filter_mode = App.filter_mode(args.mode)
  let filter_mode_split = filter_mode.split(`-`)
  let f_value

  if (filter_mode_split.length >= 2) {
    filter_mode = filter_mode_split[0]
    f_value = filter_mode_split.slice(1).join(`-`)
  }

  let skip = !value && filter_mode === `all`
  let duplicates

  if (filter_mode === `filter_duplicate_tabs`) {
    duplicates = App.find_duplicates(items, `url`)
    duplicates = duplicates.filter(x => !x.header)
  }

  let regexes = []
  let reg = App.make_filter_regex(value, by_what, quotes_enabled)

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
      else if (alias.a.startsWith(value)) {
        match = alias.b
      }
      else if (alias.b.startsWith(value)) {
        match = alias.a
      }

      if (match) {
        if (!quotes_enabled) {
          quotes_enabled = check_quotes_enabled(match)
        }

        let reg = App.make_filter_regex(match, by_what, quotes_enabled)

        if (reg) {
          regexes.push(reg)
        }
      }
    }
  }

  let f_value_lower = f_value ? f_value.toLowerCase() : ``

  function check_match (item) {
    let args = {
      item,
      regexes,
      by_what,
      filter_mode,
      duplicates,
      value,
      value_lower: value.toLowerCase(),
      f_value,
      f_value_lower,
      search,
    }

    return App.filter_check(args)
  }

  let headers = filter_mode === `filter_header_tabs`
  let header_match = 0
  let max_header = App.get_setting(`header_filter_context`)
  let force_show = App.is_filtered(args.mode)
  let check_pins = !App.get_setting(`show_pinned_tabs`)
  let check_unloaded = !App.get_setting(`show_unloaded_tabs`)
  let check_hide = check_pins || check_unloaded
  let num_matched = 0
  let check_max = false
  let max_items = 0
  let matched_items = []

  if (search) {
    if (App.get_setting(`auto_deep_search_${args.mode}`)) {
      args.deep = true
    }

    if (args.deep) {
      max_items = App.get_setting(`deep_max_search_items_${args.mode}`)
    }
    else {
      max_items = App.get_setting(`max_search_items_${args.mode}`)
    }

    check_max = true
  }

  for (let item of items) {
    if (!search && !item.element) {
      continue
    }

    let match = false

    if (skip) {
      match = true
    }

    if (!match) {
      if (headers) {
        if (header_match >= 1) {
          if (App.check_header_first(item)) {
            header_match += 1
            match = true

            if (header_match > max_header) {
              header_match = 0
            }
          }
          else {
            header_match = 0
          }
        }
      }
    }

    if (!match) {
      match = check_match(item)
    }

    if (match) {
      num_matched += 1

      if (search) {
        matched_items.push(item)

        if (check_max) {
          if (num_matched >= max_items) {
            break
          }
        }

        continue
      }

      App.show_item(item)

      if (force_show) {
        App.show_item_2(item)
      }
      else if (check_hide && (item.pinned || item.unloaded)) {
        App.check_hide_tabs(item)
      }

      if (headers) {
        if (item.header) {
          header_match = 1
        }
      }
    }
    else if (!search) {
      App.hide_item(item)
    }
  }

  if (search) {
    // Search mode only creates the matched items
    // This makes searches a lot faster
    App.process_info_list(args.mode, matched_items)
    App.clear_selected(args.mode)
  }

  let selected = App.get_selected(args.mode)

  if (args.select) {
    App.clear_selected(args.mode)
    let sticky_filter = App.get_setting(`sticky_filter`)

    if (!args.sticky || (args.mode !== `tabs`)) {
      sticky_filter = `none`
    }

    let last_item

    if ((sticky_filter !== `none`) && (args.from !== `step_back`)) {
      let f_mode = App.filter_mode(args.mode)
      let f_item = App.get_filter_item(args.mode, f_mode)

      if (f_item && !f_item.removed && f_item.visible) {
        last_item = f_item
      }
    }

    if (last_item) {
      if ((sticky_filter === `activate`) && !last_item.unloaded) {
        App.focus_tab({item: last_item, scroll: `center`, method: `sticky_filter`})
      }
      else {
        App.select_item({item: last_item, deselect: false})
      }
    }
    else if (num_matched > 0) {
      if (selected && selected.visible && App.get_setting(`filter_keep_selected`)) {
        App.select_item({item: selected, deselect: false})
      }
      else {
        App.select_first_item(args.mode, !App.is_filtered(args.mode))
      }
    }
  }

  App.update_footer_info(App.get_selected(args.mode))
  App.update_footer_count()
  App.do_check_pinline()
  App.do_check_scroller(args.mode)

  if (args.select) {
    App.scroll_to_selected(args.mode)
  }

  if (num_matched === 0) {
    if (search) {
      if (value) {
        App.show_search_empty(args.mode, args.deep)
      }
      else {
        App.show_search_no_value(args.mode)
      }
    }
  }

  App.refresh_tab_box_special(args.mode)
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

App.make_filter_regex = (value, by_what, quotes = true) => {
  let regex
  value = App.replace_filter_vars(value)
  let ci = App.get_setting(`case_insensitive`)

  if (by_what.startsWith(`re`)) {
    let cleaned = value.replace(/\\+$/, ``)

    try {
      regex = new RegExp(cleaned, ci ? `i` : ``)
    }
    catch (err) {
      // Do nothing
    }
  }
  else {
    let cleaned = App.clean_filter(value)
    cleaned = App.escape_regex(cleaned)

    if (quotes) {
      cleaned = cleaned.replace(/"/g, `\\b`)
    }

    regex = new RegExp(cleaned, ci ? `i` : ``)
  }

  return regex
}

App.filter_check = (args) => {
  let match = false
  let title = App.title(args.item)
  let lower_title = title.toLowerCase()

  if (!match) {
    let clean_title = App.clean_filter(title)

    for (let regex of args.regexes) {
      if (args.by_what === `all` || args.by_what === `re`) {
        match = regex.test(clean_title)

        if (!match && !args.item.header) {
          match = regex.test(args.item.path)
        }
      }
      else if (args.by_what.includes(`title`)) {
        match = regex.test(clean_title)
      }
      else if (args.by_what.includes(`url`)) {
        match = regex.test(args.item.path)
      }

      if (match) {
        break
      }
    }
  }

  if (args.search) {
    return Boolean(match)
  }

  if (!match) {
    if (args.by_what.startsWith(`color`) || App.get_setting(`filter_colors`)) {
      let color_id = App.get_color(args.item)

      if (color_id) {
        let color = App.get_color_by_id(color_id)

        if (color) {
          match = App.clean_filter(color.name, true) === args.value_lower
        }
      }
    }
  }

  if (!match) {
    if (args.by_what.startsWith(`tag`) || App.get_setting(`filter_tags`)) {
      for (let tag of App.tags(args.item)) {
        if (App.clean_filter(tag, true) === args.value_lower) {
          match = true
          break
        }
      }
    }
  }

  if (!match) {
    if ((args.by_what === `all`) && App.get_setting(`filter_media`)) {
      if (App.item_or_items(args.value_lower, `image`)) {
        match = args.item.image
      }
      else if (App.item_or_items(args.value_lower, `video`)) {
        match = args.item.video
      }
      else if (App.item_or_items(args.value_lower, `audio`)) {
        match = args.item.audio
      }
    }
  }

  if (!match) {
    if ((args.by_what === `all`) && App.get_setting(`filter_containers`)) {
      if (args.item.container_name) {
        let cname = App.clean_filter(args.item.container_name, true)
        match = cname === args.value_lower
      }
    }
  }

  if (match) {
    if (args.filter_mode === `all`) {
      match = true
    }
    else if (args.filter_mode === `domain`) {
      match = args.item.hostname.startsWith(args.f_value)
    }
    else if (args.filter_mode === `title`) {
      match = lower_title.includes(args.f_value_lower)
    }
    else if (args.filter_mode === `node`) {
      if (args.item.parent) {
        match = args.item.parent.toString() === args.f_value
      }
      else {
        match = false
      }
    }
    else if (args.filter_mode === `container`) {
      return args.item.container_name === args.f_value
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
        match = App.tags(args.item).includes(args.f_value)
      }
    }
    else if (args.filter_mode === `icon`) {
      if (args.f_value === `all`) {
        match = App.get_icon(args.item)
      }
      else {
        match = App.get_icon(args.item) === args.f_value
      }
    }
    else if (args.filter_mode === `filter_media_image`) {
      match = args.item.image
    }
    else if (args.filter_mode === `filter_media_video`) {
      match = args.item.video
    }
    else if (args.filter_mode === `filter_media_audio`) {
      match = args.item.audio
    }
    else if (args.filter_mode === `filter_titled_tabs`) {
      if (args.item.header) {
        match = false
      }
      else {
        match = args.item.custom_title || args.item.rule_title
      }
    }
    else if (args.filter_mode === `filter_pinned_tabs`) {
      match = args.item.pinned
    }
    else if (args.filter_mode === `filter_normal_tabs`) {
      match = !args.item.pinned
    }
    else if (args.filter_mode === `filter_playing_tabs`) {
      match = args.item.playing || args.item.muted
    }
    else if (args.filter_mode === `filter_loaded_tabs`) {
      match = !args.item.unloaded
    }
    else if (args.filter_mode === `filter_unloaded_tabs`) {
      match = args.item.unloaded
    }
    else if (args.filter_mode === `filter_duplicate_tabs`) {
      match = args.duplicates.includes(args.item)
    }
    else if (args.filter_mode === `filter_unread_tabs`) {
      match = args.item.unread
    }
    else if (args.filter_mode === `filter_notes_tabs`) {
      match = App.get_notes(args.item)
    }
    else if (args.filter_mode === `filter_root_tabs`) {
      match = App.get_root(args.item)
    }
    else if (args.filter_mode === `filter_edited_tabs`) {
      match = App.edited(args.item)
    }
    else if (args.filter_mode === `filter_header_tabs`) {
      match = args.item.header
    }
    else if (args.filter_mode === `filter_all_node_tabs`) {
      match = App.tab_has_parent(args.item)
    }
    else if (args.filter_mode === `filter_all_parent_tabs`) {
      match = App.tab_has_nodes(args.item)
    }
    else if (args.filter_mode === `filter_no_tab`) {
      let no_tab = true

      for (let tab of App.get_items(`tabs`)) {
        if (tab.path === args.item.path) {
          no_tab = false
          break
        }
      }

      match = no_tab
    }
    else if (args.filter_mode === `filter_tab_containers_all`) {
      match = args.item.container_name
    }
  }

  return Boolean(match)
}

App.focus_filter = (mode = App.active_mode) => {
  App.get_filter_el(mode).focus()
}

App.unfocus_filter = (mode = App.active_mode) => {
  App.get_filter_el(mode).blur()
  App.focus_items(mode)
}

App.is_filtered = (mode = App.active_mode) => {
  return App.filter_has_value(mode) || (App.filter_mode(mode) !== `all`)
}

App.clear_filter = (mode = App.active_mode) => {
  if (App.filter_has_value(mode)) {
    App.set_filter({mode})
  }
}

App.set_filter = (args = {}) => {
  let def_args = {
    text: ``,
    filter: true,
    instant: true,
    to_history: true,
  }

  App.def_args(def_args, args)
  App.get_filter_el(args.mode).value = args.text

  if (args.to_history) {
    App.update_filter_history(args.mode)
  }

  if (args.filter) {
    if (App.on_items(args.mode)) {
      if (args.instant) {
        App.do_filter({mode: args.mode, from: args.from})
      }
      else {
        App.filter({mode: args.mode, from: args.from})
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
    else if (args.instant) {
      App[`do_filter_${args.mode}`]()
    }
    else {
      App[`filter_${args.mode}`]()
    }
  }
}

App.filter_by = (mode, cmd) => {
  let new_text

  if (cmd === `all`) {
    new_text = ``
  }
  else {
    new_text = `${cmd}: `
  }

  let current = App.get_filter(mode)

  if (current) {
    let regex = new RegExp(/^(\w+:)/)
    let cleaned = current.replace(regex, ``).trim()
    new_text += cleaned
  }

  App.set_filter({mode, text: new_text})
}

App.filter_has_value = (mode = App.active_mode) => {
  return App.get_filter(mode) !== ``
}

App.get_filter_el = (mode) => {
  return DOM.el(`#${mode}_filter`)
}

App.get_filter = (mode = App.active_mode) => {
  let el = App.get_filter_el(mode)

  if (!el) {
    return ``
  }

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

App.get_filter_mode = (mode, cmd) => {
  for (let filter_mode of App.filter_modes(mode)) {
    if (filter_mode.cmd === cmd) {
      return filter_mode
    }
  }

  if (App.get_command(cmd)) {
    return {cmd}
  }
}

App.set_filter_mode = (args = {}) => {
  let def_args = {
    filter: true,
    instant: true,
    refine: false,
  }

  App.def_args(def_args, args)
  let filter_mode = App.get_filter_mode(args.mode, args.cmd)
  App[`${args.mode}_filter_mode`] = args.cmd
  let mode_text = DOM.el(`#${args.mode}_filter_modes_text`)
  mode_text.innerHTML = ``
  mode_text.append(App.filter_mode_text({mode: args.mode, filter_mode}))

  if (args.filter) {
    if (args.instant) {
      App.do_filter({mode: args.mode, from: args.from, refine: args.refine})
    }
    else {
      App.filter({mode: args.mode, from: args.from, refine: args.refine})
    }
  }
}

App.set_custom_filter_mode = (mode, name, title) => {
  App[`${mode}_filter_mode`] = name
  let mode_text = DOM.el(`#${mode}_filter_modes_text`)
  mode_text.innerHTML = ``
  mode_text.append(App.filter_mode_text({mode, name, title}))
}

App.filter_mode_text = (args = {}) => {
  let icon, text

  if (args.filter_mode) {
    if (args.filter_mode.cmd === `all`) {
      icon = args.filter_mode.icon
      text = args.filter_mode.text
    }
    else {
      let cmd = App.get_command(args.filter_mode.cmd)

      if (cmd) {
        icon = cmd.icon
        text = cmd.short_name || cmd.name
      }
    }
  }
  else if (args.name) {
    if (args.name.startsWith(`tag-`)) {
      let filter_mode = App.get_filter_mode(args.mode, `tag_menu`)
      icon = filter_mode.icon
    }
    else if (args.name === `icon-all`) {
      let filter_mode = App.get_filter_mode(args.mode, `icon_menu`)
      icon = filter_mode.icon
    }
    else if (args.name.startsWith(`color-`)) {
      let color = args.name.replace(`color-`, ``)

      if (color === `all`) {
        let filter_mode = App.get_filter_mode(args.mode, `color_menu`)
        icon = filter_mode.icon
      }
      else {
        icon = App.color_icon(color)
      }
    }
    else if (args.name.startsWith(`container-`)) {
      let name = args.name.replace(`container-`, ``)
      icon = App.color_icon_square(App.container_data[name].color)
    }

    text = args.title
  }

  return App.button_text(icon, text)
}

App.create_filter = (mode) => {
  let filter = DOM.create(`input`, `text filter mode_filter`, `${mode}_filter`)
  filter.type = `text`
  filter.autocomplete = `off`
  filter.spellcheck = false
  filter.tabIndex = 0
  let rclick = App.get_cmd_name(`show_filter_context_menu`)
  let mclick = App.get_cmd_name(`show_refine_filters`)

  if (App.tooltips()) {
    filter.title = `Type to filter or search\nRight Click: ${rclick}\nMiddle Click: ${mclick}`
    App.trigger_title(filter, `double_click_filter`)
  }

  if (App.search_modes.includes(mode)) {
    filter.placeholder = `Search`
  }
  else {
    filter.placeholder = App.filter_placeholder
  }

  DOM.ev(filter, `input`, () => {
    if (App.filter_has_value(mode)) {
      if (App.filter_enter_active(mode)) {
        return
      }
    }

    App.filter({mode})
  })

  DOM.ev(filter, `wheel`, (e) => {
    let direction = App.wheel_direction(e)
    App.cycle_filters(mode, direction)
  })

  App.check_show_button(`filter`, filter, `input`)
  return filter
}

App.get_custom_filters = (mode) => {
  let items = []

  for (let obj of App.get_setting(`custom_filters`)) {
    items.push({
      text: obj.filter,
      action: () => {
        App.set_custom_filter(mode, obj.filter)
      },
    })
  }

  return items
}

App.show_custom_filters = (mode, e) => {
  let items = App.get_custom_filters(mode)
  let title_icon = App.settings_icons.filter
  App.show_context({items, e, title: `Custom`, title_icon})
}

App.set_custom_filter = (mode, filter) => {
  App.set_filter({mode, text: filter})
  App.focus_filter(mode)
}

App.do_filter_2 = (mode) => {
  let value = App.clean_filter(App.get_filter(mode), true)
  let type = App.popup_open() ? `popup` : `window`
  let win = DOM.el(`#${type}_${mode}`)
  let container = DOM.el_or_self(`.filter_container`, win)
  let items = DOM.els(`.filter_item`, container)
  let ignore = DOM.els(`.filter_ignore`, container)
  let colons = value.includes(`:`)

  for (let item of ignore) {
    if (value) {
      DOM.hide(item)
    }
    else {
      DOM.show(item)
    }
  }

  for (let item of items) {
    let text = DOM.el_or_self(`.filter_text`, item).textContent
    text = App.clean_filter(text, true)

    if (!colons) {
      text = text.replace(/:/g, ``)
    }

    let show

    if (text.startsWith(`!`)) {
      show = value && text.startsWith(value)
    }
    else {
      show = text.includes(value)
    }

    if (show) {
      DOM.show(item)
    }
    else {
      DOM.hide(item)
    }
  }
}

App.get_filter_exact = (mode) => {
  let items = []

  items.push({
    text: `By Title`,
    action: () => {
      App.filter_by(mode, `title`)
    },
  })

  items.push({
    text: `By URL`,
    action: () => {
      App.filter_by(mode, `url`)
    },
  })

  items.push({
    text: `By All`,
    action: () => {
      App.filter_by(mode, `all`)
    },
  })

  items.push({
    text: `Regex Title`,
    action: () => {
      App.filter_by(mode, `re_title`)
    },
  })

  items.push({
    text: `Regex URL`,
    action: () => {
      App.filter_by(mode, `re_url`)
    },
  })

  items.push({
    text: `Regex All`,
    action: () => {
      App.filter_by(mode, `re`)
    },
  })

  items.push({
    text: `By Color`,
    action: () => {
      App.filter_by(mode, `color`)
    },
  })

  items.push({
    text: `By Tag`,
    action: () => {
      App.filter_by(mode, `tag`)
    },
  })

  return items
}

App.search_items = async (args = {}) => {
  let q = args.query || `Empty`
  App.debug(`Searching ${args.mode}: ${q}`)
  let items = await App[`get_${args.mode}`](args.query, args.deep, args.by_what)

  if (App.filter_search_date !== args.date) {
    return []
  }

  if (App.window_mode !== args.mode) {
    return []
  }

  return items
}

App.deep_search = (mode) => {
  App.do_filter({mode, force: true, deep: true})
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

App.filter_common = (args = {}) => {
  if (!args.prop) {
    return
  }

  if (App.filter_mode(args.item.mode).startsWith(args.name)) {
    if (![`node`].includes(args.name)) {
      App.filter_all(args.item.mode)
      return
    }
  }

  App.set_custom_filter_mode(
    args.item.mode,
    `${args.name}-${args.prop}`,
    `${App.notepad_icon} ${args.full}`,
  )

  App.do_filter({mode: args.item.mode})
}

App.filter_domain = (item) => {
  App.filter_common({
    name: `domain`,
    full: `Domain`,
    prop: item.hostname,
    item,
  })
}

App.filter_title = (item) => {
  App.filter_common({name: `title`,
    full: `Title`,
    prop: App.title(item),
    item,
  })
}

App.filter_nodes = (item) => {
  App.filter_common({
    name: `node`,
    full: `Node`,
    prop: item.id,
    item,
  })
}

App.filter_all = (mode = App.active_mode, from = `normal`) => {
  if (App.is_filtered(mode)) {
    App.set_filter_mode({mode, cmd: `all`, filter: false})
    App.set_filter({mode, from})
  }
}

App.save_previous_filter = (mode) => {
  let pmode = App.filter_mode(mode)
  let ptext = App.get_filter(mode)

  if ((pmode === `all`) && !ptext) {
    return
  }

  App.prev_filter_mode = pmode
  App.prev_filter_text = ptext
}

App.previous_filter = (mode) => {
  let pmode = App.prev_filter_mode
  let ptext = App.prev_filter_text

  if (pmode || ptext) {
    if ((pmode === App.filter_mode(mode)) && (ptext === App.get_filter(mode))) {
      App.filter_all(mode)
    }
    else {
      if (pmode) {
        if (pmode.includes(`-`)) {
          if (pmode.startsWith(`color`)) {
            let color = pmode.replace(`color-`, ``)
            App.filter_color({mode, id: color})
          }
          else if (pmode.startsWith(`tag`)) {
            let tag = pmode.replace(`tag-`, ``)
            App.filter_tag({mode, tag})
          }
          else if (pmode.startsWith(`icon`)) {
            let icon = pmode.replace(`icon-`, ``)
            App.filter_icon({mode, icon})
          }
        }
        else {
          App.set_filter_mode({mode, cmd: pmode, filter: false})
        }
      }

      let filter = ptext || ``
      App.set_filter({mode, text: filter})
    }
  }
  else {
    App.filter_all(mode)
  }
}

App.show_filter_context_menu = (mode, e) => {
  let items = []
  let value = App.get_filter(mode)
  let filter_icon = App.settings_icons.filter

  for (let value of App.filter_history) {
    items.push({
      text: value.substring(0, 25).trim(),
      action: () => {
        App.set_filter({mode, text: value})
      },
      middle_action: () => {
        App.forget_filter_history_item(value)
        App.show_filter_context_menu(mode, e)
      },
    })
  }

  if (items.length) {
    App.sep(items)

    items.push({
      text: `Forget`,
      action: () => {
        App.forget_filter_history()
      },
    })

    App.sep(items)
  }

  items.push({
    text: `Exact`,
    icon: filter_icon,
    get_items: () => {
      return App.get_filter_exact(mode)
    },
  })

  items.push({
    text: `Refine`,
    icon: filter_icon,
    get_items: () => {
      return App.get_refine_items()
    },
  })

  items.push({
    text: `Custom`,
    icon: filter_icon,
    get_items: () => {
      return App.get_custom_filters(mode)
    },
  })

  App.sep(items)

  if (value) {
    items.push({
      icon: App.clipboard_icon,
      text: `Copy`,
      action: () => {
        App.copy_filter(mode)
      },
    })
  }

  items.push({
    icon: App.clipboard_icon,
    text: `Paste`,
    action: () => {
      App.paste_filter(mode)
    },
  })

  if (value) {
    App.sep(items)

    items.push({
      icon: App.notepad_icon,
      text: `Clear`,
      action: () => {
        App.clear_filter(mode)
      },
    })
  }

  App.sep(items)

  items.push({
    icon: App.settings_icons.filter,
    text: `Settings`,
    action: () => {
      App.show_settings_category(`filter`)
    },
  })

  App.show_context({items, e})
}

App.update_filter_history = (mode = App.active_mode) => {
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

App.filter_at_end = (mode) => {
  let filter = App.get_filter_el(mode)
  return filter.selectionStart === filter.selectionEnd &&
  filter.selectionEnd === filter.value.length
}

App.clean_filter = (s, lower_case = false) => {
  s = App.single_space(s).trim()

  if (lower_case) {
    s = s.toLowerCase()
  }

  return s
}

App.show_filter_color_menu = (mode, e) => {
  let items = App.get_color_items(mode, `filter`)
  App.show_context({items, e})
}

App.toggle_filter = (mode, cmd, refine = false) => {
  if (App[`${mode}_filter_mode`] === cmd) {
    App.filter_all(mode)
    return
  }

  App.set_filter_mode({mode, cmd, refine})
}

App.filter_cmd = (mode, cmd, from) => {
  if (from === App.refine_string) {
    App.toggle_filter(mode, cmd, true)
  }
  else {
    App.toggle_filter(mode, cmd)
  }
}

App.complex_filter = (args = {}) => {
  let def_args = {
    toggle: false,
  }

  App.def_args(def_args, args)
  let name = `${args.short}-${args.value}`

  if (args.toggle) {
    if (App[`${args.mode}_filter_mode`] === name) {
      App.filter_all(args.mode)
      return
    }
  }

  let s

  if (args.value === `all`) {
    s = `All ${args.full}`
  }
  else {
    s = args.text
  }

  let refine = args.from === App.refine_string
  App.set_custom_filter_mode(args.mode, name, s)
  App.do_filter({mode: args.mode, refine})
}

App.filter_color = (args = {}) => {
  let def_args = {
    toggle: false,
  }

  App.def_args(def_args, args)
  let value, text

  if (args.id === `all`) {
    value = `all`
  }
  else {
    let color = App.get_color_by_id(args.id)
    value = color.id
    text = color.name
  }

  App.complex_filter({
    mode: args.mode,
    value,
    text,
    short: `color`,
    full: `Colors`,
    toggle: args.toggle,
    cap_value: true,
    from: args.from,
  })
}

App.filter_tag = (args = {}) => {
  let def_args = {
    toggle: false,
  }

  App.def_args(def_args, args)

  App.complex_filter({
    mode: args.mode,
    value: args.tag,
    text: args.tag,
    short: `tag`,
    full: `Tags`,
    toggle: args.toggle,
    from: args.from,
  })
}

App.filter_container = (args = {}) => {
  let def_args = {
    toggle: false,
  }

  App.def_args(def_args, args)

  App.complex_filter({
    mode: args.mode,
    value: args.container,
    text: args.container,
    short: `container`,
    full: `Containers`,
    toggle: args.toggle,
    from: args.from,
  })
}

App.filter_icon = (args = {}) => {
  let def_args = {
    toggle: false,
  }

  App.def_args(def_args, args)

  App.complex_filter({
    mode: args.mode,
    value: args.icon,
    text: args.icon,
    short: `icon`,
    full: `Icons`,
    toggle: args.toggle,
    from: args.from,
  })
}

App.check_filtered = (mode) => {
  let container = DOM.el(`#${mode}_container`)
  let filtered = App.is_filtered(mode)

  if (filtered) {
    container.classList.remove(`not_filtered`)
    container.classList.add(`filtered`)
  }
  else {
    container.classList.add(`not_filtered`)
    container.classList.remove(`filtered`)
  }

  let filter_effect = App.get_setting(`filter_effect`)

  if (filter_effect !== `none`) {
    let filter = App.get_filter_el(mode)
    let apply = false

    if (filter_effect === `text`) {
      apply = App.filter_has_value(mode)
    }
    else if (filter_effect === `mode`) {
      apply = App.filter_mode(mode) !== `all`
    }
    else if (filter_effect === `both`) {
      apply = filtered
    }

    if (apply) {
      filter.classList.add(`filter_effect`)
    }
    else {
      filter.classList.remove(`filter_effect`)
    }
  }
}

App.create_filter_button = (mode) => {
  function separator () {
    return {cmd: App.separator_string, skip: true}
  }

  let btn = DOM.create(`div`, `button icon_button filter_button`, `${mode}_filter_modes`)
  let click = App.get_cmd_name(`show_filter_menu`)
  let rclick = ``

  if (App.get_setting(`favorite_filters`)) {
    if (App.get_setting(`favorite_filters`).length) {
      rclick = App.get_cmd_name(`show_favorite_filters`)
    }
    else {
      rclick = App.get_cmd_name(`show_palette`)
    }
  }

  if (App.tooltips()) {
    btn.title = `Click: ${click}\nRight Click: ${rclick}`
    App.trigger_title(btn, `middle_click_filter_button`)
    App.trigger_title(btn, `click_press_filter_button`)
    App.trigger_title(btn, `middle_click_press_filter_button`)
  }

  btn.append(DOM.create(`div`, ``, `${mode}_filter_modes_text`))
  let fmodes = []
  let cmd = App.get_command(`filter_all`)
  fmodes.push({cmd: `all`, text: `All`, icon: cmd.icon, info: cmd.info})
  let m_modes = App[`${mode}_filter_modes`]

  if (m_modes) {
    fmodes.push(separator())
    fmodes.push(...m_modes)
  }

  fmodes.push(separator())
  fmodes.push({cmd: `filter_media_image`})
  fmodes.push({cmd: `filter_media_video`})
  fmodes.push({cmd: `filter_media_audio`})
  fmodes.push(separator())

  cmd = App.get_command(`show_filter_color_menu`)
  fmodes.push({cmd: `color_menu`, text: cmd.short_name, icon: cmd.icon, skip: true, info: cmd.info})

  cmd = App.get_command(`show_filter_tag_menu`)
  fmodes.push({cmd: `tag_menu`, text: cmd.short_name, icon: cmd.icon, skip: true, info: cmd.info})

  cmd = App.get_command(`show_filter_icon_menu`)
  fmodes.push({cmd: `icon_menu`, text: cmd.short_name, icon: cmd.icon, skip: true, info: cmd.info})

  fmodes.push({cmd: `filter_root_tabs`})

  if (mode === `tabs`) {
    fmodes.push(separator())
    cmd = App.get_command(`show_filter_container_menu`)
    fmodes.push({cmd: `container_menu`, text: cmd.short_name, icon: cmd.icon, skip: true, info: cmd.info})
  }

  fmodes.push(separator())
  fmodes.push({cmd: `filter_titled_tabs`})
  fmodes.push({cmd: `filter_notes_tabs`})
  fmodes.push({cmd: `filter_edited_tabs`})

  if (mode !== `tabs`) {
    fmodes.push(separator())
    fmodes.push({cmd: `filter_no_tab`})
  }

  let filter_icon = App.settings_icons.filter

  fmodes.push(separator())
  fmodes.push({cmd: `exact`, text: `Exact`, icon: filter_icon, skip: true, info: `Show the Exact Filters`})
  fmodes.push({cmd: `refine`, text: `Refine`, icon: filter_icon, skip: true, info: `Show the Refine Filters`})
  fmodes.push({cmd: `custom`, text: `Custom`, icon: filter_icon, skip: true, info: `Show the Custom Filters`})

  App.check_show_button(`filter`, btn)
  App[`${mode}_filter_modes_all`] = fmodes
  return btn
}

App.show_filter_menu = (mode) => {
  if (!App.filter_menus[mode]) {
    let items = []
    let f_mode = App.filter_mode(mode)

    for (let filter_mode of App.filter_modes(mode)) {
      if (filter_mode.cmd === App.separator_string) {
        App.sep(items)
        continue
      }

      if (filter_mode.cmd === `all`) {
        items.push({
          icon: filter_mode.icon,
          text: filter_mode.text,
          action: () => {
            if (App.get_setting(`clear_on_all`) || (f_mode === `all`)) {
              App.filter_all(mode)
            }
            else {
              App.set_filter_mode({mode, cmd: `all`})
            }
          },
          info: filter_mode.info,
        })
      }
      else if (filter_mode.cmd === `custom`) {
        items.push({
          icon: filter_mode.icon,
          text: `Custom`,
          get_items: () => {
            return App.get_custom_filters(mode)
          },
          info: filter_mode.info,
        })

        continue
      }
      else if (filter_mode.cmd === `refine`) {
        items.push({
          icon: filter_mode.icon,
          text: filter_mode.text,
          get_items: () => {
            return App.get_refine_items()
          },
          info: filter_mode.info,
        })
      }
      else if (filter_mode.cmd === `exact`) {
        items.push({
          icon: filter_mode.icon,
          text: filter_mode.text,
          get_items: () => {
            return App.get_filter_exact(mode)
          },
          info: filter_mode.info,
        })
      }
      else if (filter_mode.cmd === `color_menu`) {
        items.push({
          icon: filter_mode.icon,
          text: filter_mode.text,
          get_items: () => {
            return App.get_color_items(mode)
          },
          info: filter_mode.info,
        })
      }
      else if (filter_mode.cmd === `tag_menu`) {
        items.push({
          icon: filter_mode.icon,
          text: filter_mode.text,
          get_items: () => {
            return App.get_tag_items(mode)
          },
          info: filter_mode.info,
        })
      }
      else if (filter_mode.cmd === `icon_menu`) {
        items.push({
          icon: filter_mode.icon,
          text: filter_mode.text,
          get_items: () => {
            return App.get_icon_items(mode)
          },
          info: filter_mode.info,
        })
      }
      else if (filter_mode.cmd === `container_menu`) {
        items.push({
          icon: filter_mode.icon,
          text: filter_mode.text,
          get_items: () => {
            return App.get_container_items(mode)
          },
          info: filter_mode.info,
        })
      }
      else {
        let cmd = App.get_command(filter_mode.cmd)

        if (cmd) {
          let selected = f_mode === filter_mode.cmd

          items.push({
            icon: cmd.icon,
            text: cmd.short_name || cmd.name,
            action: (e) => {
              App.run_command({cmd: cmd.cmd, from: `filter_button`, e})
            },
            middle_action: (e) => {
              App.run_command({cmd: cmd.cmd, from: App.refine_string, e})
            },
            selected,
            info: cmd.info,
          })
        }
      }
    }

    App.filter_menus[mode] = items
  }

  let btn = DOM.el(`#${mode}_filter_modes`)
  let compact = App.get_setting(`compact_filter_menu`)

  App.show_context({
    element: btn,
    items: App.filter_menus[mode],
    margin: btn.clientHeight,
    compact,
  })
}

App.cycle_filter_modes = (mode, reverse, e) => {
  let f_modes = App.filter_modes(mode)
  let favorites = App.get_setting(`favorite_filters`)
  favorites = App.remove_separators(favorites)
  let modes = []

  function proc (cmd) {
    if (cmd === `all`) {
      App.filter_all(mode)
    }
    else {
      let c = App.get_command(cmd)

      if (c) {
        App.run_command({cmd: c.cmd, from: `favorite_filters`, e})
      }
    }
  }

  if (favorites.length && !e.shiftKey) {
    modes.push({cmd: `all`})
    let cmd_names = favorites.map(x => x.cmd)

    for (let cmd_name of cmd_names) {
      let cmd = App.get_command(cmd_name)

      if (cmd) {
        if (App.check_command(cmd)) {
          modes.push({
            cmd: cmd_name,
            name: App.filter_cmd_name(cmd_name),
          })
        }
      }
    }
  }

  if (!modes.length) {
    modes = f_modes
  }

  let waypoint = false

  if (reverse) {
    modes = modes.slice(0).reverse()
  }

  let first

  for (let fmode of modes) {
    if (fmode.skip) {
      continue
    }

    if (!first) {
      first = fmode
    }

    if (waypoint) {
      proc(fmode.cmd)
      return
    }

    let name = fmode.name || fmode.cmd

    if (name === App.filter_mode(mode)) {
      waypoint = true
    }
  }

  if (first) {
    proc(first.cmd)
  }
}

App.copy_filter = (mode) => {
  App.copy_to_clipboard(App.get_filter(mode), `Filter`)
}

App.paste_filter = async (mode) => {
  let perm = await App.ask_permission(`clipboardRead`)

  if (!perm) {
    return
  }

  let filter = await navigator.clipboard.readText()

  if (filter) {
    App.set_filter({mode, text: filter})
  }
}

App.filter_cmd_name = (cmd) => {
  let combo_filters = [
    `filter_color_all`,
    `filter_tag_all`,
    `filter_icon_all`,
  ]

  if (combo_filters.includes(cmd)) {
    let split = cmd.split(`_`)
    return `${split[1]}-${split[2]}`
  }

  if (cmd.startsWith(`filter_color_`)) {
    let color = cmd.replace(`filter_color_`, ``)
    return `color-${color}`
  }

  if (cmd.startsWith(`filter_tag_`)) {
    let tag = cmd.replace(`filter_tag_`, ``)
    return `tag-${tag}`
  }

  if (cmd.startsWith(`filter_jump_tag_`)) {
    let tag = cmd.replace(`filter_jump_tag_`, ``)
    return `tag-jump${tag}`
  }

  if (cmd.startsWith(`filter_icon_`)) {
    let icon = cmd.replace(`filter_icon_`, ``)
    return `icon-${icon}`
  }

  return cmd
}

App.show_exact_filters = (mode, e) => {
  let items = App.get_filter_exact(mode)
  let title_icon = App.settings_icons.filter
  App.show_context({items, e, title: `Exact`, title_icon})
}

App.filter_button_context = (mode, e) => {
  if (App.get_setting(`favorite_filters`).length) {
    if (App.get_setting(`favorite_filters_click`)) {
      App.show_filter_menu(mode)
    }
    else {
      App.show_favorite_filters(mode, e)
    }
  }
  else {
    App.show_palette(`filter`)
  }
}

App.show_favorite_filters = (mode, e) => {
  let items = []
  let all = App.filter_modes(mode)[0]

  items.push({
    icon: all.icon,
    text: all.text,
    action: () => {
      App.filter_all(mode)
    },
  })

  for (let cmd of App.get_setting(`favorite_filters`)) {
    if (cmd.cmd === App.separator_string) {
      App.sep(items)
      continue
    }

    let command = App.get_command(cmd.cmd)

    if (command) {
      items.push({
        e,
        icon: command.icon,
        text: App.command_name(command, true),
        info: command.info,
        action: (e) => {
          App.run_command({
            e,
            cmd: command.cmd,
          })
        },
        middle_action: (e) => {
          App.run_command({
            e,
            cmd: command.cmd,
            from: App.refine_string,
          })
        },
      })
    }
  }

  let title_icon = App.settings_icons.filter
  App.show_context({items, e, title: `Favorites`, title_icon})
}

App.cycle_filters = (mode, direction) => {
  let filters = App.filter_history.slice(0)

  if (!filters.length) {
    return
  }

  if (direction === `up`) {
    filters.reverse()
  }

  let next
  let waypoint = false
  let current = App.get_filter(mode)

  for (let it of filters) {
    if (waypoint) {
      next = it
      break
    }

    if (it === current) {
      waypoint = true
    }
  }

  if (!next) {
    if (current) {
      next = ``
    }
    else {
      next = filters[0]
    }
  }

  App.set_filter({mode, text: next, to_history: false})
}

App.get_filter_item = (mode, filter_mode) => {
  return App[`filter_items_${mode}`][filter_mode]
}

App.set_filter_item = (mode, filter_mode, item) => {
  return App[`filter_items_${mode}`][filter_mode] = item
}

App.get_refine_items = () => {
  return App.custom_menu_items({
    name: `refine_filters`,
    from: App.refine_string,
  })
}

App.show_refine_filters = (e) => {
  let items = App.get_refine_items()

  App.show_context({
    e,
    items,
    no_items: `Add Refine Filters in the Filter settings`,
    title: `Refine`,
  })
}

App.filter_double_click = (mode, e) => {
  if (App.filter_has_value(mode)) {
    return
  }

  let cmd = App.get_setting(`double_click_filter`)

  if (!cmd) {
    return
  }

  App.run_command({cmd, from: `filter`, e})
}

App.reset_generic_filter = (what) => {
  let filter = DOM.el(`#${what}_filter`)
  filter.value = ``
  filter.focus()
  App[`do_filter_${what}`]()
}

App.show_search_empty = (mode, deep) => {
  let el = DOM.create(`div`, `search_empty_message`)

  if (deep) {
    el.textContent = `No results with Deep Search enabled. You can try increasing the limits in the settings`
  }
  else {
    el.textContent = `No results. Try doing a Deep Search. Deep Search can also be set to run automatically in the settings`
  }

  let container = DOM.el(`#${mode}_container`)
  container.append(el)
}

App.show_search_no_value = (mode) => {
  let el = DOM.create(`div`, `search_empty_message`)
  el.textContent = `There is nothing here`
  let container = DOM.el(`#${mode}_container`)
  container.append(el)
}

App.filter_button_middle_click = (e) => {
  let cmd = App.get_setting(`middle_click_filter_button`)
  App.run_command({cmd, from: `filter_button`, e})
}

App.filter_middle_click = (e) => {
  let cmd = App.get_setting(`middle_click_filter`)
  App.run_command({cmd, from: `filter`, e})
}

App.filter_enter_active = (mode) => {
  let sett = App.get_setting(`filter_enter`)

  if (sett === `never`) {
    return false
  }
  else if (sett === `always`) {
    return true
  }

  if (App.search_modes.includes(mode)) {
    return sett === `search`
  }

  return sett === `normal`
}