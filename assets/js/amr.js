// question
// Y/N 2.8.1 Country has laws or regulations on prescription and sale of antimicrobials, for human use.
// Y/N 2.8.2 Country has laws or regulations on prescription and sale of antimicrobials for terrestrial animal use.
// Y/N 2.8.4 Country has laws or regulations on prescription and sale of medicated feed .
// Y/N 2.10 Do school-going children and youth (primary and secondary) receive education on antimicrobial resistance, as a long-term investment in mitigating AMR?
// Y/N 2.11 Is the country using relevant antimicrobial consumption/use data to inform operational decision making and amend policies
// Y/N 2.13 Has the country established or starting the implementation of an Integrated Surveillance System for Antimicrobial Resistance

// 2.9 Raising awareness and understanding of AMR risks and response
// 2.3 Country progress with development of a national action plan on AMR 
// 3.1 Training and professional education on AMR in the human health sector
// 3.2 National monitoring system for consumption and rational use of antimicrobials in human health
// 3.4.2 Does the country have one or more reference lab/s performing AST/susceptibility testing for Acinetobacter baumannii, Pseudomonas aeruginosa, Enterobacteriaceae E.coli, Klebsiella, Proteus, Enterococcus faecium, Staphylococcus aureus, Campylobacter spp., Salmonellae, Neisseria gonorrhoeae Streptococcus pneumoniae, Haemophilus influenzae, Shigella spp.
// 4.5.a Do you have a national plan or system in place for monitoring sales/use of antimicrobials in animals?
// 4.9 Biosecurity and good animal husbandry practices to reduce the use of antimicrobials and minimize development and transmission of AMR in terrestrial animal production


var margin = {top: 10, right: 30, bottom: 20, left: 50},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#amr")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
d3.csv("assets/data/amr.csv", function(data) {

  // List of subgroups = header of the csv files = soil condition here
  var subgroups = data.columns.slice(1)
  console.log(subgroups)

  // List of groups = species here = value of the first column called group -> I show them on the X axis
  var groups = d3.map(data, function(d){return(d.question)})
    console.log(groups)
  // Add X axis
  var x = d3.scaleBand()
      .domain(groups)
      .range([0, width])
      .padding([0.2])
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSize(0));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 170])
    .range([ height, 0 ]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Another scale for subgroup position?
  var xSubgroup = d3.scaleBand()
    .domain(subgroups)
    .range([0, x.bandwidth()])
    .padding([0.05])

  // color palette = one color per subgroup
  var color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#e41a1c','#377eb8','#4daf4a'])

  // Show the bars
  svg.append("g")
    .selectAll("g")
    // Enter in data = loop group per group
    .data(data)
    .enter()
    .append("g")
      .attr("transform", function(d) { return "translate(" + x(d.question) + ",0)"; })
    .selectAll("rect")
    .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
    .enter().append("rect")
      .attr("x", function(d) { return xSubgroup(d.key); })
      .attr("y", function(d) { return y(d.value); })
      .attr("width", xSubgroup.bandwidth())
      .attr("height", function(d) { return height - y(d.value); })
      .attr("fill", function(d) { return color(d.key); });

svg.append("circle").attr("cx",100).attr("cy",40).attr("r", 6).style("fill", "#e41a1c")
svg.append("circle").attr("cx",100).attr("cy",60).attr("r", 6).style("fill", "#387eb8")
svg.append("text").attr("x", 120).attr("y", 40).text("Yes").style("font-size", "20px").attr("alignment-baseline","middle").style("fill", "black")
svg.append("text").attr("x", 120).attr("y", 60).text("No").style("font-size", "20px").attr("alignment-baseline","middle").style("fill", "black")


})