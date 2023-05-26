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

    let item_height = `2.1rem`

    if (App.settings.item_height === `compact`) {
      item_height = `1.7rem`
    }
    else if (App.settings.item_height === `bigger`) {
      item_height = `2.6rem`
    }

    App.set_css_var(`item_height`, item_height)

    if (App.settings.background === 0 && App.settings.custom_background === ``) {
      App.set_css_var(`background`, `unset`)
    }
    else {
      if (App.settings.custom_background) {
        App.set_css_var(`background`, `url(${App.settings.custom_background})`)
      }
      else if (App.settings.background !== 0) {
        App.set_css_var(`background`, `url(../img/backgrounds/${App.settings.background}.jpg)`)
      }
    }

    let main = DOM.el(`#main`)
    let classes = main.classList.value.split(` `)

    for (let cls of classes) {
      if (cls.startsWith(`highlight_`)) {
        main.classList.remove(cls)
      }
    }

    main.classList.add(`highlight_${App.settings.highlight_effect}`)
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

App.random_theme = () => {
  let max = 5
  let colors

  if (App.get_random_int(1, max) === max) {
    colors = App.get_random_theme(`light`)
  }
  else {
    colors = App.get_random_theme(`dark`)
  }

  let bgi = App.get_random_int(0, App.num_background_images)
  DOM.el(`#settings_background`).textContent = App.get_background_label(bgi)
  App.settings.background = bgi

  App.background_color_picker.setColor(colors.background_color)
  App.text_color_picker.setColor(colors.text_color)
}

App.get_random_theme = (what) => {
  let background_color = App.colorlib[`get_${what}_color`]()
  let text_color = App.colorlib.get_lighter_or_darker(background_color, App.color_diff(what))
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
      let what = App.colorlib.is_dark(background_color) ? `dark` : `light`
      text_color = App.colorlib.get_lighter_or_darker(background_color, App.color_diff(what))
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

App.color_diff = (what) => {
  if (what === `dark`) {
    return 0.8
  }
  else if (what === `light`) {
    return 0.5
  }
}