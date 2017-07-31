<p align="center">
<img src="http://i.imgur.com/eaMx96c.png">
</p>

MiNOVA
=

Introduction
==

**MiNOVA** is an absurdly simple all-in-one mining "hypervisor" application tailored toward Windows / nVidia setups. It will overclock your GPUs, set your power limit, fix P-state, launch your miner, and monitor your mining rig for issues. It is designed to be an AIO application to get started with mining on a Windows nVidia mining rig.

## Features ##
- Profit switching.
- Overclocking on launch.
- Power limit setting on launch.
- P-state setting on launch.
- Monitoring GPU utilization, rebooting miner/machine on hang/error.
- Autostart mining.

## Download ##

Pre-compiled binaries are found [here](https://github.com/n4ru/MiNOVA/releases).

## Installaton / Configuration ##

The default mining configuration applies no overclock or p-state changes and sets the power limit to 120W.

Modify the configuration file to your liking. At the very minimum, the `path` should be modified with your wallet information. 

Adding this application to your startup is recommended. If you do so, **make sure it is ran as administrator (along with EVERY executable in the binary folder!) and is launched from its own directory! Turning off UAC is also necessary to ensure application launches run uninterrupted.**

##### Configuration is as follows: #####
- `theshold`: Threshold in utilization percent to consider a GPU *idle*.
- `path`: Path to the miner that should be launched. **Modify this!**
- `reboot`: The command that is executed when a GPU is idle despite miner restart.
- `restartApp`: Idle time in cycles (one second default) until the miner process is killed and restarted.
- `rebootRig`: Idle time in cycles (one second default) until the entire machine is rebooted.
- `core`: Core overclock amount in MHz. False to turn off.
- `mem`: Memory overclock amount in MHz. False to turn off.
- `power`: Power Limit in Watts (NOT percentage!).
- `pstate`: Required for some newer cards to always run at full power. False to turn off.
- `cycleTime`: Time in seconds between "cycles". If you notice the console lags, increase this and decrease your restart/reboot settings proportionally.Default is one second.

### TO-DO ###
- Dependency rewrite
- Event Logging
- Linux Support
- AMD Support
- Configurator App

## Donations ##
- ETH: 0x00972cd6a2c6786afbcc24ca592b8c86f33f747a 
- BTC: 1n4ruYy5QWbTDBbPEyBRWwj1Ni4U4Sz5P