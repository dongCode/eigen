import React from "react"
import { RefreshControl } from "react-native"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"

import { SavedItemRow } from "lib/Components/Lists/SavedItemRow"
import Spinner from "lib/Components/Spinner"
import { ZeroState } from "lib/Components/States/ZeroState"

import { PAGE_SIZE } from "lib/data/constants"

import { Spacer } from "@artsy/palette"
import { Artists_me } from "__generated__/Artists_me.graphql"
import { StickyTabPageFlatList } from "lib/Components/StickyTabPage/StickyTabPageFlatList"
import { StickyTabPageScrollView } from "lib/Components/StickyTabPage/StickyTabPageScrollView"
import { extractNodes } from "lib/utils/extractNodes"

interface Props {
  me: Artists_me
  relay: RelayPaginationProp
}

interface State {
  fetchingMoreData: boolean
  refreshingFromPull: boolean
}

class Artists extends React.Component<Props, State> {
  state = {
    fetchingMoreData: false,
    refreshingFromPull: false,
  }

  loadMore = () => {
    if (!this.props.relay.hasMore() || this.props.relay.isLoading()) {
      return
    }

    this.setState({ fetchingMoreData: true })
    this.props.relay.loadMore(PAGE_SIZE, error => {
      if (error) {
        // FIXME: Handle error
        console.error("Artists/index.tsx", error.message)
      }
      this.setState({ fetchingMoreData: false })
    })
  }

  handleRefresh = () => {
    this.setState({ refreshingFromPull: true })
    this.props.relay.refetchConnection(PAGE_SIZE, error => {
      if (error) {
        // FIXME: Handle error
        console.error("Artists/index.tsx #handleRefresh", error.message)
      }
      this.setState({ refreshingFromPull: false })
    })
  }

  // @TODO: Implement test on this component https://artsyproduct.atlassian.net/browse/LD-563
  render() {
    const rows = extractNodes(this.props.me.followsAndSaves?.artists, node => node.artist!).map(
      ({ href, image, name, id }) => ({
        key: id,
        content: <SavedItemRow href={href!} image={image!} name={name!} />,
      })
    )

    if (rows.length === 0) {
      return (
        <StickyTabPageScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={<RefreshControl refreshing={this.state.refreshingFromPull} onRefresh={this.handleRefresh} />}
        >
          <ZeroState
            title="You haven’t followed any artists yet"
            subtitle="When you’ve found an artist you like, follow them to get updates on new works that become available."
          />
        </StickyTabPageScrollView>
      )
    }

    return (
      <StickyTabPageFlatList
        data={rows}
        onEndReached={this.loadMore}
        onEndReachedThreshold={0.2}
        refreshControl={<RefreshControl refreshing={this.state.refreshingFromPull} onRefresh={this.handleRefresh} />}
        style={{ paddingTop: 15, paddingHorizontal: 0 }}
        ItemSeparatorComponent={() => <Spacer mb="5px" />}
        ListFooterComponent={
          this.state.fetchingMoreData ? <Spinner style={{ marginTop: 20, marginBottom: 20 }} /> : null
        }
      />
    )
  }
}

export default createPaginationContainer(
  Artists,
  {
    me: graphql`
      fragment Artists_me on Me
        @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, cursor: { type: "String" }) {
        followsAndSaves {
          artists: artistsConnection(first: $count, after: $cursor) @connection(key: "Artists_artists") {
            edges {
              node {
                artist {
                  id
                  name
                  href
                  image {
                    url
                  }
                }
              }
            }
          }
        }
      }
    `,
  },
  {
    direction: "forward",
    getConnectionFromProps(props) {
      return props.me.followsAndSaves?.artists
    },
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount,
      }
    },
    getVariables(_props, pageInfo, _fragmentVariables) {
      return pageInfo
    },
    query: graphql`
      query ArtistsMeQuery($count: Int!, $cursor: String) {
        me {
          ...Artists_me @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)
