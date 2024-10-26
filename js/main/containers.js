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

App.tab_container_menu = (item, e) => {
  let items = App.tab_container_menu_items(item, e)
  App.show_context({items, e})
}

App.tab_container_menu_items = (item, e) => {
  let items = []
  let icon = App.container_icon

  items.push({
    text: `Show`,
    icon,
    action: () => {
      App.show_tab_list(`container`, e, item)
    },
  })

  items.push({
    text: `Filter`,
    icon,
    action: () => {
      App.filter_container(item)
    },
  })

  return items
}

App.check_tab_container = async (tab) => {
  let ident = await App.get_contextual_identity(tab)

  if (ident) {
    tab.container_name = ident.name
    tab.container_color = ident.colorCode
  }
}