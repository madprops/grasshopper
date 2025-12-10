App.math_eval = (input = ``) => {
  if (!App.math_parser) {
    App.math_parser = new exprEval.Parser()
  }

  let ans = ``

  try {
    [ans, ok] = App.math_eval_multiline(input)
    return [ans, ok]
  }
  catch (err) {
    App.error(err)
    return [ans, false]
  }
}

App.math_eval_multiline = (text) => {
  let parser = App.math_parser

  // Persistent memory
  let scope = {
    ans: 0
  }

  let lines = text.split(`\n`)
  let final_result = 0

  for (let line of lines) {
    // 1. Strip Comments: Take everything before the first '//'
    line = line.split(`//`)[0].trim()

    // Skip empty lines (or lines that were just comments)
    if (!line) {
      continue
    }

    try {
      // 2. Handle Assignment (x = 10)
      if (line.includes(`=`)) {
        let parts = line.split(`=`)
        let var_name = parts[0].trim()
        let expression = parts[1].trim()
        let value = parser.evaluate(expression, scope)
        scope[var_name] = value
        final_result = value
      }
      // 3. Handle Standard Math
      else {
        let value = parser.evaluate(line, scope)
        scope[`ans`] = value
        final_result = value
      }
    }
    catch (e) {
      return [0, false]
    }
  }

  return [final_result, true]
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
  let formatter = new Intl.NumberFormat(`en-US`, {
    maximumFractionDigits: decimals,
    useGrouping: true, // Set true if you want "1,000"
  })

  return formatter.format(num)
}