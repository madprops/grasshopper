App.show_plugin = async (name) => {
  let url = await browser.extension.getURL(`plugins/${name}/index.html`)
  let tabs = await App.get_tabs()

  // Focus or launch
  for (let tab of tabs) {
    if (App.urls_equal(tab.url, url)) {
      let o = {
        id: tab.id,
        window_id: tab.windowId
      }

      await App.focus_tab(o)
      return
    }
  }

  await App.open_tab(url)
  App.check_close_on_focus()
}

App.show_colorscreen = () => {
  App.show_plugin(`colorscreen`)
}

App.show_minesweeper = () => {
  App.show_plugin(`minesweeper`)
}

App.show_hoff = () => {
  App.show_plugin(`hoff`)
}