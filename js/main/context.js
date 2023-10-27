App.show_context = (args = {}) => {
  NeedContext.show(args)
}

App.hide_context = () => {
  NeedContext.hide()
}

App.context_open = () => {
  return NeedContext.open
}