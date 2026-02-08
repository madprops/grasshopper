// This is modularized so it's easy to add other personalities

App.ai_config = {
  gemini: {
    url: `https://generativelanguage.googleapis.com/v1beta/openai/chat/completions`,
    model: `gemini-flash-latest`,
  },
  cael_system_chat: `Your name is Cael, an ancient grasshopper deity.
  I am here to ask you a question, or to entertain you for a while.
  Don't be overly mysterious, be relatable while maintaining some of your essence.`,
  cael_system_cmd: `You exist inside a tab manager addon for Firefox that has many features available.
  You are going to be given instructions to perform one or more actions.
  You are going to be given a list of relevant commands.
  Find the commands that satisfy that request.
  The format is an array of command key strings, with one or more items.
  For instance, if the user asks for a new tab to be opened:
  You return ["open_new_tab"].
  If the user asks to increase the font size and close all unloaded tabs.
  You return ["increase_font_size", "close_unloaded_tabs"].
  If no command satisfies the request, or it's too ambiguous, just return "idk".`,
  cael_system_ask: `You exist inside a tab manager addon for Firefox that has many features available.
  You are going to be asked about how to do or set something.
  You are going to be given a list of relevant commands, and a list of relevant settings.
  Point the user to a command or setting they might use to solve their problem.
  For instance: "You might be looking for the 'Close Unloaded' command.".
  Or: "You can adjust this in the 'Filter Placeholder' setting.".`,
  history: [],
  words: 50,
  max_tokens: 1000,
}

App.talk_to_cael = async () => {
  App.ai_config.history = []
  App.show_ai(`cael`, `Cael`)
}

App.show_ai = (who, title) => {
  function ask(text, mode = `chat`) {
    App[`ai_ask_${who}`](text, mode)
  }

  function send(text, mode = `chat`) {
    text = text.trim()

    if (!text) {
      if (mode === `chat`) {
        App.alert(`You can use this for conversation.
          Like: "How are you?"
          Or: "How high can you jump?"`)
      }
      else if (mode === `cmd`) {
        App.alert(`You can use this to request an action.
          Like: "Set a random dark theme"
          Or: "Close all the unloaded tabs"`)
      }
      else if (mode === `ask`) {
        App.alert(`You can use this to ask about functionality.
          Like: "How do I select normal tabs?"
          Or: "Where do I change the border color?"`)
      }

      return
    }

    if ([`cmd`, `ask`].includes(mode)) {
      if (text.length < 10) {
        return
      }

      if (!text.includes(` `)) {
        return
      }
    }

    if (!App.ai.key) {
      App.alert(`The key must be set first`)
      return
    }

    ask(text, mode)
  }

  App.show_textarea({
    title,
    title_icon: App[`ai_icon_${who}`],
    readonly: false,
    fluid: true,
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
        text: `Key`,
        action: () => {
          App.set_ai_key(`cael`)
        },
      },
      {
        text: `Cmd`,
        action: (text) => {
          send(text, `cmd`)
        },
      },
      {
        text: `Ask`,
        action: (text) => {
          send(text, `ask`)
        },
      },
      {
        text: `Chat`,
        action: (text) => {
          send(text)
        },
      },
    ],
  })
}

App.ai_ask_cael = async (text, mode = `chat`) => {
  let av = `Here are the available`

  try {
    if (mode === `cmd`) {
      App.ai_config.history = []
      let cmds = App.get_command_summary(text)

      if (cmds.length === 0) {
        return
      }

      let cmd_str = App.str(cmds)
      let msg = []

      if (cmd_str) {
        msg.push(`${av} commands: ${cmd_str}`)
      }

      let msg_s = msg.join(`\n\n`)
      App.ai_config.history.push({role: `user`, content: msg_s})
    }
    else if (mode === `ask`) {
      App.ai_config.history = []
      let cmds = App.get_command_summary(text)
      let sett = App.get_setting_summary(text)

      if ((cmds.length === 0) && (sett.length === 0)) {
        return
      }

      let msg = []

      if (cmds.length) {
        let str = App.str(cmds, true)

        if (str) {
          msg.push(`${av} commands:\n\n${str}`)
        }
      }

      if (sett.length) {
        let str = App.str(sett, true)

        if (str) {
          msg.push(`${av} settings:\n\n${str}`)
        }
      }

      let msg_s = msg.join(`\n\n`)
      console.log(msg_s)
      return
      App.ai_config.history.push({role: `user`, content: msg_s})
    }

    let res = await App.ask_ai(App.ai_config[`cael_system_${mode}`], text)
    res = res.trim()

    if ([`cmd`, `ask`].includes(mode)) {
      App.ai_config.history = []
    }

    if (!res) {
      App.alert(`Empty Response`)
      return
    }

    if (mode === `cmd`) {
      if (res === `idk`) {
        App.alert(`I decided to do nothing`)
        return
      }

      let obj

      try {
        obj = App.obj(res)
      }
      catch (err) {
        App.alert(`Invalid Format`)
        return
      }

      if (!App.is_array_of_strings(obj)) {
        App.alert(`Invalid Content`)
        return
      }

      let cmds = []

      for (let c of obj) {
        let cmd = App.get_command(c)

        if (!cmd) {
          App.alert(`Invalid Command`)
          return
        }

        cmds.push(cmd)
      }

      if (cmds.length === 0) {
        App.alert(`Nothing happened`)
      }

      App.log(`AI: Running command: ${cmd.cmd}`)
      App.run_command({cmd: cmd.cmd, from: `ai`})
    }
    else {
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
    return res || ""
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