App.export_data = (what, obj) => {
  App.show_textarea(`Copy ${what} data`, App.str(obj, true))
}

App.import_data = (what, action) => {
  App.show_input({
    message: `Paste ${what} data`,
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