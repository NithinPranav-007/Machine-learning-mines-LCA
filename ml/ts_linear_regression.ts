// Simple TypeScript linear regression trainer using gradient descent
// Run with: npm install -D ts-node typescript && npx ts-node ml/ts_linear_regression.ts

import * as fs from 'fs';
import * as csvParse from 'csv-parse/lib/sync';

type Row = any;

const CSV_PATH = './lca_metals_dataset.csv';
const FEATURE_COLS = ['recycling_rate', 'renewable_share', 'transport_km', 'mci', 'scrap_recovery_rate'];
const TARGET = 'carbon_kgCO2_per_kg';

function loadCSV(path: string) {
  const txt = fs.readFileSync(path, 'utf8');
  return csvParse(txt, { columns: true, skip_empty_lines: true });
}

function prepare(rows: Row[]) {
  const X: number[][] = [];
  const y: number[] = [];
  for (const r of rows) {
    const vals = FEATURE_COLS.map(c => Number(r[c] || 0));
    const t = Number(r[TARGET]);
    if (!Number.isFinite(t)) continue;
    X.push(vals);
    y.push(t);
  }
  return {X, y};
}

function normalize(X: number[][]) {
  const cols = X[0].length;
  const means = Array(cols).fill(0);
  const stds = Array(cols).fill(0);
  const n = X.length;
  for (let j = 0; j < cols; j++) {
    for (let i = 0; i < n; i++) means[j] += X[i][j];
    means[j] /= n;
    for (let i = 0; i < n; i++) stds[j] += Math.pow(X[i][j] - means[j], 2);
    stds[j] = Math.sqrt(stds[j] / n) || 1;
    for (let i = 0; i < n; i++) X[i][j] = (X[i][j] - means[j]) / stds[j];
  }
  return {X, means, stds};
}

function dot(a: number[], b: number[]) { return a.reduce((s, v, i) => s + v * b[i], 0); }

function trainGD(X: number[][], y: number[], lr = 0.01, epochs = 500) {
  const n = X.length; const m = X[0].length;
  let weights = Array(m).fill(0);
  let bias = 0;
  for (let e = 0; e < epochs; e++) {
    const preds = X.map(x => dot(x, weights) + bias);
    const errors = preds.map((p, i) => p - y[i]);
    // gradients
    const gradW = Array(m).fill(0);
    for (let j = 0; j < m; j++) {
      for (let i = 0; i < n; i++) gradW[j] += errors[i] * X[i][j];
      gradW[j] = (2 / n) * gradW[j];
    }
    const gradB = (2 / n) * errors.reduce((a, b) => a + b, 0);
    // update
    for (let j = 0; j < m; j++) weights[j] -= lr * gradW[j];
    bias -= lr * gradB;
    if (e % 100 === 0) console.log(`epoch ${e}`);
  }
  return {weights, bias};
}

function rmse(y: number[], preds: number[]) {
  const n = y.length; let s = 0;
  for (let i = 0; i < n; i++) s += Math.pow(y[i] - preds[i], 2);
  return Math.sqrt(s / n);
}

async function main() {
  const rows = loadCSV(CSV_PATH);
  const {X, y} = prepare(rows);
  const {X: Xn, means, stds} = normalize(X);
  const model = trainGD(Xn, y, 0.01, 1000);
  const preds = Xn.map(x => dot(x, model.weights) + model.bias);
  console.log('RMSE:', rmse(y, preds));
  const out = {model, means, stds};
  fs.writeFileSync('ml/ts_linear_model.json', JSON.stringify(out, null, 2));
  console.log('Saved TS linear model to ml/ts_linear_model.json');
}

main().catch(err => console.error(err));
