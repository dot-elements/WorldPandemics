var margin = { top: 50, right: 200, bottom: 30, left: 60 },
  width = document.getElementById("measles").clientWidth - 300,
  height = 300 - margin.top - margin.bottom;

var x = d3.scaleTime().range([0, width]);
var y0 = d3.scaleLinear().range([0, height]);
var y1 = d3.scaleLinear().range([0, height]);

var xAxis = d3.axisBottom(x).tickFormat(d3.format("d"));
var yAxisLeft = d3.axisLeft(y0).ticks(5);
var yAxisRight = d3.axisRight(y1).tickFormat(d3.format(".0%"));

// append the svg object to the body of the page
const svg = d3
  .select("#measles")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);
console.log("sdf");
//Read the data
d3.csv(
  "assets\\data\\measles_from_1980_6_countries.csv",
  function (d) {
    return {
      year: d.year,
      China_cases: d.China_cases,
      China_vaccinated: d.China_vaccinated,
      Ecuador_cases: d.Ecuador_cases,
      Ecuador_vaccinated: d.Ecuador_vaccinated,
      Ethiopia_cases: d.Ecuador_cases,
      Ethiopia_vaccinated: d.Ethiopia_vaccinated,
      Hungary_cases: d.Hungary_cases,
      Hungary_vaccinated: d.Hungary_vaccinated,
      Myanmar_cases: d.Myanmar_cases,
      Myanmar_vaccinated: d.Myanmar_vaccinated,
      Syria_cases: d.Syria_cases,
      Syria_vaccinated: d.Syria_vaccinated,
      United_States_cases: d.United_States_cases,
      United_States_vaccinated: d.United_States_vaccinated,
      World_cases: d.World_cases,
      World_vaccinated: d.World_vaccinated,
    };
  },
  function (data) {
    console.log("my print::::::");
    console.log(data);
    // List of groups (here I have one group per column)
    const countries = [
      "World",
      "China",
      "Ecuador",
      "Ethiopia",
      "Hungary",
      "Myanmar",
      "Syria",
      "United States",
    ];

    // add the options to the button
    d3.select("#selectButton")
      .selectAll("myOptions")
      .data(countries)
      .enter()
      .append("option")
      .text(function (d) {
        return d;
      }) // text showed in the menu
      .attr("value", function (d) {
        return d;
      }); // corresponding value returned by the button

    x.domain(
      d3.extent(data, function (d) {
        return d.year;
      })
    );
    y0.domain([
      d3.max(data, function (d) {
        return Math.max(d.World_cases);
      }),
      0,
    ]);
    y1.domain([
      d3.max(data, function (d) {
        return Math.max(d.World_vaccinated);
      }),
      0,
    ]);

    svg
      .append("g") // Add the X Axis
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    svg
      .append("g")
      .attr("class", "y axis")
      .style("fill", "#fc8e62")
      .call(yAxisLeft);

    svg
      .append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + width + " ,0)")
      .style("fill", "#66c2a5")
      .call(yAxisRight);

    // Initialize line with group a
    const line_blue = svg
      .append("g")
      .append("path")
      .datum(data)
      .attr(
        "d",
        d3
          .line()
          .x(function (d) {
            return x(+d.year);
          })
          .y(function (d) {
            return y1(+d.World_vaccinated);
          })
      )
      .style("stroke", "#66c2a5")
      .style("stroke-width", 4)
      .style("fill", "none");
    const line_red = svg
      .append("g")
      .append("path")
      .datum(data)
      .attr(
        "d",
        d3
          .line()
          .x(function (d) {
            return x(+d.year);
          })
          .y(function (d) {
            return y0(+d.World_cases);
          })
      )
      .style("stroke", "#fc8e62")
      .style("stroke-width", 4)
      .style("fill", "none");

    // A function that update the chart
    function update(selectedGroup) {
      // Create new data with the selection?
      const dataFilter = data.map(function (d) {
        var selected_cases = "none cases";
        var selected_vaccinated = "none vac";
        switch (selectedGroup) {
          case "World":
            y0.domain([
              d3.max(data, function (d) {
                return Math.max(d.World_cases);
              }),
              0,
            ]);
            y1.domain([
              d3.max(data, function (d) {
                return Math.max(d.World_vaccinated);
              }),
              0,
            ]);
            selected_cases = d["World_cases"];
            selected_vaccinated = d["World_vaccinated"];
            break;
          case "China":
            y0.domain([
              d3.max(data, function (d) {
                return Math.max(d.China_cases);
              }),
              0,
            ]);
            y1.domain([
              d3.max(data, function (d) {
                return Math.max(d.China_vaccinated);
              }),
              0,
            ]);
            selected_cases = d["China_cases"];
            selected_vaccinated = d["China_vaccinated"];
            break;
          case "Ecuador":
            y0.domain([
              d3.max(data, function (d) {
                return Math.max(d.Ecuador_cases);
              }),
              0,
            ]);
            y1.domain([
              d3.max(data, function (d) {
                return Math.max(d.Ecuador_vaccinated);
              }),
              0,
            ]);
            selected_cases = d["Ecuador_cases"];
            selected_vaccinated = d["Ecuador_vaccinated"];
            break;
          case "Ethiopia":
            y0.domain([
              d3.max(data, function (d) {
                return Math.max(d.Ethiopia_cases);
              }),
              0,
            ]);
            y1.domain([
              d3.max(data, function (d) {
                return Math.max(d.Ethiopia_vaccinated);
              }),
              0,
            ]);
            selected_cases = d["Ethiopia_cases"];
            selected_vaccinated = d["Ethiopia_vaccinated"];
            break;
          case "Hungary":
            y0.domain([
              d3.max(data, function (d) {
                return Math.max(d.Hungary_cases);
              }),
              0,
            ]);
            y1.domain([
              d3.max(data, function (d) {
                return Math.max(d.Hungary_vaccinated);
              }),
              0,
            ]);
            selected_cases = d["Hungary_cases"];
            selected_vaccinated = d["Hungary_vaccinated"];
            break;
          case "Myanmar":
            y0.domain([
              d3.max(data, function (d) {
                return Math.max(d.Myanmar_cases);
              }),
              0,
            ]);
            y1.domain([
              d3.max(data, function (d) {
                return Math.max(d.Myanmar_vaccinated);
              }),
              0,
            ]);
            selected_cases = d["Myanmar_cases"];
            selected_vaccinated = d["Myanmar_vaccinated"];
            break;
          case "Syria":
            y0.domain([
              d3.max(data, function (d) {
                return Math.max(d.Syria_cases);
              }),
              0,
            ]);
            y1.domain([
              d3.max(data, function (d) {
                return Math.max(d.Syria_vaccinated);
              }),
              0,
            ]);
            selected_cases = d["Syria_cases"];
            selected_vaccinated = d["Syria_vaccinated"];
            break;
          case "United States":
            y0.domain([
              d3.max(data, function (d) {
                return Math.max(d.United_States_cases);
              }),
              0,
            ]);
            y1.domain([
              d3.max(data, function (d) {
                return Math.max(d.United_States_vaccinated);
              }),
              0,
            ]);
            selected_cases = d["United_States_cases"];
            selected_vaccinated = d["United_States_vaccinated"];
            break;
        }
        return {
          year: d.year,
          cases: selected_cases,
          vaccinated: selected_vaccinated,
        };
      });

      // Give these new data to update line
      line_blue
        .datum(dataFilter)
        .transition()
        .duration(1000)
        .attr(
          "d",
          d3
            .line()
            .x(function (d) {
              return x(+d.year);
            })
            .y(function (d) {
              return y1(+d.vaccinated);
            })
        );
      //   .attr("stroke", function(d){ return myColor(selectedGroup) })

      line_red
        .datum(dataFilter)
        .transition()
        .duration(1000)
        .attr(
          "d",
          d3
            .line()
            .x(function (d) {
              return x(+d.year);
            })
            .y(function (d) {
              return y0(+d.cases);
            })
        );
      // .attr("stroke", function(d){ return myColor(selectedGroup) })
    }

    // When the button is changed, run the updateChart function
    d3.select("#selectButton").on("change", function (event, d) {
      // recover the option that has been chosen
      const selectedOption = d3.select(this).property("value");
      // run the updateChart function with this selected option
      update(selectedOption);
    });

    svg
      .append("circle")
      .attr("cx", 535)
      .attr("cy", 50)
      .attr("r", 6)
      .style("fill", "#66c2a5");
    svg
      .append("circle")
      .attr("cx", 535)
      .attr("cy", 80)
      .attr("r", 6)
      .style("fill", "#fc8e62");
    svg
      .append("text")
      .attr("x", 555)
      .attr("y", 50)
      .text("Vaccination rate")
      .style("font-size", "15px")
      .attr("alignment-baseline", "middle");
    svg
      .append("text")
      .attr("x", 555)
      .attr("y", 80)
      .text("Cases")
      .style("font-size", "15px")
      .attr("alignment-baseline", "middle");
  }
);
