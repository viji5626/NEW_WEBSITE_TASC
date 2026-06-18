import fs from 'fs';

// Since the favicon is stretched, let's fix it by loading another available square image,
// or suggesting what the user should do. But since we have `public/brand/tasc-logo-dark.png`
// maybe we can just make it square. Actually, wait. Can I just write some base64 of a square transparent image if I don't have it?
// Let's first check if tasc-logo-dark.png is square!
