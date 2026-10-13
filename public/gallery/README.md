# Gallery Categories

Drag website photos into these folders:

- `events`
- `portraits`
- `creative`
- `commercial`

The site reads these folders automatically when it builds. After adding new
photos locally, run:

```bash
npm run gallery:optimize
npm run gallery:manifest
```

`gallery:optimize` makes web-sized copies in place, strips the hidden photo
data (capture date, camera, location), and keeps full-resolution backups in
`gallery-originals/`. The manifest still reads each photo's capture date from
those backups so shots from the same event are spread apart on the site.
