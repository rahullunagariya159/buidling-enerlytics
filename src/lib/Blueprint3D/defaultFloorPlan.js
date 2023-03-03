export const DefaultFloorPlan = {
  layers: [],
  roof: {
    vertices: [],
    edges: [],
    faces: [],
  },
  obstacle: {
    offset: 0,
    height: 2.5,
    floorplan: {
      corners: {},
      walls: [],
    },
  },
  items: [],
};

DefaultFloorPlan.layers[100] = {
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
        thicknessDirection: 1,
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
        thicknessDirection: 1,
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
        thicknessDirection: 1,
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
        thicknessDirection: 1,
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

DefaultFloorPlan.layers[99] = {
  offset: -2.5,
  height: 2.5,
  floorplan: {
    corners: {
      "f978a5e3-9e0e-eba7-173d-eb0b071e838e": {
        x: -9,
        y: 6,
      },
      "da786c08-d76a-a944-8e7b-096b752da9ed": {
        x: 9,
        y: 6,
      },
      "4e7865cb-54c0-0681-28bf-bddcc7bdb571": {
        x: 9,
        y: -6,
      },
      "7178f128-ae80-3d58-9bd2-711c6ce6cdf2": {
        x: -9,
        y: -6,
      },
    },
    walls: [
      {
        corner1: "7178f128-ae80-3d58-9bd2-711c6ce6cdf2",
        corner2: "f978a5e3-9e0e-eba7-173d-eb0b071e838e",
        thicknessDirection: 1,
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
        corner1: "f978a5e3-9e0e-eba7-173d-eb0b071e838e",
        corner2: "da786c08-d76a-a944-8e7b-096b752da9ed",
        thicknessDirection: 1,
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
        corner1: "da786c08-d76a-a944-8e7b-096b752da9ed",
        corner2: "4e7865cb-54c0-0681-28bf-bddcc7bdb571",
        thicknessDirection: 1,
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
        corner1: "4e7865cb-54c0-0681-28bf-bddcc7bdb571",
        corner2: "7178f128-ae80-3d58-9bd2-711c6ce6cdf2",
        thicknessDirection: 1,
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

DefaultFloorPlan.layers[101] = {
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
        thicknessDirection: 1,
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
        thicknessDirection: 1,
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
        thicknessDirection: 1,
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
        thicknessDirection: 1,
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
