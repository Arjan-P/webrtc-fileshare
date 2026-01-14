export type ClientId = string;
export type SignalMsg = 
  {type: "offer"; from: ClientId; to: ClientId; offer: RTCSessionDescription}
  |
  {type: "answer"; from: ClientId; to: ClientId; answer: RTCSessionDescription}
  |
  {type: "new-ice-candidates"; from: ClientId; to: ClientId; ice: RTCIceCandidate}
  |
  {type: "new-connection"; id: ClientId; peers: ClientId[]}
  |
  {type: "peer-join"; id: ClientId}
  |
  {type: "peer-left"; id: ClientId}
