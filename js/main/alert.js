App.show_alert = (message, autohide_delay = 0, pre = true) => {
  App.start_popups()
  let msg = DOM.el(`#alert_message`)

  if (pre) {
    msg.classList.add(`pre`)
  }
  else {
    msg.classList.remove(`pre`)
  }

  let text = App.make_html_safe(message)
  text = text.replace(/\n/g, `<br>`)
  msg.innerHTML = text
  App.show_popup(`alert`)

  if (autohide_delay > 0) {
    App.alert_autohide = setTimeout(() => {
      App.hide_popup(`alert`)
    }, autohide_delay)
  }
}

App.show_alert_2 = (message) => {
  App.show_alert(message, 0, false)
}

App.show_feedback = (message, force = false) => {
  if (!force) {
    if (!App.get_setting(`show_feedback`)) {
      return
    }
  }

  App.show_alert(message, App.alert_autohide_delay)
}

App.show_feedback_2 = (message, force = false) => {
  if (!force) {
    if (!App.get_setting(`show_feedback`)) {
      return
    }
  }

  App.show_alert(message, App.alert_autohide_delay, false)
}