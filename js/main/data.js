App.export_data = (what, obj) => {
  App.show_textarea(`Copy ${what} Data`, App.str(obj, true))
}

App.import_data = (what, action, value = ``) => {
  App.show_input({
    value,
    message: `Paste ${what} Data`,
    button: `Import`,
    action: (text) => {
      if (!text.trim()) {
        return false
      }

      let json

      try {
        json = App.obj(text)
      }
      catch (err) {
        App.alert(`${err}`)
        return false
      }

      if (json) {
        App.show_confirm({
          message: `Use this data?`,
          confirm_action: () => {
            action(json)
          },
        })
      }

      return true
    },
  })
}