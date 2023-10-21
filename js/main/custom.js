App.check_tab_sessions = async () => {
  for (let item of App.get_items(`tabs`)) {
    let custom_color = await browser.sessions.getTabValue(item.id, `custom_color`)

    if (custom_color) {
      App.edit_tab_color(item, custom_color)
    }

    let custom_title = await browser.sessions.getTabValue(item.id, `custom_title`)

    if (custom_title) {
      App.edit_tab_title(item, custom_title)
    }
  }
}

App.edit_tab_color = (item, color = ``, save = true) => {
  let active = App.get_active_items(item.mode, item)

  for (let it of active) {
    it.custom_color = color
    App.update_item(it.mode, it.id, it)

    if (save) {
      browser.sessions.setTabValue(it.id, `custom_color`, color)
    }
  }
}

App.toggle_tab_color = (item, color) => {
  let value

  if (item.custom_color !== color) {
    value = color
  }

  App.edit_tab_color(item, value)
}

App.edit_tab_title = (item, title = ``, save = true) => {
  let active = App.get_active_items(item.mode, item)

  for (let it of active) {
    it.custom_title = title
    App.update_item(it.mode, it.id, it)

    if (save) {
      browser.sessions.setTabValue(it.id, `custom_title`, title)
    }
  }
}

App.prompt_tab_title = (item) => {
  App.show_prompt(item.custom_title, `Edit Title`, (title) => {
    App.edit_tab_title(item, title)
  })
}

App.color_menu_items = (item) => {
  let items = []

  for (let color of App.colors) {
    let icon = App.color_icon(color)
    let text = `Color ${App.capitalize(color)}`

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
    text: `Remove Color`,
    action: () => {
      App.edit_tab_color(item)
    }
  })

  return items
}

App.tab_is_edited = (item) => {
  return Boolean(item.custom_color || item.custom_title)
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
      App.edit_tab_color(item)
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
      App.edit_tab_color(item)
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
      App.edit_tab_title(item)
    }
  })
}