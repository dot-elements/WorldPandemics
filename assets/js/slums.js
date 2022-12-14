let box = document.querySelector("#disease_rankings"); // select the proper box in the section
let width = box.offsetWidth - 100;
let height = box.offsetHeight - 100;
// set the dimensions and margins of the graph
const margin = { top: 100, right: 60, bottom: 100, left: 60 };
const plotHeight = height - margin.top - margin.bottom;
const plotWidth = width - margin.left - margin.right;

// append the svg object to the body of the page
var svg = d3
  .select("#slums")
  .append("svg")
  .attr("width", plotWidth + margin.left + margin.right )
  .attr("height", plotHeight + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
svg // add title to svg
  .append("text")
  .attr("x", width / 2)
  .attr("y", margin.top / 2)
  .attr("text-anchor", "middle")
  .text("Number of people living in urban slum households: World, 2000 to 2018")
  .style("font-size", "18px")
  .style("font-weight", "bold");

let data; // get the data
d3.csv("assets/data/urban-pop-in-out-of-slums.csv", function (json) {
  json.forEach(function (d) {
    (d["Urban population not living in slums"] =
      +d["Urban population not living in slums"]),
      (d["Urban population living in slums"] =
        +d["Urban population not living in slums"]);
  });

  data = json;
  var keys = json.columns.slice(-2);
  var color = d3.scaleOrdinal().domain(keys).range(['#00876c','#d43d51']);
  var stackedData = d3.stack().keys(keys)(data); // stack data

  //////////
  // AXIS //
  //////////

  // Add X axis
  var x = d3
    .scaleLinear()
    .domain(
      d3.extent(data, function (d) {
        return d.Year;
      })
    )
    .range([0, plotWidth]);
  var xAxis = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${plotHeight })`)
    .call(d3.axisBottom(x).ticks(5).tickFormat((d,i) => d.toString())); // make the dates into strings on x axis


  // Add X axis label:
  svg
    .append("text")
    .attr("text-anchor", "end")
    .attr("x", margin.left + plotWidth )
    .attr("y", margin.top + plotHeight - 70)
    .text("Time (year)")
    .style("font-size", "14px")
    .style("font-weight", "bold");

  // Add Y axis label:
  svg
    .append("text")
    .attr("x", margin.left - 110)
    .attr("y", margin.top + 10)
    .text("Number of people")
    .attr("text-anchor", "start")
    .style("font-size", "14px")
    .style("font-weight", "bold");

  // Add Y axis
  var y = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(data, (d) => d["Urban population living in slums"]) +
        d3.max(data, (d) => d["Urban population not living in slums"]),
    ])
    .range([plotHeight - margin.top , 0]);
  svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
    .call(d3.axisLeft(y).ticks(5));

  //////////
  // BRUSHING AND CHART //
  //////////

  // Add a clipPath: everything out of this area won't be drawn.
  var clip = svg
    .append("defs")
    .append("svg:clipPath")
    .attr("id", "clip")
    .append("svg:rect")
    .attr("width", plotWidth)
    .attr("height", plotHeight)
    .attr("x", 0)
    .attr("y", 0);

  // Add brushing
  var brush = d3
    .brushX() // Add the brush feature using the d3.brush function
    .extent([
      [0, 0],
      [plotWidth, plotHeight],
    ]) // initialise the brush area: start at 0,0 and finishes at width,height
    .on("end", updateChart); // Each time the brush selection changes, trigger the 'updateChart' function

  var areaChart = svg
    .append("g")
    .attr("clip-path", "url(#clip)")
    .attr("transform", `translate(${margin.left}, ${margin.bottom +20})`);

  // Area generator
  var area = d3
    .area()
    .x(function (d) {
      return x(d.data.Year);
    })
    .y0(function (d) {
      return y(d[0]);
    })
    .y1(function (d) {
      return y(d[1]);
    });

  // Show the areas
  areaChart
    .selectAll("mylayers")
    .data(stackedData)

    .enter()
    .append("path")
    .attr("class", function (d) {
      if (d.key == "Urban population living in slums") return "myArea Yes";
      else return "myArea Not";
    })
    .style("fill", function (d) {
      return color(d.key);
    })
    .attr("d", area);

  // Add the brushing
  areaChart.append("g").attr("class", "brush").call(brush);

  var idleTimeout;
  function idled() {
    idleTimeout = null;
  }

  // A function that update the chart for given boundaries
  function updateChart() {
    let extent = d3.event.selection;

    // If no selection, back to initial coordinate. Otherwise, update X axis domain
    if (!extent) {
      if (!idleTimeout) return (idleTimeout = setTimeout(idled, 350)); // This allows to wait a little bit
      x.domain(
        d3.extent(data, function (d) {
          return d.Year;
        })
      );
    } else {
      x.domain([x.invert(extent[0]), x.invert(extent[1])]);
      areaChart.select(".brush").call(brush.move, null); // This remove the grey brush area as soon as the selection has been done
    }

    // Update axis and area position
    xAxis.transition().duration(1000).call(d3.axisBottom(x).ticks(5).tickFormat((d,i) => d.toString()));
    areaChart.selectAll("path").transition().duration(1000).attr("d", area);
  }

  //////////
  // HIGHLIGHT GROUP //
  //////////

  // hover functionality
  var highlight = function (d) {
    // reduce opacity of all groups
    d3.selectAll(".myArea").style("opacity", 0.1);
    // expect the one that is hovered
    let sel = "";
    if (d == "Urban population living in slums") sel = ".Yes";
    else sel = ".Not";
    d3.select(sel).style("opacity", 1);
  };

  // And when it is not hovered anymore
  var noHighlight = function (d) {
    d3.selectAll(".myArea ").style("opacity", 1);
  };

  //////////
  // LEGEND //
  //////////

  // Add one dot in the legend for each name.
  var size = 20;
  svg
    .selectAll("myrect")
    .data(keys)
    .enter()
    .append("rect")
    .attr("x", margin.left + 10)
    .attr("y", function (d, i) {
      return margin.top + i * (size + 5);
    }) 
    .attr("width", size)
    .attr("height", size)
    .style("fill", function (d) {
      return color(d);
    })
    .on("mouseover", highlight) // highlight in the legend as well
    .on("mouseleave", noHighlight);

  // the legend for each name.
  svg
    .selectAll("mylabels")
    .data(keys)
    .enter()
    .append("text")
    .attr("x", margin.left + 10 + size * 1.2)
    .attr("y", function (d, i) {
      return margin.top + i * (size + 5) + size / 2;
    }) 
    .style("fill", function (d) {
      return color(d);
    })
    .text(function (d) {
      return d;
    })
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
    .on("mouseover", highlight)
    .on("mouseleave", noHighlight);
});
