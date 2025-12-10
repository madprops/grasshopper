App.math_eval = (input = ``) => {
  if (!App.math_parser) {
    App.math_parser = new exprEval.Parser()
  }

  let ans = ``

  try {
    let [ans, ok] = App.math_eval_multiline(input)
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
    ans: 0,
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
      // 2. Determine Operator
      // Check for compound operators first because they contain "="
      let operator = null

      if (line.includes(`+=`)) {
        operator = `+=`
      }
      else if (line.includes(`-=`)) {
        operator = `-=`
      }
      else if (line.includes(`*=`)) {
        operator = `*=`
      }
      else if (line.includes(`/=`)) {
        operator = `/=`
      }
      else if (line.includes(`^=`)) {
        operator = `^=`
      }
      else if (line.includes(`%=`)) {
        operator = `%=`
      }
      else if (line.includes(`=`)) {
        operator = `=`
      }

      // 3. Handle Assignment
      if (operator) {
        let parts = line.split(operator)
        let var_name = parts[0].trim()

        // Join back in case the expression part contained the operator string
        let expression = parts.slice(1).join(operator).trim()

        let value = parser.evaluate(expression, scope)
        let current_val = 0

        if (scope[var_name] !== undefined) {
          current_val = scope[var_name]
        }

        if (operator === `+=`) {
          scope[var_name] = current_val + value
        }
        else if (operator === `-=`) {
          scope[var_name] = current_val - value
        }
        else if (operator === `*=`) {
          scope[var_name] = current_val * value
        }
        else if (operator === `/=`) {
          scope[var_name] = current_val / value
        }
        else if (operator === `^=`) {
          scope[var_name] = Math.pow(current_val, value)
        }
        else if (operator === `%=`) {
          scope[var_name] = current_val % value
        }
        else {
          scope[var_name] = value
        }

        final_result = scope[var_name]
      }
      // 4. Handle Standard Math
      else {
        let value = parser.evaluate(line, scope)
        scope.ans = value
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
  function format_num(ans) {
    return App.number_format(ans, 5)
  }

  function on_error() {
    App.alert(`Expression could not be parsed`)
  }

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
          let [ans, ok] = App.math_eval(text)

          if (ok) {
            let num = format_num(ans)
            App.copy_to_clipboard(num)
          }
          else {
            on_error()
          }
        },
      },
      {
        text: `Calculate`,
        action: (text) => {
          let [ans, ok] = App.math_eval(text)

          if (ok) {
            let num = format_num(ans)
            App.alert(num)
          }
          else {
            on_error()
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