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
  App.check_settings()
  App.log(`Stor: Got settings`, `debug`)
}

App.stor_save_settings = () => {
  App.log(`Stor: Saving settings`, `debug`)
  App.save_local_storage(App.stor_settings_name, App.settings)
}

App.stor_get_profiles = () => {
  App.profiles = App.get_local_storage(App.stor_profiles_name, [])
  App.check_profiles()
  App.log(`Stor: Got profiles`, `debug`)
}

App.stor_save_profiles = () => {
  App.log(`Stor: Saving profiles`, `debug`)
  App.save_local_storage(App.stor_profiles_name, App.profiles)
}

App.stor_get_command_history = () => {
  App.command_history = App.get_local_storage(App.stor_command_history_name, [])
  App.log(`Stor: Got command_history`, `debug`)
}

App.stor_save_command_history = () => {
  App.log(`Stor: Saving command_history`, `debug`)
  App.save_local_storage(App.stor_command_history_name, App.command_history)
}