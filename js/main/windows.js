// Get a template
App.get_template = function (id) {
  return App.el(`#template_${id}`).innerHTML.trim()
}

// Create a window
App.create_window = function (id) {
  let w = {}
  let el = App.create("div", "window_main", `window_${id}`)
  let top = App.create("div", "window_top")
  top.innerHTML = App.get_template(`${id}_top`)
  let x = App.create("div", "window_x action unselectable")
  x.textContent = "x"
  top.append(x)

  App.ev(x, "click", function () {
    w.hide()
  })

  el.append(top)

  let content = App.create("div", "window_content main")
  content.innerHTML = App.get_template(id)
  el.append(content)

  w.element = el
  document.body.append(el)

  w.show = function () {
    App.hide_all_windows()
    w.element.style.display = "flex"
    App.window_mode = id
  }
  
  w.hide = function () {
    w.element.style.display = "none"
    App.window_mode = "none"
  }

  App.windows[id] = w
}

// Cycle between windows
App.cycle_windows = function () {
  if (App.window_mode === "closed_tabs") {
    App.show_history()
  } else if (App.window_mode === "history") {
    App.windows["history"].hide()
  } else {
    App.show_closed_tabs()
  }
}

// Hide all windows
App.hide_all_windows = function () {
  for (let id in App.windows) {
    App.windows[id].hide()
  }
}