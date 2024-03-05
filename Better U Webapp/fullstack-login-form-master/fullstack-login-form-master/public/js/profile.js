const profileGreeting = document.querySelector('.profile-greeting');

window.onload = () => {
    if(!sessionStorage.name){
        location.href = '/login';
    } else {
        profileGreeting.innerHTML = `Hello, ${sessionStorage.name}!`;
    }
}

// Add any other profile-specific logic here if needed

const logOut = document.querySelector('.profile-logout');

logOut.onclick = () => {
    sessionStorage.clear();
    location.reload();
}

window.onload = () => {
    // Redirect to login page if the user is not logged in
    if (!sessionStorage.name) {
        location.href = '/login';
    } else {
        // Fill name and email fields with session storage data
        const nameElement = document.querySelector('.profile-name');
        const emailElement = document.querySelector('.profile-email');

        if (nameElement) {
            nameElement.innerHTML = `Name: ${sessionStorage.name}`;
        }

        if (emailElement) {
            // Assuming you have a key 'email' in sessionStorage
            emailElement.innerHTML = `Email: ${sessionStorage.email || ''}`;
        }

        // Display the greeting
        const greetingElement = document.querySelector('.profile-greeting');
        if (greetingElement) {
            greetingElement.innerHTML = `Hello, ${sessionStorage.name}!`;
        }

        // Make other fields empty
        const locationElement = document.querySelector('.profile-location');
        const genderElement = document.querySelector('.profile-gender');
        const religionElement = document.querySelector('.profile-religion');

        if (locationElement) {
            locationElement.innerHTML = 'Location: ';
        }

        if (genderElement) {
            genderElement.innerHTML = 'Gender: ';
        }

        if (religionElement) {
            religionElement.innerHTML = 'Religion: ';
        }
    }
}

const fileInput = document.getElementById('fileInput');
    const profileImage = document.getElementById('profileImage');

    fileInput.addEventListener('change', handleFileSelect);

    function handleFileSelect(event) {
        const file = event.target.files[0];

        if (file) {
            // Assuming FileReader is supported by the browser
            const reader = new FileReader();

            reader.onload = function (e) {
                // Update the profile image source
                profileImage.src = e.target.result;
            };

            reader.readAsDataURL(file);
        }
    }
