App.setup_groups = () => {
  App.change_group_debouncer = App.create_debouncer(() => {
    App.do_change_group_action()
  }, App.change_group_delay)
}

App.change_group = async (item) => {
  let groups = await App.get_groups()
  let names = groups.map(x => x.title)
  let current = await App.get_group_by_id(item.group)
  let value = ``

  if (current) {
    value = current.title
  }

  App.show_prompt({
    value,
    placeholder: `Tab Group`,
    suggestions: names,
    list: names,
    show_list: true,
    list_submit: true,
    fill: true,
    on_submit: async (name) => {
      let active = App.get_active_items({mode: item.mode, item})

      for (let tab of active) {
        await App.do_change_group(tab, name)
        await App.check_group(tab)
      }
    },
  })
}

App.do_change_group = (item, name, id) => {
  App.change_group_args.push({
    item, name, id
  })

  App.change_group_debouncer.call()
}

App.do_change_group_action = async () => {
  let items = App.change_group_args.slice(0)
  App.change_group_args = []

  for (let item of items) {
    try {
      await App.do_change_group_item(item)
    }
    catch (err) {
      App.error(err)
    }
  }
}

App.do_change_group_item = async (args = {}) => {
  let new_group

  if (args.id) {
    new_group = await App.get_group_by_id(args.id)
  }
  else {
    new_group = await App.get_group_by_name(args.name)
  }


  if (new_group) {
    await App.browser().tabs.group({tabIds: args.item.id, groupId: new_group.id})
    App.update_item({mode: `tabs`, id: args.item.id, group: new_group.id})
  }
  else if (args.name) {
    let id = await App.browser().tabs.group({tabIds: args.item.id})
    await App.browser().tabGroups.update(id, {title: args.name, color: `cyan`})
    App.update_item({mode: `tabs`, id: args.item.id, group: id})
  }
}

App.remove_group = async (item) => {
  let active = App.get_active_items({mode: item.mode, item})

  for (let tab of active) {
    await App.browser().tabs.ungroup(tab.id)
    App.update_item({mode: `tabs`, id: tab.id, group: -1})
    item.ungrouping = false
  }
}

App.get_groups = async () => {
  return await App.browser().tabGroups.query({})
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
    return
  }

  let group = await App.get_group_by_id(item.group)

  if (group) {
    return group.title
  }

  return ``
}

App.restore_groups = async (items, tab_map) => {
  let processed_groups = []

  for (let item of items) {
    let group_id = tab_map[item.id].group

    if (group_id && group_id !== -1) {
      if (!processed_groups.includes(group_id)) {
        processed_groups.push(group_id)

        // Find exactly where the tab landed after the main loop moved it
        let tab_data = await App.browser().tabs.get(item.id)
        let target_index = tab_data.index

        try {
          // Tuck the tab back into its group (this temporarily yanks it back)
          await App.browser().tabs.group({tabIds: [item.id], groupId: group_id})

          // Move the entire group to the new target index so it lumps along
          await App.browser().tabGroups.move(group_id, {index: target_index})
        }
        catch (err) {
          App.error(err)
        }
      }
      else {
        // If the group was already moved to the target, just tuck remaining tabs into it
        try {
          await App.browser().tabs.group({tabIds:[item.id],groupId:group_id})
        }
        catch (err) {
          App.error(err)
        }
      }
    }
  }
}

App.check_group = async (item) => {
  if (item.ungrouping) {
    return
  }

  if (App.is_grouped(item)) {
    let group = await App.get_group_by_id(item.group)

    if (group) {
      let c_obj = App.get_color_by_name(group.title)

      if (c_obj) {
        if (c_obj.group) {
          let color = App.get_color(item)

          if (color !== c_obj.id) {
            App.edit_tab_color({item, color: c_obj.id})
          }
        }
      }
    }
  }
}