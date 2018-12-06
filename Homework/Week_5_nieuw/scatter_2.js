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
      // console.log(response);
      // console.log(response[0].structure)
      // console.log(response[0].structure.dimensions)
      // console.log(response[0].dataSets[0].series)
      // makes a first list with all the years
      years_first = []
      for (var i = 0; i < 9; i++) {
        // console.log(response[0].structure.dimensions.observation[0].values[i].name)
        years_first.push(response[0].structure.dimensions.observation[0].values[i].name)
      }

      // makes a first list with all the countries
      countries_first = []
      for (var i = 0; i < 6; i++) {
        countries_first.push(response[0].structure.dimensions.series[1].values[i].name)
      }

        // makes a second list with all the years
      years_second = []
      for (var i = 0; i < 9; i++) {
        years_second.push(response[1].structure.dimensions.observation[0].values[i].name)
      }

        // makes a second list with all the countries
      countries_second = []
      for (var i = 0; i < 6; i++) {
        countries_second.push(response[1].structure.dimensions.series[0].values[i].name)
      }

      // makes a list with data of the amount of women in science
      data = []
      // console.log(response[0].dataSets[0].series["0:0"])
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

      console.log("begin");


      // console.log(years_first)
      console.log(countries_first)
      // console.log(years_second)
      console.log(countries_second)
      console.log(data)
      console.log("tussen");
      console.log(data_2)
      console.log("einde");


      // var margin = {top: 20, right: 10, bottom: 20, left: 10};

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
        console.log(d);
        civileans += d
      });
      console.log(civileans);

      // defines the colors
      colors = ["#FEEBE2","#FCC5C0","#FA9FB5","#F768A1","#C51B8A","#7A0177"]

      // scales the function used to color the dots from minimal to maximal values
      var colorScale = d3.scaleQuantize()
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

      console.log("jippie");
      // console.log(color);


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
              console.log(colorScale(d));
              return colorScale(d);
            });

console.log("jeeh");
         // create color legend --> thomas

      var colorLegend = d3.legend.color()
                     .labelFormat(d3.format(".0f"))
                     .scale(colorScale)
                     .shapePadding(5)
                     .shapeWidth(50)
                     .shapeHeight(20)
                     .labelOffset(12);

      console.log("jippie");

      // make and add legend
      svg.append("g")
        // .attr("id", "colorLegend")
        .attr("transform", "translate("+[param.width + margin.left,
                                         margin.top]+")")
        .call(colorLegend);


    // color the legend
    svg.append("text")
        .attr("transform", "translate(" + width + "," + (height / 2) + ")")
        .style("text-anchor", "middle")
        .text(countries_first);

    // adjust size of legend
    var legendSize = d3.legendSize()
                        .scale(scales[3])
                        .shape('circle')
                        .labelOffset(20)
                        .orient('vertical');

    svg.append("g")
         // .attr("class", "legendSize")
       .attr("transform", "translate(" + width + "," + (height / 2) + ")")
       .call(legendSize);


    svg.append("text")
       .attr("transform", "translate(" + width + "," + (height / 2) + ")")
       .style("text-anchor", "middle")
       .text(countries_first);



         // .attr("fill", function(d) {
         //     if ((Object.keys(data[d])).indexOf(String(year)) === -1) {
         //       return "red";
         //     };
         //     colorValue = data[d][year][keys[2]];
         //     if (colorValue === undefined){
         //       return "red";
         //     };
         //     return scales[2](colorValue);
         //   })



                     // svg.append("g")
                     //    .attr("transform", "translate(" + 0 + "," + (height - padding_3) + ")")
                     //    .call(xAxis);



         // .style("fill", function (d) { return colors[d.type]; })

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
    });
};
