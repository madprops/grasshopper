App.datastore_prompt = () => {
  App.show_prompt({
    message: `Enter some text`,
    placeholder: `Text`,
    on_submit: (text) => {
      if (App.add_to_datastore(text)) {
        App.footer_message(`Datastore: Added`)
      }
    },
  })
}

App.add_to_datastore = (text, do_alert = true) => {
  if (!text) {
    return false
  }

  if (text.length < App.datastore_max) {
    if (do_alert) {
      App.alert(`Datastore: Text is too long`)
    }
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
  return true
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