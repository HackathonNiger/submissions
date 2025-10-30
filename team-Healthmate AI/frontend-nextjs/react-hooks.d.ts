import * as React from 'react';

declare module 'react' {
  export function useState<S>(initialState: S | (() => S)): [S, React.Dispatch<React.SetStateAction<S>>];
  export function useEffect(effect: React.EffectCallback, deps?: React.DependencyList): void;
  export function useRef<T>(initialValue: T): React.MutableRefObject<T>;
  export function useRef<T>(initialValue: T | null): React.RefObject<T>;
  export function useRef<T = undefined>(): React.MutableRefObject<T | undefined>;
  
  export interface KeyboardEvent<T = Element> extends React.SyntheticEvent<T, globalThis.KeyboardEvent> {
    key: string;
  }
  
  export interface MouseEvent<T = Element> extends React.SyntheticEvent<T, globalThis.MouseEvent> {}
  
  export interface ChangeEvent<T = Element> extends React.SyntheticEvent<T> {
    target: EventTarget & T;
  }
}