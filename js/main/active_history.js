App.update_active_history = (current, new_active) => {
  if (current === new_active) {
    return
  }

  if (!App.active_history.length) {
    App.active_history.push(current)
  }

  App.active_history.unshift(new_active)
  App.clean_active_history()

  if (App.get_setting(`active_trace`)) {
    App.update_active_trace(new_active)
  }

  if (App.get_setting(`tab_box`) !== `none`) {
    App.update_tab_box()
  }
}

App.clean_active_history = () => {
  App.active_history = App.active_history.filter(x => document.contains(x.element))
  App.active_history = [...new Set(App.active_history)]
  App.active_history = App.active_history.slice(0, App.get_setting(`max_active_history`))
}