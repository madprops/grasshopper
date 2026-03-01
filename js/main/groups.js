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
      }
    },
  })
}

App.do_change_group = async (item, name = ``, id = ``) => {
  let new_group

  if (id) {
    new_group = await App.get_group_by_id(id)
  }
  else {
    new_group = await App.get_group_by_name(name)
  }

  if (new_group) {
    await App.browser().tabs.group({tabIds: item.id, groupId: new_group.id})
    App.update_item({mode: `tabs`, id: item.id, group: new_group.id})
  }
  else if (name) {
    let id = await App.browser().tabs.group({tabIds: item.id})
    await App.browser().tabGroups.update(id, {title: name, color: `cyan`})
    App.update_item({mode: `tabs`, id: item.id, group: id})
  }
}

App.remove_group = async (item) => {
  let active = App.get_active_items({mode: item.mode, item})

  for (let tab of active) {
    await App.browser().tabs.ungroup(tab.id)
    App.update_item({mode: `tabs`, id: tab.id, group: -1})
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
  if (App.is_grouped(item)) {
    let group = await App.get_group_by_id(item.group)

    if (group) {
      let c_obj = App.get_color_by_name(group.title)

      if (c_obj) {
        if (c_obj.group) {
          let color = App.get_color(item)

          if (color && (color !== c_obj.id)) {
            App.edit_tab_color({item, color: c_obj.id})
          }
        }
      }
    }
  }
}