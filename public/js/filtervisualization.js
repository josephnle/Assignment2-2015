function generateFiltersVisualization()
{
  var margin = {top: 20, right: 20, bottom: 100, left: 40};
  var width = 960 - margin.left - margin.right;
  var height = 500 - margin.top - margin.bottom;

  /* Initialize tooltip */
  var tip = d3.tip().attr('class', 'd3-tip')
    .html(function(d) { return 'Count: ' + d.value; });

  var diameter = 500,
    format = d3.format(",d"),
    color = d3.scale.category20c();

  var bubble = d3.layout.pack()
    .sort(null)
    .size([diameter, diameter])
    .padding(1.5);

  var svg = d3.select("#filterChart").append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .attr("class", "bubble");

//get json object which contains media counts
  d3.json('/igSelfMedia', function(error, data) {
    $('#filtersChartLoader').remove();

    // Prepare data
    var filterCounts = [];

    data.media.forEach(function(item) {
      if(filterCounts[item.filter]) {
        filterCounts[item.filter]++;
      }
      else {
        filterCounts[item.filter] = 1;
      }
    });

    var filterNames = Object.keys(filterCounts);
    var filterData = [];

    filterNames.forEach(function (key) {
      filterData.push({
        name: key,
        count: filterCounts[key]
      });
    });

    filterData = {
      'name': 'flare',
      'children': filterData
    };

    var node = svg.selectAll(".node")
      .data(bubble.nodes(classes(filterData))
        .filter(function(d) { return !d.children; }))
      .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    node.append("title")
      .text(function(d) { return d.filterName + ": " + format(d.value); });

    node.append("circle")
      .attr("r", function(d) { return d.r; })
      .style("fill", function(d) { return color(d.filterName); });

    node.append("text")
      .attr("dy", ".3em")
      .style("text-anchor", "middle")
      .text(function(d) { return d.filterName; });
  });

  function classes(root) {
    var classes = [];

    function recurse(name, node) {
      if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
      else classes.push({filterName: node.name, value: node.count});
    }

    recurse(null, root);
    return {children: classes};
  }
}

generateFiltersVisualization();
