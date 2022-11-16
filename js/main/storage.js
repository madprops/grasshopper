// Default settings values
App.default_settings = {
  text_mode: "title",
  background_color: "rgb(37, 41, 51)",
  text_color: "rgb(220, 220, 220)",
  tabs_index: 0,
  stars_index: 1,
  closed_index: 2,
  history_index: 3,
  warn_on_tab_close: true,
  pin_icon: "(+)",
  alien_icon: "(A)",
  history_max_results: 1000,
  history_max_months: 24,
  clean_active_tab: true,
  all_windows: true
}

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
      App.settings[key] = App.default_settings[key]
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