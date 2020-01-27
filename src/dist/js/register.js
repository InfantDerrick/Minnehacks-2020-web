firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    if(user.displayName != null){
      console.log(user.email);
      window.open('./login.html', '_self');
    }
  }
});
function register(){
  username = document.getElementById("username").value;
  password1 = document.getElementById("password1").value;
  password2 = document.getElementById("password2").value;
  dpn = username;
  if(password1 != password2){
    window.alert("The passwords do not match");
  }else{
    firebase.auth().createUserWithEmailAndPassword($("#email").val(), password1).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      window.alert(error);
    }).then(function(){
      firebase.database().ref('super/'+ dpn +"/").set({
        name: $("#name").val(),
        points: 0
      }).then(function(){
        firebase.database().ref('super/'+ dpn +"/carbon/").set({
          air: 0,
          car: 0,
          electricity: 0,
          gas: 0,
          oil: 0,
          public: 0,
          total: 0
        }).then(function(){
          firebase.database().ref('super/'+dpn+'/devices').set({
            door: true,
            humidity: 0,
            leak: false,
            temp: 0
          }).then(function(){
            firebase.auth().currentUser.updateProfile({displayName: dpn});
          }).then(function(){
            window.open('./login.html', '_self');
          });
        });
      });
    });
  }
}
