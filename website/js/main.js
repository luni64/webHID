let requestButton = document.getElementById('connectButton');
let ledButton = document.getElementById('sendButton');
let inputReportDisplay = document.getElementById('inputReport')

let rawHidFilter = { vendorId: 0x16C0, productId: 0x0486, usagePage: 0xFFAB, usage: 0x0200 }; // RawHID interface
let serEmuFilter = { vendorId: 0x16C0, productId: 0x0486, usagePage: 0xFFC9, usage: 0x0004 }; // SerEMU interface
let rawHidParams = { filters: [rawHidFilter] };
let serEmuParams = { filters: [serEmuFilter] };

let outputReportId = 0x00;
let outputReport = new Uint8Array([64]);

let device;

function handleInputReport(e) {
    let firstByte = e.data.getUint8(0); // read first byte of 64byte report
    inputReportDisplay.innerHTML = "received report (first byte):" + firstByte;   
};

function toggleLED()
{
    outputReport[0] = 0xAA;   // send a report with some data to the Teensy   
    device.sendReport(outputReportId,outputReport);
}

async function connect() {
    let devices = await navigator.hid.requestDevice(rawHidParams); //get allowance to connect to a rawHID Teensy
    if (devices === null || devices.length == 0) return;
    
    device = devices[0];

    console.log('found device: ' + device.productName);
    if (device.open()) {
        console.log('Opened device: ' + device.productName);
        device.addEventListener('inputreport', handleInputReport);        
    };
};


requestButton.addEventListener('click', connect);
ledButton.addEventListener('click', toggleLED);
