App.check_tab_session = async (items = []) => {
  if (!items.length) {
    items = App.get_items(`tabs`)
  }

  for (let item of items) {
    let custom_color = await browser.sessions.getTabValue(item.id, `custom_color`)
    App.apply_tab_color(item, custom_color || ``)

    let custom_title = await browser.sessions.getTabValue(item.id, `custom_title`)
    App.apply_tab_title(item, custom_title || ``)

    let custom_tags = await browser.sessions.getTabValue(item.id, `custom_tags`)
    App.apply_tab_tags(item, custom_tags || ``)
  }
}

App.tab_is_edited = (item) => {
  return Boolean(item.custom_color || item.custom_title)
}

App.custom_save = (id, name, value) => {
  browser.sessions.setTabValue(id, name, value)
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
  let s = args.color ? `Color ${args.color}?` : `Remove color?`
  let to_change = []

  for (let it of active) {
    if (it.custom_color !== args.color) {
      to_change.push(it)
    }
  }

  if (!to_change.length) {
    return
  }

  let force = App.check_force(`warn_on_edit_tabs`, to_change)

  App.show_confirm(`${s} (${to_change.length})`, () => {
    for (let it of to_change) {
      App.apply_tab_color(it, args.color)
      App.custom_save(it.id, `custom_color`, args.color)
    }
  }, undefined, force)
}

App.apply_tab_color = (item, color = ``) => {
  if (item.custom_color === color) {
    return
  }

  item.custom_color = color
  App.update_item(item.mode, item.id, item)
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

App.remove_all_colors = () => {
  let items = []

  for (let item of App.get_items(`tabs`)) {
    if (item.custom_color) {
      items.push(item)
    }
  }

  if (!items.length) {
    return
  }

  App.show_confirm(`Remove all colors? (${items.length})`, () => {
    for (let item of items) {
      let color = ``
      App.apply_tab_color(item, color)
      App.custom_save(item.id, `custom_color`, color)
    }
  })
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

  App.show_confirm(`Remove ${color}? (${items.length})`, () => {
    for (let item of items) {
      let color = ``
      App.apply_tab_color(item, color)
      App.custom_save(item.id, `custom_color`, color)
    }
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
  let to_change = []

  for (let it of active) {
    if (it.custom_title !== args.title) {
      to_change.push(it)
    }
  }

  if (!to_change.length) {
    return
  }

  let force = App.check_force(`warn_on_edit_tabs`, to_change)

  App.show_confirm(`${s} (${to_change.length})`, () => {
    for (let it of to_change) {
      App.apply_tab_title(it, args.title)
      App.custom_save(it.id, `custom_title`, args.title)
    }
  }, undefined, force)
}

App.apply_tab_title = (item, title = ``) => {
  if (item.custom_title === title) {
    return
  }

  item.custom_title = title
  App.update_item(item.mode, item.id, item)
}

App.prompt_tab_title = (item) => {
  let active = App.get_active_items({mode: item.mode, item: item})
  let value = item.custom_title || ``

  if (value) {
    for (let it of active) {
      if (it === item) {
        continue
      }

      if (it.custom_title !== value) {
        value = ``
        break
      }
    }
  }

  App.show_prompt(value, `Edit Title`, (title) => {
    App.edit_tab_title({item: item, title: title})
  })
}

App.remove_all_titles = () => {
  let items = []

  for (let item of App.get_items(`tabs`)) {
    if (item.custom_title) {
      items.push(item)
    }
  }

  if (!items.length) {
    return
  }

  App.show_confirm(`Remove all titles? (${items.length})`, () => {
    for (let item of items) {
      let title = ``
      App.apply_tab_title(item, title)
      App.custom_save(item.id, `custom_title`, title)
    }
  })
}

App.remove_all_edits = () => {
  let items = []

  for (let item of App.get_items(`tabs`)) {
    if (item.custom_color || item.custom_title) {
      items.push(item)
    }
  }

  if (!items.length) {
    return
  }

  App.show_confirm(`Remove all edits? (${items.length})`, () => {
    for (let item of items) {
      let title = ``
      App.apply_tab_title(item, title)
      App.custom_save(item.id, `custom_title`, title)
      let color = ``
      App.apply_tab_color(item, color)
      App.custom_save(item.id, `custom_color`, color)
    }
  })
}

App.edit_tab_tags = (args = {}) => {
  let def_args = {
    tags: ``,
  }

  App.def_args(def_args, args)
  let active = App.get_active_items({mode: args.item.mode, item: args.item})
  let s = args.tags ? `Edit tags?` : `Remove tags?`
  let to_change = []

  for (let it of active) {
    if (it.custom_tags !== args.tags) {
      to_change.push(it)
    }
  }

  if (!to_change.length) {
    return
  }

  let force = App.check_force(`warn_on_edit_tabs`, to_change)

  App.show_confirm(`${s} (${to_change.length})`, () => {
    for (let it of to_change) {
      App.apply_tab_tags(it, args.tags)
      App.custom_save(it.id, `custom_tags`, args.tags)
    }
  }, undefined, force)
}

App.apply_tab_tags = (item, tags = ``) => {
  if (item.custom_tags === tags) {
    return
  }

  item.tag_list = App.get_taglist(tags)
  item.custom_tags = item.tag_list.join(` `)
  App.update_item(item.mode, item.id, item)
}

App.prompt_tab_tags = (item) => {
  let active = App.get_active_items({mode: item.mode, item: item})
  let value = item.custom_tags || ``

  if (value) {
    for (let it of active) {
      if (it === item) {
        continue
      }

      if (it.custom_tags !== value) {
        value = ``
        break
      }
    }
  }

  App.show_prompt(value, `Edit Tags`, (tags) => {
    App.edit_tab_tags({item: item, tags: tags})
  })
}

App.get_taglist = (tags) => {
  return tags.split(/[, ]+/).map(x => x.trim())
}