App.setup_groups = () => {
  App.change_group_debouncer = App.create_debouncer(() => {
    App.change_group_action()
  }, App.change_group_delay)

  App.check_group_debouncer = App.create_debouncer(() => {
    App.check_group_action()
  }, App.check_group_delay)
}

App.group_tabs = async (item) => {
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
      let active = App.get_active_items({mode: item.mode, item})

      for (let tab of active) {
        await App.change_group(tab, name)
        App.check_group(tab)
      }
    },
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

  if (new_group) {
    if (new_group.id === args.item.group) {
      return
    }

    await App.browser().tabs.group({tabIds: args.item.id, groupId: new_group.id})
    App.update_item({mode: `tabs`, id: args.item.id, group: new_group.id})
  }
  else if (args.name) {
    let id = await App.browser().tabs.group({tabIds: args.item.id})
    await App.browser().tabGroups.update(id, {title: args.name, color: `cyan`})
    App.update_item({mode: `tabs`, id: args.item.id, group: id})
  }

  App.push_to_group_history([args.name])
}

App.ungroup_tabs = async (item, uncolor = true) => {
  let active = App.get_active_items({mode: item.mode, item})

  for (let tab of active) {
    if (uncolor && App.is_color_group(item)) {
      App.edit_tab_color({item})
    }

    await App.browser().tabs.ungroup(tab.id)
    App.update_item({mode: `tabs`, id: tab.id, group: -1})
    item.ungrouping = false
  }
}

App.get_groups = async () => {
  return await App.browser().tabGroups.query({})
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

  if (App.is_grouped(item)) {
    let group = await App.get_group(item)

    if (group) {
      let c_obj = App.get_color_by_name(group.title)

      if (c_obj) {
        if (c_obj.group) {
          let color = App.get_color(item)

          if (color !== c_obj.id) {
            App.edit_tab_color({item, color: c_obj.id, force: true})
          }
        }
      }
    }
  }
}

App.attempt_group = (item, name) => {
  setTimeout(() => {
    App.do_attempt_group(item, name)
  }, App.attempt_group_delay)
}

App.do_attempt_group = async (item, name) => {
  if (App.updating_index) {
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
  item.group_name = await App.get_group_name(item)
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
            App.show_tab_list(`group_${group.title}`, e)
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