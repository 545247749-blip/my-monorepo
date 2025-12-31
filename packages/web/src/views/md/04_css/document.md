# 样式记录

### BFC
::: tip 
BFC 的核心特性
1. ✅ 创建独立的渲染区域
2. ✅ 阻止外边距折叠
3. ✅ 包含浮动元素
4. ✅ 防止被浮动元素覆盖
:::

| 类型     | 值        | 描述                                                                                  |
|--------|----------|-------------------------------------------------------------------------------------|
|        | html     | /* 本身就是 BFC */                                                                      |
|        | position | absolute                                                                            |
|        | overflow | hidden                                                                              |
|        | float    | left  // right both                                                                 |
|        | display  | inline-block、flex、inline-flex                                                       |
| 表格元素   | display  | table-cell;  /* 包括 table、table-row、table-row-group 等 */   <br/> table-caption;      |
| 网格布局   | display  | grid; inline-grid;                                                                  |
| 现代推荐方式 | display  | flow-root;  /* 专门用于创建 BFC，无副作用 */                                                   |
|        | contain  | layout;   /* 或 content、strict、paint */                                              |
| 多列容器   |          | column-count: 2;   /* 或 column-width */ <br/>column-span: all;  /* 元素本身会创建新的 BFC */ |
|        |          |                                                                                     |
