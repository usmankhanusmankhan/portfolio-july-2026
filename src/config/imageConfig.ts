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
      mobile: (viewport) => ({ width: 300, height: 300 })
    }
  },
  "business-development-digest.webp": {
    dimensions: {
      desktop: (viewport) => ({ width: 500, height: 500 }),
      tablet: (viewport) => ({ width: 425, height: 425 }),
      mobile: (viewport) => ({ width: 300, height: 300 })
    }
  },
  "ai-patterns.webp": {
    dimensions: {
      desktop: (viewport) => ({ width: 500, height: 500 }),
      tablet: (viewport) => ({ width: 425, height: 425 }),
      mobile: (viewport) => ({ width: 300, height: 300 })
    }
  },
  "embedded-celeste.webp": {
    dimensions: {
      desktop: (viewport) => ({ width: 500, height: 500 }),
      tablet: (viewport) => ({ width: 425, height: 425 }),
      mobile: (viewport) => ({ width: 300, height: 300 })
    }
  },
  "fungrainy.webp": {
    dimensions: {
      desktop: (viewport) => ({ width: 800, height: 500 }),
      tablet: (viewport) => ({ width: 500, height: 425 }),
      mobile: (viewport) => ({ width: 480, height: 300 })
    }
  },

  "fungrainy2.webp": {
    dimensions: {
      desktop: (viewport) => ({ width: 800, height: 500 }),
      tablet: (viewport) => ({ width: 500, height: 425 }),
      mobile: (viewport) => ({ width: 480, height: 300 })
    }
  },
  "fungrainy3.webp": {
    dimensions: {
      desktop: (viewport) => ({ width: 800, height: 500 }),
      tablet: (viewport) => ({ width: 500, height: 425 }),
      mobile: (viewport) => ({ width: 480, height: 300 })
    }
  },
  "art11.webp": {
    dimensions: {
      desktop: (viewport) => ({ width: 850, height: 500 }),
      tablet: (viewport) => ({ width: 600, height: 425 }),
      mobile: (viewport) => ({ width: 400, height: 235 })
    }
  },
  "art1.webp": {
    dimensions: {
      desktop: (viewport) => ({ width: 500, height: 500 }),
      tablet: (viewport) => ({ width: 425, height: 425 }),
      mobile: (viewport) => ({ width: 300, height: 300 })
    }
  },
  "art2.webp": {
    dimensions: {
      desktop: (viewport) => ({ width: 500, height: 500 }),
      tablet: (viewport) => ({ width: 425, height: 425 }),
      mobile: (viewport) => ({ width: 300, height: 300 })
    }
  },
  "art3.webp": {
    dimensions: {
      desktop: (viewport) => ({ width: 500, height: 500 }),
      tablet: (viewport) => ({ width: 425, height: 425 }),
      mobile: (viewport) => ({ width: 300, height: 300 })
    }
  },
  "art4.webp": {
    dimensions: {
      desktop: (viewport) => ({ width: 500, height: 500 }),
      tablet: (viewport) => ({ width: 425, height: 425 }),
      mobile: (viewport) => ({ width: 300, height: 300 })
    }
  },
  "art5.webp": {
    dimensions: {
      desktop: (viewport) => ({ width: 500, height: 500 }),
      tablet: (viewport) => ({ width: 425, height: 425 }),
      mobile: (viewport) => ({ width: 300, height: 300 })
    }
  },
  "art7.webp": {
    dimensions: {
      desktop: (viewport) => ({ width: 500, height: 500 }),
      tablet: (viewport) => ({ width: 425, height: 425 }),
      mobile: (viewport) => ({ width: 300, height: 300 })
    }
  },
  "art8.webp": {
    dimensions: {
      desktop: (viewport) => ({ width: 850, height: 500 }),
      tablet: (viewport) => ({ width: 600, height: 425 }),
      mobile: (viewport) => ({ width: 400, height: 235 })
    }
  },
  "art9.webp": {
    dimensions: {
      desktop: (viewport) => ({ width: 500, height: 500 }),
      tablet: (viewport) => ({ width: 425, height: 425 }),
      mobile: (viewport) => ({ width: 300, height: 300 })
    }
  },
  "art10.webp": {
    dimensions: {
      desktop: (viewport) => ({ width: 500, height: 500 }),
      tablet: (viewport) => ({ width: 425, height: 425 }),
      mobile: (viewport) => ({ width: 300, height: 300 })
    }
  },
  "kind-feedback.webp": {
    dimensions: {
      desktop: (viewport) => ({ width: 1312, height: 500 }),
      tablet: (viewport) => ({ width: 735, height: 280 }),
      mobile: (viewport) => ({ width: 420, height: 160 })
    }
  },
};