import G6 from '@antv/g6'

G6.registerEdge('edge-flow', {
  draw (cfg, group) {
    return this.drawEdge(cfg, group)
  },
  drawEdge (cfg, group) {
    let start = cfg.startPoint
    let end = cfg.endPoint
    start = {
      x: start.x + (cfg.startOffsetX || 0),
      y: start.y + (cfg.startOffsetY || 0)
    }
    end = {
      x: end.x + (cfg.endOffsetX || 0),
      y: end.y + (cfg.endOffsetY || 0)
    }
    let path = [
      ['M', start.x, start.y],
      ['L', end.x, end.y]
    ]

    let d = 4
    const shape = group.addShape('path', {
      attrs: {
        stroke: '#979797',
        path,
        cursor: 'pointer',
        endArrow: {
          path: `M ${d},0 L -${d},-${d + 2} L -${d},${d + 2} Z`,
          d
        },
        lineWidth: 1
      }
    })
    return shape
  }
})
