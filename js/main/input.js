App.show_input = (args = {}) => {
  let def_args = {
    value: ``,
    bottom: false,
    wrap: false,
  }

  App.def_args(def_args, args)

  let on_enter = () => {
    if (!args.action) {
      return
    }

    let ans = args.action(DOM.el(`#textarea_text`).value.trim())

    if (ans) {
      App.close_textarea()
    }
  }

  let buttons = [
    {
      text: `Close`,
      action: () => {
        App.close_textarea()
      },
    },
    {
      text: `Clear`,
      action: () => {
        App.clear_textarea()
      },
    },
    {
      text: args.button,
      action: () => {
        on_enter()
      }
    },
  ]

  let on_dismiss

  if (args.autosave) {
    on_dismiss = () => {
      do_action()
    }
  }

  App.show_textarea({
    on_enter,
    title: args.title,
    bottom: args.bottom,
    wrap: args.wrap,
    text: args.value,
    readonly: false,
    on_dismiss,
    buttons,
  })
}