export type DUNarrow<T, N> = T extends { type: N } ? T : never;
