App.show_gematria = () => {
  function solve(text) {
    let s = App.solve_gematria(text)
    App.alert(s)
  }

  App.show_textarea({
    title: `Gematria`,
    title_icon: App.gematria_icon,
    readonly: false,
    single_line: true,
    center: true,
    on_enter: (e, text) => {
      solve(text)
      e.preventDefault()
    },
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
          let result = App.solve_gematria(text)
          App.copy_to_clipboard(result)
          App.close_textarea()
        },
      },
      {
        text: `Result`,
        action: (text) => {
          solve(text)
        },
      },
    ],
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