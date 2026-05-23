// Journey "Story" station — ordered video scenes played when the
// train arrives at the story stop. The train is GATED here: it can't
// roll on to the next station until every scene has finished (see
// StoryStation.jsx + the gate logic in JourneyClient.jsx).
//
// ADD MORE SCENES: drop the file in public/assets/journey/story/ and
// append an entry below. They play top-to-bottom in this order.
//   caption — optional short line shown under the video frame.

export const STORY_SCENES = [
  { src: '/assets/journey/story/scene1.mp4', caption: '' },
  { src: '/assets/journey/story/scene2.mp4', caption: '' },
  { src: '/assets/journey/story/scene3.mp4', caption: '' },
  { src: '/assets/journey/story/scene4.mp4', caption: '' },
  { src: '/assets/journey/story/scene5.mp4', caption: '' },
  { src: '/assets/journey/story/scene6.mp4', caption: '' },
  { src: '/assets/journey/story/scene7.mp4', caption: '' },
  { src: '/assets/journey/story/scene8.mp4', caption: '' },
];
