let box = document.querySelector("#disease_rankings"); // select the proper box in the section
let width = box.offsetWidth;
let height = box.offsetHeight;
const margin = { top: 80, right: 50, bottom: 60, left: 170 };
const plotHeight = height - margin.top - margin.bottom;
const plotWidth = width - margin.left - margin.right;
// create the svg
const svg = d3
  .select("#disease_rankings")
  .append("svg")
  .attr("xmlns", "http://www.w3.org/2000/svg")
  .attr("width", width)
  .attr("height", height);
// add title
svg
  .append("text")
  .attr("x", width / 2 + 100)
  .attr("y", (margin.top / 3) * 2)
  .attr("text-anchor", "middle")
  .text("Worldwide burden of disease, by cause ")
  .style("font-size", "18px")
  .style("font-weight", "bold");

const documentOutline = svg
  .append("rect")
  .attr("height", height)
  .attr("width", width)
  .attr("x", 0)
  .attr("y", 0)
  .style("stroke", "#000")
  .style("fill", "none");

const plotOutline = svg
  .append("rect")
  .attr("x", margin.left)
  .attr("y", margin.top)
  .attr("height", plotHeight)
  .attr("width", plotWidth)
  .style("fill", "#00AFDB");

const g = svg.append("g").attr("transform", `translate(0, ${plotHeight})`);
// make the scales
const scaleX = d3.scaleLinear().range([0, plotWidth]);
const scaleY = d3.scaleBand().rangeRound([0, plotHeight]).paddingInner(0.1);

// get the data
d3.csv("assets/data/disease_burden.csv", function (json) {
  json.forEach(function (d) {
    (d["disease"] = d["disease"]), (d["value"] = +d["value"]);
  });
  json.sort(function (b, a) {
    return a.value - b.value;
  });
  update(json);
});

// this plots the data
function update(new_data) {
  scaleX.domain([0, d3.max(new_data, (d) => d.value)]);
  scaleY.domain(new_data.map((d) => d.disease));
  const axisX = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${plotHeight + margin.top})`)
    .call(d3.axisBottom(scaleX));
  // x axis labels
  axisX
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");
  const axisY = svg
    .append("g")
    .call(d3.axisLeft(scaleY).tickSize(0))
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
    .style("font-size", "12px")
    .style("font-weight", "light")
    .style("fill", "#000")
    .style("stroke", "none");
  // y axis labels
  svg
    .append("text")
    .attr("text-anchor", "end")
    .attr("x", margin.left + plotWidth + 35)
    .attr("y", margin.top + plotHeight + 25)
    .text("DALY")
    .style("font-size", "14px")
    .style("font-weight", "bold");

  documentOutline.remove(); // remove the outlines
  plotOutline.remove();
  axisY.call((g) => g.select(".domain").remove());
  // make the plot bars
  const bars = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
    .selectAll("rect")
    .data(new_data);
  bars
    .enter()
    .append("rect")
    .attr("width", (data) =>  scaleX(data.value))
    .attr("height", scaleY.bandwidth())
    .attr("y", (data) => scaleY(data.disease))
    .attr("x", 0.5)
    .attr("fill", "#69b3a2")
    .style("stroke", "#000");
}
