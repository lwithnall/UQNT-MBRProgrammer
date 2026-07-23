export const toolbox = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: 'Control',
      contents: [
        { kind: 'block', type: 'controls_if' },
        { kind: 'block', type: 'logic_compare' },
      ],
    },
    {
      kind: 'category',
      name: 'Logic',
      contents: [
        { kind: 'block', type: 'logic_compare' },
        { kind: 'block', type: 'logic_operation' },
        { kind: 'block', type: 'logic_boolean' },
      ],
    },
    {
      kind: 'category',
      name: 'Testers',
      contents: [
        { kind: 'block', type: 'ast_AnnAssignFull' },
        { kind: 'block', type: 'ast_AnnAssign' },
        // { kind: 'block', type: 'ast_Assert' },
        { kind: 'block', type: 'ast_Assign' },
        // { kind: 'block', type: 'ast_Attribute' },
        // { kind: 'block', type: 'ast_AugAssign' },
        // { kind: 'block', type: 'ast_BinOp' },
        // { kind: 'block', type: 'ast_BoolOp' },
        // { kind: 'block', type: 'ast_Break' },
        // { kind: 'block', type: 'ast_Call' },
        // { kind: 'block', type: 'ast_ClassDef' },
      ],
    },
  ],
};
