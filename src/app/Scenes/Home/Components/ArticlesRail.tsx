import { Spacer } from "@artsy/palette-mobile"
import { ArticlesRail_articlesConnection$data } from "__generated__/ArticlesRail_articlesConnection.graphql"
import { ArticleCardContainer } from "app/Components/ArticleCard"
import { SectionTitle } from "app/Components/SectionTitle"
import HomeAnalytics from "app/Scenes/Home/homeAnalytics"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { Flex } from "palette"
import { FlatList } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"

interface ArticlesRailProps {
  title: string
  articlesConnection: ArticlesRail_articlesConnection$data
  mb?: number
}

export const ArticlesRail: React.FC<ArticlesRailProps> = ({ title, articlesConnection, mb }) => {
  const articles = extractNodes(articlesConnection)

  if (!articles.length) {
    return null
  }

  const tracking = useTracking()

  return (
    <Flex mb={mb}>
      <Flex mx={2}>
        <SectionTitle
          title={title}
          onPress={() => {
            tracking.trackEvent(HomeAnalytics.articlesHeaderTapEvent())
            navigate("/articles")
          }}
        />
      </Flex>
      <Flex>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          ListHeaderComponent={() => <Spacer ml="2" />}
          ListFooterComponent={() => <Spacer ml="2" />}
          ItemSeparatorComponent={() => <Spacer ml="2" />}
          data={articles}
          keyExtractor={(item) => `${item.internalID}`}
          renderItem={({ item, index }) => (
            <ArticleCardContainer
              onPress={() => {
                const tapEvent = HomeAnalytics.articleThumbnailTapEvent(
                  item.internalID,
                  item.slug || "",
                  index
                )
                tracking.trackEvent(tapEvent)
              }}
              article={item}
            />
          )}
        />
      </Flex>
    </Flex>
  )
}

export const ArticlesRailFragmentContainer = createFragmentContainer(ArticlesRail, {
  articlesConnection: graphql`
    fragment ArticlesRail_articlesConnection on ArticleConnection {
      edges {
        node {
          internalID
          slug
          ...ArticleCard_article
        }
      }
    }
  `,
})
