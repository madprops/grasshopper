App.jump_action = (item) => {
  App.tabs_action(item, `jump`)
}

App.jump_first = (item, first) => {
  if (first && (first !== item)) {
    App.jump_action(first)
  }
}

App.jump_vars = (item) => {
  let items = App.get_items(`tabs`)
  let index = items.indexOf(item)
  return {items, index}
}

App.jump_tabs_tag = (num) => {
  let item = App.get_active_tab_item()
  let target

  if (num === 1) {
    target = `jump`
  }
  else {
    target = `jump${num}`
  }

  let waypoint = false
  let first = undefined
  let {items, index} = App.jump_vars(item)
  let skip_unloaded = !App.get_setting(`jump_unloaded`)

  function check_first(it) {
    if (!first) {
      first = it
    }
  }

  for (let [i, item_] of items.entries()) {
    if (i === index) {
      waypoint = true
      check_first(item_)
      continue
    }

    let tags = App.get_tags(item_)

    // Check
    if (tags.includes(target)) {
      if (item_.unloaded && skip_unloaded) {
        continue
      }

      if (!waypoint) {
        check_first(item_)
        continue
      }

      App.jump_action(item_)
      return
    }
  }

  App.jump_first(item, first)
}

App.jump_tabs_color = (id) => {
  let item = App.get_active_tab_item()
  let waypoint = false
  let first = undefined
  let {items, index} = App.jump_vars(item)
  let skip_unloaded = !App.get_setting(`jump_unloaded`)

  function check_first(it) {
    if (!first) {
      first = it
    }
  }

  for (let [i, item_] of items.entries()) {
    if (i === index) {
      waypoint = true
      check_first(item_)
      continue
    }

    let id_ = App.get_color(item_)

    if (!id_) {
      continue
    }

    // Check
    if (id_ === id) {
      if (item_.unloaded && skip_unloaded) {
        continue
      }

      if (!waypoint) {
        check_first(item_)
        continue
      }

      App.jump_action(item_)
      return
    }
  }

  App.jump_first(item, first)
}