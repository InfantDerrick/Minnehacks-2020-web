var dpn, air, car, electricity, gas, oil, public, total, points;
firebase.auth().onAuthStateChanged(function(user) {
  if(user){
    window.open('./const.html', "_self");
    console.log(user.displayName);
    dpn = user.displayName;
    var userRef = firebase.database().ref('super/'+dpn+"/");
    userRef.child("name").once('value', function(snap){
      console.log(snap.val());
      $("#personName").text(snap.val());
    });
    userRef.child("photo").once('value', function(snap){
      $('#userProfile').attr('src', snap.val());
    });
    userRef.child("carbon/total").once('value', function(snap){
      total = snap.val();
      $('#CO2Main').text(Math.round((total + Number.EPSILON) * 100) / 100);
    }).then(function(){
      var chart = new Chartist.Line('.stats', {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          series: [
              [400, 120, 105, 211, 143, 123, total]
          ]
      }, {
          low: 0,
          high: 1000,
          showArea: true,
          fullWidth: true,
          plugins: [
              Chartist.plugins.tooltip()
          ],
          axisY: {
              onlyInteger: true,
              scaleMinSpace: 40,
              offset: 20,
              labelInterpolationFnc: function (value) {
                  return (value / 1) + 'k';
              }
          },
      });

      // Offset x1 a tiny amount so that the straight stroke gets a bounding box
      chart.on('draw', function (ctx) {
          if (ctx.type === 'area') {
              ctx.element.attr({
                  x1: ctx.x1 + 0.001
              });
          }
      });

      // Create the gradient definition on created event (always after chart re-render)
      chart.on('created', function (ctx) {
          var defs = ctx.svg.elem('defs');
          defs.elem('linearGradient', {
              id: 'gradient',
              x1: 0,
              y1: 1,
              x2: 0,
              y2: 0
          }).elem('stop', {
              offset: 0,
              'stop-color': 'rgba(255, 255, 255, 1)'
          }).parent().elem('stop', {
              offset: 1,
              'stop-color': 'rgba(80, 153, 255, 1)'
          });
      });

      $(window).on('resize', function () {
          chart.update();
      });
    });
    userRef.child("points").once('value', function(snap){
      points = snap.val();
      $('#pointsMain').text(Math.round((points + Number.EPSILON) * 100) / 100);
    }).then(function(){
      var data = {
          labels: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
          series: [
              [-50, 40, -300, 250, 530, points]
          ]
      };

      var options = {
          axisX: {
              showGrid: false
          },
          seriesBarDistance: 1,
          chartPadding: {
              top: 15,
              right: 15,
              bottom: 5,
              left: 0
          },
          plugins: [
              Chartist.plugins.tooltip()
          ],
          width: '100%'
      };

      var responsiveOptions = [
          ['screen and (max-width: 640px)', {
              seriesBarDistance: 5,
              axisX: {
                  labelInterpolationFnc: function (value) {
                      return value[0];
                  }
              }
          }]
      ];
      new Chartist.Bar('.net-income', data, options, responsiveOptions);

    });
    userRef.child('devices/temp').on('value', function(snap){
      $('#temp').text(Math.round((snap.val() + Number.EPSILON) * 100) / 100);
    });
    userRef.child('devices/door').on('value', function(snap){
      if(!snap.val()) $("#door").text("OPEN");
      else $("#door").text("CLOSED");
    });
    userRef.child('devices/leak').on('value', function(snap){
      if(snap.val()) $("#leak").text("LEAK");
      else $("#leak").text("ALL SAFE");
    });
    userRef.child('carbon').orderByValue().limitToLast(4).on('value', function(snap){
      var i = 0;
      snap.forEach(function(snapshot){
        $("#act"+i).text(snapshot.key);
        $('#val'+i).text(Math.round((snapshot.val() + Number.EPSILON) * 100) / 100);
        i++;
        if(snapshot.key == 'total') i = 0;
      });
    });
    userRef.child('carbon').once('value', function(snap){
        var snapval = snap.val();
        air = snapval.air;
        car = snapval.car;
        electricity = snapval.electricity;
        gas = snapval.gas;
        oil = snapval.oil;
        public = snapval.public;
        total = snapval.total;
    }).then(function(){
      var trans = 100*(air + car + public)/total;
      var energy = 100*((electricity + gas + oil)/total);
      console.log(electricity);
      var chart1 = c3.generate({
          bindto: '#campaign-v2',
          data: {
              columns: [
                  ['Transportation', trans],
                  ['Energy', energy],
              ],

              type: 'donut',
              tooltip: {
                  show: true
              }
          },
          donut: {
              label: {
                  show: false
              },
              title: 'C02',
              width: 18
          },

          legend: {
              hide: true
          },
          color: {
              pattern: [
                  '#edf2f6',
                  '#5f76e8',
              ]
          }
      });

    });

    d3.select('#campaign-v2 .c3-chart-arcs-title').style('font-family', 'Rubik');
    userRef.child('devices').once('value', function(snap){
      $('#maxTemp').val(snap.val().maxTemp);
      $('#minTemp').val(snap.val().minTemp);
    });
  }else{
    console.log("what...");
    window.open('./login.html', '_self');
  }
});
function signOut(){
  firebase.auth().signOut().then(function() {
    window.open('./login.html', '_self');
  }).catch(function(error) {

  });
}
$(function () {

    // ==============================================================
    // Campaign
    // ==============================================================
    document.getElementById("maxTemp").addEventListener('change', function(){
      firebase.database().ref('super/'+dpn+"/devices/maxTemp").set(parseInt($('#maxTemp').val()));
    });
    document.getElementById("minTemp").addEventListener('change', function(){
      firebase.database().ref('super/'+dpn+"/devices/minTemp").set(parseInt($('#minTemp').val()));
    });
    // ==============================================================
    // Visit By Location
    // ==============================================================
    jQuery('#visitbylocate').vectorMap({
        map: 'world_mill_en',
        backgroundColor: 'transparent',
        borderColor: '#000',
        borderOpacity: 0,
        borderWidth: 0,
        zoomOnScroll: false,
        color: '#d5dce5',
        regionStyle: {
            initial: {
                fill: '#d5dce5',
                'stroke-width': 1,
                'stroke': 'rgba(255, 255, 255, 0.5)'
            }
        },
        enableZoom: true,
        hoverColor: '#bdc9d7',
        hoverOpacity: null,
        normalizeFunction: 'linear',
        scaleColors: ['#d5dce5', '#d5dce5'],
        selectedColor: '#bdc9d7',
        selectedRegions: [],
        showTooltip: true,
        onRegionClick: function (element, code, region) {
            var message = 'You clicked "' + region + '" which has the code: ' + code.toUpperCase();
            alert(message);
        }
    });

    // ==============================================================
    // Earning Stastics Chart
    // ==============================================================

})
