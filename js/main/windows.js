// Get a template
App.get_template = function (id) {
  let template = App.el(`#template_${id}`)

  if (template) {
    return template.innerHTML.trim()
  }
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

  if (args.cls === undefined) {
    args.cls = "normal"
  }

  let w = {}
  let el = App.create("div", `window_main window_main_${args.cls}`, `window_${args.id}`)

  if (args.show_top) {
    let top = App.create("div", `window_top window_top_${args.align_top} window_top_${args.cls}`, `window_top_${args.id}`)
    let top_html = App.get_template(`${args.id}_top`)

    if (top_html) {
      top.innerHTML = top_html
    }
  
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

  let content = App.create("div", `window_content window_content_${args.cls}`, `window_content_${args.id}`)
  let content_html = App.get_template(args.id)

  if (content_html) {
    content.innerHTML = content_html
  }

  el.append(content)
  w.element = el
  App.el("#main").append(el)
  w.setup = false

  w.show = function (scroll = true) {
    if (args.setup && !w.setup) {
      args.setup()
      w.setup = true
      console.info(`${args.id} window setup`)
    }

    App.hide_all_windows()
    w.element.style.display = "flex"
    App.last_window_mode = App.window_mode
    App.window_mode = args.id

    if (scroll) {
      content.scrollTop = 0
    }

    if (args.after_show) {
      args.after_show()
    }
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
  if (App.item_order.includes(mode)) {
    App.show_item_window(mode)
  } else {
    App.windows[mode].show()
  }
}

// Show the last window
App.show_last_window = function () {
  App.windows[App.last_window_mode].show(false)
}

// Create a popup
App.create_popup = function (args) {
  let p = {}
  p.setup = false
  
  let popup = App.create("div", "popup_main", `popup_${args.id}`)
  popup.innerHTML = App.get_template(args.id)
  App.el("#main").append(popup)
  p.element = popup

  p.show = function () {
    if (args.setup && !App.popups[args.id].setup) {
      args.setup()
    }
    
    p.element.style.display = "flex"
  }
  
  p.hide = function () {
    p.element.style.display = "none"
  }
  
  App.popups[args.id] = p
}

// Show popup
App.show_popup = function (id) {
  App.popups[id].show()
}