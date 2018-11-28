/*
Eveline Tiekink
11267321
JSON file for the barchart for the UvA course Dataprocessing
*/

  // puts the right data (json file) in
  d3.json("data.json").then(function(data){
      var dataValues = [];

      // defines the countries and the values
      var countries = Object.keys(data);
      for (var i = 0; i < countries.length; i++) {
          dataValues.push(parseFloat(data[countries[i]]["Value"]));
      }

      // gives values to the width, height and padding
      var width = 800;
      var height = 200;
      var padding = 2

      // gives the svg a body with an width and height
      var svg = d3.select("body")
                  .append("svg")
                  .attr("width", 1200)
                  .attr("height", 1200);

      // defines a tip with a class and specific values
      var tip = d3.tip()
                  .attr('class', 'd3-tip')
                  .offset([-10, 0])
                  .html(function(d) {
                    return "<strong style='color:hotpink' style='family:verdana'>Value:</strong> <span style='color:hotpink'>" + d + "</span>";
                  })

      // calculates the maximum value
      var max = Math.max.apply(null, dataValues);

      // scales the y axis from 0 to 100 percent
      var yScale = d3.scaleLinear()
                     .domain([0, 100 + padding])
                     .range([height, 0])

      // scales the x axis to the amount of countries
      var xScale= d3.scaleOrdinal()
                     .domain(countries)
                     .range([0, width])

      // calles the tip
      svg.call(tip);

      // defines the pink bars with values, a class, a width and height
      var bars = svg.selectAll("rect")
                    .data(dataValues)
                    .enter()
                    .append("rect")
                    .attr("class", "bar")
                    .attr("width", 20)
                    .attr("height", function(d){
                      return height - yScale(d);
                    })
                    .attr("x", function(d, i){
                      return 40 + (width / countries.length)* i
                    })
                    .attr("y", function(d, i) {
                      return yScale(d);
                    })
                    .attr("fill", "pink")

                    // puts the tip on or off
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide)

      // defines the y axis
      var yAxis = d3.axisLeft()
                 .scale(yScale);

      // makes the y axis and puts it to the right
      svg.append("g")
         .attr("transform", "translate(" + 40 + "," + 0 + ")")
         .call(yAxis);

      // defines the distance between the bars
      var barWidth = width / (countries.length);

      // adds labels under the bars of the countries
      svg.selectAll("text.axis")
         .data(countries)
         .enter()
         .append("text")
         .attr("transform", "translate(0," + height + ")")
         .style("font-size", "10px")
         .attr("y", 10)
         .attr("id", function(d){
              return d;
             })
         .attr("x", function(d,i){
                 return (((36 + i + 0.5) * barWidth) + 40 - width )
             })
         .text(function(d){
              return d
             })
         .attr("text-anchor", "middle");

      // gives a title to the x axis
      svg.append("text")
         .attr("class", "textAxis")
         .style("font-family", "verdana")
         .style("font-size", "12px")
         .attr("text-anchor", "middle")
         .attr("transform", "translate(" + (width/2) + ","+ (height + 40) + ")")
         .text("Country");

      // gives a title to the y axis
      svg.append("text")
          .attr("class", "textAxis")
          .style("font-family", "verdana")
          .style("font-size", "12px")
          .attr("text-anchor", "middle")
          .attr("transform", "translate(" + 10 + ","+ (height / 2) +")rotate(-90)")
          .text("Percentage (%)");
    });
