App.datastore_prompt = () => {
  App.show_prompt({
    message: `Enter some text`,
    placeholder: `Text`,
    on_submit: (text) => {
      App.add_to_datastore(text)
    },
  })
}

App.add_to_datastore = (text) => {
  if (!text) {
    return
  }

  text = JSON.stringify(text)

  if (text.length < App.datastore_max) {
    App.footer_message(`Datastore: Text is too long`)
  }

  let obj = {
    date: App.now(),
    text: text,
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
    }
  )
}

App.datastore_settings = () => {
  let data = App.get_settings_snapshot(``)
  App.add_to_datastore(data)
}

App.datastore_theme = () => {
  let data = App.get_settings_snapshot(`theme`)
  App.add_to_datastore(data)
}

App.datastore_urls = () => {
  let data = App.get_url_list()
  App.add_to_datastore(data)
}