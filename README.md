<p align="center">
<img src="http://i.imgur.com/TMlyY2s.png">
</p>

Eth-NOVA
=

Introduction
==

**Eth-NOVA** is an absurdly simple node all-in-one mining application tailored toward Windows / nVidia setups. It will overclock your GPUs, set your power limit, fix P-state, launch your miner, and monitor your mining rig for issues. It is designed to be an AIO application to get started with mining on a Windows nVidia mining rig.

## Installaton / Configuration ##

The default mining configuration applies no overclock or p-state changes and sets the power limit to 120W.

Modify the configuration file to your liking. At the very minimum, the `path` should be modified with your wallet information. 

Adding this application to your startup is recommended. If you do so, **make sure it is ran as administrator and is launched from its own directory! Turning off UAC is also necessary to ensure application launches run uninterrupted.**

##### Configuration is as follows: #####
- `theshold`: Threshold in utilization percent to consider a GPU *idle*.
- `kill`: Command to kill your mining process. **Modify this if you are not using ethminer!**
- `path`: Path to the miner that should be launched. **Modify this!**
- `reboot`: The command that is executed when a GPU is idle despite miner restart.
- `restartApp`: Idle time in cycles (roughly seconds) until the miner process is killed and restarted.
- `rebootRig`: Idle time in cycles (roughly seconds) until the entire machine is rebooted.
- `core`: Core overclock amount in MHz.
- `mem`: Memory overclock amount in MHz. *This should be **HALF** of what is shown in Afterburner!*
- `power`: Power Limit in Watts (NOT percentage!).

If you do not trust the packaged binaries, you can replace them with their original sources, as detailed below.

##### Binary Sources #####
- `etherminer`: Official etherminer release. Link: https://github.com/ethereum-mining/ethminer/releases
- `nvidia-smi`: Official nVidia CUDA drivers. Link: https://developer.nvidia.com/cuda-downloads
- `nvidiasetp0state`: Official NiceHash miner release. Link: https://github.com/nicehash/NiceHashMiner/releases
- `nvoc`: Windows NVOC Port. Link: https://github.com/deathcamp/NVOC/blob/master/nvoc.exe

### TO-DO ###
- Event Logging
- Internet connectivity check
- Linux Support
- AMD Support
- Configurator App

## Donations ##
- ETH: 0x00972cd6a2c6786afbcc24ca592b8c86f33f747a 
- BTC: 1n4ruYy5QWbTDBbPEyBRWwj1Ni4U4Sz5P
