function parse (obj) {
  let value
  try {
    value = JSON.parse(obj)
  } catch {
    value = null
  }
  return value
}

function stringify (val) {
  let value
  try {
    value = JSON.stringify(val)
  } catch {
    value = null
  }
  return value
}
export default function useLocalStorage () {
  function getItem (key) {
    let value =  window.localStorage.getItem(key)
    if (value) {
      return parse(value)
    }
    return null
  }
  function setItem (key, value) {
    value = stringify(value)
    window.localStorage.setItem(key, value)
  }

  function removeItem (key) {
    window.localStorage.removeItem(key)
  }

  function clear () {
    window.localStorage.clear()
  }

  return {
    getItem,
    setItem,
    removeItem,
    clear
  }
}