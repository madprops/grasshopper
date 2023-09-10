App.setup_theme = () => {
  App.colorlib = ColorLib()
  App.start_theme_interval(`auto_colors`)
  App.start_theme_interval(`auto_background`)
}

App.start_theme_interval = (setting) => {
  clearInterval(App[`${setting}_interval`])
  let sett = App.get_setting(setting)

  if (sett === `never` || sett === `domain`) {
    return
  }

  if (sett === `party`) {
    sett = App.theme_party_delay
  }

  let delay = App.parse_delay(sett)

  if (!delay) {
    return
  }

  if (delay > 0) {
    App[`${setting}_interval`] = setInterval(() => {
      let sett = App.get_setting(setting)

      if (sett === `never` || sett === `domain`) {
        clearInterval(App[`${setting}_interval`])
        return
      }

      if (setting === `auto_colors`) {
        try {
          App.debug(`Auto Colors`)
          App.random_colors()
        }
        catch (err) {
          clearInterval(App[`${setting}_interval`])
        }
      }
      else if (setting === `auto_background`) {
        try {
          App.debug(`Auto Background`)
          App.auto_background_action()
        }
        catch (err) {
          clearInterval(App[`${setting}_interval`])
        }
      }
    }, delay)

    App.debug(`Started ${setting} interval: ${sett}`)
  }
}

App.auto_background_action = () => {
  let mode = App.get_setting(`auto_background_mode`)

  if (mode === `pool`) {
    App.background_from_pool()
  }
  else if (mode === `random`) {
    App.random_background()
  }
  else if (mode === `pool_random`) {
    let n = App.random_int(0, 1)

    if (n === 0) {
      App.background_from_pool(true)
    }
    else {
      App.random_background()
    }
  }
}

App.apply_theme = (args) => {
  App.debug(`Apply Theme`)

  let def_args = {
    check: false,
    safe_mode: false,
  }

  args = Object.assign(def_args, args)

  try {
    if (!args.background_color) {
      args.background_color = App.get_setting(`background_color`)
    }

    if (!args.text_color) {
      args.text_color = App.get_setting(`text_color`)
    }

    if (!args.background_image) {
      args.background_image = App.get_setting(`background_image`)
    }

    if (!args.background_effect) {
      args.background_effect = App.get_setting(`background_effect`)
    }

    if (!args.background_tiles) {
      args.background_tiles = App.get_setting(`background_tiles`)
    }

    let s_args = App.str(args)

    if (args.check) {
      if (App.last_theme_args === s_args) {
        return
      }
    }

    App.last_theme_args = s_args
    App.last_background_color = args.background_color
    App.last_text_color = args.text_color
    App.last_background_image = args.background_image
    App.set_css_var(`background_color`, args.background_color)
    App.set_css_var(`text_color`, args.text_color)
    let main_background = App.colorlib.rgb_to_rgba(args.background_color, 0.93)
    App.set_css_var(`main_background`, main_background)
    let alt_color_0 = App.colorlib.rgb_to_rgba(args.text_color, 0.15)
    App.set_css_var(`alt_color_0`, alt_color_0)
    let alt_color_1 = App.colorlib.rgb_to_rgba(args.text_color, 0.20)
    App.set_css_var(`alt_color_1`, alt_color_1)
    let alt_color_2 = App.colorlib.rgb_to_rgba(args.text_color, 0.50)
    App.set_css_var(`alt_color_2`, alt_color_2)
    let alt_background = App.colorlib.rgb_to_rgba(args.background_color, 0.66)
    App.set_css_var(`alt_background`, alt_background)
    let alt_background_2 = App.colorlib.get_lighter_or_darker(args.background_color, 0.06)
    App.set_css_var(`alt_background_2`, alt_background_2)

    if (args.safe_mode) {
      return
    }

    for (let color of App.colors) {
      let rgba = App.get_setting(`color_${color}`)
      App.set_css_var(`color_${color}`, rgba)
      App.set_css_var(`color_${color}_2`, App.colorlib.rgba_to_rgb(rgba))
    }

    App.set_css_var(`font_size`, App.get_setting(`font_size`) + `px`)
    App.set_css_var(`font`, `${App.get_setting(`font`)}, sans-serif`)
    let w = `${(App.get_setting(`width`) / 100) * 800}px`
    App.set_css_var(`width`, w)
    let h = `${(App.get_setting(`height`) / 100) * 600}px`
    App.set_css_var(`height`, h)
    let item_padding = 0.42
    let height_diff = 0.15

    if (App.get_setting(`item_height`) === `compact`) {
      item_padding -= height_diff
    }
    else if (App.get_setting(`item_height`) === `bigger`) {
      item_padding += height_diff
    }
    else if (App.get_setting(`item_height`) === `huge`) {
      item_padding += (height_diff * 2)
    }

    App.set_css_var(`item_padding`, `${item_padding}rem`)

    if (App.get_setting(`show_scrollbars`)) {
      document.body.classList.remove(`no_scrollbars`)
    }
    else {
      document.body.classList.add(`no_scrollbars`)
    }

    let main = DOM.el(`#main`)

    if (App.get_setting(`show_footer`)) {
      main.classList.remove(`hide_footer`)
    }
    else {
      main.classList.add(`hide_footer`)
    }

    if (App.get_setting(`show_scroller`)) {
      main.classList.remove(`hide_scroller`)
    }
    else {
      main.classList.add(`hide_scroller`)
    }

    let item_border_opts = [`normal`, `bigger`, `huge`]

    for (let b of item_border_opts) {
      main.classList.remove(`item_border_${b}`)
    }

    let item_border = App.get_setting(`item_border`)

    if (item_border_opts.includes(item_border)) {
      main.classList.add(`item_border_${item_border}`)
    }

    App.set_background(args.background_image)
    App.apply_background_effects(args.background_effect, args.background_tiles)

    if (App.get_setting(`rounded_corners`)) {
      App.set_css_var(`border_radius`, `3px`)
      App.set_css_var(`border_radius_2`, `20px`)
    }
    else {
      App.set_css_var(`border_radius`, `0`)
      App.set_css_var(`border_radius_2`, `0`)
    }

    for (let eff of App.effects) {
      main.classList.remove(`hover_effect_${eff.value}`)
    }

    let hover_effect = App.get_setting(`hover_effect`)
    main.classList.add(`hover_effect_${hover_effect}`)

    for (let eff of App.effects) {
      main.classList.remove(`selected_effect_${eff.value}`)
    }

    let selected_effect = App.get_setting(`selected_effect`)
    main.classList.add(`selected_effect_${selected_effect}`)

    if (App.get_setting(`wrap_text`)) {
      main.classList.remove(`no_wrap`)
    }
    else {
      main.classList.add(`no_wrap`)
    }
  }
  catch (err) {
    App.error(err)
    App.theme_safe_mode()
  }
}

App.theme_safe_mode = () => {
  App.apply_theme({
    background_color: `rgb(33, 33, 33)`,
    text_color: `rgb(222, 222, 222)`,
    safe_mode: true,
  })

  if (!App.theme_safe_mode_msg) {
    App.show_alert_2(`Theme settings are invalid. Using safe mode`)
    App.theme_safe_mode_msg = true
  }
}

App.set_css_var = (name, value) => {
  document.documentElement.style.setProperty(`--${name}`, value)
}

App.get_css_var = (name) => {
  return getComputedStyle(document.documentElement).getPropertyValue(`--${name}`)
}

App.set_dark_colors = () => {
  App.set_colors(App.dark_colors.background, App.dark_colors.text)
}

App.set_light_colors = () => {
  App.set_colors(App.light_colors.background, App.light_colors.text)
}

App.random_colors = () => {
  let c1, c2
  let type = App.get_color_type()

  if (type === `light`) {
    c1 = App.colorlib.get_light_color()
  }
  else if (type === `dark`) {
    c1 = App.colorlib.get_dark_color()
  }

  c2 = App.colorlib.get_lighter_or_darker(c1, App.color_contrast)
  c1 = App.colorlib.hex_to_rgb(c1)
  c2 = App.colorlib.hex_to_rgb(c2)
  App.set_colors(c1, c2)
}

App.set_colors = (c1, c2) => {
  App.set_setting(`background_color`, c1)
  App.set_setting(`text_color`, c2)
  App.check_item_theme()
  App.check_theme_refresh()
}

App.set_default_theme = () => {
  let background = App.get_setting(`background_color`)
  let text = App.get_setting(`text_color`)

  App.apply_theme({
    background_color: background,
    text_color: text,
    check: true,
  })
}

App.set_color_auto = (args) => {
  if (args.background_color) {
    args.background_color = App.parse_color(args.background_color)
  }

  if (!args.text_color) {
    if (args.background_color) {
      args.text_color = App.colorlib.get_lighter_or_darker(args.background_color, App.color_contrast)
    }
  }
  else {
    args.text_color = App.parse_color(args.text_color)
  }

  args.check = true
  App.apply_theme(args)
}

App.parse_color = (color) => {
  color = color.toLowerCase()

  if (color.startsWith(`rgb`)) {
    // Do nothing
  }
  else if (color.startsWith(`#`)) {
    try {
      color = App.colorlib.hex_to_rgb(color)
    }
    catch (err) {
      return
    }
  }
  else {
    let c = App.color_names[color]

    if (c) {
      color = App.colorlib.hex_to_rgb(c)
    }
    else {
      return
    }
  }

  return color
}

App.random_background = async () => {
  let history_1 = await App.get_history(`.jpg`)
  let history_2 = await App.get_history(`.png`)
  let history_3 = []

  if (App.get_setting(`random_background_gifs`)) {
    history_3 = await App.get_history(`.gif`)
  }

  let history = [...history_1, ...history_2, ...history_3]
  App.shuffle_array(history)

  for (let h of history) {
    if (App.is_image(h.url)) {
      App.change_background(h.url)
      break
    }
  }
}

App.change_background = (url, bg_eff, bg_tiles) => {
  App.set_setting(`background_image`, url, false)

  if (bg_eff) {
    App.set_setting(`background_effect`, bg_eff, false)
  }

  if (bg_tiles) {
    App.set_setting(`background_tiles`, bg_tiles, false)
  }

  App.check_item_theme()
  App.check_theme_refresh()
}

App.seeded_colors = (item) => {
  let url = item.hostname || item.path
  let hc = App.hostname_colors[url]
  let background

  if (hc) {
    App.set_color_auto({background_color: hc})
    return
  }

  let rand = App.seeded_random(url)
  let type = App.get_color_type(rand)

  if (type === `dark`) {
    background = App.colorlib.get_dark_color(rand)
  }
  else if (type === `light`) {
    background = App.colorlib.get_light_color(rand)
  }

  App.hostname_colors[url] = background
  App.set_color_auto({background_color: background})
}

App.check_item_theme_debouncer = App.create_debouncer(() => {
  App.do_check_item_theme()
}, App.check_item_theme_delay)

App.check_item_theme = () => {
  App.check_item_theme_debouncer.call()
}

App.do_check_item_theme = () => {
  App.debug(`Check Item Theme`)

  if (App.window_mode === `profile_editor`) {
    return
  }

  App.check_item_theme_debouncer.cancel()
  let item = App.get_selected(App.window_mode)

  if (!item || !item.path) {
    App.set_default_theme()
    return
  }

  if (item.theme_enabled) {
    App.set_color_auto({
      background_color: item.background_color,
      text_color: item.text_color,
      background_image: item.background_image,
      background_effect: item.background_effect,
      background_tiles: item.background_tiles,
    })

    return
  }

  if (App.get_setting(`auto_colors`) === `domain`) {
    App.seeded_colors(item)
    return
  }

  App.set_default_theme()
}

App.get_color_type = (rand, inverse = false) => {
  let types = []
  let type = App.get_setting(`random_colors`)

  if (type === `dark` || type === `both`) {
    types.push(`dark`)
  }

  if (type === `light` || type === `both`) {
    types.push(`light`)
  }

  if (!types.length) {
    return
  }

  let color = App.random_choice(types, rand)

  if (inverse) {
    if (color === `dark`) {
      color = `light`
    }
    else if (color === `light`) {
      color = `dark`
    }
  }

  return color
}

App.background_from_pool = (random = false) => {
  let bi = App.get_setting(`background_image`)
  let next_image
  let waypoint = false
  let images = App.get_setting(`background_pool`)

  if (!images.length) {
    App.show_feedback(`The background pool is empty`, true)
    return
  }

  if (random) {
    let choices = images.filter(x => x !== bi)

    if (choices.length) {
      next_image = App.random_choice(choices)
    }
  }
  else {
    for (let image of images) {
      if (waypoint) {
        next_image = image
        break
      }

      if (bi === image.url) {
        waypoint = true
      }
    }

    if (!next_image) {
      next_image = images[0]
    }
  }

  if (next_image) {
    App.apply_background(next_image)
  }
}

App.check_theme_refresh = () => {
  if (App.on_settings()) {
    if (App.settings_category === `theme`) {
      App.background_color.setColor(App.get_setting(`background_color`), true)
      App.text_color.setColor(App.get_setting(`text_color`), true)
      DOM.el(`#settings_background_image`).value = App.get_setting(`background_image`)
      App.set_settings_menu(`background_effect`, undefined, false)
      App.set_settings_menu(`background_tiles`, undefined, false)
    }
  }
}

App.random_settings_color = (what) => {
  let inverse = what === `text`
  let type = App.get_color_type(undefined, inverse)
  let color

  if (type === `light`) {
    color = App.colorlib.get_light_color()
  }
  else if (type === `dark`) {
    color = App.colorlib.get_dark_color()
  }

  color = App.colorlib.hex_to_rgb(color)
  App.set_setting(`${what}_color`, color)
  App.check_theme_refresh()
}

App.set_background = (url) => {
  if (!url || url === `none`) {
    App.set_css_var(`background_image`, `unset`)
    return
  }

  if (!App.is_url(url)) {
    url = `/img/${url}`
  }

  App.set_css_var(`background_image`, `url(${url})`)
}

App.apply_background_effects = (effect, tiles) => {
  let bg = DOM.el(`#background`)

  function bg_add (cls) {
    bg.classList.add(cls)
  }

  function bg_rem (cls) {
    bg.classList.remove(cls)
  }

  let bg_effect_opts = [`blur`, `grayscale`, `invert`, `rotate_1`, `rotate_2`, `rotate_3`]

  for (let eff of bg_effect_opts) {
    bg_rem(eff)
  }

  if (bg_effect_opts.includes(effect)) {
    bg_add(effect)
  }

  if (tiles !== `none`) {
    bg.style.backgroundSize = `${tiles} auto`
    bg_add(`tiles`)
  }
  else {
    bg.style.backgroundSize = `cover`
    bg_rem(`tiles`)
  }
}