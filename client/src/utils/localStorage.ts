export const LocalStorage: Storage =
  typeof window !== 'undefined' ? localStorage : ({ getItem: Function.prototype, setItem: Function.prototype } as any);
