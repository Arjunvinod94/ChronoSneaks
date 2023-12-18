//for signin username
function validateTextField(input){
    input.value = input.value.replace(/[^A-Za-z]/g, '');
}

//for mobile number
function validateMobile(input){
    input.value = input.value.replace(/\D/g, '');
}

