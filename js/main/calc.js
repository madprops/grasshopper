App.setup_calc = () => {
  App.calculator = new exprEval.Parser()
}

App.calc = (expression) => {
  try {
    return App.calculator.evaluate(expression)
  }
  catch (err) {
    return undefined
  }
}