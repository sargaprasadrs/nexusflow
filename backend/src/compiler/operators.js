import { filter, map } from 'rxjs';

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

  // Filters: { field, operator: 'gt' | 'lt' | 'gte' | 'lte' | 'eq', value }
  filterCondition({ field, operator = 'gt', value }) {
    return filter((point) => {
      const current = point.fields?.[field];
      switch (operator) {
        case 'gt': return current > value;
        case 'gte': return current >= value;
        case 'lt': return current < value;
        case 'lte': return current <= value;
        case 'eq': return current === value;
        default: return false;
      }
    });
  },

  // TODO (Week 2): aggregation operators (moving average, sum, count, min, max)
  // using RxJS window/scan. The Turbine Sensor -> Moving Average example needs this.
};
