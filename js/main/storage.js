App.get_local_storage = (ls_name, fallback) => {
  let obj

  if (localStorage[ls_name]) {
    try {
      obj = App.obj(localStorage.getItem(ls_name))
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
  localStorage.setItem(ls_name, App.str(obj))
}

App.stor_get_settings = () => {
  App.settings = App.get_local_storage(App.stor_settings_name, {})
  App.check_settings()
  App.settings_done = true
  App.debug(`Stor: Got settings`)
}

App.stor_save_settings = () => {
  App.debug(`Stor: Saving settings`)
  App.save_local_storage(App.stor_settings_name, App.settings)
}

App.stor_get_command_history = () => {
  App.command_history = App.get_local_storage(App.stor_command_history_name, [])
  App.debug(`Stor: Got command history`)
}

App.stor_save_command_history = () => {
  App.debug(`Stor: Saving command history`)
  App.save_local_storage(App.stor_command_history_name, App.command_history)
}

App.stor_get_filter_history = () => {
  App.filter_history = App.get_local_storage(App.stor_filter_history_name, [])
  App.debug(`Stor: Got filter history`)
}

App.stor_save_filter_history = () => {
  App.debug(`Stor: Saving filter history`)
  App.save_local_storage(App.stor_filter_history_name, App.filter_history)
}

App.stor_get_tag_history = () => {
  App.tag_history = App.get_local_storage(App.stor_tag_history_name, [])
  App.debug(`Stor: Got tag history`)
}

App.stor_save_tag_history = () => {
  App.debug(`Stor: Saving tag history`)
  App.save_local_storage(App.stor_tag_history_name, App.tag_history)
}

App.stor_get_title_history = () => {
  App.title_history = App.get_local_storage(App.stor_title_history_name, [])
  App.debug(`Stor: Got title history`)
}

App.stor_save_title_history = () => {
  App.debug(`Stor: Saving title history`)
  App.save_local_storage(App.stor_title_history_name, App.title_history)
}

App.stor_get_icon_history = () => {
  App.icon_history = App.get_local_storage(App.stor_icon_history_name, [])
  App.debug(`Stor: Got icon history`)
}

App.stor_save_icon_history = () => {
  App.debug(`Stor: Saving icon history`)
  App.save_local_storage(App.stor_icon_history_name, App.icon_history)
}

App.stor_get_first_time = () => {
  App.first_time = App.get_local_storage(App.stor_first_time_name, {})
  App.debug(`Stor: Got first time`)
}

App.stor_save_first_time = () => {
  App.debug(`Stor: Saving first_time`)
  App.save_local_storage(App.stor_first_time_name, App.first_time)
}