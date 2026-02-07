App.show_input = (args = {}) => {
  let def_args = {
    value: ``,
    bottom: false,
    left: false,
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
        App.show_confirm({
          message: `Clear text?`,
          confirm_action: () => {
            App.clear_textarea()
          },
        })
      },
    },
    {
      text: args.button,
      action: () => {
        on_enter()
      },
    },
  ]

  let on_dismiss

  if (args.autosave) {
    on_dismiss = () => {
      on_enter()
    }
  }

  App.show_textarea({
    on_enter,
    title: args.title,
    title_icon: args.title_icon,
    left: args.left,
    bottom: args.bottom,
    wrap: args.wrap,
    text: args.value,
    readonly: false,
    enter_action: true,
    ctrl_enter: true,
    on_dismiss,
    buttons,
  })
}