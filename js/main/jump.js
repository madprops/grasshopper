App.jump_tabs_tag = (item, num) => {
  let target

  if (num === 1) {
    target = `jump`
  }
  else {
    target = `jump${num}`
  }

  let waypoint = false
  let first = undefined

  for (let item_ of App.get_items(`tabs`)) {
    let tags = App.get_tags(item_)

    if (tags.includes(target)) {
      if (!waypoint) {
        if (!first) {
          first = item_
        }

        if (item_ === item) {
          waypoint = true
        }

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

App.jump_tabs_color = (item, id) => {
  let waypoint = false
  let first = undefined

  for (let item_ of App.get_items(`tabs`)) {
    let id_ = App.get_color(item_)

    if (!id_) {
      continue
    }

    if (id_ === id) {
      if (!waypoint) {
        if (!first) {
          first = item_
        }

        if (item_ === item) {
          waypoint = true
        }

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