App.get_recent_tabs = (args = {}) => {
  let def_args = {
    active: true,
    max: 0,
  }

  App.def_args(def_args, args)
  let tabs = App.get_items(`tabs`).slice(0)

  tabs.sort((a, b) => {
    return a.last_accessed > b.last_accessed ? -1 : 1
  })

  if (!args.active) {
    tabs = tabs.filter(x => !x.active)
  }

  if (args.max > 0) {
    tabs = tabs.slice(0, args.max)
  }

  return tabs
}

App.show_recent_tabs = (e) => {
  let items = []
  let max = App.get_setting(`max_recent_tabs`)
  let active = App.get_setting(`recent_active`)
  let tabs = App.get_recent_tabs({max: max, active: active})
  let playing_icon = App.get_setting(`playing_icon`)

  for (let item of tabs) {
    let title = App.get_title(item)

    if (item.audible && playing_icon) {
      title = `${playing_icon} ${title}`
    }

    let obj = {
      image: item.favicon,
      text: title,
      action: () => {
        App.tabs_action(item)
      },
    }

    if (item.active) {
      obj.bold = true
    }

    items.push(obj)
  }

  App.show_context({items: items, e: e})
}