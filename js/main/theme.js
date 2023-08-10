App.setup_theme = () => {
  App.colorlib = ColorLib()
  App.start_theme_interval(`auto_theme`)
  App.start_theme_interval(`auto_background`)
}

App.start_theme_interval = (setting) => {
  clearInterval(App[`${setting}_interval`])
  let s = App.get_setting(setting)

  if (s === `none` || s === `domain`) {
    return
  }

  let delay = App.parse_delay(s)

  if (!delay) {
    return
  }

  if (delay > 0) {
    App[`${setting}_interval`] = setInterval(() => {
      if (setting === `auto_theme`) {
        App.random_theme()
      }
      else if (setting === `auto_background`) {
        App.random_background(false)
      }
    }, delay)

    App.log(`Started ${setting} interval: ${s}`)
  }
}

App.apply_theme = (background, text, check = false, safe_mode = false) => {
  try {
    if (!background) {
      background = App.get_setting(`background_color`)
    }

    if (!text) {
      text = App.get_setting(`text_color`)
    }

    if (check) {
      if (background === App.last_background_color && text === App.last_text_color) {
        return
      }
    }

    App.last_background_color = background
    App.last_text_color = text
    App.set_css_var(`background_color`, background)
    App.set_css_var(`text_color`, text)
    let main_background = App.colorlib.rgb_to_rgba(background, 0.93)
    App.set_css_var(`main_background`, main_background)
    let alt_color_0 = App.colorlib.rgb_to_rgba(text, 0.15)
    App.set_css_var(`alt_color_0`, alt_color_0)
    let alt_color_1 = App.colorlib.rgb_to_rgba(text, 0.20)
    App.set_css_var(`alt_color_1`, alt_color_1)
    let alt_color_2 = App.colorlib.rgb_to_rgba(text, 0.50)
    App.set_css_var(`alt_color_2`, alt_color_2)
    let alt_background = App.colorlib.rgb_to_rgba(background, 0.55)
    App.set_css_var(`alt_background`, alt_background)
    let alt_background_2 = App.colorlib.get_lighter_or_darker(background, 0.06)
    App.set_css_var(`alt_background_2`, alt_background_2)

    if (safe_mode) {
      return
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
    let bg_img = App.get_setting(`background_image`)

    if (bg_img) {
      App.set_css_var(`background_image`, `url(${bg_img})`)
    }
    else {
      App.set_css_var(`background_image`, `unset`)
    }

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

    let item_border_opts = [`normal`, `bigger`]

    for (let b of item_border_opts) {
      main.classList.remove(`item_border_${b}`)
    }

    let item_border = App.get_setting(`item_border`)

    if (item_border_opts.includes(item_border)) {
      main.classList.add(`item_border_${item_border}`)
    }

    let bg = DOM.el(`#background`)
    let bg_effect_opts = [`blur`, `grayscale`, `invert`, `rotate_1`, `rotate_2`, `rotate_3`]
    let bg_effect = App.get_setting(`background_effect`)

    for (let eff of bg_effect_opts) {
      bg.classList.remove(eff)
    }

    if (bg_effect_opts.includes(bg_effect)) {
      bg.classList.add(bg_effect)
    }

    let bg_tiles = App.get_setting(`background_tiles`)

    if (bg_tiles !== `none`) {
      App.set_css_var(`background_tile_width`, bg_tiles)
      bg.classList.add(`tiles`)
    }
    else {
      bg.classList.remove(`tiles`)
    }

    if (App.get_setting(`color_transitions`)) {
      App.set_css_var(`color_transition`, `background-color 1400ms, color 600ms`)
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

    let hover_opts = [`glow`, `underline`, `bold`]
    let hover_effect = App.get_setting(`hover_effect`)

    for (let eff of hover_opts) {
      main.classList.remove(`hover_effect_${eff}`)
    }

    if (hover_opts.includes(hover_effect)) {
      main.classList.add(`hover_effect_${hover_effect}`)
    }
  }
  catch (err) {
    App.log(err, `error`)
    App.theme_safe_mode()
  }
}

App.theme_safe_mode = () => {
  App.apply_theme(`rgb(33, 33, 33)`, `rgb(222, 222, 222)`, false, true)

  if (!App.theme_safe_mode_msg) {
    App.show_alert_2(`Theme settings are invalid. Using safe mode`)
    App.theme_safe_mode_msg = true
  }
}

App.set_css_var = (name, value) => {
  document.documentElement.style.setProperty(`--${name}`, value)
}

App.dark_theme = () => {
  App.set_theme(App.dark_theme_colors.background, App.dark_theme_colors.text)
}

App.light_theme = () => {
  App.set_theme(App.light_theme_colors.background, App.light_theme_colors.text)
}

App.random_theme = () => {
  let c1, c2
  let types = []

  if (App.get_setting(`random_theme_light`)) {
    types.push(`light`)
  }

  if (App.get_setting(`random_theme_dark`)) {
    types.push(`dark`)
  }

  if (types.length === 0) {
    return
  }

  let type = App.random_choice(types)

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

  if (App.window_mode === `profile_editor`) {
    // Don't apply theme
  }
  else {
    App.apply_theme(c1, c2, true)
  }

  if (App.on_settings()) {
    if (App.settings_category === `theme`) {
      App.refresh_theme_settings()
    }
  }
}

App.set_default_theme = () => {
  let background = App.get_setting(`background_color`)
  let text = App.get_setting(`text_color`)
  App.apply_theme(background, text, true)
}

App.set_color_auto = (background, text) => {
  if (!background) {
    return
  }

  background = App.parse_color(background)

  if (!text) {
    text = App.colorlib.get_lighter_or_darker(background, App.color_contrast)
  }
  else {
    text = App.parse_color(text)
  }

  App.apply_theme(background, text, true)
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

App.random_background = async (feedback = true) => {
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
      App.set_setting(`background_image`, h.url)
      App.apply_theme()

      if (App.on_settings()) {
        if (App.settings_category === `theme`) {
          App.refresh_theme_settings()
          break
        }
      }

      if (feedback) {
        App.show_feedback_2(`Background changed to:\n\n${h.url}`)
      }

      break
    }
  }
}

App.change_background = (url) => {
  App.set_setting(`background_image`, url)
  App.apply_theme()
}

App.refresh_theme_settings = () => {
  App.background_color.setColor(App.get_setting(`background_color`))
  App.text_color.setColor(App.get_setting(`text_color`))
  DOM.el(`#settings_background_image`).value = App.get_setting(`background_image`)
}

App.seeded_theme = (item) => {
  let url = item.hostname || item.path
  let hc = App.hostname_colors[url]
  let background

  if (hc) {
    background = hc
  }
  else {
    let rand = App.seeded_random(url)

    function get() {
      return App.get_random_int(0, App.seeded_theme_max, undefined, rand)
    }

    background = `rgb(${get()}, ${get()}, ${get()})`
    App.hostname_colors[url] = background
  }

  App.set_color_auto(background)
}

App.check_item_theme_debouncer = App.create_debouncer(() => {
  App.do_check_item_theme()
}, App.check_item_theme_delay)

App.check_item_theme = () => {
  App.check_item_theme_debouncer.call()
}

App.do_check_item_theme = () => {
  App.check_item_theme_debouncer.cancel()
  let item = App.get_active_tab_item()

  if (!item || !item.path) {
    App.set_default_theme()
    return
  }

  if (item.background_color && item.text_color) {
    App.set_color_auto(item.background_color, item.text_color)
    return
  }

  let domain_theme = App.get_domain_props(`domain_themes`, item)

  if (domain_theme) {
    App.set_color_auto(domain_theme.prop_1, domain_theme.prop_2)
    return
  }

  if (App.get_setting(`auto_theme`) === `domain`) {
    App.seeded_theme(item)
    return
  }

  App.set_default_theme()
}