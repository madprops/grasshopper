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
  let current = await App.get_group_by_id(item.group)
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
    item, name, id
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
    await App.browser().tabs.group({tabIds: args.item.id, groupId: new_group.id})
    App.update_item({mode: `tabs`, id: args.item.id, group: new_group.id})
  }
  else if (args.name) {
    let id = await App.browser().tabs.group({tabIds: args.item.id})
    await App.browser().tabGroups.update(id, {title: args.name, color: `cyan`})
    App.update_item({mode: `tabs`, id: args.item.id, group: id})
  }
}

App.ungroup_tabs = async (item) => {
  let active = App.get_active_items({mode: item.mode, item})

  for (let tab of active) {
    if (App.is_color_group(item)) {
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
  if (App.is_restoring_groups) {
    return
  }

  App.is_restoring_groups = true

  try {
    let processed_groups = []

    for (let item of items) {
      let group_id = tab_map[item.id].group

      if (group_id && (group_id !== -1)) {
        if (!processed_groups.includes(group_id)) {
          processed_groups.push(group_id)

          // group all tabs at once to prevent chaotic index shifting
          let group_tab_ids = []

          for (let i of items) {
            if (tab_map[i.id].group === group_id) {
              group_tab_ids.push(i.id)
            }
          }

          let tab_data = await App.browser().tabs.get(item.id)
          let target_index = tab_data.index
          let window_id = tab_data.windowId

          let current_group_tabs = await App.browser().tabs.query({groupId: group_id})
          let tabs_before_target = current_group_tabs.filter(t => t.index < target_index).length

          let safe_target_index = target_index - tabs_before_target

          try {
            await App.browser().tabs.group({tabIds: group_tab_ids, groupId: group_id})
            await App.browser().tabGroups.move(group_id, {index: safe_target_index})
          }
          catch (err) {
            let error_msg = err.message || ``

            if (error_msg.includes(`middle of another group`)) {
              let tabs_at_target = await App.browser().tabs.query({windowId: window_id, index: safe_target_index})

              if (tabs_at_target.length > 0) {
                let blocking_group_id = tabs_at_target[0].groupId

                if (blocking_group_id && (blocking_group_id !== -1) && (blocking_group_id !== group_id)) {
                  let blocking_tabs = await App.browser().tabs.query({groupId: blocking_group_id})

                  if (blocking_tabs.length > 0) {
                    let last_tab = blocking_tabs[blocking_tabs.length - 1]
                    let fallback_index = last_tab.index + 1

                    try {
                      await App.browser().tabGroups.move(group_id, {index: fallback_index})
                    }
                    catch (fallback_err) {
                      App.debug(fallback_err)
                    }
                  }
                }
                else {
                  App.debug(err)
                }
              }
              else {
                App.debug(err)
              }
            }
            else {
              App.debug(err)
            }
          }
        }
      }
      else {
        try {
          let current_tab = await App.browser().tabs.get(item.id)

          if (current_tab.groupId !== -1) {
            let window_id = current_tab.windowId
            let index = current_tab.index

            let prev_tabs = await App.browser().tabs.query({windowId: window_id, index: index - 1})
            let next_tabs = await App.browser().tabs.query({windowId: window_id, index: index + 1})

            let prev_group = prev_tabs[0] ? prev_tabs[0].groupId : -1
            let next_group = next_tabs[0] ? next_tabs[0].groupId : -1

            if ((prev_group !== -1) && (prev_group === next_group) && (prev_group === current_tab.groupId)) {
              // tab is sandwiched between two tabs in the same group, keep it absorbed
            }
            else {
              await App.browser().tabs.ungroup(item.id)
            }
          }
        }
        catch (err) {
          App.debug(err)
        }
      }
    }
  }
  finally {
    App.is_restoring_groups = false
  }
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
    let group = await App.get_group_by_id(item.group)

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

App.attempt_group = async (item, name) => {
  let group = await App.get_group_by_name(name)

  if (group && (group.id === item.group)) {
    // Ignore
  }
  else {
    App.change_group(item, name)
  }
}