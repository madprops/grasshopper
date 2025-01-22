const App = {}
App.ls_state = `colorscreen_state_v1`
App.colorlib = ColorLib()
App.default_color = `#252933`
App.visible = false
App.timeout_delay = 250
App.image_state = 0

App.init = () => {
  App.setup_events()
  App.setup_state()
}

App.setup_events = () => {
  DOM.ev(DOM.el(`#fullscreen_button`), `click`, () => {
    if (App.disabled()) {
      return
    }

    App.toggle_fullscreen()
  })

  DOM.ev(DOM.el(`#random_button`), `click`, () => {
    if (App.disabled()) {
      return
    }

    App.set_color(App.colorlib.get_random_hex())
  })

  DOM.ev(DOM.el(`#darker_button`), `click`, () => {
    if (App.disabled()) {
      return
    }

    App.set_color(App.colorlib.get_darker(App.get_reference(), 0.15))
  })

  DOM.ev(DOM.el(`#lighter_button`), `click`, () => {
    if (App.disabled()) {
      return
    }

    App.set_color(App.colorlib.get_lighter(App.get_reference(), 0.15))
  })

  DOM.ev(DOM.el(`#exact_button`), `click`, () => {
    if (App.disabled()) {
      return
    }

    App.get_exact_color()
  })

  DOM.ev(DOM.el(`#red_button`), `click`, () => {
    if (App.disabled()) {
      return
    }

    App.set_color(`rgb(255, 0, 0)`)
  })

  DOM.ev(DOM.el(`#green_button`), `click`, () => {
    if (App.disabled()) {
      return
    }

    App.set_color(`rgb(0, 255, 0)`)
  })

  DOM.ev(DOM.el(`#blue_button`), `click`, () => {
    if (App.disabled()) {
      return
    }

    App.set_color(`rgb(0, 0, 255)`)
  })

  DOM.ev(DOM.el(`#black_button`), `click`, () => {
    if (App.disabled()) {
      return
    }

    App.set_color(`rgb(0, 0, 0)`)
  })

  DOM.ev(DOM.el(`#white_button`), `click`, () => {
    if (App.disabled()) {
      return
    }

    App.set_color(`rgb(255, 255, 255)`)
  })

  DOM.ev(DOM.el(`#buttons`), `mouseenter`, () => {
    App.show()
  })

  DOM.ev(DOM.el(`#buttons`), `mouseleave`, () => {
    App.hide()
  })

  DOM.ev(DOM.el(`#image`), `click`, (e) => {
    App.image_click(e.target)
  })

  DOM.ev(DOM.el(`#lock`), `click`, (e) => {
    App.toggle_lock(e.target)
  })

  DOM.ev(DOM.el(`#sticky`), `click`, (e) => {
    App.toggle_sticky(e.target)
  })
}

App.setup_state = () => {
  App.state = App.get_local_storage(App.ls_state) || {}

  if (App.state.locked !== undefined) {
    App.locked = App.state.locked
  }
  else {
    App.locked = false
  }

  if (App.state.sticky !== undefined) {
    App.sticky = App.state.sticky
  }
  else {
    App.sticky = true
  }

  if (App.locked) {
    DOM.el(`#lock`).checked = true
  }

  if (App.sticky) {
    DOM.el(`#sticky`).checked = true
    App.show()
  }

  App.set_color(App.state.color || App.default_color)
}

App.set_color = (color) => {
  App.set_reference(color)
  let color_1 = App.get_reference()
  let color_2 = App.colorlib.get_lighter_or_darker(color_1, 0.66)
  document.documentElement.style.setProperty(`--color_1`, color_1)
  document.documentElement.style.setProperty(`--color_2`, color_2)
  DOM.el(`#color_info`).textContent = color_1
  App.state.color = color_1
  App.save_state()
}

App.toggle_fullscreen = () => {
  if (document.fullscreenElement) {
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

App.save_state = () => {
  App.save_local_storage(App.ls_state, App.state)
}

App.toggle_lock = (checkbox) => {
  App.locked = checkbox.checked
  App.state.locked = App.locked
  App.save_state()
}

App.toggle_sticky = (checkbox) => {
  App.sticky = checkbox.checked

  if (App.sticky) {
    App.show(true)
  }
  else {
    App.hide()
  }

  App.state.sticky = App.sticky
  App.save_state()
}

App.disabled = () => {
  return !App.visible || App.locked
}

App.show = (instant = false) => {
  clearTimeout(App.show_timeout)
  let delay

  if (instant) {
    delay = 0
  }
  else {
    delay = App.timeout_delay
  }

  App.show_timeout = setTimeout(() => {
    DOM.el(`#buttons`).classList.add(`visible`)
    App.visible = true
  }, delay)
}

App.hide = () => {
  if (App.sticky) {
    return
  }

  clearTimeout(App.show_timeout)
  DOM.el(`#buttons`).classList.remove(`visible`)
  App.visible = false
}

App.image_click = (image) => {
  image.classList.remove(`invert`)
  image.classList.remove(`rotate_1`)
  image.classList.remove(`rotate_2`)
  image.classList.remove(`rotate_3`)

  App.image_state += 1

  if (App.image_state === 1) {
    image.classList.add(`invert`)
  }
  else if (App.image_state === 2) {
    image.classList.add(`rotate_1`)
  }
  else if (App.image_state === 3) {
    image.classList.add(`rotate_2`)
  }
  else if (App.image_state === 4) {
    image.classList.add(`rotate_3`)
  }
  else if (App.image_state === 5) {
    App.image_state = 0
  }
}