App.export_data = (obj) => {
  App.show_textarea(`Copy this to import later`, App.str(obj, true))
}

App.import_data = (action) => {
  App.show_input({
    message: `Paste data text here`,
    button: `Import`,
    action: (text) => {
      if (!text.trim()) {
        return true
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