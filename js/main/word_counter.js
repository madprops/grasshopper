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
          App.alert(`This counts the number of words, characters, number of spaces, number of lines, biggest space, biggest line, longest word, and shortest word`)
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
  let spaces = App.space_count(text)
  let lines = App.line_count(text)
  let space_level = App.space_level(text)
  let line_level = App.line_level(text)
  let longest = App.longest_word(text) || `[None]`
  let shortest = App.shortest_word(text) || `[None]`

  return `Words: ${words}
  Chars: ${text.length}
  Spaces: ${spaces}
  Lines: ${lines}
  Space Level: ${space_level}
  Line Level: ${line_level}
  Longest: ${longest}
  Shortest: ${shortest}`
}