var margin = {top: 10, right: 30, bottom: 30, left: 60},
width = document.getElementById('tetanus').clientWidth - 200,
height = 300 - margin.top - margin.bottom;

// var parseDate = d3.timeFormat("%y").parse;

var x = d3.scaleTime().range([0, width]);
var y0 = d3.scaleLinear().range([0, height]);
var y1 = d3.scaleLinear().range([0, height]);

var xAxis = d3.axisBottom(x).tickFormat(d3.format("d"));

var yAxisLeft = d3.axisLeft(y0).ticks(5);

var yAxisRight = d3.axisRight(y1).tickFormat(d3.format(".00%")); 

var valueline = d3.line()
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y0(d.deaths); });
    
var valueline2 = d3.line()
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y1(d.vaccinated); });
  
var svg = d3.select("#tetanus")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.csv("https://raw.githubusercontent.com/dot-elements/WorldPandemics/Georgi/assets/data/tetanus_world_only_combined.csv", 

    function(data) {
        return {year : data.year, deaths : +data.deaths, vaccinated : +data.percentage_vaccinated}
    // data.forEach(function(d) {
    //     d.date = parseDate(d.date);
    //     d.close = +d.close;
    //     d.open = +d.open;
    }).then(
        function(data) {
            // Scale the range of the data
            x.domain(d3.extent(data, function(d) { return d.year; }));
            y0.domain([d3.max(data, function(d) {
                return Math.max(d.deaths); }), 0]); 
            y1.domain([d3.max(data, function(d) { 
                return Math.max(d.vaccinated); }), 0]);

            svg.append("path") // Add the valueline path.
                .style("stroke", "blue")
                .style("fill", "none")
                .attr("d", valueline(data));

            svg.append("path")        // Add the valueline2 path.
                .style("stroke", "red")
                .style("fill", "none")
                .attr("d", valueline2(data));

            svg.append("g")            // Add the X Axis
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            svg.append("g")
                .attr("class", "y axis")
                .style("fill", "steelblue")
                .call(yAxisLeft);	

            svg.append("g")				
                .attr("class", "y axis")	
                .attr("transform", "translate(" + width + " ,0)")	
                .style("fill", "red")		
                .call(yAxisRight);

            svg.append("text")
                .attr("class", "y label")
                .attr("text-anchor", "end")
                .attr("y", 6)
                .attr("dy", ".75em")
                .attr("transform", "rotate(-90)")
                .text("life expectancy (years)");


            // svg.append("text")
            //     .attr("class", "y label")
            //     .attr("text-anchor", "end")
            //     .attr("x", width)
            //     .attr("y", height + 30)
            //     .attr("fill","black")
            //     .text("Time (year)");
        }
    )


