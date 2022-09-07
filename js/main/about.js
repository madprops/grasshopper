// Setup about
App.setup_about = function () {
  App.ev(App.el("#about_button"), "click", function () {  
    App.show_about()
  })
}

// Show about information
App.show_about = function () {
  if (!App.about_ready) {
    App.setup_about_window()
  }

  App.msg_about.show()
}

// Setup about window
App.setup_about_window = function () {
  App.msg_about = Msg.factory(Object.assign({}, App.msg_settings_window))  
  App.msg_about.set_title("About")
  App.msg_about.set(App.template_about)
  let manifest = browser.runtime.getManifest()
  let s = `Grasshopper v${manifest.version}`
  App.el("#about_text").textContent = s
  App.about_ready = true
}