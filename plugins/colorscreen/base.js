const App = {}
App.ls_state = `colorscreen_state_v1`
App.colorlib = ColorLib()
App.default_color = `#252933`
App.visible = false

App.init = () => {
  App.el(`#fullscreen_button`).addEventListener(`click`, () => {
    if (!App.visible) {return}
    App.toggle_fullscreen()
  })

  App.el(`#random_button`).addEventListener(`click`, () => {
    if (!App.visible) {return}
    App.set_color(App.colorlib.get_random_hex())
  })

  App.el(`#darker_button`).addEventListener(`click`, () => {
    if (!App.visible) {return}
    App.set_color(App.colorlib.get_darker(App.get_reference(), 0.15))
  })

  App.el(`#lighter_button`).addEventListener(`click`, () => {
    if (!App.visible) {return}
    App.set_color(App.colorlib.get_lighter(App.get_reference(), 0.15))
  })

  App.el(`#exact_button`).addEventListener(`click`, () => {
    if (!App.visible) {return}
    App.get_exact_color()
  })

  App.el(`#red_button`).addEventListener(`click`, () => {
    if (!App.visible) {return}
    App.set_color(`rgb(255, 0, 0)`)
  })

  App.el(`#green_button`).addEventListener(`click`, () => {
    if (!App.visible) {return}
    App.set_color(`rgb(0, 255, 0)`)
  })

  App.el(`#blue_button`).addEventListener(`click`, () => {
    if (!App.visible) {return}
    App.set_color(`rgb(0, 0, 255)`)
  })

  App.el(`#black_button`).addEventListener(`click`, () => {
    if (!App.visible) {return}
    App.set_color(`rgb(0, 0, 0)`)
  })

  App.el(`#white_button`).addEventListener(`click`, () => {
    if (!App.visible) {return}
    App.set_color(`rgb(255, 255, 255)`)
  })

  App.el(`#buttons`).addEventListener(`mouseenter`, () => {
    clearTimeout(App.show_timeout)

    App.show_timeout = setTimeout(() => {
      App.el(`#buttons`).classList.add(`visible`)
      App.visible = true
    }, 500)
  })

  App.el(`#buttons`).addEventListener(`mouseleave`, () => {
    clearTimeout(App.show_timeout)

    App.el(`#buttons`).classList.remove(`visible`)
    App.visible = false
  })

  App.state = App.get_local_storage(App.ls_state) || {}
  App.set_color(App.state.color || App.default_color)
}

App.el = (query, root = document) => {
  return root.querySelector(query)
}

App.set_color = (color) => {
  App.set_reference(color)
  let color_1 = App.get_reference()
  let color_2 = App.colorlib.get_lighter_or_darker(color_1, 0.5)
  document.documentElement.style.setProperty(`--color_1`, color_1)
  document.documentElement.style.setProperty(`--color_2`, color_2)
  App.save_local_storage(App.ls_state, {color: color_1})
  App.el(`#color_info`).textContent = color_1
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
  App.el(`#reference`).style.color = color
}

App.get_reference = () => {
  return window.getComputedStyle(App.el(`#reference`)).color
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

App.init()