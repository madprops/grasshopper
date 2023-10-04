App.create_main_menu = (mode) => {
  let main_menu = DOM.create(`div`, `button icon_button`, `${mode}_main_menu`)
  main_menu.textContent = App.get_mode_name(mode)
  main_menu.title = `Main Menu (Ctrl + Left)`

  DOM.ev(main_menu, `click`, () => {
    App.show_main_menu(mode)
  })

  DOM.ev(main_menu, `auxclick`, (e) => {
    if (e.button === 1) {
      let cmd = App.get_setting(`middle_click_main_menu`)

      if (cmd !== `none`) {
        App.run_command({cmd: cmd, from: `main_menu`})
      }
    }
  })

  DOM.ev(main_menu, `wheel`, (e) => {
    let direction = App.wheel_direction(e)

    if (direction === `down`) {
      App.cycle_modes(false)
    }
    else if (direction === `up`) {
      App.cycle_modes(true)
    }
  })

  return main_menu
}

App.show_main_menu = (mode) => {
  let items = []

  for (let m of App.modes) {
    let icon = App.mode_icons[m]
    let name = App.get_mode_name(m)

    items.push({
      icon: icon,
      text: name,
      action: () => {
        App.do_show_mode({mode: m, reuse_filter: true})
      },
      selected: m === mode
    })
  }

  App.sep(items)

  if (App.get_setting(`direct_settings`)) {
    items.push({
      icon: App.settings_icons.general,
      text: `Settings`,
      action: () => {
        App.show_settings()
      }
    })
  }
  else {
    items.push({
      icon: App.settings_icons.general,
      text: `Settings`,
      get_items: () => {
        return App.settings_menu_items(`main_menu`)
      }
    })
  }

  items.push({
    icon: App.profile_icon,
    text: `Profiles`,
    get_items: () => {
      return App.get_profile_menu_items()
    }
  })

  items.push({
    icon: App.bot_icon,
    text: `About`,
    action: () => {
      App.show_about()
    }
  })

  App.sep(items)

  items.push({
    icon: App.command_icon,
    text: `Cmd...`,
    action: () => {
      App.show_palette()
    },
    title: `You can also double tap Ctrl to open this`
  })

  let btn = DOM.el(`#${mode}_main_menu`)
  NeedContext.show_on_element(btn, items, true, btn.clientHeight)
}