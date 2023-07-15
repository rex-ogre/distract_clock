export class Timer {
  constructor(time) {
    this._time = time;
    this.intervalID = null;
  }

  // Getter
  get time() {
    return this._time;
  }

  // Method
  startTimer(timerCallback) {
    if (!this.intervalID) {
      this.intervalID = setInterval(timerCallback, 1000);
    }
  }
  stopTimer() {
    clearInterval(this.intervalID);
    this.intervalID = null;
  }
  plusTime() {
    this._time += 1;
  }
  resetTime() {
    this._time = 0;
  }
}
