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
    let justify_map = {
      left: `flex-start`,
      center: `center`,
      right: `flex-end`,
    }

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

    if (args.safe_mode) {
      return
    }

    App.set_css_var(`font_size`, App.get_setting(`font_size`) + `px`)

    if (App.get_setting(`main_title_font_enabled`)) {
      App.set_css_var(`main_title_font_size`, App.get_setting(`main_title_font_size`) + `px`)
    }
    else {
      App.set_css_var(`main_title_font_size`, `unset`)
    }

    if (App.get_setting(`tab_box_font_enabled`)) {
      App.set_css_var(`tab_box_font_size`, App.get_setting(`tab_box_font_size`) + `px`)
    }
    else {
      App.set_css_var(`tab_box_font_size`, `unset`)
    }

    if (App.get_setting(`footer_font_enabled`)) {
      App.set_css_var(`footer_font_size`, App.get_setting(`footer_font_size`) + `px`)
    }
    else {
      App.set_css_var(`footer_font_size`, `unset`)
    }

    let w = `${(App.get_setting(`width`) / 100) * App.popup_width}px`
    App.set_css_var(`width`, w)

    let h = `${(App.get_setting(`height`) / 100) * App.popup_height}px`
    App.set_css_var(`height`, h)

    App.set_item_padding_vars()

    if (App.get_setting(`show_scrollbars`)) {
      document.body.classList.remove(`no_scrollbars`)
    }
    else {
      document.body.classList.add(`no_scrollbars`)
    }

    if (App.get_setting(`tab_box_scrollbars`)) {
      document.body.classList.remove(`no_tab_box_scrollbars`)
    }
    else {
      document.body.classList.add(`no_tab_box_scrollbars`)
    }

    let main = DOM.el(`#main`)

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

    let item_align = App.get_setting(`item_align`)
    let item_justify = justify_map[item_align]
    App.set_css_var(`item_align`, item_justify)

    App.set_background(args.background_image)
    App.apply_background_effects(args.background_effect, args.background_tiles)

    if (App.get_setting(`rounded_corners`)) {
      App.set_css_var(`border_radius`, `3px`)
      document.body.classList.remove(`no_rounded`)
    }
    else {
      App.set_css_var(`border_radius`, `0`)
      document.body.classList.add(`no_rounded`)
    }

    let effects = App.remove_separators(App.effects)

    for (let eff of effects) {
      main.classList.remove(`hover_effect_${eff.value}`)
    }

    let hover_effect = App.get_setting(`hover_effect`)
    main.classList.add(`hover_effect_${hover_effect}`)
    let hover_effect_2 = App.get_setting(`hover_effect_2`)
    main.classList.add(`hover_effect_${hover_effect_2}`)

    for (let eff of effects) {
      main.classList.remove(`selected_effect_${eff.value}`)
    }

    let selected_effect = App.get_setting(`selected_effect`)
    main.classList.add(`selected_effect_${selected_effect}`)
    let selected_effect_2 = App.get_setting(`selected_effect_2`)
    main.classList.add(`selected_effect_${selected_effect_2}`)

    for (let eff of effects) {
      main.classList.remove(`tab_box_hover_effect_${eff.value}`)
    }

    let tbh_eff = App.get_setting(`tab_box_hover_effect`)
    main.classList.add(`tab_box_hover_effect_${tbh_eff}`)
    let tbh_eff_2 = App.get_setting(`tab_box_hover_effect_2`)
    main.classList.add(`tab_box_hover_effect_${tbh_eff_2}`)

    for (let eff of effects) {
      main.classList.remove(`tab_box_active_effect_${eff.value}`)
    }

    let tba_eff = App.get_setting(`tab_box_active_effect`)
    main.classList.add(`tab_box_active_effect_${tba_eff}`)
    let tba_eff_2 = App.get_setting(`tab_box_active_effect_2`)
    main.classList.add(`tab_box_active_effect_${tba_eff_2}`)

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

    App.set_icon_size_vars()
    App.set_tab_box_vars()

    if (App.get_setting(`text_glow`)) {
      document.body.classList.add(`text_glow`)
    }
    else {
      document.body.classList.remove(`text_glow`)
    }

    for (let side of [`left`, `right`]) {
      main.classList.remove(`hover_button_${side}`)
    }

    let hb = App.get_setting(`hover_button`)
    main.classList.add(`hover_button_${hb}`)

    let ie = App.get_setting(`icon_effect`)
    let ies = [`none`, `spin`, `invert`, `border`]

    for (let eff of ies) {
      main.classList.remove(`icon_effect_${eff}`)
    }

    main.classList.add(`icon_effect_${ie}`)

    let font = App.get_setting(`font`)
    let font_str = App.get_font_string(font)
    App.set_css_var(`font`, font_str)

    if (App.get_setting(`main_title_font_enabled`)) {
      font = App.get_setting(`main_title_font`)
      font_str = App.get_font_string(font)
      App.set_css_var(`main_title_font`, font_str)
    }
    else {
      App.set_css_var(`main_title_font`, `unset`)
    }

    if (App.get_setting(`tab_box_font_enabled`)) {
      font = App.get_setting(`tab_box_font`)
      font_str = App.get_font_string(font)
      App.set_css_var(`tab_box_font`, font_str)
    }
    else {
      App.set_css_var(`tab_box_font`, `unset`)
    }

    if (App.get_setting(`footer_font_enabled`)) {
      font = App.get_setting(`footer_font`)
      font_str = App.get_font_string(font)
      App.set_css_var(`footer_font`, font_str)
    }
    else {
      App.set_css_var(`footer_font`, `unset`)
    }

    let scv

    if (App.get_setting(`split_color_enabled`)) {
      scv = App.get_setting(`split_color`)
    }
    else {
      scv = args.text_color
    }

    App.set_css_var(`split_color`, scv)

    let sw = App.get_setting(`split_width`)

    if (App.get_setting(`split_padding`)) {
      main.classList.add(`split_padding`)
    }
    else {
      main.classList.remove(`split_padding`)
    }

    App.set_css_var(`split_width`, `${sw}px`)

    let split_sides = [`left`, `right`, `both`]

    for (let side of split_sides) {
      main.classList.remove(`split_side_${side}`)
    }

    let split_side = App.get_setting(`split_side`)
    main.classList.add(`split_side_${split_side}`)

    let close_btns = [`none`, `left`, `right`]

    for (let cb of close_btns) {
      main.classList.remove(`close_button_${cb}`)
    }

    let cb = App.get_setting(`close_button`)
    main.classList.add(`close_button_${cb}`)

    if (App.get_setting(`button_icons`)) {
      main.classList.add(`button_text_icon_enabled`)
    }
    else {
      main.classList.remove(`button_text_icon_enabled`)
    }

    if (App.get_setting(`autohide_taglist`)) {
      main.classList.add(`autohide_taglist`)
    }
    else {
      main.classList.remove(`autohide_taglist`)
    }

    if (App.get_setting(`main_title_colors`)) {
      App.set_css_var(`main_title_text_color`, App.get_setting(`main_title_text_color`))
      App.set_css_var(`main_title_background_color`, App.get_setting(`main_title_background_color`))
    }
    else {
      App.set_css_var(`main_title_text_color`, `unset`)
      App.set_css_var(`main_title_background_color`, `unset`)
    }

    let title_align = App.get_setting(`main_title_align`)

    for (let align of App.aligns) {
      main.classList.remove(`main_title_align_${align.value}`)
    }

    main.classList.add(`main_title_align_${title_align}`)

    if (App.get_setting(`item_pointer`)) {
      main.classList.add(`item_pointer`)
    }
    else {
      main.classList.remove(`item_pointer`)
    }

    if (App.get_setting(`header_icon_pick`)) {
      main.classList.add(`header_icon_pick`)
    }
    else {
      main.classList.remove(`header_icon_pick`)
    }

    let favgravs = [`top`, `center`, `bottom`]

    for (let grav of favgravs) {
      main.classList.remove(`favorites_gravity_${grav}`)
    }

    let grav = App.get_setting(`favorites_gravity`)
    main.classList.add(`favorites_gravity_${grav}`)

    if (App.get_setting(`favorites_bar_color_enabled`)) {
      App.set_css_var(`favorites_bar_color`, App.get_setting(`favorites_bar_color`))
    }
    else if (App.favorites_bar_side()) {
      App.set_css_var(`favorites_bar_color`, slight_shade)
    }
    else {
      App.set_css_var(`favorites_bar_color`, `unset`)
    }

    if (App.get_setting(`footer_colors`)) {
      App.set_css_var(`footer_text_color`, App.get_setting(`footer_text_color`))
      App.set_css_var(`footer_background_color`, App.get_setting(`footer_background_color`))
    }
    else {
      App.set_css_var(`footer_text_color`, `unset`)
      App.set_css_var(`footer_background_color`, slight_shade)
    }

    if (App.get_setting(`pinline_colors`)) {
      App.set_css_var(`pinline_text_color`, App.get_setting(`pinline_text_color`))
      App.set_css_var(`pinline_background_color`, App.get_setting(`pinline_background_color`))
    }
    else {
      App.set_css_var(`pinline_text_color`, `unset`)
      App.set_css_var(`pinline_background_color`, `unset`)
    }

    for (let align of App.aligns) {
      main.classList.remove(`pinline_align_${align.value}`)
    }

    let align = App.get_setting(`pinline_align`)
    main.classList.add(`pinline_align_${align}`)

    if (App.get_setting(`tab_box_color_enabled`)) {
      App.set_css_var(`tab_box_color`, App.get_setting(`tab_box_color`))
    }
    else {
      App.set_css_var(`tab_box_color`, `transparent`)
    }

    if (App.get_setting(`favorites_autohide`)) {
      main.classList.add(`favorites_autohide`)
    }
    else {
      main.classList.remove(`favorites_autohide`)
    }

    if (App.breathe_effect_on) {
      main.classList.add(`breathe_effect`)
    }
    else {
      main.classList.remove(`breathe_effect`)
    }

    let active_bgs = [`none`, `normal`, `tab_box`, `everywhere`]

    for (let bg of active_bgs) {
      main.classList.remove(`active_background_${bg}`)
    }

    let active_bg = App.get_setting(`background_color_active_mode`)
    main.classList.add(`active_background_${active_bg}`)

    if (App.get_setting(`favorites_blur`)) {
      main.classList.add(`favorites_blur`)
    }
    else {
      main.classList.remove(`favorites_blur`)
    }

    if (App.get_setting(`tab_box_blur`)) {
      main.classList.add(`tab_box_blur`)
    }
    else {
      main.classList.remove(`tab_box_blur`)
    }

    if (App.get_setting(`tab_box_count`)) {
      main.classList.add(`tab_box_count`)
    }
    else {
      main.classList.remove(`tab_box_count`)
    }

    if (App.get_setting(`wrap_main_title`)) {
      main.classList.remove(`main_title_no_wrap`)
    }
    else {
      main.classList.add(`main_title_no_wrap`)
    }

    let footer_align = App.get_setting(`footer_align`)
    let footer_justify = justify_map[footer_align]
    App.set_css_var(`footer_align`, footer_justify)
    let cb_padding = App.get_setting(`close_button_padding`)
    App.set_css_var(`close_button_padding`, `${cb_padding}px`)

    let uto = App.get_setting(`unloaded_opacity`) / 100
    App.set_css_var(`unloaded_opacity`, uto)

    App.set_css_var(`window_border_width`, App.get_setting(`window_border_width`) + `px`)
    App.set_css_var(`window_border_color`, App.get_setting(`window_border_color`))
    App.set_css_var(`close_button_color`, App.get_setting(`close_button_color`))

    App.insert_tab_color_css()
    App.insert_color_css()
    App.insert_icon_css()
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
  App.check_refresh_settings()
  App.apply_theme()
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

    if (num > App.themes.length) {
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
      if ([`never`, `select`, `hover`, `focus`].includes(show)) {
        css += `.${key}.item_icon_unit {
          display: none;
        }`
      }

      if ([`select`, `focus`].includes(show)) {
        css += `.item.selected .${key}.item_icon_unit {
          display: flex;
        }`
      }

      if ([`focus`].includes(show)) {
        css += `.item:hover .${key}.item_icon_unit {
          display: flex;
        }`
      }

      if ([`hover`].includes(show)) {
        css += `.mouse_inside .${key}.item_icon_unit {
          display: flex;
        }`
      }
    }
  }

  for (let key in App.setting_props) {
    let sett = App.setting_props[key]

    if (sett.category !== `icons`) {
      continue
    }

    if (!key.endsWith(`_icon`)) {
      continue
    }

    action(key)
  }

  action(`color_icon`)
  action(`custom_icon`)
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
  App.check_refresh_settings()
  App.footer_message(`Opacity: ${opacity}%`)
  App.last_opacity_cycle_date = App.now()
  App.apply_theme()
}

App.reset_theme = () => {
  App.set_default_setting(`background_effect`)
  App.set_default_setting(`background_tiles`)
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
    App.set_setting({setting: `text_color`, value: theme.text_color})
  }
  else {
    App.set_default_setting(`text_color`)
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

  App.set_background_image(theme.num)
}

App.set_background_image = (num) => {
  let bg_image = `Background ${num}`
  App.set_setting({setting: `background_image`, value: bg_image})
  App.check_refresh_settings()
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
      action: () => {
        App.set_background_image(bg.num)
      },
      image: App.background_path(bg.num),
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
  let item_padding = 0.405
  let height_diff = 0.15
  let item_height = App.get_setting(`item_height`)

  if (item_height === `tiny`) {
    item_padding -= height_diff * 2
  }
  else if (item_height === `small`) {
    item_padding -= height_diff
  }
  else if (item_height === `big`) {
    item_padding += height_diff
  }
  else if (item_height === `huge`) {
    item_padding += height_diff * 2
  }

  item_padding = Math.max(item_padding, 0.1)
  App.set_css_var(`item_padding`, `${item_padding}rem`)
}

App.set_icon_size_vars = () => {
  let item_icon = App.get_setting(`item_icon`)
  let icon_size = 1.11
  let icon_size_diff = 0.181

  if (item_icon === `tiny`) {
    icon_size -= icon_size_diff * 2
  }
  else if (item_icon === `small`) {
    icon_size -= icon_size_diff
  }
  else if (item_icon === `big`) {
    icon_size += icon_size_diff
  }
  else if (item_icon === `huge`) {
    icon_size += icon_size_diff * 2
  }

  App.set_css_var(`icon_size`, `${icon_size}rem`)
}

App.set_tab_box_vars = () => {
  let tbh_rem = 13.0
  let tbh_diff = 3.5

  for (let size of App.sizes_2) {
    if (size.value === `compact`) {
      App.set_css_var(`tab_box_size_compact`, `1.9rem`)
    }
    else if (size.value === `tiny`) {
      let size = tbh_rem - (tbh_diff * 2)
      App.set_css_var(`tab_box_size_tiny`, `${size}rem`)
    }
    else if (size.value === `small`) {
      let size = tbh_rem - tbh_diff
      App.set_css_var(`tab_box_size_small`, `${size}rem`)
    }
    else if (size.value === `normal`) {
      let size = tbh_rem
      App.set_css_var(`tab_box_size_normal`, `${size}rem`)
    }
    else if (size.value === `big`) {
      let size = tbh_rem + (tbh_diff * 2)
      App.set_css_var(`tab_box_size_big`, `${size}rem`)
    }
    else if (size.value === `huge`) {
      let size = tbh_rem + (tbh_diff * 4)
      App.set_css_var(`tab_box_size_huge`, `${size}rem`)
    }
  }
}