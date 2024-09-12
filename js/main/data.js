App.export_data = (obj, what = `data`) => {
  App.show_textarea(`Copy ${what}`, App.str(obj, true))
}

App.import_data = (action, what = `data`) => {
  App.show_input({
    message: `Paste ${what}`,
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