/*

Minova - Miner and Nvidia OVerclocking mining Application.
-- by n4ru

Donations
--
ETH: 0x00972cd6a2c6786afbcc24ca592b8c86f33f747a
BTC: 1n4ruYy5QWbTDBbPEyBRWwj1Ni4U4Sz5P

*/

var revision = 1,
    exec = require('child_process').exec,
    spawn = require('child_process').spawn,
    dns = require('dns'),
    request = require('request'),
    config = require(process.cwd() + "\\config.json"),
    warn = [],
    currentcoin = "",
    coin = "ETH",
    profitability = 100,
    restart = 0,
    justStart = true,
    lastShare = null,
    lastHash = 0,
    miner = null;

function logo() {
    console.log('\033[2J');
    console.log("                            MINOVA X / Mining " + coin + " (Profitability: " + profitability + "%)");
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
    //console.log('        ETH: 0x00972cd6a2c6786afbcc24ca592b8c86f33f747a / BTC: 1n4ruYy5QWbTDBbPEyBRWwj1Ni4U4Sz5P');
    console.log();
}

function getProfit(cb) {
    if (Object.keys(config.miners).length > 1) {
        request('http://whattomine.com/coins.json', function(error, response, body) {
            if (error) {
                // If the API is unreachable, we'll default to Ethereum.
                coin = "ETH";
                cb("ETH");
            } else {
                if (body[0] == "{") {
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
                    console.log("Mining " + coin + " - Profitability: " + profitability);
                    cb(profits);
                } else {
                    profitability = "---";
                    coin = Object.keys(config.miners)[0];
                    cb(coin);
                }
            }
        });
    } else {
        profitability = "---";
        coin = Object.keys(config.miners)[0];
        cb(coin);
    }
}

function switchProfit(initial) {
    setTimeout(switchProfit, config.profitTime)
    getProfit(function(data) {
        if (currentcoin != coin) {
            currentcoin = coin;
            if (initial) {
                util();
            } else if (miner) {
                miner.kill();
            }
        }
    })
}

function doData(data) {
    data = data.toString('utf8');
    let hashString = "";
    if (/([0-9]*:[0-9]*:[0-9]*)\|/.test(data))
        hashString += "[" + data.match(/([0-9]*:[0-9]*:[0-9]*)\|/)[1] + "] ";
    if (/an illegal instruction was encountered/.test(data)) {
        hashString += "We crashed! Restarting...\nIf you get this often, tweak your overclock settings.";
        console.log(hashString);
        miner.kill();
    } else if (/Reconnecting/.test(data)) {
        hashString += "Connection dropped. Attempting to reconnect.";
        console.log(hashString);
    } else if (/Submitted and accepted/.test(data)) {
        lastShare = Date.now();
        justStart = false;
        hashString += coin + " - Share submitted and accepted!";
        console.log(hashString);
    } else if (/CUDA ?# ?[0-9]* ?: ?[0-9]*%/.test(data)) {
        let cuda = data.match(/CUDA ?# ?([0-9]*) ?: ?[0-9]*%/)[1];
        let cudaPercent = data.match(/CUDA ?# ?[0-9]* ?: ?([0-9]*)%/)[1];
        hashString += "Generating the DAG... GPU #" + cuda + " - " + cudaPercent + "%";
        console.log(hashString);
    } else if (/Speed *\S* Mh\/s/.test(data)) {
        let hashrate = data.match(/Speed *(\S*) Mh\/s/)[1];
        if (parseInt(hashrate) > 0 && Math.abs((hashrate / lastHash) - 1) > 0.02) {
            lastHash = hashrate;
            hashString += "Current Hashrate: " + hashrate + " Mh\/s";
            if (config.core > 0)
                hashString += " / Clock: +" + config.core + "";
            if (config.mem > 0)
                hashString += " / Memory: +" + config.mem + "";
            if (config.power)
                hashString += " / Power: " + config.power + "W";
            if (lastShare)
                hashString += " / Last Share: " + parseInt((Date.now() - lastShare) / 1000) + " seconds ago.";
            console.log(hashString);
        }
    }
}

function util() {
    // Here we spawn the miner and watch it
    let args = config.miners[coin].split(' ');
    miner = spawn(process.cwd() + args.splice(0, 1), args);
    miner.stderr.on('data', function(data) {
        doData(data);
    });
    miner.stdout.on('data', function(data) {
        doData(data);
    });
    miner.on('exit', function(code) {
        miner = null;
        util();
    });
}

// Overclock the GPU(s) and set power limit
if (config.mem || config.core)
    if (config.mem == false)
        config.mem = 2;
if (config.core == false)
    config.core = 0;
exec(process.cwd() + "\\bin\\nvoc +" + config.core + " +" + (config.mem / 2));
if (config.power)
    exec(process.cwd() + "\\bin\\nvidia-smi --power-limit=" + config.power);

// Set P-State 0
if (config.pstate)
    exec(process.cwd() + "\\bin\\nvidiasetp0state");

setInterval(function() {
    if (!justStart && parseInt((Date.now() - lastShare) / 1000) > config.rebootRig) {
        exec(config.reboot);
    }
}, 1000);

logo();
try {
    switchProfit(true);
} catch (e) {
    switchProfit(true);
}