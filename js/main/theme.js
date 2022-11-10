// Setup theme
App.setup_theme = function () {
  App.colorlib = ColorLib()
  App.apply_theme()
}

// Apply theme
App.apply_theme = function () {
  App.set_css_var("background_color", App.settings.background_color)
  App.set_css_var("text_color", App.settings.text_color)
  App.set_css_var("pin_style", App.settings.pin_style)
  
  let alt_color = App.to_rgba(App.settings.text_color, 0.14)
  App.set_css_var("alt_color", alt_color)
  
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

// rgb to rgba
App.to_rgba = function (rgb, alpha) {
  return rgb.replace(/rgb/i, "rgba").replace(/\)/i, `, ${alpha})`)
}

// Pick a random theme
App.random_theme = function (mode) {
  let colors 
  
  if (mode === "dark") {
    colors = App.get_dark_theme()
  } else if (mode === "light") {
    colors = App.get_light_theme()
  }

  App.background_color_picker.color = colors.bg_color
  App.text_color_picker.color = colors.text_color

  App.apply_theme()
  App.stor_save_settings()
}

// Get a random dark theme
App.get_dark_theme = function () {
  let bg_color = App.colorlib.get_dark_color()
  let text_color = App.colorlib.get_random_hex()
  
  if (App.colorlib.is_dark(text_color)) {
    text_color = App.colorlib.get_lighter_or_darker(text_color, 0.66)
  }

  return {bg_color: bg_color, text_color: text_color}
}

// Get a random light theme
App.get_light_theme = function () {
  let bg_color = App.colorlib.get_light_color()
  let text_color = App.colorlib.get_random_hex()
  
  if (App.colorlib.is_light(text_color)) {
    text_color = App.colorlib.get_lighter_or_darker(text_color, 0.66)
  }

  return {bg_color: bg_color, text_color: text_color}
}