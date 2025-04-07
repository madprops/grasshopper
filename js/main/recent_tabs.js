App.setup_recent_tabs = () => {
  let delay = App.get_setting(`recent_tabs_delay`)

  App.empty_previous_tabs_debouncer = App.create_debouncer(() => {
    App.do_empty_previous_tabs()
  }, delay)
}

App.empty_previous_tabs = () => {
  App.empty_previous_tabs_debouncer.call()
}

App.do_empty_previous_tabs = () => {
  App.empty_previous_tabs_debouncer.cancel()
  App.previous_tabs = []
}

App.get_recent_tabs = (args = {}) => {
  let def_args = {
    active: true,
    headers: false,
    max: 0,
  }

  App.def_args(def_args, args)
  let tabs = App.get_items(`tabs`).slice(0)

  tabs.sort((a, b) => {
    return a.last_access > b.last_access ? -1 : 1
  })

  if (!args.active) {
    tabs = tabs.filter(x => !x.active)
  }

  if (!args.headers) {
    tabs = tabs.filter(x => !x.header)
  }

  if (args.max > 0) {
    tabs = tabs.slice(0, args.max)
  }

  return tabs
}

App.get_previous_tabs = () => {
  App.previous_tabs = App.get_recent_tabs()

  if (!App.get_setting(`jump_unloaded`)) {
    App.previous_tabs = App.previous_tabs.filter(x => !x.unloaded)
  }

  if (App.previous_tabs.length > 1) {
    let first_tab = App.previous_tabs.shift()
    App.previous_tabs.push(first_tab)
  }

  App.previous_tabs_index = -1
}

App.go_to_previous_tab = (reverse = false) => {
  if (!App.previous_tabs.length) {
    App.get_previous_tabs()
  }

  App.empty_previous_tabs()

  if (App.previous_tabs.length <= 1) {
    return
  }

  let items = App.previous_tabs.slice(0)

  if (reverse) {
    App.previous_tabs_index -= 1
  }
  else {
    App.previous_tabs_index += 1
  }

  if (App.previous_tabs_index > (items.length - 1)) {
    App.previous_tabs_index = 0
  }
  else if (App.previous_tabs_index < 0) {
    App.previous_tabs_index = items.length - 1
  }

  let prev = items[App.previous_tabs_index]

  if (prev) {
    App.tabs_action({item: prev, from: `previous`, scroll: `center_instant`})
  }
}