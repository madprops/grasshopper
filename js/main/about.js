App.setup_about = () => {
  App.create_window({id: `about`, setup: () => {
    App.about_info_items = [
      `Up, Down, and Enter keys navigate and pick items`,
      `Type to filter items, press Tab to cycle-reuse`,
      `Cycle modes with the top-left menu or (Shift) Tab`,
      `Cycle with Left and Right if filter is empty`,
      `Middle Click closes or opens items`,
      `Shift + Middle Click unloads tabs`,
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
      `Some keys can be used without Ctrl if filter is empty`,
      `Double click on empty tabs space opens a new tab`,
      `Escape clears the filter and closes windows/popups`,
      `Double tap Ctrl to show the command palette`,
      `Command palette commands take into account selected items`,
      `To filter by title start with title:`,
      `To filter by URL start with url:`,
      `To filter with regex start with re:`,
      `To filter with regex by title start with re_title:`,
      `To filter with regex by URL start with re_url:`,
      `To perform gestures, hold the middle mouse button and move in a direction, then release`,
      `Some interface elements can be mapped to commands on middle click`,
      `The profile editor can help you organize and find tabs`,
      `Data like settings and profiles can be exported and imported`,
      `Alt + Click selects items without triggering actions`,
      `Right Click on the filter shows recent filters used`,
      `In the filter, $day resolves to the current week day`,
      `In the filter, $month resolves to the current month name`,
      `In the filter, $year resolves to the full year number`,
      `The filter mode 'No Tab' shows items that are not open in a tab`,
    ]

    let close = DOM.el(`#about_close`)

    DOM.evs(close, [`click`, `auxclick`], () => {
      App.hide_window()
    })

    close.textContent = App.close_text

    let image = DOM.el(`#about_image`)

    DOM.ev(image, `click`, () => {
      if (image.classList.contains(`rotate_1`)) {
        image.classList.remove(`rotate_1`)
        image.classList.add(`invert`)
      }
      else if (image.classList.contains(`invert`)) {
        image.classList.remove(`invert`)

        if (image.classList.contains(`flipped`)) {
          image.classList.remove(`flipped`)
        }
        else {
          image.classList.add(`flipped`)
        }
      }
      else {
        image.classList.add(`rotate_1`)
      }
    })

    let info = DOM.el(`#about_info`)

    for (let item of App.about_info_items) {
      let el = DOM.create(`div`, `about_info_item filter_item filter_text`)
      el.textContent = item
      info.append(el)
    }

    let s = `${App.manifest.name} v${App.manifest.version}`
    DOM.el(`#about_name`).textContent = s
  },
  after_show: () => {
    let filter = DOM.el(`#about_filter`)

    if (filter.value) {
      App.clear_about_filter()
    }

    DOM.el(`#about_started`).textContent = `Started: ${App.timeago(App.start_date)}`
    DOM.el(`#about_installed`).textContent = `Installed: ${App.timeago(App.first_time.date)}`
    let image = DOM.el(`#about_image`)
    image.classList.remove(`rotate_1`)
    image.classList.remove(`invert`)
    image.classList.remove(`flipped`)
    filter.focus()
  }, colored_top: true})
}

App.about_filter_focused = () => {
  return document.activeElement.id === `about_filter`
}

App.clear_about_filter = () => {
  if (App.filter_has_value(`about`)) {
    App.set_filter(`about`, ``)
  }
  else {
    App.hide_window()
  }
}

App.filter_about_debouncer = App.create_debouncer(() => {
  App.do_filter_about()
}, App.filter_delay_2)

App.filter_about = () => {
  App.filter_about_debouncer.call()
}

App.do_filter_about = () => {
  App.filter_about_debouncer.cancel()
  App.do_filter_2(`about`)
}