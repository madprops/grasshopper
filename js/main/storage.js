// Get local storage object
App.get_local_storage = function (ls_name, fallback) {
  let obj

  if (localStorage[ls_name]) {
    try {
      obj = JSON.parse(localStorage.getItem(ls_name))
    }
    catch (err) {
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

  App.log("Stor: Got settings")
}

// Save settings to storage
App.stor_save_settings = function () {
  App.save_local_storage(App.stor_settings_name, App.settings)
}

// Get stars from storage
App.stor_get_stars = function () {
  App.stars = App.get_local_storage(App.stor_stars_name, [])
  let changed = false

  for (let star of App.stars) {
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

  App.log("Stor: Got stars")
}

// Save stars to storage
App.stor_save_stars = function () {
  App.save_local_storage(App.stor_stars_name, App.stars)
}