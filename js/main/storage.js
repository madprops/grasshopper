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

App.stor_clear_all_data = () => {
  App.show_confirm(`Clear all local data?\nData like stars, settings, titles, etc`, () => {
    localStorage.clear()
    App.reload_extension()
  })
}

App.stor_get_settings = () => {
  App.settings = App.get_local_storage(App.stor_settings_name, {})
  App.check_settings()
  App.log(`Stor: Got settings`)
}

App.stor_save_settings = () => {
  App.log(`Stor: Saving settings`)
  App.save_local_storage(App.stor_settings_name, App.settings)
}

App.stor_get_stars = () => {
  App.stars = App.get_local_storage(App.stor_stars_name, [])
  App.check_stars()
  App.log(`Stor: Got stars`)
}

App.stor_save_stars = () => {
  App.log(`Stor: Saving stars`)
  App.save_local_storage(App.stor_stars_name, App.stars)
}

App.stor_get_titles = () => {
  App.titles = App.get_local_storage(App.stor_titles_name, [])
  App.check_titles()
  App.log(`Stor: Got titles`)
}

App.stor_save_titles = () => {
  App.log(`Stor: Saving titles`)
  App.save_local_storage(App.stor_titles_name, App.titles)
}

App.stor_get_command_history = () => {
  App.command_history = App.get_local_storage(App.stor_command_history_name, [])
  App.log(`Stor: Got command_history`)
}

App.stor_save_command_history = () => {
  App.log(`Stor: Saving command_history`)
  App.save_local_storage(App.stor_command_history_name, App.command_history)
}