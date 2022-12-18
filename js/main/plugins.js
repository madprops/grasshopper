// Show color screen
App.show_colorscreen = function () {
  browser.tabs.create({
    url: browser.extension.getURL("plugins/colorscreen/index.html"), active: true
  })

  window.close()
}

// Show mine sweeper
App.show_minesweeper = function () {
  browser.tabs.create({
    url: browser.extension.getURL("plugins/minesweeper/index.html"), active: true
  })

  window.close()
}