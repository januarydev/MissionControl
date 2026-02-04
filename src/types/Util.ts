export function GenerateTestData() {
  const data: [number, number, number][] = [];
  for (let pt = 0; pt < 100; ++pt) {
    data.push([(pt / 100.0) * 720 - 180, 15 * Math.cos((pt / 100.0) * Math.PI * 2), (pt / 100.0) * 2000000]);
  }
  return data;
}
