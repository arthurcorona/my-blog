
form = {
    password: () => document.querySelector('.password').value,
    confirmPassword: () => document.querySelector('.confirm-password').value
}

function weaknessPassword() {
    if(form.password >= 8){
        
    }   
}

function passwordMatch() {
    
    if(form.password() !== form.confirmPassword()) {
        let noMatchMessage = document.querySelector('.incorrect-password')
        noMatchMessage.style.display = 'block'
    }
    else {
        console.log("Senha deu match");
    }
}