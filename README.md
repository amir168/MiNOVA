Eth-NOVA
=

Introduction
==


## Installaton / Configuration ##

Make sure node is installed, then just launch `node app` in the directory. Running on startup *as administrator* is recommended in order for the overclocking to properly apply.

Please modify the configuration file to your liking. At the very minimum, the `path` should be modified with your wallet information. 

The default mining configuration is for a GTX 1060.

`node app` to start the application.

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