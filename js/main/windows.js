// Show a window on top with some content
App.show_window = function (html) {
  App.el("#show_window_content").innerHTML = html
  App.el("#show_window").style.display = "flex"
  App.window_open = true
}

// Show a window on top with some content
App.show_window_2 = function (el) {
  App.el("#show_window_content").innerHTML = ""
  App.el("#show_window_content").append(el)
  App.el("#show_window").style.display = "flex"
  App.window_open = true
}

// Hide the show window
App.hide_window = function () {
  let win = App.el("#show_window")
  win.style.display = "none"
  App.window_open = false
  App.window_mode = "none"
}

// Get a template
App.get_template = function (id) {
  return App.el(`#template_${id}`).innerHTML.trim()
}

// Show about information
App.show_about = function () {
  let template = App.get_template("about")
  App.show_window(template)
  let manifest = browser.runtime.getManifest()
  let s = `Grasshopper v${manifest.version}`
  App.el("#about_text").textContent = s
  App.window_mode = "about"
}

// Setup windows
App.setup_windows = function () {
  App.ev(App.el("#about_button"), "click", function () {  
    App.show_about()
  })

  App.ev(App.el("#show_window_top"), "click", function () {
    App.hide_window()
  })
}