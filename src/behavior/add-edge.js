import G6 from '@antv/g6'

G6.registerBehavior('add-edge', {
  getEvents () {
    return {
      'mouseup': 'onOut',
      'node:mousedown': 'onStart',
      'mousemove': 'onMove',
      'node:mouseup': 'onEnd',
      'node:mouseenter': 'onEnter',
      'node:mouseleave': 'onLeave'
    }
  },
  onStart (e) {
    const target = e.target
    const node = e.item
    const graph = this.graph
    const point = { x: e.x, y: e.y }
    const model = node.getModel()
    const attrs = target.get('attrs')
    if (!target.get('isAnchorOut')) return
    // 屏幕中生成可拖拽的线，并标记
    this.edge = graph.addItem('edge', {
      id: 'edge' + G6.Util.uniqueId(),
      source: model.id,
      target: point,
      startOffsetX: attrs.x,
      startOffsetY: attrs.y,
      endOffsetX: 0,
      endOffsetY: 0
    })
    graph.getNodes().forEach(node => {
      if (node.get('id') === model.id) {
        return
      }
      graph.setItemState(node, 'in', true)
    })
  },
  onMove (e) {
    const { edge, graph } = this
    const point = { x: e.x, y: e.y }
    if (!edge) return
    graph.updateItem(edge, {
      target: point
    })
  },
  onEnd (e) {
    const { edge, graph } = this
    const target = e.target
    const node = e.item
    if (node.destroyed) return
    const model = node.getModel()
    const attrs = target.get('attrs')
    if (!target.get('isAnchorIn')) {
      this.removeEdge()
    } else {
      graph.updateItem(edge, {
        target: model.id,
        endOffsetX: attrs.x,
        endOffsetY: attrs.y
      })
      this.edge = null
    }
  },
  onOut () {
    if (!this.edge) return
    const graph = this.graph
    setTimeout(() => {
      this.removeEdge()
      graph.getNodes().forEach(node => {
        graph.setItemState(node, 'in', false)
        graph.setItemState(node, 'hover', false)
      })
    }, 100)
  },
  removeEdge () {
    let { graph, edge } = this
    if (!edge) return
    graph.removeItem(edge)
    this.edge = null
  },
  // 鼠标进入节点，设置高亮
  onEnter (e) {
    const node = e.item
    const graph = this.graph
    if (!this.edge) {
      graph.setItemState(node, 'hover', true)
    }
  },
  // 鼠标进入节点，设置高亮
  onLeave (e) {
    const node = e.item
    const graph = this.graph
    if (!this.edge) {
      graph.setItemState(node, 'hover', false)
    }
  }
})
