export default interface Eula {
  timestamp: Date;
  language: string;
  version: number;
  text: string;
  hash: string;
}

export interface EulaAccepted {
  eulaAccepted: boolean;
}
