/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type BidFlowSelectMaxBidRendererQueryVariables = {
    readonly saleArtworkID: string;
};
export type BidFlowSelectMaxBidRendererQueryResponse = {
    readonly sale_artwork: ({
    }) | null;
};



/*
query BidFlowSelectMaxBidRendererQuery(
  $saleArtworkID: String!
) {
  sale_artwork(id: $saleArtworkID) {
    ...SelectMaxBid_sale_artwork
    __id
  }
}

fragment SelectMaxBid_sale_artwork on SaleArtwork {
  increments {
    display
    cents
  }
  ...ConfirmBid_sale_artwork
  __id
}

fragment ConfirmBid_sale_artwork on SaleArtwork {
  sale {
    id
    __id
  }
  artwork {
    id
    title
    date
    artist_names
    __id
  }
  lot_label
  ...BidResult_sale_artwork
  __id
}

fragment BidResult_sale_artwork on SaleArtwork {
  current_bid {
    amount
    cents
    display
  }
  sale {
    live_start_at
    end_at
    id
    __id
  }
  __id
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "saleArtworkID",
    "type": "String!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "saleArtworkID",
    "type": "String!"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__id",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "display",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "cents",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "BidFlowSelectMaxBidRendererQuery",
  "id": "7f46a2740dff9d0dd3a42ab39acb60ea",
  "text": null,
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "BidFlowSelectMaxBidRendererQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "sale_artwork",
        "storageKey": null,
        "args": v1,
        "concreteType": "SaleArtwork",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "SelectMaxBid_sale_artwork",
            "args": null
          },
          v2
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "BidFlowSelectMaxBidRendererQuery",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "sale_artwork",
        "storageKey": null,
        "args": v1,
        "concreteType": "SaleArtwork",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "increments",
            "storageKey": null,
            "args": null,
            "concreteType": "BidIncrementsFormatted",
            "plural": true,
            "selections": [
              v3,
              v4
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "sale",
            "storageKey": null,
            "args": null,
            "concreteType": "Sale",
            "plural": false,
            "selections": [
              v5,
              v2,
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "live_start_at",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "end_at",
                "args": null,
                "storageKey": null
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "artwork",
            "storageKey": null,
            "args": null,
            "concreteType": "Artwork",
            "plural": false,
            "selections": [
              v5,
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "title",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "date",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "artist_names",
                "args": null,
                "storageKey": null
              },
              v2
            ]
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "lot_label",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "current_bid",
            "storageKey": null,
            "args": null,
            "concreteType": "SaleArtworkCurrentBid",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "amount",
                "args": null,
                "storageKey": null
              },
              v4,
              v3
            ]
          },
          v2
        ]
      }
    ]
  }
};
})();
(node as any).hash = 'dcde3e88d982c125ae7d58799e69d88e';
export default node;
