下面这些是 G6 能够实现的自定义节点。
![](https://user-gold-cdn.xitu.io/2019/12/30/16f54b066b50a0c4?w=1220&h=238&f=png&s=37613)

当去拖拽其中一个节点的时候，结果就会像下图这样子。不论换到哪个方向，始终是取两个节点之最近的锚点来进行连线最近距离进行绘制。

![](https://user-gold-cdn.xitu.io/2019/12/30/16f54db97bc7f62c?w=397&h=376&f=gif&s=60675)

这是因为 g6 的锚点默认的逼近策略导致的，虽然这种策略虽然是合理的，但是我还是想要避开这个策略😂。让线的两边固定在锚点上，不论节点怎么拖动，这两条线的出发点不会变化。

![](https://user-gold-cdn.xitu.io/2019/12/30/16f54e43ee30956d?w=397&h=376&f=gif&s=48221)

## 从 data 的角度考虑🤔
用现在已有的数据来看，并没有能够体现出指定锚点出发以及指定锚点结束的地方。
 
![](https://user-gold-cdn.xitu.io/2019/12/30/16f559c2de6fb284?w=884&h=724&f=png&s=82830)

假如像这样子指定从第几个锚点出发，也是方法之一。不过如果每个节点的锚点个数不确定，或者锚点在节点之外的地方就不容易画出来了。

![](https://user-gold-cdn.xitu.io/2019/12/30/16f55a7316f4b4be?w=902&h=792&f=png&s=99953)

方法的话有很多，在语雀文档上大家也都有[讨论](https://www.yuque.com/antv/g6/vyf984)，大家可以移步去看看。这次我决定用下面偏移坐标这种写法。

![](https://user-gold-cdn.xitu.io/2019/12/30/16f55e192e64ddd5?w=850&h=870&f=png&s=117352)

首先这么写可以表达从哪里出发，从哪里结束。其次代码实现思路简单，直接加上偏移值就可以了。但是需要把原有上下左右 4 个锚点改成为一个锚点 [0.5, 0.5]，如果没有偏移值的时候会变成中间连在中间，并且看不到箭头。


## 代码实现
### 实现自定义线条
线条的绘制思路，自定义线条的 draw 方法，可以拿到起始点(startPoint)和结束点(endPoint)，对两个点进行一个偏移即可。
```javascript
const data = {
    // 边集
    edges: [
        {
            source: 'node1', // String，必须，起始点 id
            target: 'node2', // String，必须，目标点 id
            startOffsetX: 0, // 起始点偏离的 X
            startOffsetY: 35, // 起始点偏离的 Y
            endOffsetX: 0, // 终点偏离的 X
            endOffsetY: -35 // 终点偏离的 Y
        }
    ]
}
// 自定义线条
G6.registerEdge('edge-flow', {
    draw (cfg, group) {
        let start = cfg.startPoint
        let end = cfg.endPoint
        // 起始点偏移
        start = {
          x: start.x + (cfg.startOffsetX || 0),
          y: start.y + (cfg.startOffsetY || 0)
        }
        // 结束点偏移
        end = {
          x: end.x + (cfg.endOffsetX || 0),
          y: end.y + (cfg.endOffsetY || 0)
        }
        // ...
    }
})
```

### 实现自定义节点

定义好锚点的数据，指定 offset 位置。

```javascript
const graph = new G6.Graph({
    // ...
    defaultNode: {
        shape: 'node-flow',
        anchors: [
            { offsetX: 0, offsetY: 35 },
            { offsetX: 35, offsetY: 0 },
            { offsetX: 0, offsetY: -35 },
            { offsetX: -35, offsetY: 0 }
        ]
    }
})

```

根据数据绘制出锚点。

```javascript
G6.registerNode('node-flow', {
    // ...
    afterDraw (cfg, group) {
        this.drawAnchor(cfg, group)
    },
    drawAnchor (cfg, group) {
        // 绘制出所有的锚点
        anchors.forEach(anchor => {
            group.addShape('circle', {
                attrs: {
                    x: anchor.offsetX,
                    y: anchor.offsetY,
                    r: 5,
                    fill: '#fff',
                    stroke: '#9B43E7',
                    cursor: 'pointer'
                }
            })
        })
    },
    // 定义锚点位置在中心
    getAnchorPoints () {
        return [
            [ 0.5, 0.5 ]
        ]
    }
})
```

绘制好以后，效果就是开头所说的那个样子。

![](https://user-gold-cdn.xitu.io/2019/12/30/16f55e192e64ddd5?w=850&h=870&f=png&s=117352)

## 最后

在 g6 的语雀和搜索引擎，徘徊了好久，都没有找到有文章提到怎么固定锚点的做法，不知道是不是我搜索姿势不对，后来思考出了一个想法之后，便有了这篇文章。在这篇文章里提供一种解决思路就是偏移线条的开始结束点，并且代码也实现了一遍，有需要参考的可以去逛下文章 github 地址。

另外，这篇文章并没有提到自定义连线和自定义拖拽这两种自定义行为，因为跟文章关系不是很大，所以就先不提了。

<br>
demo：https://viewweiwu.github.io/g6-flow/
<br>
code：https://github.com/viewweiwu/g6-flow
