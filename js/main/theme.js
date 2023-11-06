App.setup_theme = () => {
  App.apply_theme_debouncer = App.create_debouncer((args) => {
    App.do_apply_theme(args)
  }, App.apply_theme_delay)
}

App.apply_theme = (args) => {
  App.apply_theme_debouncer.call(args)
}

App.do_apply_theme = (args = {}) => {
  App.apply_theme_debouncer.cancel()

  let def_args = {
    safe_mode: false,
  }

  App.def_args(def_args, args)

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
    let text_color_darker = App.colorlib.get_lighter_or_darker(args.text_color, 0.2)
    App.set_css_var(`text_color_darker`, text_color_darker)
    let overlay_color = App.colorlib.rgb_to_rgba(args.background_color, 0.6)
    App.set_css_var(`overlay_color`, overlay_color)
    let alt_background = App.colorlib.get_lighter_or_darker(args.background_color, 0.06)
    App.set_css_var(`alt_background`, alt_background)

    if (args.safe_mode) {
      return
    }

    for (let color of App.colors) {
      let rgb = App.get_setting(`color_${color}`)
      App.set_css_var(`color_${color}`, rgb)
      let text = App.colorlib.get_lighter_or_darker(rgb, 0.8)
      App.set_css_var(`text_${color}`, text)
    }

    App.set_css_var(`font_size`, App.get_setting(`font_size`) + `px`)
    App.set_css_var(`font`, `${App.get_setting(`font`)}, sans-serif`)
    let w = `${(App.get_setting(`width`) / 100) * 800}px`
    App.set_css_var(`width`, w)
    let h = `${(App.get_setting(`height`) / 100) * 600}px`
    App.set_css_var(`height`, h)
    let item_padding = 0.42
    let height_diff = 0.15
    let item_height = App.get_setting(`item_height`)

    if (item_height === `tiny`) {
      item_padding -= (height_diff * 2)
    }
    else if (item_height === `small`) {
      item_padding -= height_diff
    }
    else if (item_height === `big`) {
      item_padding += height_diff
    }
    else if (item_height === `huge`) {
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

    let borders_opts = [`normal`, `big`, `huge`]

    for (let b of borders_opts) {
      main.classList.remove(`borders_${b}`)
    }

    let borders = App.get_setting(`item_border`)

    if (borders_opts.includes(borders)) {
      main.classList.add(`borders_${borders}`)
    }

    App.set_background(args.background_image)
    App.apply_background_effects(args.background_effect, args.background_tiles)

    if (App.get_setting(`rounded_corners`)) {
      App.set_css_var(`border_radius`, `3px`)
      App.set_css_var(`border_radius_2`, `20px`)
      document.body.classList.remove(`no_rounded`)
    }
    else {
      App.set_css_var(`border_radius`, `0`)
      App.set_css_var(`border_radius_2`, `0`)
      document.body.classList.add(`no_rounded`)
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

    if (App.get_setting(`icon_pick`)) {
      main.classList.add(`icon_pick`)
    }
    else {
      main.classList.remove(`icon_pick`)
    }

    let item_icon = App.get_setting(`item_icon`)
    let icon_size = 1.11
    let icon_size_diff = 0.181

    if (item_icon === `tiny`) {
      icon_size -= (icon_size_diff * 2)
    }
    else if (item_icon === `small`) {
      icon_size -= icon_size_diff
    }
    else if (item_icon === `big`) {
      icon_size += icon_size_diff
    }
    else if (item_icon === `huge`) {
      icon_size += (icon_size_diff * 2)
    }

    App.set_css_var(`icon_size`, `${icon_size}rem`)

    let tbh = App.get_setting(`tab_box`)
    let tbh_rem = 12.2
    let tbh_diff = 3.5
    let tbh_display = `flex`

    if (tbh === `none`) {
      tbh_display = `none`
    }
    else if (tbh === `tiny`) {
      tbh_rem -= (tbh_diff * 2)
    }
    else if (tbh === `small`) {
      tbh_rem -= tbh_diff
    }
    else if (tbh === `big`) {
      tbh_rem += (tbh_diff * 2)
    }
    else if (tbh === `huge`) {
      tbh_rem += (tbh_diff * 4)
    }

    App.set_css_var(`tab_box_display`, tbh_display)
    App.set_css_var(`tab_box_height`, `${tbh_rem}rem`)

    if (App.get_setting(`text_glow`)) {
      document.body.classList.add(`text_glow`)
    }
    else {
      document.body.classList.remove(`text_glow`)
    }

    let hb = App.get_setting(`hover_button`)

    if (hb === `left`) {
      main.classList.add(`hover_button_left`)
      main.classList.remove(`hover_button_right`)
    }
    else if (hb === `right`) {
      main.classList.remove(`hover_button_left`)
      main.classList.add(`hover_button_right`)
    }

    let ie = App.get_setting(`icon_effect`)
    let ies = [`none`, `spin`, `invert`, `border`]

    for (let eff of ies) {
      main.classList.remove(`icon_effect_${eff}`)
    }

    main.classList.add(`icon_effect_${ie}`)
    App.insert_color_css()
    App.insert_custom_css()
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
    App.alert(`Theme settings are invalid. Using safe mode`)
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

App.set_colors = (c1, c2) => {
  App.set_setting(`background_color`, c1, false)
  App.set_setting(`text_color`, c2, false)
  App.apply_theme()
  App.check_theme_refresh()
}

App.change_background = (url, bg_eff, bg_tiles) => {
  App.set_setting(`background_image`, url, false)

  if (bg_eff) {
    App.set_setting(`background_effect`, bg_eff, false)
  }

  if (bg_tiles) {
    App.set_setting(`background_tiles`, bg_tiles, false)
  }

  App.apply_theme()
  App.check_theme_refresh()
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

App.random_colors = (type = `dark`) => {
  if (type === `dark`) {
    App.random_color(`background`, `dark`)
    App.random_color(`text`, `light`)
  }
  else {
    App.random_color(`background`, `light`)
    App.random_color(`text`, `dark`)
  }
}

App.random_color = (what, type) => {
  let color

  if (type === `dark`) {
    color = App.colorlib.get_dark_color()
  }
  else if (type === `light`) {
    color = App.colorlib.get_light_color()
  }

  color = App.colorlib.hex_to_rgb(color)
  App.set_setting(`${what}_color`, color)
  App.check_theme_refresh()
}

App.set_background = (url) => {
  function unset () {
    App.set_css_var(`background_image`, `unset`)
  }

  if (!url) {
    unset()
    return
  }

  if (url.toLowerCase().startsWith(`background`)) {
    let match = url.match(/\d+/)

    if (!match) {
      unset()
      return
    }

    let num = parseInt(match[0])

    if (num > App.num_backgrounds) {
      unset()
      return
    }

    url = App.background_path(num)
  }
  else if (!App.is_url(url)) {
    unset()
    return
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

  let effects = App.background_effects.map(x => x.value)

  for (let eff of effects) {
    bg_rem(eff)
  }

  if (effects.includes(effect)) {
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

App.insert_color_css = () => {
  let css = ``

  for (let color of App.colors) {
    css += `.border_${color} {
      border-color: var(--color_${color}) !important;
    }`

    css += `.background_${color} {
      background-color: var(--color_${color}) !important;
      color: var(--text_${color}) !important;
    }`
  }

  for (let style of DOM.els(`.color_css`)) {
    style.remove()
  }

  let style = DOM.create(`style`, `color_css`)
  style.textContent = css
  document.head.appendChild(style)
}

App.insert_custom_css = () => {
  for (let style of DOM.els(`.custom_css`)) {
    style.remove()
  }

  if (App.get_setting(`custom_css`)) {
    let style = DOM.create(`style`, `custom_css`)
    style.textContent = App.get_setting(`custom_css`)
    document.head.appendChild(style)
  }
}