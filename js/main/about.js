App.setup_about = () => {
  App.create_window({id: `about`, setup: () => {
    App.about_info_items = [
      `Up, Down, and Enter keys navigate and pick items`,
      `Type to filter items, press Tab to cycle-reuse`,
      `Cycle items with the top-left menu or (Shift) Tab`,
      `Middle Click closes or launches items`,
      `Shift + Middle Click bypasses some confirmations`,
      `Shift + Up/Down selects multiple items`,
      `Ctrl + Click selects multiple items`,
      `Shift + Click selects an item range`,
      `Right Click on items shows the context menu`,
      `Shift + Enter on items shows the context menu`,
      `Delete removes items`,
      `Ctrl + A selects all items`,
      `Ctrl + Home goes to the top`,
      `Ctrl + End goes to the bottom`,
      `Ctrl + Home goes to the top of a list`,
      `Ctrl + End goes to the bottom of a list`,
      `Ctrl + Left togles Main Menu`,
      `Ctrl + Right toggles Actions`,
      `Ctrl + Up moves tabs to the top`,
      `Ctrl + Down moves tabs to the bottom`,
      `Ctrl + Backspace goes to previous tab`,
      `Ctrl + F shows the filter modes`,
      `Double click on empty tabs space opens a new tab`,
      `Shift while on scrollwheel makes it scroll faster`,
      `Escape clears the filter and closes windows/popups`,
      `Hold right click and move up or down to go to top or bottom`,
      `Hold right click and move left or right to cycle windows`,
    ]

    App.about_info_index = 0

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
        App.show_alert(`Stop it!`, 1000)
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
    let s = `Grasshopper v${manifest.version}`
    DOM.el(`#about_name`).textContent = s
    App.update_about_info()
  },
  after_show: () => {
    App.start_about_info()
  },
  on_hide: () => {
    App.stop_about_info()
    App.show_last_window()
  }, persistent: false, colored_top: true})
}

App.update_about_info = () => {
  DOM.el(`#about_info`).textContent = App.about_info_items[App.about_info_index]
}

App.prev_about_info = (manual = true) => {
  if (manual) {
    App.stop_about_info()
  }

  App.about_info_index -= 1

  if (App.about_info_index < 0) {
    App.about_info_index = App.about_info_items.length - 1
  }

  App.update_about_info()
}

App.next_about_info = (manual = true) => {
  if (manual) {
    App.stop_about_info()
  }

  App.about_info_index += 1

  if (App.about_info_index >= App.about_info_items.length) {
    App.about_info_index = 0
  }

  App.update_about_info()
}

App.start_about_info = () => {
  DOM.el(`#about_info`).classList.remove(`hidden`)
  DOM.el(`#about_image`).classList.remove(`hidden`)
  DOM.el(`#about_info_full`).classList.add(`hidden`)

  App.about_info_interval = setInterval(() => {
    App.next_about_info(false)
  }, 3000)
}

App.stop_about_info = () => {
  clearInterval(App.about_info_interval)
}

App.show_full_about_info = () => {
  App.stop_about_info()
  DOM.el(`#about_info`).classList.add(`hidden`)
  DOM.el(`#about_image`).classList.add(`hidden`)
  DOM.el(`#about_info_full`).classList.remove(`hidden`)
}