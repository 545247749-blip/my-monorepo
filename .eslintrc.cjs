/*
* introduce: 基于重要的lint然后自定义lint，包含全部的eslint-plugin-vue(vue.js2版本)，和常用的部分的eslint
* version: 1.0.0
* author: chenxiang24
* rules URL：--eslint中文地址 http://eslint.cn/docs/rules/ ----eslint-plugin-vue英文地址 https://eslint.vuejs.org/rules/
* 使用此lint，修改一些以便更好兼容
* 一、修改文件、router.config.js文件的component后改成() => import('@/pages/Error'), 同时调用的文件router/index.js 中的component后改成 component,
* 二、安装"@vue/cli-plugin-eslint"，同时 "lint2": "vue-cli-service lint"；升级"eslint": "^6.8.0", 升级"eslint-plugin-vue": "^8.1.1",
* 三、最后 npm run lint2 ;; 然后重启 IDE
* 四、修改IDE配置：取消IDE编译器自带的美化代码功能，勾选 保存时eslint --fix 功能
*/
module.exports = {
  root: true,
  env: { browser: true, node: true, es6: true },
  parserOptions: { ecmaVersion: 'latest' },
  extends: ['plugin:vue/vue3-essential'],
  plugins: ['vue'],

  rules: {
    /* Priority A: Essential (No--fix)  */
    'vue/multi-word-component-names': [0, {} ], // 1、要求组件名总是多词的, 即vue名字name的驼峰，此处不强制;
    'vue/no-arrow-functions-in-watch': 0, // 2、是否禁止使用箭头函数定义，此处不强制;
    'vue/no-async-in-computed-properties': 2, // 3、防止在计算属性和函数中调用异步方法，你不能在计算属性中用异步;
    'vue/no-computed-properties-in-data': 2, // 4、禁止在data()中访问计算属性;
    'vue/no-dupe-keys': 2, // 5、禁止重复的属性(函数)名称;
    'vue/no-dupe-v-else-if': 0, // 6、禁止在同一个v-if / v-else-if链中出现重复的条件;
    'vue/no-duplicate-attributes': 0, // 7、html里禁止重复的属性(style :style);
    'vue/no-mutating-props': 0, // 8、------
    'vue/no-parsing-error': 2, // 9、解析语法错误;
    'vue/no-reserved-keys': 2, // 10、禁用键用保留名字;
    'vue/no-reserved-props': 2, // 11、禁止在props中用保留名字;
    'vue/no-shared-component-data': 2, // 12、data()里的值禁止相同，包括expend组件里的data;  (yes--fix)
    'vue/no-side-effects-in-computed-properties': 0, // 13、防止代码对计算属性和函数产生副作用;
    'vue/no-template-key': 2, // 14、<template>里禁用key;
    'vue/no-textarea-mustache': 2, // 15、<textarea>里禁用{{}}, 要用v-model;
    'vue/no-unused-components': 1, // 16、报告模板中未使用的组件
    'vue/no-unused-vars': 1, // 17、报告v-for指令或范围属性的没使用的变量定义
    'vue/no-use-v-if-with-v-for': 2, // 18、同一个html标签禁止v-for与v-if一起使用
    'vue/no-useless-template-attributes': 2, // 19、该规则防止<template>标签里使用没有的属性。
    'vue/require-component-is': 2, // 20、<component>必须有 :is= 属性表明是哪个组件。
    'vue/require-prop-type-constructor': 2, // 21、props里不能假定为构造函数的的值类型  (yes--fix)
    'vue/require-render-return': 1, // 22、强制函数始终有返回数值
    'vue/require-v-for-key': 2, // 23、v-for后强制添加key
    'vue/require-valid-default-prop': 2, // 24、检测props里的type和default类型是否一致
    'vue/return-in-computed-property': 1, // 25、强制在计算属性和函数中出现return语句
    'vue/use-v-on-exact': 0, // 26、强制在v-on上使用exact修饰符
    'vue/valid-next-tick': 2, // 27、报告=>$nextTick没有传递回调函数，也没有等待返回的Promise，很可能是一个错误 (yes--fix)
    'vue/valid-template-root': 0, // 28、<template></template> 在一行或者里面没内容报错
    'vue/valid-v-cloak': 2, // 29、v-cloak 后面不可有 '.' ':' '='  否则报错
    'vue/valid-v-else-if': 2, // 30、v-else-if 的一类的错误提示
    'vue/valid-v-else': 2, // 31、v-else 的一类的错误提示
    'vue/valid-v-for': 2, // 32、v-for 的一类的错误提示
    'vue/valid-v-html': 2, // 33、v-html 的一类的错误提示
    'vue/valid-v-if': 2, // 34、v-if 的一类的错误提示
    'vue/valid-v-model': 2, // 35、v-model 的一类的错误提示
    'vue/valid-v-on': 2, // 36、v-on 的一类的错误提示
    'vue/valid-v-once': 2, // 37、v-once 的一类的错误提示
    'vue/valid-v-pre': 2, // 38、v-pre 的一类的错误提示
    'vue/valid-v-show': 2, // 39、v-show 的一类的错误提示
    'vue/valid-v-slot': 2, // 40、v-slot 的一类的错误提示
    'vue/valid-v-text': 2, // 41、v-text 的一类的错误提示

    /* Priority A: Essential for Vue.js 2.x --- 与以上相似性太多, 略过 */

    /* Priority B: Strongly Recommended  (html) (yes--fix) */
    'vue/attribute-hyphenation': [0, 'always'], // 42、强制在Vue模板中的自定义组件上使用连字符属性名
    'vue/component-definition-name-casing': [0, 'always'], // 43、组件名驼峰与否
    'vue/first-attribute-linebreak': [2, { // 44、强制第一个属性的位置保持一致
      singleline: 'beside',
      multiline: 'beside',
    } ],
    'vue/html-closing-bracket-newline': [2, { // 45、闭合标签右尖括号不进行换行
      singleline: 'never',
      multiline: 'never',
    } ],
    'vue/html-closing-bracket-spacing': [2, { // 46、闭合标签右尖括号是否有空格
      startTag: 'never',
      endTag: 'never',
      selfClosingTag: 'always',
    } ],
    'vue/html-end-tags': 2, // 47、无闭合的标签报错
    'vue/html-indent': [2, 2, { // 48、html标签的缩进，此处设置为 2
      attribute: 1,
      baseIndent: 1,
      closeBracket: 0,
      alignAttributesVertically: true, // 标签第一个属性对齐 与 ~44 相似
      ignores: [],
    } ],
    'vue/html-quotes': [2, 'double'], // 49、设置属性值为双引号
    'vue/html-self-closing': [1, { // 50、自标签闭合设置，若标签里无内容自闭合
      html: {
        void: 'always',
        normal: 'never',
        component: 'always',
      },
      svg: 'always',
      math: 'always',
    } ],
    'vue/max-attributes-per-line': [0, { // 51、属性超数换行
      singleline: { max: 4 },
      multiline: { max: 4 },
    } ],
    'vue/multiline-html-element-content-newline': 0, // 52、该规则强制在多行元素的内容之前和之后进行换行。
    'vue/mustache-interpolation-spacing': [2, 'always'], // 53、设置为 {{}} 大括号表达式里有加空格
    'vue/no-multi-spaces': 0, // 54、html里的对象里是否冒号对齐
    'vue/no-spaces-around-equal-signs-in-attribute': 2, // 55、设置为html里等号两边不能有空格
    'vue/no-template-shadow': 0, // 56、v-for 的item是否明亮
    'vue/one-component-per-file': 0, // 57、检查每个文件是否只有一个组件
    'vue/prop-name-casing': [0, 'camelCase' | 'snake_case'], // 58、props的传值格式
    'vue/require-default-prop': 0, // 59、props收到的值是否要求设置默认值
    'vue/require-prop-types': 0, // 60、props 收到的值是否强制指明类型
    'vue/singleline-html-element-content-newline': 0, // 61、该规则强制在单行元素的内容前后使用换行符
    'vue/v-bind-style': [2, 'shorthand'], // 62、强制v-bind指令风格，你应该使用简写形式。
    'vue/v-on-style': [2, 'shorthand'], // 63、强制使用v-on指令风格，你应该使用简写格式。
    'vue/v-slot-style': 0, // 64、v-slot 不做简写要求

    /* Priority C: Recommended */
    'vue/attributes-order': 2, // 65、强制组件属性的排序: (yes--fix) /is/v-for/v-if/v-once/id/('ref', 'key')/slot/v-model/其他/v-bind:/@click/v-text
    'vue/component-tags-order': [2, { order: ['template', 'script', 'style'] } ], // 66、标签顺序警告 (no--fix)
    'vue/no-lone-template': 2, // 67、消除多余的或者没用的 <template> (no--fix)
    'vue/no-multiple-slot-args': 0, // 68、禁止向限定范围的槽传递多个参数 (no--fix)
    'vue/no-v-html': 0, // 69、使用{{ }} 而不是v-html  (no--fix)
    'vue/order-in-components': 2, // 70、确保你在组件中保持声明的属性顺序  (yes--fix)
    'vue/this-in-template': 1, // 71、规定<template>里不能有this，模板内置函数不要用()=>{}, 直接写函数即可，收到的参用$event表示, 多个参用arguments取  (yes--fix)

    /* Uncategorized, 未分类的 */
    'vue/block-lang': 0, // 72、禁止在块元素的lang属性中使用应用程序中可用的语言以外的其他语言  (no--fix)
    'vue/block-tag-newline': 2, // 73、强制在开始块标记之后和结束块标记之前使用换行  (yes--fix)
    'vue/component-api-style': 0, // 74、该规则旨在使用于定义Vue组件的API样式在项目中保持一致  (no--fix)
    'vue/component-name-in-template-casing': 2, // 75、该规则的目的是警告Vue.js模板中配置的大小写之外的标签名。  (yes--fix)
    'vue/custom-event-name-casing': 0, // 76、目的是警告自定义事件名称，是驼峰还是 - 连接  (no--fix)
    'vue/html-button-has-type': 0, // 76、button不要求要有type  (no--fix)
    'vue/html-comment-content-newline': 0, // 77、注释里的换行符保持一致  (yes--fix)
    'vue/html-comment-content-spacing': [2, 'always'], // 78、<!-- --> 里是否要求有空格  (yes--fix)
    'vue/html-comment-indent': 0, // 79、<!-- --> 内容的缩进  (yes--fix)
    'vue/match-component-file-name': [0, { extensions: ['vue'], shouldMatchCase: true } ], // 80、要求组件名称属性匹配它的文件名  (no--fix)
    'vue/new-line-between-multi-line-property': 0, // 81、props里的值多行值进行换行  (yes--fix)
    'vue/next-tick-style': [2, 'callback'], // 82、$nextTick()的回调样式为内置回调  (yes--fix)
    'vue/no-bare-strings-in-template': 0, // 83、国际化可以使用(也没必要)  (no--fix)
    'vue/no-boolean-default': 0, // 84、该规则阻止布尔props拥有默认值  (yes--fix)
    'vue/no-child-content': 0, // 85、使用了v-html或者v-text，所在标签不可再有值  (no--fix)
    'vue/no-duplicate-attr-inheritance': 0, // 86、防止重复的属性继承  (no--fix)
    'vue/no-empty-component-block': 0, // 87、<template> <script> <style> 块里可为空   (no--fix)
    'vue/no-expose-after-await': 0, // 88、----   (no--fix)
    'vue/no-invalid-model-keys': 2, // 89、该规则旨在防止medel选项中的无效键   (no--fix)
    'vue/no-multiple-objects-in-class': 2, // 90、该规则禁止将多个对象传入数组到类中   (no--fix)
    'vue/no-potential-component-option-typo': 1, // 91、该规则禁止在组件选项中出现潜在的拼写错误   (no--fix)
    'vue/no-reserved-component-names': 2, // 92、该规则防止Vue组件与标准HTML元素和内置组件之间的名称冲突   (no--fix)
    'vue/no-restricted-block': 0, // 93、指定不想使用的块名称   (no--fix)
    'vue/no-restricted-call-after-await': 0, // 94、(自行判断调用函数应该在await之前还是之后)   (no--fix)
    'vue/no-restricted-class': 0, // 95、该规则允许您指定模板中不允许的类列表  (no--fix)
    'vue/no-restricted-component-options': 0, // 96、该规则允许您指定不希望在应用程序中使用的组件选项  (no--fix)
    'vue/no-restricted-custom-event': 0, // 97、该规则允许您指定不想在应用程序中使用的自定义事件  (no--fix)
    'vue/no-restricted-props': 0, // 98、props不允许出现的键值  (no--fix)
    'vue/no-restricted-static-attribute': 0, // 99、该规则允许您指定不希望在应用程序中使用的属性名称  (no--fix)
    'vue/no-restricted-v-bind': 0, // 100、该规则允许您指定不希望在应用程序中使用的v-bind参数名称。  (no--fix)
    'vue/no-static-inline-styles': 0, // 101、内联样式  (no--fix)
    'vue/no-template-target-blank': 0, // 102、判断链接标签有没有 target="_blank"  (no--fix)
    'vue/no-this-in-before-route-enter': 0, // 103、又是什么鬼  (no--fix)
    'vue/no-undef-properties': 0, // 104、使用未定义的属性提醒。 后端传来的属性也会报错，不使用。  (no--fix)
    'vue/no-unregistered-components': 0, // 105、该规则报告尚未注册和正在模板中使用的组件  (no--fix)
    'vue/no-unsupported-features': 1, // 106、该规则报告指定版本中不支持的Vue.js语法  (yes--fix)
    'vue/no-unused-properties': 1, // 107、该规则报告未使用的属性  (no--fix)
    'vue/no-unused-refs': 1, // 108、该规则报告未使用的ref属性  (no--fix)
    'vue/no-use-computed-property-like-method': 1, // 109、该规则禁止使用类似method的计算属性  (no--fix)
    'vue/no-useless-mustaches': 1, // 110、字符串 不使用没必要的{{ }}  (yes--fix)
    'vue/no-useless-v-bind': 2, // 111、字符串字面值的v-bind可以更改为静态属性定义  (yes--fix)
    'vue/no-v-text': 0, // 112、不使用v-text，可以用{{ }}代替  (no--fix)
    'vue/padding-line-between-blocks': 0, // 113、该规则要求或禁止在给定的两个块之间有空行。适当的空行有助于开发人员理解代码  (yes--fix)
    'vue/require-direct-export': 0, // 114、该规则的目的是要求直接导出组件对象  (no--fix)
    'vue/require-emit-validator': 0, // 115、该规则强制发出语句包含类型定义  (no--fix)
    'vue/require-expose': 0, // 116、vueJS 3.2的属性  (no--fix)
    'vue/require-name-property': 1, // 117、该规则要求在组件上设置name属性。  (no--fix)
    'vue/script-indent': 0, // 118、<script>里的缩进-- 使用 indent 就可以  (yes--fix)
    'vue/sort-keys': 0, // 119、键排序(不需要)  (no--fix)
    'vue/static-class-names-order': 0, // 120、类名排序(不需要)  (no--fix)
    'vue/v-for-delimiter-style': 0, // 121、该规则强制在v-for指令中使用哪个分隔符(in或of)；基础认知(不需要)  (yes--fix)
    'vue/v-on-function-call': [2, 'never'], // 122、:click="closeModal(),要求函数后有括号,事件值用($event)传递,更好的区分变量与函数(yes--fix(never)) (no--fix(always))


    /* Extension Rules (yes--fix) (eslint 主观 style) */
    'array-bracket-newline': [2, 'consistent'], // b1、数组括号禁止换行
    'array-bracket-spacing': [2, 'never', { // b2、数组括号里要求没有空格
      singleValue: false, // 要求在只包含一个元素的数组的括号内使用一个或多个空格、或折行
      objectsInArrays: true, // 要求在数组的方括号和数组内的对象元素的大括号之间，即[ { 或 } ]，使用一个或多个空格、或折行
      arraysInArrays: true, // 要求在数组的方括号和数组内的数组元素的方括号之间，即[ [ 或 ] ]，使用一个或多个空格、或折行
    } ],
    'array-element-newline': [0, 'consistent'], // b3、数组内容换行,要视情况而定;使用此方法  /*eslint array-element-newline: [2, "always"]*/
    'arrow-spacing': [2, { before: true, after: true } ], // b4、箭头函数的箭头前后是否空格
    'block-spacing': [2, 'always'], // b5、块体内的空格
    'brace-style': [2, 'stroustrup', { // b6、函数后的大括号换行风格
      allowSingleLine: true, // 允许块的开括号和闭括号在 同一行
    } ],
    'camelcase': 0, // b7、对属性名称强制使用驼峰风格  (no-fix)
    'comma-dangle': [2, 'always-multiline'], // b8、设置为当最后一个元素或属性与闭括号 ] 或 } 在 不同的行时，要求使用拖尾逗号；当在 同一行时，禁止使用拖尾逗号。
    'comma-spacing': [2, { before: false, after: true } ], // b9、逗号前没空格，后有空格
    'comma-style': [2, 'last'], // b10、逗号放在后面
    'dot-location': [2, 'property'], // b11、要求点操作符和属性放在同一行
    'dot-notation': 2, // b12、使用点号操作符来提高代码可读性(如foo.bar)。因此，当遇到不必要的方括号时，该规则将发出警告
    'eqeqeq': [2, 'always'], // b13、强制在任何情况下都使用 === 和 !==
    'computed-property-spacing': [2, 'never'], // b14、对象数组计算禁止用空格(如obj[foo[ bar ]])
    'eol-last': [2, 'always'], // b15、文件最后一行有空格
    'func-call-spacing': [2, 'never'], // b16、调用函数与小括号之间的空格
    'function-paren-newline': [0, 'multiline'], // b17、函数里小括号里的参数能否换行
    'implicit-arrow-linebreak': [2, 'beside'], // b18、(默认) 禁止在箭头函数体之前出现换行
    'indent': [2, 2, { // b19、强制使用一致的缩进
      FunctionExpression: { parameters: 'first' }, // 声明函数参数缩进
      CallExpression: { arguments: 'first' }, // 调用的函数参数
      ArrayExpression: 'first', // 数组里元素对齐
      ObjectExpression: 'first', // 对象里元素对齐
      ImportDeclaration: 'first', // 引用参数对齐
      flatTernaryExpressions: false, // 三元表达式
      SwitchCase: 1,
    } ],
    'key-spacing': [2, { beforeColon: false, afterColon: true } ], // b20、对象中冒号前后的空格
    'keyword-spacing': [2, { before: true, after: true } ], // b21、关键字前后的空格
    'vue/max-len': 0, // b22、代码长度不做要求  (no--fix)
    'multiline-comment-style': [0, 'bare-block'], // b23、多行注释的风格
    'no-constant-condition': 2, // b24、禁止在以下语句的条件中出现常量表达式 if、for、while 或 do...while 语句， ?: 三元表达式  (no--fix)
    'no-empty-pattern': 2, // b25、禁止使用空解构模式  (no--fix)
    'no-extra-parens': 0, // b26、禁止冗余的括号，此处不强制，有时候需要小括号进行划清范围
    'vue/no-irregular-whitespace': 0, // b27、不知道是什么鬼  (no--fix)
    // 'no-loss-of-precision': 2,  // b27、判断变量能否存储足够容量的number(如 const x = 9007199254740993(error))  (no--fix) (eslint 7.1 以上)
    'vue/no-restricted-syntax': 2, // b28、判断{{  }} 里的表达式是否合法  (no--fix)
    'no-sparse-arrays': 2, // b29、禁止稀疏数组(如[2,,3])  (no--fix)
    'no-useless-concat': 2, // b30、多余的 + 进行的字符串合并  (no--fix)
    'newline-per-chained-call': [0, { ignoreChainWithDepth: 5 } ], // b31、函数的方法链是否换行
    'nonblock-statement-body-position': [2, 'beside'], // b32、单行语句位置
    'object-curly-newline': [2, { consistent: true } ], // b33、（默认）对象的大括号内换行法则
    'object-curly-spacing': [2, 'always'], // b34、对象大括号内的的空格
    'object-property-newline': [2, { allowAllPropertiesOnSameLine: true } ], // b35、对象里key属性换行规则，不换则已，一换全换。
    'operator-linebreak': [0, 'before'], // b36、运算符换行风格
    'prefer-template': 0, // b37、使用模板而非字符串连接  (如`Hello, ${name}!`)
    'padded-blocks': [2, 'never'], // b38、规定函数块两边不能存在空行
    'padding-line-between-statements': 0, // b39、禁止语句间存在空行，此处不要求。
    'quote-props': [2, 'consistent-as-needed'], // b40、对象的key,如果有属性名称要求使用引号，则所有的属性名称都要使用引号；否则，禁止所有的属性名称使用引号
    'quotes': [2, 'single', { allowTemplateLiterals: true } ], // b41、JS里字符串必须由单引号(或者反钩号)括起来而不是双引号
    'semi': [2, 'never'], // b42、改成代码结尾不再加分号，加了分号报错，不加分号不报错
    'semi-spacing': [0, { before: false, after: true } ], // b43、强制分号前后空格设置
    'semi-style': [2, 'last'], // b44、强制分号位置
    'space-before-blocks': [2, 'always'], // b45、强制块之前的空格的一致性。它只在非行首的块上起作用。
    'space-before-function-paren': [2, 'always'], // b46、声明函数后与小括号间是否有空格
    'space-in-parens': [2, 'never'], // b47、此处强制圆括号内没有空格
    'space-infix-ops': [2, { int32Hint: false } ], // b48、要求运算符前后有空格
    'space-unary-ops': [2, { // b49、一元操作符的空格
      words: true, // 适用于单词类一元操作符，例如：new、delete、typeof、void、yield
      nonwords: false, // 适用于这些一元操作符: -、+、--、++、!、!!
    } ],
    'spaced-comment': [2, 'always', { block: { balanced: true } } ], // b50、强制在注释中 // 或 /* 使用一致的空格
    'switch-colon-spacing': [2, { after: true, before: false } ], // b51、switch 的 case 后的冒号左右空格
    'template-tag-spacing': [2, 'never'], // b52、禁止在一个标记的函数和它的模板字面量之间有空格，(如let hello = func `Hello world`;)
    'template-curly-spacing': [2, 'never'], // b53、模板`${  }`, {}里是否要有空格
    'wrap-regex': 2, // b54、要求正则表达式被括号括起来

    /* js 及 ES6 语法 yes--fix */
    'prefer-arrow-callback': 2, // b55、要求回调函数为箭头函数
    'rest-spread-spacing': [2, 'never'], // b56、扩展运算符及其表达式之间不允许有空格；(如... array)
    'no-floating-decimal': 2, // b57、此规则目的在于消除浮动小数点；(如 .5  2.  -.7)
    'no-multi-spaces': 2, // b58、此规则目的在于禁止在逻辑表达式、条件表达式、声明、数组元素、对象属性、序列和函数参数周围使用多个空格
  },
}
