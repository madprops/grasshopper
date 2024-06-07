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
  Check the settings for some customizations
  I constantly experiment and change stuff, so expect things to break`
  App.alert(App.periods(s))
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
      if (item.pinned || item.playing || item.header) {
        return false
      }

      if (App.get_setting(`edited_special`)) {
        if (App.edited(item)) {
          return false
        }
      }
    }
  }

  return true
}

App.show_browser_menu = (e) => {
  let cmds = [
    `browser_back`,
    `browser_forward`,
    `browser_reload`,
  ]

  let items = App.cmd_list(cmds)
  App.show_context({items: items, e: e})
}

App.toggle_fullscreen = () => {
  if (main.classList.contains(`fullscreen`)) {
    App.main_remove(`fullscreen`)
  }
  else {
    App.main_add(`fullscreen`)
  }
}

App.reset_triggers = () => {
  App.reset_keyboard()
  App.reset_mouse()
}

App.show_empty_menu = (e) => {
  let items = App.custom_menu_items({
    name: `empty_menu`,
  })

  App.show_context({items: items, e: e})
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
  try {
    return await browser.permissions.request({permissions: [what]})
  }
  catch (err) {
    return await browser.permissions.contains({permissions: [what]})
  }
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