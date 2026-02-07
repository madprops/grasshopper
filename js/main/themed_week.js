App.check_themed_week = () => {
  if (!App.get_setting(`themed_week_enabled`)) {
    return
  }

  let day = App.get_day_number()
  App.set_theme(day)
}