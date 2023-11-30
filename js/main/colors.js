App.check_tab_colors = (item) => {
  if (item.mode !== `tabs`) {
    return
  }

  if (item.tab_box) {
    if (!App.get_setting(`tab_box_tab_colors`)) {
      return
    }
  }

  if (item.header) {
    if (!App.get_setting(`color_header`)) {
      return
    }
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
    item.element.classList.add(`tab_color_${type}`)
  }

  let types = [`active`, `playing`, `unread`,
  `pinned`, `normal`, `unloaded`, `loaded`]

  for (let type of types) {
    item.element.classList.remove(`tab_color_${type}`)
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
  if (item.tab_box) {
    if (!App.get_setting(`tab_box_colors`)) {
      return
    }
  }

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

    let c_obj = App.get_color_by_id(color)

    if (c_obj) {
      el.title = c_obj.name
    }
    else {
      el.title = `Color doesn't exist`
    }
  }

  if (color_mode.includes(`border`)) {
    for (let color of App.colors()) {
      item.element.classList.remove(`colored`)
      item.element.classList.remove(`border_color_${color.id}`)
    }

    if (color) {
      item.element.classList.add(`colored`)
      item.element.classList.add(`border_color_${color}`)
    }
  }

  if (color_mode.includes(`background`)) {
    for (let color of App.colors()) {
      item.element.classList.remove(`colored`)
      item.element.classList.remove(`colored_background`)
      item.element.classList.remove(`background_color_${color.id}`)
    }

    if (color) {
      item.element.classList.add(`colored`)
      item.element.classList.add(`colored_background`)
      item.element.classList.add(`background_color_${color}`)
    }
  }

  if (color_mode.includes(`text`)) {
    for (let color of App.colors()) {
      item.element.classList.remove(`colored`)
      item.element.classList.remove(`colored_text`)
      item.element.classList.remove(`text_color_${color.id}`)
    }

    if (color) {
      item.element.classList.add(`colored`)
      item.element.classList.add(`colored_text`)
      item.element.classList.add(`text_color_${color}`)
    }
  }
}

App.color_icon = (id) => {
  let s

  if (App.color_exists(id)) {
    s = `color_icon background_color_${id}`
  }
  else {
    s = `color_icon background_fallback_color`
  }

  return DOM.create(`div`, s)
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
      App.domain_rule_message()
      return
    }
  }

  let c_obj = App.get_color_by_id(args.color)
  let s = args.color ? `Color items?` : `Remove color?`
  let force = App.check_force(`warn_on_edit_tabs`, active)
  let value

  if (c_obj) {
    value = c_obj.id
  }
  else {
    value = ``
  }

  App.show_confirm({
    message: `${s} (${active.length})`,
    confirm_action: () => {
      for (let it of active) {
        App.apply_edit({what: `color`, item: it, value: value, on_change: (value) => {
          App.custom_save(it.id, `custom_color`, value)
        }})
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

    if (item.mode !== `tabs`) {
      return items
    }

    App.sep(items)
  }

  let colors_used = false

  for (let color of App.colors()) {
    let c = App.get_command(`color_${color.id}`)

    if (c) {
      if (App.check_command(c, {item: item})) {
        items.push({
          icon: App.color_icon(color.id),
          text: color.name,
          action: () => {
            App.edit_tab_color({item: item, color: color.id})
          },
        })

        colors_used = true
      }
    }
  }

  if (item.custom_color) {
    if (colors_used) {
      App.sep(items)
    }

    items.push({
      text: `Remove`,
      action: () => {
        App.edit_tab_color({item: item})
      }
    })
  }

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

    for (let color of App.colors()) {
      if (!count[color.id]) {
        continue
      }

      let icon = App.color_icon(color.id)
      let name = color.name

      items.push({
        icon: icon,
        text: name,
        action: () => {
          App.filter_color(mode, color.id)
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
    message: `Remove color? (${items.length})`,
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

App.close_color_all = (e) => {
  let count = App.get_active_colors(`tabs`)
  let items = []

  for (let color of App.colors()) {
    if (!count[color.id]) {
      continue
    }

    let icon = App.color_icon(color.id)
    let text = color.name

    items.push({
      icon: icon,
      text: text,
      action: () => {
        App.close_color(color.id)
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

  if (App.get_setting(`color_icon_click`)) {
    cls += ` effect`
  }

  let icon = DOM.create(`div`, `color_icon_container item_node hidden${cls}`)
  item.element.append(icon)
}

App.colors = () => {
  let colors = []

  for (let color of App.get_setting(`colors`)) {
    colors.push({
      id: color._id_,
      name: color.name,
      value: color.value,
    })
  }

  return colors
}

App.color_exists = (color) => {
  return App.colors().map(x => x.id).includes(color)
}

App.get_color_by_id = (id) => {
  for (let color of App.colors()) {
    if (color.id === id) {
      return color
    }
  }
}

App.get_color_by_name = (name) => {
  for (let color of App.colors()) {
    if (color.name === name) {
      return color
    }
  }
}

App.color_values = () => {
  let items = []

  items.push({
    text: `None`,
    value: `none`,
  })

  for (let color of App.colors()) {
    items.push({
      icon: App.color_icon(color.id),
      text: color.name,
      value: color.id,
    })
  }

  return items
}

App.replace_color = () => {
  let colors = App.colors()
  let names = colors.map(x => x.name)

  App.show_prompt({
    suggestions: names,
    placeholder: `Original Color`,
    list: names,
    show_list: true,
    list_submit: true,
    on_submit: (color_1) => {
      App.show_prompt({
        suggestions: names,
        placeholder: `New Color`,
        list: names.filter(x => x !== color_1),
        show_list: true,
        list_submit: true,
        on_submit: (color_2) => {
          App.do_replace_color(color_1, color_2)
        },
      })
    },
  })
}

App.do_replace_color = (color_1, color_2) => {
  if (!color_1 || !color_2) {
    return
  }

  let c_obj_1 = App.get_color_by_name(color_1)
  let c_obj_2 = App.get_color_by_name(color_2)

  if (!c_obj_1 || !c_obj_2) {
    App.alert(`Both colors must exist`)
    return
  }

  for (let item of App.get_items(`tabs`)) {
    if (item.custom_color === c_obj_1.id) {
      App.apply_edit({what: `color`, item: item, value: c_obj_2.id, on_change: (value) => {
        App.custom_save(item.id, `custom_color`, value)
      }})
    }
  }
}