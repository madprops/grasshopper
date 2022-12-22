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
  } else {
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

// Get stars from storage
App.stor_get_stars = function () {
  App.stars = App.get_local_storage(App.stor_stars_name, [])
  let changed = false

  let n1 = App.stars.length
  App.stars = App.stars.filter(x => x.id)
  App.stars = App.stars.filter(x => x.title)
  App.stars = App.stars.filter(x => x.url)
  let n2 = App.stars.length

  if (n1 !== n2) {
    changed = true
  }

  for (let star of App.stars) {
    if (star.added === undefined) {
      star.added = Date.now()
      changed = true
    }

    if (star.last_visit === undefined) {
      star.last_visit = Date.now()
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

// Save stars to storage
App.stor_save_stars = function () {
  App.save_local_storage(App.stor_stars_name, App.stars)
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

// Get sort state from storage
App.stor_get_sort_state = function () {
  App.sort_state = App.get_local_storage(App.stor_sort_state_name, {})
  console.info("Stor: Got sort state")
}

// Save sort state to storage
App.stor_save_sort_state = function () {
  App.save_local_storage(App.stor_sort_state_name, App.sort_state)
}

// Get filters from storage
App.stor_get_filters = function () {
  App.filters = App.get_local_storage(App.stor_filters_name, [])
  console.info("Stor: Got filters")
}

// Save filters to storage
App.stor_save_filters = function () {
  App.save_local_storage(App.stor_filters_name, App.filters)
}