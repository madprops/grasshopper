// Get settings from sync storage
App.stor_get_settings = async function () {
  let obj = await browser.storage.sync.get(App.stor_settings_name)
  
  if (Object.keys(obj).length === 0) {
    App.settings = {}
  } else {
    App.settings = obj[App.stor_settings_name]
  }

  let changed = false

  if (App.settings.text_mode === undefined) {
    App.settings.text_mode = "title"
    changed = true
  }

  if (App.settings.history_results === undefined) {
    App.settings.history_results = "normal"
    changed = true
  }

  if (App.settings.color === undefined) {
    App.settings.color = "rgb(37, 41, 51)"
    changed = true
  }   

  if (App.settings.window_order === undefined) {
    App.settings.window_order = ["tabs", "stars", "closed", "history"]
    changed = true
  }   

  if (App.settings.warn_on_close === undefined) {
    App.settings.warn_on_close = true
  }

  if (changed) {
    App.stor_save_settings()
  }
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

  if (changed) {
    App.stor_save_stars()
  }
}

// Save stars to sync storage
App.stor_save_stars = async function () {
  let o = {}
  o[App.stor_stars_name] = App.stars
  await browser.storage.sync.set(o)
}

// Reset settings to default
App.stor_reset_settings = async function () {
  if (confirm("Reset settings to defaults?")) {
    App.settings = {}
    await App.stor_save_settings()
    window.close()
  }
}