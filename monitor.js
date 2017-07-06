var fs = require("fs"),
    fulldata = "",
    exec = require('child_process').exec,
    config = require("./config.json"),
    warn = [],
    restart = 0;

function util() {
    console.log('\033[2J');
    var child = exec(config.cmd);
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
                exec(config.path)
            })
        }
        setTimeout(util, 1000);
    });
}

// Initialize the warn array
if (fs.existsSync('nvidia-smi') || fs.existsSync('nvidia-smi.exe')) {
    var inits = exec(config.cmd);
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
} else {
    console.log("nvidia-smi not found. Exiting.")
}