/**
 * Parses and validates edge entries.
 * Accepts only uppercase directed edges in the format "A->B".
 * Self-loops are considered invalid, and duplicates are tracked once.
 *
 * @param {unknown[]} data - Raw edge-like entries from request payload.
 * @returns {{ validEdges: string[], invalidEntries: string[], duplicateEdges: string[] }}
 * Parsed valid edges plus invalid and duplicate collections.
 */
function parseAndValidate(data) {
  const validEdges = [];
  const invalidEntries = [];
  const duplicateEdges = [];

  const seenValidEdges = new Set();
  const seenDuplicateEdges = new Set();

  for (const rawEntry of data) {
    const entry = typeof rawEntry === 'string' ? rawEntry.trim() : String(rawEntry).trim();

    if (entry === '') {
      invalidEntries.push(entry);
      continue;
    }

    if (!/^[A-Z]->[A-Z]$/.test(entry)) {
      invalidEntries.push(entry);
      continue;
    }

    const from = entry[0];
    const to = entry[3];

    if (from === to) {
      invalidEntries.push(entry);
      continue;
    }

    if (!seenValidEdges.has(entry)) {
      seenValidEdges.add(entry);
      validEdges.push(entry);
      continue;
    }

    if (!seenDuplicateEdges.has(entry)) {
      seenDuplicateEdges.add(entry);
      duplicateEdges.push(entry);
    }
  }

  return {
    validEdges,
    invalidEntries,
    duplicateEdges,
  };
}

module.exports = {
  parseAndValidate,
};
