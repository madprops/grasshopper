App.alert = (message, autohide_delay = 0) => {
  App.start_popups()
  let msg = DOM.el(`#alert_message`)
  message = message.toString()
  let text = App.make_html_safe(message)
  text = text.replace(/\n/g, `<br>`)
  msg.innerHTML = text
  App.show_popup(`alert`)

  if (autohide_delay > 0) {
    App.alert_timeout = setTimeout(() => {
      App.hide_popup(`alert`)
    }, autohide_delay)
  }
}

App.alert_autohide = (message, force = false) => {
  if (!force) {
    if (!App.get_setting(`show_feedback`)) {
      App.footer_message(message)
      return
    }
  }

  App.alert(message, App.alert_autohide_delay)
}