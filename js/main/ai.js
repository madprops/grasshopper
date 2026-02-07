App.ask_ai = async (prompt) => {
  try {
    // 1. Check if the capability exists
    if (!browser.ml) {
      throw new Error(`Firefox ML API not available. Check about:config flags.`)
    }

    // 2. Create the engine (This triggers the download if not cached)
    // 'text-generation' is the task for chat-like interactions.
    console.log(`Initializing Local Engine...`)

    let engine = await browser.trial.ml.createEngine({
      modelHub: `mozilla`,       // The trusted source
      taskName: `text-generation`,
    })

    // Optional: Listen for download progress if it's the first run
    browser.trial.ml.onProgress.addListener((progress) => {
      console.log(`Downloading Model: ${progress.file} - ${progress.percent}%`)
    })

    // 3. Run the inference
    console.log(`Running prompt: ${user_prompt}`)

    let result = await engine.run({
      args: [user_prompt],
      // Options specific to text-generation
      options: {
        max_new_tokens: 100,
        temperature: 0.7
      }
    })

    // 4. Return the generated text
    // The result is usually an array of objects: [{ generated_text: "..." }]
    return result[0].generated_text

  } catch (err) {
    console.error(`Local AI Failed:`, err)
    return null
  }
}

App.test_ai = () => {
  App.ask_ai(`how are you?`)
}