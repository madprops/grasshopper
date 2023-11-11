const App = {}
App.ls_state = `colorscreen_state_v1`
App.colorlib = ColorLib()
App.default_color = `#252933`
App.visible = false
App.timeout_delay = 250

App.init = () => {
  DOM.ev(DOM.el(`#fullscreen_button`), `click`, () => {
    if (!App.visible) {
      return
    }

    App.toggle_fullscreen()
  })

  DOM.ev(DOM.el(`#random_button`), `click`, () => {
    if (!App.visible) {
      return
    }

    App.set_color(App.colorlib.get_random_hex())
  })

  DOM.ev(DOM.el(`#darker_button`), `click`, () => {
    if (!App.visible) {
      return
    }

    App.set_color(App.colorlib.get_darker(App.get_reference(), 0.15))
  })

  DOM.ev(DOM.el(`#lighter_button`), `click`, () => {
    if (!App.visible) {
      return
    }

    App.set_color(App.colorlib.get_lighter(App.get_reference(), 0.15))
  })

  DOM.ev(DOM.el(`#exact_button`), `click`, () => {
    if (!App.visible) {
      return
    }

    App.get_exact_color()
  })

  DOM.ev(DOM.el(`#red_button`), `click`, () => {
    if (!App.visible) {
      return
    }

    App.set_color(`rgb(255, 0, 0)`)
  })

  DOM.ev(DOM.el(`#green_button`), `click`, () => {
    if (!App.visible) {
      return
    }

    App.set_color(`rgb(0, 255, 0)`)
  })

  DOM.ev(DOM.el(`#blue_button`), `click`, () => {
    if (!App.visible) {
      return
    }

    App.set_color(`rgb(0, 0, 255)`)
  })

  DOM.ev(DOM.el(`#black_button`), `click`, () => {
    if (!App.visible) {
      return
    }

    App.set_color(`rgb(0, 0, 0)`)
  })

  DOM.ev(DOM.el(`#white_button`), `click`, () => {
    if (!App.visible) {
      return
    }

    App.set_color(`rgb(255, 255, 255)`)
  })

  DOM.ev(DOM.el(`#buttons`), `mouseenter`, () => {
    clearTimeout(App.show_timeout)

    App.show_timeout = setTimeout(() => {
      DOM.el(`#buttons`).classList.add(`visible`)
      App.visible = true
    }, App.timeout_delay)
  })

  DOM.ev(DOM.el(`#buttons`), `mouseleave`, () => {
    clearTimeout(App.show_timeout)

    DOM.el(`#buttons`).classList.remove(`visible`)
    App.visible = false
  })

  App.state = App.get_local_storage(App.ls_state) || {}
  App.set_color(App.state.color || App.default_color)
}

App.set_color = (color) => {
  App.set_reference(color)
  let color_1 = App.get_reference()
  let color_2 = App.colorlib.get_lighter_or_darker(color_1, 0.5)
  document.documentElement.style.setProperty(`--color_1`, color_1)
  document.documentElement.style.setProperty(`--color_2`, color_2)
  App.save_local_storage(App.ls_state, {color: color_1})
  DOM.el(`#color_info`).textContent = color_1
}

App.toggle_fullscreen = () => {
  if(document.fullscreenElement) {
    document.exitFullscreen()
  }
  else {
    document.documentElement.requestFullscreen()
  }
}

App.set_reference = (color) => {
  DOM.el(`#reference`).style.color = color
}

App.get_reference = () => {
  return window.getComputedStyle(DOM.el(`#reference`)).color
}

App.get_exact_color = () => {
  let input = prompt(`Enter color name, rgb, or hex`)

  if (!input) {
    return
  }

  App.set_color(input)
}

App.get_local_storage = (ls_name) => {
  let obj

  if (localStorage[ls_name]) {
    try {
      obj = JSON.parse(localStorage.getItem(ls_name))
    }
    catch (err) {
      localStorage.removeItem(ls_name)
      obj = null
    }
  }
  else {
    obj = null
  }

  return obj
}

App.save_local_storage = (ls_name, obj) => {
  localStorage.setItem(ls_name, JSON.stringify(obj))
}