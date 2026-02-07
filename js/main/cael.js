App.ai_config = {
  gemini: {
    url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    model: "gemini-flash-latest",
  },
  cael_system: `Your name is Cael, an ancient grasshopper deity. I am here to ask you a question, or to entertain you for a while.`
}

App.talk_to_cael = async () => {
  App.show_textarea({
    title: `Cael`,
    title_icon: App.cael_icon,
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
          App.ask_cael(text)
        },
      },
    ],
  })
}

App.ask_cael = (text) => {
  App.ask_ai(App.ai_config.cael_system, text)
}

App.ask_ai = async (system, prompt) => {
  let headers = {
    "Content-Type": `application/json`,
  }

  let body = {
    model: App.ai_config.gemini.model,
    stream: false,
  }

  body.messages = [
    {role: `system`, content: system},
    ...history,
    {role: `user`, content: prompt},
  ]

  try {
    let response = await fetch(App.ai_config.gemini.url, {
      method: `POST`,
      headers: headers,
      body: JSON.stringify(body),
    })

    let data = await response.json()

    if (!response.ok) {
      let err = data.error?.message || JSON.stringify(data)
      throw new Error(`AI API Error (${App.ai_source}): ${err}`)
    }

    return data.choices[0].message.content
  }
  catch (error) {
    console.error(`AI Request Failed:`, error)
  }
}