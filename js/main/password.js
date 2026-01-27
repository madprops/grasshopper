App.generate_password = () => {
  let password = App.make_password()

  App.show_textarea({
    title: `Password`,
    title_icon: App.key_icon,
    text: password,
    simple: true,
    monospace: true,
    buttons: [
      {
        text: `Again`,
        action: () => {
          App.generate_password()
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

App.make_password = () => {
  let words = App.get_random_words(2)
  let num = App.random_int({min: 10, max: 999})
  return `${words[0]}${words[1]}${num}`
}