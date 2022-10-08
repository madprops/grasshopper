// Get a template
App.get_template = function (id) {
  return App.el(`#template_${id}`).innerHTML.trim()
}

// Create a window
App.create_window = function (args) {
  let w = {}
  let el = App.create("div", "window_main")

  if (args.top === "panel") {
    let top = App.create("div", "window_top action unselectable")
    top.textContent = "Go Back"
  
    App.ev(top, "click", function () {
      w.hide()
    })

    el.append(top)
  } else if (args.top === "x") {
    let top = App.create("div", "window_top_2")
    top.innerHTML = App.get_template(`${args.id}_top`)
    let x = App.create("div", "window_x action unselectable")
    x.textContent = "x"
    top.append(x)
  
    App.ev(x, "click", function () {
      w.hide()
    })

    el.append(top)
  }

  let content = App.create("div", "window_content")
  content.innerHTML = App.get_template(args.id)
  el.append(content)

  w.element = el
  document.body.append(el)

  w.show = function () {
    w.element.style.display = "flex"
    App.window_mode = args.id
  }
  
  w.hide = function () {
    w.element.style.display = "none"
    App.window_mode = "none"
  }

  App.windows[args.id] = w
}

// Setup windows
App.setup_windows = function () {
  App.create_window({id:"about", top: "panel"})
  let manifest = browser.runtime.getManifest()
  let s = `Grasshopper v${manifest.version}`
  App.el("#about_text").textContent = s

  App.ev(App.el("#about_button"), "click", function () {  
    App.windows["about"].show()
  })

  App.create_window({id:"closed_tabs", top: "x"}) 
  let filter = App.el("#closed_tabs_filter")

  App.filter_closed_tabs = App.create_debouncer(function () {
    App.do_filter_closed_tabs()
  }, App.filter_delay)
  
  App.ev(filter, "input", function () {
    App.filter_closed_tabs()
  })
}