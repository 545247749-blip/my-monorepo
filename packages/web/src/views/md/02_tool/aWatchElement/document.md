```js
{{ code }}

const numbers = [1, 2, 3, 4, 5]
const doubled = numbers.map(function(n) {
  return n * 2
})

// 箭头函数
const doubledArrow = numbers.map(n => n * 2)

// 多行箭头函数
const users = users.map(user => {
  const fullName = `${user.firstName} ${user.lastName}`
  return {
    ...user,
    fullName
  }
})
```