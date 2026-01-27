App.show_gematria = () => {
  App.show_prompt({
    placeholder: `Enter Text`,
    on_submit: (text) => {
      let s = App.solve_gematria(text)
      App.alert(s)
    },
  })
}

App.solve_gematria = (text) => {
  let sum = 0
  let split = text.split(``)

  for (let i = 0; i < split.length; i++) {
    let c = split[i].toLowerCase()

    if (c.trim() === ``) {
      continue
    }

    if (!isNaN(c)) {
      sum += parseInt(c)
    }
    else {
      let indx = App.letters.indexOf(c)

      if (indx !== -1) {
        sum += indx + 1
      }
    }
  }

  let num

  if (sum > 9) {
    num = App.deconstruct_gematria(sum)
  }

  else {
    num = sum.toString()
  }

  return num
}

App.deconstruct_gematria = (sum, s = `${sum}`) => {
  let num = 0
  let split = sum.toString().split(``)

  for (let n of split) {
    num += parseInt(n)
  }

  s += ` -> ${num}`

  if (num > 9) {
    return App.deconstruct_gematria(num, s)
  }

  return s
}