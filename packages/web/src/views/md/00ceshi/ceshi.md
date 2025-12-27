以下是Markdown文件的语法规则总结：

标题
使用#符号表示标题，数量表示级别（最多六级）：
markdown
Copy Code
# 一级标题
## 二级标题
### 三级标题
兼容语法（不推荐）：
markdown
Copy Code
一级标题
========

二级标题
--------
段落与换行
段落间空一行
换行：行尾加两个空格后回车或直接空行
字体样式
加粗：&zwnj;**加粗**&zwnj; 或 __加粗__
斜体：*倾斜* 或 _倾斜_
删除线：~~删除线~~
列表
无序列表：*、+、- 后加空格
有序列表：数字加点后加空格
嵌套列表：缩进一个或多个列表项
引用
使用 > 表示引用，嵌套用 >>、>>> 等
代码
行内代码：用反引号包裹（`代码`）
代码块：三个反引号包裹，可指定语言（如 python）
markdown
Copy Code
```python
print("Hello, World!")
text
Copy Code
超链接
基本格式：[链接文本](URL "悬停文本")
内联格式：<URL>
图片
基本格式：![替代文本](图片URL "悬停文本")
嵌入链接：[图片标题]: URL "悬停文本"
表格
使用 | 分隔单元格，- 分隔表头
对齐方式：:-- 左对齐，--: 右对齐，:---: 居中
markdown
Copy Code
| 列1 | 列2 |
| --- | --- |
| 数据1 | 数据2 |
其他
水平线：三个或更多 -、*、_ 水平排列
HTML 标签：直接嵌入（如 <div>），需注意兼容性
注意：标题级别不可跳跃（如从一级跳到三级），代码块需前后空行。
```

```javascript
// 传统函数
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