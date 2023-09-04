// Objection v1.0
const Objection = {}

Objection.parse = (str) => {
  let obj = {}

  for (let item of Objection.split(str, `;`)) {
    let [key, value] = Objection.split(item, `=`)

    if (!key || !value) {
      continue
    }

    if (value === `true`) {
      value = true
    }
    else if (value === `false`) {
      value = false
    }
    else if (!isNaN(value)) {
      value = Number(value)
    }

    obj[key] = value
  }

  return obj
}

Objection.stringify = (obj) => {
  let items = []

  for (let key in obj) {
    items.push(`${key} = ${obj[key]}`)
  }

  let str = items.join(` ; `)
  return str
}

Objection.split = (str, char) => {
  return str.split(char).map(x => x.trim())
}