# @SafeRx/Operators

The most necessary operators that are missing in the main library

- `shareState()` - similar to `shareReplay({refCount: true, bufferSize: 1})`, but returning the last value when resubscribing

[Other @SafeRx libraries](https://github.com/A77AY/SafeRx)

## Installation

```shell
npm i @saferx/operators
```

## Usage

### `shareState()`

```ts
import { shareState } from '@saferx/operators';
import { switchMap, of, Subject } from 'rxjs';

const updatePosts$ = new Subject<number>();
const posts$ = updatePosts$.pipe(
  switchMap(id => of([{ title: `Post ${id}-1` }, { title: `Post ${id}-2` }])),
  shareState({ value: [] })
);

const sub0 = posts$.subscribe(posts => {
  console.log(posts);
  // []
  // [ { title: 'Post 0-1' }, { title: 'Post 0-2' } ]
  // [ { title: 'Post 1-1' }, { title: 'Post 1-2' } ]
});
updatePosts$.next(0);
updatePosts$.next(1);
sub0.unsubscribe();

const sub1 = posts$.subscribe(posts => {
  console.log(posts);
  // [ { title: 'Post 1-1' }, { title: 'Post 1-2' } ]
});
sub1.unsubscribe();
```
