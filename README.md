# WebRTC file transfer app

## Usage:

Create or join a room by scanning a QR or entering room id.
<img width="1871" height="1017" alt="2026-01-31-214257_1871x1017_escrotum" src="./img/2026-01-31-214257_1871x1017_escrotum.png" />

Wait for peers, select file, transfer files.
<img width="1870" height="1017" alt="2026-01-31-214348_1870x1017_escrotum" src="./img/2026-01-31-214348_1870x1017_escrotum.png" />

# Features

Server side

> WS signaling server + express http server on the backend.
>
> Supports multiple rooms.
>
> Rooms currently in memory.

Client side

> After peer connection one data channel is opened for each file to be transfered
>
> Files are chunked and sent from sender to receiver

Try app at: (https://webrtc-fileshare.vercel.app/)
