App.alert = (message, args = {}) => {
  let def_args = {
    auto_hide_delay: 0,
    format: true,
  }

  let text = message.toString()

  function action(regex, func, full = false) {
    text = text.replace(regex, (match, g1) => {
      if (full) {
        return func(match)
      }

      return func(g1)
    })
  }

  App.def_args(def_args, args)
  App.start_popups()
  let msg = DOM.el(`#alert_message`)

  if (args.format) {
    text = text.replace(/<\/ ?blockquote>/g, ``)
    action(App.char_regex_3(`\``), App.to_bold)
    action(App.char_regex_3(`"`), App.to_bold, true)
    action(App.char_regex_1(`*`, 2), App.to_bold)
    action(App.char_regex_1(`*`), App.to_bold)
    action(App.char_regex_2(`_`, 2), App.to_bold)
    action(App.char_regex_2(`_`), App.to_bold)
  }

  text = App.make_html_safe(text)
  text = text.replace(/\n/g, `<br>`)
  msg.innerHTML = text
  App.show_popup(`alert`)

  if (args.auto_hide_delay > 0) {
    App.alert_timeout = setTimeout(() => {
      App.hide_alert()
    }, args.auto_hide_delay)
  }
}

App.alert_auto_hide = (message, force = false) => {
  if (!force) {
    if (!App.get_setting(`show_feedback`)) {
      App.footer_message(message)
      return
    }
  }

  App.alert(message, {auto_hide_delay: App.alert_auto_hide_delay})
}

App.hide_alert = () => {
  App.hide_popup(`alert`)
}