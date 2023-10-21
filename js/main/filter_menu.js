App.create_filter_menu = (mode) => {
  function separator () {
    return {type: App.separator_string, skip: true}
  }

  let btn = DOM.create(`div`, `button icon_button filter_button`, `${mode}_filter_modes`)
  btn.title = `Filters (Ctrl + F) - Right Click to show filter commands`
  btn.append(DOM.create(`div`, ``, `${mode}_filter_modes_text`))
  let fmodes = []
  fmodes.push({type: `all`, text: `All`})
  let m_modes = App[`${mode}_filter_modes`]

  if (m_modes) {
    fmodes.push(separator())
    fmodes.push(...m_modes)
  }

  let image_icon = App.get_setting(`image_icon`)
  let video_icon = App.get_setting(`video_icon`)
  let audio_icon = App.get_setting(`audio_icon`)
  let color_icon = App.settings_icons.theme
  fmodes.push(separator())
  fmodes.push({type: `image`, text: `Image`, skip: false, info: `Show image items`, icon: image_icon})
  fmodes.push({type: `video`, text: `Video`, skip: false, info: `Show video items`, icon: video_icon})
  fmodes.push({type: `audio`, text: `Audio`, skip: false, info: `Show audio items`, icon: audio_icon})
  fmodes.push(separator())
  fmodes.push({type: `color`, text: `Color`, skip: true, skip: `Filter by a specific color`, icon: color_icon})

  if (mode !== `tabs`) {
    fmodes.push(separator())
    fmodes.push({type: `notab`, text: `No Tab`, skip: false, info: `Items that are not open in a tab`})
  }

  fmodes.push(separator())
  fmodes.push({type: `refine`, text: `Refine`, skip: true, skip: `Refine the filter`})
  fmodes.push({type: `custom`, text: `Custom`, skip: true, skip: `Pick a custom filter`})
  App[`${mode}_filter_modes_all`] = fmodes

  DOM.ev(btn, `click`, () => {
    App.show_filter_menu(mode)
  })

  DOM.ev(btn, `contextmenu`, (e) => {
    e.preventDefault()
    App.show_palette(`filter`)
  })

  DOM.ev(btn, `auxclick`, (e) => {
    if (e.button === 1) {
      let cmd = App.get_setting(`middle_click_filter_menu`)
      App.run_command({cmd: cmd, from: `filter_menu`})
    }
  })

  DOM.ev(btn, `wheel`, (e) => {
    let direction = App.wheel_direction(e)

    if (direction === `down`) {
      App.cycle_filter_modes(mode, true)
    }
    else if (direction === `up`) {
      App.cycle_filter_modes(mode, false)
    }
  })

  return btn
}

App.show_filter_menu = (mode) => {
  let items = []

  for (let filter_mode of App.filter_modes(mode)) {
    if (filter_mode.type === App.separator_string) {
      App.sep(items)
      continue
    }
    else if (filter_mode.type === `color`) {
      items.push({
        icon: filter_mode.icon,
        text: filter_mode.text,
        get_items: () => {
          return App.get_color_items(mode)
        },
        info: filter_mode.info,
      })

      continue
    }
    else if (filter_mode.type === `custom`) {
      items.push({
        icon: filter_mode.icon,
        text: `Custom`,
        get_items: () => {
          return App.get_custom_filters(mode)
        },
        info: filter_mode.info,
      })

      continue
    }
    else if (filter_mode.type === `refine`) {
      items.push({
        icon: filter_mode.icon,
        text: filter_mode.text,
        get_items: () => {
          return App.get_filter_refine(mode)
        },
        info: filter_mode.info,
      })

      continue
    }

    let selected = App.filter_mode(mode) === filter_mode.type

    items.push({
      icon: filter_mode.icon,
      text: filter_mode.text,
      action: () => {
        App.set_filter_mode({mode: mode, type: filter_mode.type})
      },
      selected: selected,
      info: filter_mode.info,
    })
  }

  let btn = DOM.el(`#${mode}_filter_modes`)
  NeedContext.show({element: btn, items: items, margin: btn.clientHeight})
}

App.cycle_filter_modes = (mode, reverse = true) => {
  let modes = App.filter_modes(mode)
  let waypoint = false

  if (reverse) {
    modes = modes.slice(0).reverse()
  }

  let first

  for (let filter_mode of modes.slice(0).reverse()) {
    if (filter_mode.skip) {
      continue
    }

    if (!first) {
      first = filter_mode
    }

    if (waypoint) {
      App.set_filter_mode({mode: mode, type: filter_mode.type, instant: false})
      return
    }

    if (filter_mode.type === App.filter_mode(mode)) {
      waypoint = true
    }
  }

  App.set_filter_mode({mode: mode, type: first.type, instant: false})
}