let box = document.querySelector("#sanitation"); // select the proper box in the section
let width = box.offsetWidth - 100;
let height = box.offsetHeight - 100;

// set the dimensions and margins of the graph
const margin = { top: 200, right: 60, bottom: -30, left: 60 };
const plotHeight = height - margin.top - margin.bottom;
const plotWidth = width - margin.left - margin.right;
var keysMap = {
  san_sm: "Safely managed",
  san_bas_minus_sm: "Basic",
  san_lim: "Limited",
  san_unimp: "Unimproved",
  san_od: "Open defecation",
};

// append the svg object to the body of the page
var svg = d3
  .select("#sanitation")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
svg // graph title
  .append("text")
  .attr("x", width / 2)
  .attr("y", -100)
  .attr("text-anchor", "middle")
  .text("Share of population with access to sanitation facilities 2020")
  .style("font-size", "18px")
  .style("font-weight", "bold");
let data;
var index = 0
// get the data
d3.csv("assets/data/sanitation_Acess.csv", function (json) {
  json.forEach(function (d) {
    (d["san_sm"] = +d["san_sm"]),
      (d["san_bas_minus_sm"] = +d["san_bas_minus_sm"]),
      (d["san_lim"] = +d["san_lim"]),
      (d["san_unimp"] = +d["san_unimp"]),
      (d["san_od"] = +d["san_od"]);
  });

  data = json;


var allGroup = []
for(let i =2000; i<= 2020; i++)
  allGroup.push(i)

  var subgroups = data.columns.slice(3); // list of groups from colum data

  var groups = d3.map(data, function (d) {
    return d.Entity;
  });
  // Add X axis
  var x = d3.scaleBand().domain(groups).range([0, width]).padding([0.2]);
  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(0," + plotHeight + ")")
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  // Add Y axis
  var y = d3.scaleLinear().domain([0, 100]).range([plotHeight, 0]);

  svg.append("g").call(
    d3.axisLeft(y).tickFormat(function (x) {
      return x + "%";
    })
  );

  // color palette = one color per subgroup
  var color = d3.scaleOrdinal().domain(subgroups).range(['#00876c','#78ab63','#dac767','#e18745','#d43d51']);

  //stack the data: stack per subgroup
  var stackedData = d3.stack().keys(subgroups)(data);

// we first start with year 2000
let filteredData = data.filter(x => x['Year'] == '2000')
      filteredData.columns = data.columns
update(filteredData, 2000)
// we then iterate trough all years
  d3.interval(function(){
    if (index >= allGroup.length)
        index = 0
    update(sampleFromData(data, allGroup[index]), allGroup[index]); 
    index++ 
  }, 1000);
// samples data based on year
  function sampleFromData(data, year){
    let filteredData = data.filter(x => x['Year'] == year.toString())
    filteredData.columns = data.columns
    return filteredData
  }

  //////////
  // LEGEND //
  //////////

  // Add one dot in the legend for each name.
  var size = 20;
  svg
    .selectAll("myrect")
    .data(stackedData)
    .enter()
    .append("rect")
    .attr("x", function (d, i) {
      if (i > 1 && i != 4) return margin.left + 160;
      else if (i == 4) return margin.left + 260;
      else return margin.left + 10;
    })
    .attr("y", function (d, i) {
      if (i > 1 && i != 4) return -60 + (i - 2) * (size + 5);
      else if (i == 4) return -60;
      else return -60 + i * (size + 5);
    }) 
    .attr("width", size)
    .attr("height", size)
    .style("fill", function (d) {
      return color(d.key);
    })

  //  legend for each name.

  svg
    .selectAll("mylabels")
    .data(stackedData)
    .enter()
    .append("text")
    .attr("x", function (d, i) {
      if (i > 1 && i != 4) return margin.left + 160 + size * 1.2;
      else if (i == 4) return margin.left + 260 + size * 1.2;
      else return margin.left + 10 + size * 1.2;
    })
    .attr("y", function (d, i) {
      if (i > 1 && i != 4) return -60 + (i - 2) * (size + 5) + size / 2;
      else if (i == 4) return -60 + size / 2;
      else return -60 + i * (size + 5) + size / 2;
    })
    .style("fill", function (d) {
      return color(d.key);
    })
    .text(function (d) {
      return keysMap[d.key];
    })
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")

    function update(filteredData, year) {

        d3.selectAll("svg text")
        .filter(function() {
          return /^Share/.test(d3.select(this).text());  // select title
        })
        .text("Share of population with access to sanitation facilities " + year.toString()); // change title with new year
      var stack = d3.stack().keys(subgroups)
      subgroups.forEach(function(key, key_index){
  
          var bar = svg.selectAll(".myRect" + key)
              .data(stack(filteredData)[key_index], function(d){ return d.data.Entity + "-" + key; });
  
          bar
            .transition() // transition the data with new year
              .attr("x", function(d){ return x(d.data.Entity); })
              .attr("y", function(d){ return y(d[1]); })
              .attr("height", function(d){ return y(d[0]) - y(d[1]); });
  
          bar.enter().append("rect") // change bars
              .attr("class", function (d) { return "myRect " + key;}) // Add a class to each subgroup: their name
              .attr("x", function(d){ return x(d.data.Entity); })
              .attr("y", function(d){ return y(d[1]); })
              .attr("height", function(d){ return y(d[0]) - y(d[1]); })
              .attr("width", x.bandwidth())
              .attr("fill", function(d){ return color(key); })
                   .attr("stroke", "grey")
  
        }); 
    }
});
