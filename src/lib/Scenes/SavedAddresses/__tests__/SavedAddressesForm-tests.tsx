import { SavedAddressesFormTestsQuery } from "__generated__/SavedAddressesFormTestsQuery.graphql"
import { Checkbox } from "lib/Components/Bidding/Components/Checkbox"
import { Input } from "lib/Components/Input/Input"
import { PhoneInput } from "lib/Components/PhoneInput/PhoneInput"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Button } from "palette"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { SavedAddressesFormContainer, SavedAddressesFormQueryRenderer } from "../SavedAddressesForm"

jest.unmock("react-relay")

describe(SavedAddressesFormQueryRenderer, () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = ({ addressId }: { addressId?: string }) => (
    <QueryRenderer<SavedAddressesFormTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query SavedAddressesFormTestsQuery {
          me {
            ...SavedAddressesForm_me
          }
        }
      `}
      render={({ props, error }) => {
        if (props?.me) {
          return <SavedAddressesFormContainer me={props.me} addressId={addressId} />
        } else if (error) {
          console.log(error)
        }
      }}
      variables={{}}
    />
  )
  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  it("render form screen", () => {
    const tree = renderWithWrappers(<TestRenderer />).root
    mockEnvironment.mock.resolveMostRecentOperation((operation) => {
      const result = MockPayloadGenerator.generate(operation, {
        Me: () => ({
          id: "some-id",
          phone: "9379992",
          addressConnection: {
            edges: [],
          },
        }),
      })
      return result
    })

    expect(tree.findAllByType(Input).length).toEqual(7)
    expect(tree.findAllByType(PhoneInput).length).toEqual(1)
    expect(tree.findAllByType(Checkbox).length).toEqual(1)
    expect(tree.findAllByType(Button).length).toEqual(1)
  })

  it("should display correct address data if it is Edit Address modal", () => {
    const tree = renderWithWrappers(<TestRenderer addressId="5861" />).root
    mockEnvironment.mock.resolveMostRecentOperation((operation) => {
      const result = MockPayloadGenerator.generate(operation, {
        Me: () => ({
          id: "some-id",
          phone: "9379992",
          addressConnection: {
            edges: [
              {
                node: {
                  id: "VXNlckFkZHJlc3M6NTg2MQ==",
                  internalID: "5861",
                  name: "George Testing",
                  addressLine1: "401 Broadway",
                  addressLine2: "26th Floor",
                  addressLine3: null,
                  city: "New York",
                  region: "New York",
                  postalCode: "NY 10013",
                  phoneNumber: "1293581028945",
                },
              },
            ],
          },
        }),
      })
      return result
    })
    const text = extractText(tree)

    expect(text).toContain("Edit Address")
  })
})