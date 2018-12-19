/*
Eveline Tiekink
11267321
Linked views for the UvA course Dataprocessing
*/

window.onload = function(){

  var requests = [d3.json("data_one.json"), d3.csv("data_two.csv")];

  Promise.all(requests).then(function(response) {

    // defines the data and deletes unused data
    data = response[0];
    delete data["Totaal"];
    delete data["Met migratieachtergrond"];

    // defines the margins and other values used for the donut chart
    var width = 550;
    var height = 550;
    var widthDonut = 400;
    var heightDonut = 400;
    var thickness = 70;
    var padding = 20;
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

    // gives a title to the donut chart
    svg.append("text")
       .attr("class", "text")
       .text("Donutchart of the immigration")
       .attr("transform", "translate(" + padding * 7 + "," + padding + ")");

    // defines the arcade of the donut
    var arc = d3.arc()
                .innerRadius(radius - thickness)
                .outerRadius(radius);

    // defines lists for the continents and the immigrants of the continents
    continentList = Object.keys(data);
    valuesList = []

    // appends the amount of immigrants to the values list
    for (var continent in continentList) {
      continent = data[continentList[continent]][2017];
      valuesList.push(continent)
    }

    // defines a pie for the donut chart
    var pie = d3.pie()
                .value(function(d, i) {
                    return valuesList[i]
                })
                .sort(null);

    // defines the whole donut chart
    var path = g.selectAll('path')
                .data(pie(continentList))
                .enter()
                .append("g")
                .on("mouseover", function(d) {

                    // puts what happens at scrollling over the donut chart
                    let g = d3.select(this)
                              .style("cursor", "pointer")
                              .style("fill", "black")
                              .append("g")
                              .attr("class", "text-group");

                    g.append("text")
                     .attr("class", "name-text")
                     .text(function(d) {
                       return d.data;
                     })
                     .attr('text-anchor', 'middle')
                     .attr('dy', '-1.2em');

                    g.append("text")
                     .attr("class", "value-text")
                     .text(function(d, i) {
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

                  // puts what happens at clicking on the donut chart
                  createBarchart(d.data);
                })

    // creates a barchart
    function createBarchart(cont) {

      // defines only the data which is needed
      data2 = response[1]

      for (i in data2) {
        if (i % 2 == 0) {
          delete data2[i]
        }
      }

      // sets values in the list with catergories of the bars
      barList = ["Eerste generatie migratieachtergrond (aantal)", "Totaal bevolking (aantal)",
      "Tweede generatie migratieachtergrond/Beide ouders in buitenland geboren (aantal)",
      "Tweede generatie migratieachtergrond/Eén ouder in buitenland geboren (aantal)",
      "Tweede generatie migratieachtergrond/Totaal 2e generatie migratieachtergrond (aantal)"]

      // puts the values of the specific continent in a list
      for (continent in continentList) {
        allValues = []
        continentList[continent]

        var amounts;
        for (var i in data2){
          if (data2[i].Migratieachtergrond == cont){
            amounts = data2[i]
          }
        }

        for (var i in barList) {
          value = amounts[barList[i]]
          allValues.push(value)
        }
      }

      // define the margins and other values of the svg and bar chart
      var widthSVG = 1100;
      var heightSVG = 550;
      var width = 500;
      var height = 300;
      var padding1 = 2;
      var padding2 = 20;
      var padding3 = 70;
      var widthBar = 40;

      // deletes the bar chart (when clicking on a new one for instance)
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

      // scales the y axis
      var yScale = d3.scaleLinear()
                     .domain([0, max + padding1])
                     .range([height, 3 * padding2])

      // scales the x axis to the amount of continents
      var xScale= d3.scaleOrdinal()
                    .domain(continentList)
                    .range([0, width])

      // defines a tip with a class and a specific values
      var tip = d3.tip()
                  .attr('class', 'd3-tip')
                  .offset([-10, 0])
                  .html(function(d) {
                    return "<strong style='font-family:verdana'>Waarde:</strong> <span style='font-family:verdana'>" + d + "</span>"
                  })

      // calles the tip
      svgBar.call(tip);

      // defines the bars with values, a class, a width and a height
      var bars = svgBar.selectAll("rect")
                       .data(allValues)
                       .enter()
                       .append("rect")
                       .attr("class", "bar")
                       .attr("width", widthBar)
                       .attr("height", function(d){
                            return height - yScale(d);
                       })
                       .attr("x", function(d, i) {
                           return padding3 + (width / allValues.length) * i
                       })
                       .attr("y", function(d, i) {
                            return yScale(d);
                       })
                       .attr("fill", "#253494")

                       // puts the tip on or off
                       .on('mouseover', tip.show)
                       .on('mouseout', tip.hide)

      // defines the y axis
      var yAxis = d3.axisLeft()
                 .scale(yScale);

       // makes the y axis
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

      // makes a list with numbers
      numberList = [1, 2, 3, 4, 5];

      // adds labels under the bars of the continents
      svgBar.selectAll("text.axis")
            .data(numberList)
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
                    return (padding3 + 0.5 * widthBar + barWidth * i)
                })
            .text(function(d){
                  return d
                 })
            .attr("text-anchor", "middle");

    // gives a title to the donut chart
     svgBar.append("text")
           .attr("class", "text")
           .text("Categoriën van immigratie van")
           .attr("transform", "translate(" + padding2 * 4 + "," + padding2 + ")");

     svgBar.append("text")
           .attr("class", "text")
           .text(cont)
           .attr("transform", "translate(" + padding2 * 20 + "," + padding2 + ")");

     // gives a title to the y axis
     svgBar.append("text")
         .attr("class", "textAxis")
         .style("font-family", "verdana")
         .attr("transform", "translate(" + 11 + ","+ (height / 2 + 2 * padding3) +")rotate(-90)")
         .text("Hoeveelheid immigratanten");

     // gives a title to the x axis
     svgBar.append("text")
        .attr("class", "textAxis")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(" + (width / 2 + padding3) + ","+ (height + 2 * padding2) + ")")
        .text("Categorie");


     // gives a title to the legend
     svgBar.append("text")
        .attr("class", "textLegend")
        .style("font-family", "verdana")
        .style("font-size", "12px")
        .attr("transform", "translate(" + (widthSVG - 4 * padding3) + ","+ (2 * padding2) + ")")
        .text("Legenda");

    // gives values to the legend
    for (i in numberList) {
      svgBar.append("text")
            .attr("class", "legendText")
            .attr("transform", "translate(" + (widthSVG - 8 * padding3 - padding2)  + "," + (3 * padding2 + 10 * parseInt(i)) + ")")
            .text(numberList[i]);
    }

    for (i in numberList) {
      svgBar.append("text")
            .attr("class", "legendText")
            .attr("transform", "translate(" + (widthSVG - 8 * padding3)  + "," + (3 * padding2 + 10 * parseInt(i)) + ")")
            .text(barList[i]);
    }
  }
  })
  .catch(function(e){
    throw(e);
  });
}
