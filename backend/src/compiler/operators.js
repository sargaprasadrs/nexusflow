import { bufferTime, filter, map, pipe } from 'rxjs';

// Operator library (Week 2, Chandra).
// Each operator consumes a telemetry point and returns a transformed point.

export const operators = {
  // Math operations: { op: 'add' | 'subtract' | 'multiply' | 'divide', field, value }
  math({ op, field, value }) {
    return map((point) => {
      const current = point.fields?.[field] ?? 0;
      let next;
      switch (op) {
        case 'add': next = current + value; break;
        case 'subtract': next = current - value; break;
        case 'multiply': next = current * value; break;
        case 'divide': next = value === 0 ? 0 : current / value; break;
        default: next = current;
      }
      return { ...point, fields: { ...point.fields, [field]: next } };
    });
  },

  // Filters: { field, operator: 'gt' | 'lt' | 'gte' | 'lte' | 'eq', value, threshold }
  filterCondition({ field, operator = 'gt', value, threshold }) {
    const targetVal = Number(value ?? threshold ?? 0);
    return filter((point) => {
      let f = field?.trim();
      let current = f ? point.fields?.[f] : undefined;

      // Fallback if field is unconfigured or aliased
      if (current === undefined && point.fields) {
        if (!f) {
          const firstKey = Object.keys(point.fields).find(
            (k) => typeof point.fields[k] === 'number'
          );
          if (firstKey) current = point.fields[firstKey];
        } else if (f === 'temp') {
          current = point.fields.temperature;
        } else if (f === 'temperature') {
          current = point.fields.temp;
        }
      }

      if (current === undefined || current === null) return false;
      const numCurrent = Number(current);
      switch (operator) {
        case 'gt': return numCurrent > targetVal;
        case 'gte': return numCurrent >= targetVal;
        case 'lt': return numCurrent < targetVal;
        case 'lte': return numCurrent <= targetVal;
        case 'eq': return numCurrent === targetVal;
        default: return false;
      }
    });
  },



  // Aggregation over a sliding window: { field, windowMs, aggregate: 'avg'|'sum'|'count'|'min'|'max' }.
  // Emits one aggregated point per window, tagged with the last point's timestamp.
  // Used by AggregationNode (Turbine Sensor -> Moving Average example).
  aggregation({ field, windowMs = 5000, aggregate = 'avg' }) {
    return pipe(
      bufferTime(windowMs),
      filter((points) => points.length > 0),
      map((points) => {
        const values = points
          .map((p) => p.fields?.[field])
          .filter((v) => typeof v === 'number');
        if (values.length === 0) return points[points.length - 1];
        const sum = values.reduce((a, b) => a + b, 0);
        let value;
        switch (aggregate) {
          case 'sum': value = sum; break;
          case 'count': value = values.length; break;
          case 'min': value = Math.min(...values); break;
          case 'max': value = Math.max(...values); break;
          default: value = sum / values.length; // 'avg'
        }
        const last = points[points.length - 1];
        return { ...last, fields: { ...last.fields, [field]: value } };
      })
    );
  },
};
