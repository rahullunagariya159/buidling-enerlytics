export const FloorplanPresets = [
  {
    label: "Rect",
    data: [],
  },
  {
    label: "L-Shape",
    data: [],
  },
];

// rect
FloorplanPresets[0].data[100] = {
  offset: 0,
  height: 2.5,
  floorplan: {
    corners: {
      "f90da5e3-9e0e-eba7-173d-eb0b071e838e": {
        x: -9,
        y: 6,
      },
      "da026c08-d76a-a944-8e7b-096b752da9ed": {
        x: 9,
        y: 6,
      },
      "4e3d65cb-54c0-0681-28bf-bddcc7bdb571": {
        x: 9,
        y: -6,
      },
      "71d4f128-ae80-3d58-9bd2-711c6ce6cdf2": {
        x: -9,
        y: -6,
      },
    },
    walls: [
      {
        corner1: "71d4f128-ae80-3d58-9bd2-711c6ce6cdf2",
        corner2: "f90da5e3-9e0e-eba7-173d-eb0b071e838e",
        interiorTexture: {
          url: "Blueprint3D-assets/rooms/textures/blank.png",
          stretch: true,
          scale: 0,
        },
        exteriorTexture: {
          url: "Blueprint3D-assets/rooms/textures/blank.png",
          stretch: true,
          scale: 0,
        },
      },
      {
        corner1: "f90da5e3-9e0e-eba7-173d-eb0b071e838e",
        corner2: "da026c08-d76a-a944-8e7b-096b752da9ed",
        interiorTexture: {
          url: "Blueprint3D-assets/rooms/textures/blank.png",
          stretch: true,
          scale: 0,
        },
        exteriorTexture: {
          url: "Blueprint3D-assets/rooms/textures/blank.png",
          stretch: true,
          scale: 0,
        },
      },
      {
        corner1: "da026c08-d76a-a944-8e7b-096b752da9ed",
        corner2: "4e3d65cb-54c0-0681-28bf-bddcc7bdb571",
        interiorTexture: {
          url: "Blueprint3D-assets/rooms/textures/blank.png",
          stretch: true,
          scale: 0,
        },
        exteriorTexture: {
          url: "Blueprint3D-assets/rooms/textures/blank.png",
          stretch: true,
          scale: 0,
        },
      },
      {
        corner1: "4e3d65cb-54c0-0681-28bf-bddcc7bdb571",
        corner2: "71d4f128-ae80-3d58-9bd2-711c6ce6cdf2",
        interiorTexture: {
          url: "Blueprint3D-assets/rooms/textures/blank.png",
          stretch: true,
          scale: 0,
        },
        exteriorTexture: {
          url: "Blueprint3D-assets/rooms/textures/blank.png",
          stretch: true,
          scale: 0,
        },
      },
    ],
    wallTextures: [],
    floorTextures: {},
    newFloorTextures: {},
  },
  items: [],
};

FloorplanPresets[0].data[101] = {
  offset: 2.5,
  height: 2.5,
  floorplan: {
    corners: {
      "a90da5e3-9e0e-eba7-173d-eb0b071e838e": {
        x: -9,
        y: 6,
      },
      "aa026c08-d76a-a944-8e7b-096b752da9ed": {
        x: 9,
        y: 6,
      },
      "ae3d65cb-54c0-0681-28bf-bddcc7bdb571": {
        x: 9,
        y: -6,
      },
      "a1d4f128-ae80-3d58-9bd2-711c6ce6cdf2": {
        x: -9,
        y: -6,
      },
    },
    walls: [
      {
        corner1: "a1d4f128-ae80-3d58-9bd2-711c6ce6cdf2",
        corner2: "a90da5e3-9e0e-eba7-173d-eb0b071e838e",
        interiorTexture: {
          url: "Blueprint3D-assets/rooms/textures/blank.png",
          stretch: true,
          scale: 0,
        },
        exteriorTexture: {
          url: "Blueprint3D-assets/rooms/textures/blank.png",
          stretch: true,
          scale: 0,
        },
      },
      {
        corner1: "a90da5e3-9e0e-eba7-173d-eb0b071e838e",
        corner2: "aa026c08-d76a-a944-8e7b-096b752da9ed",
        interiorTexture: {
          url: "Blueprint3D-assets/rooms/textures/blank.png",
          stretch: true,
          scale: 0,
        },
        exteriorTexture: {
          url: "Blueprint3D-assets/rooms/textures/blank.png",
          stretch: true,
          scale: 0,
        },
      },
      {
        corner1: "aa026c08-d76a-a944-8e7b-096b752da9ed",
        corner2: "ae3d65cb-54c0-0681-28bf-bddcc7bdb571",
        interiorTexture: {
          url: "Blueprint3D-assets/rooms/textures/blank.png",
          stretch: true,
          scale: 0,
        },
        exteriorTexture: {
          url: "Blueprint3D-assets/rooms/textures/blank.png",
          stretch: true,
          scale: 0,
        },
      },
      {
        corner1: "ae3d65cb-54c0-0681-28bf-bddcc7bdb571",
        corner2: "a1d4f128-ae80-3d58-9bd2-711c6ce6cdf2",
        interiorTexture: {
          url: "Blueprint3D-assets/rooms/textures/blank.png",
          stretch: true,
          scale: 0,
        },
        exteriorTexture: {
          url: "Blueprint3D-assets/rooms/textures/blank.png",
          stretch: true,
          scale: 0,
        },
      },
    ],
    wallTextures: [],
    floorTextures: {},
    newFloorTextures: {},
  },
  items: [],
};

// L-shape
FloorplanPresets[1].data[100] = {
  offset: 0,
  height: 2.5,
  floorplan: {
    corners: {
      "f90da5e3-9e0e-eba7-173d-eb0b071e838e": {
        x: -9,
        y: 6,
      },
      "da026c08-d76a-a944-8e7b-096b752da9ed": {
        x: 9,
        y: 6,
      },
      "71d4f128-ae80-3d58-9bd2-711c6ce6cdf2": {
        x: -9,
        y: -6,
      },
      "87e3eb6a-2d53-73a3-76d3-87352b752c4b": {
        x: 0,
        y: -6,
      },
      "de2846ad-c426-b12e-72d7-16d9abae5e9b": {
        x: 0,
        y: 0,
      },
      "4bb6755f-369d-bca0-c8cb-dd6645eaafdb": {
        x: 9,
        y: 0,
      },
    },
    walls: [
      {
        corner1: "71d4f128-ae80-3d58-9bd2-711c6ce6cdf2",
        corner2: "f90da5e3-9e0e-eba7-173d-eb0b071e838e",
        interiorTexture: {
          url: "Blueprint3D-assets/rooms/textures/blank.png",
          stretch: true,
          scale: 0,
        },
        exteriorTexture: {
          url: "Blueprint3D-assets/rooms/textures/blank.png",
          stretch: true,
          scale: 0,
        },
      },
      {
        corner1: "f90da5e3-9e0e-eba7-173d-eb0b071e838e",
        corner2: "da026c08-d76a-a944-8e7b-096b752da9ed",
        interiorTexture: {
          url: "Blueprint3D-assets/rooms/textures/blank.png",
          stretch: true,
          scale: 0,
        },
        exteriorTexture: {
          url: "Blueprint3D-assets/rooms/textures/blank.png",
          stretch: true,
          scale: 0,
        },
      },
      {
        corner1: "da026c08-d76a-a944-8e7b-096b752da9ed",
        corner2: "4bb6755f-369d-bca0-c8cb-dd6645eaafdb",
        interiorTexture: {
          url: "Blueprint3D-assets/rooms/textures/blank.png",
          stretch: true,
          scale: 0,
        },
        exteriorTexture: {
          url: "Blueprint3D-assets/rooms/textures/blank.png",
          stretch: true,
          scale: 0,
        },
      },
      {
        corner1: "87e3eb6a-2d53-73a3-76d3-87352b752c4b",
        corner2: "71d4f128-ae80-3d58-9bd2-711c6ce6cdf2",
        interiorTexture: {
          url: "Blueprint3D-assets/rooms/textures/blank.png",
          stretch: true,
          scale: 0,
        },
        exteriorTexture: {
          url: "Blueprint3D-assets/rooms/textures/blank.png",
          stretch: true,
          scale: 0,
        },
      },
      {
        corner1: "87e3eb6a-2d53-73a3-76d3-87352b752c4b",
        corner2: "de2846ad-c426-b12e-72d7-16d9abae5e9b",
        interiorTexture: {
          url: "Blueprint3D-assets/rooms/textures/blank.png",
          stretch: true,
          scale: 0,
        },
        exteriorTexture: {
          url: "Blueprint3D-assets/rooms/textures/blank.png",
          stretch: true,
          scale: 0,
        },
      },
      {
        corner1: "de2846ad-c426-b12e-72d7-16d9abae5e9b",
        corner2: "4bb6755f-369d-bca0-c8cb-dd6645eaafdb",
        interiorTexture: {
          url: "Blueprint3D-assets/rooms/textures/blank.png",
          stretch: true,
          scale: 0,
        },
        exteriorTexture: {
          url: "Blueprint3D-assets/rooms/textures/blank.png",
          stretch: true,
          scale: 0,
        },
      },
    ],
    wallTextures: [],
    floorTextures: {},
    newFloorTextures: {},
  },
  items: [],
};

FloorplanPresets[1].data[101] = {
  offset: 2.5,
  height: 2.5,
  floorplan: {
    corners: {
      "a90da5e3-9e0e-eba7-173d-eb0b071e838e": {
        x: -9,
        y: 6,
      },
      "aa026c08-d76a-a944-8e7b-096b752da9ed": {
        x: 9,
        y: 6,
      },
      "a1d4f128-ae80-3d58-9bd2-711c6ce6cdf2": {
        x: -9,
        y: -6,
      },
      "a7e3eb6a-2d53-73a3-76d3-87352b752c4b": {
        x: 0,
        y: -6,
      },
      "ae2846ad-c426-b12e-72d7-16d9abae5e9b": {
        x: 0,
        y: 0,
      },
      "abb6755f-369d-bca0-c8cb-dd6645eaafdb": {
        x: 9,
        y: 0,
      },
    },
    walls: [
      {
        corner1: "a1d4f128-ae80-3d58-9bd2-711c6ce6cdf2",
        corner2: "a90da5e3-9e0e-eba7-173d-eb0b071e838e",
        interiorTexture: {
          url: "Blueprint3D-assets/rooms/textures/blank.png",
          stretch: true,
          scale: 0,
        },
        exteriorTexture: {
          url: "Blueprint3D-assets/rooms/textures/blank.png",
          stretch: true,
          scale: 0,
        },
      },
      {
        corner1: "a90da5e3-9e0e-eba7-173d-eb0b071e838e",
        corner2: "aa026c08-d76a-a944-8e7b-096b752da9ed",
        interiorTexture: {
          url: "Blueprint3D-assets/rooms/textures/blank.png",
          stretch: true,
          scale: 0,
        },
        exteriorTexture: {
          url: "Blueprint3D-assets/rooms/textures/blank.png",
          stretch: true,
          scale: 0,
        },
      },
      {
        corner1: "aa026c08-d76a-a944-8e7b-096b752da9ed",
        corner2: "abb6755f-369d-bca0-c8cb-dd6645eaafdb",
        interiorTexture: {
          url: "Blueprint3D-assets/rooms/textures/blank.png",
          stretch: true,
          scale: 0,
        },
        exteriorTexture: {
          url: "Blueprint3D-assets/rooms/textures/blank.png",
          stretch: true,
          scale: 0,
        },
      },
      {
        corner1: "a7e3eb6a-2d53-73a3-76d3-87352b752c4b",
        corner2: "a1d4f128-ae80-3d58-9bd2-711c6ce6cdf2",
        interiorTexture: {
          url: "Blueprint3D-assets/rooms/textures/blank.png",
          stretch: true,
          scale: 0,
        },
        exteriorTexture: {
          url: "Blueprint3D-assets/rooms/textures/blank.png",
          stretch: true,
          scale: 0,
        },
      },
      {
        corner1: "a7e3eb6a-2d53-73a3-76d3-87352b752c4b",
        corner2: "ae2846ad-c426-b12e-72d7-16d9abae5e9b",
        interiorTexture: {
          url: "Blueprint3D-assets/rooms/textures/blank.png",
          stretch: true,
          scale: 0,
        },
        exteriorTexture: {
          url: "Blueprint3D-assets/rooms/textures/blank.png",
          stretch: true,
          scale: 0,
        },
      },
      {
        corner1: "ae2846ad-c426-b12e-72d7-16d9abae5e9b",
        corner2: "abb6755f-369d-bca0-c8cb-dd6645eaafdb",
        interiorTexture: {
          url: "Blueprint3D-assets/rooms/textures/blank.png",
          stretch: true,
          scale: 0,
        },
        exteriorTexture: {
          url: "Blueprint3D-assets/rooms/textures/blank.png",
          stretch: true,
          scale: 0,
        },
      },
    ],
    wallTextures: [],
    floorTextures: {},
    newFloorTextures: {},
  },
  items: [],
};
