App.show_browser_menu = (e) => {
  let cmds = [
    `browser_back`,
    `browser_forward`,
    `browser_reload`,
  ]

  let urls = App.get_setting(`custom_urls`)

  if (urls.length) {
    cmds.push(App.separator_string)

    for (let i = 0; i < 3; i++) {
      let url = urls[i]

      if (!url) {
        break
      }

      cmds.push(`open_url_${i + 1}`)
    }
  }

  let items = App.cmd_list(cmds)
  App.show_context({items: items, e: e})
}

App.open_custom_url = (num) => {
  let urls = App.get_setting(`custom_urls`)

  if (!urls.length) {
    return
  }

  let url = urls[num - 1].url

  if (!url) {
    return
  }

  App.open_new_tab({url: url})
  App.after_focus({show_tabs: true})
}