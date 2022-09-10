// Get list of open tabs
App.get_tabs = async function () {
  let items = await browser.tabs.query({ currentWindow: true })
  items.sort((a, b) => (a.lastAccessed < b.lastAccessed) ? 1 : -1)
  return items
}