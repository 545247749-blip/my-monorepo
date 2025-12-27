<template>
  <div class="md-container">
    <!-- 左侧导航栏 -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <h2 class="logo">
          <span class="logo-text">📚 MD Docs</span>
          <span class="logo-sub">Documentation</span>
        </h2>
      </div>

      <div class="nav-content">
        <div v-for="(item, index) of routes" :key="index" class="nav-group">
          <div class="nav-item"
               :class="{ 'active': item.path === route.path }"
               @click.stop="toPath(item, index)">
            <div class="nav-main">
              <span class="nav-icon">📄</span>
              <span class="nav-name">{{ item.meta.description }}</span>
              <span v-if="item.children" class="nav-arrow">
                {{ expandedItems.includes(index) ? '▼' : '▶' }}
              </span>
            </div>
          </div>

          <!-- 子路由列表 -->
          <transition name="slide">
            <div v-show="expandedItems.includes(index)"
                 class="sub-nav">
              <div v-for="(item2, index2) of item.children || []"
                   :key="index2"
                   class="sub-nav-item"
                   :class="{ 'active': item2.path === route.path }"
                   @click.stop="toPath(item2)">
                <span class="sub-icon">•</span>
                <span class="sub-name">{{ item2.name.split('-').slice(-1)[0] }}</span>
                <span v-if="item.meta.sort" class="sub-sort">#{{ item.meta.sort }}</span>
              </div>
            </div>
          </transition>
        </div>
      </div>

      <div class="sidebar-footer">
        <div class="doc-count">
          <span>📊 Total: {{ totalDocs }} documents</span>
        </div>
      </div>
    </aside>

    <!-- 右侧内容区 -->
    <main class="content-area">
      <div class="content-header">
        <div class="breadcrumb">
          <span class="current-doc">📝 {{ currentDocName }}</span>
        </div>
        <div class="content-actions">
          <button class="btn-icon" title="Toggle Theme">
            🌙
          </button>
          <button class="btn-icon" title="Fullscreen">
            ⛶
          </button>
        </div>
      </div>

      <div class="router-view-wrapper">
        <div class="content-paper">
          <RouterView />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const expandedItems = ref([])

const routes = computed(() => {
  const mdRoute = router.options.routes.find(item => item.name === 'md')
  return mdRoute?.children || []
})

const totalDocs = computed(() => {
  let count = 0
  routes.value.forEach(item => {
    count++
    if (item.children) {
      count += item.children.length
    }
  })
  return count
})

const currentDocName = computed(() => {
  return route.meta?.title || route.name || 'Document'
})

function toPath (item, index) {
  if (item.children && item.children.length) {
    toggleExpand(index)
  }
  else {
    router.push({
      name: item.name,
    })
  }
}

// 点击父项时切换展开状态
function toggleExpand (index) {
  const pos = expandedItems.value.indexOf(index)
  if (pos > -1) {
    expandedItems.value.splice(pos, 1)
  }
  else {
    expandedItems.value.push(index)
  }
}
</script>

<style scoped lang="scss">
.md-container {
  height: 100vh;
  display: flex;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  overflow: hidden;
}

/* ========== 左侧导航栏 ========== */
.sidebar {
  width: 300px;
  background: white;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 10;
}

.sidebar-header {
  padding: 24px 20px;
  border-bottom: 1px solid #f1f5f9;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

  .logo {
    margin: 0;

    .logo-text {
      display: block;
      font-size: 20px;
      font-weight: 700;
      color: white;
      margin-bottom: 4px;
    }

    .logo-sub {
      display: block;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.8);
      letter-spacing: 1px;
      text-transform: uppercase;
    }
  }
}

.nav-content {
  flex: 1;
  padding: 16px 0;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 2px;
  }
}

.nav-group {
  margin-bottom: 4px;
}

.nav-item {
  padding: 0 20px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: linear-gradient(90deg, rgba(102, 126, 234, 0.1) 0%, transparent 100%);

    .nav-name {
      color: #667eea;
    }

    .nav-arrow {
      opacity: 1;
    }
  }

  &.active {
    background: linear-gradient(90deg, rgba(102, 126, 234, 0.15) 0%, transparent 100%);
    border-left: 3px solid #667eea;

    .nav-name {
      color: #667eea;
      font-weight: 600;
    }

    .nav-icon {
      transform: scale(1.1);
    }
  }
}

.nav-main {
  display: flex;
  align-items: center;
  padding: 12px 0;
  position: relative;
}

.nav-icon {
  margin-right: 12px;
  font-size: 16px;
  transition: transform 0.2s ease;
}

.nav-name {
  flex: 1;
  font-size: 14px;
  color: #475569;
  transition: color 0.2s ease;
}

.nav-arrow {
  user-select: none;
  font-size: 10px;
  color: #94a3b8;
  opacity: 0.5;
  transition: 0.2s ease;
  padding: 5px;
  border-radius: 4px;
  &:hover{
    background-color: rgb(0, 0, 0, 0.04);
  }
}

.sub-nav {
  background: #f8fafc;
  border-left: 3px solid #e2e8f0;
  margin-left: 20px;
  overflow: hidden;

  .slide-enter-active,
  .slide-leave-active {
    transition: all 0.3s ease;
  }

  .slide-enter-from,
  .slide-leave-to {
    max-height: 0;
    opacity: 0;
    transform: translateY(-10px);
  }

  .slide-enter-to,
  .slide-leave-from {
    max-height: 200px;
    opacity: 1;
    transform: translateY(0);
  }
}

.sub-nav-item {
  display: flex;
  align-items: center;
  padding: 10px 20px 10px 30px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 13px;

  &:hover {
    background: rgba(102, 126, 234, 0.05);

    .sub-name {
      color: #667eea;
    }
  }

  &.active {
    background: rgba(102, 126, 234, 0.1);
    border-left: 2px solid #667eea;

    .sub-name {
      color: #667eea;
      font-weight: 500;
    }

    .sub-icon {
      color: #667eea;
    }
  }
}

.sub-icon {
  margin-right: 10px;
  color: #94a3b8;
  font-size: 16px;
}

.sub-name {
  flex: 1;
  color: #64748b;
  transition: color 0.2s ease;
}

.sub-sort {
  font-size: 11px;
  color: #94a3b8;
  background: #f1f5f9;
  padding: 2px 6px;
  border-radius: 10px;
  margin-left: 8px;
}

.sidebar-footer {
  padding: 16px 20px;
  border-top: 1px solid #f1f5f9;
  background: #f8fafc;

  .doc-count {
    font-size: 12px;
    color: #64748b;
    display: flex;
    align-items: center;

    &::before {
      content: '';
      display: inline-block;
      width: 8px;
      height: 8px;
      background: #10b981;
      border-radius: 50%;
      margin-right: 8px;
      animation: pulse 2s infinite;
    }
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* ========== 右侧内容区 ========== */
.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content-header {
  padding: 16px 32px;
  background: white;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}

.breadcrumb {
  .current-doc {
    font-size: 18px;
    font-weight: 600;
    color: #1e293b;

    &::before {
      content: '';
      display: inline-block;
      width: 4px;
      height: 18px;
      background: linear-gradient(180deg, #667eea, #764ba2);
      border-radius: 2px;
      margin-right: 12px;
      vertical-align: bottom;
    }
  }
}

.content-actions {
  display: flex;
  gap: 8px;

  .btn-icon {
    width: 36px;
    height: 36px;
    border: 1px solid #e2e8f0;
    background: white;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 16px;

    &:hover {
      background: #f8fafc;
      border-color: #cbd5e1;
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }
  }
}

.router-view-wrapper {
  flex: 1;
  padding: 32px;
  overflow-y: auto;
  background: linear-gradient(135deg, #f1f5f9 0%, #f8fafc 100%);
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;

    &:hover {
      background: #94a3b8;
    }
  }
}

.content-paper {
  max-width: 1200px;
  margin: 0 auto;
  animation: fadeInUp 0.4s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ========== Markdown 内容样式（增强版） ========== */
:deep(.md-item) {
  min-height: calc(100vh - 200px);
  display: flex;
  flex-direction: column;
  perspective: 0;
  > main{
    background: transparent;
    border: none;
    border-radius: 16px;
    padding: 48px;
    margin: 0;
    flex: 1;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    box-shadow:
        0 4px 6px -1px rgba(241, 15, 15, 0.04),
        0 10px 15px -3px rgba(0, 0, 0, 0.06),
        0 20px 40px -12px rgba(102, 126, 234, 0.15),
        0 0 0 1px rgba(255, 255, 255, 0.8) inset,
        0 0 0 2px rgba(102, 126, 234, 0.1); // 模拟边框

    &:hover {
      box-shadow:
          0 8px 12px -2px rgba(0, 0, 0, 0.08),
          0 20px 30px -10px rgba(0, 0, 0, 0.12),
          0 30px 60px -20px rgba(102, 126, 234, 0.2),
          0 0 0 1px rgba(255, 255, 255, 0.8) inset;
    }
    // 顶部装饰条
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 48px;
      right: 48px;
      height: 3px;
      background: linear-gradient(90deg,
          #667eea 0%,
          #764ba2 50%,
          #667eea 100%
      );
      border-radius: 0 0 3px 3px;
      opacity: 0.8;
    }
  }
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .sidebar {
    width: 280px;
  }

  :deep(.markdown-body) {
    padding: 32px;

    &::after {
      left: 32px;
      right: 32px;
    }
  }
}

@media (max-width: 992px) {
  .md-container {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    height: auto;
    max-height: 300px;
  }

  .content-area {
    height: calc(100vh - 300px);
  }
}

@media (max-width: 768px) {
  .content-header {
    padding: 16px 20px;
  }

  .router-view-wrapper {
    padding: 16px;
  }

  :deep(.markdown-body) {
    padding: 24px;
    border-radius: 12px;

    &::after {
      left: 24px;
      right: 24px;
    }
  }
}

/* 打印优化 */
@media print {
  .sidebar,
  .content-header {
    display: none;
  }

  .content-area {
    height: auto;
  }

  :deep(.markdown-body) {
    box-shadow: none !important;
    border: 1px solid #ddd !important;
    max-width: 100% !important;

    &::before,
    &::after {
      display: none !important;
    }
  }
}
</style>
