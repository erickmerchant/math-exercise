const IS_PARENED = /\([^()]*\)/
const PARENED = /\(([^()]*)\)/
const TOKENS = /([0-9.]+|\*|\/|\+|-)/ // @TODO include all numbers
let input = process.argv.slice(2).join(' ')

console.log(evaluate(input))

function evaluate (expression) {
  while (IS_PARENED.test(expression)) {
    expression = expression.replace(PARENED, function (result, match) {
      return evaluate(match)
    })
  }

  if (expression.trim() === '') {
    return ' '
  }

  let tokens = expression.replace(TOKENS, function (result, match) {
    return ' ' + match + ' '
  })
    .split(/\s+/)
    .filter(token => token.trim() !== '')
  let result

  do {
    let token = tokens.shift()

    if (result != null) {
      switch (true) {
        case token === '*' && isNumber(tokens[0]):
          result *= Number(tokens.shift())
          break

        case token === '/' && isNumber(tokens[0]):
          result /= Number(tokens.shift())
          break

        case token === '+' && isNumber(tokens[0]):
          result += Number(tokens.shift())
          break

        case token === '-' && isNumber(tokens[0]):
          result -= Number(tokens.shift())
          break

        default:
          throw new Error('Malformed Expression')
      }
    } else {
      switch (true) {
        case token === '+' && isNumber(tokens[0]):
          result = Number(tokens.shift())
          break

        case token === '-' && isNumber(tokens[0]):
          result = 0 - Number(tokens.shift())
          break

        case isNumber(token):
          result = Number(token)
          break

        default:
          throw new Error('malformed expression')
      }
    }
  }
  while (tokens.length)

  return result
}

function isNumber (val) {
  return Number(val) === Number(val)
}
