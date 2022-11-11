// Get a template
App.get_template = function (id) {
  return App.el(`#template_${id}`).innerHTML.trim()
}

// Create a window
App.create_window = function (args) {
  if (args.close_button === undefined) {
    args.close_button = true
  }

  if (args.align_top === undefined) {
    args.align_top = "center"
  }

  if (args.show_top === undefined) {
    args.show_top = true
  }

  let w = {}
  let el = App.create("div", "window_main", `window_${args.id}`)

  if (args.show_top) {
    let top = App.create("div", `window_top window_top_${args.align_top}`)
    top.innerHTML = App.get_template(`${args.id}_top`)
  
    if (args.close_button) {
      let x = App.create("div", "window_x action unselectable")
      x.textContent = "x"
      top.append(x)
    
      App.ev(x, "click", function () {
        if (args.on_x) {
          args.on_x()
        } else {
          w.hide()
        }
      })
    }
  
    el.append(top)
  }

  let content = App.create("div", "window_content")
  content.innerHTML = App.get_template(args.id)
  el.append(content)

  w.element = el
  document.body.append(el)
  w.setup = false

  w.show = function () {
    if (args.setup && !w.setup) {
      args.setup()
      w.setup = true
      console.info(`${args.id} window setup`)
    }

    App.hide_all_windows()
    w.element.style.display = "flex"
    App.last_window_mode = App.window_mode
    App.window_mode = args.id
    content.scrollTop = 0
  }
  
  w.hide = function () {
    if (args.on_hide) {
      args.on_hide()
    } else {
      App.show_first_item_window()
    }
  }

  App.windows[args.id] = w
}

// Hide window
App.hide_window = function (w) {
  w.element.style.display = "none"
}

// Hide all windows
App.hide_all_windows = function () {
  for (let id in App.windows) {
    App.hide_window(App.windows[id])
  }
}

// Centralized function to show windows
App.show_window = function (mode) {
  if (App.window_order.includes(mode)) {
    App.show_item_window(mode)
  } else {
    App.windows[mode].show()
  }
}

// Show the last window
App.show_last_window = function () {
  App.show_window(App.last_window_mode)
}