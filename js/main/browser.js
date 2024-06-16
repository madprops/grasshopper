App.show_browser_menu = (e) => {
  let url_one = App.get_setting(`url_one`)
  let url_two = App.get_setting(`url_two`)
  let url_three = App.get_setting(`url_three`)

  let cmds = [
    `browser_back`,
    `browser_forward`,
    `browser_reload`,
  ]

  let urls = [url_one, url_two, url_three].some(url => url != ``)

  if (urls) {
    cmds.push(App.separator_string)

    if (url_one) {
      cmds.push(`open_url_one`)
    }

    if (url_two) {
      cmds.push(`open_url_two`)
    }

    if (url_three) {
      cmds.push(`open_url_three`)
    }
  }

  let items = App.cmd_list(cmds)
  App.show_context({items: items, e: e})
}

App.open_setting_url = (num) => {
  let name

  if (num === 1) {
    name = `one`
  }
  else if (num === 2) {
    name = `two`
  }
  else if (num === 3) {
    name = `three`
  }
  else {
    return
  }

  let url = App.get_setting(`url_${name}`)

  if (!url) {
    return
  }

  App.open_new_tab({url: url})
  App.after_focus({show_tabs: true})
}