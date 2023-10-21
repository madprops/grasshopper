App.check_tab_session = async () => {
  for (let item of App.get_items(`tabs`)) {
    let custom_color = await browser.sessions.getTabValue(item.id, `custom_color`)
    App.apply_tab_color(item, custom_color || ``)

    let custom_title = await browser.sessions.getTabValue(item.id, `custom_title`)
    App.apply_tab_title(item, custom_title || ``)
  }
}

App.tab_is_edited = (item) => {
  return Boolean(item.custom_color || item.custom_title)
}

App.custom_save = (id, name, value) => {
  browser.sessions.setTabValue(id, name, value)
}

App.edit_tab_color = (item, color = ``) => {
  if (item.custom_color) {
    if (item.custom_color === color) {
      color = ``
    }
  }

  let active = App.get_active_items(item.mode, item)
  let s = color ? `Color ${color}?` : `Remove color?`
  let force = App.check_force(`warn_on_edit_tabs`, active)

  App.show_confirm(`${s} (${active.length})`, () => {
    for (let it of active) {
      App.apply_tab_color(it, color)
      App.custom_save(it.id, `custom_color`, color)
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
        App.edit_tab_color(item, color)
      }
    })
  }

  App.sep(items)

  items.push({
    text: `Remove`,
    action: () => {
      App.edit_tab_color(item)
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

  items.push({
    icon: App.settings_icons.colors,
    text: `All`,
    action: () => {
      App.filter_color(mode, `all`)
    },
  })

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

  App.show_confirm(`Remove all colors?`, () => {
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

App.edit_tab_title = (item, title = ``) => {
  let active = App.get_active_items(item.mode, item)
  let s = title ? `Edit title?` : `Remove title?`
  let force = App.check_force(`warn_on_edit_tabs`, active)

  App.show_confirm(`${s} (${active.length})`, () => {
    for (let it of active) {
      App.apply_tab_title(it, title)
      App.custom_save(it.id, `custom_title`, title)
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
  App.show_prompt(item.custom_title, `Edit Title`, (title) => {
    App.edit_tab_title(item, title)
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

  App.show_confirm(`Remove all titles?`, () => {
    for (let item of items) {
      let title = ``
      App.apply_tab_title(item, title)
      App.custom_save(item.id, `custom_title`, title)
    }
  })
}