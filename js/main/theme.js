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
App.random_theme = function () {
  let background_color = App.random_rgb_color()
  let text_color = App.colorlib.get_lighter_or_darker(background_color, 0.7)

  App.settings.background_color = background_color
  App.settings.text_color = text_color

  App.el("#background_color_picker").value = App.settings.background_color
  App.el("#text_color_picker").value = App.settings.text_color

  App.apply_theme()
  App.stor_save_settings()
}

// Random rgb color
App.random_rgb_color = function () {
  let r = App.get_random_int(0, 255)
  let g = App.get_random_int(0, 255)
  let b = App.get_random_int(0, 255)
  return `rgb(${r}, ${g}, ${b})`
}