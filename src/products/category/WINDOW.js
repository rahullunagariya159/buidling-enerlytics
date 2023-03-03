const basePath = 'https://deploy-building-app.s3.eu-central-1.amazonaws.com/Blueprint3D-assets';
// const basePath = '/blueprint3D-assets';

const data = {
  category: "Window",
  styles: [
    {
      name: "Window Type 1",
      image: basePath + "/models/thumbnails/window-01.jpg",
      model: basePath + "/models/glb/window-01.glb",
      type: "3",
      morph: [
        { label: "Height", index: 0, min: 10, max: 100 },
        { label: "Width", index: 1, min: 10, max: 300 },
      ],
    },
    {
      name: "Window Type 2",
      image: basePath + "/models/thumbnails/window-02.jpg",
      model: basePath + "/models/glb/window-02.glb",
      type: "3",
      morph: [
        { label: "Height", index: 0, min: 10, max: 100 },
        { label: "Width", index: 1, min: 10, max: 300 },
      ],
    },
    {
      name: "Window Type 3",
      image: basePath + "/models/thumbnails/window-03.jpg",
      model: basePath + "/models/glb/window-03.glb",
      type: "3",
      morph: [
        { label: "Height", index: 0, min: 10, max: 100 },
        { label: "Width", index: 1, min: 10, max: 300 },
      ],
    },
  ],
};

export default data;
