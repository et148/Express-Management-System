var ChartsFlotcharts = function() {

    return {

        initChart: function(chartId,maxDotNumber) {
            if (!jQuery.plot) {
                return;
            }

            var data = [];
            var totalPoints = 250;

            // random data generator for plot charts

            function getRandomData() {
                if (data.length > 0) data = data.slice(1);
                // do a random walk
                while (data.length < totalPoints) {
                    var prev = data.length > 0 ? data[data.length - 1] : 50;
                    var y = prev + Math.random() * 10 - 5;
                    if (y < 0) y = 0;
                    if (y > 100) y = 100;
                    data.push(y);
                }
                // zip the generated y values with the x values
                var res = [];
                for (var i = 0; i < data.length; ++i) {
                    res.push([i, data[i]]);
                }

                return res;
            }

            //Dynamic Chart

            function chart() {
                if ($('#'+chartId).size() != 1) {
                    return;
                }
                //server load
                var options = {
                    series: {
                        shadowSize: 1
                    },
                    lines: {
                        show: true,
                        lineWidth: 0.5,
                        fill: !true,
//                        steps: true,
                        fillColor: {
                            colors: [{
                                opacity: 0.1
                            }, {
                                opacity: 1
                            }]
                        }
                    },
                    yaxis: {
                        min: -100,
                        max: 100,
                        tickColor: "#eee",
                        tickFormatter: function(v) {
                            return v + "%";
                        }
                    },
                    xaxis: {
                        show: true,
                        tickFormatter: function(v) {
                            return (v*0.001*10).toFixed(2) + "s";
                        }
                    },
                    colors: ["red","green"],
                    grid: {
                        tickColor: "#eee",
                        borderWidth: 0,
                    }
                };

                var updateInterval = 60;
                var dots=[];
                var i=0-maxDotNumber;
                while(i<0){
                	dots.push([i,0]);
                	i++;
                }
                var dots2=[];
                var i=0-maxDotNumber;
                while(i<0){
                	dots2.push([i,-100]);
                	i++;
                }
                var plot = $.plot($('#'+chartId), [dots,dots2], options);
                return plot;
            }
            //graph
            return chart();
        },
    };

}();