// Apply theme
App.apply_theme = function () {
  if (App.state.theme === "light") {
    App.set_css_var("font_color", "black")
    App.set_css_var("background_color", "white")
    App.set_css_var("alt_color_1", "rgba(200, 200, 200, 0.7)")
    App.set_css_var("alt_color_2", "rgb(200, 200, 200)")
  } 
  
  else if (App.state.theme === "hacker") {
    App.set_css_var("font_color", "rgb(0, 255, 0)")
    App.set_css_var("background_color", "black")
    App.set_css_var("alt_color_1", "rgba(0, 255, 0, 0.2)")
    App.set_css_var("alt_color_2", "rgba(0, 255, 0, 0.4)")
  } 
  
  else if (App.state.theme === "freezer") {
    App.set_css_var("font_color", "white")
    App.set_css_var("background_color", "rgb(151, 146, 227)")
    App.set_css_var("alt_color_1", "rgba(255, 255, 255, 0.25)")
    App.set_css_var("alt_color_2", "rgba(255, 255, 255, 0.4)")
  } 

  else {
    App.set_css_var("font_color", "white")
    App.set_css_var("background_color", "rgb(37, 41, 51)")
    App.set_css_var("alt_color_1", "rgba(76, 82, 97, 0.8)")
    App.set_css_var("alt_color_2", "rgb(88, 103, 140)")
  }
}

// Set css variable
App.set_css_var = function (name, value) {
  document.documentElement.style.setProperty(`--${name}`, value)
}