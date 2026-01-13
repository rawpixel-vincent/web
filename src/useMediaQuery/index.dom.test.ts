import {act, renderHook} from '@ver0/react-hooks-testing';
import {type Mock, afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {useMediaQuery} from '../index.js';
import {expectResultValue} from '../util/testing/test-helpers.js';

type MatchMediaMock = MediaQueryList & {
	matches: boolean;
	addEventListener: Mock;
	removeEventListener: Mock;
	dispatchEvent: Mock;
};

describe('useMediaQuery', () => {
	const matchMediaMock = vi.fn(
		(query: string) =>
			(query === '(orientation: unsupported)' ?
				undefined :
					{
						matches: false,
						media: query,
						onchange: null,
						addEventListener: vi.fn(),
						removeEventListener: vi.fn(),
						dispatchEvent: vi.fn(),
					}) as unknown as MatchMediaMock,
	);

	vi.stubGlobal('matchMedia', matchMediaMock);

	beforeEach(() => {
		matchMediaMock.mockClear();
	});
	afterEach(() => {
		matchMediaMock.mockClear();
	});

	it('should be defined', async () => {
		expect(useMediaQuery).toBeDefined();
	});

	it('should render', async () => {
		const {result} = await renderHook(() => useMediaQuery('max-width : 768px'));
		expect(result.error).toBeUndefined();
	});

	it('should return undefined and not thrown on unsupported when not enabled', async () => {
		const spy = vi.fn();
		vi.stubGlobal('console', {
			error: spy,
		});
		const {result, rerender, unmount} = await renderHook(() => useMediaQuery('max-width : 768px', {enabled: false}));
		const {result: result2, rerender: rerender2, unmount: unmount2} = await renderHook(() => useMediaQuery('(orientation: unsupported)', {enabled: false}));
		expect(spy.call.length === 0 || !spy.mock.calls.some((call: string[]) => call[0]?.includes?.('error: matchMedia'))).toBe(true);
		expect(result.error).toBeUndefined();
		expect(expectResultValue(result)).toBe(undefined);
		expect(result2.error).toBeUndefined();
		expect(expectResultValue(result2)).toBe(undefined);
		await rerender('max-width : 768px');
		await rerender2('(orientation: unsupported)');
		expect(spy.call.length === 0 || !spy.mock.calls.some((call: string[]) => call[0]?.includes?.('error: matchMedia'))).toBe(true);
		expect(result.error).toBeUndefined();
		expect(expectResultValue(result)).toBe(undefined);
		expect(expectResultValue(result2)).toBe(undefined);
		expect(result2.error).toBeUndefined();
		await unmount();
		await unmount2();
		expect(spy.call.length === 0 || !spy.mock.calls.some((call: string[]) => call[0]?.includes?.('error: matchMedia'))).toBe(true);
		expect(result.error).toBeUndefined();
		expect(expectResultValue(result)).toBe(undefined);
		expect(result2.error).toBeUndefined();
		expect(expectResultValue(result2)).toBe(undefined);
		vi.unstubAllGlobals();
		vi.stubGlobal('matchMedia', matchMediaMock);
	});

	it('should return undefined on first render, if initializeWithValue is false', async () => {
		const {result} = await renderHook(() => useMediaQuery('max-width : 768px', {initializeWithValue: false}));
		expect(result.all.length).toBe(2);
		expect(expectResultValue(result.all[0])).toBe(undefined);
		expect(expectResultValue(result.all[1])).toBe(false);
	});

	it('should return value on first render, if initializeWithValue is true', async () => {
		const {result} = await renderHook(() => useMediaQuery('max-width : 768px', {initializeWithValue: true}));
		expect(result.all.length).toBe(1);
		expect(expectResultValue(result.all[0])).toBe(false);
	});

	it('should return match state', async () => {
		const {result} = await renderHook(() => useMediaQuery('max-width : 768px'));
		expect(expectResultValue(result)).toBe(false);
	});

	it('should update state if query state changed', async () => {
		const {result} = await renderHook(() => useMediaQuery('max-width : 768px'));
		expect(expectResultValue(result)).toBe(false);

		expect(matchMediaMock.mock.results[0].type).toEqual('return');
		if (matchMediaMock.mock.results[0].type !== 'return') {
			return;
		}

		const mql = matchMediaMock.mock.results[0].value;
		mql.matches = true;

		await act(async () => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call
			return mql.addEventListener.mock.calls[0][1]();
		});
		expect(expectResultValue(result)).toBe(true);
	});

	it('several hooks tracking same rule must listen same mql', async () => {
		const {result: result1} = await renderHook(() => useMediaQuery('max-width : 768px'));
		const {result: result2} = await renderHook(() => useMediaQuery('max-width : 768px'));
		const {result: result3} = await renderHook(() => useMediaQuery('max-width : 768px'));
		expect(expectResultValue(result1)).toBe(false);
		expect(expectResultValue(result2)).toBe(false);
		expect(expectResultValue(result3)).toBe(false);

		expect(matchMediaMock.mock.results[0].type).toEqual('return');
		if (matchMediaMock.mock.results[0].type !== 'return') {
			return;
		}

		const mql = matchMediaMock.mock.results[0].value;
		mql.matches = true;

		await act(async () => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call
			return mql.addEventListener.mock.calls[0][1]();
		});
		expect(expectResultValue(result1.all[1])).toBe(true);
		expect(expectResultValue(result2.all[1])).toBe(true);
		expect(expectResultValue(result3.all[1])).toBe(true);
	});

	it('should unsubscribe from previous mql when query changed', async () => {
		const {result: result1} = await renderHook(() => useMediaQuery('max-width : 768px'));
		const {result: result2} = await renderHook(() => useMediaQuery('max-width : 768px'));
		const {result: result3, rerender: rerender3} = await renderHook(({query}) => useMediaQuery(query), {
			initialProps: {query: 'max-width : 768px'},
		});
		expect(expectResultValue(result1)).toBe(false);
		expect(expectResultValue(result2)).toBe(false);
		expect(expectResultValue(result3)).toBe(false);

		await rerender3({query: 'max-width : 760px'});

		expect(matchMediaMock).toHaveBeenCalledTimes(2);

		expect(matchMediaMock.mock.results[0].type).toEqual('return');
		if (matchMediaMock.mock.results[0].type !== 'return') {
			return;
		}

		const mql = matchMediaMock.mock.results[0].value;
		mql.matches = true;

		await act(async () => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call
			return mql.addEventListener.mock.calls[0][1]();

		});
		expect(expectResultValue(result1.all[1])).toBe(true);
		expect(expectResultValue(result2.all[1])).toBe(true);
		expect(expectResultValue(result3.all[1])).toBe(false);	
	});

	it('should unsubscribe from mql only when no hooks are awaiting such value', async () => {
		const {unmount: unmount1} = await renderHook(() => useMediaQuery('max-width : 768px'));
		const {unmount: unmount2} = await renderHook(() => useMediaQuery('max-width : 768px'));
		const {unmount: unmount3} = await renderHook(() => useMediaQuery('max-width : 768px'));

		expect(matchMediaMock.mock.results[0].type).toEqual('return');
		if (matchMediaMock.mock.results[0].type !== 'return') {
			return;
		}

		const mql = matchMediaMock.mock.results[0].value;
		expect(mql.removeEventListener).not.toHaveBeenCalled();
		await unmount3();
		expect(mql.removeEventListener).not.toHaveBeenCalled();
		await unmount2();
		expect(mql.removeEventListener).not.toHaveBeenCalled();
		await unmount1();
		expect(mql.removeEventListener).toHaveBeenCalledTimes(1);
	});

	it('should not throw when media query is not supported', async () => {
		const spy = vi.fn();
		vi.stubGlobal('console', {
			error: spy,
		});
		const {result, unmount, rerender} = await renderHook(() => useMediaQuery('(orientation: unsupported)', {initializeWithValue: true}));
		expect(spy).toHaveBeenCalled();
		expect(spy.mock.calls.some((call: string[]) => call[0]?.includes?.('error: matchMedia'))).toBe(true);
		expect(result.error).toBeUndefined();
		expect(expectResultValue(result)).toBe(undefined);
		await rerender();
		expect(expectResultValue(result.all[0])).toBe(undefined);
		await unmount();
		expect(expectResultValue(result)).toBe(undefined);
		expect(expectResultValue(result.all[1])).toBe(undefined);
		vi.unstubAllGlobals();
		vi.stubGlobal('matchMedia', matchMediaMock);
	});
});
