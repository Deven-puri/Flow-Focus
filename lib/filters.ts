/**
 * Smoothing algorithms for eye-tracking data
 * Raw WebGazer data is jittery due to saccades (tiny eye jumps)
 */

export class WeightedMovingAverage {
  private previousX: number | null = null;
  private previousY: number | null = null;
  private weight: number;

  constructor(weight = 0.8) {
    // Weight determines smoothing: 0.8 = 80% previous + 20% new
    this.weight = weight;
  }

  smooth(x: number, y: number): { x: number; y: number } {
    if (this.previousX === null || this.previousY === null) {
      this.previousX = x;
      this.previousY = y;
      return { x, y };
    }

    // Apply weighted moving average
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
  private Q: number; // Process noise covariance
  private R: number; // Measurement noise covariance
  private P: number; // Estimation error covariance
  private K: number; // Kalman gain
  private x: number | null; // Current estimate

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

    // Prediction update
    const priorP = this.P + this.Q;

    // Measurement update
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
