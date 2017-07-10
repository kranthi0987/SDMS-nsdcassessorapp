
function validateLoginCLick(username, password) {
    if(username == "" || password == ""){
        alert("Please fill the required details")
        return false;
    } 
    return true;
}

function validateForgotPassword(emailID) {
    if(!emailID || emailID == "" ) {
        alert("Please eneter valid email ID.")
    }
}
$('#decimalPt, .decimalPt').keypress(function(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode == 8 || charCode == 37) {
        return true;
    } else if (charCode == 46 && $(this).val().indexOf('.') != -1) {
        return false;
    } else if (charCode > 31 && charCode != 46 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
});
