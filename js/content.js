if (!_grasshopper_boosted_) {
  let resize_timeout

  window.addEventListener(`resize`, () => {
    clearTimeout(resize_timeout)

    resize_timeout = setTimeout(() => {
      browser.runtime.sendMessage({action: `fullscreen_change`})
    }, 500)
  })

  _grasshopper_boosted_ = true
  console.info(`🟢 Grasshopper: Content Script Loaded`)
}