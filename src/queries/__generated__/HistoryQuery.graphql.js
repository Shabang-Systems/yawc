/**
 * @generated SignedSource<<74b49fcb2fe79d5fe53d4876e2faa240>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

var node = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "entity"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "project"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "run"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "specs"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "entityName",
    "variableName": "entity"
  },
  {
    "kind": "Variable",
    "name": "name",
    "variableName": "project"
  }
],
v2 = [
  {
    "kind": "Variable",
    "name": "name",
    "variableName": "run"
  }
],
v3 = {
  "alias": null,
  "args": [
    {
      "kind": "Variable",
      "name": "specs",
      "variableName": "specs"
    }
  ],
  "kind": "ScalarField",
  "name": "sampledHistory",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "HistoryQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Project",
        "kind": "LinkedField",
        "name": "project",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": (v2/*: any*/),
            "concreteType": "Run",
            "kind": "LinkedField",
            "name": "run",
            "plural": false,
            "selections": [
              (v3/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "HistoryQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Project",
        "kind": "LinkedField",
        "name": "project",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": (v2/*: any*/),
            "concreteType": "Run",
            "kind": "LinkedField",
            "name": "run",
            "plural": false,
            "selections": [
              (v3/*: any*/),
              (v4/*: any*/)
            ],
            "storageKey": null
          },
          (v4/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "89417caa380d6784fd59a00ffb9f0665",
    "id": null,
    "metadata": {},
    "name": "HistoryQuery",
    "operationKind": "query",
    "text": "query HistoryQuery(\n  $entity: String\n  $project: String\n  $run: String!\n  $specs: [JSONString!]!\n) {\n  project(name: $project, entityName: $entity) {\n    run(name: $run) {\n      sampledHistory(specs: $specs)\n      id\n    }\n    id\n  }\n}\n"
  }
};
})();

node.hash = "6e209f045326b2de13f977254d896dc9";

module.exports = node;
