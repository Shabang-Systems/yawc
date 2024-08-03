/**
 * @generated SignedSource<<4ab47edc55ed967cf9317604185b8abf>>
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
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": [
    {
      "kind": "Variable",
      "name": "name",
      "variableName": "run"
    }
  ],
  "concreteType": "Run",
  "kind": "LinkedField",
  "name": "run",
  "plural": false,
  "selections": [
    (v2/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "tags",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "displayName",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "createdAt",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "state",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "heartbeatAt",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "description",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "host",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "computeSeconds",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "config",
      "storageKey": null
    }
  ],
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "RunQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Project",
        "kind": "LinkedField",
        "name": "project",
        "plural": false,
        "selections": [
          (v3/*: any*/)
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
    "name": "RunQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Project",
        "kind": "LinkedField",
        "name": "project",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          (v2/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "81a2552acf6c314c91c7e457c2e313e1",
    "id": null,
    "metadata": {},
    "name": "RunQuery",
    "operationKind": "query",
    "text": "query RunQuery(\n  $entity: String\n  $project: String\n  $run: String!\n) {\n  project(name: $project, entityName: $entity) {\n    run(name: $run) {\n      id\n      tags\n      displayName\n      createdAt\n      state\n      heartbeatAt\n      description\n      host\n      computeSeconds\n      config\n    }\n    id\n  }\n}\n"
  }
};
})();

node.hash = "55b2f0b803c244e36ec9ece7d4b68bc8";

module.exports = node;
