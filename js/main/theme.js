App.setup_theme = () => {
  App.colorlib = ColorLib()
  App.start_theme_interval(`auto_theme`)
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

      if (setting === `auto_theme`) {
        try {
          App.debug(`Auto Theme`)
          App.random_theme()
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

    let s_args = JSON.stringify(args)

    if (App.last_theme_args === s_args) {
      return
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
    let item_height = 2.15
    let height_diff = 0.45

    if (App.get_setting(`item_height`) === `compact`) {
      item_height -= height_diff
    }
    else if (App.get_setting(`item_height`) === `bigger`) {
      item_height += height_diff
    }
    else if (App.get_setting(`item_height`) === `huge`) {
      item_height += (height_diff * 2)
    }

    if (App.get_setting(`text_mode`).includes(`_`)) {
      item_height += 1
    }

    App.set_css_var(`item_height`, `${item_height}rem`)
    App.animate_background_image(args.background_image)

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

    let bg1 = DOM.el(`#background_1`)
    let bg2 = DOM.el(`#background_2`)

    function bg_add (cls) {
      bg1.classList.add(cls)
      bg2.classList.add(cls)
    }

    function bg_rem (cls) {
      bg1.classList.remove(cls)
      bg2.classList.remove(cls)
    }

    let bg_effect_opts = [`blur`, `grayscale`, `invert`, `rotate_1`, `rotate_2`, `rotate_3`]

    for (let eff of bg_effect_opts) {
      bg_rem(eff)
    }

    if (bg_effect_opts.includes(args.background_effect)) {
      bg_add(args.background_effect)
    }

    if (args.background_tiles !== `none`) {
      App.set_css_var(`bg_tiles_width`, args.background_tiles)
      bg_add(`tiles`)
    }
    else {
      bg_rem(`tiles`)
    }

    if (App.get_setting(`color_transitions`)) {
      let d = App.color_transition_delay
      App.set_css_var(`color_transition`, `background-color ${d}ms, color ${d}ms`)
    }
    else {
      App.set_css_var(`color_transition`, `none`)
    }

    if (App.get_setting(`rounded_corners`)) {
      App.set_css_var(`border_radius`, `3px`)
      App.set_css_var(`border_radius_2`, `20px`)
    }
    else {
      App.set_css_var(`border_radius`, `0`)
      App.set_css_var(`border_radius_2`, `0`)
    }

    let hover_opts = [`glow`, `underline`, `bold`, `bigger`]
    let hover_effect = App.get_setting(`hover_effect`)

    for (let eff of hover_opts) {
      main.classList.remove(`hover_effect_${eff}`)
    }

    if (hover_opts.includes(hover_effect)) {
      main.classList.add(`hover_effect_${hover_effect}`)
    }

    let selected_opts = [`background`, `underline`, `bold`, `bigger`]
    let selected_effect = App.get_setting(`selected_effect`)

    for (let eff of selected_opts) {
      main.classList.remove(`selected_effect_${eff}`)
    }

    if (selected_opts.includes(selected_effect)) {
      main.classList.add(`selected_effect_${selected_effect}`)
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

App.dark_theme = () => {
  App.set_theme(App.dark_theme_colors.background, App.dark_theme_colors.text)
}

App.light_theme = () => {
  App.set_theme(App.light_theme_colors.background, App.light_theme_colors.text)
}

App.random_theme = () => {
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
  App.set_theme(c1, c2)
}

App.set_theme = (c1, c2) => {
  App.set_setting(`background_color`, c1)
  App.set_setting(`text_color`, c2)
  App.check_item_theme()
  App.check_theme_refresh()
}

App.set_default_theme = () => {
  let background = App.get_setting(`background_color`)
  let text = App.get_setting(`text_color`)
  App.apply_theme({background_color: background, text_color: text})
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
  App.set_setting(`background_image`, url)

  if (bg_eff) {
    App.set_setting(`background_effect`, bg_eff)
  }

  if (bg_tiles) {
    App.set_setting(`background_tiles`, bg_tiles)
  }

  App.check_item_theme()
  App.check_theme_refresh()
}

App.seeded_theme = (item) => {
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

  if (App.get_setting(`auto_theme`) === `domain`) {
    App.seeded_theme(item)
    return
  }

  App.set_default_theme()
}

App.get_color_type = (rand, inverse = false) => {
  let types = []
  let type = App.get_setting(`random_themes`)

  if (type === `dark` || type === `both`) {
    types.push(`dark`)
  }

  if (type === `light` || type === `both`) {
    types.push(`light`)
  }

  if (types.length === 0) {
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

  if (images.length === 0) {
    App.show_feedback(`The background pool is empty`)
    return
  }

  if (random) {
    let choices = images.filter(x => x !== bi)

    if (choices.length > 0) {
      next_image = App.random_choice(choices)
    }
  }
  else {
    for (let image of images) {
      let img = image.split(`;`)[0].trim()

      if (waypoint) {
        next_image = image
        break
      }

      if (bi === img) {
        waypoint = true
      }
    }

    if (!next_image) {
      next_image = images[0]
    }
  }

  if (next_image) {
    App.apply_pool(next_image)
  }
}

App.animate_background_image = (url) => {
  App.debug(`Animate Background`)
  let new_num = App.active_background === 1 ? 2 : 1
  let old_num = new_num === 1 ? 2 : 1
  let new_el = DOM.el(`#background_${new_num}`)
  let old_el = DOM.el(`#background_${old_num}`)

  if (url && old_el.style.backgroundImage.includes(url)) {
    return
  }

  App.active_background = new_num

  function proc (n1, n2) {
    new_el.style.opacity = n1
    old_el.style.opacity = n2
  }

  function bg (value) {
    new_el.style.backgroundImage = value
  }

  if (!url) {
    proc(1, 0)
    bg(`unset`)
    App.first_bg_image = true
    return
  }
  else {
    App.background_image = new Image()
    App.background_image.src = url

    DOM.ev(App.background_image, `load`, () => {
      bg(`url(${url})`)

      if (!App.get_setting(`background_transitions`) || !App.first_bg_image) {
        proc(1, 0)
        App.first_bg_image = true
        return
      }

      let op_new = 0
      let op_old = 1
      let amount = 0.1
      proc(op_new, op_old)
      App.first_bg_image = true
      let date = Date.now()
      App.animate_background_date = date

      function tick () {
        try {
          if (App.animate_background_date !== date) {
            return
          }

          op_new = parseFloat(Math.min(op_new + amount, 1).toFixed(1))
          op_old = parseFloat(Math.max(op_old - amount, 0).toFixed(1))
          proc(op_new, op_old)

          if ((op_new >= 1) && (op_old <= 0)) {
            proc(1, 0)
            return
          }

          setTimeout(() => {
            tick()
          }, App.background_animation_delay)
        }
        catch (err) {
          proc(1, 0)
        }
      }

      tick()
    })

    DOM.ev(App.background_image, `error`, () => {
      proc(1, 0)
      bg(`unset`)
      App.first_bg_image = true
    })
  }
}

App.add_to_background_pool = (url) => {
  if (!url) {
    url = App.get_setting(`background_image`)
  }

  if (!url) {
    return
  }

  App.addlist_remove_components(`background_pool`, `pool`, url, true)
  let pool = App.get_setting(`background_pool`)
  pool.unshift(`${url} ; none ; none`)
  App.set_setting(`background_pool`, pool)
  App.check_theme_refresh()
  App.show_feedback(`Added to background pool`)
}

App.check_theme_refresh = () => {
  if (App.on_settings()) {
    if (App.settings_category === `theme`) {
      App.background_color.setColor(App.get_setting(`background_color`))
      App.text_color.setColor(App.get_setting(`text_color`))
      DOM.el(`#settings_background_image`).value = App.get_setting(`background_image`)
      App.set_settings_menu(`background_effect`)
      App.set_settings_menu(`background_tiles`)
      App.refresh_textarea(`background_pool`)
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