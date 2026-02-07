// This is modularized so it's easy to add other personalities

App.ai_config = {
  gemini: {
    url: `https://generativelanguage.googleapis.com/v1beta/openai/chat/completions`,
    model: `gemini-flash-latest`,
  },
  cael_system: `Your name is Cael, an ancient grasshopper deity. I am here to ask you a question, or to entertain you for a while. Don't be overly mysterious, be relatable while maintaining some of your essence.`,
  history: [],
  words: 80,
  max_tokens: 2000,
}

App.talk_to_cael = async () => {
  App.ai_config.history = []
  App.show_ai(`cael`, `Cael`)
}

App.show_ai = (who, title) => {
  function ask(text) {
    App[`ai_ask_${who}`](text)
  }

  App.show_textarea({
    title,
    title_icon: App[`ai_icon_${who}`],
    readonly: false,
    on_enter: (text) => {
      ask(text)
    },
    enter_action: true,
    after_show: () => {
      if (!App.ai.key) {
        App.set_ai_key(`cael`)
      }
    },
    buttons: [
      {
        text: `Close`,
        action: () => {
          App.close_textarea()
        },
      },
      {
        text: `Info`,
        action: () => {
          App.show_ai_info()
        },
      },
      {
        text: `Key`,
        action: () => {
          App.set_ai_key(`cael`)
        },
      },
      {
        text: `Send`,
        action: (text) => {
          text = text.trim()

          if (!text) {
            return
          }

          if (!App.ai.key) {
            App.alert(`The key must be set first`)
            return
          }

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
      App.show_ai_response(res, `cael`, `Cael`)
    }
  }
  catch (err) {
    App.error(err)
    App.alert(`Communication Breakdown`)
  }
}

App.ask_ai = async (system, prompt) => {
  let headers = {
    "Content-Type": `application/json`,
    "Authorization": `Bearer ${App.ai.key}`,
  }

  let body = {
    stream: false,
    model: App.ai_config.gemini.model,
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

    if (res) {
      App.ai_config.history.push({role: `user`, content: prompt})
      App.ai_config.history.push({role: `assistant`, content: res})
    }

    App.hide_alert()
    App.clear_textarea()
    return res
  }
  catch (error) {
    App.hide_alert()
    App.error(error)
  }
}

App.set_ai_key = (talk = ``) => {
  App.show_prompt({
    password: true,
    value: App.ai.key,
    placeholder: `Gemini Key`,
    on_submit: async (key) => {
      App.ai.key = key
      App.stor_save_ai()

      if (key && talk) {
        App[`talk_to_${talk}`]()
      }
    },
  })
}

App.show_ai_info = () => {
  App.alert(`This uses Gemini.\nGet an API key in Google AI Studio`)
}

App.show_ai_response = (response, who, title) => {
  App.show_textarea({
    title,
    text: response,
    title_icon: App[`ai_icon_${who}`],
    readonly: true,
    wrap: true,
    simple: true,
    buttons: [
      {
        text: `Write`,
        action: () => {
          App.show_ai(who, title)
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