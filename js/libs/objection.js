// Objection v1.0
const Objection = {}

Objection.parse = (str) => {
  let items = str.split(`;`).map(x => x.trim()).filter(x => x.length > 0)
  let obj = {}

  for (let item of items) {
    let [key, value] = item.split(`=`).map(x => x.trim())

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