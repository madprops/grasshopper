App.get_contextual_identity = async (tab) => {
  try {
    if (tab.cookieStoreId && tab.cookieStoreId !== `firefox-default`) {
      return await browser.contextualIdentities.get(tab.cookieStoreId)
    }
  }
  catch (error) {
    App.error(error)
  }
}

App.get_container_tabs = (item) => {
  let items = App.get_items(`tabs`)
  let name = item.container_name
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