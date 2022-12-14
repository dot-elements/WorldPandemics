

var margin = {left: 100, right: 20, top: screen.height/4, bottom: 50 };

var width = screen.width/2 - margin.left - margin.right;
var height = screen.height * 0.75 - margin.top - margin.bottom;
var donutWidth = 10
var xNudge = 50;
var yNudge = 100;
var radius = Math.min(width, height) / 2;

var svg = d3.select("#donut")
  .append("svg")
    .attr("height","100%").attr("width","100%")
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
d3.csv("assets/data/total-number-of-deaths-by-cause.csv", function(data) {


  //////////
  // GENERAL //
  //////////

  // List of groups = header of the csv files
  var keys = data.columns.slice(3)
  // color palette
  var color = d3.scaleOrdinal()
    .domain(keys)
    .range(["#5E4FA2", "#3288BD", "#66C2A5", "#ABDDA4", "#E6F598", 
    "#FFFFBF", "#FEE08B", "#FDAE61", "#F46D43", "#D53E4F", "#9E0142"]);

  data = data.filter(function(d){return d.entity.match(/^World$/) })
  console.log(data[0])
  //stack the data?
  var stackedData = d3.stack()
    .keys(keys)
    (data)
  //////////
  // AXIS //
  //////////

  // Add X axis
  var x = d3.scaleLinear()
    .domain(d3.extent(data, function(d) { return d.year; }))
    .range([ 0, width ]);
  var xAxis = svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(5))

  // Add X axis label:
  svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height+40 )
      .text("Time (year)");

  // Add Y axis label:
  svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", 0)
      .attr("y", -20 )
      .text("Number of deaths")
      .attr("text-anchor", "start")

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 100000000])
    .range([ height, 0 ]);
  svg.append("g")
    .call(d3.axisLeft(y).ticks(5))



  //////////
  // BRUSHING AND CHART //
  //////////

  // Add a clipPath: everything out of this area won't be drawn.
  var clip = svg.append("defs").append("svg:clipPath")
      .attr("id", "clip")
      .append("svg:rect")
      .attr("width", width )
      .attr("height", height )
      .attr("x", 0)
      .attr("y", 0)
      //.call(responsivefy);

  // Add brushing
  var brush = d3.brushX()                 // Add the brush feature using the d3.brush function
      .extent( [ [0,0], [width,height] ] ) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
      .on("end", updateChart) // Each time the brush selection changes, trigger the 'updateChart' function

  // Create the scatter variable: where both the circles and the brush take place
  var areaChart = svg.append('g')
    .attr("clip-path", "url(#clip)")

  // Area generator
  var area = d3.area()
    .x(function(d) { return x(d.data.year); })
    .y0(function(d) { return y(d[0]); })
    .y1(function(d) { return y(d[1]); })

  // Show the areas
  areaChart
    .selectAll("mylayers")
    .data(stackedData)
    .enter()
    .append("path")
      .attr("class", function(d) { return "myArea " + d.key })
      .style("fill", function(d) { return color(d.key); })
      .attr("d", area)

  // Add the brushing
  areaChart
    .append("g")
      .attr("class", "brush")
      .call(brush);

  var idleTimeout
  function idled() { idleTimeout = null; }

  // A function that update the chart for given boundaries
  function updateChart() {

    let extent = d3.event.selection

    // If no selection, back to initial coordinate. Otherwise, update X axis domain
    if(!extent){
      if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
      x.domain(d3.extent(data, function(d) { return d.year; }))
    }else{
      x.domain([ x.invert(extent[0]), x.invert(extent[1]) ])
      areaChart.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
    }

    // Update axis and area position
    xAxis.transition().duration(1000).call(d3.axisBottom(x).ticks(5))
    areaChart
      .selectAll("path")
      .transition().duration(1000)
      .attr("d", area)
    }



    //////////
    // HIGHLIGHT GROUP //
    //////////

    // What to do when one group is hovered
    var highlight = function(d){
      // reduce opacity of all groups
      d3.selectAll(".myArea").style("opacity", .1)
      // expect the one that is hovered
      d3.select("."+d).style("opacity", 1)
    }

    // And when it is not hovered anymore
    var noHighlight = function(d){
      d3.selectAll(".myArea").style("opacity", 1)
    }



    //////////
    // LEGEND //
    //////////

    // Add one dot in the legend for each name.
    var size = 20
    svg.selectAll("myrect")
      .data(keys)
      .enter()
      .append("rect")
        .attr("x", 400)
        .attr("y", function(d,i){ return 10 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("width", size)
        .attr("height", size)
        .style("fill", function(d){ return color(d)})
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)

    // Add one dot in the legend for each name.
    svg.selectAll("mylabels")
      .data(keys)
      .enter()
      .append("text")
        .attr("x", 400 + size*1.2)
        .attr("y", function(d,i){ return 10 + i*(size+5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", function(d){ return color(d)})
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)

})


function responsivefy(svg) {
	// container will be the DOM element
	// that the svg is appended to
	// we then measure the container
	// and find its aspect ratio
	const container = d3.select(svg.node().parentNode),
		width = parseInt(svg.style('width'), 10),
		height = parseInt(svg.style('height'), 10),
		aspect = width / height;
	// set viewBox attribute to the initial size
	// control scaling with preserveAspectRatio
	// resize svg on inital page load
	svg.attr('viewBox', `0 0 ${width} ${height}`)
		.attr('preserveAspectRatio', 'xMinYMid')
		.call(resize);
   
	// add a listener so the chart will be resized
	// when the window resizes
	// multiple listeners for the same event type
	// requires a namespace, i.e., 'click.foo'
	// api docs: https://goo.gl/F3ZCFr
	d3.select(window).on(
		'resize.' + container.attr('id'), 
		resize
	);
   
	// this is the code that resizes the chart
	// it will be called on load
	// and in response to window resizes
	// gets the width of the container
	// and resizes the svg to fill it
	// while maintaining a consistent aspect ratio
	function resize() {
		const w = parseInt(container.style('width'));
    console.log(w)
		svg.attr('width', w);
		svg.attr('height', Math.round(w / aspect));
	}
  }