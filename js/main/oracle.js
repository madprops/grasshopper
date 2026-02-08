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
    buttons: [
      {
        text: `Close`,
        action: () => {
          App.close_textarea()
        },
      },
      {
        text: `Again`,
        action: () => {
          App.show_oracle()
        },
      },
      {
        text: `Copy`,
        action: () => {
          App.textarea_copy()
        },
      },
    ],
  })
}