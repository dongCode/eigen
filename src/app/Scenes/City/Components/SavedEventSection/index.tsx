import { themeGet } from "@styled-system/theme-get"
import ChevronIcon from "app/Components/Icons/ChevronIcon"
import PinSavedOff from "app/Components/Icons/PinSavedOff"
import PinSavedOn from "app/Components/Icons/PinSavedOn"
import { BMWSponsorship } from "app/Scenes/City/CityBMWSponsorship"
import { navigate } from "app/system/navigation/navigate"
import { Track, track as _track } from "app/utils/track"
import { Box, Flex, Text } from "palette"
import { Component } from "react"
import { TouchableWithoutFeedback } from "react-native"
import styled from "styled-components/native"

export interface Props {
  data: any
  citySlug: string
  sponsoredContentUrl: string
}

const track: Track<Props, {}> = _track as any

@track()
export class SavedEventSection extends Component<any> {
  handleTap = () => {
    navigate(`/city-save/${this.props.citySlug}`)
  }

  // @TODO: Implement test for this component https://artsyproduct.atlassian.net/browse/LD-562
  render() {
    const { data, sponsoredContentUrl } = this.props
    const hasSaves = data.length > 0
    const hasSavesComponent = (
      <TouchableWithoutFeedback onPress={this.handleTap}>
        <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
          <Flex flexDirection="row" alignItems="center">
            <PinSavedOn pinWidth={30} pinHeight={30} />
            <Text variant="sm" weight="medium" ml={24}>
              {data.length > 1 ? data.length + " saved events" : data.length + " saved event"}
            </Text>
          </Flex>
          <ChevronIcon color="black100" />
        </Flex>
      </TouchableWithoutFeedback>
    )

    const hasNoSavesComponent = (
      <>
        <Flex flexDirection="row" alignItems="center">
          <PinSavedOff width={30} height={30} />
          <Flex ml={24}>
            <Text variant="sm" color="black60" weight="medium">
              No saved events
            </Text>
            <Text variant="sm" color="black60">
              Save a show to find it later
            </Text>
          </Flex>
        </Flex>
      </>
    )

    return (
      <>
        <Box mx={2} py={2}>
          <BMWSponsorship url={sponsoredContentUrl} logoText="Presented in partnership with BMW" />
        </Box>
        <Box mx={2} mb={2}>
          <SavedBox p={1}>{hasSaves ? hasSavesComponent : hasNoSavesComponent}</SavedBox>
        </Box>
      </>
    )
  }
}

const SavedBox = styled(Box)`
  border-radius: 2px;
  border-width: 1px;
  border-color: ${themeGet("colors.black30")};
`
