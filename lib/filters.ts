export class WeightedMovingAverage {
  private previousX: number | null = null;
  private previousY: number | null = null;
  private weight: number;

  constructor(weight = 0.8) {
    this.weight = weight;
  }

  smooth(x: number, y: number): { x: number; y: number } {
    if (this.previousX === null || this.previousY === null) {
      this.previousX = x;
      this.previousY = y;
      return { x, y };
    }

    const smoothedX = this.weight * this.previousX + (1 - this.weight) * x;
    const smoothedY = this.weight * this.previousY + (1 - this.weight) * y;

    this.previousX = smoothedX;
    this.previousY = smoothedY;

    return { x: smoothedX, y: smoothedY };
  }

  reset() {
    this.previousX = null;
    this.previousY = null;
  }
}

export class KalmanFilter {
  private Q: number;
  private R: number;
  private P: number;
  private K: number;
  private x: number | null;

  constructor(Q = 0.001, R = 0.1) {
    this.Q = Q;
    this.R = R;
    this.P = 1;
    this.K = 0;
    this.x = null;
  }

  filter(measurement: number): number {
    if (this.x === null) {
      this.x = measurement;
      return measurement;
    }

    const priorP = this.P + this.Q;

    this.K = priorP / (priorP + this.R);
    this.x = this.x + this.K * (measurement - this.x);
    this.P = (1 - this.K) * priorP;

    return this.x;
  }

  reset() {
    this.x = null;
    this.P = 1;
  }
}

export class DualKalmanFilter {
  private xFilter: KalmanFilter;
  private yFilter: KalmanFilter;

  constructor(Q = 0.001, R = 0.1) {
    this.xFilter = new KalmanFilter(Q, R);
    this.yFilter = new KalmanFilter(Q, R);
  }

  filter(x: number, y: number): { x: number; y: number } {
    return {
      x: this.xFilter.filter(x),
      y: this.yFilter.filter(y),
    };
  }

  reset() {
    this.xFilter.reset();
    this.yFilter.reset();
  }
}
