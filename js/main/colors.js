App.check_tab_colors = (item) => {
  if (item.mode !== `tabs`) {
    return
  }

  function is_enabled (type, what, mode) {
    let s_mode = App.get_setting(`${what}_color_${type}_mode`)

    if (s_mode !== mode) {
      return false
    }

    if (mode === `normal`) {
      if (item.tab_box) {
        return false
      }
    }
    else if (mode === `tab_box`) {
      if (!item.tab_box) {
        return false
      }
    }

    return true
  }

  function check (type, mode) {
    let enabled = false

    if (is_enabled(type, `text`, mode)) {
      add_class(type, `text`)
      enabled = true
    }

    if (is_enabled(type, `background`, mode)) {
      add_class(type, `background`)
      enabled = true
    }

    return enabled
  }

  function add_class (type, what) {
    item.element.classList.add(`tab_${what}_color_${type}`)
  }

  function proc (mode) {
    if (item.active && check(`active`, mode)) {
      return true
    }

    if (App.is_header(item) && check(`header`, mode)) {
      return true
    }

    if (App.is_subheader(item) && check(`subheader`, mode)) {
      return true
    }

    if (item.playing && check(`playing`, mode)) {
      return true
    }

    if (item.unread && check(`unread`, mode)) {
      return true
    }

    if (item.unloaded && check(`unloaded`, mode)) {
      return true
    }

    if (!item.unloaded && check(`loaded`, mode)) {
      return true
    }

    if (item.pinned && check(`pinned`, mode)) {
      return true
    }

    if (!item.pinned && check(`normal`, mode)) {
      return true
    }

    return false
  }

  for (let type of App.color_types) {
    item.element.classList.remove(`tab_text_color_${type}`)
    item.element.classList.remove(`tab_background_color_${type}`)
  }

  proc(`everywhere`)
  proc(`normal`)
  proc(`tab_box`)
}

App.apply_color_mode = (item) => {
  let color_mode = App.get_setting(`color_mode`)
  let color = App.get_color(item)

  if (item.tab_box) {
    color_mode = App.get_setting(`tab_box_color_mode`)
  }

  if (item.header) {
    color_mode = `icon`
  }

  if (color_mode.includes(`icon`) && App.icon_enabled(`color`)) {
    let el = DOM.el(`.color_icon_container`, item.element)

    if (color) {
      el.innerHTML = ``
      el.append(App.color_icon(color))
      DOM.show(el)
    }
    else {
      DOM.hide(el)
    }

    el.dataset.color = color

    if (App.get_setting(`show_tooltips`)) {
      let c_obj = App.get_color_by_id(color)

      if (c_obj) {
        el.title = c_obj.name

        if (App.get_setting(`icons_middle_click`)) {
          el.title += `\nMiddle Click: Remove Color`
        }
      }
      else {
        el.title = `Color doesn't exist`
      }
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
    s = `color_icon color_icon_inner background_color_${id}`
  }
  else {
    s = `color_icon color_icon_inner background_fallback_color`
  }

  return DOM.create(`div`, s)
}

App.color_icon_square = (color) => {
  let cls = `color_icon_square`
  let el = DOM.create(`div`, cls)
  el.style.backgroundColor = color
  return el
}

App.edit_tab_color = (args = {}) => {
  let def_args = {
    color: ``,
    toggle: false,
    force: false,
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
  let force = args.force || App.check_force(`warn_on_edit_tabs`, active)
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
        App.apply_edit({what: `color`, item: it, value, on_change: (value) => {
          App.custom_save(it.id, `color`, value)
        }})
      }
    },
    force,
  })
}

App.color_menu_items = (item, e) => {
  let items = []
  let item_color = App.get_color(item)
  let c_icon = App.color_icon(item_color)

  if (item_color) {
    items.push({
      text: `Show`,
      icon: App.clone_if_node(c_icon),
      action: () => {
        App.show_tab_list(`color_${item_color}`, e)
      },
    })

    items.push({
      text: `Filter`,
      icon: App.clone_if_node(c_icon),
      action: () => {
        App.filter_color({mode: item.mode, id: item_color})
      },
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
      if (App.check_command(c, {item})) {
        items.push({
          icon: App.color_icon(color.id),
          text: color.name,
          action: () => {
            App.edit_tab_color({item, color: color.id})
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
        App.edit_tab_color({item})
      },
    })
  }

  return items
}

App.show_color_menu = (item, e, show_title = true) => {
  let items = App.color_menu_items(item, e)
  let title = show_title ? `Color` : undefined
  let title_icon = App.settings_icons.colors
  let element = item?.element
  let compact = App.get_setting(`compact_color_menu`)
  App.show_context({items, e, title, title_icon, element, compact})
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
          App.filter_color({mode, id: `all`})
        },
        middle_action: () => {
          App.filter_color({mode, id: `all`, from: App.refine_string})
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
        icon,
        text: name,
        action: () => {
          App.filter_color({mode, id: color.id})
        },
        middle_action: () => {
          App.filter_color({mode, id: color.id, from: App.refine_string})
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

  App.remove_edits({
    what: [`color`],
    items,
    text: `colors`,
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
      icon,
      text,
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

  App.show_context({items, e})
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

App.colors = () => {
  let colors = []

  for (let color of App.get_setting(`colors`)) {
    colors.push({
      id: color._id_,
      name: color.name,
      value: color.value,
      text: color.text,
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
      App.apply_edit({what: `color`, item, value: c_obj_2.id, on_change: (value) => {
        App.custom_save(item.id, `color`, value)
      }})
    }
  }
}

App.get_color_tabs = (color_id) => {
  let tabs = []

  for (let item of App.get_items(`tabs`)) {
    let color = App.get_color(item)

    if (color) {
      if (color === color_id) {
        tabs.push(item)
      }
    }
  }

  return tabs
}

App.cycle_color = (item, direction = `next`) => {
  if (!item) {
    return
  }

  let colors = App.colors()

  if (!colors.length) {
    return
  }

  if (direction === `prev`) {
    colors = colors.slice().reverse()
  }

  let current = App.get_color(item)
  let next_color

  if (!current) {
    next_color = colors[0]
  }

  if (!next_color) {
    let found = false

    for (let color of colors) {
      if (found) {
        next_color = color
        break
      }

      if (color.id === current) {
        found = true
      }
    }
  }

  if (!next_color) {
    App.edit_tab_color({item, force: true})
  }
  else {
    App.edit_tab_color({item, color: next_color.id, force: true})
  }
}

App.start_colors_addlist = () => {
  if (App.colors_addlist_ready) {
    return
  }

  let {popobj, regobj} = App.get_setting_addlist_objects()
  let id = `settings_colors`
  let props = App.setting_props.colors

  App.create_popup({...popobj, id: `addlist_${id}`,
    element: Addlist.register({...regobj, id,
      keys: [`name`, `value`, `text`, `cmd`],
      pk: `name`,
      widgets: {
        name: `text`,
        value: `color`,
        text: `color`,
        cmd: `menu`,
      },
      labels: {
        name: `Name`,
        value: `Value`,
        text: `Text`,
        cmd: `Command`,
      },
      sources: {
        cmd: () => {
          return App.cmdlist_single.slice(0)
        },
      },
      list_icon: (item) => {
        return App.color_icon(item._id_)
      },
      list_text: (item) => {
        return item.name
      },
      required: {
        value: true,
      },
      tooltips: {
        name: `Name of the color`,
        value: `Value of the color`,
        text: `Color of the text`,
      },
      title: props.name,
    })})

  App.colors_addlist_ready = true
}

App.color_icon_click = (item, e) => {
  let color = App.get_color(item)
  let cmd = App.get_color_icon_command(color)

  if (cmd && (cmd !== `none`)) {
    App.run_command({cmd, from: `color_icon`, item, e})
  }
  else {
    App.show_color_menu(item, e, false)
  }
}

App.get_color_icon_command = (id) => {
  let colors = App.get_setting(`colors`)
  let cmd

  for (let item of colors) {
    if (item._id_ === id) {
      cmd = item.cmd
      break
    }
  }

  return cmd
}

App.show_color_picker = (e) => {
  let colors = App.get_setting(`colors`)
  let items = []

  for (let color of colors) {
    items.push({
      icon: App.color_icon(color._id_),
      text: color.name,
      action: () => {
        App.show_tab_list(`color_${color._id_}`, e)
      },
    })
  }

  let title = `Colors`
  let title_icon = App.settings_icons.colors
  App.show_context({items, e, title, title_icon})
}