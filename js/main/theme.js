// Setup theme
App.setup_theme = function () {
  App.colorlib = ColorLib()
  App.apply_theme()
}

// Apply theme
App.apply_theme = function () {
  let alt_color = App.colorlib.get_lighter_or_darker(App.settings.background_color, 0.12)
  App.set_css_var("background_color", App.settings.background_color)
  App.set_css_var("text_color", App.settings.text_color)
  App.set_css_var("alt_color", alt_color)
  App.set_css_var("pin_style", App.settings.pin_style)
  App.set_css_var("pin_color", App.settings.pin_color)
}

// Set css variable
App.set_css_var = function (name, value) {
  document.documentElement.style.setProperty(`--${name}`, value)
}

// Change a color
App.do_change_color = function (name, color) {
  App.settings[`${name}_color`] = color
  App.stor_save_settings()
  App.apply_theme()
}