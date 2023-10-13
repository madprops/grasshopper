App.check_first_time = () => {
  if (!App.first_time.date) {
    App.show_intro_message()
    App.first_time.date = App.now()
    App.stor_save_first_time()
  }
}

App.show_intro_message = () => {
  let s = `Hi there. The main menu is the top-left button. Check the settings for some customizations.
  I constantly experiment and change stuff, so expect things to break`
  App.alert(App.single_space(s))
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

App.show_custom_menu = (e, what) => {
  let items = App.custom_menu_items(`${what}_menu`)
  NeedContext.show(e.clientX, e.clientY, items)
  e.preventDefault()
}

App.custom_menu_items = (name) => {
  let cmds = App.get_setting(name)
  return App.show_cmds_menu(cmds, name)
}

App.show_cmds_menu = (cmds, from) => {
  let items = []

  if (!cmds.length) {
    return items
  }

  for (let obj of cmds) {
    let c = App.get_command(obj.cmd)

    if (!c) {
      continue
    }

    items.push({
      text: c.name,
      action: (e) => {
        App.run_command({cmd: c.cmd, from: from, e: e})
      },
      icon: c.icon,
    })
  }

  return items
}

App.show_center_context = (items, e) => {
  if (e) {
    NeedContext.show(e.clientX, e.clientY, items)
  }
  else {
    NeedContext.show_on_center(items)
  }
}

App.check_ready = (what) => {
  let s = `${what}_ready`

  if (App[s]) {
    return true
  }

  App[s] = true
  return false
}

App.color_icon = (color) => {
  return DOM.create(`div`, `color_icon background_${color}`)
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
      if (item.pinned || item.audible) {
        return false
      }
    }
  }

  return true
}