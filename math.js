const input = process.argv.slice(2).join(' ')

const PARENED = /\(([^()]*)\)/

const TOKENS = /([0-9.]+|\*|\/|\+|-)/g

const ERROR_MESSAGE = 'Invalid Expression'

const wrapOperation = (operator) => {
  return (a, b) => {
    a = Number(a)
    b = Number(b)

    if (Number.isNaN(a) || Number.isNaN(b)) {
      throw new Error(ERROR_MESSAGE)
    }

    return operator(a, b)
  }
}

const operations = {
  '*': wrapOperation((a, b) => a * b),
  '/': wrapOperation((a, b) => a / b),
  '+': wrapOperation((a, b) => a + b),
  '-': wrapOperation((a, b) => a - b)
}

const evaluate = (expression) => {
  while (PARENED.test(expression)) {
    expression = expression.replace(PARENED, (result, match) => {
      return ' ' + evaluate(match) + ' '
    })
  }

  let tokens = expression.replace(TOKENS, (result, match) => {
    return ' ' + match + ' '
  })
  .split(/\s+/)
  .filter(token => token.trim() !== '')

  let result

  while (tokens.length) {
    let token = tokens.shift()
    let temp

    if (result != null && ['*', '/', '+', '-'].includes(token)) {
      temp = operations[token](result, tokens.shift())
    } else if (result == null) {
      if (['+', '-'].includes(token)) {
        temp = operations[token](0, tokens.shift())
      } else if (!Number.isNaN(Number(token))) {
        temp = Number(token)
      }
    }

    if (temp == null) {
      throw new Error(ERROR_MESSAGE)
    }

    result = temp
  }

  return result != null ? result : ''
}

console.log(evaluate(input))
