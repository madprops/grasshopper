App.check_first_time = () => {
  if (!App.first_time.date) {
    App.show_intro_message()
    App.first_time.date = App.now()
    App.stor_save_first_time()
  }
}

App.show_intro_message = () => {
  let s = `The main menu is at the top left
  There are hundreds of settings and commands
  Sidebar and popup modes are available.`

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
      text: `Guides`,
      action: () => {
        App.close_textarea()
        App.show_setting_guides()
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
  App.browser().runtime.reload()
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
    perm = await App.browser().permissions.request({permissions: [what]})
  }
  catch (err) {
    perm = await App.browser().permissions.contains({permissions: [what]})
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

App.open_sidebar = async () => {
  let ext_api = App.browser()

  if (ext_api.sidebarAction) {
    ext_api.sidebarAction.open()
  }
  else if (ext_api.sidePanel) {
    let current_window = await ext_api.windows.getCurrent()
    ext_api.sidePanel.open({windowId:current_window.id})
  }
}

App.close_sidebar = async () => {
  let ext_api = App.browser()

  if (ext_api.sidebarAction) {
    ext_api.sidebarAction.close()
  }
  else if (ext_api.sidePanel) {
    if (ext_api.sidePanel.close) {
      let current_window = await ext_api.windows.getCurrent()
      ext_api.sidePanel.close({windowId:current_window.id})
    }
    else {
      await ext_api.sidePanel.setOptions({enabled:false})
      await ext_api.sidePanel.setOptions({enabled:true})
    }
  }
}

App.toggle_sidebar = async () => {
  let ext_api = App.browser()

  if (ext_api.sidebarAction) {
    ext_api.sidebarAction.toggle()
  }
  else if (ext_api.sidePanel) {
    let current_window = await ext_api.windows.getCurrent()

    let panel_contexts = await ext_api.runtime.getContexts({
      contextTypes: [`SIDE_PANEL`],
      windowId: current_window.id,
    })

    if (panel_contexts.length > 0) {
      await App.close_sidebar()
    }

    else {
      await App.open_sidebar()
    }
  }
}

App.check_caps = (text) => {
  if (App.get_setting(`all_caps`)) {
    text = text.toUpperCase()
  }

  return text
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

App.fix_scroll = () => {
  setTimeout(() => {
    let c = DOM.el(`#tabs_container`)
    c.scrollTop += 1
    c.scrollTop -= 1
  }, App.SECOND)
}

App.is_blank_url = (url) => {
  return [`about:blank`].some(x => url.startsWith(x))
}

App.is_extension = (url) => {
  return [`moz-extension:`].some(x => url.startsWith(x))
}

App.is_about_url = (url) => {
  return [`about:`].some(x => url.startsWith(x))
}

App.get_soul_emoji = () => {
  App.load_emojilist()
  let n = App.first_time.date
  let i = n % App.emojilist.length
  return App.emojilist[i]
}