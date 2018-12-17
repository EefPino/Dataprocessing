/*
Eveline Tiekink
11267321
Linked views for the UvA course Dataprocessing
*/

window.onload = function(){

  console.log("test")
  var requests = [d3.json("data_one.json"), d3.csv("data_two.csv")];
  //  var requests = [d3.json("data_1.json"), d3.json("data2.json")];
  // console.log(2tcsvt"  // puts the right data (json file) in
  // Promise.all(requests).then(function(response) {

  Promise.all(requests).then(function(response) {

      console.log(response);

      console.log("odso");
      data = response[0]
      // var dataValues = [];
      console.log(data)
      delete data["Totaal"];
      delete data["Met migratieachtergrond"];
      console.log("verwijdert");
      console.log(data);

    // define the margins and other values
    var width = 550;
    var height = 550;
    var widthDonut = 400;
    var heightDonut = 400;
    var thickness = 70;
    var padding = 20;
    // var duration = 700;

    var radius = Math.min(widthDonut, heightDonut) / 2;
    var color = d3.scaleOrdinal(d3.schemeSet1);

    // gives the svg a body with an width and height
    var svg = d3.select("body")
              .append("svg")
              .attr("class", "pie")
              .attr("width", width)
              .attr("height", height);

    var g = svg.append("g")
               .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")");

    svg.append("text")
       .attr("class", "text")
       .text("Donutchart of the immigration")
       .attr("transform", "translate(" + padding * 7 + "," + padding + ")");

    var arc = d3.arc()
                .innerRadius(radius - thickness)
                .outerRadius(radius);

    console.log("na def en colors beschrijven");
    // console.log(data);
    // console.log(d.value);

    continentList = Object.keys(data);
    valuesList = []
    console.log(continentList);

    for (var continent in continentList) {
      console.log(continentList[continent]);
      console.log(data[continentList[continent]][2017]);
      continent = data[continentList[continent]][2017];
      valuesList.push(continent)
    }

    console.log("values list");
    console.log(valuesList);

    var pie = d3.pie()
                .value(function(d, i) {
                //   for (var continent in continentList) {
                //     // console.log(continentList[continent]);
                //     continent = continentList[continent];
                //     console.log(data[0][continent][2017])
                //
                    return valuesList[i]
                // return data[0][continent][2017]
                })
                .sort(null);

  console.log("na pie");
  console.log(Object.keys(data));
  console.log("na continent");


    var path = g.selectAll('path')
                .data(pie(continentList))
                // .data2(pie(valuesList))
                .enter()
                .append("g")
                .on("mouseover", function(d) {
                      let g = d3.select(this)
                                .style("cursor", "pointer")
                                .style("fill", "black")
                                .append("g")
                                .attr("class", "text-group");

                      g.append("text")
                       .attr("class", "name-text")
                       .text(function(d) {
                         console.log(d.data);
                         return d.data;
                       })
                       .attr('text-anchor', 'middle')
                       .attr('dy', '-1.2em');

                      g.append("text")
                       .attr("class", "value-text")
                       .text(function(d, i) {
                         // console.log("value");
                         console.log(d.value);
                         return d.value;
                       })
                       .attr('text-anchor', 'middle')
                       .attr('dy', '.6em');
                    })
                .on("mouseout", function(d) {
                    d3.select(this)
                      .style("cursor", "none")
                      .style("fill", color(this._current))
                      .select(".text-group").remove();
                })
                .append('path')
                .attr('d', arc)
                .attr('fill', (d,i) => color(i))
                .on("click", function(d) {
                  console.log(d);
                  console.log("functie");
                  createBarchart(d.data);
                })

    console.log("klaar 1");

    function createBarchart(cont) {

        data2 = response[1]

        console.log(data2)
        for (i in data2) {
          if (i % 2 == 0) {
            delete data2[i]
          }
        }

        barList = ["Eerste generatie migratieachtergrond (aantal)", "Totaal bevolking (aantal)", "Tweede generatie migratieachtergrond/Beide ouders in buitenland geboren (aantal)", "Tweede generatie migratieachtergrond/Eén ouder in buitenland geboren (aantal)", "Tweede generatie migratieachtergrond/Totaal 2e generatie migratieachtergrond (aantal)"]

        console.log(data2);
        console.log(continentList);

        for (continent in continentList) {
          allValues = []
          continentList[continent]
          console.log(cont);

          var amounts;
          for (var i in data2){
            if (data2[i].Migratieachtergrond == cont){
              amounts = data2[i]
            }
          }
          console.log(amounts);

          for (var i in barList) {
            value = amounts[barList[i]]
            allValues.push(value)
          }
        }

        console.log("allValues");
        console.log(allValues);


        // barList = Object.keys(data2);

        console.log(barList);

        // valuesList = []

        // for (var category in barList) {
        //   console.log("jeeh");
        //   console.log(data2[bar_list[category]]);
        //   // console.log(data[continentList[continent]][2017]);
        //   // continent = data[continentList[continent]][2017];
        //   // valuesList.push(continent)
        // }


        // define the margins and other values
        var widthSVG = 1100;
        var heightSVG = 550;
        var width = 500;
        var height = 300;
        var padding1 = 2;
        var padding2 = 20;
        var padding3 = 70;

        if (d3.select("svg.bar")) {
          d3.select("svg.bar").remove().exit();
        }

        // gives the svg a body with an width and height
        var svgBar = d3.select("body")
                  .append("svg")
                  .attr("class", "bar")
                  .attr("width", widthSVG)
                  .attr("height", heightSVG);

        // calculates the maximum value
        var max = Math.max.apply(null, allValues);

        console.log(max);

        // scales the y axis
        var yScale = d3.scaleLinear()
                       .domain([0, max + padding1])
                       .range([height, 2 * padding2])

        console.log("deel 2");

        // scales the x axis to the amount of countries
        var xScale= d3.scaleOrdinal()
                      .domain(continentList)
                      .range([0, width])

        console.log("deel 3");

        // defines a tip with a class and specific values
        var tip = d3.tip()
                    .attr('class', 'd3-tip')
                    .offset([-10, 0])
                    .html(function(d) {
                      return "<strong style='font-family:verdana'>Waarde:</strong> <span style='font-family:verdana'>" + d + "</span>"
                    })

        // calles the tip
        svgBar.call(tip);

        // console.log(valuesList);
        // console.log("na tip");
        // console.log(continentList);

        var widthBar = 40

        // document.getElementById('call-button').addEventListener('click', function() {
        //   alert('Ja dat ben je zekers!!!');
        // });

        // defines the pink bars with values, a class, a width and height
        var bars = svgBar.selectAll("rect")
                      .data(allValues)
                      .enter()
                      .append("rect")
                      .attr("class", "bar")
                      .attr("width", widthBar)
                      .attr("height", function(d){
                            // console.log("roekoe");
                            // console.log(yScale(d));
                            console.log(height - yScale(d));
                           return height - yScale(d);
                      })
                      .attr("x", function(d, i) {
                          return padding3 + (width / allValues.length) * i
                          // nog aanpssen met iets van x Scale
                           // return xScale(d);
                      })
                      .attr("y", function(d, i) {
                           return yScale(d);
                      })
                      .attr("fill", "#253494")

                      // puts the tip on or off
                      .on('mouseover', tip.show)
                      .on('mouseout', tip.hide)


        console.log("bijna klaar");

        // defines the y axis
        var yAxis = d3.axisLeft()
                   .scale(yScale);

         // makes the y axis and puts it to the right
         svgBar.append("g")
            .attr("transform", "translate(" + padding3 + "," + 0 + ")")
            .call(yAxis);

        // scales the x axis for the text
        var xScale2 = d3.scaleOrdinal()
                      .domain(["", ""])
                      .range([0, width])

        // defines the x axis
        var xAxis = d3.axisBottom()
                    .scale(xScale2)

        // makes the x axis and puts it to the bottom
        svgBar.append("g")
           .attr("transform", "translate(" + padding3 + "," + height + ")")
           .call(xAxis);


        // defines the distance between the bars
        var barWidth = width / (continentList.length);

        console.log("barwidth");
        console.log(barWidth);

        numberList = [1, 2, 3, 4, 5]

        // adds labels under the bars of the countries
        svgBar.selectAll("text.axis")
              .data(numberList)
              // .attr("class", "text")
              .enter()
              .append("text")
              .attr("transform", "translate(" + 0 + "," + height + ")")
              .style("font-size", "10px")
              .style("font-family", "verdana")
              .attr("y", 10)
              .attr("id", function(d){
                    return d;
                   })
              .attr("x", function(d, i){

                      console.log("widths");
                      console.log(width);
                      console.log(barWidth);
                      // return (((36 + i + 0.5) * barWidth) + 15 - width)
                      return (padding3 + 0.5 * widthBar + barWidth * i)
                      // return (width - i * barwidth)
                      // return xScale(d)
                  })
              .text(function(d){
                    return d
                   })
              .attr("text-anchor", "middle");


       console.log("erg ver");

       svgBar.append("text")
             .attr("class", "text")
             // .style("font-family", "verdana")
             // .style("font-size", "20px")
             .text("Categoriën van immigratie van")
             .attr("transform", "translate(" + padding2 * 4 + "," + padding2 + ")");

       svgBar.append("text")
             .attr("class", "text")
             // .style("font-family", "verdana")
             // .style("font-size", "20px")
             .text(cont)
             .attr("transform", "translate(" + padding2 * 20 + "," + padding2 + ")");


       // gives a title to the y axis
       svgBar.append("text")
           .attr("class", "textAxis")
           .style("font-family", "verdana")
           // .style("font-size", "12px")
           // .attr("text-anchor", "middle")
           .attr("transform", "translate(" + 11 + ","+ (height / 2 + 2 * padding3) +")rotate(-90)")
           .text("Hoeveelheid immigratie (%)");

       // gives a title to the x axis
       svgBar.append("text")
          .attr("class", "textAxis")
          // .style("font-family", "verdana")
          // .style("font-size", "12px")
          .attr("text-anchor", "middle")
          .attr("transform", "translate(" + (width / 2 + padding3) + ","+ (height + 2 * padding2) + ")")
          .text("Categorie");

       console.log("hopelijk klaar");

       // gives a title to the bar chart
       svgBar.append("text")
          .attr("class", "textLegend")
          .style("font-family", "verdana")
          .style("font-size", "12px")
          // .style("font-weight", "bold")
          // .attr("text-anchor", "middle")
          .attr("transform", "translate(" + (widthSVG - 4 * padding3) + ","+ (2 * padding2) + ")")
          .text("Legenda");

      for (i in barList) {
        console.log(i);
        svgBar.append("text")
              .attr("class", "legendText")
              // .style("font-family", "verdana")
              // .style("font-size", "12px")
              .attr("transform", "translate(" + (widthSVG - 8 * padding3 - padding2)  + "," + (3 * padding2 + 10 * parseInt(i)) + ")")
              .text(i);
      }

      for (i in [1, 2, 3, 4, 5]) {
        console.log(i);
        console.log(3 * padding2 - i);
        console.log(3 * padding2 + parseInt(i));
        svgBar.append("text")
              .attr("class", "legendText")
              // .attr("class", "legendText")
              // .style("font-family", "verdana")
              // .style("font-size", "12px")
              .attr("transform", "translate(" + (widthSVG - 8 * padding3)  + "," + (3 * padding2 + 10 * parseInt(i)) + ")")
              .text(barList[i]);
      }



       // define the margins and other values
       var widthSvg = 600;
       var heightSvg = 500;

       if (d3.select("svg.legend")) {
         d3.select("svg.legend").remove().exit();
       }

       // gives the svg a body with an width and height
       var svgLegend = d3.select("body")
                 .append("svg")
                 .attr("class", "legend")
                 .attr("width", widthSvg)
                 .attr("height", heightSvg);

      // svgBar.append("text")
      //       .attr("class", "textLegend")
      //       .style("font-family", "verdana")
      //       .style("font-size", "12px")
      //       .attr("text-anchor", "middle")
      //       .attr("transform", "translate(" + (widthSVG padding2 + ","+ padding2 + ")")
      //       .text("Legend");
      //






    }


  }).catch(function(e){
    throw(e);
});

}
