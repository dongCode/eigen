import { captureMessage } from "@sentry/react-native"
import { ImageCarousel_figures$data } from "__generated__/ImageCarousel_figures.graphql"
import { createGeminiUrl } from "app/Components/OpaqueImageView/createGeminiUrl"
import { useFeatureFlag } from "app/store/GlobalStore"
import { isPad } from "app/utils/hardware"
import { guardFactory } from "app/utils/types/guardFactory"
import { Flex } from "palette"
import { useMemo } from "react"
import { PixelRatio, Platform } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useScreenDimensions } from "shared/hooks"
import { ImageCarouselFullScreen } from "./FullScreen/ImageCarouselFullScreen"
import { ImageCarouselFullScreenAndroid } from "./FullScreen/ImageCarouselFullScreenAndroid"
import {
  ImageCarouselContext,
  ImageCarouselImage,
  ImageCarouselVideo,
  ImageDescriptor,
  useNewImageCarouselContext,
} from "./ImageCarouselContext"
import { ImageCarouselEmbedded } from "./ImageCarouselEmbedded"
import { IndicatorType, PaginationIndicator } from "./ImageCarouselPaginationIndicator"
import { fitInside } from "./geometry"

export interface CarouselImageDescriptor extends ImageDescriptor {
  imageVersions?: string[]
}
interface MappedImageDescriptor extends Pick<ImageDescriptor, "deepZoom"> {
  width: number
  height: number
  url: string
  largeImageURL: string | null
}

export interface ImageCarouselProps {
  /** CarouselImageDescriptor for when you want to display local images */
  staticImages?: CarouselImageDescriptor[]
  figures?: ImageCarousel_figures$data
  setVideoAsCover?: boolean
  cardHeight: number
  onImageIndexChange?: (imageIndex: number) => void
  paginationIndicatorType?: IndicatorType
  onImagePressed?: () => void
}

/**
 * ImageCarousel
 * NOTE: This component currently assumes it is being rendered at the full width of the screen.
 * To use it in places where this is not desirable it would need to take explicit width and height props
 * and use those to calculate a dynamic version of cardBoundingBox and perhaps other geometric quantities.
 */
export const ImageCarousel = (props: ImageCarouselProps) => {
  const { cardHeight, onImageIndexChange, setVideoAsCover } = props
  const { images, videos, disableDeepZoom } = useImageCarouselMedia(props)
  const context = useNewImageCarouselContext({
    images,
    videos,
    setVideoAsCover,
    onImageIndexChange,
  })

  context.fullScreenState.useUpdates()

  if (context.media.length === 0) {
    return null
  }

  return (
    <ImageCarouselContext.Provider value={context}>
      <Flex>
        <ImageCarouselEmbedded cardHeight={cardHeight} disableFullScreen={disableDeepZoom} />

        {context.media.length > 1 && (
          <PaginationIndicator indicatorType={props.paginationIndicatorType} />
        )}

        {context.fullScreenState.current !== "none" && <ImagesCarousel />}
      </Flex>
    </ImageCarouselContext.Provider>
  )
}

export const ImagesCarousel = () => {
  const enableAndroidImagesGallery = useFeatureFlag("AREnableAndroidImagesGallery")

  if (Platform.OS === "ios") {
    return <ImageCarouselFullScreen />
  }

  if (enableAndroidImagesGallery) {
    return <ImageCarouselFullScreenAndroid />
  }

  return null
}

export const ImageCarouselFragmentContainer = createFragmentContainer(ImageCarousel, {
  figures: graphql`
    fragment ImageCarousel_figures on ArtworkFigures @relay(plural: true) {
      ... on Image {
        __typename
        url
        largeImageURL: url(version: "larger")
        width
        height
        imageVersions
        isDefault
        deepZoom {
          image: Image {
            tileSize: TileSize
            url: Url
            format: Format
            size: Size {
              width: Width
              height: Height
            }
          }
        }
      }
      ... on Video {
        __typename
        # Unfortunately, in MP, these types are ambiguous within the union
        # so we have to alias them to avoid a conflict.
        videoWidth: width
        videoHeight: height
        playerUrl
      }
    }
  `,
})

const imageVersionsSortedBySize = ["normalized", "larger", "large", "medium", "small"] as const

export const isALocalImage = (imageUrl?: string | null) => {
  if (!imageUrl) {
    return false
  }
  const regex = new RegExp("^[.|/|asset://|file:///].*.[/.](gif|jpg|jpeg|bmp|webp|png)$")
  return regex.test(imageUrl)
}

// we used to rely on there being a "normalized" version of every image, but that
// turns out not to be the case, so in those rare situations we order the image versions
// by size and pick the largest avaialable. These large images will then be resized by
// gemini for the actual thumbnail we fetch.
function getBestImageVersionForThumbnail(imageVersions: readonly string[]) {
  for (const size of imageVersionsSortedBySize) {
    if (imageVersions.includes(size)) {
      return size
    }
  }

  if (!__DEV__) {
    captureMessage("No appropriate image size found for artwork (see breadcrumbs for artwork slug)")
  } else {
    console.warn("No appropriate image size found!")
  }

  // doesn't really matter what we return here, the gemini image url
  // will fail to load and we'll see a gray square. I haven't come accross an image
  // that this will happen for, but better safe than sorry.
  return "normalized"
}

const imageHasVersions = (image: CarouselImageDescriptor) => {
  return image.imageVersions && image.imageVersions.length
}

const useImageCarouselMedia = (
  props: ImageCarouselProps
): {
  images: ImageCarouselImage[]
  videos: ImageCarouselVideo[]
  disableDeepZoom: boolean | undefined
} => {
  const screenDimensions = useScreenDimensions()

  const embeddedCardBoundingBox = {
    width: screenDimensions.width,
    height: isPad() ? 460 : props.cardHeight,
  }

  const imageFigures = props.staticImages?.length
    ? props.staticImages
    : props.figures?.filter(guardFactory("__typename", "Image"))

  const videoFigures = props.figures?.filter(guardFactory("__typename", "Video"))

  const disableDeepZoom = imageFigures?.some((image) => isALocalImage(image.url))

  const images = useMemo(() => {
    const mappedImages = imageFigures ?? props.staticImages ?? []

    let result = mappedImages
      .map((image) => {
        const brokenImage = !image.height || !image.width || !image.url

        if (brokenImage) {
          return null
        }

        const { width, height } = fitInside(embeddedCardBoundingBox, image as MappedImageDescriptor)

        const url = (() => {
          if (isALocalImage(image.url) || !imageHasVersions(image as CarouselImageDescriptor)) {
            return image.url
          } else {
            return createGeminiUrl({
              imageURL: image.url.replace(
                ":version",
                getBestImageVersionForThumbnail(image.imageVersions as string[])
              ),
              // upscale to match screen resolution
              width: width * PixelRatio.get(),
              height: height * PixelRatio.get(),
            })
          }
        })()

        const largeImageURL = image.largeImageURL ?? image.url ?? null

        return {
          deepZoom: image?.deepZoom,
          height,
          largeImageURL,
          url,
          width,
        }
      })
      .filter((mappedImage) => {
        return Boolean(mappedImage)
      })

    if (!disableDeepZoom) {
      if (result.some((image) => !image?.deepZoom)) {
        const filteredResult = result.filter((image) => image?.deepZoom)
        if (filteredResult.length === 0) {
          result = [result[0]]
        } else {
          result = filteredResult
        }
      }
    }

    return result
  }, [props.staticImages, imageFigures]) as ImageCarouselImage[]

  // Map video props to the same format thats used for images
  const videos = useMemo(() => {
    if (!videoFigures) {
      return []
    }

    return videoFigures.map((video) => ({
      ...video,
      width: video.videoWidth,
      height: video.videoHeight,
      url: video.playerUrl,
    }))
  }, [videoFigures]) as ImageCarouselVideo[]

  return {
    disableDeepZoom,
    images: images ?? [],
    videos,
  }
}
