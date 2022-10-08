// Get a template
App.get_template = function (id) {
  return App.el(`#template_${id}`).innerHTML.trim()
}

// Create a window
App.create_window = function (id) {
  let w = {
    open: false
  }

  let el = App.create("div", "window_main")
  let top = App.create("div", "window_top action unselectable")
  top.textContent = "Go Back"

  App.ev(top, "click", function () {
    w.hide()
  })

  el.append(top)

  let content = App.create("div", "window_content")
  content.innerHTML = App.get_template(id)
  el.append(content)

  w.element = el
  document.body.append(el)

  w.show = function () {
    w.element.style.display = "flex"
    w.open = true
    App.window_mode = id
  }
  
  w.hide = function () {
    w.element.style.display = "none"
    w.open = false
    App.window_mode = "none"
  }

  App.windows[id] = w
}

// Setup windows
App.setup_windows = function () {
  App.create_window("about")
  let manifest = browser.runtime.getManifest()
  let s = `Grasshopper v${manifest.version}`
  App.el("#about_text").textContent = s

  App.ev(App.el("#about_button"), "click", function () {  
    App.windows["about"].show()
  })

  App.create_window("closed_tabs") 
}