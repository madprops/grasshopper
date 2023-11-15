App.check_tab_colors = (item) => {
  if (item.mode !== `tabs`) {
    return
  }

  function text_enabled (type) {
    return App.get_setting(`text_color_${type}_enabled`)
  }

  function background_enabled (type) {
    return App.get_setting(`background_color_${type}_enabled`)
  }

  function enabled (type) {
    return text_enabled(type) || background_enabled(type)
  }

  function proc (type) {
    if (text_enabled(type)) {
      item.element.style.color = App.get_setting(`text_color_${type}`)
    }

    if (background_enabled(type)) {
      item.element.style.backgroundColor = App.get_setting(`background_color_${type}`)
    }
  }

  item.element.style.color = ``
  item.element.style.backgroundColor = ``

  if (item.header) {
    if (enabled(`header`)) {
      proc(`header`)
    }

    return
  }

  if (false) {
    // Top = Higher Priority
  }
  else if (item.active && enabled(`active`)) {
    proc(`active`)
  }
  else if (item.audible && enabled(`playing`)) {
    proc(`playing`)
  }
  else if (item.unread && enabled(`unread`)) {
    proc(`unread`)
  }
  else if (item.pinned && enabled(`pinned`)) {
    proc(`pinned`)
  }
  else if (!item.pinned && enabled(`normal`)) {
    proc(`normal`)
  }
  else if (item.discarded && enabled(`unloaded`)) {
    proc(`unloaded`)
  }
  else if (!item.discarded && enabled(`loaded`)) {
    proc(`loaded`)
  }
}

App.apply_color_mode = (item) => {
  let color_mode = App.get_setting(`color_mode`)
  let color = App.get_color(item)

  if (item.header) {
    color_mode = `icon`
  }

  if (color_mode.includes(`icon`)) {
    let el = DOM.el(`.color_icon_container`, item.element)

    if (color) {
      el.innerHTML = ``
      el.append(App.color_icon(color))
      el.classList.remove(`hidden`)
    }
    else {
      el.textContent = ``
      el.classList.add(`hidden`)
    }
  }

  if (color_mode.includes(`border`)) {
    for (let color of App.colors) {
      item.element.classList.remove(`colored`)
      item.element.classList.remove(`border_${color}`)
    }

    if (color) {
      item.element.classList.add(`colored`)
      item.element.classList.add(`border_${color}`)
    }
  }

  if (color_mode.includes(`background`)) {
    for (let color of App.colors) {
      item.element.classList.remove(`colored`)
      item.element.classList.remove(`colored_background`)
      item.element.classList.remove(`background_${color}`)
    }

    if (color) {
      item.element.classList.add(`colored`)
      item.element.classList.add(`colored_background`)
      item.element.classList.add(`background_${color}`)
    }
  }

  if (color_mode.includes(`text`)) {
    for (let color of App.colors) {
      item.element.classList.remove(`colored`)
      item.element.classList.remove(`colored_text`)
      item.element.classList.remove(`text_${color}`)
    }

    if (color) {
      item.element.classList.add(`colored`)
      item.element.classList.add(`colored_text`)
      item.element.classList.add(`text_${color}`)
    }
  }
}

App.color_icon = (color) => {
  return DOM.create(`div`, `color_icon background_${color}`)
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

App.get_colored_items = (mode) => {
  let items = []

  for (let item of App.get_items(mode)) {
    if (App.get_color(item)) {
      items.push(item)
    }
  }

  return items
}

App.get_color_icon = (item) => {
  let cls = ``

  if (item.mode === `tabs`) {
    if (App.get_setting(`color_icon_click`)) {
      cls += ` effect`
    }
  }

  let icon = DOM.create(`div`, `color_icon_container item_node hidden${cls}`)
  icon.title = `Color`
  item.element.append(icon)
}