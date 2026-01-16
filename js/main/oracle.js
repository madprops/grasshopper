App.show_oracle = () => {
  let words = App.get_random_words(3)
  let emoji = App.get_random_emoji()
  words.push(emoji)
  App.alert(words.join(`\n`))
}