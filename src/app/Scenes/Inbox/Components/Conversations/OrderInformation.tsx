import { OrderInformation_artwork } from "__generated__/OrderInformation_artwork.graphql"
import { OrderInformation_order } from "__generated__/OrderInformation_order.graphql"
import { track as _track } from "app/utils/track"
import { Flex, Join, Separator, Spacer, Text } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface OrderInformationProps {
  artwork: OrderInformation_artwork
  order: OrderInformation_order
}

export const OrderInformation: React.FC<OrderInformationProps> = ({ artwork, order }) => {
  if (!order || !artwork) {
    return null
  }

  return (
    <>
      <Flex flexDirection="column" p={2} key="support-section">
        <Join separator={<Spacer my={0.5} />}>
          <Text variant="md" weight="medium" mb={0.5}>
            {`Order No. ${order.code}`}
          </Text>

          <>
            <Flex justifyContent="space-between" flexDirection="row">
              <Text color="black60">
                {order.lastOffer?.fromParticipant === "SELLER" ? "Seller's offer" : "Your offer"}
              </Text>
              <Text color="black60">{order.lastOffer?.amount}</Text>
            </Flex>

            <Flex justifyContent="space-between" flexDirection="row">
              <Text variant="xs" color="black60">
                List price
              </Text>
              <Text variant="xs" color="black60">
                {artwork.listPrice?.display}
              </Text>
            </Flex>
          </>

          <Flex justifyContent="space-between" flexDirection="row">
            <Text color="black60">Shipping</Text>
            <Text color="black60">{order.shippingTotal ?? "—"}</Text>
          </Flex>

          <Flex justifyContent="space-between" flexDirection="row">
            <Text color="black60">Tax</Text>
            <Text color="black60">{order.taxTotal ?? "—"}</Text>
          </Flex>

          <Flex justifyContent="space-between" flexDirection="row">
            <Text weight="medium">Total</Text>
            <Text weight="medium">{order.buyerTotal ?? ""}</Text>
          </Flex>
        </Join>
      </Flex>
      <Separator />
    </>
  )
}

export const OrderInformationFragmentContainer = createFragmentContainer(OrderInformation, {
  order: graphql`
    fragment OrderInformation_order on CommerceOrder {
      code
      shippingTotal(precision: 2)
      taxTotal(precision: 2)
      buyerTotal(precision: 2)
      ... on CommerceOfferOrder {
        lastOffer {
          amount(precision: 2)
          fromParticipant
        }
      }
    }
  `,
  artwork: graphql`
    fragment OrderInformation_artwork on Artwork {
      listPrice {
        ... on Money {
          display
        }
        ... on PriceRange {
          display
        }
      }
    }
  `,
})