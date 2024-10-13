App.check_first_time = () => {
  if (!App.first_time.date) {
    App.show_intro_message()
    App.first_time.date = App.now()
    App.stor_save_first_time()
  }
}

App.show_intro_message = () => {
  let s = `Hi there
  The main menu is the top-left button
  Check out the settings
  I constantly experiment and change stuff, so expect things to break.`

  let text = App.periods(s)

  let buttons = [
    {
      text: `About`,
      action: () => {
        App.show_about()
      },
    },
    {
      text: `Settings`,
      action: () => {
        App.show_settings_category(`general`)
      },
    },
    {
      text: `Close`,
      action: () => {
        App.close_textarea()
      },
    },
  ]

  App.show_textarea({message: `Welcome`, text, simple: true, buttons, align: `left`})
}

App.restart_extension = () => {
  browser.runtime.reload()
}

App.print_intro = () => {
  let d = App.now()
  let s = String.raw`
//_____ __
@ )====// .\___
\#\_\__(_/_\\_/
  / /       \\
`
  App.log(s.trim(), `green`)
  App.log(`Starting ${App.manifest.name} v${App.manifest.version}`)
  App.log(`${App.nice_date(d, true)} | ${d}`)
}

App.check_ready = (what) => {
  let s = `${what}_ready`

  if (App[s]) {
    return true
  }

  App[s] = true
  return false
}

App.check_force = (warn_setting, items) => {
  if (items.length >= App.get_setting(`max_warn_limit`)) {
    return false
  }

  let warn_on_action = App.get_setting(warn_setting)

  if (warn_on_action === `always`) {
    return false
  }
  else if (warn_on_action === `never`) {
    return true
  }
  else if (warn_on_action === `multiple`) {
    if (items.length > 1) {
      return false
    }
  }
  else if (warn_on_action === `special`) {
    if (items.length > 1) {
      return false
    }

    for (let item of items) {
      if (item.pinned && App.get_setting(`warn_special_pinned`)) {
        return false
      }

      if (item.playing && App.get_setting(`warn_special_playing`)) {
        return false
      }

      if (item.header && App.get_setting(`warn_special_header`)) {
        return false
      }

      if (!item.header && App.get_setting(`warn_special_edited`)) {
        if (App.edited(item, false)) {
          return false
        }
      }
    }
  }

  return true
}

App.toggle_fullscreen = () => {
  if (App.fullscreen) {
    App.main_remove(`fullscreen`)
  }
  else {
    App.main_add(`fullscreen`)
  }

  App.fullscreen = !App.fullscreen
}

App.reset_triggers = () => {
  App.reset_keyboard()
  App.reset_mouse()
}

App.button_text = (icon, text, bigger = false) => {
  let cls = `button_text`

  if (bigger) {
    cls += ` button_text_bigger`
  }

  let container = DOM.create(`div`, cls)

  if (icon) {
    let icon_el = DOM.create(`div`, `button_text_icon flex_row_center`)
    icon_el.append(icon)
    container.append(icon_el)
  }

  if (text) {
    let text_el = DOM.create(`div`, `button_text_text flex_row_center`)
    text_el.append(text)
    container.append(text_el)
  }

  return container
}

App.tooltip = (str) => {
  return App.clean_lines(App.single_space(str))
}

App.periods = (str) => {
  return App.tooltip(str).split(`\n`).join(`. `)
}

App.ask_permission = async (what) => {
  let perm

  try {
    perm = await browser.permissions.request({permissions: [what]})
  }
  catch (err) {
    perm = await browser.permissions.contains({permissions: [what]})
  }

  return perm
}

App.permission_msg = (what) => {
  let s1 = `${what} permission is required.`
  let s2 = `Open the top left menu and click on the mode you want to enable`
  App.alert(`${s1} ${s2}`)
}

App.main_add = (cls) => {
  let main = DOM.el(`#main`)
  main.classList.add(cls)
}

App.main_remove = (cls) => {
  let main = DOM.el(`#main`)
  main.classList.remove(cls)
}

App.main_has = (cls) => {
  let main = DOM.el(`#main`)
  return main.classList.contains(cls)
}

App.open_sidebar = () => {
  browser.sidebarAction.open()
}

App.close_sidebar = () => {
  browser.sidebarAction.close()
}

App.generate_password = () => {
  let password = App.random_string(App.password_length)
  App.show_textarea({message: `Random Password`, text: password, simple: true})
}

App.play_sound = (name) => {
  let pname = `audio_player_${name}`

  if (!App[pname]) {
    App[pname] = new Audio(`audio/${name}.mp3`)
  }

  let player = App[pname]
  player.pause()
  player.currentTime = 0
  player.play()
}