var margin = {top: 10, right: 200, bottom: 30, left: 60},
width = document.getElementById('tetanus').clientWidth - 300,
height = 300 - margin.top - margin.bottom;

// var parseDate = d3.timeFormat("%y").parse;

var x = d3.scaleTime().range([0, width]);
var y0 = d3.scaleLinear().range([0, height]);
var y1 = d3.scaleLinear().range([0, height]);

var xAxis = d3.axisBottom(x).tickFormat(d3.format("d"));

var yAxisLeft = d3.axisLeft(y0).ticks(5);

var yAxisRight = d3.axisRight(y1).tickFormat(d3.format(".0%")); 

var valueline = d3.line()
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y0(d.cases); });
    
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
        return {year : data.year, cases : +data.cases, vaccinated : +data.percentage_vaccinated}
    // data.forEach(function(d) {
    //     d.date = parseDate(d.date);
    //     d.close = +d.close;
    //     d.open = +d.open;
    }).then(
        function(data) {
            // Scale the range of the data
            x.domain(d3.extent(data, function(d) { return d.year; }));
            y0.domain([d3.max(data, function(d) {
                return Math.max(d.cases); }), 0]); 
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
            
            svg.append("circle").attr("cx",830).attr("cy",50).attr("r", 6).style("fill", "blue")
            svg.append("circle").attr("cx",830).attr("cy",80).attr("r", 6).style("fill", "red")
            svg.append("text").attr("x", 850).attr("y", 50).text("Cases").style("font-size", "15px").attr("alignment-baseline","middle")
            svg.append("text").attr("x", 850).attr("y", 80).text("Vaccination rate").style("font-size", "15px").attr("alignment-baseline","middle")
            
        }
    )


