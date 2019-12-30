import G6 from '@antv/g6'

G6.registerBehavior('drag-node', {
  getEvents () {
    return {
      'node:mousedown': 'onStart',
      'mousemove': 'onMove',
      'mouseup': 'onEnd'
    }
  },
  onStart (e) {
    const target = e.target
    const node = e.item
    const graph = this.graph
    const point = { x: e.x, y: e.y }
    const model = node.getModel()
    if (target.get('isAnchor')) return
    this.dragNode = graph.addItem('node', {
      id: 'node-drag' + G6.Util.uniqueId(),
      shape: 'node-drag',
      x: model.x,
      y: model.y
    })
    this.dragOffset = {
      x: point.x - model.x,
      y: point.y - model.y
    }
    this.dragStartNode = node
  },
  onMove (e) {
    const { dragNode, graph, dragOffset } = this
    if (!dragNode) return
    const point = { x: e.x, y: e.y }
    graph.updateItem(dragNode, {
      x: point.x - dragOffset.x,
      y: point.y - dragOffset.y
    })
  },
  onEnd (e) {
    const { dragNode, graph } = this
    if (!dragNode) return
    let model = dragNode.getModel()
    graph.updateItem(this.dragStartNode, {
      x: model.x,
      y: model.y
    })
    graph.removeItem(dragNode)
    this.dragNode = null
    this.dragOffset = null
  }
})
