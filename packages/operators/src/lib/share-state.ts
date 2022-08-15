import { share, ReplaySubject, Observable, OperatorFunction } from 'rxjs';
import { ShareConfig } from 'rxjs/operators';

export interface ShareStateConfig<T> extends Omit<ShareConfig<T>, 'connector'> {
  value?: T;
  bufferSize?: number;
  windowTime?: number;
}

/**
 * Allowing (1) automatic unsubscribing when there are no subscriptions
 * and (2) stores only one value by default
 * (like 'shareReplay({refCount: true, bufferSize: 1})'),
 * but (3) returning the last value when resubscribing
 *
 * (4) allows to set the starting value
 */
export const shareState = <V>(config: ShareStateConfig<V> = {}) => {
  const connectorSubject = new ReplaySubject(
    config.bufferSize ?? 1,
    config.windowTime ?? Infinity
  );
  if ('value' in config) {
    connectorSubject.next(config.value);
  }
  return <T>(source$: Observable<T>): Observable<V extends T ? T : V | T> =>
    source$.pipe(
      share({
        connector: () => connectorSubject,
        resetOnComplete: false,
        resetOnError: false,
        resetOnRefCountZero: true,
        ...config,
      }) as OperatorFunction<T, V extends T ? T : V | T>
    );
};
