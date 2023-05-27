App.get_local_storage = (ls_name, fallback) => {
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

App.save_local_storage = (ls_name, obj) => {
  localStorage.setItem(ls_name, JSON.stringify(obj))
}

App.stor_get_settings = () => {
  App.settings = App.get_local_storage(App.stor_settings_name, {})
  let changed = false

  // Fill defaults

  for (let setting in App.default_settings) {
    if (App.settings[setting] === undefined) {
      App.settings[setting] = {}
      App.settings[setting].value = App.default_settings[setting].value
      App.settings[setting].version = App.default_settings[setting].version
      changed = true
    }
  }

  // Remove unused keys
  for (let setting in App.settings) {
    if (App.default_settings[setting] === undefined) {
      App.log(`Stor: Deleting unused setting: "${setting}"`)
      delete App.settings[setting]
      changed = true
    }
    else if (App.settings[setting].version < App.default_settings[setting].version) {
      App.settings[setting].value = App.default_settings[setting].value
      App.settings[setting].version = App.default_settings[setting].version
      changed = true
    }
  }

  if (changed) {
    App.stor_save_settings()
  }

  App.log(`Stor: Got settings`)
}

App.stor_save_settings = () => {
  App.log(`Stor: Saving settings`)
  App.save_local_storage(App.stor_settings_name, App.settings)
}

App.stor_get_stars = () => {
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

  App.log(`Stor: Got stars`)
}

App.stor_save_stars = () => {
  App.log(`Stor: Saving stars`)
  App.save_local_storage(App.stor_stars_name, App.stars)
}

App.stor_get_titles = () => {
  App.titles = App.get_local_storage(App.stor_titles_name, [])
  App.log(`Stor: Got titles`)
}

App.stor_save_titles = () => {
  App.log(`Stor: Saving titles`)
  App.save_local_storage(App.stor_titles_name, App.titles)
}