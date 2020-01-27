var dpn;
var userRef;
firebase.auth().onAuthStateChanged(function(user) {
  if(user){
    console.log(user.displayName);
    dpn = user.displayName;
    userRef = firebase.database().ref('super/' + dpn + '/carbon');
    userRef.child("name").once('value', function(snap){
      console.log(snap.val());
      $("#personName").text(snap.val());
    });
    userRef.child("photo").once('value', function(snap){
      $('#userProfile').attr('src', snap.val());
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
function carAdd(){
  var fbCar;
  var total;
  userRef.once('value', function(snap){
    fbCar = snap.val().car;
    total = snap.val().total;
  }).then(function(){
    var co2 = parseFloat($("#milesCar").val())/parseFloat($("#mpgCar").val()) * 8.91;
    total += co2;
    fbCar += co2;
    userRef.update({
      total: total,
      car: fbCar
    });
    var newPoints;
    firebase.database().ref('super/'+dpn+'/points').once('value', function(snapshot){
      newPoints = snapshot.val() - co2;
    }).then(function(){
      firebase.database().ref('super/'+dpn+'/points').set(newPoints);
    });
  });
}
function planeAdd(){
  var fbAir;
  var total;
  userRef.once('value', function(snap){
    fbAir = snap.val().air;
    total = snap.val().total;
  }).then(function(){
    var co2;
    if($("#planeSelect").val() == 1){
      co2 = parseFloat($("#milesPlane").val()) * 0.477;
    }else{
      co2 = parseFloat($("#milesPlane").val()) * 0.277;
    }
    total += co2;
    fbAir += co2;
    userRef.update({
      total: total,
      air: fbAir
    });
    var newPoints;
    firebase.database().ref('super/'+dpn+'/points').once('value', function(snapshot){
      newPoints = snapshot.val() - co2;
    }).then(function(){
      firebase.database().ref('super/'+dpn+'/points').set(newPoints);
    });
  });
}
function publicAdd(){
  var fbPublic;
  var total;
  userRef.once('value', function(snap){
    fbPublic = snap.val().public;
    total = snap.val().total;
  }).then(function(){
    var co2;
    var select = $("#publicSelect").val();
    if(select == 1){
      co2 = parseFloat($("#milesPublic").val()) * 0.162;
    }else if(select == 2){
      co2 = parseFloat($("#milesPublic").val()) * 0.12;
    }else if(select == 3){
      co2 = parseFloat($("#milesPublic").val()) * 0.141;
    }else{
      co2 = parseFloat($("#milesPublic").val()) * 0.059;
    }
    console.log(co2);
    total += co2;
    fbPublic += co2;
    userRef.update({
      total: total,
      public: fbPublic
    });
    var newPoints;
    firebase.database().ref('super/'+dpn+'/points').once('value', function(snapshot){
      newPoints = snapshot.val() - co2;
    }).then(function(){
      firebase.database().ref('super/'+dpn+'/points').set(newPoints);
    });
  });
}
function ecoAdd(){
  var newPoints;
  var select = $("#ecoSelect").val();
  console.log(select);
  if(select == 1){
    newPoints = parseFloat($("#milesEco").val()) * 10;
  }else if(select == 2){
    newPoints = parseFloat($("#milesEco").val()) * 5;
  }else{
    newPoints = parseFloat($("#milesEco").val()) * 2.5;
  }
  console.log(newPoints);
  firebase.database().ref('super/'+dpn+'/points').once('value', function(snapshot){
    newPoints = snapshot.val() + newPoints;
  }).then(function(){
    firebase.database().ref('super/'+dpn+'/points').set(newPoints);
  });
}
function energyAdd(){
  var fboil, fbgas, fbe;
  var total;
  userRef.once('value', function(snap){
    fboil = snap.val().oil;
    fbgas = snap.val().gas;
    fbe = snap.val().electricity;
    total = snap.val().total;
  }).then(function(){
    var co2 = parseFloat($("#kwh").val()) * parseFloat($("#timeE").val()) * 0.45449955 + parseFloat($("#therms").val()) * parseFloat($("#timeT").val()) * 5.48 +
    parseFloat($("#gallons").val()) * parseFloat($("#timeG").val()) * 10.15;
    total += co2;
    fboil += parseFloat($("#gallons").val()) * parseFloat($("#timeG").val()) * 10.15;
    fbgas += parseFloat($("#therms").val()) * parseFloat($("#timeT").val()) * 5.48
    fbe += parseFloat($("#kwh").val()) * parseFloat($("#timeE").val()) * 0.45449955;
    console.log(fboil);
    userRef.update({
      total: total,
      oil: fboil,
      gas: fbgas,
      electricity: fbe,
    });
    var newPoints;
    firebase.database().ref('super/'+dpn+'/points').once('value', function(snapshot){
      newPoints = snapshot.val() - co2;
    }).then(function(){
      firebase.database().ref('super/'+dpn+'/points').set(newPoints);
    });
  });
}
