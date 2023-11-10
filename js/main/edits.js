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
    rule: true,
  },
  split_bottom: {
    type: `bool`,
    rule: true,
  },
  split_title: {
    type: `string`,
    rule: true,
  },
  icon: {
    type: `string`,
    rule: true,
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
    let had_edits = false

    for (let key in App.edit_props) {
      let value = await browser.sessions.getTabValue(item.id, `custom_${key}`)

      if (value === undefined) {
        continue
      }

      if (key.includes(`split`)) {
        has_split = true
      }

      had_edits = true
      App.apply_edit(key, item, value)
    }

    if (!had_edits) {
      if (item.blank) {
        App.start_blank(item)
      }
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
  let tags, titles, icons

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

  let list_submit

  if (args.what === `title` || args.what === `tags` || args.what === `icon`) {
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