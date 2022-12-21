let box = document.querySelector('#sanitation');
let width = box.offsetWidth - 100;
let height = box.offsetHeight - 100;

// set the dimensions and margins of the graph
// set the dimensions and margins of the graph
const margin = { top: 200, right: 60, bottom: -30, left: 60 }
// var margin = {top: 60, right: 230, bottom: 50, left: 50}
const plotHeight = height - margin.top - margin.bottom
const plotWidth = width - margin.left - margin.right
var keysMap = {
    "san_sm" : "Safely managed", 
    "san_bas_minus_sm" : "Basic", 
    "san_lim" : "Limited",
    "san_unimp": "Unimproved",
    "san_od": "Open defecation"
};

// append the svg object to the body of the page
var svg = d3.select("#sanitation")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
    svg
    .append("text")
    .attr("x", width / 2 )
    .attr("y", (-100) )
    .attr("text-anchor", "middle")
    .text("Share of population with access to sanitation facilities 2020")
    .style("font-size", "18px")
    .style("font-weight", "bold")
let data;
d3.csv("assets/data/sanitation_Acess.csv", function(json) {
    json.forEach(function(d)
    {   d['san_sm'] = +d['san_sm'],
        d['san_bas_minus_sm'] = +d['san_bas_minus_sm'],
        d['san_lim'] = +d['san_lim'],
        d['san_unimp'] = +d['san_unimp'],
        d['san_od'] = +d['san_od'];
    });   
    console.log(json)

    data = json

  // List of subgroups = header of the csv files = soil condition here
  var subgroups = data.columns.slice(3)
  console.log(subgroups)
  // List of groups = species here = value of the first column called group -> I show them on the X axis
  
  var groups = d3.map(data, function(d){return(d.Entity)})
    console.log(groups)
  // Add X axis
  var x = d3.scaleBand()
      .domain(groups)
      .range([0, width])
      .padding([0.2])
  svg.append("g")
    .attr("transform", "translate(0," + plotHeight + ")")
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .selectAll("text")
                .attr("transform", "translate(-10,0)rotate(-45)")
                .style("text-anchor", "end")

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 100])
    .range([ plotHeight, 0 ]);

  svg.append("g")
    .call(d3.axisLeft(y).tickFormat(function(x) { return x + "%" }));

  // color palette = one color per subgroup
  var color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(d3.schemeSet2);

  //stack the data? --> stack per subgroup
  var stackedData = d3.stack()
    .keys(subgroups)
    (data)




  // ----------------
  // Highlight a specific subgroup when hovered
  // ----------------

  // What happens when user hover a bar
  var mouseover = function(d) {
    // what subgroup are we hovering?
    var subgroupName = d3.select(this.parentNode).datum().key; // This was the tricky part
    var subgroupValue = d.data[subgroupName];
    // Reduce opacity of all rect to 0.2
    d3.selectAll(".myRect").style("opacity", 0.2)
    // Highlight all rects of this subgroup with opacity 0.8. It is possible to select them since they have a specific class = their name.
    d3.selectAll("."+subgroupName)
      .style("opacity", 1)
    }

  // When user do not hover anymore
  var mouseleave = function(d) {
    // Back to normal opacity: 0.8
    d3.selectAll(".myRect")
      .style("opacity",0.8)
    }

  // Show the bars
  svg.append("g")
    .selectAll("g")
    // Enter in the stack data = loop key per key = group per group
    .data(stackedData)
    .enter().append("g")
      .attr("fill", function(d) { return color(d.key); })
      .attr("class", function(d){ return "myRect " + d.key }) // Add a class to each subgroup: their name
      .selectAll("rect")
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data(function(d) { return d; })
      .enter().append("rect")
        .attr("x", function(d) { return x(d.data.Entity); })
        .attr("y", function(d) { return y(d[1]); })
        .attr("height", function(d) { return y(d[0]) - y(d[1]); })
        .attr("width",x.bandwidth())
        .attr("stroke", "grey")
      .on("mouseover", mouseover)
      .on("mouseleave", mouseleave)


            //////////
        // LEGEND //
        //////////

    // Add one dot in the legend for each name.
    var size = 20
    svg.selectAll("myrect")
        .data(stackedData)
        .enter()
        .append("rect")
        .attr("x",function(d,i){ 
             if(i > 1 && i!=4)
                return margin.left + 160
            else if(i == 4)
                return margin.left + 260
            else
                return margin.left + 10})
        .attr("y", function(d,i){ 
            if(i > 1 && i!=4)
                return -60 + (i-2)*(size+5)
            else if(i ==4)
                return -60 
            else
                return -60 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("width", size)
        .attr("height", size)
        .style("fill", function(d){ return color(d.key)})
        .on("mouseover", mouseover)
        .on("mouseleave", mouseleave)

    // Add one dot in the legend for each name.

    svg.selectAll("mylabels")
        .data(stackedData)
        .enter()
        .append("text")
        // .attr("x",  margin.left + 10 + size*1.2)
        .attr("x",function(d,i){ 
            if(i > 1 && i!=4)
               return margin.left + 160+ size*1.2
           else if(i == 4)
               return margin.left + 260+ size*1.2
           else
               return margin.left + 10+ size*1.2})
        // .attr("y", function(d,i){ return margin.top  + i*(size+5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("y", function(d,i){ 
            if(i > 1 && i!=4)
                return -60 + (i-2)*(size+5) + (size/2)
            else if(i ==4)
                return -60 + (size/2)
            else
                return -60 + i*(size+5) + (size/2)})
        .style("fill", function(d){ return color(d.key)})
        .text(function(d){ console.log(d);return keysMap[d.key]})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .on("mouseover", mouseover)
        .on("mouseleave", mouseleave)

})

