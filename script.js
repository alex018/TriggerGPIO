//const baseURL = 'http://localhost:8080';
const baseURL = 'http://localhost:8080';
let accessToken = null;


// Function to be triggered when the button is clicked
function triggerGPIORelay() {


    //console.log("GPIO relay triggered!");


    // Function to authenticate and get access token
    async function authenticate() {
        try {
            const response = await fetch(`${baseURL}/v1/oauth2/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({
                    "grant_type": "password",
                    "username": "admin",
                    "password": "12345678"
                  })
            });

            const data = await response.json();
            console.log(data);

            if (response.status === 200 && data.access_token) {
                accessToken = data.access_token;
                console.log('Authentication successful.');
            } else {
                console.log('Authentication failed.');
            }
        } catch (error) {
            console.error('Error during authentication:', error.message);
        }
    }

    // Function to switch relay to 1 using access token
    async function switchRelayto1() {
        try {
            if (!accessToken) {
                console.log('Access token missing. Authenticating...');
                await authenticate();
            }
            console.log("trigering relay to 1")
            const response = await fetch(`${baseURL}/v1/hidgpio/dev/usb/hiddev0`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`

                },
                body: JSON.stringify({
                   // access_token: accessToken,
                    "relay1": "1"
                })
            });
            console.log(accessToken);

            const data = await response.json();
            console.log(data);

            if (response.status === 200 && data.value === 'OK') {
                console.log('Relay successfully on');
            } else {
                console.log('Relay failed to off, response and data is ' + response.status + data.value);
            }
        } catch (error) {
            console.error('Error while checking relay:', error.message);
            console.log("here are error")
        }
    }

    // Function to switch relay to 0 using access token
    async function switchRelayto0() {
        try {
            if (!accessToken) {
                console.log('Access token missing. Authenticating...');
                await authenticate();
            }
            console.log("triggering relay to 0")
            const response = await fetch(`${baseURL}/v1/hidgpio/dev/usb/hiddev0`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    access_token: accessToken,
                    "relay1": "0"
                })
            });

            const data = await response.json();

            if (response.status === 200 && data.value === 'OK') {
                console.log('Relay successfully off');
            } else {
                console.log('Relay failed to off, response and data is ' + response.status + data.value);
            }
        } catch (error) {
            console.error('Error while checking relay:', error.message);
        }
    }

    // switch relay to 010
    switchRelayto0();
    setTimeout(() => {
        // Code to execute after 1 second
        switchRelayto1();
    }, 1500);

    setTimeout(() => {
        switchRelayto0();
    }, 1500);
    
}

// Add event listener to the button
const button = document.getElementById("triggerButton");
button.addEventListener("click", triggerGPIORelay);