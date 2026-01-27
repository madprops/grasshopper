App.generate_password = (hard = false) => {
  let password = App.make_password(hard)

  App.show_textarea({
    title: `Password`,
    title_icon: App.key_icon,
    text: password,
    simple: true,
    monospace: true,
    buttons: [
      {
        text: `1`,
        action: () => {
          App.generate_password()
        },
      },
      {
        text: `2`,
        action: () => {
          App.generate_password(true)
        },
      },
      {
        text: `Copy`,
        action: () => {
          App.copy_to_clipboard(password)
          App.close_textarea()
        },
      },
      {
        text: `Close`,
        action: () => {
          App.close_textarea()
        },
      },
    ],
  })
}

App.make_password = (hard = false) => {
  if (hard || App.get_setting(`hard_passwords`)) {
    return App.random_string(App.password_length)
  }
  else {
    let words = App.get_random_words(2)
    let num = App.random_int({min: 10, max: 999})
    return `${words[0]}${words[1]}${num}`
  }
}