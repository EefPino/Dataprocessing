/*
Eveline Tiekink
11267321
JSON file for the line chart for the UvA course Dataprocessing
*/

// puts the right data (json file) in
var fileName = "output.json";
var txtFile = new XMLHttpRequest();
txtFile.onreadystatechange = function() {
    if (txtFile.readyState === 4 && txtFile.status == 200) {
        console.log(JSON.parse(txtFile.responseText));
        jsonData = JSON.parse(txtFile.responseText);

        // defines the dates and the sights
        data = Object.keys(jsonData);
        sight = Object.values(jsonData);

        // makes various lists
        dates = [];
        year = [];
        month = [];
        day = [];

        // makes as many lists as the data in the dates lists
        for (var i = 0; i < data.length; i++){
              dates[i] = data[i];
        }

        // adds the years, months and days to the right lists
        for (var i = 0; i < dates.length; i++){
              year.push(dates[i][0] + dates[i][1] + dates[i][2] + dates[i][3]);
              month.push(dates[i][4] + dates[i][5]);
              day.push(dates[i][6] + dates[i][7]);
        }

        // makes lists with the total dates and the date in milliseconds
        var dates2 = [];
        var time = [];
        var newDate = []
        for (var i = 0; i < dates.length; i++){
          dates2.push(new Date(year[i], month[i], day[i]));
          time.push((new Date(year[i], month[i], day[i])).getTime());
          newDate.push(year[i] + "/" + month[i] + "/" + day[i]);
        }

        // makes integers of the sights
        integerSight = []
        for (var i = 0; i < sight.length; i++){
          integerSight.push(parseInt(sight[i]))
        }

        // makes canvas
        var canvas = document.getElementById("myCanvas");
        var ctx = canvas.getContext("2d");

        // calculates the maximal and minimal values of the dates and sights
        var minTime = Math.min(...time);
        var maxTime = Math.max(...time);
        var minSight = Math.min(...integerSight);
        var maxSight = Math.max(...integerSight);

        // makes constants for the graphs adjusted to the lines
        var top = 50;
        var bottom = 1205;
        var left = 50;
        var right = 1204;

        // determines the range and domain
        range = [left, right];
        domain = [minSight, maxSight];

        // makes a list for the y-coordinates
        var yValue;
        var yAxis = [];

        // uses the creates function to add the 344 y-coordinates
        yValue = createTransform(domain, range);
        for (var i = 0; i < 344; i++){
          yAxis.push(yValue(x=(integerSight[i])));
        }

        // determines the range and domain
        range = [bottom, top];
        domain = [minTime, maxTime];

        // makes a list for the x-coordinates
        var xValue
        var xAxis = []

        // uses the creates function to add the 344 x-coordinates
        xValue = createTransform(domain, range);
        for (var i = 0; i < 344; i++){
          xAxis.push(xValue(x=(time[i])));
        }

        // draws the graph
        ctx.beginPath();
        ctx.moveTo(xAxis[0], yAxis[0])
        for (var i = 1; i < xAxis.length; i++){
          ctx.lineTo(xAxis[i], yAxis[i]);
        }
        ctx.stroke();

        // make axis titles
        ctx.font = "10px verdana";
        ctx.fillText("Date", right / 2, bottom + 50);
        ctx.fillText("Minimal sight (m)", right + 50, bottom / 2);

        // draws the x and y axis
        ctx.beginPath();
        ctx.moveTo(right + left, bottom);
        ctx.lineTo(left, bottom);
        ctx.lineTo(left, top);
        ctx.strokeStyle = "darkblue";
        ctx.stroke();

        // Puts text at the y-axis
        ctx.fillText(maxSight, left - 20, top);
        for (var i = 0; i < 80; i++){
          ctx.fillText(i * 10, left - 20, bottom - i * (bottom - (top -
                       (5 / maxSight) * (bottom - top))) / 8);
        }

        // Puts text at the x-axis
        for (var i = 0; i < 12; i++) {
            ctx.fillText("2017/", left - 25 + i * ((right - left) / 11), bottom + 20);
            ctx.fillText(i, left + 7 + i * ((right - left) / 11), bottom + 20);
            ctx.fillText("/01", left + 19 + i * ((right - left) / 11), bottom + 20);
        }

        // formulates the transform function
        function createTransform(domain, range){
            var domainMin = domain[0];
            var domainMax = domain[1];
            var rangeMin = range[0];
            var rangeMax = range[1];

            // formulas to calculate the alpha and the beta
            var alpha = (rangeMax - rangeMin) / (domainMax - domainMin);
            var beta = rangeMax - alpha * domainMax;

            // returns the function for the linear transformation (y= a * x + b)
            return function(x){
              return alpha * x + beta;
        }
    }
  }
}
txtFile.open("GET", fileName);
txtFile.send();
