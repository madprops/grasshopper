App.get_local_storage_old = (ls_name) => {
  let obj = null

  try {
    obj = App.obj(localStorage.getItem(ls_name))
  }
  catch (err) {
    App.error(err)
  }

  return obj
}

App.remove_local_storage_old = (ls_name) => {
  localStorage.removeItem(ls_name)
}

App.get_local_storage = async (ls_name, fallback) => {
  let keys = {}
  keys[ls_name] = fallback
  let ans = await browser.storage.local.get(keys)
  return ans[ls_name]
}

App.save_local_storage = async (ls_name, obj) => {
  let keys = {}
  keys[ls_name] = obj
  await browser.storage.local.set(keys)
}

App.stor_compat_check = async () => {
  if (!App.stor_compat.length) {
    return
  }

  let checked = await App.get_local_storage(App.stor_compat_check_name, false)

  if (!checked) {
    App.debug(`Stor: Compat`)

    for (let item of App.stor_compat) {
      let obj = App.get_local_storage_old(item.old)

      if (obj !== null) {
        App.debug(`Stor: Converting ${item.old} to ${item.new}`)
        await App.save_local_storage(item.new, obj)
        await App.remove_local_storage_old(item.old)
      }
    }

    await App.save_local_storage(App.stor_compat_check_name, true)
  }
}

App.stor_get_settings = async () => {
  App.settings = await App.get_local_storage(App.stor_settings_name, {})
  App.check_settings()
  App.settings_done = true
  App.debug(`Stor: Got settings`)
}

App.stor_save_settings = () => {
  App.debug(`Stor: Saving settings`)
  App.save_local_storage(App.stor_settings_name, App.settings)
}

App.stor_get_command_history = async () => {
  App.command_history = await App.get_local_storage(App.stor_command_history_name, [])
  App.debug(`Stor: Got command history`)
}

App.stor_save_command_history = () => {
  App.debug(`Stor: Saving command history`)
  App.save_local_storage(App.stor_command_history_name, App.command_history)
}

App.stor_get_filter_history = async () => {
  App.filter_history = await App.get_local_storage(App.stor_filter_history_name, [])
  App.debug(`Stor: Got filter history`)
}

App.stor_save_filter_history = () => {
  App.debug(`Stor: Saving filter history`)
  App.save_local_storage(App.stor_filter_history_name, App.filter_history)
}

App.stor_get_tag_history = async () => {
  App.tag_history = await App.get_local_storage(App.stor_tag_history_name, [])
  App.debug(`Stor: Got tag history`)
}

App.stor_save_tag_history = () => {
  App.debug(`Stor: Saving tag history`)
  App.save_local_storage(App.stor_tag_history_name, App.tag_history)
}

App.stor_get_title_history = async () => {
  App.title_history = await App.get_local_storage(App.stor_title_history_name, [])
  App.debug(`Stor: Got title history`)
}

App.stor_save_title_history = () => {
  App.debug(`Stor: Saving title history`)
  App.save_local_storage(App.stor_title_history_name, App.title_history)
}

App.stor_get_icon_history = async () => {
  App.icon_history = await App.get_local_storage(App.stor_icon_history_name, [])
  App.debug(`Stor: Got icon history`)
}

App.stor_save_icon_history = () => {
  App.debug(`Stor: Saving icon history`)
  App.save_local_storage(App.stor_icon_history_name, App.icon_history)
}

App.stor_get_first_time = async () => {
  App.first_time = await App.get_local_storage(App.stor_first_time_name, {})
  App.debug(`Stor: Got first time`)
}

App.stor_save_first_time = () => {
  App.debug(`Stor: Saving first_time`)
  App.save_local_storage(App.stor_first_time_name, App.first_time)
}