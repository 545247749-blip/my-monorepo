import { createRouter, createWebHistory } from 'vue-router'


let pages = import.meta.glob('../views/**/page.js', {
  eager: true,
  import: 'default',
})
let components = import.meta.glob('../views/**/index.vue', {
  eager: true,
  import: 'default',
})
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/class',
    },
    ...buildRouteHierarchy(pages),
  ],
})

export default router

function buildRouteHierarchy (pages) {
  // 构建路径树
  const tree = {}
  Object.entries(pages).forEach(([filePath, data]) => {
    const path = filePath.replace('../views', '').replace('/page.js', '').split('/').filter(Boolean)
    // 递归构建树
    let currentNode = tree
    for (let i = 0; i < path.length; i++) {
      const segment = path[i]
      const isLeaf = i === path.length - 1
      if (!currentNode[segment]) {
        currentNode[segment] = {
          name: segment,
          data: isLeaf ? data : {},
          children: {},
        }
      }
      else if (isLeaf) {
        currentNode[segment].data = data
      }
      if (!isLeaf) {
        currentNode = currentNode[segment].children
      }
    }
  })
  // 将树转换为路由数组
  function convertTreeToRoutes (node, parentSegments = []) {
    return Object.entries(node).map(([segment, item]) => {
      const currentSegments = [...parentSegments, segment]
      const path = '/' + currentSegments.join('/')
      let comPath = '../views' + path + '/index.vue'
      // const name = currentSegments.map(s => s.toLowerCase()).join('-')
      const name = currentSegments.join('-')
      return {
        path,
        name,
        meta: item.data,
        component: components[comPath],
        children: Object.keys(item.children).length > 0 ? convertTreeToRoutes(item.children, currentSegments) : [],
      }
    }).sort((a, b) => a.meta.sort - b.meta.sort)
  }
  return convertTreeToRoutes(tree)
}
