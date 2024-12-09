# NextJS Hosting options

### Self Hosting

This seems to be probably the cheapest option, but is the most work by far. Very complicated. Probably too complicated for me. (Update: This seems like actually the best solution I have found.)

#### AWS

Complicated. I hate AWS

### SST

This seems similar to terraform. Requires AWS or Cloudflare from what I can tell

#### Coolify + VPS

This seems like it could work pretty well actually. Coolify is essentially an open source deployment service (like Vercel but free). They would allow for deployments of NextJs on a VPS and potentially also allow Supabase to be self hosted on the same machine. This would improve latency a TON...

This can easily be set up on Hetzner, which seems to have a better service for the price compared to Digital Ocean.

The service seems like it would not work super well with NextJs ISR, data caching, and some other features. Ultimately, I don't use those features, so I would assume it would be fine.

## Which cloud provider would be best?

Hetzner seems like it is cheaper than digital ocean, but is based in germany, which is super far from my users. It is also ranked a lot lower than some other providers.

Server Optima seems like it has good ratings, it is cheap, and has a datacenter in the US which would be close.

#### How does vps location affect latency?

It seems like anything overseas adds 150 ms to every request. That is a LOT. Vercel provides automatic edge servers, which is cool, but usage for Trakkup will be primarily based in the US, so for now I think it would be best to just get a local VPS.

## Minimum hosting specs

- Coolify
  - 2 vCPUs
  - 2GB Ram
  - 30GB storage
- Supabase
  - Current prod size: 0.161 GB
  - 0.5GB RAM
- Vercel/NextJS
  - Not really sure what is being used here
  - Seems like you should have at least 2 vCPUs and 4GB RAM

## Final Thoughts

It seems like you would be able to run a pretty efficient system by using coolify, self hosting NextJs (and maybe also supabase), and using the base plan from Server Optima for a VPS. This would cost $12/month.

In comparison to the free tier, this would be obviously more expensive. But the paid tier is a much better deal. If I could get it to work relatively easily, it would be WAY cheaper to host supabase and NextJs on the same VPS, and much faster as well.

I am not sure how scalable this would be, but ultimately, I don't think it would matter too much. In the process of migrating I could just make sure to build things in a way that would allow for easy switching of services. (hopefully this is not naive)
