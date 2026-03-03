App.setup_groups = () => {
  App.change_group_debouncer = App.create_debouncer(() => {
    App.change_group_action()
  }, App.change_group_delay)

  App.check_group_debouncer = App.create_debouncer(() => {
    App.check_group_action()
  }, App.check_group_delay)
}

App.group_tabs = async (item) => {
  App.group_prompt(item, async (name) => {
    let active = App.get_active_items({mode: item.mode, item})

    for (let tab of active) {
      await App.change_group(tab, name)
      App.check_group(tab)
    }
  })
}

App.change_group = (item, name, id) => {
  App.change_group_args.push({
    item, name, id,
  })

  App.change_group_debouncer.call()
}

App.change_group_action = async () => {
  let items = App.change_group_args.slice(0)
  App.change_group_args = []

  for (let item of items) {
    try {
      await App.change_group_item(item)
    }
    catch (err) {
      App.error(err)
    }
  }
}

App.change_group_item = async (args = {}) => {
  let new_group

  if (args.id) {
    new_group = await App.get_group_by_id(args.id)
  }
  else {
    new_group = await App.get_group_by_name(args.name)
  }

  let g_id

  if (new_group) {
    if (new_group.id === args.item.group) {
      return
    }

    await App.group_call({tabIds: args.item.id, groupId: new_group.id})
    g_id = new_group.id
  }
  else if (args.name) {
    let id = await App.group_call({tabIds: args.item.id})
    await App.group_update_call(id, {title: args.name, color: `cyan`})
    g_id = id
  }

  args.item.group = g_id
  args.item.group_name = args.name
  App.update_group_item(args.item)
  App.push_to_group_history([args.name])
}

App.ungroup_tabs = (item, edit = true, force = false) => {
  let items = App.get_active_items({mode: item.mode, item})
  force = force || App.check_warn(`warn_on_ungroup_tabs`, items)
  let ids = items.map(x => x.id)

  App.show_confirm({
    message: `Ungroup tabs? (${ids.length})`,
    confirm_action: async () => {
      for (let tab of items) {
        if (edit && App.is_color_group(item)) {
          App.edit_tab_color({item, force: true})
        }
        else if (edit && App.is_icon_group(item)) {
          App.edit_tab_icon({item, force: true})
        }

        await App.ungroup_call(tab.id)
        tab.group = -1
        tab.group_name = ``
        tab.ungrouping = false
        App.update_group_item(tab)
      }
    },
    force,
  })
}

App.get_groups = async () => {
  return await App.group_query_call({})
}

App.get_group = async (item) => {
  return await App.get_group_by_id(item.group)
}

App.get_group_by_id = async (id) => {
  let groups = await App.get_groups()

  for (let group of groups) {
    if (group.id === id) {
      return group
    }
  }
}

App.get_group_by_name = async (name) => {
  let groups = await App.get_groups()

  for (let group of groups) {
    if (group.title === name) {
      return group
    }
  }
}

App.is_grouped = (item) => {
  return item.group !== -1
}

App.get_group_name = async (item) => {
  if (!App.is_grouped(item)) {
    return ``
  }

  let group = await App.get_group(item)

  if (group) {
    return group.title
  }

  return ``
}

App.check_group = (item) => {
  App.check_group_items.push(item)
  App.check_group_debouncer.call()
}

App.check_group_action = () => {
  let items = App.check_group_items.slice(0)
  App.check_group_items = []

  for (let item of items) {
    App.check_group_item(item)
  }
}

App.check_group_item = async (item) => {
  if (item.ungrouping) {
    return
  }

  if (!App.is_grouped(item)) {
    return
  }

  let group = await App.get_group(item)
  let c_obj = App.get_color_by_name(group.title)

  if (c_obj) {
    if (c_obj.group) {
      let color = App.get_color(item)

      if (color !== c_obj.id) {
        App.edit_tab_color({item, color: c_obj.id, force: true})
      }
    }

    return
  }

  let i_obj = App.get_icon_by_group(group.title)

  if (i_obj) {
    if (item.custom_icon !== i_obj.icon) {
      App.edit_tab_icon({item, icon: i_obj.icon, force: true})
    }

    return
  }
}

App.attempt_color_group = (item, name) => {
  setTimeout(() => {
    App.do_attempt_color_group(item, name)
  }, App.attempt_group_delay)
}

App.attempt_icon_group = (item, icon) => {
  setTimeout(() => {
    App.do_attempt_icon_group(item, icon)
  }, App.attempt_group_delay)
}

App.do_attempt_color_group = async (item, name) => {
  if (App.is_icon_group(item)) {
    return
  }

  let group = await App.get_group_by_name(name)

  if (group && (group.id === item.group)) {
    // Ignore
  }
  else {
    App.change_group(item, name)
  }
}

App.do_attempt_icon_group = async (item, icon) => {
  if (App.is_color_group(item)) {
    return
  }

  let c_icon = App.get_custom_icon_item(icon)

  if (!c_icon || !c_icon.group) {
    return
  }

  let name = c_icon.group
  let group = await App.get_group_by_name(name)

  if (group && (group.id === item.group)) {
    // Ignore
  }
  else {
    App.change_group(item, name)
  }
}

App.close_group = (item) => {
  if (!App.is_grouped(item)) {
    return false
  }

  let items = App.get_group_tabs(item.group)

  App.close_tabs({
    selection: items,
  })
}

App.get_group_tabs = (group) => {
  let items = []

  for (let tab of App.get_items(`tabs`)) {
    if (tab.group === group) {
      items.push(tab)
    }
  }

  return items
}

App.fill_group = async (item) => {
  if (!item.group_name) {
    item.group_name = await App.get_group_name(item)
    App.set_item_tooltips(item, true)
  }
}

App.show_filter_group_menu = async (mode, e, show = false) => {
  let items = await App.get_group_items(mode, show)
  let title_icon = App.get_setting(`group_icon`)
  App.show_context({items, e, title: `Tags`, title_icon})
}

App.get_group_items = async (mode, show = false) => {
  function fav_sort(a, b) {
    let ai = App.group_history.indexOf(a.title)
    let bi = App.group_history.indexOf(b.title)

    if (ai === -1) {
      ai = App.group_history.length
    }

    if (bi === -1) {
      bi = App.group_history.length
    }

    return ai - bi
  }

  let items = []
  let groups = await App.get_groups()

  if (groups.length) {
    groups.sort(fav_sort)
    let icon = App.get_setting(`group_icon`)

    if (!show) {
      items.push({
        icon,
        text: `All`,
        action: () => {
          App.filter_group({mode})
        },
        middle_action: () => {
          App.filter_group({mode, from: App.refine_string})
        },
      })
    }

    for (let group of groups.slice(0, App.max_group_picks)) {
      items.push({
        icon,
        text: group.title,
        action: (e) => {
          if (show) {
            App.show_tab_list(`group_${group.id}`, e)
          }
          else {
            App.filter_group({mode, group})
          }
        },
        middle_action: (e) => {
          if (show) {
            //
          }
          else {
            App.filter_group({mode, group, from: App.refine_string})
          }
        },
      })
    }
  }
  else {
    items.push({
      text: `No groups in use`,
      action: () => {
        App.alert(`You can assign a group to tabs`)
      },
    })
  }

  return items
}

App.push_to_group_history = (groups) => {
  if (!groups.length) {
    return
  }

  for (let group of groups) {
    if (!group) {
      continue
    }

    App.group_history = App.group_history.filter(x => x !== group)
    App.group_history.unshift(group)
    App.group_history = App.group_history.slice(0, App.group_history_max)
  }

  App.stor_save_group_history()
}

App.group_menu_items = async (item, e) => {
  let items = []
  let item_group = await App.get_group(item)

  if (item_group) {
    items.push({
      text: `Show`,
      action: () => {
        App.show_tab_list(`group_${item_group.id}`, e)
      },
    })

    items.push({
      text: `Filter`,
      action: () => {
        App.filter_group({mode: item.mode, group: item_group})
      },
    })

    if (item.mode !== `tabs`) {
      return items
    }
  }

  items.push({
    text: `Ungroup`,
    action: () => {
      App.ungroup_tabs(item)
    },
  })

  return items
}

App.show_group_menu = async (item, e, show_title = true) => {
  let items = await App.group_menu_items(item, e)
  let title = show_title ? `Group` : undefined
  let title_icon = App.group_icon
  let element = item?.element
  App.show_context({items, e, title, title_icon, element})
}

App.group_icon_click = (item, e) => {
  let cmd = App.get_setting(`group_icon_command`)

  if (cmd && (cmd !== `none`)) {
    App.run_command({cmd, from: `group_icon`, item, e})
  }
  else {
    App.show_group_menu(item, e, false)
  }
}

App.show_group = async (item, e) => {
  let group = await App.get_group(item)
  App.show_tab_list(`group_${group.id}`, e)
}

App.rename_group = async (item) => {
  App.group_prompt(item, async (name) => {
    let group = await App.get_group(item)

    if (!group) {
      return
    }

    await App.group_update_call(group.id, {title: name})
    let tabs = App.get_group_tabs(group.id)

    for (let tab of tabs) {
      tab.group_name = name
      App.set_item_tooltips(item, true)
    }
  })
}

App.update_group_item = (item) => {
  App.update_item({mode: `tabs`, id: item.id, info: item})
  App.set_item_tooltips(item, true)
}

App.group_prompt = async (item, callback) => {
  let groups = await App.get_groups()
  let names = groups.map(x => x.title)
  let current = await App.get_group(item)
  let auto_picker = App.get_setting(`auto_group_picker`)
  let value = ``

  if (current) {
    value = current.title
  }

  App.show_prompt({
    value,
    placeholder: `Tab Group`,
    suggestions: names,
    list: names,
    show_list: auto_picker,
    list_submit: auto_picker,
    fill: true,
    on_submit: async (name) => {
      callback(name)
    },
  })
}

App.group_call = async (obj) => {
  App.debug(`Grouping: Obj ${obj}`)
  return await App.browser().tabs.group(obj)
}

App.ungroup_call = async (id) => {
  if (!id) {
    return
  }

  App.debug(`Ungrouping: Tab ${id}`)
  return await App.browser().tabs.ungroup(id)
}

App.group_update_call = async (id, obj) => {
  if (!id) {
    return
  }

  App.debug(`Updating Group: ID ${id}`)
  return await App.browser().tabGroups.update(id, obj)
}

App.group_move_call = async (id, obj) => {
  if (!id) {
    return
  }

  return await App.browser().tabGroups.move(id, obj)
}

App.group_query_call = async (obj) => {
  return await App.browser().tabGroups.query(obj)
}