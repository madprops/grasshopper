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
  App.settings_ready = true
  App.debug(`Stor: Got settings`)
}

App.stor_save_settings = () => {
  App.debug(`Stor: Saving settings`)
  App.save_local_storage(App.stor_settings_name, App.settings)
}

App.stor_get_profiles = () => {
  App.profiles = App.get_local_storage(App.stor_profiles_name, [])
  App.check_profiles()
  App.debug(`Stor: Got profiles`)
}

App.stor_save_profiles = () => {
  App.debug(`Stor: Saving profiles`)
  App.save_local_storage(App.stor_profiles_name, App.profiles)
}

App.stor_get_command_history = () => {
  App.command_history = App.get_local_storage(App.stor_command_history_name, [])
  App.debug(`Stor: Got command_history`)
}

App.stor_save_command_history = () => {
  App.debug(`Stor: Saving command_history`)
  App.save_local_storage(App.stor_command_history_name, App.command_history)
}

App.stor_get_filter_history = () => {
  App.filter_history = App.get_local_storage(App.stor_filter_history_name, [])
  App.debug(`Stor: Got filter_history`)
}

App.stor_save_filter_history = () => {
  App.debug(`Stor: Saving filter_history`)
  App.save_local_storage(App.stor_filter_history_name, App.filter_history)
}

App.stor_get_first_time = () => {
  App.first_time = App.get_local_storage(App.stor_first_time_name, {})
  App.debug(`Stor: Got first_time`)
}

App.stor_save_first_time = () => {
  App.debug(`Stor: Saving first_time`)
  App.save_local_storage(App.stor_first_time_name, App.first_time)
}