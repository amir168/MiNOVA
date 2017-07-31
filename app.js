/*

Minova - Miner and Nvidia OVerclocking mining Application.
-- by n4ru

Donations
--
ETH: 0x00972cd6a2c6786afbcc24ca592b8c86f33f747a
BTC: 1n4ruYy5QWbTDBbPEyBRWwj1Ni4U4Sz5P

*/

var revision = 1,
    fulldata = "",
    exec = require('child_process').exec,
    dns = require('dns'),
    request = require('request'),
    config = require(process.cwd() + "\\config.json"),
    warn = [],
    currentcoin = "",
    coin = "ETH",
    profitability = 100,
    restart = 0;

function logo() {
    console.log('\033[2J');
    console.log("                            MINOVA r" + revision + " / Mining " + coin + " (Profitability: " + profitability + "%)");
    console.log("                                             `          `                                           ");
    console.log("                                          ./yh+`      -sy/`                                         ");
    console.log("                                       `/ydmmmmy.   .smmmmh+s:                                      ");
    console.log("                                      /hmmmmmdy/`   .sdmmmmmms`                                     ");
    console.log("                                    `smmmmmmy.        -dmmmmmms                                     ");
    console.log("                                   .ymmmmdsdmy:     `/hmdymmmmm+                                    ");
    console.log("                                   -smmmh. `odmh: `/hmd+` ./oydd-                                   ");
    console.log("                                     `+o`    .smmhdmdo`        ..                                   ");
    console.log("                                              `smmmm+                                               ");
    console.log("                                            `+dmmsymmh/                                             ");
    console.log("                                          `+dmmy-  :ymmh/`                                          ");
    console.log("                                        `+dmmy-      :hmmh/`                                        ");
    console.log("                                       odmmy:         `/hmmh/                                       ");
    console.log("                                       :yh/`            `+hs.                                       ");
    console.log("                                        ``                `                                         ");
    console.log('        ETH: 0x00972cd6a2c6786afbcc24ca592b8c86f33f747a / BTC: 1n4ruYy5QWbTDBbPEyBRWwj1Ni4U4Sz5P');
    console.log();
}

function getProfit(cb) {
    if (config.miners.length > 1) {
        request('http://whattomine.com/coins.json', function(error, response, body) {
            if (error) {
                // If the API is unreachable, we'll default to Ethereum.
                coin = "ETH";
                cb("ETH");
            } else {
                profits = [];
                coins = JSON.parse(body);
                for (x in Object.keys(coins.coins)) {
                    profit = coins['coins'][Object.keys(coins['coins'])[x]]['profitability24'];
                    tag = coins['coins'][Object.keys(coins['coins'])[x]]['tag'];
                    if (Object.keys(config.miners).includes(tag) && !coins['coins'][Object.keys(coins['coins'])[x]]['lagging'] && (profit > 100 || tag == "ETH")) {
                        profits.push({
                            name: tag,
                            profit: profit
                        })
                    }
                }
                profits.sort(function(a, b) {
                    if (a.profit < b.profit)
                        return 1;
                    else
                        return -1;
                    return 0;
                })
                profitability = profits[0].profit;
                profits = profits[0].name;
                coin = profits;
                cb(profits);
            }
        });
    } else {
        profitability = "---";
        coin = Object.keys(config.miners)[0];
        cb(coin);
    }
}

function switchProfit(initial) {
    getProfit(function(data) {
        if (currentcoin != coin) {
            // Kill & start the miner
            exec(config.kill).stdout.on('close', function() {
                exec("start " + process.cwd() + config.miners[coin]);
                currentcoin = coin;
                if (initial) {
                    util();
                }
            })
        }
    })
}

function util() {
    logo();
    dns.lookup('google.com', function(err) {
        if (err && err.code == "ENOTFOUND") {
            console.log("Waiting for Internet Connection.")
            setTimeout(util, config.cycleTime * 1000);
        } else {
            var child = exec(process.cwd() + "\\bin\\nvidia-smi --query-gpu=utilization.gpu --format=csv,noheader");
            fulldata = "";
            child.stdout.on('data', function(data) {
                fulldata = fulldata + data;
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
                    return a + b;
                }, 0);
                // All GPUs are hashing, no restart is pending
                if (sum == 0)
                    restart = 0;
                // Restart the miner
                if (restart == 1) {
                    restart = 2;
                    exec(config.kill).stdout.on('close', function() {
                        exec("start " + process.cwd() + config.miners[coin]);
                    })
                }
                setTimeout(util, config.cycleTime * 1000);
                setTimeout(switchProfit, config.profitTime * 1000);
            });
        }
    });
}

// Overclock the GPU(s) and set power limit
if (config.mem || config.core) {
    if (config.mem == false)
        config.mem = 0
    if (config.core == false)
        config.core = 0
    exec(process.cwd() + "\\bin\\nvoc +" + config.core + " +" + (config.mem / 2));
}
if (config.power)
    exec(process.cwd() + "\\bin\\nvidia-smi --power-limit=" + config.power);
// Set P-State 0
if (config.pstate) {
    exec(process.cwd() + "\\bin\\nvidiasetp0state");
}

// Initialize the warn array
var inits = exec(process.cwd() + "\\bin\\nvidia-smi --query-gpu=utilization.gpu --format=csv,noheader");
var fulldata = "";

inits.stdout.on('data', function(data) {
    fulldata = fulldata + data;
});

inits.stdout.on('close', function(data) {
    data = JSON.parse(("[ " + fulldata.replace(/\n/g, ", ").replace(/\%/g, '') + "]").replace(", ]", "]"))
    for (x in data) {
        warn.push(0);
    }
})

switchProfit(true);