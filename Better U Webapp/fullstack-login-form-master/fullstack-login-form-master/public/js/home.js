// const greeting = document.querySelector('.greeting');

// window.onload = () => {
//     if(!sessionStorage.name){
//         location.href = '/login';
//     } else{
//         greeting.innerHTML = `Hello, ${sessionStorage.name}!`;
//     }
// }

// const logOut = document.querySelector('.logout');

// logOut.onclick = () => {
//     sessionStorage.clear();
//     location.reload();
// }

const greeting = document.querySelector('.greeting');

window.onload = () => {
    if (!sessionStorage.name) {
        location.href = '/login';
    } else {
        const hour = new Date().getHours();
        let greetingMessage;

        if (hour >= 5 && hour < 12) {
            greetingMessage = 'Good morning';
        } else if (hour >= 12 && hour < 18) {
            greetingMessage = 'Good afternoon';
        } else {
            greetingMessage = 'Goodnight';
        }

        greeting.innerHTML = `${greetingMessage}, ${sessionStorage.name}!`;
    }
}

const logOut = document.querySelector('.logout');

logOut.onclick = () => {
    sessionStorage.clear();
    location.reload();
}
