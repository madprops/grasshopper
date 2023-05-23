App.setup_theme = () => {
  App.colorlib = ColorLib()
  App.apply_theme()
}

App.apply_theme = () => {
  try {
    App.set_css_var(`background_color`, App.settings.background_color)
    App.set_css_var(`text_color`, App.settings.text_color)

    let main_background = App.colorlib.rgb_to_rgba(App.settings.background_color, 0.93)
    App.set_css_var(`main_background`, main_background)

    let alt_color_0 = App.colorlib.rgb_to_rgba(App.settings.text_color, 0.15)
    App.set_css_var(`alt_color_0`, alt_color_0)

    let alt_color_1 = App.colorlib.rgb_to_rgba(App.settings.text_color, 0.20)
    App.set_css_var(`alt_color_1`, alt_color_1)

    let alt_color_2 = App.colorlib.rgb_to_rgba(App.settings.text_color, 0.50)
    App.set_css_var(`alt_color_2`, alt_color_2)

    let alt_background = App.colorlib.rgb_to_rgba(App.settings.background_color, 0.55)
    App.set_css_var(`alt_background`, alt_background)

    App.set_css_var(`font_size`, App.settings.font_size + `px`)
    App.set_css_var(`font`, `${App.settings.font}, sans-serif`)

    let w = `${(App.settings.width / 100) * 800}px`
    App.set_css_var(`width`, w)

    let h = `${(App.settings.height / 100) * 600}px`
    App.set_css_var(`height`, h)

    if (App.settings.background_image === `none` && App.settings.custom_background === ``) {
      App.set_css_var(`background_image`, `unset`)
    }
    else {
      if (App.settings.custom_background) {
        App.set_css_var(`background_image`, `url(${App.settings.custom_background})`)
      }
      else if (App.settings.background_image !== `none`) {
        App.set_css_var(`background_image`, `url(../img/backgrounds/${App.settings.background_image}.jpg)`)
      }
    }
  }
  catch (err) {
    App.log(err, `error`)
    App.settings.background_color = App.default_settings.background_color.value
    App.settings.text_color = App.default_settings.text_color.value
    App.stor_save_settings()
    App.close_window()
  }
}

App.set_css_var = (name, value) => {
  document.documentElement.style.setProperty(`--${name}`, value)
}

App.change_color = (name, color) => {
  App.settings[`${name}_color`] = color
  App.apply_theme()
  App.stor_save_settings()
}

App.random_theme = (mode) => {
  let colors

  if (mode === `dark`) {
    colors = App.get_random_theme(`dark`)
  }
  else if (mode === `light`) {
    colors = App.get_random_theme(`light`)
  }

  App.background_color_picker.setColor(colors.background_color)
  App.text_color_picker.setColor(colors.text_color)
}

App.get_random_theme = (what) => {
  let background_color = App.colorlib[`get_${what}_color`]()
  let text_color = App.colorlib.get_lighter_or_darker(background_color, App.theme_color_diff)

  if (App.get_random_int(1, 3) === 3) {
    background_color = App.colorlib.get_lighter_or_darker(background_color, 0.22)
  }

  return {background_color: background_color, text_color: text_color}
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
      text_color = App.colorlib.get_lighter_or_darker(background_color, App.theme_color_diff)
    }

    let d2 = DOM.create(`div`, `hidden`)
    d2.style.color = text_color
    document.body.append(d2)

    App.background_color_picker.setColor(background_color)
    App.text_color_picker.setColor(text_color)

    d1.remove()
    d2.remove()

    return
  }

  App.show_alert(`Theme couldn't be detected`)
}