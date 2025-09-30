/* eslint-disable no-unused-vars */
"use client"

import * as React from "react"
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
  isInitialized: boolean
} & CarouselProps

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

function Carousel({
  orientation = "horizontal",
  opts,
  setApi,
  plugins,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & CarouselProps) {
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y",
      dragFree: false,
      containScroll: "trimSnaps",
      skipSnaps: false,
      inViewThreshold: 0.1,
      align: "start",
      slidesToScroll: 1,
      breakpoints: {
        "(max-width: 768px)": { slidesToScroll: 1 },
        "(min-width: 769px)": { slidesToScroll: 2 }
      }
    },
    plugins
  )
  const [canScrollPrev, setCanScrollPrev] = React.useState(false)
  const [canScrollNext, setCanScrollNext] = React.useState(false)
  const [isInitialized, setIsInitialized] = React.useState(false)

  const onSelect = React.useCallback((api: CarouselApi) => {
    if (!api) return
    setCanScrollPrev(api.canScrollPrev())
    setCanScrollNext(api.canScrollNext())
  }, [])

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev()
  }, [api])

  const scrollNext = React.useCallback(() => {
    api?.scrollNext()
  }, [api])

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault()
        scrollPrev()
      } else if (event.key === "ArrowRight") {
        event.preventDefault()
        scrollNext()
      }
    },
    [scrollPrev, scrollNext]
  )

  React.useEffect(() => {
    if (!api || !setApi) return
    setApi(api)
  }, [api, setApi])

  React.useEffect(() => {
    if (!api) return

    // Set initialization state
    const handleInit = () => {
      setIsInitialized(true)
      onSelect(api)
    }

    // Initial setup
    if (api.canScrollPrev() !== undefined) {
      handleInit()
    }

    api.on("init", handleInit)
    api.on("reInit", onSelect)
    api.on("select", onSelect)

    return () => {
      api?.off("init", handleInit)
      api?.off("reInit", onSelect)
      api?.off("select", onSelect)
    }
  }, [api, onSelect])

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api: api,
        opts,
        orientation:
          orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
        isInitialized,
      }}
    >
      <div
        onKeyDownCapture={handleKeyDown}
        className={cn(
          "relative group carousel-wrapper",
          !isInitialized && "carousel-loading",
          isInitialized && "carousel-ready",
          className
        )}
        role="region"
        aria-roledescription="carousel"
        data-slot="carousel"
        data-initialized={isInitialized}
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  )
}

function CarouselContent({ className, ...props }: React.ComponentProps<"div">) {
  const { carouselRef, orientation, isInitialized } = useCarousel()

  return (
    <div
      ref={carouselRef}
      className={cn(
        "relative w-full carousel-viewport",
        !isInitialized && "opacity-70",
        isInitialized && "opacity-100 transition-opacity duration-300"
      )}
      data-slot="carousel-content"
    >
      <div
        className={cn(
          "flex carousel-container-inner",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )}
        {...props}
      />
    </div>
  )
}

function CarouselItem({ className, ...props }: React.ComponentProps<"div">) {
  const { orientation } = useCarousel()

  return (
    <div
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
      {...props}
    />
  )
}

function CarouselPrevious({
  className,
  variant = "outline",
  size = "icon",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, scrollPrev, canScrollPrev, isInitialized } = useCarousel()
  const isRTL = typeof document !== 'undefined' && document.documentElement.dir === 'rtl';

  return (
    <Button
      data-slot="carousel-previous"
      variant={variant}
      size={size}
      className={cn(
        "absolute z-20 carousel-nav-btn carousel-nav-prev transition-all duration-200",
        "size-8 rounded-full shadow-md hover:shadow-lg",
        "bg-white/90 hover:bg-white border border-gray-200",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        orientation === "horizontal"
          ? `top-1/2 -translate-y-1/2 ${isRTL ? "right-4" : "left-4"}`
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        !isInitialized && "opacity-0 pointer-events-none",
        isInitialized && "opacity-100",
        className
      )}
      disabled={!canScrollPrev || !isInitialized}
      onClick={scrollPrev}
      {...props}
    >
      {isRTL ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
      <span className="sr-only">Previous slide</span>
    </Button>
  )
}

function CarouselNext({
  className,
  variant = "outline",
  size = "icon",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, scrollNext, canScrollNext, isInitialized } = useCarousel()
  const isRTL = typeof document !== 'undefined' && document.documentElement.dir === 'rtl';

  return (
    <Button
      data-slot="carousel-next"
      variant={variant}
      size={size}
      className={cn(
        "absolute z-20 carousel-nav-btn carousel-nav-next transition-all duration-200",
        "size-8 rounded-full shadow-md hover:shadow-lg",
        "bg-white/90 hover:bg-white border border-gray-200",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        orientation === "horizontal"
          ? `top-1/2 -translate-y-1/2 ${isRTL ? "left-4" : "right-4"}`
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        !isInitialized && "opacity-0 pointer-events-none",
        isInitialized && "opacity-100",
        className
      )}
      disabled={!canScrollNext || !isInitialized}
      onClick={scrollNext}
      {...props}
    >
      {isRTL ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
      <span className="sr-only">Next slide</span>
    </Button>
  )
}

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
}
