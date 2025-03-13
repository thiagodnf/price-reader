var sound = new Howl({
    src: ['audio/beep.mp3']
});

const coolDown = 2000 // 5s cooldown

let lastClick = Date.now() - coolDown // to start fresh

function startCoolDown () {
    lastClick = Date.now() // maybe useless function
}

function checkCoolDown () {
    const notOver = Date.now() - lastClick < coolDown
    // if (notOver) alert('stop spamming the server !')
    // using an alert it will block javascript loops
    return !notOver
}

function stringToPrice(strings) {
    /**
     * Converts a list of strings into a price between 0 and 25.
     */
    let hash = 0;
    const combinedString = strings.join('');
    for (let i = 0; i < combinedString.length; i++) {
        hash = (hash * 31 + combinedString.charCodeAt(i)) % 1000000;
    }
    const price = (hash % 2500) / 100; // Scale to range [0, 25]
    return parseFloat(price.toFixed(2)); // Return price rounded to 2 decimal places
}

function onScanSuccess(decodedText, decodedResult) {

    if (checkCoolDown()) {
        
        startCoolDown()
        // handle the scanned code as you like, for example:
        console.log(`Code matched = ${decodedText}`, decodedResult);
        document.getElementById("output").innerText = stringToPrice([decodedText]);
        // document.getElementById("error").innerText = ""
        sound.play();
    }
}

function onScanFailure(error) {
    // handle scan failure, usually better to ignore and keep scanning.
    // for example:
    // document.getElementById("output").innerText = ""
    // document.getElementById("error").innerText = `Code scan error = ${error}`;
}

let html5QrcodeScanner = new Html5QrcodeScanner("reader",{ 
    fps: 10, 
    qrbox: { 
        width: 150, 
        height: 150 
    } 
},
    /* verbose= */ false);

html5QrcodeScanner.render(onScanSuccess, onScanFailure);