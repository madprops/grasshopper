// Get a template
App.get_template = function (id) {
  return App.el(`#template_${id}`).innerHTML.trim()
}

// Create a window
App.create_window = function (id, setup = function() {}) {
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
  w.setup = false

  w.show = function () {
    if (!w.setup) {
      setup()
      w.setup = true
      console.info(`${id} window setup`)
    }

    App.hide_all_windows()
    w.element.style.display = "flex"
    App.window_mode = id
  }
  
  w.hide = function () {
    w.element.style.display = "none"
    App.window_mode = "tabs"
  }

  App.windows[id] = w
}

// Cycle between windows
App.cycle_windows = function (reverse = false) {
  if (reverse) {
    if (App.window_mode === "stars") {
      App.windows["stars"].hide()
    } else if (App.window_mode === "closed_tabs") {
      App.show_window("stars")
    } else if (App.window_mode === "history") {
      App.show_window("closed_tabs")
    } else {
      App.show_window("history")
    }
  } else {
    if (App.window_mode === "stars") {
      App.show_window("closed_tabs")
    } else if (App.window_mode === "closed_tabs") {
      App.show_window("history")
    } else if (App.window_mode === "history") {
      App.windows["history"].hide()
    } else {
      App.show_window("stars")
    }
  }
}

// Hide all windows
App.hide_all_windows = function () {
  for (let id in App.windows) {
    App.windows[id].hide()
  }
}

// Show a window by mode
App.show_window = async function (mode) {
  App.el(`#${mode}_container`).innerHTML = ""
  App.windows[mode].show()
  let items = await App[`get_${mode}`]()
  App.process_items(mode, items)
  let v = App.el("#tabs_filter").value.trim()
  App.el(`#${mode}_filter`).value = v
  App.do_item_filter(mode)
}