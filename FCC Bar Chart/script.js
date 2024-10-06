d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json')
  .then(data => {
    const dataset = data.data;
    const width = 800;
    const height = 400;
    const margin = { top: 80, right: 20, bottom: 50, left: 60 };

    // SVG Creation
    const svg = d3.select("#chart-line")
                  .append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Scaling
    const xScale = d3.scaleTime()
                     .domain([new Date(d3.min(dataset, d => d[0])), new Date(d3.max(dataset, d => d[0]))])
                     .range([0, width]);

    const yScale = d3.scaleLinear()
                     .domain([0, d3.max(dataset, d => d[1])])
                     .range([height, 0]);

    // Tooltip Creation
    const tooltip = d3.select("body").append("div")
                      .attr("id", "tooltip")
                      .style("display","flex")
                      .style("position", "absolute")
                      .style("visibility", "hidden")
                      .style("background", "#fff")
                      .style("padding", "5px")
                      .style("border", "1px solid #000")
                      .style("border-radius", "5px");

    // Axes
    svg.append("g")
       .attr("transform", `translate(0, ${height})`)
       .attr("id", "x-axis")
       .call(d3.axisBottom(xScale));

    svg.append("g")
       .attr("id", "y-axis")
       .call(d3.axisLeft(yScale));

    // Bars
    svg.selectAll(".bar")
       .data(dataset)
       .enter()
       .append("rect")
       .attr("class", "bar")
       .attr("x", d => xScale(new Date(d[0])))
       .attr("y", d => yScale(d[1]))
       .attr("width", width / dataset.length)
       .attr("height", d => height - yScale(d[1]))
       .attr("data-date", d => d[0])
       .attr("data-gdp", d => d[1])
       .on("mouseover", function (event, d) {
         console.log(d); // Log d to check its structure
         tooltip.style("visibility", "visible")
                .html(`Date: ${d[0]}<br>GDP: ${d[1]}`)
                .attr("data-date", d[0]);
       })
       .on("mousemove", function (event) {
         tooltip.style("top", (event.pageY - 10 + tooltip.node().offsetHeight) + "px")
                .style("left", (event.pageX + 10 + tooltip.node().offsetWidth) + "px")
                .style("cursor", "pointer");
       })
       .on("mouseout", function () {
         tooltip.style("visibility", "hidden");
       });
  })
  .catch(err => console.error("Failed to load data: ", err));
