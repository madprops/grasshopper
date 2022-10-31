// Apply theme
App.apply_theme = function () {
  App.set_css_var("font_color", App.state.font_color)
  App.set_css_var("background_color", App.state.background_color)
}

// Set css variable
App.set_css_var = function (name, value) {
  document.documentElement.style.setProperty(`--${name}`, value)
}