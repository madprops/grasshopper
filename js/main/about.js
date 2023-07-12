App.setup_about = () => {
  App.create_window({id: `about`, setup: () => {
    console.log(1)
    App.about_info_items = [
      `Up, Down, and Enter keys navigate and pick items`,
      `Type to filter items, press Tab to cycle-reuse`,
      `Cycle items with the top-left menu or (Shift) Tab`,
      `Cycle with Left and Right if filter is empty`,
      `Middle Click closes or opens items`,
      `Shift + Middle Click bypasses some confirmations`,
      `Shift + Up/Down selects multiple items`,
      `Shift + Home/End selects towards edges`,
      `Ctrl + Click selects multiple items`,
      `Shift + Click selects an item range`,
      `Right Click on items shows the context menu`,
      `Shift + Enter on items shows the context menu`,
      `Ctrl + Home goes to the top`,
      `Ctrl + End goes to the bottom`,
      `Ctrl + Left toggles the Main Menu`,
      `Ctrl + Right toggles Actions`,
      `Ctrl + Up moves tabs to the top`,
      `Ctrl + Down moves tabs to the bottom`,
      `Ctrl + Backspace goes back`,
      `Ctrl + F shows the filters`,
      `Ctrl + Dot goes to the playing tab`,
      `Ctrl + Delete removes items`,
      `Double click on empty tabs space opens a new tab`,
      `Shift while on scrollwheel makes it scroll faster`,
      `Escape clears the filter and closes windows/popups`,
      `Double tap Ctrl to show the command palette`,
      `To filter by title start with title:`,
      `To filter by url start with url:`,
      `To filter with regex start with re:`,
      `To filter by title with regex start with re_title:`,
      `To filter by url with regex start with re_url:`,
      `Hover the right side of items to pick and select`,
      `To perform gestures, hold the middle mouse button and move in a direction, then release`,
      `Command palette commands take into account selected items`,
    ]

    DOM.ev(DOM.el(`#about_close`), `click`, () => {
      App.hide_current_window()
    })

    let info = DOM.el(`#about_info`)

    for (let item of App.about_info_items) {
      let el = DOM.create(`div`)
      el.textContent = item
      info.append(el)
    }

    let manifest = browser.runtime.getManifest()
    let s = `${App.name} v${manifest.version}`
    DOM.el(`#about_name`).textContent = s
  },
  on_hide: () => {
    App.show_last_window()
  }, colored_top: true})
}