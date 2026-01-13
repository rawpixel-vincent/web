import {renderHookServer as renderHook} from '@ver0/react-hooks-testing';
import {describe, expect, it} from 'vitest';
import {useScreenOrientation} from '../index.js';
import {expectResultValue} from '../util/testing/test-helpers.js';

describe('useScreenOrientation', () => {
	it('should be defined', async () => {
		expect(useScreenOrientation).toBeDefined();
	});

	it('should render if initializeWithValue option is set to false', async () => {
		const {result} = await renderHook(() => useScreenOrientation({initializeWithValue: false}));
		expect(result.error).toBeUndefined();
	});

	it('should return undefined on first render, when not enabled and initializeWithValue is set to true', async () => {
		const {result} = await renderHook(() =>
			useScreenOrientation({initializeWithValue: true, enabled: false}));
		expect(result.error).toBeUndefined();
		expect(expectResultValue(result.all[0])).toBeUndefined();
	});
});
