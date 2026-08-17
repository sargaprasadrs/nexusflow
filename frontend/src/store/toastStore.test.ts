import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useToastStore } from './toastStore';

beforeEach(() => {
  vi.useFakeTimers();
  useToastStore.setState({ toasts: [] });
});

afterEach(() => {
  vi.useRealTimers();
});

describe('toastStore', () => {
  it('push adds a toast', () => {
    useToastStore.getState().push('success', 'Saved!');
    const toasts = useToastStore.getState().toasts;
    expect(toasts).toHaveLength(1);
    expect(toasts[0]).toMatchObject({ kind: 'success', message: 'Saved!' });
  });

  it('dismiss removes a specific toast', () => {
    useToastStore.getState().push('info', 'first');
    useToastStore.getState().push('error', 'second');
    const first = useToastStore.getState().toasts[0];
    useToastStore.getState().dismiss(first.id);
    const toasts = useToastStore.getState().toasts;
    expect(toasts).toHaveLength(1);
    expect(toasts[0].message).toBe('second');
  });

  it('auto-dismisses after 4 seconds', () => {
    useToastStore.getState().push('info', 'ephemeral');
    expect(useToastStore.getState().toasts).toHaveLength(1);
    vi.advanceTimersByTime(4000);
    expect(useToastStore.getState().toasts).toHaveLength(0);
  });
});
