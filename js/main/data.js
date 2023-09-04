App.export_data = (obj) => {
  App.show_textarea(`Copy this to import later`, App.str(obj))
}

App.import_data = (action) => {
  App.show_input(`Paste data text here`, `Import`, (text) => {
    if (!text.trim()) {
      return true
    }

    let json

    try {
      json = App.obj(text)
    }
    catch (err) {
      App.show_alert_2(`${err}`)
      return false
    }

    if (json) {
      App.show_confirm(`Use this data?`, () => {
        action(json)
      })
    }

    return true
  })
}