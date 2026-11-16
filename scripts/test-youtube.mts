import assert from 'node:assert/strict';
import { parseYouTubeId, youtubeEmbedUrl, youtubeThumbnail } from '../src/lib/youtube.ts';

const ID = 'dQw4w9WgXcQ';
const ALT_ID = 'a_B-1234567';

const cases: Array<[string, string | null, string]> = [
  ['standard watch with www', ID, `https://www.youtube.com/watch?v=${ID}`],
  ['bare youtube.com watch', ID, `https://youtube.com/watch?v=${ID}`],
  ['mobile watch with extra params', ALT_ID, `https://m.youtube.com/watch?feature=share&v=${ALT_ID}&t=42s`],
  ['youtu.be with spaces and query params', ID, `  https://youtu.be/${ID}?si=track123&t=15  `],
  ['youtube.com embed URL', ID, `https://www.youtube.com/embed/${ID}?rel=0`],
  ['shorts URL with trailing slash', ID, `https://youtube.com/shorts/${ID}/`],
  ['live URL with query params', ID, `https://www.youtube.com/live/${ID}?feature=share`],
  ['legacy /v/ URL', ID, `https://youtube.com/v/${ID}`],
  ['youtube-nocookie embed URL', ID, `https://www.youtube-nocookie.com/embed/${ID}`],
  ['bare youtube-nocookie embed URL', ID, `https://youtube-nocookie.com/embed/${ID}`],
  ['foreign host (vimeo)', null, 'https://vimeo.com/12345678901'],
  ['foreign host spoofing /watch', null, `https://evil.com/watch?v=${ID}`],
  ['10-character ID rejected', null, 'https://www.youtube.com/watch?v=dQw4w9WgXc'],
  ['12-character ID rejected', null, 'https://youtu.be/dQw4w9WgXcQx'],
  ['empty string rejected', null, ''],
  ['whitespace rejected', null, '   '],
  ['garbage string rejected', null, 'not a valid url'],
  ['non-http protocol rejected', null, `ftp://youtube.com/watch?v=${ID}`],
];

for (const [label, expected, input] of cases) {
  assert.equal(parseYouTubeId(input), expected, `Failed case: ${label}`);
}

assert.equal(
  youtubeEmbedUrl(ID),
  `https://www.youtube-nocookie.com/embed/${ID}?rel=0&modestbranding=1&playsinline=1`
);
assert.equal(
  youtubeEmbedUrl(ID, { autoplay: true }),
  `https://www.youtube-nocookie.com/embed/${ID}?rel=0&modestbranding=1&playsinline=1&autoplay=1`
);
assert.equal(
  youtubeThumbnail(ID),
  `https://i.ytimg.com/vi/${ID}/hqdefault.jpg`
);

console.log(`All ${cases.length + 3} YouTube helper assertions passed.`);
