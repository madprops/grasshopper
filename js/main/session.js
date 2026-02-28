App.get_tab_value = async (tab_id, key) => {
  let ext_api = App.browser()

  // Firefox handles this natively
  if (ext_api.sessions && ext_api.sessions.getTabValue) {
    return await ext_api.sessions.getTabValue(tab_id, key)
  }

  // Chrome requires session storage
  if (ext_api.storage && ext_api.storage.session) {
    let storage_key = `tab_${tab_id}_${key}`
    let result = await ext_api.storage.session.get(storage_key)
    return result[storage_key]
  }

  return undefined
}

App.set_tab_value = async (tab_id, key, value) => {
  let ext_api = App.browser()

  if (ext_api.sessions && ext_api.sessions.setTabValue) {
    await ext_api.sessions.setTabValue(tab_id, key, value)
  }

  else if (ext_api.storage && ext_api.storage.session) {
    let storage_key = `tab_${tab_id}_${key}`
    await ext_api.storage.session.set({[storage_key]:value})
  }
}