/**
 * 格式验证工具类
 */

// 链接验证
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

// 用户名格式验证
export function validateUsername(rule, value, callback) {
  const userReg = /^([a-zA-Z0-9_-])/
  if (value.length < 5) {
    return callback(new Error('用户名不能少于5位'))
  }
  if (userReg.test(value)) {
    callback()
  } else {
    callback(new Error('用户名不合法'))
  }
}
// 密码格式验证
export function validatePassword(rule, value, callback) {
  if (value.length < 6) {
    callback(new Error('密码不能少于6位'))
  } else {
    callback()
  }
}

// 验证邮箱格式
export function validateEmail(rule, value, callback) {
  const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
  if (!value) {
    return callback(new Error('邮箱不能为空'))
  }
  setTimeout(() => {
    if (mailReg.test(value)) {
      callback()
    } else {
      callback(new Error('请输入正确的邮箱格式'))
    }
  }, 100)
}
