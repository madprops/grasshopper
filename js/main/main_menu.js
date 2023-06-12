App.create_main_menu = (mode) => {
  let main_menu = DOM.create(`div`, `button icon_button`, `${mode}_main_menu`)
  main_menu.textContent = App.get_mode_name(mode)
  main_menu.title = `Main Menu (Ctrl + Left)`

  DOM.ev(main_menu, `click`, () => {
    App.show_main_menu(mode)
  })

  DOM.ev(main_menu, `wheel`, (e) => {
    let direction = App.wheel_direction(e)

    if (direction === `down`) {
      App.cycle_item_windows(false)
    }
    else if (direction === `up`) {
      App.cycle_item_windows(true)
    }
  })

  return main_menu
}

App.show_main_menu = (mode) => {
  let items = []

  for (let m of App.item_order) {
    items.push({
      text: App.get_mode_name(m),
      action: () => {
        App.show_item_window(m)
      },
      selected: m === mode
    })
  }

  items.push({
    separator: true
  })

  items.push({
    text: `Settings`,
    action: () => {
      App.show_settings()
    }
  })

  items.push({
    text: `About`,
    action: () => {
      App.show_window(`about`)
    }
  })

  items.push({
    separator: true
  })

  items.push({
    text: `Cmd...`,
    action: () => {
      App.show_palette()
    },
    title: `You can also double tap Ctrl to open this`
  })

  let btn = DOM.el(`#${mode}_main_menu`)
  NeedContext.show_on_element(btn, items, true, btn.clientHeight)
}