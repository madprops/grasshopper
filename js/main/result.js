App.check_result = (mode, value) => {
  App.hide_result(mode)

  // Try to solve a math expression
  if (App.contains_number(value)) {
    let ans = App.calc(value)

    if (ans !== undefined) {
      if (ans.toString() !== value) {
        App.show_result(mode, ans)
      }
    }
  }
  else if ([`date`, `now`, `time`, `today`].includes(value)) {
    App.show_result(mode, App.today())
  }
}

App.create_result = (mode) => {
  return DOM.create(`div`, `result action`, `${mode}_result`)
}

App.show_result = (mode, text) => {
  let item = DOM.el(`#${mode}_result`)
  item.textContent = text
  item.classList.add(`result_active`)
}

App.hide_result = (mode) => {
  DOM.el(`#${mode}_result`).classList.remove(`result_active`)
}

App.result_copy = (mode) => {
  let value = DOM.el(`#${mode}_result`).textContent.trim()
  App.copy_to_clipboard(value, `Result`)
}

App.setup_calc = () => {
  App.calculator = new exprEval.Parser()
}

App.calc = (expression) => {
  try {
    let ans = App.calculator.evaluate(`roundTo (${expression}, ${App.calc_decimals})`)

    if (!isNaN(ans)) {
      return ans.toLocaleString()
    }
  }
  catch (err) {}
}

App.today = () => {
  return dateFormat(Date.now(), `ddd dd mmm h:MM tt`)
}