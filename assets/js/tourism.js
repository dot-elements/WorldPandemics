
var margin = {left: 100, right: 50, top: 100, bottom: -200 };

// var parent = document.getElementById("life").parentElement;

var width = screen.width/2 - margin.left - margin.right;
var height = screen.height * 0.5 - margin.top - margin.bottom;

var max = 0;

var xNudge = 100;
var yNudge = 50;

d3.csv("assets/data/tourism.csv", function(data) {

    // data = data.filter(function(d){ return searchStringInArray(d.entity, selections) })
	let max =  1e9  // d3.max(data, function(d) {return d.arrivals; });
	let minDate = d3.min(data, function(d) {return d.year; });
	let maxDate = d3.max(data, function(d) { return d.year; });

		var y = d3.scaleLinear()
					.domain([0,max])
					.range([height,0]);

		var x = d3.scaleLinear()
					.domain([minDate,maxDate])
					.range([0,width]);

		var yAxis = d3.axisLeft(y);

		var xAxis = d3.axisBottom(x).tickFormat(d3.format("d"));

		
		var line = d3.line()
				.x(function(d){ return x(d.year); })
				.y(function(d){ return y(d.arrivals); })
				.curve(d3.curveCardinal);
		


		var svg = d3.select("#tourism").append("svg").attr("id","svg").attr("height","100%").attr("width","100%")
        .attr("fill", "none").call(responsivefy);


		

		var chartGroup = svg.append("g")
			.attr("class","chartGroup")
			.attr("transform","translate("+xNudge+","+yNudge+")")

		
		chartGroup.append("path")
			.attr("class","line")
			.attr("d",function(d){ return line(data.filter(function(d) {return d.entity == "Europe"})); })
            .attr("stroke", "steelblue").attr("stroke-width", 1.5);
			chartGroup.append("path")
			.attr("class","line")
			.attr("d",function(d){ return line(data.filter(function(d) {return d.entity == "Africa"})); })
            .attr("stroke", "red").attr("stroke-width", 1.5);
			chartGroup.append("path")
			.attr("class","line")
			.attr("d",function(d){ return line(data.filter(function(d) {return d.entity == "Asia&Pacific"})); })
            .attr("stroke", "yellow").attr("stroke-width", 1.5);
			chartGroup.append("path")
			.attr("class","line")
			.attr("d",function(d){ return line(data.filter(function(d) {return d.entity == "Americas"})); })
            .attr("stroke", "purple").attr("stroke-width", 1.5);
            chartGroup.append("path")
            .attr("class","line")
            .attr("d",function(d){ return line(data.filter(function(d) {return d.entity == "MiddleEast"})); })
                  .attr("stroke", "green").attr("stroke-width", 1.5);
      

		chartGroup.append("g")
			.attr("class","axis x")
			.attr("transform","translate(0,"+height+")")
			.call(xAxis);

        chartGroup.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", width)
            .attr("y", height + 30)
            .attr("fill","black")
            .text("Time (year)");
        chartGroup.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("x", 180)
            .attr("y", 50 )
            .attr("fill","black")
            .text("Tourist arrivals");
        
		chartGroup.append("g")
			.attr("class","axis y")
			.call(yAxis)

		chartGroup.append("circle").attr("cx",100).attr("cy",130).attr("r", 6).style("fill", "steelblue")
		chartGroup.append("circle").attr("cx",100).attr("cy",160).attr("r", 6).style("fill", "red")
		chartGroup.append("circle").attr("cx",100).attr("cy",190).attr("r", 6).style("fill", "yellow")
		chartGroup.append("circle").attr("cx",100).attr("cy",220).attr("r", 6).style("fill", "purple")
    chartGroup.append("circle").attr("cx",100).attr("cy",250).attr("r", 6).style("fill", "green")
		chartGroup.append("text").attr("x", 120).attr("y", 130).text("Europe").style("font-size", "20px").attr("alignment-baseline","middle").style("fill", "black")
		chartGroup.append("text").attr("x", 120).attr("y", 160).text("Africa").style("font-size", "20px").attr("alignment-baseline","middle").style("fill", "black")
		chartGroup.append("text").attr("x", 120).attr("y", 190).text("Asia & Pacific").style("font-size", "20px").attr("alignment-baseline","middle").style("fill", "black")
		chartGroup.append("text").attr("x", 120).attr("y", 220).text("Americas").style("font-size", "20px").attr("alignment-baseline","middle").style("fill", "black")
    chartGroup.append("text").attr("x", 120).attr("y", 250).text("Middle East").style("font-size", "20px").attr("alignment-baseline","middle").style("fill", "black")

        
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
		svg.attr('width', w);
		svg.attr('height', Math.round(w / aspect));
	}
  }