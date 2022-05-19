<template>
<div class="tree-wrapper">
  <el-input
    v-if="filterable"
    size="mini"
    class="filter-text"
    :placeholder="placeholder"
    v-model="filterText"
  />

  <el-tree
    ref="tree"
    class="filter-tree"
    :draggable="$attrs.draggable === undefined ? true : $attrs.draggable"
    node-key="id"
    :show-checkbox="$attrs['show-checkbox'] === undefined ? false : $attrs['show-checkbox']"
    :data="data"
    :default-expanded-keys="expandedKeys"
    :default-checked-keys="checkedKeys"
    :highlight-current="$attrs['highlight-current'] === undefined ? true : $attrs['highlight-current']"
    :expand-on-click-node="$attrs['expand-on-click-node'] === undefined ? false : $attrs['expand-on-click-node']"
    :check-on-click-node="$attrs['check-on-click-node'] === undefined ? true : $attrs['check-on-click-node']"
    :default-expand-all="$attrs['default-expand-all'] === undefined ? true : $attrs['default-expand-all']"
    :filter-node-method="filterNode"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template v-slot="{ node, data }">
      <div class="node-wrapper">
        <div class="node-left">
          <div class="flex-content">
            <img :src="node.isLeaf ? file : node.expanded ? directoryExpand : directory" width="19">
            <span> {{ node.label }}</span>
          </div>
        </div>

        <div class="node-right">
          <slot name="extend" :node-data="{node, data}">
            <!-- todo 后续支持编辑和删除 -->
            <el-dropdown v-if="extendable">
              <span @click.stop="() => {}" class="pointer">···</span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>删除</el-dropdown-item>
                <el-dropdown-item>编辑</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </slot>
        </div>
      </div>
    </template>
  </el-tree>
</div>
</template>

<script>
import file from './img/file.png'
import directory from './img/directory.png'
import directoryExpand from './img/directory-expand.png'
export default {
  inheritAttrs: false,
  props: {
    nodeData: { // 原始数据
      type: Array,
      default: () => [],
    },
    expandedKeys: { // 默认展开数据
      type: Array,
      default: () => [],
    },
    checkedKeys: { // 默认勾选数据
      type: Array,
      default: () => [],
    },
    filterable: { // 是否显示搜索框
      type: Boolean,
      default: false,
    },
    extendable: { // 是否显示删除、编辑
      type: Boolean,
      default: false,
    },
    formatNodeData: { // 格式化tree数据函数
      type: Function,
      default: (val) => val,
    },
    placeholder: {
      type: String,
      default: '输入关键字进行过滤',
    },
    size: {
      type: [String, Number], // todo 支持尺寸变化
      default: 'normal', // small big noraml 14
    }
    // 通过v-bind="$attrs" 可以传入出上面四个属性以外所有el-tree支持的属性
  },
  // emits 通过v-on="$listeners" 可以支持所有el-tree支持的事件
  data() {
    return {
      file,
      directory,
      directoryExpand,
      filterText: '',
      data: [],
    }
  },
  watch: {
    filterText(val) {
      this.filter(val);
    },
    nodeData: {
      handler(val) {
        this.data = this.formatNodeData(val)
      },
      immediate: true,
      deep: true,
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    filter(val) {
      this.$refs.tree.filter(val);
    },
    getCheckedKeys() {
      return this.$refs.tree.getCheckedKeys();
    },
    setCurrentKey(key, shouldAutoExpandParent = true) {
      this.$refs.tree.setCurrentKey(key, shouldAutoExpandParent)
    },
    setCurrentNode(node, shouldAutoExpandParent = true) {
      this.$refs.tree.setCurrentNode(node, shouldAutoExpandParent)
    },
    // todo 如需支持el-tree中的方法往下继续扩展即可
  },
};
</script>

<style lang="scss" scoped>
.tree-wrapper {
  // min-width: 250px;
}

.node-wrapper {
  width: 100%;
  position: relative;
  .node-left {
    flex: 1;
    flex-wrap: nowrap;
    padding-right: 30px;
    justify-content: flex-start;
    .flex-content {
      display: flex;
      align-items: center;
      img {
        margin-right: 5px;
      }
    }
  }
  .node-right {
    position: absolute;
    top: 0;
    right: 0;
    width: 30px;
    height: 20px;
    display: flex;
    ::v-deep {
      .el-button--text {
        color: #6f6f6f;
      }
    }
  }
}

.filter-tree {
  background-color: #fff;
  color: #6f6f6f;
  font-size: 14px;
  .el-tree-node__content {
    height: 32px;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
}
</style>
