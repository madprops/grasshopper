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
  App.show_context({items: items, e: e})
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
    url: url,
  }

  App.get_new_tab_args(item, from, args)
  App.open_new_tab(args)
  App.after_focus({show_tabs: true})
}

App.run_browser_command = (num) => {
  let cmd = App.get_setting(`browser_command_${num}`)
  App.run_command({cmd: cmd, from: `browser_command`})
}