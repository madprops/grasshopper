App.setup_theme = () => {
  App.colorlib = ColorLib()

  App.apply_theme_debouncer = App.create_debouncer((args) => {
    App.do_apply_theme(args)
  }, App.apply_theme_delay)
}

App.check_color = (color) => {
  if (color.startsWith(`#`)) {
    return App.colorlib.hex_to_rgb(color)
  }

  return color
}

App.opacity = (color, amount) => {
  return App.colorlib.rgb_to_rgba(color, amount)
}

App.contrast = (color, amount) => {
  return App.colorlib.get_lighter_or_darker(color, amount)
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

    args.background_color = App.check_color(args.background_color)

    if (!args.text_color) {
      args.text_color = App.get_setting(`text_color`)
    }

    args.text_color = App.check_color(args.text_color)

    if (!args.background_image) {
      args.background_image = App.get_setting(`background_image`)
    }

    if (!args.background_effect) {
      args.background_effect = App.get_setting(`background_effect`)
    }

    if (!args.background_tiles) {
      args.background_tiles = App.get_setting(`background_tiles`)
    }

    if (!args.background_zoom) {
      args.background_zoom = App.get_setting(`background_zoom`)
    }

    App.set_css_var(`background_color`, args.background_color)
    App.set_css_var(`text_color`, args.text_color)
    let bg_opacity = App.get_setting(`background_opacity`) / 100
    let main_background = App.opacity(args.background_color, bg_opacity)
    App.set_css_var(`main_background`, main_background)
    let slight_shade = App.opacity(args.text_color, 0.1)
    App.set_css_var(`slight_shade`, slight_shade)
    let alt_color_0 = App.opacity(args.text_color, 0.15)
    App.set_css_var(`alt_color_0`, alt_color_0)
    let alt_color_1 = App.opacity(args.text_color, 0.20)
    App.set_css_var(`alt_color_1`, alt_color_1)
    let alt_color_2 = App.opacity(args.text_color, 0.50)
    App.set_css_var(`alt_color_2`, alt_color_2)
    let text_color_darker = App.contrast(args.text_color, 0.2)
    App.set_css_var(`text_color_darker`, text_color_darker)
    let overlay_color = App.opacity(args.background_color, 0.6)
    App.set_css_var(`overlay_color`, overlay_color)
    App.slight_shade = slight_shade
    App.text_color = args.text_color
    App.background_color = args.background_color
    App.text_color_darker = text_color_darker
    App.alt_color_0 = alt_color_0
    App.alt_color_1 = alt_color_1
    App.alt_color_2 = alt_color_2

    if (args.safe_mode) {
      return
    }

    App.set_css_var(`font_size`, App.get_setting(`font_size`) + `px`)
    let w = `${(App.get_setting(`width`) / 100) * App.popup_width}px`
    App.set_css_var(`width`, w)
    let h = `${(App.get_setting(`height`) / 100) * App.popup_height}px`
    App.set_css_var(`height`, h)

    if (App.get_setting(`show_scrollbars`)) {
      document.body.classList.remove(`no_scrollbars`)
    }
    else {
      document.body.classList.add(`no_scrollbars`)
    }

    if (App.get_setting(`show_scroller`)) {
      App.main_remove(`hide_scroller`)
    }
    else {
      App.main_add(`hide_scroller`)
    }

    App.set_background(args.background_image)

    App.apply_background_effects(
      args.background_effect,
      args.background_tiles,
      args.background_zoom,
    )

    if (App.get_setting(`rounded_corners`)) {
      App.set_css_var(`border_radius`, `3px`)
      document.body.classList.remove(`no_rounded`)
    }
    else {
      App.set_css_var(`border_radius`, `0`)
      document.body.classList.add(`no_rounded`)
    }

    if (App.get_setting(`button_icons`)) {
      App.main_add(`button_text_icon_enabled`)
    }
    else {
      App.main_remove(`button_text_icon_enabled`)
    }

    let active_bgs = [`none`, `normal`, `tab_box`, `everywhere`]

    for (let bg of active_bgs) {
      App.main_remove(`active_background_${bg}`)
    }

    let active_bg = App.get_setting(`background_color_active_mode`)
    App.main_add(`active_background_${active_bg}`)

    let uto = App.get_setting(`unloaded_opacity`) / 100
    let border_color = App.get_setting(`window_border_color`)
    let glow_color = App.get_setting(`window_border_glow`)
    let glow_speed = App.get_setting(`window_border_glow_speed`)
    let glow_hover = App.get_setting(`window_border_glow_hover`)

    App.set_css_var(`unloaded_opacity`, uto)
    App.set_css_var(`window_border_width`, App.get_setting(`window_border_width`) + `px`)
    App.set_css_var(`window_border_color`, border_color)
    App.set_css_var(`window_border_glow_color`, glow_color)
    App.set_css_var(`window_border_glow_speed`, `${glow_speed}s`)

    let sidemodes = [
      `full`,
      `top`,
      `bottom`,
      `left`,
      `right`,
      `except_top`,
      `except_bottom`,
      `except_left`,
      `except_right`,
      `just_glow`,
    ]

    for (let side of sidemodes) {
      App.supermain_remove(`window_border_${side}`)
    }

    App.supermain_remove(`window_border_glow`)

    let sides = App.get_setting(`window_border_sides`)
    App.supermain_add(`window_border_${sides}`)

    if ((sides === `full`) || sides.includes(`except`) || (sides === `just_glow`)) {
      if (App.get_setting(`enable_window_border_glow`)) {
        if (border_color !== glow_color) {
          App.supermain_add(`window_border_glow`)
        }
      }
    }

    if (glow_hover) {
      App.supermain_add(`window_border_glow_hover`)
    }
    else {
      App.supermain_remove(`window_border_glow_hover`)
    }

    if (App.get_setting(`container_icon_text`)) {
      App.main_add(`container_with_text`)
    }
    else {
      App.main_remove(`container_with_text`)
    }

    if (!App.get_setting(`show_settings_info`)) {
      App.main_add(`hide_settings_info`)
    }
    else {
      App.main_remove(`hide_settings_info`)
    }

    if (App.get_setting(`auto_color_enabled`)) {
      let t = App.get_setting(`auto_color_transition`)
      App.set_css_var(`auto_color_transition`, `${t}ms`)
    }
    else {
      App.set_css_var(`auto_color_transition`, 0)
    }

    App.set_item_vars()
    App.set_close_button_vars()
    App.set_hover_button_vars()
    App.set_pinline_vars()
    App.set_tab_box_vars()
    App.set_icon_size_vars()
    App.set_item_padding_vars()
    App.set_footer_vars()
    App.set_favorite_vars()
    App.set_main_title_vars()
    App.set_zone_vars()
    App.set_effect_vars()
    App.set_taglist_vars()
    App.set_filter_vars()
    App.set_top_panel_vars()
    App.set_obfuscate_vars()

    App.insert_tab_color_css()
    App.insert_color_css()
    App.insert_icon_css()
    App.insert_custom_css()

    App.start_auto_color()
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
  App.set_setting({setting: `background_opacity`, value: 100})
  App.set_colors(App.dark_colors.background, App.dark_colors.text)
}

App.set_light_colors = () => {
  App.set_setting({setting: `background_opacity`, value: 100})
  App.set_colors(App.light_colors.background, App.light_colors.text)
}

App.set_colors = (c1, c2) => {
  App.set_setting({setting: `background_color`, value: c1})
  App.set_setting({setting: `text_color`, value: c2})
  App.check_refresh_settings()
  App.apply_theme()
}

App.change_background = (url) => {
  App.reset_theme()
  App.set_setting({setting: `background_image`, value: url})
  App.check_refresh_settings()
  App.apply_theme()
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
  App.set_setting({setting: `${what}_color`, value: color})
  let border_color = App.opacity(color, 0.20)
  App.set_setting({setting: `item_border_color`, value: border_color})
  App.apply_theme()
}

App.set_background = async (url) => {
  function unset() {
    App.set_css_var(`background_image`, `unset`)
  }

  if (!url) {
    unset()
    return
  }

  let lower = url.toLowerCase()

  if (lower.startsWith(`background`)) {
    let match = url.match(/\d+/)

    if (!match) {
      unset()
      return
    }

    let num = parseInt(match[0])

    if (num > App.themes.length) {
      unset()
      return
    }

    url = App.background_path(num)
  }
  else if (lower === `uploaded`) {
    url = await App.get_stored_background()
  }
  else if (!App.is_url(url)) {
    unset()
    return
  }

  App.set_css_var(`background_image`, `url(${url})`)
}

App.apply_background_effects = (effect, tiles, zoom) => {
  let bg = DOM.el(`#background`)

  function bg_add(cls) {
    bg.classList.add(cls)
  }

  function bg_rem(cls) {
    bg.classList.remove(cls)
  }

  let effects = App.remove_separators(App.background_effects).map(x => x.value)

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

  bg.style.transform = `scale(${zoom})`
}

App.insert_css = (name, css) => {
  for (let style of DOM.els(`.${name}`)) {
    style.remove()
  }

  let style = DOM.create(`style`, name)
  style.textContent = css
  document.head.appendChild(style)
}

App.insert_custom_css = () => {
  App.insert_css(`custom_css`, App.get_setting(`custom_css`))
}

App.insert_icon_css = () => {
  let css = ``

  function action(key) {
    let show

    try {
      if (App.settings[`show_${key}`] === undefined) {
        return
      }

      show = App.get_setting(`show_${key}`)
    }
    catch (err) {
      return
    }

    if (show === `always`) {
      css += `.${key}.item_icon_unit {
        display: flex;
      }`
    }
    else {
      if ([`never`, `select`, `focus`, `hover`, `global`].includes(show)) {
        css += `.${key}.item_icon_unit {
          display: none;
        }`
      }

      if ([`select`, `focus`].includes(show)) {
        css += `.item.selected .${key}.item_icon_unit {
          display: flex;
        }`
      }

      if ([`hover`, `focus`].includes(show)) {
        css += `.item:hover .${key}.item_icon_unit {
          display: flex;
        }`
      }

      if ([`global`].includes(show)) {
        css += `.mouse_inside .${key}.item_icon_unit {
          display: flex;
        }`
      }
    }
  }

  for (let icon of App.item_icons) {
    action(`${icon}_icon`)
  }

  App.insert_css(`icon_css`, css)
}

App.insert_color_css = () => {
  let css = ``

  css += `.border_fallback_color {
    border-color: grey !important;
  }`

  css += `.background_fallback_color {
    background-color: grey !important;
    color: grey !important;
  }`

  css += `.text_fallback_color {
    color: grey !important;
  }`

  for (let color of App.colors()) {
    App.set_css_var(`color_${color.id}`, color.value)

    if (color.text) {
      App.set_css_var(`text_color_${color.id}`, color.text)
    }
    else {
      App.set_css_var(`text_color_${color.id}`, `rgb(255, 255, 255)`)
    }

    css += `.border_color_${color.id} {
      border-color: var(--color_${color.id});
    }`

    css += `.background_color_${color.id} {
      background-color: var(--color_${color.id});
      color: var(--text_color_${color.id});
    }`

    css += `.text_color_${color.id} {
      color: var(--color_${color.id});
    }`
  }

  App.insert_css(`color_css`, css)
}

App.insert_tab_color_css = () => {
  let css = ``
  let important = [`active`, `header`, `subheader`]

  for (let type of App.color_types.slice(0).reverse()) {
    let text_color, bg_color

    if (App.get_setting(`text_color_${type}_mode`) !== `none`) {
      text_color = App.get_setting(`text_color_${type}`)
    }

    if (App.get_setting(`background_color_${type}_mode`) !== `none`) {
      bg_color = App.get_setting(`background_color_${type}`)
    }

    if (text_color) {
      if (important.includes(type)) {
        css += `.tab_text_color_${type} {
          color: ${text_color} !important;
        }`
      }
      else {
        css += `.tab_text_color_${type} {
          color: ${text_color};
        }`
      }
    }

    if (bg_color) {
      if (important.includes(type)) {
        css += `.tab_background_color_${type} {
          background-color: ${bg_color} !important;
        }`
      }
      else {
        css += `.tab_background_color_${type} {
          background-color: ${bg_color};
        }`
      }

      if (text_color) {
        if (important.includes(type)) {
          css += `.tab_background_color_${type} {
            color: ${text_color} !important;
          }`
        }
        else {
          css += `.tab_background_color_${type} {
            color: ${text_color};
          }`
        }
      }
    }
  }

  App.insert_css(`tab_color_css`, css)
}

App.insert_font_css = () => {
  let font = App.get_setting(`font`)

  let css = `
    @font-face {
      font-family: 'custom_font';
      src: url('${font}') format('truetype');
    }
  `

  App.insert_css(`font_css`, css)
}

App.cycle_background_opacity = (how = `cycle`) => {
  let opacity = App.get_setting(`background_opacity`)

  if (how === `cycle`) {
    opacity -= 5

    if (opacity < 60) {
      if ((App.now() - App.last_opacity_cycle_date) < App.SECOND) {
        return
      }

      opacity = 100
    }
  }
  else if (how === `increase`) {
    opacity += 5

    if (opacity > 100) {
      opacity = 100
    }
  }
  else if (how === `decrease`) {
    opacity -= 5

    if (opacity < 0) {
      opacity = 0
    }
  }

  App.set_setting({setting: `background_opacity`, value: opacity})
  App.footer_message(`Opacity: ${opacity}%`)
  App.last_opacity_cycle_date = App.now()
  App.apply_theme()
}

App.cycle_background_zoom = (how = `cycle`) => {
  let zoom = App.get_setting(`background_zoom`)

  if (how === `cycle`) {
    zoom += 0.1

    if (zoom > 2.0) {
      if ((App.now() - App.last_zoom_cycle_date) < App.SECOND) {
        return
      }

      zoom = 1.0
    }
  }
  else if (how === `increase`) {
    zoom += 0.1

    if (zoom > 2.0) {
      zoom = 2.0
    }
  }
  else if (how === `decrease`) {
    zoom -= 0.1

    if (zoom < 1.0) {
      zoom = 1.0
    }
  }

  App.set_setting({setting: `background_zoom`, value: zoom})
  App.footer_message(`Zoom: ${zoom}%`)
  App.last_zoom_cycle_date = App.now()
  App.apply_theme()
}

App.reset_theme = () => {
  App.set_default_setting(`background_effect`)
  App.set_default_setting(`background_tiles`)
  App.set_default_setting(`background_zoom`)
}

App.show_theme_menu = (e) => {
  let items = []

  for (let theme of App.themes) {
    items.push({
      text: `Theme ${theme.num}`,
      action: () => {
        App.set_theme(theme.num)
      },
      image: App.background_path(theme.num),
    })
  }

  App.show_context({items, e})
}

App.show_background_menu = (e) => {
  let items = []

  for (let bg of App.themes) {
    items.push({
      text: `Background ${bg.num}`,
      action: () => {
        App.set_background_image(bg.num)
      },
      image: App.background_path(bg.num),
    })
  }

  App.show_context({items, e})
}

App.set_previous_theme = () => {
  let bg = App.get_setting(`background_image`)
  let num = App.themes.length + 1

  if (bg.startsWith(`Background`)) {
    num = parseInt(bg.split(` `)[1])
  }

  let prev = num - 1

  if (prev < 1) {
    prev = App.themes.length
  }

  App.set_theme(prev)
}

App.set_next_theme = () => {
  let bg = App.get_setting(`background_image`)
  let num = 0

  if (bg.startsWith(`Background`)) {
    num = parseInt(bg.split(` `)[1])
  }

  let next = num + 1

  if (next > App.themes.length) {
    next = 1
  }

  App.set_theme(next)
}

App.get_theme_item = (num) => {
  for (let theme of App.themes) {
    if (theme.num === num) {
      return theme
    }
  }
}

App.set_theme = (num) => {
  let theme = App.get_theme_item(num)

  if (!theme) {
    return
  }

  if (theme.opacity) {
    App.set_setting({setting: `background_opacity`, value: theme.opacity})
  }
  else {
    App.set_default_setting(`background_opacity`)
  }

  if (theme.text_color) {
    let border_color = App.opacity(theme.text_color, 0.20)
    App.set_setting({setting: `text_color`, value: theme.text_color})
    App.set_setting({setting: `item_border_color`, value: border_color})
  }
  else {
    App.set_default_setting(`text_color`)
    App.set_default_setting(`item_border_color`)
  }

  if (theme.background_color) {
    App.set_setting({setting: `background_color`, value: theme.background_color})
  }
  else {
    App.set_default_setting(`background_color`)
  }

  if (theme.effect) {
    App.set_setting({setting: `background_effect`, value: theme.effect})
  }
  else {
    App.set_default_setting(`background_effect`)
  }

  if (theme.tiles) {
    App.set_setting({setting: `background_tiles`, value: theme.tiles})
  }
  else {
    App.set_default_setting(`background_tiles`)
  }

  if (theme.zoom) {
    App.set_setting({setting: `background_zoom`, value: theme.zoom})
  }
  else {
    App.set_default_setting(`background_zoom`)
  }

  App.set_background_image(theme.num)
  App.check_refresh_settings()
}

App.set_background_image = (num) => {
  let bg_image = `Background ${num}`
  App.set_setting({setting: `background_image`, value: bg_image})
  App.apply_theme()
}

App.background_path = (num) => {
  return App.backgrounds_dir + `background_${num}.jpg`
}

App.pick_background = (e) => {
  let items = []

  for (let bg of App.themes) {
    items.push({
      text: `Background ${bg.num}`,
      image: App.background_path(bg.num),
      action: () => {
        App.set_background_image(bg.num)
        App.refresh_setting_widgets([`background_image`])
      },
    })
  }

  let stored = App.get_stored_background()

  if (stored) {
    items.push({
      text: `Uploaded`,
      icon: `📷`,
      action: () => {
        App.set_uploaded_image()
      },
    })
  }

  App.show_context({e, items})
}

App.pick_font = (e, what) => {
  let items = []

  for (let font of App.fonts) {
    items.push({
      text: font,
      action: () => {
        App.do_pick_font(font, what)
      },
    })
  }

  App.show_context({e, items})
}

App.do_pick_font = (font, what) => {
  App.set_setting({setting: what, value: font, action: true})
  App.refresh_setting_widgets([what])
}

App.get_font_string = (font) => {
  let font_str = `sans-serif`

  if (font) {
    if (App.fonts.includes(font)) {
      font_str = `${font}, sans-serif`
    }
    else if (App.is_url(font)) {
      App.insert_font_css()
      font_str = `custom_font, sans-serif`
    }
    else {
      let font_link = document.getElementById(`custom_font`)
      font_link.href = `https://fonts.googleapis.com/css?family=${font}`
      font_str = `${font}, sans-serif`
    }
  }

  return font_str
}

App.set_item_padding_vars = () => {
  let a = 0.405
  let b = 0.15

  let item_height = App.get_setting(`item_height`)
  App.theme_sizer(item_height, `item_padding`, a, b)

  let tab_box_item_height = App.get_setting(`tab_box_item_height`)
  App.theme_sizer(tab_box_item_height, `tab_box_item_padding`, a, b)
}

App.set_icon_size_vars = () => {
  let item_icon = App.get_setting(`item_icon`)
  App.theme_sizer(item_icon, `icon_size`, 1.11, 0.181)
}

App.set_pinline_vars = () => {
  if (App.get_setting(`pinline_colors`)) {
    App.set_css_var(`pinline_text_color`, App.get_setting(`pinline_text_color`))
    App.set_css_var(`pinline_background_color`, App.get_setting(`pinline_background_color`))
  }
  else {
    App.set_css_var(`pinline_text_color`, `unset`)
    App.set_css_var(`pinline_background_color`, `unset`)
  }

  for (let align of App.aligns) {
    App.main_remove(`pinline_align_${align.value}`)
  }

  let align = App.get_setting(`pinline_align`)
  App.main_add(`pinline_align_${align}`)

  if (App.get_setting(`rounded_pinline`)) {
    App.set_css_var(`pinline_border_radius`, `20px`)
  }
  else {
    App.set_css_var(`pinline_border_radius`, `unset`)
  }

  let pm = App.get_setting(`pinline_margin`)
  let small = App.get_setting(`small_pinline`)

  if (small) {
    App.set_css_var(`pinline_width`, `20%`)
  }
  else {
    App.set_css_var(`pinline_width`, `calc(100% - ${pm * 2}px)`)
  }

  let bw = App.get_setting(`pinline_border_width`) + `px`
  App.set_css_var(`pinline_border_width`, bw)

  if (small) {
    App.set_css_var(`pinline_margin`, pm + `px`)
  }
  else {
    App.set_css_var(`pinline_margin`, `0`)
  }
}

App.set_tab_box_vars = () => {
  if (App.get_setting(`tab_box_colors_enabled`)) {
    App.set_css_var(`tab_box_color`, App.get_setting(`tab_box_color`))
    App.set_css_var(`tab_box_item_border_color`, App.get_setting(`tab_box_item_border_color`))
  }
  else {
    App.set_css_var(`tab_box_color`, `transparent`)
    App.set_css_var(`tab_box_item_border_color`, App.alt_color_1)
  }

  if (App.get_setting(`tab_box_font_enabled`)) {
    App.set_css_var(`tab_box_font_size`, App.get_setting(`tab_box_font_size`) + `px`)
  }
  else {
    App.set_css_var(`tab_box_font_size`, `unset`)
  }

  if (App.get_setting(`tab_box_scrollbars`)) {
    document.body.classList.remove(`no_tab_box_scrollbars`)
  }
  else {
    document.body.classList.add(`no_tab_box_scrollbars`)
  }

  if (App.get_setting(`tab_box_font_enabled`)) {
    let font = App.get_setting(`tab_box_font`)
    let font_str = App.get_font_string(font)
    App.set_css_var(`tab_box_font`, font_str)
  }
  else {
    App.set_css_var(`tab_box_font`, `unset`)
  }

  for (let osize of App.sizes_2) {
    let size = osize.value

    if (size === `compact`) {
      App.set_css_var(`tab_box_size_${size}`, `1.9rem`)
      continue
    }

    App.theme_sizer(size, `tab_box_size_${size}`, 13, 3.5)
  }

  if (App.get_setting(`tab_box_blur`)) {
    App.main_add(`tab_box_blur`)
  }
  else {
    App.main_remove(`tab_box_blur`)
  }

  if (App.get_setting(`tab_box_count`)) {
    App.main_add(`tab_box_count`)
  }
  else {
    App.main_remove(`tab_box_count`)
  }

  if (!App.get_setting(`tab_box_title`)) {
    App.main_add(`tab_box_hide_title`)
  }
  else {
    App.main_remove(`tab_box_hide_title`)
  }

  App.set_css_var(`tab_box_border_width`, App.get_setting(`tab_box_border_width`) + `px`)
}

App.set_close_button_vars = () => {
  if (App.get_setting(`close_button_colors`)) {
    let text_color = App.get_setting(`close_button_text_color`)
    let bg_color = App.get_setting(`close_button_background_color`)
    App.set_css_var(`close_button_text_color`, text_color)
    App.set_css_var(`close_button_background_color`, bg_color)
  }
  else {
    App.set_css_var(`close_button_text_color`, `unset`)
    App.set_css_var(`close_button_background_color`, `unset`)
  }

  for (let c_side of [`left`, `right`]) {
    App.main_remove(`close_button_${c_side}`)
  }

  let c_side = App.get_setting(`close_button_side`)
  App.main_add(`close_button_${c_side}`)
  let cb_padding = App.get_setting(`close_button_padding`)
  App.set_css_var(`close_button_padding`, `${cb_padding}px`)

  for (let cb_show of App.remove_separators(App.show_icon)) {
    App.main_remove(`close_button_${cb_show.value}`)
    App.main_remove(`close_button_tab_box_${cb_show.value}`)
  }

  let cb_show = App.get_setting(`show_close_button`)
  App.main_add(`close_button_${cb_show}`)
  let cb_show_tb = App.get_setting(`show_close_button_tab_box`)
  App.main_add(`close_button_tab_box_${cb_show_tb}`)
  let cbbw = App.get_setting(`close_button_border_width`)
  App.set_css_var(`close_button_border_width`, cbbw + `px`)
  let cbbwtb = App.get_setting(`close_button_border_width_tab_box`)
  App.set_css_var(`close_button_border_width_tab_box`, cbbwtb + `px`)

  let normal = 1.77
  let steps = 0.3

  let size = App.get_setting(`close_button_size`)
  App.theme_sizer(size, `close_button_width`, normal, steps)
  let size_tb = App.get_setting(`close_button_size_tab_box`)
  App.theme_sizer(size_tb, `close_button_width_tab_box`, normal, steps)
}

App.set_footer_vars = () => {
  if (App.get_setting(`footer_font_enabled`)) {
    App.set_css_var(`footer_font_size`, App.get_setting(`footer_font_size`) + `px`)
  }
  else {
    App.set_css_var(`footer_font_size`, `unset`)
  }

  if (App.get_setting(`footer_font_enabled`)) {
    let font = App.get_setting(`footer_font`)
    let font_str = App.get_font_string(font)
    App.set_css_var(`footer_font`, font_str)
  }
  else {
    App.set_css_var(`footer_font`, `unset`)
  }

  if (App.get_setting(`footer_colors`)) {
    App.set_css_var(`footer_text_color`, App.get_setting(`footer_text_color`))
    App.set_css_var(`footer_background_color`, App.get_setting(`footer_background_color`))
  }
  else {
    App.set_css_var(`footer_text_color`, App.text_color)
    App.set_css_var(`footer_background_color`, App.slight_shade)
  }

  let footer_align = App.get_setting(`footer_align`)
  let footer_justify = App.justify_map[footer_align]
  App.set_css_var(`footer_align`, footer_justify)
  let size = App.get_setting(`footer_size`)
  App.theme_sizer_panel(size, `footer_padding`)
}

App.set_favorite_vars = () => {
  if (App.get_setting(`favorites_blur`)) {
    App.main_add(`favorites_blur`)
  }
  else {
    App.main_remove(`favorites_blur`)
  }

  let favgravs = [`top`, `center`, `bottom`]

  for (let grav of favgravs) {
    App.main_remove(`favorites_gravity_${grav}`)
  }

  let grav = App.get_setting(`favorites_gravity`)
  App.main_add(`favorites_gravity_${grav}`)

  if (App.get_setting(`favorites_bar_color_enabled`)) {
    App.set_css_var(`favorites_bar_color`, App.get_setting(`favorites_bar_color`))
  }
  else if (App.favorites_bar_side()) {
    App.set_css_var(`favorites_bar_color`, App.slight_shade)
  }
  else {
    App.set_css_var(`favorites_bar_color`, `unset`)
  }

  if (App.get_setting(`favorites_autohide`)) {
    App.main_add(`favorites_autohide`)
  }
  else {
    App.main_remove(`favorites_autohide`)
  }

  let size = App.get_setting(`favorites_size`)
  App.theme_sizer_panel(size, `favorites_padding`)
  let gap = App.get_setting(`favorites_gap`)
  App.theme_sizer(gap, `favorites_gap`, 0.35, 0.15)
}

App.set_main_title_vars = () => {
  if (App.get_setting(`wrap_main_title`)) {
    App.main_remove(`main_title_no_wrap`)
  }
  else {
    App.main_add(`main_title_no_wrap`)
  }

  if (App.get_setting(`main_title_font_enabled`)) {
    App.set_css_var(`main_title_font_size`, App.get_setting(`main_title_font_size`) + `px`)
  }
  else {
    App.set_css_var(`main_title_font_size`, `unset`)
  }

  if (App.get_setting(`main_title_font_enabled`)) {
    let font = App.get_setting(`main_title_font`)
    let font_str = App.get_font_string(font)
    App.set_css_var(`main_title_font`, font_str)
  }
  else {
    App.set_css_var(`main_title_font`, `unset`)
  }

  if (App.get_setting(`main_title_colors`)) {
    let text_color = App.get_setting(`main_title_text_color`)
    let bg_color = App.get_setting(`main_title_background_color`)
    let btn_color = App.get_setting(`main_title_button_color`)
    App.set_css_var(`main_title_text_color`, text_color)
    App.set_css_var(`main_title_background_color`, bg_color)
    App.set_css_var(`main_title_button_color`, btn_color)
  }
  else {
    App.set_css_var(`main_title_text_color`, `unset`)
    App.set_css_var(`main_title_background_color`, `unset`)
    App.set_css_var(`main_title_button_color`, App.background_color)
  }

  let title_align = App.get_setting(`main_title_align`)

  for (let align of App.aligns) {
    App.main_remove(`main_title_align_${align.value}`)
  }

  App.main_add(`main_title_align_${title_align}`)
  let size = App.get_setting(`main_title_size`)
  App.theme_sizer_panel(size, `main_title_padding`)
  let lb = App.get_setting(`show_main_title_left_button`)

  if (lb === `hidden`) {
    App.main_add(`hidden_main_title_left`)
  }
  else {
    App.main_remove(`hidden_main_title_left`)
  }

  if (lb === `hover`) {
    App.main_add(`hover_main_title_left`)
  }
  else {
    App.main_remove(`hover_main_title_left`)
  }

  if (lb === `global`) {
    App.main_add(`global_main_title_left`)
  }
  else {
    App.main_remove(`global_main_title_left`)
  }

  let rb = App.get_setting(`show_main_title_right_button`)

  if (rb === `hidden`) {
    App.main_add(`hidden_main_title_right`)
  }
  else {
    App.main_remove(`hidden_main_title_right`)
  }

  if (rb === `hover`) {
    App.main_add(`hover_main_title_right`)
  }
  else {
    App.main_remove(`hover_main_title_right`)
  }

  if (rb === `global`) {
    App.main_add(`global_main_title_right`)
  }
  else {
    App.main_remove(`global_main_title_right`)
  }

  if (App.get_setting(`main_title_border_top`)) {
    App.main_add(`main_title_border_top`)
  }
  else {
    App.main_remove(`main_title_border_top`)
  }

  if (App.get_setting(`main_title_border_bottom`)) {
    App.main_add(`main_title_border_bottom`)
  }
  else {
    App.main_remove(`main_title_border_bottom`)
  }

  let normal = 1.8
  let steps = 0.3

  let left_size = App.get_setting(`main_title_left_button_size`)
  App.theme_sizer(left_size, `main_title_left_button_width`, normal, steps)
  let right_size = App.get_setting(`main_title_right_button_size`)
  App.theme_sizer(right_size, `main_title_right_button_width`, normal, steps)
}

App.set_zone_vars = () => {
  if (App.get_setting(`header_icon_pick`)) {
    App.main_add(`header_icon_pick`)
  }
  else {
    App.main_remove(`header_icon_pick`)
  }

  let scv

  if (App.get_setting(`split_color_enabled`)) {
    scv = App.get_setting(`split_color`)
  }
  else {
    scv = App.text_color
  }

  App.set_css_var(`split_color`, scv)
  let sw = App.get_setting(`split_width`)

  if (App.get_setting(`split_padding`)) {
    App.main_add(`split_padding`)
  }
  else {
    App.main_remove(`split_padding`)
  }

  App.set_css_var(`split_width`, `${sw}px`)
  let split_sides = [`left`, `right`, `both`]

  for (let side of split_sides) {
    App.main_remove(`split_side_${side}`)
  }

  let split_side = App.get_setting(`split_side`)
  App.main_add(`split_side_${split_side}`)

  if (App.get_setting(`hide_splits_on_filter`)) {
    App.main_add(`hide_splits_on_filter`)
  }
  else {
    App.main_remove(`hide_splits_on_filter`)
  }

  if (App.get_setting(`bold_zone_titles`)) {
    App.main_add(`bold_zone_titles`)
  }
  else {
    App.main_remove(`bold_zone_titles`)
  }
}

App.set_hover_button_vars = () => {
  for (let side of [`left`, `right`]) {
    App.main_remove(`hover_button_${side}`)
  }

  let hbs = App.get_setting(`hover_button_side`)
  App.main_add(`hover_button_${hbs}`)
  let size = App.get_setting(`hover_button_size`)
  App.theme_sizer(size, `hover_button_padding`, 0.5, 0.2)

  if (App.get_setting(`show_hover_button`)) {
    App.main_remove(`hide_hover_button`)
  }
  else {
    App.main_add(`hide_hover_button`)
  }
}

App.set_effect_vars = () => {
  let effects = App.remove_separators(App.effects)

  for (let eff of effects) {
    App.main_remove(`selected_effect_${eff.value}`)
  }

  let selected_effect = App.get_setting(`selected_effect`)
  App.main_add(`selected_effect_${selected_effect}`)
  let selected_effect_2 = App.get_setting(`selected_effect_2`)
  App.main_add(`selected_effect_${selected_effect_2}`)

  for (let eff of effects) {
    App.main_remove(`hover_effect_${eff.value}`)
  }

  let hover_effect = App.get_setting(`hover_effect`)
  App.main_add(`hover_effect_${hover_effect}`)
  let hover_effect_2 = App.get_setting(`hover_effect_2`)
  App.main_add(`hover_effect_${hover_effect_2}`)

  for (let eff of effects) {
    App.main_remove(`tab_box_active_effect_${eff.value}`)
  }

  let tba_eff = App.get_setting(`tab_box_active_effect`)
  App.main_add(`tab_box_active_effect_${tba_eff}`)
  let tba_eff_2 = App.get_setting(`tab_box_active_effect_2`)
  App.main_add(`tab_box_active_effect_${tba_eff_2}`)

  for (let eff of effects) {
    App.main_remove(`tab_box_hover_effect_${eff.value}`)
  }

  let tbh_eff = App.get_setting(`tab_box_hover_effect`)
  App.main_add(`tab_box_hover_effect_${tbh_eff}`)
  let tbh_eff_2 = App.get_setting(`tab_box_hover_effect_2`)
  App.main_add(`tab_box_hover_effect_${tbh_eff_2}`)

  let ie = App.get_setting(`icon_effect`)
  let ies = [`none`, `spin`, `invert`, `border`]

  for (let eff of ies) {
    App.main_remove(`icon_effect_${eff}`)
  }

  App.main_add(`icon_effect_${ie}`)
  let font = App.get_setting(`font`)
  let font_str = App.get_font_string(font)
  App.set_css_var(`font`, font_str)

  if (App.breathe_effect_on) {
    App.main_add(`breathe_effect`)
  }
  else {
    App.main_remove(`breathe_effect`)
  }

  if (App.get_setting(`text_glow`)) {
    document.body.classList.add(`text_glow`)
  }
  else {
    document.body.classList.remove(`text_glow`)
  }
}

App.set_taglist_vars = () => {
  let show = App.get_setting(`taglist_visibility`)

  for (let mode of App.taglist_show_modes) {
    App.main_remove(`taglist_show_${mode.value}`)
  }

  App.main_add(`taglist_show_${show}`)
}

App.set_filter_vars = () => {
  if (App.get_setting(`filter_focus_effect`)) {
    App.main_add(`filter_focus_effect`)
  }
  else {
    App.main_remove(`filter_focus_effect`)
  }
}

App.set_item_vars = () => {
  let borders_opts = [`normal`, `big`, `huge`]

  for (let b of borders_opts) {
    App.main_remove(`borders_${b}`)
    App.main_remove(`tab_box_borders_${b}`)
  }

  let borders = App.get_setting(`item_border`)

  if (borders_opts.includes(borders)) {
    App.main_add(`borders_${borders}`)
    App.set_css_var(`split_margin`, `0`)
  }
  else {
    App.set_css_var(`split_margin`, `0.5rem`)
  }

  let tb_borders = App.get_setting(`tab_box_item_border`)

  if (borders_opts.includes(tb_borders)) {
    App.main_add(`tab_box_borders_${tb_borders}`)
  }

  let item_align = App.get_setting(`item_align`)
  let item_justify = App.justify_map[item_align]
  App.set_css_var(`item_align`, item_justify)
  App.set_css_var(`item_border_color`, App.get_setting(`item_border_color`))

  if (App.get_setting(`wrap_text`)) {
    App.main_remove(`no_wrap`)
  }
  else {
    App.main_add(`no_wrap`)
  }

  if (App.get_setting(`icon_pick`)) {
    App.main_add(`icon_pick`)
  }
  else {
    App.main_remove(`icon_pick`)
  }

  if (App.get_setting(`item_pointer`)) {
    App.main_add(`item_pointer`)
  }
  else {
    App.main_remove(`item_pointer`)
  }

  if (App.get_setting(`multi_bold`)) {
    App.main_add(`multi_bold`)
  }
  else {
    App.main_remove(`multi_bold`)
  }

  if (App.get_setting(`smart_icons`)) {
    App.main_add(`smart_icons`)
  }
  else {
    App.main_remove(`smart_icons`)
  }
}

App.set_background_vars = () => {
  let delay = parseInt(App.get_setting(`auto_color_delay`))

  if (isNaN(delay) && (delay > 0)) {
    App.set_css_var(`auto_color_delay`, `${delay}ms`)
  }

  if (App.get_setting(`auto_color_enabled`)) {
    App.main_add(`auto_color`)
  }
  else {
    App.main_remove(`auto_color`)
  }
}

App.theme_sizer = (size, what, normal, steps) => {
  let rem

  if (size === `tiny`) {
    rem = normal - (steps * 2)
  }
  else if (size === `small`) {
    rem = normal - steps
  }
  else if (size === `normal`) {
    rem = normal
  }
  else if (size === `big`) {
    rem = normal + steps
  }
  else if (size === `huge`) {
    rem = normal + (steps * 2)
  }

  rem = Math.max(rem, 0)
  App.set_css_var(what, `${rem}rem`)
}

App.theme_sizer_panel = (size, what) => {
  let normal = App.panel_sizes.normal
  let steps = App.panel_sizes.steps
  App.theme_sizer(size, what, normal, steps)
}

App.set_top_panel_vars = () => {
  if (!App.get_setting(`show_top_panel`)) {
    App.main_add(`hide_top_panel`)
  }
  else {
    App.main_remove(`hide_top_panel`)
  }
}

App.set_obfuscate_vars = () => {
  if (App.get_setting(`obfuscate_icons`)) {
    App.main_add(`obfuscate_icons`)
  }
  else {
    App.main_remove(`obfuscate_icons`)
  }

  if (App.get_setting(`obfuscate_text`)) {
    App.main_add(`obfuscate_text`)
  }
  else {
    App.main_remove(`obfuscate_text`)
  }
}

App.paste_background = async () => {
  let url = await App.read_clipboard()
  App.set_background(url)
}

App.upload_background = () => {
  let input = document.createElement(`input`)
  input.type = `file`
  input.accept = `image/*`

  input.onchange = async (e) => {
    let file = e.target.files[0]

    if (!file) {
      return
    }

    if (file.size > 100 * 1024 * 1024) {
      return
    }

    let reader = new FileReader()

    reader.onload = async (event) => {
      let data = event.target.result
      await browser.storage.local.set({storedImage: data})
      App.set_uploaded_image()
    }

    reader.readAsDataURL(file)
  }

  input.click()
}

App.get_stored_background = async () => {
  try {
    let result = await browser.storage.local.get(`storedImage`)

    if (result.storedImage) {
      return result.storedImage
    }

    return null
  }
  catch (error) {
    return null
  }
}

App.set_uploaded_image = () => {
  App.set_setting({setting: `background_image`, value: `uploaded`})
  App.apply_theme()
  App.refresh_setting_widgets([`background_image`])
}

App.is_dark_mode = () => {
  let color = App.get_setting(`background_color`)
  return App.colorlib.is_dark(color)
}

App.start_auto_color = () => {
  let enabled = App.get_setting(`auto_color_enabled`)
  clearInterval(App.auto_color_interval)

  if (!enabled) {
    return
  }

  let delay = parseInt(App.get_setting(`auto_color_delay`))

  if (isNaN(delay)) {
    return
  }

  if (delay <= 0) {
    return
  }

  App.auto_color_interval = setInterval(() => {
    App.do_auto_color()
  }, delay)
}

App.do_auto_color = () => {
  if (App.is_dark_mode) {
    App.random_colors(`dark`)
  }
  else {
    App.random_colors(`light`)
  }
}