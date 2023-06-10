App.setup_calc = () => {
  App.calculator = new exprEval.Parser()
}

App.calc = (expression) => {
  try {
    return App.calculator.evaluate(`roundTo (${expression}, ${App.calc_decimals})`)
  }
  catch (err) {
    return undefined
  }
}