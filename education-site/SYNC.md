# Sync to serenest-edu

This folder is the world-class rebuild of **serenest.academy**.

The Cursor agent could not push to `Chiragambaliya/serenest-edu` (403). To publish:

```bash
# From a machine with write access to serenest-edu:
git clone https://github.com/Chiragambaliya/serenest-edu.git
cd serenest-edu
git checkout -b cursor/world-class-reorg-1e4f
# Replace contents with this education-site folder (keep .git)
cp -a /path/to/serenest/education-site/. ./
# remove SYNC.md if you don't want it in the edu repo
rm -f SYNC.md
git add -A
git commit -m "Rebuild Serenest Education as a world-class learning site"
git push -u origin cursor/world-class-reorg-1e4f
# Open PR into main, then deploy (Render/Netlify: npm run build → dist/)
```
