import { Observable, forkJoin, of, interval, fromEvent, timer } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { delay, take, mapTo, scan, startWith, combineLatest, reduce } from 'rxjs/operators';

var observable = Observable.create((observer: any) => {
  observer.next('Hello world!');
  observer.next('Hello Again!');
  observer.next('Hello world!');
  observer.complete();
  observer.next('Bye');
});

observable.subscribe(
  (x: any) => logItem(x),
  (error: any) => logItem('Error: ' + error),
  () => logItem('Completed'),
);

// combine observable
forkJoin({
  google: ajax.getJSON('https://api.github.com/users/google'),
  microsoft: ajax.getJSON('https://api.github.com/users/microsoft'),
}).subscribe(console.log);

function logItem(val: any) {
  var node = document.createElement('li');
  var textNode = document.createTextNode(val);
  node.appendChild(textNode);
  document.getElementById('list').appendChild(node);
}

const myPromise = (val: string) => new Promise((resolve) => setTimeout(() => resolve(` Promise Resolved: ${val}`), 5000));

/**
 * When all observables complete, give the last
 * emitted value from each as an array
 */
const example = forkJoin(
  // emit "hello" immediately
  of('Hello'),
  // emit "world" after 1 second
  of('World').pipe(delay(1000)),
  // emit 0..1 in 1 second interval
  interval(1000).pipe(take(1)),
  interval(1000).pipe(take(2)),
  myPromise('result'),
);
const subscribeForJoinExample = example.subscribe(console.log);

fromEvent(document.getElementById('countClick'), 'click')
  .pipe(
    mapTo(1),
    scan((acc, curr) => acc + curr, 0),
    startWith(0),
  )
  .subscribe((val) => console.log(`So click la ${val}.`));

  const timerOne$ = timer(1000, 4000);
  // timerTwo emits first value at 2s, then once every 4s
  const timerTwo$ = timer(2000, 4000);
  // timerThree emits first value at 3s, then once every 4s
  const timerThree$ = timer(3000, 4000);
  
  // when one timer emits, emit the latest values from each timer as an array
  // combineLatest(timerOne$, timerTwo$, timerThree$).subscribe(
  //   ([timerValOne, timerValTwo, timerValThree]) => {
  //     /*
  //       Example:
  //     timerThree first tick: 'Timer One Latest: 0, Timer Two Latest: 0, Timer Three Latest: 0
  //     timerOne second tick: 'Timer One Latest: 1, Timer Two Latest: 0, Timer Three Latest: 0
  //     timerTwo second tick: 'Timer One Latest: 1, Timer Two Latest: 1, Timer Three Latest: 0
  //   */
  //     console.log(
  //       `Timer One Latest: ${timerValOne},
  //      Timer Two Latest: ${timerValTwo},
  //      Timer Three Latest: ${timerValThree}`
  //     );
  //   }
  // );
