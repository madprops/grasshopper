App.show_browser_menu = (e) => {
  let cmds = [
    `browser_back`,
    `browser_forward`,
    `browser_reload`,
  ]

  let urls = App.get_setting(`custom_urls`)

  if (urls.length) {
    cmds.push(App.separator_string)

    for (let url of urls.slice(0, 5)) {
      cmds.push(`open_url_${url._id_}`)
    }
  }

  let items = App.cmd_list(cmds)
  App.show_context({items, e})
}

App.open_custom_url = (item, num, from = `normal`) => {
  let urls = App.get_setting(`custom_urls`)

  if (!urls.length) {
    return
  }

  let url = urls[num - 1].url

  if (!url) {
    return
  }

  let args = {
    url,
  }

  App.get_new_tab_args(item, from, args)
  App.open_new_tab(args)
  App.after_focus({show_tabs: true})
}

App.run_browser_command = (num) => {
  let cmd = App.get_setting(`browser_command_${num}`)
  App.run_command({cmd, from: `browser_command`})
}

App.run_popup_command = (num) => {
  let cmd = App.get_setting(`popup_command_${num}`)
  App.run_command({cmd, from: `popup_command`})
}

App.check_init_commands = () => {
  let init_cmd = localStorage.getItem(`init_popup_command`) || `nothing`
  localStorage.setItem(`init_popup_command`, `nothing`)

  if (init_cmd !== `nothing`) {
    App.prompt_mode = true

    setTimeout(() => {
      App.run_popup_command(parseInt(init_cmd))
    }, App.popup_commands_delay)
  }
}

App.check_popup_command_close = () => {
  if (App.prompt_mode) {
    if (App.get_setting(`popup_command_close`)) {
      setTimeout(() => {
        App.close_window()
      }, App.prompt_close_delay)
    }
  }
}

App.browser_action = (item, action) => {
  if (item && item.mode === `tabs`) {
    let active = App.get_active_items({mode: `tabs`, item})

    for (let it of active) {
      action(it.id)
    }
  }
  else {
    action()
  }
}

App.browser_reload = (item) => {
  App.browser_action(item, (id) => {
    browser.tabs.reload(id)
  })
}

App.browser_back = (item) => {
  App.browser_action(item, (id) => {
    browser.tabs.goBack(id)
  })
}

App.browser_forward = (item) => {
  App.browser_action(item, (id) => {
    browser.tabs.goForward(id)
  })
}