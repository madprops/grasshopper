App.get_contextual_identity = async (tab) => {
  try {
    if (tab.cookieStoreId && (tab.cookieStoreId !== `firefox-default`)) {
      return await App.browser().contextualIdentities.get(tab.cookieStoreId)
    }
  }
  catch (error) {
    App.error(error)
  }
}

App.get_container_tabs = (name) => {
  let items = App.get_items(`tabs`)
  return items.filter(x => x.container_name === name)
}

App.get_all_container_tabs = () => {
  let items = App.get_items(`tabs`)
  return items.filter(x => x.container_name)
}

App.tab_container_menu = (item, e) => {
  let items = App.tab_container_menu_items(item, e)
  App.show_context({items, e})
}

App.tab_container_menu_items = (item, e) => {
  let items = []

  items.push({
    text: `Show`,
    icon: App.color_icon_square(item.container_color),
    action: () => {
      App.show_tab_list(`container`, e, item)
    },
  })

  items.push({
    text: `Filter`,
    icon: App.color_icon_square(item.container_color),
    action: () => {
      App.filter_same_container(item)
    },
  })

  items.push({
    text: `Open`,
    icon: App.get_setting(`container_icon`),
    action: () => {
      App.open_in_tab_container(item, e)
    },
  })

  return items
}

App.check_tab_container = async (tab) => {
  let ident = await App.get_contextual_identity(tab)

  if (ident) {
    tab.container_name = ident.name
    tab.container_color = ident.colorCode

    if (App.container_data[ident.name] === undefined) {
      App.container_data[ident.name] = {}
    }

    App.container_data[ident.name].color = ident.colorCode
  }
}

App.filter_same_container = (item) => {
  App.filter_container({mode: item.mode, container: item.container_name})
}

App.show_filter_container_menu = (mode, e, show = false) => {
  let items = App.get_container_items(mode, show)
  let title_icon = App.get_setting(`container_icon`)
  let compact = App.get_setting(`compact_container_menu`)
  App.show_context({items, e, title: `Containers`, title_icon, compact})
}

App.get_container_items = (mode, show) => {
  let items = []
  let containers = []

  for (let tab of App.get_items(`tabs`)) {
    if (tab.container_name) {
      if (!containers.includes(tab.container_name)) {
        containers.push(tab.container_name)
      }
    }
  }

  if (containers.length) {
    let icon = App.get_setting(`container_icon`)

    if (!show) {
      items.push({
        icon,
        text: `All`,
        action: () => {
          App.filter_cmd(mode, `filter_tab_containers_all`, `containers_menu`)
        },
        middle_action: () => {
          App.filter_container({mode, container: `all`, from: App.refine_string})
        },
      })
    }

    for (let container of containers) {
      let icon = App.color_icon_square(App.container_data[container].color)

      items.push({
        icon,
        text: container,
        action: (e) => {
          if (show) {
            App.show_tab_list(`container_${container}`, e)
          }
          else {
            App.filter_container({mode, container})
          }
        },
        middle_action: (e) => {
          if (show) {
            //
          }
          else {
            App.filter_container({mode, container, from: App.refine_string})
          }
        },
      })
    }
  }
  else {
    items.push({
      text: `No containers in use`,
      action: () => {
        App.alert(`Open containers in Firefox to use this feature`)
      },
    })
  }

  return items
}

App.get_all_containers = async () => {
  let containers = []

  try {
    let data = await App.browser().contextualIdentities.query({})

    for (let c of data) {
      containers.push({
        id: c.cookieStoreId,
        name: c.name,
        color: c.colorCode,
      })
    }

    return containers
  }
  catch (error) {
    App.error(error)
  }
}

App.find_container_by_name = (containers, name = ``) => {
  name = name.trim().toLowerCase()

  for (let container of containers) {
    if (container.name.toLowerCase() === name) {
      return container
    }
  }
}

App.open_in_tab_container = async (item, e, name = ``) => {
  let new_tab_mode = App.get_setting(`new_tab_mode`)
  let containers = await App.get_all_containers()
  let active = App.get_active_items({mode: item.mode, item})
  let o_item

  if (!active.length) {
    return
  }

  if (new_tab_mode === `above`) {
    o_item = active[0]
  }
  else if (new_tab_mode === `below`) {
    o_item = active.at(-1)
  }
  else {
    o_item = active[0]
  }

  if (name) {
    let target_container = App.find_container_by_name(containers, name)

    if (!target_container) {
      App.alert(`No container named ${name} found`)
      return
    }

    for (let it of active) {
      App.create_new_tab({url: it.url, cookieStoreId: target_container.id}, o_item)
    }

    return
  }

  let items = []

  for (let c of containers) {
    items.push({
      text: c.name,
      icon: App.color_icon_square(c.color),
      action: () => {
        for (let it of active) {
          App.create_new_tab({url: it.url, cookieStoreId: c.id}, o_item)
        }
      },
    })
  }

  if (!items.length) {
    App.alert(`No containers available`)
    return
  }

  let title = `Open In`
  let title_icon = App.get_setting(`container_icon`)
  let compact = App.get_setting(`compact_container_menu`)
  App.show_context({items, e, title, title_icon, compact})
}