App.edit_props = {
  color: {
    type: `string`,
  },
  title: {
    type: `string`,
  },
  tags: {
    type: `list`,
  },
  notes: {
    type: `string`,
  },
  split_top: {
    type: `bool`,
  },
  split_bottom: {
    type: `bool`,
  },
  icon: {
    type: `string`,
  },
  root: {
    type: `string`,
  },
}

App.get_edit_prop_list = () => {
  return Object.keys(App.edit_props)
}

App.get_text_edit_props = () => {
  return App.get_edit_prop_list().filter((key) => {
    return App.edit_props[key].type === `string`
  })
}

App.get_list_edit_props = () => {
  return App.get_edit_prop_list().filter((key) => {
    return App.edit_props[key].type === `list`
  })
}

App.get_bool_edit_props = () => {
  return App.get_edit_prop_list().filter((key) => {
    return App.edit_props[key].type === `bool`
  })
}

App.check_tab_session = async (items = [], force = false) => {
  if (!items.length) {
    items = App.get_items(`tabs`)
  }

  for (let item of items) {
    for (let key in App.edit_props) {
      let value = await browser.sessions.getTabValue(item.id, `custom_${key}`)

      if (value === undefined) {
        if (!force) {
          continue
        }
      }

      App.apply_edit({what: key, item, value})
    }
  }

  if (!App.tab_session_first) {
    App.tab_session_first = true

    if (App.active_mode === `tabs`) {
      App.scroll_to_item({item: App.get_selected(`tabs`), force: true})
      App.update_tab_box()
    }
  }
}

App.custom_save = async (id, what, value) => {
  if (Array.isArray(value)) {
    if (!value.length) {
      value = undefined
    }
  }

  let name = `custom_${what}`

  if (value) {
    browser.sessions.setTabValue(id, name, value)
  }
  else {
    browser.sessions.removeTabValue(id, name)
  }

  try {
    await browser.runtime.sendMessage({action: `mirror_edits`, id})
  }
  catch (err) {
    // Do nothing
  }
}

App.edited = (item, include_ruled = true) => {
  let edited = false

  for (let key in App.edit_props) {
    if (item[`custom_${key}`] !== undefined) {
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
  if (value === undefined) {
    return false
  }

  let props = App.edit_props[what]
  let ovalue = item[`${type}_${what}`]

  if (ovalue === undefined) {
    return false
  }

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
  return App.edit_is_default_check(what, item[`${kind}_${what}`])
}

App.edit_is_default_check = (what, value) => {
  return App.str(App.edit_default(what)) === App.str(value)
}

App.edit_prompt = (args = {}) => {
  let active = App.get_active_items({mode: args.item.mode, item: args.item})
  let value = ``

  if ((active.length === 1) && args.value) {
    value = args.value
  }
  else if (!args.add) {
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
  let single_word = false
  let suggestions = []
  let tags, titles, icons, roots

  if (args.what === `tags`) {
    tags = App.get_all_tags()
    suggestions = tags
  }
  else if (args.what === `title`) {
    titles = App.get_all_titles()
    suggestions = titles
  }
  else if (args.what === `icon`) {
    icons = App.get_all_icons()
    suggestions = icons
    single_word = true
  }
  else if (args.what === `root`) {
    roots = App.get_all_roots()
    suggestions = roots
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
  else if (args.what === `icon`) {
    list = icons
  }
  else if (args.what === `root`) {
    list = roots
  }

  let list_submit

  if ((args.what === `tags`) && App.get_setting(`auto_tag_picker`)) {
    list_submit = true
  }
  else if (args.what === `title` || args.what === `icon`) {
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
      ignore_words = App.tags(args.item)

      if (App.get_setting(`auto_tag_picker`)) {
        show_list = true
      }
    }

    append = true
    unique_words = true
  }

  if (args.what === `icon`) {
    if (App.get_setting(`auto_icon_picker`)) {
      show_list = true
    }
  }

  App.show_prompt({
    value,
    placeholder,
    suggestions,
    list,
    show_list,
    list_submit,
    word_mode,
    unique_words,
    ignore_words,
    append,
    fill: args.fill,
    on_submit: (ans) => {
      if (single_word) {
        if (ans.includes(` `)) {
          return
        }
      }

      if (args.url) {
        if (ans) {
          ans = App.fix_url(ans)
        }
      }

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
    text: `edits`,
    force_ask: false,
  }

  App.def_args(def_args, args)

  if (!args.items.length) {
    for (let item of App.get_items(`tabs`)) {
      if (item.header) {
        continue
      }

      for (let what of args.what) {
        if (what === `tags`) {
          if (App.get_tags(item, false).length) {
            args.items.push(item)
            break
          }
        }
        else if (App.get_edit(item, what, false)) {
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
    args.force = App.check_warn(`warn_on_edit_tabs`, args.items)
  }

  if (args.force_ask) {
    args.force = false
  }

  App.show_confirm({
    message: `Remove ${args.text}? (${args.items.length})`,
    confirm_action: () => {
      for (let item of args.items) {
        for (let what of args.what) {
          App.apply_edit({what, item, value: undefined, on_change: (value) => {
            App.custom_save(item.id, what)
          }})
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
  let active = App.get_active_items({mode: item.mode, item})

  App.show_confirm({
    message: `Remove edits? (${active.length})`,
    confirm_action: () => {
      for (let key in App.edit_props) {
        App.remove_edits({what: [key], force: true, items: active})
      }
    },
  })
}

App.apply_edit = (args = {}) => {
  if (App.edit_is_default_check(args.what, args.value)) {
    args.value = undefined
  }

  if (args.value !== undefined) {
    let props = App.edit_props[args.what]

    if (props.type === `string`) {
      if (typeof args.value !== `string`) {
        return
      }
    }
    else if (props.type === `list`) {
      if (!Array.isArray(args.value)) {
        return
      }
    }
    else if (props.type === `bool`) {
      if (args.value !== true && args.value !== false) {
        return
      }
    }
  }

  let new_value

  if (App.same_edit(args.what, args.item, args.value, `rule`)) {
    new_value = undefined
  }
  else {
    new_value = args.value
  }

  if (!App.same_edit(args.what, args.item, new_value, `custom`)) {
    args.item[`custom_${args.what}`] = new_value
    App.update_item({mode: args.item.mode, id: args.item.id, info: args.item})

    if (args.on_change) {
      args.on_change(new_value)
    }

    App.update_tab_box()
  }
}

App.edit_to_string = (what, item, kind = `custom`) => {
  let props = App.edit_props[what]

  if (props.type === `string`) {
    return item[`${kind}_${what}`]
  }
  else if (props.type === `list`) {
    return item[`${kind}_${what}`].join(` `)
  }

  return ``
}

App.fill_custom_props = (obj, item) => {
  for (let key in App.edit_props) {
    let name = `custom_${key}`
    let value = item[name]

    if (value === undefined) {
      continue
    }

    let ok = true

    if (App.get_text_edit_props().includes(key)) {
      if (!value) {
        ok = false
      }
    }
    else if (App.get_list_edit_props().includes(key)) {
      if (!value.length) {
        ok = false
      }
    }
    else if (App.get_bool_edit_props().includes(key)) {
      if (!value) {
        ok = false
      }
    }

    if (ok) {
      obj[name] = value
    }
  }
}

App.show_edits_info = (item) => {
  let content = []
  let infos = []

  function action(key, what) {
    let props = App.edit_props[key]
    let name = App.capitalize(key)
    let value = item[`${what}_${key}`]

    if (value !== undefined) {
      if (props.type === `list`) {
        value = value.join(`, `)
      }

      value = App.no_linebreaks(value).substring(0, 50).trim()
      infos.push(`${name}: ${value}`)
    }
  }

  function add(text, title) {
    if (text) {
      let sep = `------`
      content.push(`${title}\n${sep}\n${text}`)
    }
  }

  for (let key in App.edit_props) {
    action(key, `custom`)
  }

  let text = infos.join(`\n`)
  add(text, `Custom`)
  infos = []

  for (let key in App.edit_props) {
    action(key, `rule`)
  }

  text = infos.join(`\n`)
  add(text, `Rules`)

  App.show_textarea({
    title: `Edits Info`,
    title_icon: App.get_setting(`edited_icon`),
    text: content.join(`\n\n`),
  })
}