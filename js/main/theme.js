// Setup theme
App.setup_theme = function () {
  App.colorlib = ColorLib()  
  App.apply_theme()
}

// Apply theme
App.apply_theme = function () {
  try {
    App.set_css_var("background_color", App.settings.background_color)
    App.set_css_var("text_color", App.settings.text_color)

    let main_background = App.colorlib.rgb_to_rgba(App.settings.background_color, 0.94)
    App.set_css_var("main_background", main_background)

    let alt_color_1 = App.colorlib.rgb_to_rgba(App.settings.text_color, 0.14)
    App.set_css_var("alt_color_1", alt_color_1)
    
    let alt_color_2 = App.colorlib.rgb_to_rgba(App.settings.text_color, 0.22)
    App.set_css_var("alt_color_2", alt_color_2)

    let alt_color_3 = App.colorlib.rgb_to_rgba(App.settings.text_color, 0.50)
    App.set_css_var("alt_color_3", alt_color_3)

    let alt_background = App.colorlib.rgb_to_rgba(App.settings.background_color, 0.55)
    App.set_css_var("alt_background", alt_background)

    App.set_css_var("text_size", App.settings.text_size + "px")
    App.set_css_var("font", App.settings.font)

    if (App.settings.background_image === "none") {
      App.set_css_var("background_image", "unset")
    } else {
      App.set_css_var("background_image", `url(../img/backgrounds/${App.settings.background_image}.jpg)`)
    }
  } catch (e) {
    App.settings.background_color = App.default_settings.background_color.value
    App.settings.text_color = App.default_settings.text_color.value
    App.stor_save_settings()
    window.close()
  }
}

// Set css variable
App.set_css_var = function (name, value) {
  document.documentElement.style.setProperty(`--${name}`, value)
}

// Change a color
App.do_change_color = function (name, color) {
  App.settings[`${name}_color`] = color
  App.apply_theme()
  App.stor_save_settings()
}

// Pick a random theme
App.random_theme = function (mode) {
  let colors 
  
  if (mode === "dark") {
    colors = App.get_dark_theme()
  } else if (mode === "light") {
    colors = App.get_light_theme()
  }

  let random_image = App.random_choice(App.get_background_image_options())
  App.settings.background_image = random_image[1]
  App.el("#settings_background_image").textContent = random_image[0]
  App.background_color_picker.setColor(colors.background_color)
  App.text_color_picker.setColor(colors.text_color)
}

// Get a random dark theme
App.get_dark_theme = function () {
  let background_color = App.colorlib.get_dark_color()
  let text_color = App.colorlib.get_lighter_or_darker(background_color, 0.66)
  return {background_color: background_color, text_color: text_color}
}

// Get a random light theme
App.get_light_theme = function () {
  let background_color = App.colorlib.get_light_color()
  let text_color = App.colorlib.get_lighter_or_darker(background_color, 0.66)
  return {background_color: background_color, text_color: text_color}
}

// Attempt to detect browser theme
App.detect_theme = async function () {
  let theme = await browser.theme.getCurrent()

  if (theme.colors.toolbar && theme.colors.toolbar_text) {
    if (theme.colors.toolbar !== theme.colors.toolbar_text) {
      let d1 = App.create("div", "hidden")
      d1.style.color = theme.colors.toolbar
      document.body.append(d1)

      let d2 = App.create("div", "hidden")
      d2.style.color = theme.colors.toolbar_text
      document.body.append(d2)

      App.background_color_picker.setColor(window.getComputedStyle(d1).color)
      App.text_color_picker.setColor(window.getComputedStyle(d2).color)

      d1.remove()
      d2.remove()
      
      return
    }
  }

  App.show_alert("Theme couldn't be detected")
}