App.calculator_info = `You can use variables like a = 123. Combined operators like += -= /= *= are available. Variables can reference other variables. The result is the last operation performed.`

App.use_calculator = () => {
  function format_num(ans) {
    return App.number_format(ans, 5)
  }

  function on_error() {
    App.alert(`Expression could not be parsed`)
  }

  function result(text, mode = `normal`) {
    App.calculator_text = text
    let [ans, ok] = App.math_eval(text)

    if (ok) {
      let num = format_num(ans)

      if (mode === `normal`) {
        App.alert(num)
      }
      else if (mode === `copy`) {
        App.copy_to_clipboard(num)
        App.close_textarea()
      }
    }
    else {
      on_error()
    }
  }

  App.show_textarea({
    title: `Calculator`,
    title_icon: App.calculator_icon,
    text: App.calculator_text,
    monospace: true,
    readonly: false,
    enter_action: true,
    on_enter: (text) => {
      result(text)
    },
    ctrl_enter: true,
    buttons: [
      {
        text: `Close`,
        action: (text) => {
          App.calculator_text = text
          App.close_textarea()
        },
      },
      {
        text: `Info`,
        action: (text) => {
          App.alert(App.calculator_info)
        },
      },
      {
        text: `Copy`,
        action: (text) => {
          result(text, `copy`)
        },
      },
      {
        text: `Result`,
        action: (text) => {
          result(text)
        },
      },
    ],
  })
}