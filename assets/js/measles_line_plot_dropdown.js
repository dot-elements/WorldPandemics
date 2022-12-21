var margin = {top: 30, right: 200, bottom: 30, left: 60},
width = document.getElementById('measles').clientWidth - 300,
height = 300 - margin.top - margin.bottom;

var x = d3.scaleTime().range([0, width]);
var y0 = d3.scaleLinear().range([0, height]);
var y1 = d3.scaleLinear().range([0, height]);

var xAxis = d3.axisBottom(x).tickFormat(d3.format("d"));
var yAxisLeft = d3.axisLeft(y0).ticks(5);
var yAxisRight = d3.axisRight(y1).tickFormat(d3.format(".0%"));

file_name = "https://raw.githubusercontent.com/dot-elements/WorldPandemics/Georgi/assets/data/measles_from_1980_6_countries.csv"

// append the svg object to the body of the page
const svg = d3.select("#measles")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

//Read the data
d3.csv(file_name).then( function(data) {

    // List of groups (here I have one group per column)
    const countries = ["World", "China", "Ecuador", "Ethiopia", "Myanmar", "Syria", "United States"]
    const diseases = ["Measles", "Tetanus"]

    // add the options to the button
    d3.select("#selectButton")
      .selectAll('myOptions')
     	.data(countries)
      .enter()
    	.append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; }) // corresponding value returned by the button

    d3.select("#selectDisease")
      .selectAll('myOptions')
     	.data(diseases)
      .enter()
    	.append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; })


    x.domain(d3.extent(data, function(d) { return d.year; }));
    y0.domain([d3.max(data, function(d) {
        return Math.max(d.World_cases); }), 0]); 
    y1.domain([d3.max(data, function(d) { 
        return Math.max(d.World_vaccinated); }), 0]);

    // A color scale: one color for each group
    // const myColor = d3.scaleOrdinal()
    //   .domain(countries)
    //   .range(d3.schemeSet2);

    // // Add X axis --> it is a date format
    // const x = d3.scaleLinear()
    //   .domain([0,10])
    //   .range([ 0, width ]);
    // svg.append("g")
    //   .attr("transform", `translate(0, ${height})`)
    //   .call(d3.axisBottom(x));

    svg.append("g")            // Add the X Axis
         .attr("class", "x axis")
         .attr("transform", "translate(0," + height + ")")
         .call(xAxis);

    // Add Y axis
    // const y = d3.scaleLinear()
    //   .domain( [0,20])
    //   .range([ height, 0 ]);
    // svg.append("g")
    //   .call(d3.axisLeft(y));

    svg.append("g")
         .attr("class", "y axis")
         .style("fill", "red")
         .call(yAxisLeft);	

    svg.append("g")				
        .attr("class", "y axis")	
        .attr("transform", "translate(" + width + " ,0)")	
        .style("fill", "steelblue")		
        .call(yAxisRight);
    
    // Initialize line with group a
    const line_blue = svg
      .append('g')
      .append("path")
        .datum(data)
        .attr("d", d3.line()
          .x(function(d) { console.log(d); return x(+d.year) })
          .y(function(d) { return y1(+d.World_vaccinated) })
        )
        .style("stroke", "blue")
        .style("stroke-width", 4)
        .style("fill", "none")
    const line_red = svg
      .append('g')
      .append("path")
        .datum(data)
        .attr("d", d3.line()
          .x(function(d) { return x(+d.year) })
          .y(function(d) { return y0(+d.World_cases) })
        )
        .style("stroke", "red")
        .style("stroke-width", 4)
        .style("fill", "none")

    // A function that update the chart
    function update(selectedGroup) {

      // Create new data with the selection?
      const dataFilter = data.map(function(d){
            var selected_cases = 'none cases';
            var selected_vaccinated = "none vac";
            switch (selectedGroup) {
                case 'World':
                    y0.domain([d3.max(data, function(d) {
                        return Math.max(d.World_cases); }), 0]); 
                    y1.domain([d3.max(data, function(d) { 
                        return Math.max(d.World_vaccinated); }), 0]);                
                    selected_cases = d["World_cases"];
                    selected_vaccinated = d["World_vaccinated"];
                    break;
                case 'China':
                    y0.domain([d3.max(data, function(d) {
                        return Math.max(d.China_cases); }), 0]); 
                    y1.domain([d3.max(data, function(d) { 
                        return Math.max(d.China_vaccinated); }), 0]);                
                    selected_cases = d["China_cases"];
                    selected_vaccinated = d["China_vaccinated"];
                    break;
                case 'Ecuador':
                    y0.domain([d3.max(data, function(d) {
                        return Math.max(d.Ecuador_cases); }), 0]); 
                    y1.domain([d3.max(data, function(d) { 
                        return Math.max(d.Ecuador_vaccinated); }), 0]);                
                    selected_cases = d["Ecuador_cases"];
                    selected_vaccinated = d["Ecuador_vaccinated"];
                    break;
                case 'Ethiopia':
                    y0.domain([d3.max(data, function(d) {
                        return Math.max(d.Ethiopia_cases); }), 0]); 
                    y1.domain([d3.max(data, function(d) { 
                        return Math.max(d.Ethiopia_vaccinated); }), 0]);                
                    selected_cases = d["Ethiopia_cases"];
                    selected_vaccinated = d["Ethiopia_vaccinated"];
                    break;
                case 'Myanmar':
                    y0.domain([d3.max(data, function(d) {
                        return Math.max(d.Myanmar_cases); }), 0]); 
                    y1.domain([d3.max(data, function(d) { 
                        return Math.max(d.Myanmar_vaccinated); }), 0]);                
                    selected_cases = d["Myanmar_cases"];
                    selected_vaccinated = d["Myanmar_vaccinated"];
                    break;
                case 'Syria':
                    y0.domain([d3.max(data, function(d) {
                        return Math.max(d.Syria_cases); }), 0]); 
                    y1.domain([d3.max(data, function(d) { 
                        return Math.max(d.Syria_vaccinated); }), 0]);                
                    selected_cases = d["Syria_cases"];
                    selected_vaccinated = d["Syria_vaccinated"];
                    break;
                case 'United States':
                    y0.domain([d3.max(data, function(d) {
                        return Math.max(d.United_States_cases); }), 0]); 
                    y1.domain([d3.max(data, function(d) { 
                        return Math.max(d.United_States_vaccinated); }), 0]);                
                    selected_cases = d["United_States_cases"];
                    selected_vaccinated = d["United_States_vaccinated"];
                    break;

            }
            return {year: d.year, cases : selected_cases, vaccinated: selected_vaccinated};
    
        })

      // Give these new data to update line
      line_blue
          .datum(dataFilter)
          .transition()
          .duration(1000)
          .attr("d", d3.line()
            .x(function(d) { return x(+d.year) })
            .y(function(d) { return y1(+d.vaccinated) })
          )
        //   .attr("stroke", function(d){ return myColor(selectedGroup) })
    
        line_red
            .datum(dataFilter)
            .transition()
            .duration(1000)
            .attr("d", d3.line()
            .x(function(d) { return x(+d.year) })
            .y(function(d) { return y0(+d.cases) })
            )
            // .attr("stroke", function(d){ return myColor(selectedGroup) })
    }

    function update_disease(disease) {
        
    }

    // When the button is changed, run the updateChart function
    d3.select("#selectButton").on("change", function(event,d) {
        // recover the option that has been chosen
        const selectedOption = d3.select(this).property("value")
        // run the updateChart function with this selected option
        update(selectedOption)
    })

    // When the button is changed, run the updateChart function
    d3.select("#selectDisease").on("change", function(event,d) {
        // recover the option that has been chosen
        const selectedDisease = d3.select(this).property("value")
        // run the updateChart function with this selected option
        update_disease(selectedDisease)
    })

    svg.append("circle").attr("cx",830).attr("cy",50).attr("r", 6).style("fill", "blue")
    svg.append("circle").attr("cx",830).attr("cy",80).attr("r", 6).style("fill", "red")
    svg.append("text").attr("x", 850).attr("y", 50).text("Vaccination rate").style("font-size", "15px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", 850).attr("y", 80).text("Cases").style("font-size", "15px").attr("alignment-baseline","middle")

})