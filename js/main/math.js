App.math_eval = (input = ``) => {
  if (!App.math_parser) {
    App.math_parser = new exprEval.Parser()
  }

  let ans = ``

  try {
    ans = App.math_eval_multiline(input)
    return [ans, true]
  }
  catch (err) {
    console.error(err)
    return [ans, false]
  }
}

App.math_eval_multiline = (text) => {
  // 1. The persistent memory (Variables live here)
  let scope = {
    ans: 0 // Default 'ans' variable
  }

  let lines = text.split('\n')
  let final_result = 0

  for (let line of lines) {
    line = line.trim()
    if (!line) continue

    // 2. Handle Custom Assignment (x = 10)
    if (line.includes(`=`)) {
      let parts = line.split(`=`)
      let var_name = parts[0].trim()
      let value = App.math_parser.evaluate(parts[1], scope)

      // Save it to our memory
      scope[var_name] = value
      final_result = value
    }

    // 3. Handle Regular Math
    else {
      let value = App.math_parser.evaluate(line, scope)

      // Update 'ans' and result
      scope[`ans`] = value
      final_result = value
    }
  }

  return final_result
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