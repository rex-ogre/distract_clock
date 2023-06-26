export class Timer {
    constructor(time) {
      this.time = time;
      this.intervalID = null;
    }
  
    // Getter
    get getTime() {
      return this.time;
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
      this.time += 1;
    }
    resetTime() {
      this.time = 0;
    }
  }
