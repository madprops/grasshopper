App.plugins = [
  {name: `Colorscreen`, id: `colorscreen`, cmd: `show_colorscreen`},
  {name: `Minesweeper`, id: `minesweeper`, cmd: `show_minesweeper`},
  {name: `Hoff Notes`, id: `hoff`, cmd: `show_hoff`},
]

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

App.get_plugin_menu_items = () => {
  let items = []

  items.push({
    text: `Colorscreen`,
    action: () => {
      App.show_plugin(`colorscreen`)
    }
  })

  items.push({
    text: `Minesweeper`,
    action: () => {
      App.show_plugin(`minesweeper`)
    }
  })

  items.push({
    text: `Hoff Notes`,
    action: () => {
      App.show_plugin(`hoff`)
    }
  })

  return items
}