import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { generateMessage } from 'mock-builders';
import { ChannelContext } from '../../../../context';
import { useRetryHandler } from '../useRetryHandler';

const retrySendMessage = jest.fn();

function renderUseRetryHandlerHook(customRetrySendMessage) {
  const wrapper = ({ children }) => (
    <ChannelContext.Provider
      value={{
        retrySendMessage,
      }}
    >
      {children}
    </ChannelContext.Provider>
  );
  const { result } = renderHook(() => useRetryHandler(customRetrySendMessage), {
    wrapper,
  });
  return result.current;
}

describe('useReactionHandler custom hook', () => {
  afterEach(jest.clearAllMocks);
  it('should generate a function that handles retrying a failed message', () => {
    const handleRetry = renderUseRetryHandlerHook();
    expect(typeof handleRetry).toBe('function');
  });

  it('should retry send message when called', () => {
    const handleRetry = renderUseRetryHandlerHook();
    const message = generateMessage();
    handleRetry(message);
    expect(retrySendMessage).toHaveBeenCalledWith(message);
  });

  it('should retry send message with custom retry send message handler when one is set', () => {
    const customRetrySendMessage = jest.fn();
    const handleRetry = renderUseRetryHandlerHook(customRetrySendMessage);
    const message = generateMessage();
    handleRetry(message);
    expect(retrySendMessage).not.toHaveBeenCalled();
    expect(customRetrySendMessage).toHaveBeenCalledWith(message);
  });

  it('should do nothing if message is not defined', () => {
    const handleRetry = renderUseRetryHandlerHook();
    handleRetry(undefined);
    expect(retrySendMessage).not.toHaveBeenCalled();
  });
});
