App.math_eval = (input = ``) => {
  if (!App.math_parser) {
    App.math_parser = new exprEval.Parser()
  }

  let ans = ``

  try {
    ans = App.math_parser.evaluate(input)
  }
  catch (err) {
    //
  }

  return ans
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
          let ans = App.math_eval(text)

          if (ans) {
            let num = App.number_format(ans, 5)
            App.alert(num)
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