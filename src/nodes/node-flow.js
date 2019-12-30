import G6 from '@antv/g6'

const size = 70

const anchorSize = 10

G6.registerNode('node-flow', {
  draw (cfg, group) {
    return this.drawFlowRect(cfg, group)
  },
  afterDraw (cfg, group) {
    this.drawAnchor(cfg, group)
  },
  drawFlowRect (cfg, group) {
    return group.addShape('rect', {
      attrs: {
        x: -size / 2,
        y: -size / 2,
        width: size,
        height: size,
        radius: 4,
        fill: '#997EEC',
        shadowColor: 'rgba(0, 0, 0, 0.5)',
        shadowBlur: 4,
        shadowOffsetY: 2
      }
    })
  },
  drawAnchor (cfg, group) {
    let anchors = cfg.anchors
    if (!anchors) {
      return
    }
    anchors.forEach(anchor => {
      let shape = group.addShape('circle', {
        attrs: {
          x: anchor.offsetX,
          y: anchor.offsetY,
          r: anchorSize / 2,
          fill: '#fff',
          stroke: '#9B43E7',
          cursor: 'pointer'
        },
        isAnchorIn: !!anchor.in,
        isAnchorOut: !!anchor.out,
        isAnchor: true
      })
      shape.hide()
    })
  },
  getAnchorPoints () {
    return [
      [ 0.5, 0.5 ]
    ]
  },
  setState (name, value, node) {
    const group = node.getContainer()
    const shapes = group.get('children')
    switch (name) {
      // 设置悬浮状态
      case 'hover':
        shapes.forEach(shape => {
          if (shape.get('isAnchor') && shape.get('isAnchorOut')) {
            shape[value ? 'show' : 'hide']()
          }
        })
        break
      case 'in':
        shapes.forEach(shape => {
          if (shape.get('isAnchor') && shape.get('isAnchorIn')) {
            shape[value ? 'show' : 'hide']()
            if (value) {
              shape._attrs.lineWidth = 3
              shape._attrs.r = 7
            } else {
              shape._attrs.lineWidth = 1
              shape._attrs.r = anchorSize / 2
            }
          }
        })
    }
  }
})
