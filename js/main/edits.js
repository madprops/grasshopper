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
}

App.check_tab_session = async (items = []) => {
  if (!items.length) {
    items = App.get_items(`tabs`)
  }

  for (let item of items) {
    let custom_color = await browser.sessions.getTabValue(item.id, `custom_color`)
    App.apply_edit(`color`, item, custom_color)

    let custom_title = await browser.sessions.getTabValue(item.id, `custom_title`)
    App.apply_edit(`title`, item, custom_title)

    let custom_tags = await browser.sessions.getTabValue(item.id, `custom_tags`)
    App.apply_edit(`tags`, item, custom_tags)
  }
}

App.tab_is_edited = (item) => {
  return Boolean(item.custom_color || item.custom_title || item.custom_tags)
}

App.custom_save = (id, name, value) => {
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
      if (App.tab_has_tags(args.item)) {
        ignore_words = args.item.custom_tags
      }

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
    list_submit: list_submit,
    word_mode: word_mode,
    unique_words: unique_words,
    ignore_words: ignore_words,
    append: append,
    show_list: show_list,
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
      if (item[`custom_${args.what}`]) {
        args.items.push(item)
      }
    }
  }

  if (!args.items.length) {
    return
  }

  App.show_confirm({
    message: `Remove edits? (${args.what}) (${args.items.length})`,
    confirm_action: () => {
      for (let item of args.items) {
        App.apply_edit(args.what, item, undefined)
        App.custom_save(item.id, `custom_${args.what}`, undefined)
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
        App.remove_edits({what: key, force: true, items: App.get_items(`tabs`)})
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
        App.remove_edits({what: key, force: true, items: active})
      }
    },
  })
}

App.apply_edit = (what, item, value) => {
  if (what === `tags` && value) {
    if (!value.length) {
      if (item[`custom_${what}`] === undefined) {
        return
      }
    }

    value = Array.from(new Set(value))

    if (App.get_setting(`sort_tags`)) {
      value.sort()
    }
  }

  if (Array.isArray(value)) {
    if (!value.length) {
      value = undefined
    }
  }

  if (value === undefined) {
    if (item[`custom_${what}`] === undefined) {
      return
    }

    item[`custom_${what}`] = undefined
  }
  else {
    item[`custom_${what}`] = value
  }

  App.update_item(item.mode, item.id, item)
}

App.edit_to_string = (what, item) => {
  if (what === `color`) {
    if (item.custom_color) {
      return item.custom_color
    }
  }
  else if (what === `title`) {
    if (item.custom_title) {
      return item.custom_title
    }
  }
  else if (what === `tags`) {
    if (item.custom_tags) {
      return item.custom_tags.join(` `)
    }
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
        args.color = undefined
      }
    }
  }

  let active = App.get_active_items({mode: args.item.mode, item: args.item})
  let s = args.color ? `Color ${args.color}?` : `Remove color?`
  let force = App.check_force(`warn_on_edit_tabs`, active)

  App.show_confirm({
    message: `${s} (${active.length})`,
    confirm_action: () => {
      for (let it of active) {
        App.apply_edit(`color`, it, args.color)
        App.custom_save(it.id, `custom_color`, args.color)
      }
    },
    force: force,
  })
}

App.color_menu_items = (item) => {
  let items = []

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
      App.remove_edits({what: `color`, force: true, items: items})
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
        App.apply_edit(`title`, it, args.title)
        App.custom_save(it.id, `custom_title`, args.title)
        App.push_to_title_history([args.title])
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

        if (it.custom_tags) {
          new_tags = tags.filter(x => !it.custom_tags.includes(x))

          if (args.add) {
            tags = [...it.custom_tags, ...new_tags]
          }
        }
        else {
          new_tags = tags
        }

        App.apply_edit(`tags`, it, tags)
        App.custom_save(it.id, `custom_tags`, tags)

        if (new_tags.length) {
          App.push_to_tag_history(new_tags)
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
  item.custom_tags = item.custom_tags.filter(x => x !== tag)
  App.apply_edit(`tags`, item, item.custom_tags)
  App.custom_save(item.id, `custom_tags`, item.custom_tags)
}

App.remove_tag_all = () => {
  let tags =  App.get_all_tags(false)

  App.show_prompt({
    placeholder: `Remove Tag`,
    suggestions: tags,
    list: tags,
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
        message: `Remove tag? (${tag}) (${items.length})`,
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
    if (item.custom_tags) {
      for (let tag of item.custom_tags) {
        if (!tags.includes(tag)) {
          tags.push(tag)
        }
      }
    }

    if (include_rules) {
      if (item.rule_tags) {
        for (let tag of item.rule_tags) {
          if (!tags.includes(tag)) {
            tags.push(tag)
          }
        }
      }
    }
  }

  return tags
}

App.add_tags = (item) => {
  App.edit_prompt({what: `tags`, item: item, add: true})
}

App.remove_item_tags = (item) => {
  App.show_confirm({
    message: `Remove all tags?`,
    confirm_action: () => {
      App.remove_edits({what: `tags`, force: true, items: [item]})
    },
  })
}

App.replace_tag = () => {
  let tags = App.get_all_tags(false)

  App.show_prompt({
    suggestions: tags,
    placeholder: `Original Tag`,
    list: tags,
    on_submit: (tag_1) => {
      App.show_prompt({
        suggestions: tags,
        placeholder: `New Tag`,
        list: tags,
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
    if (item.custom_tags) {
      if (item.custom_tags.includes(tag_1)) {
        item.custom_tags = item.custom_tags.map(x => x === tag_1 ? tag_2 : x)
        App.apply_edit(`tags`, item, item.custom_tags)
        App.custom_save(item.id, `custom_tags`, item.custom_tags)
        App.push_to_tag_history([tag_2])
      }
    }
  }
}

App.edit_tag = (item, tag) => {
  if (!item.custom_tags || !item.custom_tags.length) {
    if (item.rule_tags) {
      App.alert(`These are set by domain rules`)
    }

    return
  }

  let tags = App.get_all_tags()

  App.show_prompt({
    suggestions: tags,
    placeholder: `Edit Tag`,
    value: tag,
    list: tags,
    list_submit: true,
    show_list: true,
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

  item.custom_tags = item.custom_tags.filter(x => x !== tag_1)
  item.custom_tags.push(tag_2)
  App.apply_edit(`tags`, item, item.custom_tags)
  App.custom_save(item.id, `custom_tags`, item.custom_tags)
  App.push_to_tag_history([tag_2])
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
  if (!App.tab_has_tags(item)) {
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

App.get_tag_items = (mode) => {
  let items = []
  let tags = []

  for (let tab of App.get_items(`tabs`)) {
    if (App.tab_has_tags(tab)) {
      for (let tag of App.get_tags(tab)) {
        if (!tags.includes(tag)) {
          tags.push(tag)
        }
      }
    }
  }

  if (tags.length) {
    for (let tag of tags) {
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

App.tab_has_tags = (item) => {
  return Boolean((item.custom_tags && item.custom_tags.length) ||
  item.rule_tags && item.rule_tags.length)
}