// Get settings from sync storage
App.stor_get_settings = async function () {
  let obj = await browser.storage.sync.get(App.stor_settings_name)
  
  if (Object.keys(obj).length === 0) {
    App.settings = {}
  } else {
    App.settings = obj[App.stor_settings_name]
  }

  let changed = false
  
  for (let key in App.default_settings) {
    if (App.settings[key] === undefined) {
      App.settings[key] = App.default_settings[key].value
      changed = true
    }
  }

  if (changed) {
    App.stor_save_settings()
  }

  console.info("Stor: Got settings")  
}

// Save settings to sync storage
App.stor_save_settings = async function () {
  let o = {}
  o[App.stor_settings_name] = App.settings
  await browser.storage.sync.set(o)
}

// Get stars from sync storage
App.stor_get_stars = async function () {
  let obj = await browser.storage.sync.get(App.stor_stars_name)
  
  if (Object.keys(obj).length === 0) {
    App.stars = {}
  } else {
    App.stars = obj[App.stor_stars_name]
  }

  let changed = false

  if (App.stars.items === undefined) {
    App.stars.items = []
    changed = true
  } 

  for (let star of App.stars.items) {
    if (star.date_added === undefined) {
      star.date_added = Date.now()
      changed = true
    }
    
    if (star.date_last_visit === undefined) {
      star.date_last_visit = Date.now()
      changed = true
    }

    if (star.visits === undefined) {
      star.visits = 0
      changed = true
    }
  }

  if (changed) {
    App.stor_save_stars()
  }

  console.info("Stor: Got stars")
}

// Save stars to sync storage
App.stor_save_stars = async function () {
  let o = {}
  o[App.stor_stars_name] = App.stars
  await browser.storage.sync.set(o)
}

// Get tab state from sync storage
App.stor_get_tab_state = async function () {
  let obj = await browser.storage.sync.get(App.stor_tab_state_name)
  
  if (Object.keys(obj).length === 0) {
    App.tab_state = {}
  } else {
    App.tab_state = obj[App.stor_tab_state_name]
  }

  let changed = false

  if (App.tab_state.items === undefined) {
    App.tab_state.items = {}
    App.tab_state.backup = []
    changed = true
  } 

  if (changed) {
    App.stor_save_tab_state()
  }

  console.info("Stor: Got tab state")
}

// Save tab state to sync storage
App.stor_save_tab_state = async function () {
  let o = {}
  o[App.stor_tab_state_name] = App.tab_state
  await browser.storage.sync.set(o)
}