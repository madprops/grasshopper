App.setup_context = () => {
  NeedContext.min_width = `4.5rem`
  NeedContext.center_top = 50
}

App.show_context = (args = {}) => {
  NeedContext.show(args)
}

App.hide_context = () => {
  NeedContext.hide()
}

App.context_open = () => {
  return NeedContext.open
}