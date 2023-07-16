App.setup_theme = () => {
  App.colorlib = ColorLib()
  App.apply_theme()
}

App.apply_theme = () => {
  try {
    let background = App.get_setting(`background_color`)
    let text = App.get_setting(`text_color`)

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

    App.set_css_var(`font_size`, App.get_setting(`font_size`) + `px`)
    App.set_css_var(`font`, `${App.get_setting(`font`)}, sans-serif`)

    let w = `${(App.get_setting(`width`) / 100) * 800}px`
    App.set_css_var(`width`, w)

    let h = `${(App.get_setting(`height`) / 100) * 600}px`
    App.set_css_var(`height`, h)

    let item_height = `2.15rem`

    if (App.get_setting(`item_height`) === `compact`) {
      item_height = `1.7rem`
    }
    else if (App.get_setting(`item_height`) === `bigger`) {
      item_height = `2.6rem`
    }

    App.set_css_var(`item_height`, item_height)

    if (App.get_setting(`background_image`)) {
      App.set_css_var(`background_image`, `url(${App.get_setting(`background_image`)})`)
    }
    else {
      App.set_css_var(`background_image`, `unset`)
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

    if (App.get_setting(`scrollbars`)) {
      main.classList.remove(`no_scrollbars`)
    }
    else {
      main.classList.add(`no_scrollbars`)
    }

    let bg = DOM.el(`#background`)
    let bg_effect = App.get_setting(`background_effect`)
    bg.classList.remove(`blur`)
    bg.classList.remove(`grayscale`)
    bg.classList.remove(`invert`)
    bg.classList.remove(`rotate`)

    if (bg_effect !== `none`) {
      bg.classList.add(bg_effect)
    }
  }
  catch (err) {
    App.log(err, `error`)
    App.settings_default_category(`theme`)
    App.stor_save_settings()
  }
}

App.set_css_var = (name, value) => {
  document.documentElement.style.setProperty(`--${name}`, value)
}

App.change_color = (name, color) => {
  App.set_setting(`${name}_color`, color)
  App.apply_theme()
}

App.set_background_image = (url) => {
  App.set_setting(`background_image`, url)
  App.apply_theme()
}