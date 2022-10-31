// Apply theme
App.apply_theme = function () {
  if (App.state.theme === "light") {
    App.set_css_var("font_color", "black")
    App.set_css_var("background_color", "white")
    App.set_css_var("selected_color", "rgb(200, 200, 200)")
    App.set_css_var("separator_color", "rgb(200, 200, 200)")
    App.set_css_var("filter_background_color", "rgb(200, 200, 200)")
    App.set_css_var("filter_font_color", "black")
    App.set_css_var("filter_outline_color", "rgba(0, 0, 0, 0.4)")
  } 
  
  else if (App.state.theme === "hacker") {
    App.set_css_var("font_color", "rgb(0, 255, 0)")
    App.set_css_var("background_color", "black")
    App.set_css_var("selected_color", "rgba(0, 255, 0, 0.2)")
    App.set_css_var("separator_color", "rgba(0, 255, 0, 0.4)")
    App.set_css_var("filter_background_color", "black")
    App.set_css_var("filter_font_color", "rgb(0, 255, 0)")
    App.set_css_var("filter_outline_color", "green")
  } 
  
  else if (App.state.theme === "freezer") {
    App.set_css_var("font_color", "white")
    App.set_css_var("background_color", "#9792E3")
    App.set_css_var("selected_color", "rgba(255, 255, 255, 0.25)")
    App.set_css_var("separator_color", "rgba(255, 255, 255, 0.4)")
    App.set_css_var("filter_background_color", "white")
    App.set_css_var("filter_font_color", "black")
    App.set_css_var("filter_outline_color", "black")
  } 

  else {
    App.set_css_var("font_color", "white")
    App.set_css_var("background_color", "#252933")
    App.set_css_var("selected_color", "#4c5261")
    App.set_css_var("separator_color", "#58678c")
    App.set_css_var("filter_background_color", "#99a7d6")
    App.set_css_var("filter_font_color", "black")
    App.set_css_var("filter_outline_color", "rgba(255, 255, 255, 0.4)")
  }
}

// Set css variable
App.set_css_var = function (name, value) {
  document.documentElement.style.setProperty(`--${name}`, value)
}