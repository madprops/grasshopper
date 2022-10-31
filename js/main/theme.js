// Apply theme
App.apply_theme = function () {
  if (App.state.theme === "dark") {
    App.set_css_var("font_color", "white")
    App.set_css_var("background_color", "#252933")
    App.set_css_var("selected_color", "#4c5261")
    App.set_css_var("separator_color", "#58678c")
    App.set_css_var("filter_background_color", "#99a7d6")
    App.set_css_var("filter_font_color", "black")
  } else if (App.state.theme === "light") {
    App.set_css_var("font_color", "black")
    App.set_css_var("background_color", "white")
    App.set_css_var("selected_color", "rgb(200, 200, 200)")
    App.set_css_var("separator_color", "rgb(200, 200, 200)")
    App.set_css_var("filter_background_color", "rgb(200, 200, 200)")
    App.set_css_var("filter_font_color", "black")
  }
}

// Set css variable
App.set_css_var = function (name, value) {
  document.documentElement.style.setProperty(`--${name}`, value)
}