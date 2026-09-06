import test from 'node:test';
import assert from 'node:assert/strict';
import { alertService } from './alertService.js';
import { Alert } from '../models/Alert.js';

test('alertService: deduplication returns existing alert within window', async () => {
  const originalFindOne = Alert.findOne;
  const mockAlert = {
    _id: 'alert-123',
    ruleId: 'rule-1',
    deviceId: 'sensor-99',
    status: 'open',
    triggeredAt: new Date(),
  };

  // Mock Alert.findOne to simulate existing open alert within cutoff window
  Alert.findOne = () => ({
    lean: async () => mockAlert,
  });

  try {
    const result = await alertService.create({
      ruleId: 'rule-1',
      deviceId: 'sensor-99',
      status: 'open',
      dedupWindowMs: 10000,
    });

    assert.equal(result._id, 'alert-123');
  } finally {
    Alert.findOne = originalFindOne;
  }
});

test('alertService: creates new alert when no duplicate exists', async () => {
  const originalFindOne = Alert.findOne;
  const originalCreate = Alert.create;

  Alert.findOne = () => ({
    lean: async () => null,
  });

  Alert.create = async (data) => ({
    _id: 'alert-456',
    ...data,
  });

  try {
    const result = await alertService.create({
      ruleId: 'rule-2',
      deviceId: 'sensor-100',
      status: 'open',
      dedupWindowMs: 10000,
    });

    assert.equal(result._id, 'alert-456');
    assert.equal(result.ruleId, 'rule-2');
  } finally {
    Alert.findOne = originalFindOne;
    Alert.create = originalCreate;
  }
});
