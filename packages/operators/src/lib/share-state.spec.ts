import { rxSandbox } from 'rx-sandbox';
import { shareState } from './share-state';
import { Subject, finalize } from 'rxjs';
import { first, tap } from 'rxjs/operators';

const { marbleAssert } = rxSandbox;

it('should return identical frames with source', () => {
  const { getMessages, e, hot } = rxSandbox.create(true);
  const src = '-a--b-|';
  marbleAssert(getMessages(hot(src).pipe(shareState()))).toEqual(e(src));
});

describe('starting value', function () {
  it("shouldn't return starting value if don't pass", () => {
    const nextFn = jest.fn();
    const subj = new Subject<string>();
    const src = subj.pipe(shareState());
    const sub = src.subscribe(nextFn);
    subj.next('a');
    sub.unsubscribe();
    src.pipe(first()).subscribe(nextFn);
    expect(nextFn).toHaveBeenCalledTimes(2);
    expect(nextFn).toHaveBeenCalledWith('a');
    expect(nextFn).toHaveBeenCalledWith('a');
  });

  it('should return starting value if pass', () => {
    const nextFn = jest.fn();
    const subj = new Subject<string>();
    const src = subj.pipe(shareState({ value: 's' }));
    const sub = src.subscribe(nextFn);
    subj.next('a');
    sub.unsubscribe();
    src.pipe(first()).subscribe(nextFn);
    expect(nextFn).toHaveBeenCalledTimes(3);
    expect(nextFn).toHaveBeenCalledWith('s');
    expect(nextFn).toHaveBeenCalledWith('a');
    expect(nextFn).toHaveBeenCalledWith('a');
  });
});

describe('connector', function () {
  it('should return value after re-subscribing', () => {
    const nextFn = jest.fn();
    const subj = new Subject<string>();
    const src = subj.pipe(shareState());
    src.pipe(first()).subscribe(nextFn);
    subj.next('a');
    src.pipe(first()).subscribe(nextFn);
    expect(nextFn).toHaveBeenCalledTimes(2);
    expect(nextFn).toHaveBeenCalledWith('a');
    expect(nextFn).toHaveBeenCalledWith('a');
  });
});

describe('bufferSize', function () {
  it('should return latest value after re-subscribing', () => {
    const nextFn = jest.fn();
    const subj = new Subject<string>();
    const src = subj.pipe(shareState());
    const sub = src.subscribe(nextFn);
    subj.next('a');
    subj.next('b');
    sub.unsubscribe();
    src.pipe(first()).subscribe(nextFn);
    expect(nextFn).toHaveBeenCalledTimes(3);
    expect(nextFn).toHaveBeenCalledWith('a');
    expect(nextFn).toHaveBeenCalledWith('b');
    expect(nextFn).toHaveBeenCalledWith('b');
  });
});

describe('refCount', function () {
  it('the internal subscriber must unsubscribe after the external subscribers unsubscribes', () => {
    const finalizeFn = jest.fn();
    const subj = new Subject<string>();
    const src = subj.pipe(finalize(finalizeFn), shareState());
    const sub0 = src.subscribe();
    sub0.unsubscribe();
    const sub1 = src.subscribe();
    sub1.unsubscribe();
    expect(finalizeFn).toHaveBeenCalledTimes(2);
  });
});

describe('share', function () {
  it('should subscribe once internally to several external', () => {
    const tapFn = jest.fn();
    const subj = new Subject<string>();
    const src = subj.pipe(tap(tapFn), shareState());
    const sub0 = src.subscribe();
    const sub1 = src.subscribe();
    subj.next('a');
    sub0.unsubscribe();
    sub1.unsubscribe();
    expect(tapFn).toHaveBeenCalledTimes(1);
  });
});
