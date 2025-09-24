let resize_timeout

window.addEventListener(`resize`, () => {
  clearTimeout(resize_timeout)

  resize_timeout = setTimeout(() => {
    browser.runtime.sendMessage({action: `fullscreen_change`})
  }, 500)
})