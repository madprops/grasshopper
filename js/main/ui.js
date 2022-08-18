// Arrange items depending on space
App.setup_ui = function () {
  let top = App.el("#top_container")
  
  if (top.scrollWidth > top.clientWidth) {
    App.el("#top_container").classList.add("top_container_column")
  }

  App.el("#help_button").addEventListener("click", function () {
    App.show_help()
  })
}

// Set version in trademark
App.set_version = function () {
  let manifest = browser.runtime.getManifest()
  App.el("#version").textContent = `v${manifest.version}`
}

// Show a help message
App.show_help = function () {
  let s = ""
  s += "This is a tool to go back to often-used URLs quickly.\n"
  s += "There's 2 modes, Favorites, and History.\n"
  s += "Favorites are items you save by clicking the icons on the left.\n"
  s += "History searches the browser history so you can save favorites.\n"
  s += "You can use the mousewheel on the icons to change their positon.\n"
  s += "Some settings are configurable in Configure.\n"
  s += "History is only fetched when necessary, so it's fast.\n"
  s = s.trim()

  alert(s)
}