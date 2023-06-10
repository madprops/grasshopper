App.setup_theme = () => {
  App.colorlib = ColorLib()
  App.apply_theme()
}

App.dark_theme = {
  background_color: `rgb(70, 76, 94)`,
  text_color: `rgb(218, 219, 223)`,
}

App.light_theme = {
  background_color: `rgb(207, 218, 242)`,
  text_color: `rgb(104, 109, 121)`,
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
    let classes = main.classList.value.split(` `)

    for (let cls of classes) {
      if (cls.startsWith(`highlight_`)) {
        main.classList.remove(cls)
      }
    }

    main.classList.add(`highlight_${App.get_setting(`highlight_effect`)}`)

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

App.random_theme = () => {
  let theme = ThemeList.random_theme()
  let background_color = App.colorlib.hex_to_rgb(theme.background)
  let text_color = App.colorlib.hex_to_rgb(theme.color)

  App.set_setting(`background_color`, background_color)
  App.set_setting(`text_color`, text_color)

  if (App.window_mode === `settings_theme`) {
    App.background_color_picker.setColor(background_color)
    App.text_color_picker.setColor(text_color)
  }
  else {
    App.apply_theme()
  }
}

App.detect_theme = async () => {
  let theme = await browser.theme.getCurrent()

  if (theme.colors.toolbar) {
    let d1 = DOM.create(`div`, `hidden`)
    d1.style.color = theme.colors.toolbar
    document.body.append(d1)
    let background_color = window.getComputedStyle(d1).color

    let text_color

    if (theme.colors.toolbar_text && (theme.colors.toolbar !== theme.colors.toolbar_text)) {
      text_color = theme.colors.toolbar_text
    }
    else {
      let what = App.colorlib.is_dark(background_color) ? `dark` : `light`
      text_color = App.colorlib.get_lighter_or_darker(background_color, App.color_diff(what))
    }

    let d2 = DOM.create(`div`, `hidden`)
    d2.style.color = text_color
    document.body.append(d2)

    App.set_setting(`background_color`, background_color)
    App.set_setting(`text_color`, text_color)

    if (App.window_mode === `settings_theme`) {
      App.background_color_picker.setColor(background_color)
      App.text_color_picker.setColor(text_color)
    }
    else {
      App.apply_theme()
    }

    d1.remove()
    d2.remove()
    return
  }

  App.show_alert(`Theme couldn't be detected`)
}

App.color_diff = (what) => {
  if (what === `dark`) {
    return 0.8
  }
  else if (what === `light`) {
    return 0.5
  }
}

App.set_background_image = (url) => {
  App.set_setting(`background_image`, url)
  App.apply_theme()
}

App.change_theme = (what) => {
  App.set_setting(`background_color`, App[`${what}_theme`].background_color)
  App.set_setting(`text_color`, App[`${what}_theme`].text_color)
  App.apply_theme()
}