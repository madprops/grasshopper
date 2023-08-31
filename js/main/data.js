App.export_data = (obj) => {
  App.show_textarea(`Copy this to import later`, JSON.stringify(obj, null, 2))
}

App.import_data = (action) => {
  App.show_input(`Paste data text here`, `Import`, (text) => {
    if (!text.trim()) {
      return
    }

    let json

    try {
      json = JSON.parse(text)
    }
    catch (err) {
      App.show_alert(`Invalid JSON`)
      return
    }

    if (json) {
      App.show_confirm(`Use this data?`, () => {
        action(json)
      })
    }
  })
}