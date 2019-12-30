import G6 from '@antv/g6'

const size = 70

G6.registerNode('node-drag', {
  draw (cfg, group) {
    return this.drawDragRect(cfg, group)
  },
  drawDragRect (cfg, group) {
    return group.addShape('rect', {
      attrs: {
        x: -size / 2,
        y: -size / 2,
        width: size,
        height: size,
        radius: 5,
        strokeWidth: 4,
        stroke: '#6cf',
        fill: '#F3F9FF',
        fillOpacity: 0.5,
        lineDash: [5, 5]
      }
    })
  }
})
