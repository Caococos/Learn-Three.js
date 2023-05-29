export function throttle(func, delay) {
  let flag = true
  return function (args) {
    if (flag) {
      flag = false
      func.call(this, ...arguments)
      let clear = setTimeout(() => {
        flag = true
        clearTimeout(clear)
      }, delay)
    }
  }
}

const MAX_ATTACK_RANGE = 0
const INIT_ATTACK_RANGE = -100
const BULLET_COUNT = 1
const BULLET_SPEED = 0.28

export { MAX_ATTACK_RANGE, INIT_ATTACK_RANGE, BULLET_COUNT,BULLET_SPEED }