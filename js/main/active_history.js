App.fill_active_history = () => {
  let max = App.get_setting(`max_active_history`)
  App.active_history = App.get_recent_tabs({max: max})
}

App.update_active_history = (current, new_active) => {
  let added = false

  if (current && (current !== new_active)) {
    if (!current.header) {
      if (!App.active_history.length) {
        App.active_history.push(current)
        added = true
      }
    }
  }

  if (!new_active.header) {
    App.active_history.unshift(new_active)
    added = true
  }

  if (added) {
    App.clean_active_history()
  }

  if (new_active.pinned) {
    if (App.tab_box_mode(`pins`)) {
      App.update_tab_box(`pins`)
    }
  }
}

App.clean_active_history = () => {
  App.active_history = App.active_history.filter(x => x !== undefined && !x.removed)
  App.active_history = Array.from(new Set(App.active_history))
  App.active_history = App.active_history.slice(0, App.get_setting(`max_active_history`))
}

App.clear_active_history = () => {
  App.active_history = []
}

App.pick_active_history = (num) => {
  let item = App.active_history[num]

  if (item) {
    App.focus_tab({item: item, scroll: `nearest_smooth`})
  }
}