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