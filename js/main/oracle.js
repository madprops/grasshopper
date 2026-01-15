App.show_oracle = () => {
  let words = App.get_random_words(3)
  App.alert(words.join(`\n`))
}