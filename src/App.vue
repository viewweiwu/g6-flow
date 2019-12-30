<template>
  <div id="app" ref="app"></div>
</template>

<script>
import G6 from '@antv/g6'
import './nodes'
import './edges'
import './behavior'

export default {
  name: 'app',
  mounted () {
    this.init()
  },
  methods: {
    init () {
      const modes = {
        default: [
          'drag-canvas',
          'drag-node',
          'add-edge',
          'zoom-canvas'
        ]
      }
      const data = {
        // 点集
        nodes: [
          {
            id: 'node1', // String，该节点存在则必须，节点的唯一标识
            x: 300, // Number，可选，节点位置的 x 值
            y: 100 // Number，可选，节点位置的 y 值
          },
          {
            id: 'node2', // String，该节点存在则必须，节点的唯一标识
            x: 300, // Number，可选，节点位置的 x 值
            y: 300 // Number，可选，节点位置的 y 值
          },
          {
            id: 'node3',
            x: 500,
            y: 100
          },
          {
            id: 'node4',
            x: 500,
            y: 300
          }
        ],
        // 边集
        edges: [
          {
            source: 'node1', // String，必须，起始点 id
            target: 'node2', // String，必须，目标点 id
            startOffsetX: 0,
            startOffsetY: 35,
            endOffsetX: 0,
            endOffsetY: -35
          }
        ]
      }
      let el = this.$refs.app
      const graph = new G6.Graph({
        container: el, // String | HTMLElement，必须，在 Step 1 中创建的容器 id 或容器本身
        width: el.offsetWidth, // Number，必须，图的宽度
        height: el.offsetHeight, // Number，必须，图的高度
        modes,
        defaultNode: {
          shape: 'node-flow',
          anchors: [
            { out: true, offsetX: 0, offsetY: 35 },
            { out: true, offsetX: 35, offsetY: 0 },
            { in: true, offsetX: 0, offsetY: -35 },
            { in: true, offsetX: -35, offsetY: 0 }
          ]
        },
        defaultEdge: {
          shape: 'edge-flow'
        }
      })
      graph.data(data) // 读取 Step 2 中的数据源到图上
      graph.render() // 渲染图
    }
  }
}
</script>

<style>
body {
  margin: 0;
}
#app {
  width: 100vw;
  height: 100vh;
}
</style>
