export default function validation(errors,name,value){
    switch (name) {
        case 'username':
            let usernameErr=value.length<6?"username can't be less than 6 character":''
            errors.username=usernameErr
            break;

        case 'email':
            let emailerr=value.indexOf('@')=== -1?"please include an '@' in the email":''
            errors.email=emailerr
            break;

        case 'password':
            let passworderr;
            if(value.length<7){
                passworderr="password can't be less than 6 character"
            }

            let re=/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]/
            if(!re.test(value)){
                passworderr='password contain at least one letter and one number:'
            }

            errors.password=passworderr
            break;
    
        default:
            break;
    }

}