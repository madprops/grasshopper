App.check_warn = (warn_setting, items) => {
  if (items.length >= App.get_setting(`max_warn_limit`)) {
    return false
  }

  let warn_empty = App.get_setting(`warn_on_empty_tabs`)

  if (!warn_empty) {
    if (items.every(App.is_empty_tab)) {
      return true
    }
  }

  let warn_on_action = App.get_setting(warn_setting)

  if (warn_on_action === `always`) {
    return false
  }
  else if (warn_on_action === `never`) {
    return true
  }
  else if (warn_on_action === `multiple`) {
    if (items.length > 1) {
      return false
    }
  }
  else if (warn_on_action === `special`) {
    if (items.length > 1) {
      return false
    }

    for (let item of items) {
      if (!warn_empty) {
        if (App.is_empty_tab(item)) {
          continue
        }
      }

      if (item.pinned && App.get_setting(`warn_special_pinned`)) {
        return false
      }

      if (item.playing && App.get_setting(`warn_special_playing`)) {
        return false
      }

      if (item.header && App.get_setting(`warn_special_header`)) {
        return false
      }

      if (item.unloaded && App.get_setting(`warn_special_unloaded`)) {
        return false
      }

      if (!item.header && App.get_setting(`warn_special_edited`)) {
        if (App.edited(item, false)) {
          return false
        }
      }
    }
  }

  return true
}