/**
 * Video service provider for vehicle showcase video clips
 */

const SAMPLE_VIDEOS = {
  default: 'https://cdn.coverr.co/videos/coverr-driving-a-car-on-a-highway-at-sunset-4693/1080p.mp4'
};

export const getVehicleVideoUrl = (make, model) => {
  return SAMPLE_VIDEOS.default;
};
