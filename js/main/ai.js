App.ai_config = {
  gemini: {
    url: `https://generativelanguage.googleapis.com/v1beta/openai/chat/completions`,
    model: `gemini-flash-latest`,
  },
  cael_system: `Your name is Cael, an ancient grasshopper deity. I am here to ask you a question, or to entertain you for a while.`,
  history: [],
  words: 500,
  max_tokens: 1000,
}

App.talk_to_cael = async () => {
  if (!App.ai.key) {
    App.set_ai_key(`cael`)
    return
  }

  App.ai_config.history = []
  App.show_ai(`cael`, `Cael`)
}

App.show_ai = (who, title) => {
  function ask(text) {
    App[`ai_ask_${who}`](text)
  }

  App.show_textarea({
    title,
    title_icon: App.cael_icon,
    readonly: false,
    on_enter: (text) => {
      ask(text)
    },
    enter_action: true,
    buttons: [
      {
        text: `Close`,
        action: () => {
          App.close_textarea()
        },
      },
      {
        text: `Copy`,
        action: () => {
          // copy whole conversation
          App.close_textarea()
        },
      },
      {
        text: `Send`,
        action: (text) => {
          ask(text)
        },
      },
    ],
  })
}

App.ai_ask_cael = async (text) => {
  try {
    let res = await App.ask_ai(App.ai_config.cael_system, text)

    if (res) {
      App.alert(res)
    }
  }
  catch (err) {
    App.alert(`Communication Breakdown`)
  }
}

App.ask_ai = async (system, prompt) => {
  let headers = {
    "Content-Type": `application/json`,
    "Authorization": `Bearer ${App.ai.key}`,
  }

  let body = {
    model: App.ai_config.gemini.model,
    stream: false,
    max_tokens: App.ai_config.max_tokens,
  }

  system += `\nKeep response to around ${App.ai_config.words} words.`

  body.messages = [
    {role: `system`, content: system},
    ...App.ai_config.history,
    {role: `user`, content: prompt},
  ]

  App.alert(`Thinking...`)

  try {
    let response = await fetch(App.ai_config.gemini.url, {
      method: `POST`,
      headers,
      body: JSON.stringify(body),
    })

    let data = await response.json()

    if (!response.ok) {
      let err = data.error?.message || JSON.stringify(data)
      throw new Error(`AI API Error (${App.ai_source}): ${err}`)
    }

    let res = data.choices[0].message.content
    App.ai_config.history.push({role: `user`, content: prompt})
    App.ai_config.history.push({role: `assistant`, content: res})
    App.clear_textarea()
    return res
  }
  catch (error) {
    App.error(error)
  }
}

App.set_ai_key = (talk = ``) => {
  App.show_prompt({
    password: true,
    placeholder: `Gemini Key`,
    on_submit: async (key) => {
      if (key) {
        App.ai.key = key
        App.stor_save_ai()

        if (talk) {
          App[`talk_to_${talk}`]()
        }
      }
    },
  })
}