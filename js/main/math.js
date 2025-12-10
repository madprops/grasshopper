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
