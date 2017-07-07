/*

Eth-NOVA - Ethereum Nvidia OVerclocking mining Application.
-- by n4ru

Donations
--
ETH: 0x00972cd6a2c6786afbcc24ca592b8c86f33f747a
BTC: 1n4ruYy5QWbTDBbPEyBRWwj1Ni4U4Sz5P

*/

var fs = require("fs"),
    fulldata = "",
    exec = require('child_process').exec,
    config = require("./config.json"),
    warn = [],
    restart = 0;

function util() {
    console.log('\033[2J');
    console.log('Donations - ETH: 0x00972cd6a2c6786afbcc24ca592b8c86f33f747a / BTC: 1n4ruYy5QWbTDBbPEyBRWwj1Ni4U4Sz5P');
    var child = exec(".\\bin\\nvidia-smi --query-gpu=utilization.gpu --format=csv,noheader");
    fulldata = "";
    child.stdout.on('data', function(data) {
        fulldata = fulldata + data
    });
    child.stdout.on('close', function(data) {
        data = JSON.parse(("[ " + fulldata.replace(/\n/g, ", ").replace(/\%/g, '') + "]").replace(", ]", "]"))
        for (var ind in data) {
            // Increment Warn if miner is idle
            if (data[ind] < config.threshold) {
                warn[ind]++;
                console.log("GPU" + ind + " idle for: " + warn[ind] + " cycles");
            }
            // Reset Warn once the GPU is hashing again
            if (data[ind] > config.threshold) {
                warn[ind] = 0;
            }
            // This GPU has been off for too long (hardware probably crashed) - restart the rig
            if (warn[ind] >= config.rebootRig) {
                exec(config.reboot);
            }
            // Restart the mining application
            if (warn[ind] >= config.restartApp && restart == 0) {
                restart = 1;
            }
        }
        var sum = warn.reduce(function(a, b) {
            return a + b
        }, 0);
        // All GPUs are hashing, no restart is pending
        if (sum == 0)
            restart = 0;
        // Restart the miner
        if (restart == 1) {
            restart = 2;
            exec(config.kill).stdout.on('close', function() {
                exec("start " + config.path)
            })
        }
        setTimeout(util, 1000);
    });
}

// Set P-State 0
if (config.p0) {
    exec(".\\bin\\nvidiasetp0state");
}

// Overclock the GPU(s) and set power limit
exec(".\\bin\\nvoc +" + config.core + " +" + config.mem);
exec(".\\bin\\nvidia-smi --power-limit=" + config.power);

// Start the miner
exec("start " + config.path);

// Initialize the warn array
var inits = exec(".\\bin\\nvidia-smi --query-gpu=utilization.gpu --format=csv,noheader");
var fulldata = "";
inits.stdout.on('data', function(data) {
    fulldata = fulldata + data
});
inits.stdout.on('close', function(data) {
    data = JSON.parse(("[ " + fulldata.replace(/\n/g, ", ").replace(/\%/g, '') + "]").replace(", ]", "]"))
    for (x in data) {
        warn.push(0);
    }
    util();
})