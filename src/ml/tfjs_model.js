// Node TFJS prototype: trains a small model for carbon prediction using @tensorflow/tfjs-node
// Usage: npm install @tensorflow/tfjs-node csv-parse ; node src/ml/tfjs_model.js
const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');
const parse = require('csv-parse/lib/sync');

const CSV_PATH = 'lca_metals_dataset.csv';

async function loadData() {
  const txt = fs.readFileSync(CSV_PATH, 'utf8');
  const rows = parse(txt, { columns: true, skip_empty_lines: true });
  const features = [];
  const labels = [];
  for (const r of rows) {
    const f = [
      Number(r.recycling_rate || 0),
      Number(r.renewable_share || 0),
      Number(r.transport_km || 0),
      Number(r.mci || 0),
      Number(r.scrap_recovery_rate || 0)
    ];
    const y = Number(r.carbon_kgCO2_per_kg || 0);
    if (!Number.isFinite(y)) continue;
    features.push(f);
    labels.push(y);
  }
  return {features: tf.tensor2d(features), labels: tf.tensor2d(labels, [labels.length, 1])};
}

async function run() {
  const {features, labels} = await loadData();
  const model = tf.sequential();
  model.add(tf.layers.dense({units: 32, activation: 'relu', inputShape: [5]}));
  model.add(tf.layers.dense({units: 16, activation: 'relu'}));
  model.add(tf.layers.dense({units: 1}));
  model.compile({optimizer: tf.train.adam(0.01), loss: 'meanSquaredError'});

  await model.fit(features, labels, {epochs: 30, batchSize: 32, validationSplit: 0.1});
  await model.save('file://ml/tfjs_model');
  console.log('TFJS model saved to ml/tfjs_model');
}

run().catch(err => console.error(err));
