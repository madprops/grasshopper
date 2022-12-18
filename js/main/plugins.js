// Show color screen
App.show_colorscreen = function () {
  browser.tabs.create({
    url: browser.extension.getURL("plugins/colorscreen/index.html"), active: true
  })

  window.close()
}