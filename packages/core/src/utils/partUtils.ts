/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { GenerateContentResponse, PartListUnion } from '@google/genai';

export function partToString(part: PartListUnion): string {
  if (!part) {
    return '';
  }
  if (typeof part === 'string') {
    return part;
  }
  if (Array.isArray(part)) {
    return part.map(partToString).join('');
  }
  if ('text' in part) {
    return part.text ?? '';
  }
  return '';
}

export function getResponseText(
  response: GenerateContentResponse,
): string | null {
  if (response.candidates && response.candidates.length > 0) {
    const candidate = response.candidates[0];

    if (
      candidate.content &&
      candidate.content.parts &&
      candidate.content.parts.length > 0
    ) {
      return candidate.content.parts
        .filter((part) => part.text)
        .map((part) => part.text)
        .join('');
    }
  }
  return null;
}
