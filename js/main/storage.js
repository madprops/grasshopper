// Get local storage object
App.get_local_storage = function (ls_name, fallback) {
  let obj

  if (localStorage[ls_name]) {
    try {
      obj = JSON.parse(localStorage.getItem(ls_name))
    } catch (err) {
      localStorage.removeItem(ls_name)
      obj = null
    }
  }
  else {
    obj = null
  }

  if (!obj) {
    obj = fallback
  }

  return obj
}

// Save local storage object
App.save_local_storage = function (ls_name, obj) {
  localStorage.setItem(ls_name, JSON.stringify(obj))
}

// Get settings from storage
App.stor_get_settings = function () {
  App.settings = App.get_local_storage(App.stor_settings_name, {})
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

// Save settings to storage
App.stor_save_settings = function () {
  App.save_local_storage(App.stor_settings_name, App.settings)
}

// Get tab state from storage
App.stor_get_tab_state = function () {
  App.tab_state = App.get_local_storage(App.stor_tab_state_name, {})
  console.info("Stor: Got tab state")
}

// Save tab state to storage
App.stor_save_tab_state = function () {
  App.save_local_storage(App.stor_tab_state_name, App.tab_state)
}