/*
Eveline Tiekink
11267321
A scatterplot for the UvA course Dataprocessing
*/

window.onload = function () {

  // defines the data
  var womenInScience = "http://stats.oecd.org/SDMX-JSON/data/MSTI_PUB/TH_WRXRS.FRA+DEU+KOR+NLD+PRT+GBR/all?startTime=2007&endTime=2015"
  var consConf = "http://stats.oecd.org/SDMX-JSON/data/HH_DASH/FRA+DEU+KOR+NLD+PRT+GBR.COCONF.A/all?startTime=2007&endTime=2015"
  var requests = [d3.json(womenInScience), d3.json(consConf), d3.csv("values.csv")];


  Promise.all(requests).then(function(response) {

      // makes a list with all the years
      years = []
      for (var i = 0; i < 9; i++) {
        years.push(response[0].structure.dimensions.observation[0].values[i].name)
      }

      // makes a list with all the countries
      countries = []
      for (var i = 0; i < 6; i++) {
        countries.push(response[0].structure.dimensions.series[1].values[i].name)
      }

      // makes a list with data of the amount of women in science
      data = []
      for (var i = 0; i < 6; i++) {
        number = i.toString()
        for (var j = 0; j < 9; j++) {
          try {
            data.push(response[0].dataSets[0].series["0:" + [number]].observations[j][0])
          } catch (error) {
            console.log("")
          }
          }
        }

      // makes a list with data of the consumer confidence
      data_2 = []
      for (var i = 0; i < 6; i++) {
        number = i.toString()
        for (var j = 0; j < 9; j++) {
          try {
            data_2.push(response[1].dataSets[0].series[[number] + ":0:0"].observations[j][0])
          } catch (error) {
            console.log("")
          }
          }
        }

      // defines all the margins
      width = 600;
      height = 200;
      padding = 1;
      padding_2 = 45;
      padding_3 = 20;
      minX = Math.min(... data) - padding
      maxX = Math.max(... data) + padding
      minY = Math.min(... data_2) - padding
      maxY = Math.max(... data_2) + padding

      // scales the x axis to the amount of countries
      var xScale= d3.scaleLinear()
                    .domain([minX, maxX])
                    .range([padding_2, width])

      // scales the y axis from 0 to 100 percent
      var yScale = d3.scaleLinear()
                     .domain([minY, maxY])
                     .range([(height - padding_3), 0])

      // defines the values and the amounts of civilians
      values = response[2].columns
      civileans = []
      values.forEach(function(d, i) {
        civileans += d
      });

      // defines the colors
      colors = ["#FEEBE2","#FCC5C0","#FA9FB5","#F768A1","#C51B8A","#7A0177"]

      // scales the function used to color the dots from minimal to maximal values
      var colorScale = d3.scaleOrdinal()
                         .domain([17018408, 82667685])
                         .range(colors)

      // create SVG element
      var svg = d3.select("body")
                  .append("svg")
                  .attr("width", width)
                  .attr("height", height + padding_2);

      // defines the y axis
      var yAxis = d3.axisLeft()
                 .scale(yScale);

      // makes the y axis and puts it to the right
      svg.append("g")
         .attr("transform", "translate(" + padding_2 + "," + 0 + ")")
         .call(yAxis);

      // defines the x axis
      var xAxis = d3.axisBottom()
                  .scale(xScale)

      // makes the x axis and puts it to the bottom
      svg.append("g")
         .attr("transform", "translate(" + 0 + "," + (height - padding_3) + ")")
         .call(xAxis);

      // makes dots
      svg.selectAll("circle")
         .data(data)
         .enter()
         .append("circle")

         // defines the x, y and radius of the dots
         .attr("cx", function(d, i) {
              return xScale(d);
         })
         .attr("cy", function(d, i) {
              return yScale(data_2[i]);
         })
         .attr("r", 5)
         .attr("fill", function(d, i) {
              // console.log(response[2][0]);
              // console.log(Math.floor(i / 9));
              return colorScale(d);
            });

      // gives a title to the x axis
      svg.append("text")
         .attr("class", "textAxis")
         .style("font-family", "verdana")
         .style("font-size", "12px")
         .attr("text-anchor", "middle")
         .attr("transform", "translate(" + (width / 2) + ","+ (height + padding_2 / 2.5) + ")")
         .text("Percentage of women in science (%)");

      // gives a title to the y axis
      svg.append("text")
          .attr("class", "textAxis")
          .style("font-family", "verdana")
          .style("font-size", "12px")
          .attr("text-anchor", "middle")
          .attr("transform", "translate(" + (padding_3 / 2.3) + ","+ (height / 2) +")rotate(-90)")
          .text("Consumer confidence");

      // add title
      svg.append("svg:text")
         .attr("class", "title")
         .style("font-family", "verdana")
         .style("font-size", "12px")
         .attr("text-anchor", "middle")
         .attr("x", (width / 2))
         .attr("y", 9)
         .text("Scatter plot");

      // scales the function for colors with a quantize
      var colorScale = d3.scaleQuantize()
                         .domain([17018408, 82667685])
                         .range(colors);

       // tries to make and add a legend
      var legend_2 = svg.append("g")
                        .attr("class", "legend")
                        .attr("x", width - 65)
                        .attr("y", 25)
                        .attr("height", 100)
                        .attr("width", 100);

      // fills each dot with another color
      legend.selectAll('g').data(civileans)
            .enter()
            .append('g')
            .each(function(d, i) {
              var g = d3.select(this);
              g.append("rect")
               .attr("x", width - 65)
               .attr("y", i * 25)
               .attr("width", 10)
               .attr("height", 10)
               .style("fill", colors(i));

      // appends the text to the legend
      g.append("text")
          .attr("x", width - 50)
          .attr("y", i * 25 + 8)
          .attr("height",30)
          .attr("width",100)
          .style("fill", colors(i))
          .text(colors(i));
      });

       // tries to make and add another legend
       svg.append("g")
          .attr("id", "colorLegend")
          .attr("transform", "translate(" + width + "," + (height / 2) + ")")
          .call(colorLegend);

      // creates the legend
      var colorLegend = d3.legendColor()
                          .labelFormat(d3.format(".0f"))
                          .scale(colorScale)
                          .title("Legend")
                          .shapePadding(5)
                          .shapeWidth(50)
                          .shapeHeight(20)
                          .labelOffset(12);

    // puts the right values in the legend / dots
    svg.append("text")
        .attr("transform", "translate(" + width + "," + (height / 2) + ")")
        .style("text-anchor", "middle")
        .text(countries);
    });
}
