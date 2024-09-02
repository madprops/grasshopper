App.jump_action = (item, what) => {
  App.tabs_action(item, what)
}

App.jump_first = (item, first, what) => {
  if (first && (first !== item)) {
    App.jump_action(first, what)
  }
}

App.jump_vars = () => {
  let items = App.get_items(`tabs`)
  let unloaded = App.get_setting(`jump_unloaded`)
  let playing = App.get_setting(`jump_playing`)
  return {items, unloaded, playing}
}

App.jump_tabs = (what, info, reverse = false) => {
  let item = App.get_active_tab_item()
  let {items, unloaded, playing} = App.jump_vars()
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

  if ([`header`, `subheader`, `split`, `zone`].includes(what)) {
    action = `jump_zone`
  }
  else {
    action = `jump`
  }

  if (reverse) {
    items = items.slice(0).reverse()
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
      else if (it.playing && playing) {
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
      else if (it.playing && playing) {
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
      else if (it.playing && playing) {
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
      else if (it.playing && playing) {
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
      else if (it.playing && playing) {
        match = true
      }

      return match
    }
  }

  // -------------------------

  for (let item_ of items) {
    let matched = check(item_)

    if (matched) {
      matched_once = true
    }

    if (item_ === item) {
      waypoint = true
      check_first(item_)
      continue
    }

    if (matched) {
      if (item_.unloaded && !unloaded) {
        continue
      }

      if (!waypoint) {
        check_first(item_)
        continue
      }

      App.jump_action(item_, action)
      return
    }
  }

  if (!matched_once) {
    if (what === `tag`) {
      App.alert(`To use jump give tabs the 'jump', 'jump2', or 'jump3' tags`)
    }
  }

  App.jump_first(item, first, action)
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