# Gallery Categories

Drag website photos into these folders:

- `events`
- `portraits`
- `creative`

The site reads these folders automatically when it builds. After adding new
photos locally, run:

```bash
npm run gallery:optimize
npm run gallery:manifest
```

`gallery:optimize` makes web-sized copies in place and keeps full-resolution
backups in `gallery-originals/`.
