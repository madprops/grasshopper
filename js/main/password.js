App.generate_password = () => {
  let password = App.random_string(App.password_length)

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