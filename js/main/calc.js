App.setup_calc = () => {
  App.calculator = new exprEval.Parser()
}

App.calc = (expression) => {
  try {
    return App.calculator.evaluate(`roundTo (${expression}, 2)`)
  }
  catch (err) {
    return undefined
  }
}