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
  let items = App.get_items(`tabs`)
  let index = items.indexOf(item)

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

    if (tags.includes(target)) {
      if (!waypoint) {
        check_first(item_)
        continue
      }

      App.tabs_action(item_, `jump`)
      return
    }
  }

  if (first) {
    App.tabs_action(first, `jump`)
  }
}

App.jump_tabs_color = (id) => {
  let item = App.get_active_tab_item()
  let waypoint = false
  let first = undefined
  let items = App.get_items(`tabs`)
  let index = items.indexOf(item)

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

    if (id_ === id) {
      if (!waypoint) {
        check_first(item_)
        continue
      }

      App.tabs_action(item_, `jump`)
      return
    }
  }

  if (first) {
    App.tabs_action(first, `jump`)
  }
}