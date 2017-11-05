var treeData = [
  {
    name: "电影",
    parent: "null",
    children: [
      {
        name: "动作电影",
        parent: "电影",
        children: [
          {
            name: "《战狼2》",
            parent: "动作电影"
          },
          {
            name: "《杀破狼》",
            parent: "动作电影"
          }
        ]
      },
      {
        name: "恐怖",
        parent: "电影"
      },
      {
        name: "喜剧电影",
        parent: "电影"
      }
    ]
  }
];

// ************** Generate the tree diagram  *****************
//定义树图的全局属性（宽高）
var margin = { top: 20, right: 120, bottom: 20, left: 120 },
  width = 960 - margin.right - margin.left,
  height = 500 - margin.top - margin.bottom;

var i = 0,
  duration = 750, //过渡延迟时间
  root;

var tree = d3.layout.tree().size([height, width]);

var diagonal = d3.svg.diagonal().projection(function(d) {
  return [d.y, d.x];
}); //创建新的斜线生成器

//声明与定义画布属性
var svg = d3
  .select("body")
  .append("svg")
  .attr("width", width + margin.right + margin.left)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

root = treeData[0]; //treeData为上边定义的节点属性
root.x0 = height / 2;
root.y0 = 0;

update(root);

d3.select(self.frameElement).style("height", "500px");

function update(source) {
  // Compute the new tree layout.计算新树图的布局
  var nodes = tree.nodes(root).reverse(),
    links = tree.links(nodes);

  // Normalize for fixed-depth.设置y坐标点，每层占180px
  nodes.forEach(function(d) {
    d.y = d.depth * 180;
  });

  // Update the nodes…每个node对应一个group
  var node = svg.selectAll("g.node").data(nodes, function(d) {
    return d.id || (d.id = ++i);
  }); //data()：绑定一个数组到选择集上，数组的各项值分别与选择集的各元素绑定

  // Enter any new nodes at the parent's previous position.新增节点数据集，设置位置
  var nodeEnter = node
    .enter()
    .append("g") //在 svg 中添加一个g，g是 svg 中的一个属性，是 group 的意思，它表示一组什么东西，如一组 lines ， rects ，circles 其实坐标轴就是由这些东西构成的。
    .attr("class", "node") //attr设置html属性，style设置css属性
    .attr("transform", function(d) {
      return "translate(" + source.y0 + "," + source.x0 + ")";
    })
    .on("click", click);

  //添加连接点---此处设置的是圆圈过渡时候的效果（颜色）
  // nodeEnter.append("circle")
  //   .attr("r", 1e-6)
  //   .style("fill", function(d) { return d._children ? "lightsteelblue" : "#357CAE"; });//d 代表数据，也就是与某元素绑定的数据。
  nodeEnter
    .append("rect")
    .attr("x", -23)
    .attr("y", -10)
    .attr("width", 70)
    .attr("height", 22)
    .attr("rx", 10)
    .style("fill", "#357CAE"); //d 代表数据，也就是与某元素绑定的数据。

  //添加标签
  nodeEnter
    .append("text")
    .attr("x", function(d) {
      return d.children || d._children ? 13 : 13;
    })
    .attr("dy", "-4")
    // .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
    .attr("text-anchor", "middle")
    .text(function(d) {
      return d.name;
    })
    .style("fill", "white")
    .style("fill-opacity", 1e-6);

  nodeEnter
    .append("line")
    .attr("x1", "-25")
    .attr("y1", "0")
    .attr("x2", "50")
    .attr("y", "0")
    .attr("stroke", "white");

  nodeEnter
    .append("text")
    .attr("x", function(d) {
      return d.children || d._children ? 13 : 13;
    })
    .attr("dy", "10")
    .attr("text-anchor", "middle")
    .text(function(d) {
      return d.name;
    })
    .style("fill", "white")
    .style("fill-opacity", 1);
  // Transition nodes to their new position.将节点过渡到一个新的位置-----主要是针对节点过渡过程中的过渡效果
  //node就是保留的数据集，为原来数据的图形添加过渡动画。首先是整个组的位置
  var nodeUpdate = node
    .transition() //开始一个动画过渡
    .duration(duration) //过渡延迟时间,此处主要设置的是圆圈节点随斜线的过渡延迟
    .attr("transform", function(d) {
      return "translate(" + d.y + "," + d.x + ")";
    });

  nodeUpdate
    .select("rect")
    .attr("x", -23)
    .attr("y", -10)
    .attr("width", 70)
    .attr("height", 22)
    .attr("rx", 10)
    .style("fill", "#357CAE");

  nodeUpdate
    .select("text")
    .attr("text-anchor", "middle")
    .style("fill-opacity", 1);

  // Transition exiting nodes to the parent's new position.过渡现有的节点到父母的新位置。
  //最后处理消失的数据，添加消失动画
  var nodeExit = node
    .exit()
    .transition()
    .duration(duration)
    .attr("transform", function(d) {
      return "translate(" + source.y + "," + source.x + ")";
    })
    .remove();

  // nodeExit.select("circle")
  //   .attr("r", 1e-6);
  nodeExit
    .select("rect")
    .attr("x", -23)
    .attr("y", -10)
    .attr("width", 70)
    .attr("height", 22)
    .attr("rx", 10)
    .style("fill", "#357CAE");

  nodeExit
    .select("text")
    .attr("text-anchor", "middle")
    .style("fill-opacity", 1e-6);

  // Update the links…线操作相关
  //再处理连线集合
  var link = svg.selectAll("path.link").data(links, function(d) {
    return d.target.id;
  });

  // Enter any new links at the parent's previous position.
  //添加新的连线
  link
    .enter()
    .insert("path", "g")
    .attr("class", "link")
    .attr("d", function(d) {
      var o = { x: source.x0, y: source.y0 };
      return diagonal({ source: o, target: o }); //diagonal - 生成一个二维贝塞尔连接器, 用于节点连接图.
    })
    .attr("marker-end", "url(#arrow)");

  // Transition links to their new position.将斜线过渡到新的位置
  //保留的连线添加过渡动画
  link
    .transition()
    .duration(duration)
    .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.过渡现有的斜线到父母的新位置。
  //消失的连线添加过渡动画
  link
    .exit()
    .transition()
    .duration(duration)
    .attr("d", function(d) {
      var o = { x: source.x, y: source.y };
      return diagonal({ source: o, target: o });
    })
    .remove();

  // Stash the old positions for transition.将旧的斜线过渡效果隐藏
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}

//定义一个将某节点折叠的函数
// Toggle children on click.切换子节点事件
function click(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  update(d);
}
