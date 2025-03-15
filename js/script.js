const sound = new Howl({
    src: ['audio/beep.mp3'],
    html5: true
});

let found = false;
let total = 0.0;

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

console.log(isMobile)
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

    // Scale to range [0, 25]
    const price = 1 + (hash % 2400) / 100;

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

// Square QR box with edge size = 70% of the smaller edge of the viewfinder.
let qrboxFunction = function(viewfinderWidth, viewfinderHeight) {
    
    // 70%
    let minEdgePercentage = 0.7; 
    
    let minEdgeSize = Math.min(viewfinderWidth, viewfinderHeight);
    
    let qrboxSize = Math.floor(minEdgeSize * minEdgePercentage);
    
    return {
        width: qrboxSize,
        height: qrboxSize
    };
}

function getAspectRatio() {
    // const FOR_MOBILE_ASPECT_RATIO = 4/3;
    const FOR_MOBILE_ASPECT_RATIO = 16/9;
    const FOR_DESKTOP_ASPECT_RATIO = 4/3;

    return isMobile ? FOR_MOBILE_ASPECT_RATIO : FOR_DESKTOP_ASPECT_RATIO;
}

let verbose = false;

let config = {
    fps: 10,
    qrbox: qrboxFunction,
    useBarCodeDetectorIfSupported: true,
    rememberLastUsedCamera: true,
    aspectRatio: this.getAspectRatio(),
    showTorchButtonIfSupported: true,
    showZoomSliderIfSupported: true,
    defaultZoomValueIfSupported: 1.5,
    supportedScanTypes: [
        Html5QrcodeScanType.SCAN_TYPE_CAMERA,
        Html5QrcodeScanType.SCAN_TYPE_FILE,
    ]
}

let html5QrcodeScanner = new Html5QrcodeScanner("reader", config, verbose);

html5QrcodeScanner.render(onScanSuccess, onScanFailure);