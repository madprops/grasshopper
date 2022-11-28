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
    
    let alt_color = App.colorlib.rgb_to_rgba(App.settings.text_color, 0.14)
    App.set_css_var("alt_color", alt_color)
    
    let alt_color_2 = App.colorlib.rgb_to_rgba(App.settings.text_color, 0.22)
    App.set_css_var("alt_color_2", alt_color_2)

    let alt_color_3 = App.colorlib.rgb_to_rgba(App.settings.text_color, 0.50)
    App.set_css_var("alt_color_3", alt_color_3)

    let alt_background = App.colorlib.rgb_to_rgba(App.settings.background_color, 0.55)
    App.set_css_var("alt_background", alt_background)

    App.set_css_var("text_size", App.settings.text_size + "px")    
  } catch (e) {
    App.settings.background_color = App.default_settings.background_color.value
    App.settings.text_color = App.default_settings.text_color.value
    App.stor_save_settings()
    App.apply_theme()
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

  App.background_color_picker.setColor(colors.background_color)
  App.text_color_picker.setColor(colors.text_color)
}

// Get a random dark theme
App.get_dark_theme = function () {
  let background_color = App.colorlib.get_dark_color()
  let text_color = App.colorlib.get_random_hex()
  
  if (App.colorlib.is_dark(text_color)) {
    text_color = App.colorlib.get_lighter_or_darker(text_color, 0.66)
  }

  return {background_color: background_color, text_color: text_color}
}

// Get a random light theme
App.get_light_theme = function () {
  let background_color = App.colorlib.get_light_color()
  let text_color = App.colorlib.get_random_hex()
  
  if (App.colorlib.is_light(text_color)) {
    text_color = App.colorlib.get_lighter_or_darker(text_color, 0.66)
  }

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