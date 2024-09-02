App.jump_tabs = (what, info, reverse = false) => {
  let item = App.get_selected(`tabs`)

  if (!item) {
    item = App.get_active_tab_item()
  }

  let items = App.get_items(`tabs`)
  let unloaded = App.get_setting(`jump_unloaded`)
  let headers = [`header`, `subheader`]
  let zones = [...headers, `split`, `zone`]
  let index = items.indexOf(item)
  let matched_once = false
  let waypoint = false
  let first = undefined
  let target, action

  if (what === `tag`) {
    if (info === 1) {
      target = `jump`
    }
    else {
      target = `jump${info}`
    }
  }
  else if (headers.includes(what)) {
    if (index > 0) {
      let h_action = App.get_setting(`header_action`)

      if (h_action === `first`) {
        if (items[index - 1].header) {
          item = items[index - 1]
        }
      }
    }
  }

  if (zones.includes(what)) {
    action = `jump_zone`
  }
  else {
    action = `jump`
  }

  if (reverse) {
    items = items.slice(0).reverse()
  }

  function jump(it) {
    App.tabs_action(it, action)
  }

  function check_first(it) {
    if (!first) {
      first = it
    }
  }

  let check

  if (what === `color`) {
    check = function(it) {
      let match = false
      let id = App.get_color(it)

      if (id && (id === info)) {
        match = true
      }

      return match
    }
  }
  else if (what === `tag`) {
    check = function(it) {
      let match = false
      let tags = App.get_tags(it)

      if (tags.includes(target)) {
        match = true
      }

      return match
    }
  }
  else if (what === `header`) {
    check = function(it) {
      let match = false

      if (App.is_header(it)) {
        match = true
      }

      return match
    }
  }
  else if (what === `subheader`) {
    check = function(it) {
      let match = false

      if (App.is_subheader(it)) {
        match = true
      }

      return match
    }
  }
  else if (what === `split`) {
    check = function(it) {
      let match = false

      if (App.get_split_top(it) || App.get_split_bottom(it)) {
        if (!it.header) {
          match = true
        }
      }

      return match
    }
  }
  else if (what === `zone`) {
    check = function(it) {
      let match = false

      if (it.header || App.get_split_top(it) || App.get_split_bottom(it)) {
        match = true
      }

      return match
    }
  }

  // -------------------------

  for (let it of items) {
    let matched = check(it)

    if (matched) {
      matched_once = true
    }

    if (it === item) {
      waypoint = true
      check_first(it)
      continue
    }

    if (matched) {
      if (it.unloaded && !unloaded) {
        continue
      }

      if (!waypoint) {
        check_first(it)
        continue
      }

      jump(it)
      return
    }
  }

  if (!matched_once) {
    if (what === `tag`) {
      App.alert(`To use jump give tabs the 'jump', 'jump2', or 'jump3' tags`)
    }
  }

  if (first && (first !== item)) {
    jump(first)
  }
}

App.jump_tabs_color = (id, reverse = false) => {
  App.jump_tabs(`color`, id, reverse)
}

App.jump_tabs_tag = (num, reverse = false) => {
  App.jump_tabs(`tag`, num, reverse)
}

App.jump_tabs_header = (reverse = false) => {
  App.jump_tabs(`header`, undefined, reverse)
}

App.jump_tabs_subheader = (reverse = false) => {
  App.jump_tabs(`subheader`, undefined, reverse)
}

App.jump_tabs_split = (reverse = false) => {
  App.jump_tabs(`split`, undefined, reverse)
}

App.jump_tabs_zone = (reverse = false) => {
  App.jump_tabs(`zone`, undefined, reverse)
}