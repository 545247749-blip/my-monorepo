import { ref, computed } from 'vue'
import MarkdownIt from 'markdown-it'
import Prism from 'prismjs'

export function useDynamicMarkdown (markdownPath, variables = {}) {
  const markdownTemplate = ref(markdownPath)
  const currentVariables = ref({ ...variables })

  // 初始化 markdown-it
  const md = new MarkdownIt({
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
  })

  // 渲染后的 HTML
  const renderedHtml = computed(() => {
    return md.render(processedMarkdown.value)
  })

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

  return {
    renderedHtml,
  }
}
