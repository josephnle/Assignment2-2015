(function() {
  $.getJSON( '/igSelfMedia')
    .done(function( data ) {
      $('#postsChartLoader').remove();

      var postsPerDay = [];

      data.media.forEach(function(item) {
        var created = moment.unix(parseInt(item.created_time)).format('YYYY-MM-DD');
        if(postsPerDay[created]) {
          postsPerDay[created]++;
        }
        else {
          postsPerDay[created] = 1;
        }
      });

      var xAxis = Object.keys(postsPerDay);
      var yCounts = [];

      xAxis.forEach(function (key) {
        yCounts.push(postsPerDay[key]);
      });

      xAxis.unshift('x');
      yCounts.unshift('Posts Per Day');


      var chart = c3.generate({
        bindto: '#postsPerDayChart',
        data: {
          x: 'x',
//        xFormat: '%Y%m%d', // 'xFormat' can be used as custom format of 'x'
          columns: [
            xAxis,
            yCounts
          ]
        },
        axis: {
          x: {
            type: 'timeseries',
            tick: {
              format: '%Y-%m-%d'
            }
          }
        }
      });
    });
})();
