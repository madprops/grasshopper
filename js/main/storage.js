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

  if (App.settings.background_color === undefined) {
    App.settings.background_color = "rgb(37, 41, 51)"
    changed = true
  }

  if (App.settings.text_color === undefined) {
    App.settings.text_color = "rgb(220, 220, 220)"
    changed = true
  }

  if (App.settings.alt_color === undefined) {
    App.settings.alt_color = "rgb(63, 67, 75)"
    changed = true
  }

  if (App.settings.pin_color === undefined) {
    App.settings.pin_color = "rgb(128, 128, 128)"
    changed = true
  }

  if (App.settings.tabs_index === undefined) {
    App.settings.tabs_index = 0
    changed = true
  }

  if (App.settings.stars_index === undefined) {
    App.settings.stars_index = 1
    changed = true
  }

  if (App.settings.closed_index === undefined) {
    App.settings.closed_index = 2
    changed = true
  }

  if (App.settings.history_index === undefined) {
    App.settings.history_index = 3
    changed = true
  }

  if (App.settings.warn_on_tab_close === undefined) {
    App.settings.warn_on_tab_close = true
    changed = true
  }

  if (App.settings.pin_style === undefined) {
    App.settings.pin_style = "groove"
    changed = true
  }  

  if (App.settings.pin_color === undefined) {
    App.settings.pin_color = "auto"
    changed = true
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

// Reset settings to default
App.stor_reset_settings = async function () {
  if (confirm("Reset settings to defaults?")) {
    App.settings = {}
    await App.stor_save_settings()
    window.close()
  }
}