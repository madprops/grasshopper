App.create_debouncer = (func, delay) => {
  if (typeof func !== `function`) {
    App.log(`Invalid debouncer function`, `error`)
    return
  }

  if (!delay) {
    App.log(`Invalid debouncer delay`, `error`)
    return
  }

  let timer
  let obj = {}

  function clear () {
    clearTimeout(timer)
  }

  function run (...args) {
    func(...args)
  }

  obj.call = (...args) => {
    clear()

    timer = setTimeout(() => {
      run(...args)
    }, delay)
  }

  obj.now = (...args) => {
    clear()
    run(...args)
  }

  obj.cancel = () => {
    clear()
  }

  return obj
}

App.remove_protocol = (url) => {
  return url.replace(/^https?:\/\//, ``)
}

App.copy_to_clipboard = (text, what = `Text`) => {
  navigator.clipboard.writeText(text)
  App.show_feedback(`${what} copied to clipboard`)
}

App.plural = (n, singular, plural) => {
  if (n === 1) {
    return singular
  }
  else {
    return plural
  }
}

App.get_hostname = (url) => {
  let url_obj

  try {
    url_obj = new URL(url)
  }
  catch (err) {
    return ``
  }

  return url_obj.hostname
}

App.urls_equal = (u1, u2) => {
  return App.remove_slashes_end(u1) === App.remove_slashes_end(u2)
}

App.remove_slashes_end = (s) => {
  return s.replace(/\/+$/g, ``)
}

App.remove_hash = (url) => {
  return url.split(`#`)[0]
}

App.format_url = (url) => {
  return App.remove_slashes_end(App.remove_hash(url))
}

App.capitalize = (s) => {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

App.capitalize_all = (s) => {
  let words = s.split(` `)

  let capitalized = words.map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1)
  })

  return capitalized.join(` `)
}

App.nice_date = (date = Date.now()) => {
  return dateFormat(date, `dd/mmm/yy | h:MM tt`)
}

App.is_url = (s) => {
  return s.startsWith(`http://`) || s.startsWith(`https://`)
}

App.get_extension = (s) => {
  if (App.is_url(s)) {
    let u = new URL(s)
    let url = u.origin + u.pathname
    let url_2 = url.split(`//`).slice(1).join(`//`)
    let matches = url_2.match(/\/.*\.(\w+)(?=$|[#?])/)

    if (matches) {
      return matches[1]
    }
  }
  else {
    let matches = s.match(/\.(\w+)(?=$|[#?])/)

    if (matches) {
      return matches[1]
    }
  }

  return ``
}

App.get_template = (id) => {
  let template = DOM.el(`#template_${id}`)

  if (template) {
    return template.innerHTML.trim()
  }
}

App.log = (message, mode = `normal`) => {
  if (mode === `error`) {
    console.error(`🔴 ${message}`)
  }
  else if (mode === `normal`) {
    console.info(`🟢 ${message}`)
  }
  else {
    console.info(message)
  }
}

App.find_duplicates = (objects, property) => {
  let frequency_map = objects.reduce((map, obj) => {
    map[obj[property]] = (map[obj[property]] || 0) + 1
    return map
  }, {})

  return objects.filter(obj => frequency_map[obj[property]] > 1)
}

App.get_excess = (objects, property) => {
  let items = {}
  let excess = []

  for (let obj of objects) {
    if (items[obj[property]]) {
      excess.push(obj)
    }
    else {
      items[obj[property]] = obj
    }
  }

  return excess
}

App.element_is_visible = (el) => {
  let container_rect = el.parentElement.getBoundingClientRect()
  let rect = el.getBoundingClientRect()
  let top_visible = rect.top >= container_rect.top - 2
  let bottom_visible = rect.bottom <= container_rect.bottom + 2
  return top_visible && bottom_visible
}

App.text_with_value_focused = () => {
  let el = document.activeElement

  if (el.classList.contains(`text`)) {
    if (el.value.trim()) {
      return true
    }
  }

  return false
}

App.restart_extension = () => {
  browser.runtime.reload()
}

App.only_chars = (s) => {
  return s.replace(/[^\w]/g, ``)
}

App.no_space = (s) => {
  return s.replace(/\s+/g, ``)
}

App.single_space = (s) => {
  return s.replace(/\s+/g, ` `)
}

App.wheel_direction = (e) => {
  if (e.deltaY > 0) {
    return `down`
  }
  else {
    return `up`
  }
}

App.one_linebreak = (s) => {
  return s.replace(/(\n\s*){2,}/g, `\n`).replace(/ +/g, ` `).trim()
}

App.single_linebreak = (s) => {
  return s.replace(/(\n\s*){2,}/g, `\n\n`).replace(/ +/g, ` `).trim()
}

App.double_linebreak = (s) => {
  return s.replace(/(\n\s*){3,}/g, `\n\n`).replace(/ +/g, ` `).trim()
}

App.contains_number = (str) => {
  return /\d/.test(str)
}

App.escape_regex = (s) => {
  return s.replace(/[^A-Za-z0-9|]/g, `\\$&`)
}

App.get_favicon_url = (url) => {
  return `https://www.google.com/s2/favicons?sz=${App.favicon_size}&domain=${url}`
}

App.print_intro = () => {
  let d = Date.now()
  let s = String.raw`
//_____ __
@ )====// .\___
\#\_\__(_/_\\_/
  / /       \\

Starting ${App.manifest.name} v${App.manifest.version}
${App.nice_date(d)} | ${d}
`

  App.log(s, `raw`)
}

App.check_force = (warn_setting, num) => {
  if (num >= App.max_warn_limit) {
    return false
  }

  if (warn_setting) {
    return !App.get_setting(warn_setting)
  }

  return true
}

App.text_with_empty_lines = () => {
  if (document.activeElement.tagName === `TEXTAREA`) {
    return /\s*\n{1,}$/.test(document.activeElement.value)
  }

  return true
}

App.make_html_safe = (s) => {
  return s.replace(/\</g, `&lt;`).replace(/\>/g, `&gt;`)
}

App.is_object = (o) => {
  if (typeof o === `object` && !Array.isArray(o) && o !== null) {
    return true
  }

  return false
}

App.is_array = (a) => {
  return Array.isArray(a)
}

App.get_icontext = (s) => {
  let it = App.icontext[s]
  return `${it.icon} ${it.name}`
}

App.shuffle_array = (array) => {
  for (let i=array.length-1; i>0; i--) {
    let j = Math.floor(Math.random() * (i + 1))
    let temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
}

App.get_seed = (str) => {
  let h1 = 1779033703, h2 = 3144134277,
  h3 = 1013904242, h4 = 2773480762

  for (let i=0, k; i<str.length; i++) {
    k = str.charCodeAt(i)
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067)
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233)
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213)
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179)
  }

  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067)
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233)
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213)
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179)
  h1 ^= (h2 ^ h3 ^ h4), h2 ^= h1, h3 ^= h1, h4 ^= h1
  return [h1 >>> 0, h2 >>> 0, h3 >>> 0, h4 >>> 0]
}

App.seeded_random = (str) => {
  let num = App.get_seed(str)[0]

  return function () {
    let t = num += 0x6D2B79F5
    t = Math.imul(t ^ t >>> 15, t | 1)
    t ^= t + Math.imul(t ^ t >>> 7, t | 61)
    return ((t ^ t >>> 14) >>> 0) / 4294967296
  }
}

App.random_int = (min, max, exclude = undefined, random_function) => {
  let num

  if (random_function) {
    num = Math.floor(random_function() * (max - min + 1) + min)
  }
  else {
    num = Math.floor(Math.random() * (max - min + 1) + min)
  }

  if (exclude) {
    if (num === exclude) {
      if (num + 1 <= max) {
        num = num + 1
      }
      else if (num - 1 >= min) {
        num = num - 1
      }
    }
  }

  return num
}

App.random_choice = (list, rand) => {
  return list[App.random_int(0, list.length - 1, undefined, rand)]
}

App.parse_delay = (s) => {
  let delay
  let split = s.split(`_`)

  if (split[1] === `seconds`) {
    delay = split[0] * 1000
  }
  else if (split[1] === `minutes`) {
    delay = split[0] * 1000 * 60
  }
  else if (split[1] === `hours`) {
    delay = split[0] * 1000 * 60 * 60
  }

  return delay
}

App.scroll_to_bottom = (el) => {
  el.scrollTop = el.scrollHeight
}

App.similarity = (s1, s2) => {
  let longer = s1
  let shorter = s2

  if (s1.length < s2.length) {
    longer = s2
    shorter = s1
  }

  let longer_length = longer.length

  if (longer_length == 0) {
    return 1.0
  }

  return (longer_length - App.similarity_distance(longer, shorter)) / parseFloat(longer_length)
}

App.similarity_distance = (s1, s2) => {
  s1 = s1.toLowerCase()
  s2 = s2.toLowerCase()

  let costs = new Array()

  for (let i=0; i<=s1.length; i++) {
    let last_value = i

    for (let j = 0; j <= s2.length; j++) {
      if (i == 0) {
        costs[j] = j
      }
      else {
        if (j > 0) {
          let new_value = costs[j - 1]

          if (s1.charAt(i - 1) != s2.charAt(j - 1)) {
            new_value = Math.min(Math.min(new_value, last_value),
              costs[j]) + 1
          }

          costs[j - 1] = last_value
          last_value = new_value
        }
      }
    }

    if (i > 0) {
      costs[s2.length] = last_value
    }
  }

  return costs[s2.length]
}