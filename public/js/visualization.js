var margin = {top: 20, right: 20, bottom: 100, left: 40};
var width = 960 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

/* Initialize tooltip */
var tip = d3.tip().attr('class', 'd3-tip')
  .html(function(d) { return 'Count: ' + d.counts.media; });

//define scale of x to be from 0 to width of SVG, with .1 padding in between
var scaleX = d3.scale.ordinal()
  .rangeRoundBands([0, width], .1);

//define scale of y to be from the height of SVG to 0
var scaleY = d3.scale.linear()
  .range([height, 0]);

//define axes
var xAxis = d3.svg.axis()
  .scale(scaleX)
  .orient("bottom");

var yAxis = d3.svg.axis()
  .scale(scaleY)
  .orient("left");

//create svg
var svg = d3.select("#chart").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//get json object which contains media counts
d3.json('/igMediaCounts', function(error, data) {
  //set domain of x to be all the usernames contained in the data
  scaleX.domain(data.users.map(function(d) { return d.username; }));
  //set domain of y to be from 0 to the maximum media count returned
  scaleY.domain([0, d3.max(data.users, function(d) { return d.counts.media; })]);

  //set up x axis
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")") //move x-axis to the bottom
    .call(xAxis)
    .selectAll("text")  
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", function(d) {
      return "rotate(-65)" 
    });

  //set up y axis
  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Number of Photos");

  // Invoke tip
  svg.call(tip);

  //set up bars in bar graph
  svg.selectAll(".bar")
    .data(data.users)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return scaleX(d.username); })
    .attr("width", scaleX.rangeBand())
    .attr("y", function(d) { return scaleY(d.counts.media); })
    .attr("height", function(d) { return height - scaleY(d.counts.media); })
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide);
});

function sortMediaCounts() {
  d3.json('/igMediaCounts', function(error, data) {
    // Sort Data
    data.users.sort(function(a, b) {
      if (a.counts.media > b.counts.media) {
        return 1;
      }
      if (a.counts.media < b.counts.media) {
        return -1;
      }
      // a must be equal to b
      return 0;
    });

    //set domain of x to be all the usernames contained in the data
    scaleX.domain(data.users.map(function(d) { return d.username; }));
    //set domain of y to be from 0 to the maximum media count returned
    scaleY.domain([0, d3.max(data.users, function(d) { return d.counts.media; })]);

    var svg = d3.select('#chart');

    svg.selectAll(".bar")
      .data(data.users)
      .transition()
      .duration(750)
      .attr("x", function(d) { return scaleX(d.username); })
      .attr("width", scaleX.rangeBand())
      .attr("y", function(d) { return scaleY(d.counts.media); })
      .attr("height", function(d) { return height - scaleY(d.counts.media); });
    svg.select(".x.axis") // change the x axis
      .attr("transform", "translate(0," + height + ")") //move x-axis to the bottom
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em");
  });


}