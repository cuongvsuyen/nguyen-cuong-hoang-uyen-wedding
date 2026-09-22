# Video-match effects

This pass was tuned against the supplied ~30.8 second mobile screen recording and the previously supplied HAR/client bundle.

Implemented behaviors:

- Envelope cover: 12 slow rising 囍 particles.
- Open click: soundtrack start + generated chime, seal break/ring, dragon/phoenix fly-forward.
- At 500 ms: 32 囍 particles burst from the center and the invitation card flies upward.
- At 1300 ms: cover is removed and the wedding page is revealed.
- Gallery: original 3D `cards` behavior, 1400 ms autoplay, 1100 ms card transition, perspective/rotateY/translateZ, 6 second pause after manual action, horizontal swipe on mobile.
- Gift: exact `dragon_phoenix_v3.webp` envelope artwork with two overlapping floating envelopes, sparkles and "Nhấn để mở" hint.
- Gift modal: mobile bottom-sheet presentation with peach header and dark-red body, vertically stacked QR cards; centered dialog on larger screens.
- Music button: peach floating circle with animated equalizer bars.
- Heavy scroll fade-in effects disabled because they were not visible in the supplied recording.

The pink Messenger bubble visible in the recording is a third-party widget and is intentionally not faked in this static reconstruction.
