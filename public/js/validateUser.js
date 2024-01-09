//for signin username
// function validateTextField(input){
//     input.value = input.value.replace(/[^A-Za-z]/g, '');
// }

//for mobile number
// function validateMobile(input){
//     input.value = input.value.replace(/\D/g, '');
// }

// validateUser.js

function validateTextField(input) {
    if (input.value.trim() === '') {
        showError(input, `${getFieldName(input)} is required`);
    } else if (!/^[A-Za-z]+$/.test(input.value.trim())) {
        showError(input, 'Name should contain only alphabets');
    } else {
        removeError(input);
    }
}

function validateEmail(input) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.value.trim())) {
        showError(input, 'Enter a valid email address');
    } else {
        removeError(input);
    }
}

function validateMobile(input) {
    if (input.value.trim() === '') {
        showError(input, `${getFieldName(input)} is required`);
    } else if (!/^\d{10}$/.test(input.value.trim())) {
        showError(input, 'Enter a valid 10-digit mobile number');
    } else {
        removeError(input);
    }
}

function validateForm() {
    const form = document.getElementById('register-form');
    const inputs = form.querySelectorAll('input[required]');

    let isValid = true;

    inputs.forEach((input) => {
        if (input.id === 'name') {
            if (input.value.trim() === '' || !/^[A-Za-z]+$/.test(input.value.trim())) {
                showError(input, `${getFieldName(input)} is required and should contain only alphabets`);
                isValid = false;
            }
        } else if (input.id === 'mobile') {
            if (input.value.trim() === '' || !/^\d{10}$/.test(input.value.trim())) {
                showError(input, 'Enter a valid 10-digit mobile number');
                isValid = false;
            }
        } else {
            if (input.value.trim() === '') {
                showError(input, `${getFieldName(input)} is required`);
                isValid = false;
            }
        }
    });

    return isValid;
}

function showError(input, message) {
    const formGroup = input.parentElement;
    const errorMessage = formGroup.querySelector('.error-message');

    if (!errorMessage) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = 'red';
        errorDiv.innerText = message;
        formGroup.appendChild(errorDiv);
    }
}

function removeError(input) {
    const formGroup = input.parentElement;
    const errorMessage = formGroup.querySelector('.error-message');

    if (errorMessage) {
        formGroup.removeChild(errorMessage);
    }
}

function getFieldName(input) {
    return input.placeholder || input.name;
}

document.getElementById('register-form').addEventListener('submit', function (event) {
    if (!validateForm()) {
        event.preventDefault();
    }
});
