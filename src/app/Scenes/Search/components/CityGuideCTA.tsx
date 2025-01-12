import { Spacer } from "@artsy/palette-mobile"
import { SectionTitle } from "app/Components/SectionTitle"
import { BMWSponsorship } from "app/Scenes/City/CityBMWSponsorship"
import { navigate } from "app/system/navigation/navigate"
import { Flex, Text, useColor } from "palette"
import { Image, TouchableOpacity } from "react-native"

export const CityGuideCTA: React.FC = () => {
  const cityGuideMapImage = require("images/city-guide-bg.png")
  const color = useColor()
  return (
    <Flex>
      <SectionTitle title="Explore art on view" />
      <TouchableOpacity onPress={() => navigate("/local-discovery")}>
        <Flex
          style={{
            borderWidth: 1,
            borderColor: color("black10"),
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <Image source={cityGuideMapImage} style={{ width: "100%" }} />
          <Flex m={15}>
            <Text variant="sm" weight="medium">
              City Guide
            </Text>
            <Text variant="sm" style={{ color: color("black60") }}>
              Browse fairs and shows in different cities
            </Text>
            <Spacer mb={1} />
            <BMWSponsorship logoText="Presented in partnership with BMW" pressable={false} />
          </Flex>
        </Flex>
      </TouchableOpacity>
    </Flex>
  )
}
