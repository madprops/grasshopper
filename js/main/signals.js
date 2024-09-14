App.start_signals = () => {
  if (App.check_ready(`signals`)) {
    return
  }

  App.create_window({
    id: `signals`,
    setup: () => {
      let info = DOM.el(`#signals_info`)

      DOM.ev(info, `click`, () => {
        App.signal_info()
      })

      let close = DOM.el(`#signals_close`)

      DOM.ev(close, `click`, () => {
        App.hide_window()
      })
    },
    after_show: () => {
      App.fill_signals()
    },
    after_hide: () => { },
    colored_top: true,
  })
}

App.show_signals = () => {
  App.start_signals()
  App.show_window(`signals`)
}

App.fill_signals = () => {
  let container = DOM.el(`#signals_container`)
  container.innerHTML = ``
  let signals = App.get_setting(`signals`)

  for (let signal of signals) {
    let el = DOM.create(`div`, `signal_item`)
    let input = DOM.create(`input`, `signal_input`)
    input.type = `text`
    input.value = signal.name
    let btn = DOM.create(`button`, `signal_button`)

    DOM.ev(btn, `click`, () => {
      App.send_signal(signal.url)
      App.freeze_signal(el)
    })

    btn.textContent = `Go`
    el.append(input)
    el.append(btn)
    container.append(el)
  }
}

App.freeze_signal = (el) => {
  el.classList.add(`disabled`)

  setTimeout(() => {
    el.classList.remove(`disabled`)
  }, App.signal_freeze_delay)
}

App.signal_info = () => {
  let s = `Here you can send signals
  First you have to add some in Show Settings
  When you click the button it sends a GET request to the URL
  You can use this with your own webserver for instance to trigger actions`
  App.alert(App.periods(s))
}

App.send_signal = (url) => {
  fetch(url)
}