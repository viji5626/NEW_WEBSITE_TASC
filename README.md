# Image Persistence Solutions

The `public/brand` directory contains image binaries that might get corrupted or omitted during some git export pipelines or depending on how you export the project.
To fix this, we have provided an image backup script suite built into the repo.

## Restoring Broken / Missing Images

If your images are broken after cloning or moving the codebase, simply run the following command directly from the project root:

```sh
npm run restore-images
```

This acts as an automatic back-up mechanism. It reads from `brand-binaries.json` which is a 18MB Base-64 encoded JSON dictionary storing your pristine image binaries, and writes them back into the `public/brand/` folder correctly. 

## Packing Images (Making a new backup)

If you add new photos to the `public/brand` folder and would like to update your image backup cache so that you don't lose the new binary images, simply run:

```sh
npm run pack-images
```

This will rescan `public/brand` and encode all binaries back into `brand-binaries.json`. Keep `brand-binaries.json` committed to your Git repository or included in your ZIP to ensure your images follow you everywhere without risk of corruption.
