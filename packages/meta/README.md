# Prototype-YunHan.Meta

This is the metadata generator for [Prototype-YunHan](https://github.com/SharpDotNUT/Prototype-YunHan).

The code structure is still very messy, and will be standardized later.

To start generating metadata, please first

> Suggest to use `pnpm` to manage dependencies
> Please use `tsx` / `bun` / `deno` to directly execute the typescript script
> Make sure you have `curl` `7z` in your system path

```bash
# Install dependencies
# pnpm install
# now no need to install dependencies

# Get source metadata
bun ./fetch-source.ts

# Run all scripts to generate metadata
bun ./script/run_all.ts
```

The generated metadata will be in the `./data` directory.

```
-/ data
  - meta.json
  - _headers (for Cloudflare)
  - [part]/**.json
```

Please make sure `meta.json` will not be cached

```http
Cache-Control: no-cache, no-store, must-revalidate
Pragma: no-cache
Expires: 0
```
