const sound = new Howl({
    src: ['audio/beep.mp3'],
    html5: true
});

let found = false;
let total = 0.0;

const coolDown = 2000 // 5s cooldown

let lastClick = Date.now() - coolDown // to start fresh

function startCoolDown() {
    lastClick = Date.now() // maybe useless function
}

function checkCoolDown() {
    const notOver = Date.now() - lastClick < coolDown
    // if (notOver) alert('stop spamming the server !')
    // using an alert it will block javascript loops
    return !notOver
}

/**
 * Converts a list of strings into a price between 0 and 25.
 */
function stringToPrice(strings) {

    let hash = 0;

    const combinedString = strings.join('');

    for (let i = 0; i < combinedString.length; i++) {
        hash = (hash * 31 + combinedString.charCodeAt(i)) % 1000000;
    }

    console.log(hash)

    // Scale to range [0, 25]
    const price = (hash % 2500) / 100;

    // Return price rounded to 2 decimal places
    return parseFloat(price.toFixed(2));
}

function onScanSuccess(decodedText, decodedResult) {

    if (found) return;

    found = true;

    if (checkCoolDown()) {

        startCoolDown()

        let price = stringToPrice([decodedText]);

        total = parseFloat((total + price).toFixed(2));

        document.getElementById("price").innerText = price;
        document.getElementById("total").innerText = total;

        sound.play();
    }
}

function onScanFailure(error) {
    found = false;
}

let verbose = false;

let config = {
    fps: 10,
    qrbox: {
        width: 150,
        height: 150
    },
    supportedScanTypes: [
        Html5QrcodeScanType.SCAN_TYPE_CAMERA
    ]
}

let html5QrcodeScanner = new Html5QrcodeScanner("reader", config, verbose);

html5QrcodeScanner.render(onScanSuccess, onScanFailure);