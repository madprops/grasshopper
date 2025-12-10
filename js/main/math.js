App.math_eval = (input = ``) => {
  if (!App.math_parser) {
    App.math_parser = new exprEval.Parser()
  }

  let ans = ``

  try {
    ans = App.math_parser.evaluate(input)
    return [ans, true]
  }
  catch (err) {
    return [ans, false]
  }
}

App.use_calculator = () => {
  App.show_textarea({
    title: `Calculator`,
    text: ``,
    monospace: true,
    readonly: false,
    buttons: [
      {
        text: `Close`,
        action: () => {
          App.close_textarea()
        },
      },
      {
        text: `Copy`,
        action: (text) => {
          App.copy_to_clipboard(text)
        },
      },
      {
        text: `Calculate`,
        action: (text) => {
          let [ans, ok] = App.math_eval(text)

          if (ok) {
            let num = App.number_format(ans, 5)
            App.alert(num)
          }
          else {
            App.alert(`Expression could not be parsed`)
          }
        },
      },
    ],
  })
}

App.number_format = (num, decimals) => {
  // maximumFractionDigits caps the decimals
  // it defaults to not showing trailing zeros
  let formatter = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: decimals,
    useGrouping: true, // Set true if you want "1,000"
  })

  return formatter.format(num)
}