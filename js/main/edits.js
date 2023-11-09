App.edit_props = {
  color: {
    type: `string`,
    rule: true,
  },
  title: {
    type: `string`,
    rule: true,
  },
  tags: {
    type: `list`,
    rule: true,
  },
  notes: {
    type: `string`,
    rule: true,
  },
  split_top: {
    type: `bool`,
    rule: false,
  },
  split_bottom: {
    type: `bool`,
    rule: false,
  },
}

App.setup_edits = () => {
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === `tab_edited`) {
      let item = App.get_item_by_id(`tabs`, message.id)

      if (item) {
        App.check_tab_session([item])
      }
    }
  })
}

App.check_tab_session = async (items = []) => {
  if (!items.length) {
    items = App.get_items(`tabs`)
  }

  let has_split = false

  for (let item of items) {
    for (let key in App.edit_props) {
      let value = await browser.sessions.getTabValue(item.id, `custom_${key}`)

      if (value === undefined) {
        continue
      }

      if (key.includes(`split`)) {
        has_split = true
      }

      App.apply_edit(key, item, value)
    }
  }

  if (has_split) {
    if (App.active_mode === `tabs`) {
      App.scroll_to_item({item: App.get_selected(`tabs`), force: true})
    }
  }
}

App.custom_save = async (id, name, value) => {
  if (Array.isArray(value)) {
    if (!value.length) {
      value = undefined
    }
  }

  if (value) {
    browser.sessions.setTabValue(id, name, value)
  }
  else {
    browser.sessions.removeTabValue(id, name)
  }

  try {
    await browser.runtime.sendMessage({action: `tab_edited`, id: id})
  }
  catch (err) {}
}

App.edited = (item, include_ruled =  true) => {
  let edited = false

  for (let key in App.edit_props) {
    if (!App.edit_is_default(key, item)) {
      edited = true
      break
    }
  }

  if (!edited && include_ruled) {
    edited = item.ruled
  }

  return edited
}

App.same_edit = (what, item, value, type = `custom`) => {
  let props = App.edit_props[what]
  let ovalue = item[`${type}_${what}`]

  if (props.type === `string` || props.type === `bool`) {
    if (ovalue === value) {
      return true
    }
  }
  else if (props.type === `list`) {
    if (App.same_arrays(ovalue, value)) {
      return true
    }
  }

  return false
}

App.edit_default = (what) => {
  let props = App.edit_props[what]

  if (props.type === `string`) {
    return ``
  }
  else if (props.type === `list`) {
    return []
  }
  else if (props.type === `bool`) {
    return false
  }
}

App.edit_is_default = (what, item, kind = `custom`) => {
  return App.str(App.edit_default(what)) === App.str(item[`${kind}_${what}`])
}

App.edit_prompt = (args = {}) => {
  let active = App.get_active_items({mode: args.item.mode, item: args.item})
  let value = ``

  if (!args.add) {
    value = App.edit_to_string(args.what, active[0])

    for (let it of active) {
      if (it === active[0]) {
        continue
      }

      if (App.edit_to_string(args.what, it) !== value) {
        value = ``
        break
      }
    }
  }

  let name = App.capitalize(args.what)
  let suggestions = []
  let tags, titles

  if (args.what === `tags`) {
    tags = App.get_all_tags()
    suggestions = tags
  }
  else if (args.what === `title`) {
    titles = App.get_all_titles()
    suggestions = titles
  }

  let placeholder

  if (args.add) {
    placeholder = `Add ${name}`
  }
  else {
    placeholder = `Edit ${name}`
  }

  let list = []

  if (args.what === `tags`) {
    list = tags
  }
  else if (args.what === `title`) {
    list = titles
  }

  let list_submit

  if (args.what === `title` || args.what === `tags`) {
    list_submit = true
  }
  else {
    list_submit = false
  }

  let word_mode

  if (args.what === `tags`) {
    word_mode = true
  }
  else {
    word_mode = false
  }

  let ignore_words = []
  let append = false
  let show_list = false
  let unique_words = false

  if (args.what === `tags`) {
    if (args.add) {
      ignore_words = App.get_tags(args.item)
      show_list = true
    }

    append = true
    unique_words = true
  }

  App.show_prompt({
    value: value,
    placeholder: placeholder,
    suggestions: suggestions,
    list: list,
    show_list: show_list,
    list_submit: list_submit,
    word_mode: word_mode,
    unique_words: unique_words,
    ignore_words: ignore_words,
    append: append,
    on_submit: (ans) => {
      let obj = {}
      obj[args.what] = ans
      obj.item = args.item
      obj.add = args.add
      App[`edit_tab_${args.what}`](obj)
    },
  })
}

App.remove_edits = (args = {}) => {
  let def_args = {
    force: false,
    items: [],
  }

  App.def_args(def_args, args)

  if (!args.items.length) {
    for (let item of App.get_items(`tabs`)) {
      for (let what of args.what) {
        if (item[`custom_${what}`]) {
          args.items.push(item)
          break
        }
      }
    }
  }

  if (!args.items.length) {
    return
  }

  if (!args.force) {
    args.force = App.check_force(`warn_on_edit_tabs`, args.items)
  }

  App.show_confirm({
    message: `Remove edits? (${args.items.length})`,
    confirm_action: () => {
      for (let item of args.items) {
        for (let what of args.what) {
          if (App.apply_edit(what, item, App.edit_default(what))) {
            App.custom_save(item.id, `custom_${what}`)
          }
        }
      }
    },
    force: args.force,
  })
}

App.remove_all_edits = () => {
  App.show_confirm({
    message: `Remove all edits?`,
    confirm_action: () => {
      for (let key in App.edit_props) {
        App.remove_edits({what: [key], force: true, items: App.get_items(`tabs`)})
      }
    },
  })
}

App.remove_item_edits = (item) => {
  let active = App.get_active_items({mode: item.mode, item: item})

  App.show_confirm({
    message: `Remove edits? (${active.length})`,
    confirm_action: () => {
      for (let key in App.edit_props) {
        App.remove_edits({what: [key], force: true, items: active})
      }
    },
  })
}

App.apply_edit = (what, item, value) => {
  let props = App.edit_props[what]

  if (props.type === `string`) {
    if (typeof value !== `string`) {
      return false
    }
  }
  else if (props.type === `list`) {
    if (!Array.isArray(value)) {
      return false
    }
  }
  else if (props.type === `bool`) {
    if (value !== true && value !== false) {
      return false
    }
  }

  let new_value

  if (App.same_edit(what, item, value, `rule`)) {
    new_value = App.edit_default(what)
  }
  else {
    new_value = value
  }

  if (!App.same_edit(what, item, new_value, `custom`)) {
    item[`custom_${what}`] = new_value
    App.update_item(item.mode, item.id, item)
    return true
  }

  return false
}

App.edit_to_string = (what, item, kind = `custom`) => {
  if (what === `color`) {
    return item[`${kind}_color`]
  }
  else if (what === `title`) {
    return item[`${kind}_title`]
  }
  else if (what === `tags`) {
    return item[`${kind}_tags`].join(` `)
  }
  else if (what === `notes`) {
    return item[`${kind}_notes`]
  }

  return ``
}

App.edit_tab_color = (args = {}) => {
  let def_args = {
    color: ``,
    toggle: false,
  }

  App.def_args(def_args, args)

  if (args.toggle) {
    if (args.item.custom_color) {
      if (args.item.custom_color === args.color) {
        args.color = ``
      }
    }
  }

  let active = App.get_active_items({mode: args.item.mode, item: args.item})

  if (active.length === 1 && !args.color) {
    if (active[0].rule_color && !args.item.custom_color) {
      App.alert_autohide(`This color is set by domain rules`)
      return
    }
  }

  let s = args.color ? `Color ${args.color}?` : `Remove color?`
  let force = App.check_force(`warn_on_edit_tabs`, active)

  App.show_confirm({
    message: `${s} (${active.length})`,
    confirm_action: () => {
      for (let it of active) {
        if (App.apply_edit(`color`, it, args.color)) {
          App.custom_save(it.id, `custom_color`, args.color)
        }
      }
    },
    force: force,
  })
}

App.color_menu_items = (item) => {
  let items = []
  let item_color = App.get_color(item)

  if (item_color) {
    items.push({
      text: `Filter`,
      action: () => {
        App.filter_color(item.mode, item_color)
      }
    })

    App.sep(items)
  }

  for (let color of App.colors) {
    let icon = App.color_icon(color)
    let text = App.capitalize(color)

    items.push({
      icon: icon,
      text: text,
      action: () => {
        App.edit_tab_color({item: item, color: color})
      }
    })
  }

  App.sep(items)

  items.push({
    text: `Remove`,
    action: () => {
      App.edit_tab_color({item: item})
    }
  })

  return items
}

App.show_color_menu = (item, e) => {
  let items = App.color_menu_items(item)
  App.show_context({items: items, e: e})
}

App.get_color_items = (mode) => {
  let items = []
  let count = App.get_active_colors(mode)

  if (count.colors) {
    if (count.colors > 1) {
      items.push({
        icon: App.settings_icons.colors,
        text: `All`,
        action: () => {
          App.filter_color(mode, `all`)
        },
      })
    }

    for (let color of App.colors) {
      if (!count[color]) {
        continue
      }

      let icon = App.color_icon(color)
      let name = App.capitalize(color)

      items.push({
        icon: icon,
        text: name,
        action: () => {
          App.filter_color(mode, color)
        },
      })
    }
  }
  else {
    items.push({
      text: `No colors in use`,
      action: () => {
        App.alert(`You can give tabs a color`)
      },
    })
  }

  return items
}

App.get_active_colors = (mode) => {
  let count = {colors: 0}

  for (let item of App.get_items(mode)) {
    if (App.get_color(item)) {
      if (!count[App.get_color(item)]) {
        count[App.get_color(item)] = 0
      }

      count[App.get_color(item)] += 1
      count.colors += 1
    }
  }

  return count
}

App.remove_color = (color) => {
  let items = []

  for (let item of App.get_items(`tabs`)) {
    if (item.custom_color === color) {
      items.push(item)
    }
  }

  if (!items.length) {
    return
  }

  App.show_confirm({
    message: `Remove ${color}? (${items.length})`,
    confirm_action: () => {
      App.remove_edits({what: [`color`], force: true, items: items})
    },
  })
}

App.close_color = (color) => {
  let items = []

  for (let item of App.get_items(`tabs`)) {
    if (App.get_color(item) === color) {
      items.push(item)
    }
  }

  if (!items.length) {
    return
  }

  App.close_tabs_method(items)
}

App.show_close_color_menu = (e) => {
  let count = App.get_active_colors(`tabs`)
  let items = []

  for (let color of App.colors) {
    if (!count[color]) {
      continue
    }

    let icon = App.color_icon(color)
    let text = App.capitalize(color)

    items.push({
      icon: icon,
      text: text,
      action: () => {
        App.close_color(color)
      },
    })
  }

  if (!items.length) {
    items.push({
      text: `No colors in use`,
      action: () => {},
    })
  }

  App.show_context({items: items, e: e})
}

App.edit_tab_title = (args = {}) => {
  let def_args = {
    title: ``,
  }

  App.def_args(def_args, args)
  let active = App.get_active_items({mode: args.item.mode, item: args.item})
  let s = args.title ? `Edit title?` : `Remove title?`
  let force = App.check_force(`warn_on_edit_tabs`, active)

  App.show_confirm({
    message: `${s} (${active.length})`,
    confirm_action: () => {
      for (let it of active) {
        if (App.apply_edit(`title`, it, args.title)) {
          App.custom_save(it.id, `custom_title`, args.title)
          App.push_to_title_history([args.title])
        }
      }
    },
    force: force,
  })
}

App.edit_title = (item) => {
  App.edit_prompt({what: `title`, item: item})
}

App.push_to_title_history = (titles) => {
  if (!titles.length) {
    return
  }

  for (let title of titles) {
    if (!title) {
      continue
    }

    App.title_history = App.title_history.filter(x => x !== title)
    App.title_history.unshift(title)
    App.title_history = App.title_history.slice(0, App.title_history_max)
  }

  App.stor_save_title_history()
}

App.get_all_titles = (include_rules = true) => {
  let titles = []

  for (let title of App.title_history) {
    if (!titles.includes(title)) {
      titles.push(title)
    }
  }

  for (let item of App.get_items(`tabs`)) {
    if (item.custom_title) {
      if (!titles.includes(item.custom_title)) {
        titles.push(item.custom_title)
      }
    }

    if (include_rules) {
      if (item.rule_title) {
        if (!titles.includes(item.rule_title)) {
          titles.push(item.rule_title)
        }
      }
    }
  }

  return titles
}

App.remove_item_title = (item) => {
  let active = App.get_active_items({mode: item.mode, item: item})

  if (active.length === 1) {
    let it = active[0]

    if (it.rule_title && !it.custom_title) {
      App.alert_autohide(`This title is set by domain rules`)
      return
    }
  }

  App.show_confirm({
    message: `Remove title? (${active.length})`,
    confirm_action: () => {
      App.remove_edits({what: [`title`], force: true, items: active})
    },
  })
}

App.edit_tab_tags = (args = {}) => {
  let def_args = {
    tags: ``,
    add: false,
  }

  App.def_args(def_args, args)
  let active = App.get_active_items({mode: args.item.mode, item: args.item})
  let s = args.tags ? `Edit tags?` : `Remove tags?`
  let tag_list = App.get_taglist(args.tags)
  let force = App.check_force(`warn_on_edit_tabs`, active)

  App.show_confirm({
    message: `${s} (${active.length})`,
    confirm_action: () => {
      for (let it of active) {
        let tags = tag_list
        let new_tags

        if (it.custom_tags.length) {
          new_tags = tags.filter(x => !it.custom_tags.includes(x))

          if (args.add) {
            tags = [...it.custom_tags, ...new_tags]
          }
        }
        else {
          new_tags = tags
        }

        if (it.rule_tags.length) {
          tags = tags.filter(x => !it.rule_tags.includes(x))
        }

        if (App.apply_edit(`tags`, it, tags)) {
          App.custom_save(it.id, `custom_tags`, tags)

          if (new_tags.length) {
            App.push_to_tag_history(new_tags)
          }
        }
      }
    },
    force: force,
  })
}

App.edit_tags = (item) => {
  App.edit_prompt({what: `tags`, item: item})
}

App.get_taglist = (value) => {
  let cleaned = App.taglist(value)
  let unique = []

  for (let tag of cleaned) {
    if (!tag) {
      continue
    }

    if (unique.includes(tag)) {
      continue
    }

    unique.push(tag)
  }

  return unique
}

App.remove_tag = (item, tag) => {
  if (App.check_tag_rule(item, tag)) {
    return
  }

  let tags = item.custom_tags.filter(x => x !== tag)

  if (App.apply_edit(`tags`, item, tags)) {
    App.custom_save(item.id, `custom_tags`, tags)
  }
}

App.wipe_tag = () => {
  let tags =  App.get_all_tags(false)

  App.show_prompt({
    placeholder: `Wipe Tag`,
    suggestions: tags,
    list: tags,
    show_list: true,
    list_submit: true,
    on_submit: (tag) => {
      let items = []

      for (let tab of App.get_items(`tabs`)) {
        if (tab.custom_tags) {
          if (tab.custom_tags.includes(tag)) {
            items.push(tab)
          }
        }
      }

      if (!items.length) {
        return
      }

      App.show_confirm({
        message: `Wipe tag? (${tag}) (${items.length})`,
        confirm_action: () => {
          for (let item of items) {
            App.remove_tag(item, tag)
          }
        },
      })
    },
  })
}

App.close_tag_all = () => {
  App.show_prompt({
    placeholder: `Close Tag`,
    suggestions: App.get_all_tags(),
    list: App.get_all_tags(),
    show_list: true,
    list_submit: true,
    on_submit: (tag) => {
      let items = []

      for (let tab of App.get_items(`tabs`)) {
        if (tab.custom_tags) {
          if (tab.custom_tags.includes(tag)) {
            items.push(tab)
            continue
          }
        }

        if (tab.rule_tags) {
          if (tab.rule_tags.includes(tag)) {
            items.push(tab)
            continue
          }
        }
      }

      if (!items.length) {
        return
      }

      App.close_tabs_method(items)
    },
  })
}

App.get_all_tags = (include_rules = true) => {
  let tags = []

  for (let tag of App.tag_history) {
    if (!tags.includes(tag)) {
      tags.push(tag)
    }
  }

  for (let item of App.get_items(`tabs`)) {
    for (let tag of item.custom_tags) {
      if (!tags.includes(tag)) {
        tags.push(tag)
      }
    }

    if (include_rules) {
      for (let tag of item.rule_tags) {
        if (!tags.includes(tag)) {
          tags.push(tag)
        }
      }
    }
  }

  return tags.slice(0, App.max_tag_picks)
}

App.add_tags = (item) => {
  App.edit_prompt({what: `tags`, item: item, add: true})
}

App.remove_item_tags = (item) => {
  let active = App.get_active_items({mode: item.mode, item: item})

  App.show_confirm({
    message: `Remove tags?`,
    confirm_action: () => {
      App.remove_edits({what: [`tags`], force: true, items: active})
    },
  })
}

App.replace_tag = () => {
  let tags = App.get_all_tags(false)

  App.show_prompt({
    suggestions: tags,
    placeholder: `Original Tag`,
    list: tags,
    show_list: true,
    list_submit: true,
    on_submit: (tag_1) => {
      App.show_prompt({
        suggestions: tags,
        placeholder: `New Tag`,
        list: tags,
        list_submit: true,
        on_submit: (tag_2) => {
          App.do_replace_tag(tag_1, tag_2)
        },
      })
    },
  })
}

App.do_replace_tag = (tag_1, tag_2) => {
  if (App.check_tag_edit(tag_1, tag_2)) {
    return
  }

  for (let item of App.get_items(`tabs`)) {
    if (item.custom_tags.includes(tag_1)) {
      let tags = item.custom_tags.map(x => x === tag_1 ? tag_2 : x)

      if (App.apply_edit(`tags`, item, tags)) {
        App.custom_save(item.id, `custom_tags`, tags)
        App.push_to_tag_history([tag_2])
      }
    }
  }
}

App.check_tag_rule = (item, tag) => {
  if (item.rule_tags.includes(tag)) {
    App.alert_autohide(`This tag is set by domain rules`)
    return true
  }

  return false
}

App.edit_tag = (item, tag) => {
  if (App.check_tag_rule(item, tag)) {
    return
  }

  let tags = App.get_all_tags()

  App.show_prompt({
    suggestions: tags,
    placeholder: `Edit Tag`,
    value: tag,
    list: tags,
    show_list: true,
    list_submit: true,
    highlight: true,
    on_submit: (ans) => {
      App.do_edit_tag(item, tag, ans)
    },
  })
}

App.do_edit_tag = (item, tag_1, tag_2) => {
  if (App.check_tag_edit(tag_1, tag_2)) {
    return
  }

  let tags = item.custom_tags.filter(x => x !== tag_1)
  tags.push(tag_2)

  if (App.apply_edit(`tags`, item, tags)) {
    App.custom_save(item.id, `custom_tags`, tags)
    App.push_to_tag_history([tag_2])
  }
}

App.check_tag_edit = (tag_1, tag_2) => {
  if (!tag_1 || !tag_2) {
    return true
  }

  if (tag_1 === tag_2) {
    return true
  }

  if (tag_1.includes(` `) || tag_2.includes(` `)) {
    return true
  }

  return false
}

App.push_to_tag_history = (tags) => {
  if (!tags.length) {
    return
  }

  for (let tag of tags) {
    if (!tag) {
      continue
    }

    App.tag_history = App.tag_history.filter(x => x !== tag)
    App.tag_history.unshift(tag)
    App.tag_history = App.tag_history.slice(0, App.tag_history_max)
  }

  App.stor_save_tag_history()
}

App.filter_tag_pick = (item, e) => {
  if (!App.tagged(item)) {
    return
  }

  let items = []

  for (let tag of App.get_tags(item)) {
    items.push({
      text: tag,
      action: () => {
        App.filter_tag(item.mode, tag)
      },
    })
  }

  App.show_context({items: items, e: e})
}

App.show_filter_tag_menu = (mode, e) => {
  let items = App.get_tag_items(mode)
  App.show_context({items: items, e: e})
}

App.get_tag_items = (mode) => {
  function fav_sort(a, b) {
    let ai = App.tag_history.indexOf(a)
    let bi = App.tag_history.indexOf(b)
    if (ai === -1) ai = App.tag_history.length
    if (bi === -1) bi = App.tag_history.length
    return ai - bi
  }

  let items = []
  let tags = []

  for (let tab of App.get_items(`tabs`)) {
    for (let tag of App.get_tags(tab)) {
      if (!tags.includes(tag)) {
        tags.push(tag)
      }
    }
  }

  if (tags.length) {
    tags.sort(fav_sort)

    for (let tag of tags.slice(0, App.max_tag_picks)) {
      items.push({
        text: tag,
        action: () => {
          App.filter_tag(mode, tag)
        },
      })
    }
  }
  else {
    items.push({
      text: `No tags in use`,
      action: () => {
        App.alert(`You can add tags to tabs`)
      },
    })
  }

  return items
}

App.tagged = (item) => {
  return Boolean((item.custom_tags.length) || item.rule_tags.length)
}

App.edit_notes = (item) => {
  App.show_input({
    message: `Notes`,
    button: `Save`,
    action: (text) => {
      let notes = App.single_linebreak(text)

      if (item.rule_notes) {
        if (item.rule_notes === notes) {
          return
        }
      }

      if (App.apply_edit(`notes`, item, notes)) {
        App.custom_save(item.id, `custom_notes`, notes)
      }

      return true
    },
    value: App.get_notes(item),
    autosave: true,
    bottom: true,
    wrap: true,
    readonly: item.mode !== `tabs`,
  })
}

App.remove_item_notes = (item, single = false) => {
  let active

  if (single) {
    active = [item]
  }
  else {
    active = App.get_active_items({mode: item.mode, item: item})
  }

  if (active.length === 1) {
    let it = active[0]

    if (it.rule_notes && !it.custom_notes) {
      App.alert_autohide(`These notes are set by domain rules`)
      return
    }
  }

  App.show_confirm({
    message: `Remove notes? (${active.length})`,
    confirm_action: () => {
      App.remove_edits({what: [`notes`], force: true, items: active})
    },
  })
}

App.remove_notes = (item) => {
  App.remove_item_notes(item, true)
}

App.edit_tab_split = (args = {}) => {
  let def_args = {
    which: `top`,
  }

  App.def_args(def_args, args)
  let active = App.get_active_items({mode: args.item.mode, item: args.item})
  let force = App.check_force(`warn_on_edit_tabs`, active)

  if (args.which === `top` || args.which === `bottom`) {
    let other = args.which === `top` ? `bottom` : `top`

    App.show_confirm({
      message: `Add splits (${active.length})`,
      confirm_action: () => {
        for (let it of active) {
          if (App.apply_edit(`split_${args.which}`, it, true)) {
            App.custom_save(it.id, `custom_split_${args.which}`, true)
          }

          if (App.apply_edit(`split_${other}`, it, false)) {
            App.custom_save(it.id, `custom_split_${other}`, false)
          }
        }
      },
      force: force,
    })
  }
  else if (args.which === `auto`) {
    if (active.length < 2) {
      return
    }

    let it = active.at(0)

    if (App.apply_edit(`split_top`, it, true)) {
      App.custom_save(it.id, `custom_split_top`, true)
    }

    it = active.at(-1)

    if (App.apply_edit(`split_bottom`, it, true)) {
      App.custom_save(it.id, `custom_split_bottom`, true)
    }

    for (let it of active.slice(1, -1)) {
      if (App.apply_edit(`split_top`, it, false)) {
        App.custom_save(it.id, `custom_split_top`, false)
      }

      if (App.apply_edit(`split_bottom`, it, false)) {
        App.custom_save(it.id, `custom_split_bottom`, false)
      }
    }
  }
}

App.remove_all_splits = () => {
  App.remove_edits({what: [`split_top`, `split_bottom`], force: true})
}