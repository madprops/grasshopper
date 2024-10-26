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