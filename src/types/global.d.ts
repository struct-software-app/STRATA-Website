export {};

declare global {
  interface Window {
    strataDesktop?: {
      platform: string;
      isElectron: boolean;
      getVersion: () => Promise<string>;
    };
  }
}
