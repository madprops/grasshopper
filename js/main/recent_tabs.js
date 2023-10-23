App.setup_recent_tabs = () => {
  App.empty_previous_tabs_debouncer = App.create_debouncer(() => {
    App.do_empty_previous_tabs()
  }, App.empty_previous_tabs_delay)
}

App.empty_previous_tabs = () => {
  App.empty_previous_tabs_debouncer.call()
}

App.do_empty_previous_tabs = () => {
  App.empty_previous_tabs_debouncer.cancel()
  App.previous_tabs = []
}

App.get_previous_tabs = (include_active = false) => {
  App.previous_tabs = App.get_items(`tabs`).slice(0)

  if (!include_active) {
    App.previous_tabs = App.previous_tabs.filter(x => !x.active)
  }

  App.previous_tabs.sort((a, b) => {
    return a.last_accessed > b.last_accessed ? -1 : 1
  })

  App.previous_tabs_index = 0
}

App.go_to_previous_tab = () => {
  if (!App.previous_tabs.length) {
    App.get_previous_tabs()
  }

  App.empty_previous_tabs()

  if (App.previous_tabs.length <= 1) {
    return
  }

  let prev_tab = App.previous_tabs[App.previous_tabs_index]
  let item = App.get_item_by_id(`tabs`, prev_tab.id)

  if (item) {
    App.focus_tab({item: item, scroll: `center_smooth`, method: `previous`})
    App.previous_tabs_index += 1

    if (App.previous_tabs_index > (App.previous_tabs.length - 1)) {
      App.previous_tabs_index = 0
    }
  }
}

App.show_recent_tabs = (e) => {
  let items = []
  App.get_previous_tabs(true)
  let max = App.get_setting(`max_recent_tabs`)
  let playing_icon = App.get_setting(`playing_icon`)

  for (let item of App.previous_tabs.slice(0, max)) {
    let title = App.get_title(item)

    if (item.audible && playing_icon) {
      title = `${playing_icon} ${title}`
    }

    items.push({
      image: item.favicon,
      text: title,
      action: () => {
        App.focus_tab({item: item, scroll: `center_smooth`, show_tabs: true})
      },
    })
  }

  App.show_center_context(items, e)
}