App.datastore_prompt = () => {
  App.show_prompt({
    placeholder: `Text`,
    on_submit: (text) => {
      App.add_to_datastore(text)
    },
  })
}

App.add_to_datastore = (value, type = `note`) => {
  if (!value) {
    return
  }

  if (typeof value !== `string`) {
    value = App.str(value, true)
  }

  if (!value.trim()) {
    return
  }

  if (value.length > App.datastore_max_text) {
    App.footer_message(`Datastore: Text is too long`)
    App.error_sound()
    return
  }

  let obj = {
    type,
    value,
    date: App.now(),
  }

  if (!App.datastore.items) {
    App.datastore.items = []
  }

  App.remove_from_list(App.datastore.items, value)
  App.datastore.items.push(obj)

  if (App.datastore.items.length > App.datastore_max) {
    App.datastore.items = App.datastore.items.slice(-App.datastore_max)
  }

  App.stor_save_datastore()
  App.footer_message(`Datastore: Added`)
  App.action_sound()
}

App.get_datastore_items = () => {
  return App.datastore.items || []
}

App.clear_datastore = () => {
  let items = App.get_datastore_items()

  if (!items.length) {
    App.alert(`Datastore is empty`)
    return
  }

  App.show_confirm(
    {
      message: `Clear the datastore?`,
      confirm_action: () => {
        App.datastore.items = []
        App.stor_save_datastore()
        App.alert_autohide(`Datastore cleared`)
      },
    },
  )
}

App.browse_datastore = () => {
  let items = App.get_datastore_items()
  let ds_items = []

  for (let item of items) {
    if (!item.value) {
      continue
    }

    ds_items.push({
      text: `${item.type}: ${item.value.substring(0, 20).trim()}`,
      action: () => {
        let c_items = [
          {
            text: `View`,
            action: () => {
              App.show_textarea({title: `Datastore Item `, text: item.value})
            },
          },
        ]

        if (item.value) {
          if ([`settings`, `theme`].includes(item.type)) {
            c_items.push({
              text: `Import`,
              action: () => {
                App.import_settings(item.value)
              },
            })
          }
          else if ([`urls`].includes(item.type)) {
            c_items.push({
              text: `Open`,
              action: () => {
                App.open_tab_urls(item.value)
              },
            })
          }
          else if ([`note`].includes(item.type)) {
            c_items.push({
              text: `Apply (Tab)`,
              action: () => {
                let it = App.get_selected(`tabs`)

                if (it) {
                  App.apply_notes(it, item.value)
                }
              },
            })

            c_items.push({
              text: `Append (Tab)`,
              action: () => {
                let it = App.get_selected(`tabs`)

                if (it) {
                  App.append_note(it, item.value)
                }
              },
            })

            c_items.push({
              text: `Prepend (Tab)`,
              action: () => {
                let it = App.get_selected(`tabs`)

                if (it) {
                  App.prepend_note(it, item.value)
                }
              },
            })

            c_items.push({
              text: `Apply (Global)`,
              action: () => {
                App.apply_global_notes(item.value)
              },
            })

            c_items.push({
              text: `Append (Global)`,
              action: () => {
                App.append_global_note(item.value)
              },
            })

            c_items.push({
              text: `Prepend (Global)`,
              action: () => {
                App.prepend_global_note(item.value)
              },
            })
          }
        }

        if (c_items.length === 1) {
          c_items[0].action()
        }
        else {
          App.show_context({
            title: `Action`,
            title_icon: App.action_icon,
            items: c_items,
          })
        }
      },
    })
  }

  ds_items.reverse()

  App.show_context({
    title: `Datastore (${items.length})`,
    title_icon: App.data_icon,
    items: ds_items,
  })
}

App.datastore_settings = () => {
  let data = App.get_settings_snapshot(``)
  App.add_to_datastore(data, `settings`)
}

App.datastore_theme = () => {
  let data = App.get_settings_snapshot(`theme`)
  App.add_to_datastore(data, `theme`)
}

App.datastore_urls = () => {
  let data = App.get_url_list()
  App.add_to_datastore(data, `urls`)
}

App.export_datastore = () => {
  App.export_data(`Datastore`, App.datastore)
}

App.import_datastore = () => {
  App.import_data(`Datastore`, (obj) => {
    App.datastore = obj
    App.stor_save_datastore()
    App.footer_message(`Datastore: Imported`)
    App.action_sound()
  })
}