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
        App.close_textarea()
        App.show_about()
      },
    },
    {
      text: `Settings`,
      action: () => {
        App.close_textarea()
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

  let image = `img/grasshopper.png`

  App.show_textarea({title: `Welcome`,
    text,
    simple: true,
    buttons,
    align: `left`,
    image,
  })
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
}

App.check_ready = (what) => {
  let s = `${what}_ready`

  if (App[s]) {
    return true
  }

  App[s] = true
  return false
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

App.body = () => {
  return DOM.el(`body`)
}

App.main = () => {
  return DOM.el(`#main`)
}

App.main_add = (cls) => {
  App.main().classList.add(cls)
}

App.main_remove = (cls) => {
  App.main().classList.remove(cls)
}

App.main_has = (cls) => {
  return App.main().classList.contains(cls)
}

App.supermain = () => {
  return DOM.el(`#supermain`)
}

App.supermain_add = (cls) => {
  App.supermain().classList.add(cls)
}

App.supermain_remove = (cls) => {
  App.supermain().classList.remove(cls)
}

App.supermain_has = (cls) => {
  return App.supermain().classList.contains(cls)
}

App.body_add = (cls) => {
  App.body().classList.add(cls)
}

App.body_remove = (cls) => {
  App.body().classList.remove(cls)
}

App.open_sidebar = () => {
  browser.sidebarAction.open()
}

App.close_sidebar = () => {
  browser.sidebarAction.close()
}

App.toggle_sidebar = () => {
  browser.sidebarAction.toggle()
}

App.generate_password = () => {
  let password = App.random_string(App.password_length)

  App.show_textarea({
    title: `Random Password`,
    text: password,
    simple: true,
    monospace: true,
    buttons: [
      {
        text: `Again`,
        action: () => {
          App.generate_password()
        },
      },
      {
        text: `Copy`,
        action: () => {
          App.copy_to_clipboard(password)
          App.close_textarea()
        },
      },
      {
        text: `Close`,
        action: () => {
          App.close_textarea()
        },
      },
    ],
  })
}

App.play_sound = (name) => {
  if (!App.get_setting(`sound_effects`)) {
    return
  }

  let pname = `audio_player_${name}`

  if (!App[pname]) {
    App[pname] = new Audio(`audio/${name}.mp3`)
  }

  let player = App[pname]
  player.pause()
  player.currentTime = 0
  player.play()
}

App.check_caps = (text) => {
  if (App.get_setting(`all_caps`)) {
    text = text.toUpperCase()
  }

  return text
}

App.show_flashlight = () => {
  App.flashlight = DOM.create(`div`, ``, `flashlight`)
  document.body.appendChild(App.flashlight)
  App.flashlight_on = true

  DOM.ev(App.flashlight, `click`, () => {
    App.turn_flashlight_off()
  })
}

App.turn_flashlight_off = () => {
  App.flashlight.remove()
  App.flashlight_on = false
  App.flashlight = undefined
}

App.check_show_button = (name, btn) => {
  let hide = !App.get_setting(`show_${name}_button`)

  if (hide) {
    DOM.hide(btn, 2)
  }
  else {
    DOM.show(btn, 2)
  }
}

App.tooltips = () => {
  return App.get_setting(`show_tooltips`)
}

App.toggle_message = (msg, setting) => {
  let sett = App.get_setting(setting)
  let what = sett ? `Enabled` : `Disabled`
  App.footer_message(`${msg} ${what}`)
}

App.speech = (text) => {
  if (!window.speechSynthesis) {
    App.error(`Speech synthesis not supported`)
    return
  }

  let utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = `en-US`
  utterance.rate = 0.5

  window.speechSynthesis.speak(utterance)
}

App.error_sound = () => {
  App.play_sound(`effect_1`)
}

App.action_sound = () => {
  App.play_sound(`effect_2`)
}