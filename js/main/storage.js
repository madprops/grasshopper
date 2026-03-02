App.get_local_storage_old = async (ls_name) => {
  let obj = null

  try {
    let value = await App.local_get(ls_name)
    obj = App.obj(value)
  }
  catch (err) {
    App.error(err)
  }

  return obj
}

App.get_local_storage = async (ls_name, fallback) => {
  let keys = {}
  keys[ls_name] = fallback
  let ans = await App.browser().storage.local.get(keys)
  return ans[ls_name]
}

App.save_local_storage = async (ls_name, obj) => {
  let keys = {}
  keys[ls_name] = obj
  await App.browser().storage.local.set(keys)
}

App.stor_compat_check = async () => {
  if (!App.stor_compat.length) {
    return
  }

  let checked = await App.get_local_storage(App.stor_compat_check_name, false)

  if (!checked) {
    App.debug(`Stor: Compat`)

    for (let item of App.stor_compat) {
      let obj = await App.get_local_storage_old(item.old)

      if (obj !== null) {
        App.debug(`Stor: Converting ${item.old} to ${item.new}`)
        await App.save_local_storage(item.new, obj)

        try {
          App.browser().storage.local.set({[`${item.old}_backup`]: App.str(obj)})
        }
        catch (err) {
          // Do nothing
        }

        App.browser().storage.local.remove(item.old)
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

App.stor_save_settings = async () => {
  App.debug(`Stor: Saving settings`)
  await App.save_local_storage(App.stor_settings_name, App.settings)
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

App.stor_get_palette_history = async () => {
  App.palette_history = await App.get_local_storage(App.stor_palette_history_name, [])
  App.debug(`Stor: Got palette history`)
}

App.stor_save_palette_history = () => {
  App.debug(`Stor: Saving palette history`)
  App.save_local_storage(App.stor_palette_history_name, App.palette_history)
}

App.stor_get_tag_history = async () => {
  let def = [`jump`]
  App.tag_history = await App.get_local_storage(App.stor_tag_history_name, def)
  App.debug(`Stor: Got tag history`)
}

App.stor_save_tag_history = () => {
  App.debug(`Stor: Saving tag history`)
  App.save_local_storage(App.stor_tag_history_name, App.tag_history)
}

App.stor_get_group_history = async () => {
  let def = []
  App.group_history = await App.get_local_storage(App.stor_group_history_name, def)
  App.debug(`Stor: Got group history`)
}

App.stor_save_group_history = () => {
  App.debug(`Stor: Saving group history`)
  App.save_local_storage(App.stor_group_history_name, App.group_history)
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
  App.icon_history = await App.get_local_storage(App.stor_icon_history_name, App.default_icons.slice(0))
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

App.stor_get_notes = async () => {
  App.notes = await App.get_local_storage(App.stor_notes_name, ``)
  App.debug(`Stor: Got notes`)
}

App.stor_save_notes = () => {
  App.debug(`Stor: Saving notes`)
  App.save_local_storage(App.stor_notes_name, App.notes)
}

App.stor_get_bookmark_folder_picks = async () => {
  App.bookmark_folder_picks = await App.get_local_storage(App.stor_bookmark_folder_picks, [])
  App.debug(`Stor: Got bookmark folder picks`)
}

App.stor_save_bookmark_folder_picks = () => {
  App.debug(`Stor: Saving bookmark folder picks`)
  App.save_local_storage(App.stor_bookmark_folder_picks, App.bookmark_folder_picks)
}

App.stor_get_history_picks = async () => {
  App.history_picks = await App.get_local_storage(App.stor_history_picks, [])
  App.debug(`Stor: Got history picks`)
}

App.stor_save_history_picks = () => {
  App.debug(`Stor: Saving history picks`)
  App.save_local_storage(App.stor_history_picks, App.history_picks)
}

App.stor_get_datastore = async () => {
  App.datastore = await App.get_local_storage(App.stor_datastore, {})
  App.debug(`Stor: Got datastore`)
}

App.stor_save_datastore = () => {
  App.debug(`Stor: Saving datastore`)
  App.save_local_storage(App.stor_datastore, App.datastore)
}

App.stor_get_memory = async () => {
  App.memory = await App.get_local_storage(App.stor_memory, {})
  App.debug(`Stor: Got memory`)
}

App.stor_save_memory = () => {
  App.debug(`Stor: Saving memory`)
  App.save_local_storage(App.stor_memory, App.memory)
}

App.stor_get_ai = async () => {
  App.ai = await App.get_local_storage(App.stor_ai, {})
  App.debug(`Stor: Got ai`)
}

App.stor_save_ai = () => {
  App.debug(`Stor: Saving ai`)
  App.save_local_storage(App.stor_ai, App.ai)
}

App.local_get = async (key, fallback = undefined) => {
  let obj = await App.browser().storage.local.get(key)
  return obj[key] || fallback
}