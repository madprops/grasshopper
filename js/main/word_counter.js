App.show_word_counter = () => {
  function count(text) {
    let result = App.count_words(text)
    App.alert(result)
  }

  App.show_textarea({
    title: `Word Counter`,
    title_icon: App.word_counter_icon,
    readonly: false,
    buttons: [
      {
        text: `Close`,
        action: () => {
          App.close_textarea()
        },
      },
      {
        text: `Info`,
        action: (text) => {
          App.alert(`This counts the number of words, characters, and biggest space`)
        },
      },
      {
        text: `Copy`,
        action: (text) => {
          let result = App.count_words(text)
          App.copy_to_clipboard(result)
          App.close_textarea()
        },
      },
      {
        text: `Count`,
        action: (text) => {
          count(text)
        },
      },
    ],
  })
}

App.count_words = (text) => {
  text = text.trim()
  let words = App.word_count(text)
  let spaces = App.space_level(text)
  let lines = App.line_level(text)
  return `Words: ${words}\nChars: ${text.length}\nSpaces: ${spaces}\nLines: ${lines}`
}