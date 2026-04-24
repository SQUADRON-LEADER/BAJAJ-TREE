const express = require('express');
const { parseAndValidate } = require('./validator');
const { buildGroups } = require('./graphBuilder');
const { buildHierarchy } = require('./treeBuilder');

const router = express.Router();

router.get('/bfhl', (req, res) => {
  return res.json({
    operation_code: 1,
    message: 'Use POST /bfhl with { data: [...] }',
  });
});

router.post('/bfhl', (req, res) => {
  try {
    if (!req.body || !Object.prototype.hasOwnProperty.call(req.body, 'data')) {
      return res.status(400).json({ error: "Missing 'data' field" });
    }

    const { data } = req.body;

    if (!Array.isArray(data)) {
      return res.status(400).json({ error: "'data' must be an array" });
    }

    if (data.length > 200) {
      return res.status(400).json({ error: 'Input exceeds maximum of 200 entries' });
    }

    const { validEdges, invalidEntries, duplicateEdges } = parseAndValidate(data);
    const groups = buildGroups(validEdges);
    const hierarchies = groups.map((group) => buildHierarchy(group));

    const treeHierarchies = hierarchies.filter((item) => !item.has_cycle);
    const cycleHierarchies = hierarchies.filter((item) => item.has_cycle);

    let largestTree = null;
    for (const tree of treeHierarchies) {
      if (!largestTree) {
        largestTree = tree;
        continue;
      }

      const isDeeper = tree.depth > largestTree.depth;
      const isSameDepthLexicographicallySmallerRoot =
        tree.depth === largestTree.depth && tree.root < largestTree.root;

      if (isDeeper || isSameDepthLexicographicallySmallerRoot) {
        largestTree = tree;
      }
    }

    const summary = {
      total_trees: treeHierarchies.length,
      total_cycles: cycleHierarchies.length,
      largest_tree_root: largestTree ? largestTree.root : null,
    };

    return res.json({
      is_success: true,
      user_id: 'aayush_24042026',
      email_id: 'aayush@example.com',
      college_roll_number: 'RA2111026010088',
      valid_edges: validEdges,
      invalid_entries: invalidEntries,
      duplicate_edges: duplicateEdges,
      groups: hierarchies,
      summary,
    });
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Unexpected server error',
    });
  }
});

module.exports = router;
