// Setup theme
App.setup_theme = function () {
  App.colorlib = ColorLib()
  App.apply_theme()
}

// Apply theme
App.apply_theme = function () {
  let background_color = App.state.color
  let font_color = App.colorlib.get_lighter_or_darker(background_color, 0.7)
  let alt_color = App.colorlib.get_lighter_or_darker(background_color, 0.14)
  App.set_css_var("background_color", background_color)
  App.set_css_var("font_color", font_color)
  App.set_css_var("alt_color", alt_color)
}

// Set css variable
App.set_css_var = function (name, value) {
  document.documentElement.style.setProperty(`--${name}`, value)
}

// Change the color
App.do_change_color = function (color) {
  App.state.color = color
  App.save_state()
  App.apply_theme()
}