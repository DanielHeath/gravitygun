
window.keyStates = {}
window.lastKeyPress = {}

function consumeKey(key) {
  if (keyStates[key]) {
    // Key is currently held down
    let duration = window.performance.now() - keyStates[key]
    // Reset to 'now'; the keypress time so far has been consumed.
    keyStates[key] = window.performance.now()
    return duration
  }
  if (lastKeyPress[key]) {
    let result = lastKeyPress[key]
    delete lastKeyPress[key]
    return result
  }
  return 0
}

keydown = (k) => {
  if (!keyStates[k.key]) {
    keyStates[k.key] = window.performance.now()
  }
}
keyup = (k) => {
  lastKeyPress[k.key] = (lastKeyPress[k.key] || 0) + window.performance.now() - keyStates[k.key]
  keyStates[k.key] = false
}
window.addEventListener('keydown', keydown)
window.addEventListener('keyup', keyup)
