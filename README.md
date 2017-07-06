VGA-Mon
=

Introduction
==

**VGA-Mon** is an absurdly simple node GPU monitoring app specifically tailored towards monitoring mining rigs. 
*Currenly, only nVidia / Windows is supported.*

## Installaton / Configuration ##

Make sure node is installed. For most users, leaving the configuration file as-is works fine for use with ethminer. To get up and running, you *must* place the `nvidia-smi.exe` executable in the same directory as VGA-Mon. `nvidia-smi` comes bundled with CUDA drivers, and it is usually found in `%PROGRAMFILES%\NVIDIA Corporation\NVSMI`. Additionally, you should place a `mine.bat` file in the directory as well for VGA-Mon to restart your miner. Changes can be made to the `config.json` file for advanced users. Running `node monitor` on startup is recommended.

`npm install` to install the single dependancy. 
`node monitor` to start the application.

##### Default configuration is as follows: #####
- `theshold`: Threshold in utilization percent to consider a GPU *idle*. Default is 90.
- `kill`: Command to kill your mining process. **Default is `tskill ethminer`**. Modify this if you are not using ethminer!
- `path`: Path to the script that should be launched when a GPU is idle for too long. Default is `mine.bat`.
- `reboot`: The command that is executed when a GPU is idle despite miner restart. Default is `shutdown -r -t 00`.
- `restartApp`: Idle time in cycles (roughly seconds) until the miner process is killed and restarted. Default is 120.
- `rebootRig`: Idle time in cycles (roughly seconds) until the entire machine is rebooted. Default is 360.
- `cmd`: *Don't touch this unless you are pointing to a different `nvidia-smi` directory. Data filtering is currently hard-coded.*

### TO-DO ###
- Event Logging
- Internet connectivity check
- Configurator App
- Temperature Support / Other Metrics
- Linux Support
- AMD Support

## Donations ##
- ETH: 0x00972cd6a2c6786afbcc24ca592b8c86f33f747a 
- BTC: 1n4ruYy5QWbTDBbPEyBRWwj1Ni4U4Sz5P