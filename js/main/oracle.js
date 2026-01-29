App.show_oracle = () => {
  let words = App.get_random_words(App.oracle_words)
  let emoji = App.get_random_emoji()
  words.push(emoji)
  let text = words.join(` `)

  App.show_textarea({
    title: `Oracle`,
    title_icon: App.oracle_icon,
    text,
    simple: true,
    monospace: true,
    buttons: [
      {
        text: `Again`,
        action: () => {
          App.show_oracle()
        },
      },
      {
        text: `Copy`,
        action: () => {
          App.copy_to_clipboard(text)
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