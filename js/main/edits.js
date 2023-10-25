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

  if (args.what === `tags`) {
    suggestions = App.get_all_tags()
  }

  let placeholder

  if (args.add) {
    placeholder = `Add ${name}`
  }
  else {
    placeholder = `Edit ${name}`
  }

  App.show_prompt({value: value, placeholder: placeholder,
  suggestions: suggestions, on_submit: (ans) => {
    let obj = {}
    obj[args.what] = ans
    obj.item = args.item
    obj.add = args.add
    App[`edit_tab_${args.what}`](obj)
  }})
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
    message: `Remove all edits? (${args.what}) (${args.items.length})`,
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
  let items = []

  for (let it of active) {
    if (App.tab_is_edited(it)) {
      items.push(it)
    }
  }

  if (!items.length) {
    return
  }

  App.show_confirm({
    message: `Remove edits? (${items.length})`,
    confirm_action: () => {
      for (let key in App.edit_props) {
        App.remove_edits({what: key, force: true, items: items})
      }
    },
  })
}

App.apply_edit = (what, item, value) => {
  if (value === undefined) {
    if (item[`custom_${what}`] === undefined) {
      return
    }

    item[`custom_${what}`] = undefined
  }
  else {
    item[`custom_${what}`] = value
  }

  if (what === `tags`) {
    if (App.get_setting(`sort_tags`)) {
      item.custom_tags.sort()
    }
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
  App.show_center_context(items, e)
}

App.get_color_items = (mode) => {
  let items = []
  let count = App.get_active_colors(mode)

  if (!count.colors) {
    items.push({
      text: `No colors in use`,
      action: () => {
        App.alert(`You can give tabs a color`)
      },
    })
  }
  else {
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

  return items
}

App.get_active_colors = (mode) => {
  let count = {colors: 0}

  for (let item of App.get_items(mode)) {
    if (item.custom_color) {
      if (!count[item.custom_color]) {
        count[item.custom_color] = 0
      }

      count[item.custom_color] += 1
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
    if (item.custom_color === color) {
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

  App.show_center_context(items, e)
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
      }
    },
    force: force,
  })
}

App.edit_title = (item) => {
  App.edit_prompt({what: `title`, item: item})
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

        if (args.add) {
          if (it.custom_tags) {
            let new_tags = tag_list.filter(x => !it.custom_tags.includes(x))
            tags = [...it.custom_tags, ...new_tags]
          }
        }

        App.apply_edit(`tags`, it, tags)
        App.custom_save(it.id, `custom_tags`, tags)
      }
    },
    force: force,
  })
}

App.edit_tags = (item) => {
  App.edit_prompt({what: `tags`, item: item})
}

App.get_taglist = (value) => {
  let cleaned = value.split(/[, ]+/).map(x => x.trim())
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
  App.show_prompt({placeholder: `Remove Tag`,
  suggestions: App.get_all_tags(), on_submit: (tag) => {
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
  }})
}

App.close_tag_all = () => {
  App.show_prompt({placeholder: `Close Tag`,
  suggestions: App.get_all_tags(), on_submit: (tag) => {
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

    App.close_tabs_method(items)
  }})
}

App.get_all_tags = () => {
  let tags = []

  for (let item of App.get_items(`tabs`)) {
    if (item.custom_tags) {
      for (let tag of item.custom_tags) {
        if (!tags.includes(tag)) {
          tags.push(tag)
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