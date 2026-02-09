App.about_info_items = [
  `Up, Down, and Enter keys navigate and pick items`,
  `Type to filter or search depending on mode`,
  `Cycle with Left and Right`,
  `Middle Click closes tabs (Configurable)`,
  `Esc does Step Back and closes windows`,
  `Ctrl + Click selects multiple items`,
  `Shift + Click selects an item range`,
  `Right Click on items shows the Item Menu`,
  `Delete closes selected tabs`,
  `Double click on empty space opens a new tab (Configurable)`,
  `Command palette commands take into account selected items and mode (Context Aware)`,
  `To filter by title start with title:`,
  `To filter by URL start with url:`,
  `To filter with regex start with re:`,
  `To filter with regex by title start with re_title:`,
  `To filter with regex by URL start with re_url:`,
  `To filter by color start with color:`,
  `To filter by tag start with tag:`,
  `To filter by container start with container:`,
  `To filter by zone start with zone:`,
  `To filter by characters start with char:`,
  `To filter with similarity start with sim:`,
  `Alt + Click selects items without triggering actions`,
  `Right Click on the Main Menu to show the Palette`,
  `Right Click on the Filter Menu to show Favorite Filters or filter commands on the Palette (Configurable)`,
  `Right Click on the Go To Playing button to show Playing Tabs`,
  `Right Click on the Step Back button to show Recent Tabs`,
  `Right Click on the Actions button to show the Browser Menu`,
  `Right Click on the Filter to show the Filter Context`,
  `In the filter, $day resolves to the current week day`,
  `In the filter, $month resolves to the current month name`,
  `In the filter, $year resolves to the year number`,
  `Context menus support filtering, just start typing something`,
  `Middle Click filter items to further refine the filter`,
  `Middle Click the filter input to show Refine Filters`,
  `There are 3 special tags: jump, jump2, and jump3`,
  `Use Alt + Up/Down to select items ignoring unloaded tabs`,
  `Use "quotes" in the filters for more "precise matching"`,
  `Use !g or !google in the filter to search Google`,
  `Use !ddg or !duckduckgo in the filter to search DuckDuckGo`,
  `Use !b or !bing in the filter to search Bing`,
  `Use !w or !wiki in the filter to search Wikipedia`,
  `Use !yt or !youtube in the filter to search YouTube`,
  `Use !i or !image in the filter to search Images`,
  `Use > in the filter to enter URL or search term`,
  `Use ? in the filter to enter search term`,
  `Use $ in the filter to search a command`,
  `Use # in the filter to search a setting`,
]

App.about_lore_items = [
  `Grasshoppers are a group of insects belonging to the suborder Caelifera. They are among what is possibly the most ancient living group of chewing herbivorous insects, dating back to the early Triassic around 250 million years ago.`,
  `Grasshoppers are typically ground-dwelling insects with powerful hind legs which allow them to escape from threats by leaping vigorously. Their front leg is shorter and used for grasping food. As hemimetabolous insects, they do not undergo complete metamorphosis; they hatch from an egg into a nymph or "hopper" which undergoes five moults, becoming more similar to the adult insect at each developmental stage. The grasshopper hears through the tympanal organ which can be found in the first segment of the abdomen attached to the thorax; while its sense of vision is in the compound eyes, the change in light intensity is perceived in the simple eyes (ocelli). At high population densities and under certain environmental conditions, some grasshopper species can change color and behavior and form swarms. Under these circumstances, they are known as locusts.`,
  `Grasshoppers are plant-eaters, with a few species at times becoming serious pests of cereals, vegetables and pasture, especially when they swarm in the millions as locusts and destroy crops over wide areas. They protect themselves from predators by camouflage; when detected, many species attempt to startle the predator with a brilliantly coloured wing flash while jumping and (if adult) launching themselves into the air, usually flying for only a short distance. Other species such as the rainbow grasshopper have warning coloration which deters predators. Grasshoppers are affected by parasites and various diseases, and many predatory creatures feed on both nymphs and adults. The eggs are subject to attack by parasitoids and predators. Grasshoppers are diurnal insects—meaning, they are most active during the day time.`,
  `Grasshoppers have had a long relationship with humans. Swarms of locusts can have devastating effects and cause famine, having done so since Biblical times. Even in smaller numbers, the insects can be serious pests. They are used as food in countries such as Mexico and Indonesia. They feature in art, symbolism and literature. The study of grasshopper species is called acridology.`,
]

App.about_credits_items = [
  `Developed by Merkoba`,
  `Programmed by madprops`,
  `Designed by madprops`,
  `Ideas by N3C2L`,
  `Feedback by user0022`,
  `Support by daffydock`,
  `Coffee by fireworksordie`,
  `Appearance by ghost-of-freedom`,
  `Investigation by matt961`,
  `Suggestions by arjpar`,
  `Realization by sunng87`,
  `Checks by lifehaschanged`,
  `Cooperation by eLionsson`,
  `Followup by Pierll`,
  `Reasoning by jingofett`,
  `Falconry by sjehuda`,
  `Shortcuts by u2615`,
  `Ovation by getcheffy`,
]

App.about_links_items = [
  [`https://github.com/madprops/grasshopper`, `Firefox Store`],
  [`https://addons.mozilla.org/es-ES/firefox/addon/grasshopper-urls`, `GitHub Repo`],
  [`https://groups.google.com/g/grasshopper-urls`, `Google Group`],
  [`https://en.wikipedia.org/wiki/Grasshopper`, `Wikipedia`],
]

App.about_donate_items = [
  [`84XEQKBLWYp9uNNn6bamfSFDkbbSzXXR64TpEJMW5puu4uur4B8uZVj1v9VXdYRfTQKoH9gnmAw57DkJoH2z6wcyM5CedwF`],
]

App.start_about = () => {
  if (App.check_ready(`about`)) {
    return
  }

  App.create_window({
    id: `about`,
    setup: () => {
      let close = DOM.el(`#about_close`)

      DOM.ev(close, `click`, () => {
        App.hide_window()
      })

      close.textContent = App.close_text
      let image = DOM.el(`#about_image`)
      image.classList.add(`normal`)

      DOM.ev(image, `click`, () => {
        if (DOM.class(image, [`rotate_1`])) {
          image.classList.remove(`rotate_1`)
          image.classList.add(`invert`)
        }
        else if (DOM.class(image, [`invert`])) {
          image.classList.remove(`invert`)

          if (DOM.class(image, [`flipped`])) {
            image.classList.remove(`flipped`)
            image.classList.add(`normal`)
          }
          else {
            image.classList.add(`flipped`)
            image.classList.remove(`normal`)
          }
        }
        else {
          image.classList.add(`rotate_1`)
        }
      })

      let dev = DOM.el(`#about_dev`)

      let what = DOM.create(`div`, `bigger`)
      what.textContent = `Advanced Tab Manager`
      dev.append(what)

      let devby = DOM.create(`div`, `bigger`)
      devby.textContent = `Developed by ${App.manifest.author}`
      dev.append(devby)

      let since = DOM.create(`div`, `bigger`)
      since.textContent = `Since 2022`
      dev.append(since)

      let s = `${App.manifest.name} v${App.manifest.version}`
      DOM.el(`#about_name`).textContent = s

      DOM.ev(`#show_about_info`, `click`, () => {
        App.hide_window()
        App.show_about_info()
      })

      DOM.ev(`#show_about_lore`, `click`, () => {
        App.hide_window()
        App.show_about_lore()
      })

      DOM.ev(`#show_about_credits`, `click`, () => {
        App.hide_window()
        App.show_about_credits()
      })

      DOM.ev(`#show_about_donate`, `click`, () => {
        App.hide_window()
        App.show_about_donate()
      })

      DOM.ev(`#show_about_links`, `click`, () => {
        App.hide_window()
        App.show_about_links()
      })
    },
    after_show: () => {
      let info = ``
      info += `Started: ${App.timeago(App.start_date)}\n`
      info += `Installed: ${App.timeago(App.first_time.date)}\n`
      info += `Commands: ${Object.keys(App.commands).length}\n`
      info += `Settings: ${Object.keys(App.settings).length}\n`
      info += `Soul: ${App.get_soul_emoji()}`

      let image = DOM.el(`#about_image`)
      image.classList.remove(`rotate_1`)
      image.classList.remove(`invert`)
      image.classList.remove(`flipped`)
      image.title = info
    },
    colored_top: true,
  })
}

App.about_filter_focused = () => {
  return document.activeElement.id === `about_info_filter`
}

App.clear_about_filter = () => {
  if (App.filter_has_value(`about_info`)) {
    App.reset_generic_filter(`about_info`)
  }
  else {
    App.hide_window()
  }
}

App.filter_about = () => {
  App.filter_about_debouncer.call()
}

App.do_filter_about_info = () => {
  App.filter_about_debouncer.cancel()
  App.do_filter_2(`about_info`)
}

App.show_about = () => {
  App.start_about()
  App.show_window(`about`)
}

App.show_about_info = () => {
  App.start_about_info()
  App.show_window(`about_info`)
}

App.show_about_lore = () => {
  App.start_about_lore()
  App.show_window(`about_lore`)
}

App.show_about_credits = () => {
  App.start_about_credits()
  App.show_window(`about_credits`)
}

App.show_about_donate = () => {
  App.start_about_donate()
  App.show_window(`about_donate`)
}

App.show_about_links = () => {
  App.start_about_links()
  App.show_window(`about_links`)
}

App.focus_about_filter = () => {
  let filter = DOM.el(`#about_info_filter`)
  filter.focus()
}

App.about_bottom = () => {
  let container = DOM.el(`#window_content_about_info`)
  container.scrollTop = container.scrollHeight
}

App.start_about_info = () => {
  if (App.check_ready(`about_info`)) {
    return
  }

  App.create_window({
    id: `about_info`,
    setup: () => {
      let close = DOM.el(`#about_info_close`)

      DOM.ev(close, `click`, () => {
        App.hide_window()
        App.show_about()
      })

      close.textContent = App.close_text
      let info = DOM.el(`#about_info`)

      for (let item of App.about_info_items) {
        let el = DOM.create(`div`, `about_info_item filter_item filter_text`)
        el.textContent = item
        info.append(el)
      }

      let filter = DOM.el(`#about_info_filter`)

      DOM.ev(filter, `input`, () => {
        App.filter_about()
      })

      let bottom = DOM.el(`#about_filter_bottom`)
      bottom.textContent = App.filter_bottom_icon
      bottom.title = App.filter_bottom_title

      DOM.ev(bottom, `click`, () => {
        App.about_bottom()
      })

      let clear = DOM.el(`#about_filter_clear`)
      clear.textContent = App.filter_clear_icon
      clear.title = App.filter_clear_title

      DOM.ev(clear, `click`, () => {
        App.reset_generic_filter(`about_info`)
      })

      let s = `${App.manifest.name} v${App.manifest.version}`
      DOM.el(`#about_info_name`).textContent = s

      let container = DOM.el(`#window_content_about_info`)
      App.generic_gestures(container)
    },
    after_show: () => {
      let filter = DOM.el(`#about_info_filter`)

      if (filter.value) {
        App.clear_about_filter()
      }

      App.focus_about_filter()
    },
    colored_top: true,
  })

  App.filter_about_debouncer = App.create_debouncer(() => {
    App.do_filter_about_info()
  }, App.filter_delay_2)
}

App.start_about_lore = () => {
  if (App.check_ready(`about_lore`)) {
    return
  }

  App.create_window({
    id: `about_lore`,
    setup: () => {
      let close = DOM.el(`#about_lore_close`)

      DOM.ev(close, `click`, () => {
        App.hide_window()
        App.show_about()
      })

      close.textContent = App.close_text
      let lore = DOM.el(`#about_lore`)

      for (let item of App.about_lore_items) {
        let el = DOM.create(`div`, `about_info_item filter_item filter_text`)
        el.textContent = item
        lore.append(el)
      }

      let s = `${App.manifest.name} v${App.manifest.version}`
      DOM.el(`#about_lore_name`).textContent = s

      let container = DOM.el(`#window_content_about_lore`)
      App.generic_gestures(container)
    },
    colored_top: true,
  })
}

App.start_about_credits = () => {
  if (App.check_ready(`about_credits`)) {
    return
  }

  App.create_window({
    id: `about_credits`,
    setup: () => {
      let close = DOM.el(`#about_credits_close`)

      DOM.ev(close, `click`, () => {
        App.hide_window()
        App.show_about()
      })

      close.textContent = App.close_text
      let credits = DOM.el(`#about_credits`)

      for (let item of App.about_credits_items) {
        let el = DOM.create(`div`, `about_info_item filter_item filter_text`)
        el.textContent = item
        credits.append(el)
      }

      let s = `${App.manifest.name} v${App.manifest.version}`
      DOM.el(`#about_credits_name`).textContent = s

      let container = DOM.el(`#window_content_about_credits`)
      App.generic_gestures(container)
    },
    colored_top: true,
  })
}

App.start_about_links = () => {
  if (App.check_ready(`about_links`)) {
    return
  }

  App.create_window({
    id: `about_links`,
    setup: () => {
      let close = DOM.el(`#about_links_close`)

      DOM.ev(close, `click`, () => {
        App.hide_window()
        App.show_about()
      })

      close.textContent = App.close_text
      let links = DOM.el(`#about_links`)

      for (let item of App.about_links_items) {
        let el = DOM.create(`a`, `about_link doubleline`)
        el.href = item[0]
        el.textContent = item[1]
        el.target = `_blank`
        links.append(el)
      }

      let s = `${App.manifest.name} v${App.manifest.version}`
      DOM.el(`#about_links_name`).textContent = s

      let container = DOM.el(`#window_content_about_links`)
      App.generic_gestures(container)
    },
    colored_top: true,
  })
}

App.start_about_donate = () => {
  if (App.check_ready(`about_donate`)) {
    return
  }

  App.create_window({
    id: `about_donate`,
    setup: () => {
      let close = DOM.el(`#about_donate_close`)

      DOM.ev(close, `click`, () => {
        App.hide_window()
        App.show_about()
      })

      close.textContent = App.close_text
      let donate = DOM.el(`#about_donate`)

      for (let item of App.about_donate_items) {
        let el = DOM.create(`div`, `about_info_item filter_item filter_text break selectable`)
        el.textContent = item
        donate.append(el)
      }

      let s = `${App.manifest.name} v${App.manifest.version}`
      DOM.el(`#about_donate_name`).textContent = s

      let container = DOM.el(`#window_content_about_donate`)
      App.generic_gestures(container)
    },
    colored_top: true,
  })
}