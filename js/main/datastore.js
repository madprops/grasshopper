App.datastore_prompt = () => {
  App.show_prompt({
    message: `Enter some text`,
    placeholder: `Text`,
    on_submit: (text) => {
      App.add_to_datastore(text)
    },
  })
}

App.add_to_datastore = (value, type = `Note`) => {
  if (!value) {
    return
  }

  if (typeof value !== `string`) {
    value = App.str(value, true)
  }

  if (!value.trim()) {
    return
  }

  if (value.length < App.datastore_max) {
    App.footer_message(`Datastore: Text is too long`)
  }

  let obj = {
    type,
    value,
    date: App.now(),
  }

  if (!App.datastore.items) {
    App.datastore.items = []
  }

  App.datastore.items.push(obj)

  if (App.datastore.items.length > App.datastore_max) {
    App.datastore.items = App.datastore.items.slice(-App.datastore_max)
  }

  App.stor_save_datastore()
  App.footer_message(`Datastore: Added`)
}

App.clear_datastore = () => {
  App.show_confirm(
    {
      message: `Are you sure you want to clear the datastore?`,
      confirm_action: () => {
        App.datastore.items = []
        App.stor_save_datastore()
        App.alert(`Datastore cleared`)
      },
    },
  )
}

App.browse_datastore = () => {
  let items = App.datastore.items || []
  let ds_items = []

  for (let item of items) {
    if (!item.value) {
      continue
    }

    ds_items.push({
      text: `${item.type}: ${item.value.substring(0, 20).trim()}`,
      action: () => {
        App.show_textarea({title: `Datastore Item `, text: item.value})
      },
    })
  }

  ds_items.reverse()

  App.show_context({
    items: ds_items,
  })
}

App.datastore_settings = () => {
  let data = App.get_settings_snapshot(``)
  App.add_to_datastore(data, `Settings`)
}

App.datastore_theme = () => {
  let data = App.get_settings_snapshot(`theme`)
  App.add_to_datastore(data, `Theme`)
}

App.datastore_urls = () => {
  let data = App.get_url_list()
  App.add_to_datastore(data, `URLs`)
}