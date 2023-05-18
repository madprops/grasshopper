// Setup about
App.setup_about = () => {
  App.create_window({id: `about`, setup: () => {
    App.about_info_items = [
      `Explore with the top-left menu or (Shift) Tab`,
      `Up, Down, and Enter keys to navigate and pick items`,
      `Type anytime to filter items, press Tab to reuse`,
      `Use Middle Click to close or launch items`,
      `Shift + Middle Click on items to bypass confirmations`,
      `Some buttons respond to scrollwheel and keyboard`,
      `Shift + Up/Down to select multiple items`,
      `Ctrl + Click to select multiple items`,
      `Shift + Click to select item range`,
      `Right Click to show context menus`,
      `Shift + Enter to show context menus`,
      `Shift + Delete removes items`,
      `Ctrl + Home goes to the top of a list`,
      `Ctrl + End goes to the bottom of a list`,
      `Ctrl + Left togles Main Menu`,
      `Ctrl + Down toggles Filter Modes`,
      `Ctrl + Right toggles Actions`,
      `Ctrl + Up goes to playing tab`,
      `Ctrl + Backspace goes to previous tab`,
      `Arrows, Enter, and Space work in media`,
      `Double click on empty tabs space opens a new tab`,
      `Clicking the edge goes to the previous tab`,
      `Right clicking the edge focuses the active tab`,
      `Middle clicking the edge closes normal tabs`,
    ]

    App.about_info_index = 0

    DOM.ev(DOM.el(`#about_info`), `click`, () => {
      App.show_full_about_info()
    })

    let image = DOM.el(`#about_image`)

    DOM.ev(image, `click`, () => {
      if (image.classList.contains(`hue_rotate`)) {
        image.classList.remove(`hue_rotate`)
        image.classList.add(`invert`)
      }
      else if (image.classList.contains(`invert`)) {
        image.classList.remove(`invert`)
      }
      else {
        image.classList.add(`hue_rotate`)
      }
    })

    let info_full = DOM.el(`#about_info_full`)

    for (let item of App.about_info_items) {
      let el = DOM.create(`div`)
      el.textContent = item + `.`
      info_full.append(el)
    }

    let manifest = browser.runtime.getManifest()
    let s = `Grasshopper v${manifest.version}`
    DOM.el(`#about_name`).textContent = s
    App.update_about_info()
  }, after_show: () => {
    App.start_about_info()
  }, on_hide: () => {
    App.stop_about_info()
    App.show_last_window()
  }, persistent: false})
}

// Update about info
App.update_about_info = () => {
  DOM.el(`#about_info`).textContent = App.about_info_items[App.about_info_index]
}

// Previous about info
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

// Next about info
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

// Start about info
App.start_about_info = () => {
  DOM.el(`#about_info`).classList.remove(`hidden`)
  DOM.el(`#about_image`).classList.remove(`hidden`)
  DOM.el(`#about_info_full`).classList.add(`hidden`)

  App.about_info_interval = setInterval(() => {
    App.next_about_info(false)
  }, 3000)
}

// Stop about info
App.stop_about_info = () => {
  clearInterval(App.about_info_interval)
}

// Show full about info
App.show_full_about_info = () => {
  App.stop_about_info()
  DOM.el(`#about_info`).classList.add(`hidden`)
  DOM.el(`#about_image`).classList.add(`hidden`)
  DOM.el(`#about_info_full`).classList.remove(`hidden`)
}