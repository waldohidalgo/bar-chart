document.addEventListener("DOMContentLoaded", async function () {
  try {
    const response = await d3.json(
      "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
    );
    const data = response.data;
    const dates = data.map((d) => new Date(d[0]));
    const values = data.map((d) => d[1]);

    const width = 960;
    const height = 450;
    const padding = 100;
    const paddingX = 50;
    const paddingTop = 10;
    const widthRect = 3;

    const contenedor = d3.select(".contenedor_grafico");
    const svg = contenedor
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("background-color", "#f0f0f0");

    const xScale = d3
      .scaleUtc()
      .domain([d3.min(dates), d3.max(dates)])
      .range([paddingX, width - paddingX]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(values)])
      .range([height - padding, paddingTop]);

    svg
      .append("text")
      .attr("x", -200)
      .attr("y", 75)
      .attr("transform", "rotate(-90)")
      .attr("class", "label-y")
      .text("Millions of USD");

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - padding + 40)
      .attr("class", "label-x")
      .text("Quarters");

    svg
      .append("text")
      .attr("x", (width * 2) / 3)
      .attr("y", height - padding + 70)
      .attr("class", "more-info")
      .text("Source: Federal Reserve Economic Data ");

    svg
      .append("text")
      .attr("x", (width * 2) / 3 - 25)
      .attr("y", height - padding + 85)
      .attr("class", "more-info")

      .text("Data: https://fred.stlouisfed.org/data/GDP.txt");

    svg
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("data-date", (d, i) => d[0])
      .attr("data-gdp", (d, i) => d[1])
      .attr("width", widthRect)
      .attr("height", (d, i) => height - padding - yScale(values[i]))
      .attr("x", (d, i) => xScale(dates[i]))
      .attr("y", (d, i) => yScale(values[i]))
      .on("mouseover", function (event, d) {
        const [x, y] = d3.pointer(event);
        const xPosition = x > 740 ? x - 15 - 150 : x + 15;
        const yPosition = yScale(d[1]) + (height - padding - yScale(d[1])) / 2;

        const dateFormateada = d3.utcFormat("%Y %q")(new Date(d[0]));

        tooltip
          .style("top", yPosition + "px")
          .style("left", xPosition + "px")
          .attr("data-date", d[0])
          .html(
            `<div>${dateFormateada}Q</div>
             <div>$ ${d[1].toLocaleString("en-US")} Billions</div>`
          )
          .style("display", "block");
      })
      .on("mouseout", function () {
        tooltip.style("display", "none");
      });

    svg
      .append("g")
      .attr("transform", `translate(${0}, ${height - padding})`)
      .attr("class", "x-axis")
      .attr("id", "x-axis")
      .call(
        d3.axisBottom(
          d3
            .scaleUtc()
            .domain([d3.min(dates), d3.max(dates)])
            .range([paddingX, width - paddingX + widthRect])
        )
      );

    svg
      .append("g")
      .attr("transform", `translate(${paddingX}, ${0})`)
      .attr("class", "y-axis")
      .attr("id", "y-axis")
      .call(d3.axisLeft(yScale));

    const tooltip = d3
      .select(".contenedor_grafico")
      .append("div")
      .attr("id", "tooltip")
      .attr("class", "tooltip")
      .style("display", "none");
  } catch (error) {
    console.log(error);
  }
});
