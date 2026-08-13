interface Point {
  x: number;
  y: number;
}

type Breakpoint = 'mobile' | 'tablet' | 'desktop';

export interface ImageConfig {
  dimensions: {
    [key in Breakpoint]: (viewport: Point) => { width: number; height: number };
  };
}

export const imageConfig: Record<string, ImageConfig> = {
  "usmans-reading-journal.webm": {
    dimensions: {
      desktop: (viewport) => ({ width: 500, height: 500 }),
      tablet: (viewport) => ({ width: 425, height: 425 }),
      mobile: (viewport) => ({ width: 226, height: 226 })
    }
  },
  "business-development-digest.webp": {
    dimensions: {
      desktop: (viewport) => ({ width: 500, height: 500 }),
      tablet: (viewport) => ({ width: 425, height: 425 }),
      mobile: (viewport) => ({ width: 226, height: 226 })
    }
  },
  "ai-patterns.webp": {
    dimensions: {
      desktop: (viewport) => ({ width: 500, height: 500 }),
      tablet: (viewport) => ({ width: 425, height: 425 }),
      mobile: (viewport) => ({ width: 226, height: 226 })
    }
  },
  "embedded-celeste.webp": {
    dimensions: {
      desktop: (viewport) => ({ width: 500, height: 500 }),
      tablet: (viewport) => ({ width: 425, height: 425 }),
      mobile: (viewport) => ({ width: 226, height: 226 })
    }
  },
  "fungrainy.webp": {
    dimensions: {
      desktop: (viewport) => ({ width: 800, height: 500 }),
      tablet: (viewport) => ({ width: 500, height: 425 }),
      mobile: (viewport) => ({ width: 361, height: 226 })
    }
  },

  "fungrainy2.webp": {
    dimensions: {
      desktop: (viewport) => ({ width: 800, height: 500 }),
      tablet: (viewport) => ({ width: 500, height: 425 }),
      mobile: (viewport) => ({ width: 361, height: 226 })
    }
  },
  "fungrainy3.webp": {
    dimensions: {
      desktop: (viewport) => ({ width: 800, height: 500 }),
      tablet: (viewport) => ({ width: 500, height: 425 }),
      mobile: (viewport) => ({ width: 361, height: 226 })
    }
  },
  "art11.webp": {
    dimensions: {
      desktop: (viewport) => ({ width: 850, height: 500 }),
      tablet: (viewport) => ({ width: 600, height: 425 }),
      mobile: (viewport) => ({ width: 384, height: 226 })
    }
  },
  "art1.webp": {
    dimensions: {
      desktop: (viewport) => ({ width: 500, height: 500 }),
      tablet: (viewport) => ({ width: 425, height: 425 }),
      mobile: (viewport) => ({ width: 226, height: 226 })
    }
  },
  "art2.webp": {
    dimensions: {
      desktop: (viewport) => ({ width: 500, height: 500 }),
      tablet: (viewport) => ({ width: 425, height: 425 }),
      mobile: (viewport) => ({ width: 226, height: 226 })
    }
  },
  "art3.webp": {
    dimensions: {
      desktop: (viewport) => ({ width: 500, height: 500 }),
      tablet: (viewport) => ({ width: 425, height: 425 }),
      mobile: (viewport) => ({ width: 226, height: 226 })
    }
  },
  "art4.webp": {
    dimensions: {
      desktop: (viewport) => ({ width: 500, height: 500 }),
      tablet: (viewport) => ({ width: 425, height: 425 }),
      mobile: (viewport) => ({ width: 226, height: 226 })
    }
  },
  "art5.webp": {
    dimensions: {
      desktop: (viewport) => ({ width: 500, height: 500 }),
      tablet: (viewport) => ({ width: 425, height: 425 }),
      mobile: (viewport) => ({ width: 226, height: 226 })
    }
  },
  "art7.webp": {
    dimensions: {
      desktop: (viewport) => ({ width: 500, height: 500 }),
      tablet: (viewport) => ({ width: 425, height: 425 }),
      mobile: (viewport) => ({ width: 226, height: 226 })
    }
  },
  "art8.webp": {
    dimensions: {
      desktop: (viewport) => ({ width: 850, height: 500 }),
      tablet: (viewport) => ({ width: 600, height: 425 }),
      mobile: (viewport) => ({ width: 384, height: 226 })
    }
  },
  "art9.webp": {
    dimensions: {
      desktop: (viewport) => ({ width: 500, height: 500 }),
      tablet: (viewport) => ({ width: 425, height: 425 }),
      mobile: (viewport) => ({ width: 226, height: 226 })
    }
  },
  "art10.webp": {
    dimensions: {
      desktop: (viewport) => ({ width: 500, height: 500 }),
      tablet: (viewport) => ({ width: 425, height: 425 }),
      mobile: (viewport) => ({ width: 226, height: 226 })
    }
  },
  "kind-feedback.webp": {
    dimensions: {
      desktop: (viewport) => ({ width: 1312, height: 500 }),
      tablet: (viewport) => ({ width: 1116, height: 425 }),
      mobile: (viewport) => ({ width: 594, height: 226 })
    }
  },
};