App.setup_active_history = () => {
  App.refresh_active_history_debouncer = App.create_debouncer((clean = false) => {
    if (clean) {
      App.clean_active_history()
    }

    App.do_refresh_active_history()
  }, App.active_history_delay)
}

App.fill_active_history = () => {
  if (App.active_history_widgets()) {
    let max = App.get_setting(`max_active_history`)
    App.active_history = App.get_recent_tabs({max: max})
    App.refresh_active_history(false)
  }
}

App.active_history_widgets = () => {
  return App.get_setting(`active_trace`) || (App.get_setting(`tab_box`) !== `none`)
}

App.refresh_active_history = (clean = false) => {
  if (App.active_history_widgets()) {
    App.refresh_active_history_debouncer.call(clean)
  }
}

App.do_refresh_active_history = () => {
  App.refresh_active_history_debouncer.cancel()

  if (App.get_setting(`active_trace`)) {
    App.update_active_trace()
  }

  if (App.get_setting(`tab_box`) !== `none`) {
    App.update_tab_box()
  }
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
    App.refresh_active_history()
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