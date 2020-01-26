firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log(user.email);
      window.open('./index.html', '_self');
    }
  });
function login(){
  var username = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  console.log(username);
  console.log(password);
  firebase.auth().signInWithEmailAndPassword(username, password).catch(function(error) {
  var errorCode = error.code;
  var errorMessage = error.message;
  window.alert(error);
});
}
