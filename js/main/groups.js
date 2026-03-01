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
    on_submit: async (ans) => {
      let active = App.get_active_items({mode: item.mode, item})

      for (let tab of active) {
        let new_group = await App.get_group_by_name(ans)

        if (new_group) {
          await App.browser().tabs.group({tabIds: tab.id, groupId: new_group.id})
          App.update_item({mode: `tabs`, id: tab.id, group: new_group.id})
        }
        else {
          let id = await App.browser().tabs.group({tabIds: tab.id})
          await App.browser().tabGroups.update(id, {title: ans, color: `cyan`})
          App.update_item({mode: `tabs`, id: tab.id, group: id})
        }
      }
    },
  })
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