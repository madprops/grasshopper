App.setup_active_history = (clean = false) => {
  App.refresh_active_history_debouncer = App.create_debouncer((clean = false) => {
    if (clean) {
      App.clean_active_history()
    }

    App.do_refresh_active_history()
  }, App.active_history_delay)
}

App.refresh_active_history = (clean) => {
  App.refresh_active_history_debouncer.call(clean)
}

App.do_refresh_active_history = () => {
  if (App.get_setting(`active_trace`)) {
    App.update_active_trace()
  }

  if (App.get_setting(`tab_box`) !== `none`) {
    App.update_tab_box()
  }
}

App.update_active_history = (current, new_active) => {
  if (current === new_active) {
    return
  }

  if (!App.active_history.length) {
    App.active_history.push(current)
  }

  App.active_history.unshift(new_active)
  App.active_history_item = new_active
  App.clean_active_history()
  App.refresh_active_history()
}

App.clean_active_history = () => {
  App.active_history = App.active_history.filter(x => x && x.element && document.contains(x.element))
  App.active_history = [...new Set(App.active_history)]
  App.active_history = App.active_history.slice(0, App.get_setting(`max_active_history`))
}