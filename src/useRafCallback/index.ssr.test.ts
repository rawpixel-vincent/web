import {renderHook} from '@testing-library/react-hooks/server';
import {describe, expect, it, vi} from 'vitest';
import {useRafCallback} from '../index.js';

describe('useRafCallback', () => {
	it('should be defined', () => {
		expect(useRafCallback).toBeDefined();
	});

	it('should render', () => {
		const {result} = renderHook(() => useRafCallback(() => {}));
		expect(result.error).toBeUndefined();
	});

	it('should return array of functions', () => {
		const {result} = renderHook(() => useRafCallback(() => {}));

		expect(result.current).toBeInstanceOf(Array);
		expect(result.current[0]).toBeInstanceOf(Function);
		expect(result.current[1]).toBeInstanceOf(Function);
	});

	it('should not do anything on returned functions invocation', () => {
		const spy = vi.fn();
		const {result} = renderHook(() => useRafCallback(spy));

		result.current[0]();
		result.current[1]();

		expect(spy).not.toHaveBeenCalled();
	});
});
