/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import { partToString, getResponseText } from './partUtils.js';
import { GenerateContentResponse, Part } from '@google/genai';

const mockResponse = (
  parts?: Array<{ text?: string; functionCall?: unknown }>,
): GenerateContentResponse => ({
  candidates: parts
    ? [{ content: { parts: parts as Part[], role: 'model' }, index: 0 }]
    : [],
  promptFeedback: { safetyRatings: [] },
  text: undefined,
  data: undefined,
  functionCalls: undefined,
  executableCode: undefined,
  codeExecutionResult: undefined,
});

describe('partUtils', () => {
  describe('partToString', () => {
    it('should return empty string for undefined or null', () => {
      // @ts-expect-error Testing invalid input
      expect(partToString(undefined)).toBe('');
      // @ts-expect-error Testing invalid input
      expect(partToString(null)).toBe('');
    });

    it('should return string input unchanged', () => {
      expect(partToString('hello')).toBe('hello');
    });

    it('should concatenate strings from an array', () => {
      expect(partToString(['a', 'b'])).toBe('ab');
    });

    it('should return text property when provided a text part', () => {
      expect(partToString({ text: 'hi' })).toBe('hi');
    });
  });

  describe('getResponseText', () => {
    it('should return null when no candidates exist', () => {
      const response = mockResponse(undefined);
      expect(getResponseText(response)).toBeNull();
    });

    it('should return concatenated text from first candidate', () => {
      const result = mockResponse([{ text: 'a' }, { text: 'b' }]);
      expect(getResponseText(result)).toBe('ab');
    });

    it('should ignore parts without text', () => {
      const result = mockResponse([{ functionCall: {} }, { text: 'hello' }]);
      expect(getResponseText(result)).toBe('hello');
    });

    it('should return null when candidate has no parts', () => {
      const result = mockResponse([]);
      expect(getResponseText(result)).toBeNull();
    });
  });
});
