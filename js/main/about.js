App.setup_about = () => {
  App.create_window({id: `about`, setup: () => {
    App.about_info_items = [
      `Up, Down, and Enter keys navigate and pick items`,
      `Type to filter items, press Tab to cycle-reuse`,
      `Cycle items with the top-left menu or (Shift) Tab`,
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
      `Ctrl + F shows the filter modes`,
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

    DOM.ev(DOM.el(`#about_info`), `click`, () => {
      App.show_full_about_info()
    })

    DOM.ev(DOM.el(`#about_close`), `click`, () => {
      App.hide_current_window()
    })

    let image = DOM.el(`#about_image`)

    DOM.ev(image, `click`, () => {
      if (image.classList.contains(`hue_rotate`)) {
        image.classList.remove(`hue_rotate`)
        image.classList.add(`invert`)
      }
      else if (image.classList.contains(`invert`)) {
        image.classList.remove(`invert`)

        if (App.about_flips >= 2) {
          App.about_flips = 0
          let img = DOM.el(`#about_image`)

          if (img.src.includes(`grasshopper.png`)) {
            img.src = `img/grasshopper_2.png`
          }
          else {
            img.src = `img/grasshopper.png`
          }
        }
        else {
          if (image.classList.contains(`flipped`)) {
            image.classList.remove(`flipped`)
          }
          else {
            image.classList.add(`flipped`)
          }

          App.about_flips += 1
        }
      }
      else {
        image.classList.add(`hue_rotate`)
      }
    })

    let info_full = DOM.el(`#about_info_full`)

    for (let item of App.about_info_items) {
      let el = DOM.create(`div`)
      el.textContent = item
      info_full.append(el)
    }

    let manifest = browser.runtime.getManifest()
    let s = `${App.name} v${manifest.version}`
    DOM.el(`#about_name`).textContent = s
    App.about_flips = 0
  },
  after_show: () => {
    App.start_about_info()
  },
  on_hide: () => {
    App.show_last_window()
  }, persistent: false, colored_top: true})
}

App.start_about_info = () => {
  DOM.el(`#about_info`).classList.remove(`hidden`)
  DOM.el(`#about_image`).classList.remove(`hidden`)
  DOM.el(`#about_info_full`).classList.add(`hidden`)
  DOM.el(`#about_info`).textContent = App.about_info_items[0]
}

App.show_full_about_info = () => {
  DOM.el(`#about_info`).classList.add(`hidden`)
  DOM.el(`#about_image`).classList.add(`hidden`)
  DOM.el(`#about_info_full`).classList.remove(`hidden`)
}