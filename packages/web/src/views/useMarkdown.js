import { ref, computed } from 'vue'
import MarkdownIt from 'markdown-it'
import anchor from 'markdown-it-anchor'
import Prism from 'prismjs'
import container from 'markdown-it-container'

export function useDynamicMarkdown (markdownPath, variables = {}) {
  const markdownTemplate = ref(markdownPath)
  const currentVariables = ref({ ...variables })

  // 初始化 markdown-it
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight: function (str, lang) {
      if (lang && Prism.languages[lang]) {
        try {
          let highlighted = Prism.highlight(str, Prism.languages[lang], lang)
          return `<pre class="language-${lang}"><code class="language-${lang}">${highlighted}</code></pre>`
        }
        catch (__) {}
      }
      return ''
    },
  }).use(anchor)

  // 处理变量替换
  const processedMarkdown = computed(() => {
    if (!markdownTemplate.value) return ''
    let content = markdownTemplate.value
    Object.entries(currentVariables.value).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g')
      content = content.replace(regex, value || '')
    })
    return content
  })

  const containers = ['note', 'warning', 'info', 'danger', 'success', 'tip']
  containers.forEach(type => {
    md.use(container, type, {
      validate: (params) => params.trim().startsWith(type),
      render: (tokens, idx) => {
        const m = tokens[idx].info.trim().match(new RegExp(`^${type}\\s*(.*)$`))
        if (tokens[idx].nesting === 1) {
          return `<div class="markdown-alert markdown-alert-${type}">`
        }
        else {
          return '</div>\n'
        }
      },
    })
  })

  // 渲染后的 HTML
  const renderedHtml = computed(() => {
    return `<div class="markdown-body">${md.render(processedMarkdown.value)}</div>`
  })

  return {
    renderedHtml,
  }
}
